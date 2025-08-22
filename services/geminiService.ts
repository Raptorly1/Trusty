import { Type } from "@google/genai";
import { AITextAnalysisResult, AnnotationType, FeedbackResult, AIImageAnalysisResult } from '../types';

const PROXY_URL = 'https://trusty-ldqx.onrender.com/api/gemini';

// Server status tracking
let serverStatus: 'unknown' | 'warming' | 'ready' | 'error' = 'unknown';
let lastServerCheck = 0;
const SERVER_CHECK_INTERVAL = 30000; // 30 seconds

export const getServerStatus = () => serverStatus;

/**
 * Check if the Render server is ready by calling the health endpoint
 */
export const checkServerHealth = async (): Promise<{ status: 'warming' | 'ready' | 'error', estimatedWaitTime?: number }> => {
  const now = Date.now();
  
  // Don't check too frequently
  if (now - lastServerCheck < 5000 && serverStatus !== 'unknown') {
    return { 
      status: serverStatus as 'warming' | 'ready' | 'error',
      estimatedWaitTime: serverStatus === 'warming' ? 30 : undefined
    };
  }
  
  try {
    const healthUrl = PROXY_URL.replace('/api/gemini', '/health');
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    lastServerCheck = now;
    
    if (response.ok) {
      serverStatus = 'ready';
      return { status: 'ready' };
    } else if (response.status === 503) {
      // Service unavailable - likely warming up
      serverStatus = 'warming';
      return { status: 'warming', estimatedWaitTime: 30 };
    } else {
      serverStatus = 'error';
      return { status: 'error' };
    }
  } catch (error) {
    lastServerCheck = now;
    console.warn('Server health check failed:', error);
    
    // If it's a network error, the server might be warming up
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      serverStatus = 'warming';
      return { status: 'warming', estimatedWaitTime: 45 };
    }
    
    serverStatus = 'error';
    return { status: 'error' };
  }
};

/**
 * Warm up the server by making a simple request
 */
export const warmUpServer = async (): Promise<void> => {
  try {
    serverStatus = 'warming';
    await checkServerHealth();
  } catch (error) {
    console.warn('Server warm-up failed:', error);
  }
};

/**
 * A helper function to call the backend proxy which in turn calls the Gemini API.
 * @param endpoint The Gemini SDK method to call (e.g., 'generateContent').
 * @param params The parameters for the SDK method.
 * @returns The response from the Gemini API, as returned by the proxy.
 */
async function callGeminiProxy(endpoint: string, params: any): Promise<any> {
  // Non-blocking approach: always attempt the request, handle warming gracefully
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, params }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Proxy API call failed with status ${response.status}`;
      
      // Check if this is a server warming issue
      if (response.status === 503) {
        serverStatus = 'warming';
        throw new Error('SERVER_WARMING');
      }
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
        if (errorText) {
          errorMessage = `${errorMessage}: ${errorText}`;
        }
      }
      throw new Error(errorMessage);
    }

    // Server is working, mark as ready
    serverStatus = 'ready';
    return response.json();
  } catch (error) {
    console.error('Error calling Gemini proxy:', error);
    
    // If it's a network error, the server might be warming up
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      serverStatus = 'warming';
      throw new Error('SERVER_WARMING');
    }
    
    // Re-throw the error to be caught by the calling function's try/catch block
    throw error;
  }
}


const textAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    likelihood: { type: Type.NUMBER, description: "A score from 0 to 100 representing the likelihood the text is AI-generated." },
    summary: { type: Type.STRING, description: "A brief, one-paragraph summary of the analysis." },
    forAI: {
      type: Type.ARRAY,
      description: "Snippets and reasons supporting the conclusion that the text is AI-generated.",
      items: {
        type: Type.OBJECT,
        properties: {
          snippet: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    againstAI: {
      type: Type.ARRAY,
      description: "Snippets and reasons supporting the conclusion that the text is human-written.",
      items: {
        type: Type.OBJECT,
        properties: {
          snippet: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    wordCount: { type: Type.INTEGER },
    readability: { type: Type.STRING, description: "e.g., 'Easy to read', 'College level'" },
    complexWords: { type: Type.INTEGER }
  }
};

export const analyzeTextForAI = async (text: string): Promise<AITextAnalysisResult> => {
  const prompt = `Analyze the following text. Determine the likelihood it was generated by an AI. Provide specific snippets from the text as evidence for and against this conclusion. Also, provide a general analysis of its complexity and readability.

Text to analyze:
---
${text}
---

Your response MUST be in JSON format and adhere to the provided schema. Highlight specific phrases, not just single words.`;

  const params = {
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: textAnalysisSchema,
      temperature: 0.2,
    }
  };
  
  const response = await callGeminiProxy('generateContent', params);
  const jsonResponse = JSON.parse(response.text);
  return jsonResponse as AITextAnalysisResult;
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.OBJECT,
            properties: {
                strengths: { type: Type.STRING, description: "A paragraph summarizing the strengths of the writing." },
                improvements: { type: Type.STRING, description: "A paragraph summarizing the main areas for improvement." }
            }
        },
        annotations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    snippet: { type: Type.STRING, description: "The exact text snippet being commented on." },
                    feedback: { type: Type.STRING, description: "Constructive feedback about the snippet." },
                    suggestion: { type: Type.STRING, description: "An optional, concrete suggestion for rewriting the snippet." },
                    type: { type: Type.STRING, enum: Object.values(AnnotationType), description: "The category of feedback." }
                }
            }
        }
    }
};

export const getFeedbackForText = async (text: string): Promise<FeedbackResult> => {
    const prompt = `Act as a helpful and encouraging writing coach. Analyze the following text for clarity, logic, evidence, and tone. Provide a summary of strengths and weaknesses. Then, provide specific, actionable annotations on snippets of the text. For each annotation, suggest a potential improvement if applicable. Identify any factual claims that might need verification.

Text to analyze:
---
${text}
---

Your response MUST be in JSON format and adhere to the provided schema. Ensure snippets are precise.`;
    
    const params = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: feedbackSchema,
            temperature: 0.5,
        }
    };
    
    const response = await callGeminiProxy('generateContent', params);
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse as FeedbackResult;
};


export const factCheckClaim = async (claim: string): Promise<{ summary: string, sources: any[] }> => {
  const params = {
    model: "gemini-2.5-flash",
    contents: `Fact-check the following claim and provide a summary of your findings. Use Google Search to find relevant sources. Claim: "${claim}"`,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
    },
  };
    
    const response = await callGeminiProxy('generateContent', params);
    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    return { summary, sources };
};

const factCheckProcessorSchema = {
  type: Type.OBJECT,
  description: "Schema for structured fact-checking output with annotated summary and detailed source analysis.",
  properties: {
    annotatedSummary: {
      type: Type.STRING,
      description: "A detailed summary of the fact-check findings. Include inline citations like [1], [2] that correspond to sources listed in `sourceDetails`."
    },
    sourceDetails: {
      type: Type.ARRAY,
      description: "List of sources used in the fact-check, each with its credibility rating and a short explanation.",
      minItems: 1,
      items: {
        type: Type.OBJECT,
        properties: {
          url: { 
            type: Type.STRING,
            description: "Direct link to the source." 
          },
          title: { 
            type: Type.STRING,
            description: "Title of the source as it appears on the page." 
          },
          credibility: { 
            type: Type.STRING, 
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
            description: "Credibility rating for the source based on reliability, accuracy, relevance, and reputation."
          },
          explanation: { 
            type: Type.STRING,
            description: "One-sentence justification for the credibility rating."
          }
        },
        required: ["url", "title", "credibility", "explanation"]
      }
    }
  },
  required: ["annotatedSummary", "sourceDetails"]
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
  'Very High','High','Medium High','Medium',
  'Medium Low','Low','Very Low','Unknown'
];

const extractCitations = (text: string): number[] => {
  const m = text.match(/\[(\d+)\]/g) ?? [];
  return m.map(x => Number(x.slice(1, -1)));
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

  sourceDetails.forEach((s, i) => {
    if (typeof s.url !== 'string') throw new Error(`sourceDetails[${i}].url missing.`);
    if (typeof s.title !== 'string') throw new Error(`sourceDetails[${i}].title missing.`);
    if (!CRED_ENUM.includes(s.credibility)) {
      throw new Error(`Invalid credibility at index ${i}: ${s.credibility}`);
    }
    if (typeof s.explanation !== 'string' || !s.explanation.trim()) {
      throw new Error(`sourceDetails[${i}].explanation missing.`);
    }
  });

  // Citations must be within [1..N]
  const cites = extractCitations(annotatedSummary);
  if (cites.some(n => n < 1 || n > sourceCount)) {
    throw new Error('Annotated summary contains out-of-range citations.');
  }

  return { annotatedSummary, sourceDetails };
};

export const processFactCheckResults = async (
  summary: string,
  sources: { uri: string; title: string }[]
): Promise<{ annotatedSummary: string; sources: SourceCredibility[] }> => {
  const sourceList = sources
    .map((s, i) => `[${i + 1}] ${s.title || 'Untitled'}\nURL: ${s.uri}`)
    .join('\n\n');

  const prompt = `
You are a fact-checking assistant. Produce a single JSON object ONLY (no prose).
You will rewrite an initial summary and rate the credibility of each provided source.

RULES (follow exactly):
- Use inline numeric citations [1], [2], … that map to the sources below. Do not cite numbers outside 1..${sources.length}.
- Do NOT invent sources. Rate EXACTLY ${sources.length} sources, in the SAME ORDER as provided.
- For each source, include: url (use the exact URL given), title, credibility (one of ${CRED_ENUM.join(', ')}), and a one-sentence explanation.
- Output must conform to the provided schema; no extra keys.

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
      "credibility": "${CRED_ENUM.join('" | "')}",
      "explanation": string
    }
  ]
}
`;

  const params = {
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: factCheckProcessorSchema, // keep your strict schema
      temperature: 0.0
    }
  };

  const response = await callGeminiProxy('generateContent', params);

  let parsed: any;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error('Model did not return valid JSON.');
  }

  // Validate and also enforce original URLs in case the model “fixes” them
  const { annotatedSummary, sourceDetails } = validateResponse(parsed, sources.length);

  // Ensure URLs/titles exactly match the provided list order
  const normalizedDetails: SourceCredibility[] = sourceDetails.map((s, i) => ({
    url: sources[i].uri,               // override with ground truth
    title: sources[i].title || s.title,
    credibility: s.credibility,
    explanation: s.explanation
  }));

  return { annotatedSummary, sources: normalizedDetails };
};


export const analyzeImageForAI = async (base64Image: string, mimeType: string): Promise<AIImageAnalysisResult> => {
    const imagePart = { inlineData: { data: base64Image, mimeType } };
    
    const imageAnalysisSchema = {
        type: Type.OBJECT,
        properties: {
            isLikelyAI: { type: Type.BOOLEAN },
            likelihood: { type: Type.NUMBER, description: "A score from 0-100 of AI likelihood." },
            anomalies: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        reason: { type: Type.STRING },
                        box: {
                            type: Type.OBJECT,
                            properties: {
                                x: { type: Type.NUMBER },
                                y: { type: Type.NUMBER },
                                width: { type: Type.NUMBER },
                                height: { type: Type.NUMBER }
                            }
                        }
                    }
                }
            }
        }
    };

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


    const params = {
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: imageAnalysisSchema,
            temperature: 0.0,
        }
    };
    
    const response = await callGeminiProxy('generateContent', params);
    return JSON.parse(response.text) as AIImageAnalysisResult;
};

export const generateAudioSummary = async (text: string): Promise<string> => {
  const prompt = `You are a helpful assistant. Summarize the following text into a short, spoken-word-style script of no more than 3 sentences. The summary should be friendly and easy to understand.

Text to summarize:
---
${text}
---

Spoken summary:`;

  const params = {
      model: 'gemini-2.5-flash',
      contents: prompt
  };
  
  const response = await callGeminiProxy('generateContent', params);
  return response.text;
};
