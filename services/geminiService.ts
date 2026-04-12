import { AITextAnalysisResult, AIImageAnalysisResult } from '../types';

const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const PROXY_URL = isLocalhost
  ? 'http://127.0.0.1:10000/api/openrouter'
  : 'https://trusty-ldqx.onrender.com/api/openrouter';

let serverStatus: 'unknown' | 'warming' | 'ready' | 'error' = 'unknown';
let lastServerCheck = 0;

export const getServerStatus = () => serverStatus;

export const checkServerHealth = async (): Promise<{ status: 'warming' | 'ready' | 'error', estimatedWaitTime?: number }> => {
  const now = Date.now();

  if (now - lastServerCheck < 5000 && serverStatus !== 'unknown') {
    return {
      status: serverStatus as 'warming' | 'ready' | 'error',
      estimatedWaitTime: serverStatus === 'warming' ? 30 : undefined
    };
  }

  try {
    const healthUrl = PROXY_URL.replace('/api/openrouter', '/health');
    const response = await fetch(healthUrl, {
      method: 'GET'
    });

    lastServerCheck = now;

    if (response.ok) {
      serverStatus = 'ready';
      return { status: 'ready' };
    }

    if (response.status === 503) {
      serverStatus = 'warming';
      return { status: 'warming', estimatedWaitTime: 30 };
    }

    serverStatus = 'error';
    return { status: 'error' };
  } catch (error) {
    lastServerCheck = now;
    console.warn('Server health check failed:', error);

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      serverStatus = 'warming';
      return { status: 'warming', estimatedWaitTime: 45 };
    }

    serverStatus = 'error';
    return { status: 'error' };
  }
};

export const warmUpServer = async (): Promise<void> => {
  try {
    serverStatus = 'warming';
    await checkServerHealth();
  } catch (error) {
    console.warn('Server warm-up failed:', error);
  }
};

async function callOpenRouterProxy(body: Record<string, unknown>): Promise<any> {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Proxy API call failed with status ${response.status}`;

      if (response.status === 503) {
        serverStatus = 'warming';
        throw new Error('SERVER_WARMING');
      }

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        if (errorText) {
          errorMessage = `${errorMessage}: ${errorText}`;
        }
      }

      throw new Error(errorMessage);
    }

    serverStatus = 'ready';
    return response.json();
  } catch (error) {
    console.error('Error calling OpenRouter proxy:', error);

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      serverStatus = 'warming';
      throw new Error('SERVER_WARMING');
    }

    throw error;
  }
}

type JsonSchema = {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
  items?: any;
  minItems?: number;
  description?: string;
  enum?: string[];
};

const createResponseFormat = (name: string, schema: JsonSchema) => ({
  type: 'json_schema' as const,
  json_schema: {
    name,
    strict: true,
    schema,
  },
});

const jsonHealingPlugin = [{ id: 'response-healing' }];

const fileParserPdfPlugin = {
  id: 'file-parser',
  pdf: {
    engine: 'cloudflare-ai' as const,
  },
};

const openRouterWebSearchTool = {
  type: 'openrouter:web_search',
  parameters: {
  max_results: 8,
  max_total_results: 8,
    search_context_size: 'medium'
  }
};

const MISSING_TITLE_PLACEHOLDER = 'Title unavailable';

const extractResponseText = (response: any): string => {
  const content = response?.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return part.text;
        }
        return '';
      })
      .join('');
  }

  return response?.text || '';
};

const parseStructuredJson = (content: string): any => {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const candidate = fencedMatch?.[1]?.trim() ?? trimmed;
  return JSON.parse(candidate);
};

const extractSearchSources = (response: any): { web: { uri: string; title: string } }[] => {
  const annotations = response?.choices?.[0]?.message?.annotations;

  if (!Array.isArray(annotations)) {
    return [];
  }

  const sources = new Map<string, { web: { uri: string; title: string } }>();

  for (const annotation of annotations) {
    const citation = annotation?.url_citation ?? annotation?.citation ?? annotation;
    const url = citation?.url ?? citation?.source_url ?? citation?.uri;

    if (!url || typeof url !== 'string') {
      continue;
    }

    const title = citation?.title ?? citation?.page_title ?? citation?.site_title;

    if (!sources.has(url)) {
      sources.set(url, { web: { uri: url, title: title ?? '' } });
    }
  }

  return [...sources.values()];
};

export const generateMissingTitles = async (
  sources: { uri: string; title?: string }[]
): Promise<{ uri: string; title: string }[]> => {
  const needTitles = sources.filter(s => !s.title || s.title === 'Untitled Source');
  
  if (needTitles.length === 0) {
    return sources.map(s => ({ uri: s.uri, title: s.title || MISSING_TITLE_PLACEHOLDER }));
  }

  const pdfSources = needTitles.filter((source) => isPdfUrl(source.uri));
  const urls = needTitles.map(s => s.uri);
  const prompt = pdfSources.length > 0
    ? `For each source, return the exact title only if you are 100% confident it is correct.

Rules:
- PDFs are attached as file inputs in the same order as the PDF URLs in the list below.
- Never guess a title from the domain, URL slug, or topic alone.
- If you are not completely certain, set the title to "${MISSING_TITLE_PLACEHOLDER}" and confidence to 0.
- Prefer exactness over completeness.
- Keep the title short and verbatim when you do know it.

URLs:
${urls.map((u, i) => `${i + 1}. ${u}`).join('\n')}`
    : `For each URL, return the exact page/article/source title only if you are 100% confident it is correct.

Rules:
- Never guess a title from the domain, URL slug, or topic alone.
- If you are not completely certain, set the title to "${MISSING_TITLE_PLACEHOLDER}" and confidence to 0.
- Prefer exactness over completeness.
- Keep the title short and verbatim when you do know it.

URLs:
${urls.map((u, i) => `${i + 1}. ${u}`).join('\n')}`;

  try {
    const response = await callOpenRouterProxy({
      model: 'liquid/lfm-2.5-1.2b-thinking:free',
      messages: pdfSources.length > 0
        ? [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                ...pdfSources.map((source) => buildPdfInput(source.uri))
              ]
            }
          ]
        : [
            { role: 'user', content: prompt }
          ],
      ...(pdfSources.length > 0 ? { plugins: [fileParserPdfPlugin] } : {}),
      max_tokens: 256,
      _meta: {
        ...createResponseFormat('source_titles', {
          type: 'object',
          properties: {
            titles: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  url: { type: 'string' },
                  title: { type: 'string' },
                  confidence: {
                    type: 'number',
                    description: '100 only when the title is exact and you are fully confident.'
                  }
                },
                required: ['url', 'title', 'confidence']
              }
            }
          },
          required: ['titles']
        })
      }
    });

    const content = response?.choices?.[0]?.message?.content || '';
    const parsed = parseStructuredJson(content);
    const titleEntries: { url: string; title: string; confidence?: number }[] = parsed.titles || [];
    const titleMap = new Map<string, { title: string; confidence: number }>(
      titleEntries.map((t) => [t.url, { title: t.title, confidence: typeof t.confidence === 'number' ? t.confidence : 0 }])
    );

    return sources.map(s => ({
      uri: s.uri,
      title: (() => {
        const existingTitle = s.title && s.title !== 'Untitled Source' ? s.title : undefined;

        if (existingTitle) {
          return existingTitle;
        }

        const generated = titleMap.get(s.uri);

        if (generated && generated.confidence === 100 && generated.title.trim() && generated.title.trim() !== MISSING_TITLE_PLACEHOLDER) {
          return generated.title.trim();
        }

        return MISSING_TITLE_PLACEHOLDER;
      })()
    }));
  } catch (error) {
    console.warn('Failed to generate titles, using placeholder fallback:', error);
    return sources.map(s => ({
      uri: s.uri,
      title: s.title && s.title !== 'Untitled Source' ? s.title : MISSING_TITLE_PLACEHOLDER
    }));
  }
};

const PDF_URL_PATTERN = /\.pdf(?:[?#]|$)/i;

const isPdfUrl = (value: string): boolean => {
  try {
    const parsedUrl = new URL(value);
    return PDF_URL_PATTERN.test(parsedUrl.pathname) || parsedUrl.pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return PDF_URL_PATTERN.test(value);
  }
};

const inferPdfFilename = (pdfUrl: string): string => {
  try {
    const parsedUrl = new URL(pdfUrl);
    const lastPathSegment = parsedUrl.pathname.split('/').filter(Boolean).pop();
    if (lastPathSegment && PDF_URL_PATTERN.test(lastPathSegment)) {
      return lastPathSegment;
    }
  } catch {
    // Fall through to the default name below.
  }

  return 'document.pdf';
};

const buildPdfInput = (pdfUrl: string) => ({
  type: 'file' as const,
  file: {
    filename: inferPdfFilename(pdfUrl),
    fileData: pdfUrl,
  },
});

const textAnalysisSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    likelihood: { type: 'number', description: 'A score from 0 to 100 representing the likelihood the text is AI-generated.' },
    summary: { type: 'string', description: 'A brief, one-paragraph summary of the analysis.' },
    forAI: {
      type: 'array',
      description: 'Snippets and reasons supporting the conclusion that the text is AI-generated.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          snippet: { type: 'string' },
          reason: { type: 'string' }
        },
        required: ['snippet', 'reason']
      }
    },
    againstAI: {
      type: 'array',
      description: 'Snippets and reasons supporting the conclusion that the text is human-written.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          snippet: { type: 'string' },
          reason: { type: 'string' }
        },
        required: ['snippet', 'reason']
      }
    },
    wordCount: { type: 'integer' },
    readability: { type: 'string', description: "e.g., 'Easy to read', 'College level'" },
    complexWords: { type: 'integer' }
  },
  required: ['likelihood', 'summary', 'forAI', 'againstAI', 'wordCount', 'readability', 'complexWords']
};

const factCheckProcessorSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  description: 'Schema for structured fact-checking output with annotated summary and detailed source analysis.',
  properties: {
    annotatedSummary: {
      type: 'string',
      description: 'A detailed markdown-formatted summary with proper newlines (\\n). Include citations like [1], [2]. Use \\n\\n for paragraph breaks, \\n\\n### Header\\n\\n for section headers, and \\n* Item\\n for list items.'
    },
    sourceDetails: {
      type: 'array',
      description: 'List of sources used in the fact-check, each with its credibility rating and a short explanation.',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          url: {
            type: 'string',
            description: 'Direct link to the source.'
          },
          title: {
            type: 'string',
            description: 'Title of the source as it appears on the page.'
          },
          credibility: {
            type: 'string',
            enum: [
              'Very High',
              'High',
              'Medium High',
              'Medium',
              'Medium Low',
              'Low',
              'Very Low',
              'Unknown'
            ],
            description: 'Credibility rating for the source based on reliability, accuracy, relevance, and reputation.'
          },
          explanation: {
            type: 'string',
            description: 'One-sentence justification for the credibility rating.'
          }
        },
        required: ['url', 'title', 'credibility', 'explanation']
      }
    }
  },
  required: ['annotatedSummary', 'sourceDetails']
};

const imageAnalysisSchema: JsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    isLikelyAI: { type: 'boolean' },
    likelihood: { type: 'number', description: 'A score from 0-100 of AI likelihood.' },
    anomalies: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          reason: { type: 'string' },
          box: {
            type: 'object',
            additionalProperties: false,
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' }
            },
            required: ['x', 'y', 'width', 'height']
          }
        },
        required: ['reason', 'box']
      }
    }
  },
  required: ['isLikelyAI', 'likelihood', 'anomalies']
};

type Credibility =
  | 'Very High' | 'High' | 'Medium High' | 'Medium'
  | 'Medium Low' | 'Low' | 'Very Low' | 'Unknown';

export interface SourceCredibility {
  url: string;
  title: string;
  credibility: Credibility;
  explanation: string;
}

const CRED_ENUM: Credibility[] = [
  'Very High', 'High', 'Medium High', 'Medium',
  'Medium Low', 'Low', 'Very Low', 'Unknown'
];

const extractCitations = (text: string): number[] => {
  const matches = text.match(/\[(\d+)\]/g) ?? [];
  return matches.map((match) => Number(match.slice(1, -1)));
};

const validateResponse = (
  json: any,
  sourceCount: number
): { annotatedSummary: string; sourceDetails: SourceCredibility[] } => {
  if (!json || typeof json !== 'object') throw new Error('Non-object JSON.');
  const { annotatedSummary, sourceDetails } = json;

  if (typeof annotatedSummary !== 'string') throw new Error('Missing annotatedSummary.');
  if (!Array.isArray(sourceDetails) || sourceDetails.length !== sourceCount) {
    throw new Error(`sourceDetails must have exactly ${sourceCount} items.`);
  }

  sourceDetails.forEach((source: any, index: number) => {
    if (typeof source.url !== 'string') throw new Error(`sourceDetails[${index}].url missing.`);
    if (typeof source.title !== 'string') throw new Error(`sourceDetails[${index}].title missing.`);
    if (!CRED_ENUM.includes(source.credibility)) {
      throw new Error(`Invalid credibility at index ${index}: ${source.credibility}`);
    }
    if (typeof source.explanation !== 'string' || !source.explanation.trim()) {
      throw new Error(`sourceDetails[${index}].explanation missing.`);
    }
  });

  const citations = extractCitations(annotatedSummary);
  if (citations.some((n) => n < 1 || n > sourceCount)) {
    throw new Error('Annotated summary contains out-of-range citations.');
  }

  return { annotatedSummary, sourceDetails };
};

export const analyzeTextForAI = async (text: string): Promise<AITextAnalysisResult> => {
  const prompt = `Analyze the following text. Determine the likelihood it was generated by an AI. Provide specific snippets from the text as evidence for and against this conclusion. Also, provide a general analysis of its complexity and readability.

Text to analyze:
---
${text}
---

Your response MUST be in JSON format and adhere to the provided schema. Highlight specific phrases, not just single words.`;

  const response = await callOpenRouterProxy({
    model: 'openai/gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: createResponseFormat('textAnalysis', textAnalysisSchema),
    plugins: jsonHealingPlugin,
    temperature: 0.0,
  });

  const jsonResponse = parseStructuredJson(extractResponseText(response));
  return jsonResponse as AITextAnalysisResult;
};

export const factCheckClaim = async (
  claim: string,
  options: { pdfUrls?: string[] } = {}
): Promise<{ summary: string, sources: any[] }> => {
  const pdfUrls = [...new Set([claim, ...(options.pdfUrls ?? [])].filter(isPdfUrl))];
  const hasPdfInput = pdfUrls.length > 0;

  const response = await callOpenRouterProxy({
    model: 'deepseek/deepseek-v3.2',
    messages: [
      {
        role: 'system',
        content: 'You fact-check claims using live web research. Be concise, direct, and evidence-based.'
      },
      {
        role: 'user',
        content: hasPdfInput
          ? [
              {
                type: 'text',
                text: `Fact-check the following claim and provide a concise summary of your findings. Use the OpenRouter web search tool to find relevant sources. Treat the attached PDF as primary evidence. Claim: "${claim}"`
              },
              ...pdfUrls.map(buildPdfInput)
            ]
          : `Fact-check the following claim and provide a concise summary of your findings. Use the OpenRouter web search tool to find relevant sources. Claim: "${claim}"`
      }
    ],
    tools: [openRouterWebSearchTool],
    ...(hasPdfInput ? { plugins: [fileParserPdfPlugin] } : {}),
    temperature: 0.2,
  });

  return { summary: extractResponseText(response), sources: extractSearchSources(response) };
};

export const processFactCheckResults = async (
  summary: string,
  sources: { uri: string; title: string }[]
): Promise<{ annotatedSummary: string; sources: SourceCredibility[] }> => {
  const sourceList = sources
    .map((source, index) => `[${index + 1}] ${source.title || 'Untitled'}\nURL: ${source.uri}`)
    .join('\n\n');

  const prompt = `
You are a fact-checking assistant. Produce a single JSON object ONLY (no prose).
You will rewrite an initial summary and rate the credibility of each provided source.

RULES (follow exactly):
- Use inline numeric citations [1], [2], … that map to the sources below. Do not cite numbers outside 1..${sources.length}.
- Do NOT invent sources. Rate EXACTLY ${sources.length} sources, in the SAME ORDER as provided.
- For each source, include: url (use the exact URL given), title, credibility (one of ${CRED_ENUM.join(', ')}), and a one-sentence explanation.
- Output must conform to the provided schema; no extra keys.
- CRITICAL: Use proper markdown with NEWLINES in the annotatedSummary JSON string:
  * In JSON strings, use \\n for newlines (NOT actual line breaks in the JSON)
  * Separate paragraphs with \\n\\n (double newline)
  * Format headers as: \\n\\n### Header Text\\n\\n (with blank lines before and after)
  * Format lists as: \\n* First item\\n* Second item\\n (each on new line)
  * Use **bold** for key terms and *italics* for emphasis
  * Example format: "First sentence.\\n\\nWhile **caffeine** is a known **diuretic**, its effects are mild [1, 2].\\n\\n### Key Findings\\n\\n* **Point one** with details [3]\\n* **Point two** with more info [4]\\n\\nConcluding paragraph with citations [5, 6]."

CRITICAL: Evaluate each SOURCE INDIVIDUALLY based on the SPECIFIC PAGE/PAPER, not just the domain:
- For academic papers (ArXiv, journal articles): Consider the specific paper's methodology, peer-review status, author credentials, and relevance to the claim
- For news articles: Evaluate the specific article's sourcing, evidence presented, and journalistic standards  
- For government/organization pages: Assess the specific content's authority and relevance to the topic
- For research institutions: Consider the specific study/paper cited, not just the institution's general reputation

Examples of GOOD evaluations:
- "High - Peer-reviewed study from Nature with robust methodology and relevant findings on this specific topic"
- "Medium - ArXiv preprint with solid methodology but not yet peer-reviewed, from credible authors in the field"
- "Very High - Official CDC guidance document directly addressing this health claim with evidence citations"
- "Medium Low - News article lacks direct expert quotes and relies mainly on secondary sources"

Examples of BAD (domain-only) evaluations:
- "High - From a reputable university" (too general)
- "Very High - Government source" (not considering specific content)
- "Low - ArXiv paper" (ignoring paper quality)

Guidance for credibility (evaluate the SPECIFIC content, not just domain):
- Very High: Peer-reviewed studies with strong methodology relevant to the claim, official government guidance on the specific topic, authoritative reference works directly addressing the question
- High: Well-sourced news articles with expert quotes, pre-prints from credible researchers with solid methodology, established organization reports with evidence
- Medium High: News articles with some expert sourcing, research reports from recognized organizations, government pages with relevant but general information
- Medium: Basic news coverage with limited sourcing, organization statements without strong evidence backing, general informational pages
- Medium Low: Articles with weak sourcing, opinion pieces presented as fact, content with unclear authorship but from recognized domains
- Low: Blog posts, forums, content with no clear sourcing, outdated information, or clearly biased sources
- Very Low: Clearly unreliable sources, content contradicted by established evidence, sources with obvious conflicts of interest

Initial Summary:
---
${summary}
---

Sources (evaluate each specific page/paper/article individually):
---
${sourceList}
---

Schema (shape, not instructions):
{
  "annotatedSummary": string,
  "sourceDetails": [
    {
      "url": string,
      "title": string,
      "credibility": "${CRED_ENUM.join(' | ')}",
      "explanation": string
    }
  ]
}
`;

  const response = await callOpenRouterProxy({
    model: 'google/gemini-2.5-flash',
    messages: [
      {
        role: 'system',
        content: 'You are a fact-checking assistant. Return only valid JSON that follows the provided schema.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: createResponseFormat('factCheckResults', factCheckProcessorSchema),
    plugins: jsonHealingPlugin,
    temperature: 0.0
  });

  const parsed = parseStructuredJson(extractResponseText(response));
  const { annotatedSummary, sourceDetails } = validateResponse(parsed, sources.length);

  const normalizedDetails: SourceCredibility[] = sourceDetails.map((source, index) => ({
    url: sources[index].uri,
    title: sources[index].title || source.title,
    credibility: source.credibility,
    explanation: source.explanation
  }));

  return { annotatedSummary, sources: normalizedDetails };
};

export const analyzeImageForAI = async (base64Image: string, mimeType: string): Promise<AIImageAnalysisResult> => {
  const prompt = `
You are an image-forensics assistant. Return a SINGLE JSON object only (no prose) that follows the provided schema.

GOAL
- Assess whether an image is likely AI-generated.
- Provide a calibrated likelihood score (0–100).
- If you spot artifacts, list localized anomalies with short reasons and tight, normalized boxes.

STRONG RULES
- Do NOT guess: if evidence is weak or ambiguous, lower the score and explain uncertainty.
- Boxes must be normalized floats in [0,1] for x, y, width, height relative to the whole image.
- Only include anomalies if you can point to a concrete visual cue (e.g., extra finger joints, warped typography, repeating texture tiling, nonsensical reflections, lighting inconsistencies).
- Prefer localized, few high-quality boxes over many vague ones. No overlapping duplicates for the same issue.
- If you cannot confidently localize an artifact, omit the box and lower the overall likelihood.
- Do not use external knowledge about the subject or camera; base judgments on visible, image-internal evidence only.
- If no anomalies are found, return an empty array and a conservative likelihood.

CALIBRATION HEURISTICS (guidance, not output):
- 0–20: No clear artifacts; natural noise/optics consistent.
- 21–40: Mild peculiarities that can be photographic artifacts or compression.
- 41–60: Multiple subtle cues (texture repetition, minor hand/depth oddities).
- 61–80: Clear AI hallmarks (hands/teeth/text/ear geometry issues; mismatched shadows).
- 81–100: Strong, repeated AI signatures across regions (incoherent text, anatomy failures, impossible geometry).

OUTPUT
- Follow the schema exactly. Use concise, specific "reason" strings (≤120 chars).
- Keep numbers to reasonable precision (≤3 decimals).
`;

  const response = await callOpenRouterProxy({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
        ]
      }
    ],
    response_format: createResponseFormat('imageAnalysis', imageAnalysisSchema),
    plugins: jsonHealingPlugin,
    temperature: 0.0,
  });

  return parseStructuredJson(extractResponseText(response)) as AIImageAnalysisResult;
};

export const generateAudioSummary = async (text: string): Promise<string> => {
  const prompt = `You are a helpful assistant. Summarize the following text into a short, spoken-word-style script of no more than 3 sentences. The summary should be friendly and easy to understand.

Text to summarize:
---
${text}
---

Spoken summary:`;

  const response = await callOpenRouterProxy({
    model: 'openai/gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that writes short, natural spoken summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.5
  });

  return extractResponseText(response);
};
