import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, type } = req.body;
  if (!prompt || !type) {
    res.status(400).json({ error: 'Missing prompt or type' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key not set' });
    return;
  }

  let systemInstruction = '';
  let requestBody: any;

  if (type === 'analyze') {
    systemInstruction = `You are an expert AI text analyzer with a friendly, mentor-like personality, like a helpful teacher reviewing a paper. Your purpose is to help users, especially seniors, learn to spot signs of AI-written text, as this can sometimes be used in scams or misinformation. Your tone should always be encouraging and educational, not alarming.\n\nAnalyze the user's provided text and respond in the required JSON format.\n- Your analysis should feel like you're adding helpful notes in the margin of a document.\n- For each observation, you MUST identify the specific part of the text (the 'quote') that demonstrates the trait. The quote must be an EXACT, verbatim substring of the original text. Do not make up quotes.\n- Provide a likelihood_score from 0 (definitely human) to 100 (definitely AI).\n- If the text looks human-written, give it a low score and return an empty list for 'observations'.\n- For the 'explanation' of each trait, explain it in simple, clear terms. For example, instead of saying "The text exhibits a formal register," you could say, "This part sounds a little stiff and formal, not like how most people talk. It's just something to keep an eye on!"`;
    requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    };
  } else if (type === 'sources') {
    systemInstruction = `Please provide a brief analysis of the following statement's accuracy. Keep the tone helpful and neutral. State whether the claim is generally supported, unsupported, or lacks evidence. Do not make definitive judgments, but rather summarize what sources suggest. In your analysis, please also comment on the general credibility of the sources you found (e.g., are they reputable news sites, scientific journals, or personal blogs?). Statement: "${prompt}"`;
    requestBody = {
      contents: [{ parts: [{ text: systemInstruction }] }],
      generationConfig: {
        tools: [{ googleSearch: {} }]
      }
    };
  } else if (type === 'explain') {
    systemInstruction = `You are a friendly writing coach. Your goal is to help users understand the positive, human-like qualities in a piece of text. Your tone should be positive and educational. Do not be critical.`;
    requestBody = {
      contents: [{ parts: [{ text: `Please explain why the following text sounds like it was written by a human. Focus on elements like personal voice, natural phrasing, use of slang or idiom, specific details, or any slight imperfections that make it feel authentic. Keep your explanation concise and encouraging. The text is: "${prompt}"` }] }],
      generationConfig: {
        systemInstruction
      }
    };
  } else {
    res.status(400).json({ error: 'Invalid type' });
    return;
  }

  try {
    const response = await fetch(GEMINI_API_URL + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();

    // Parse and format the response for the frontend
    if (type === 'analyze') {
      // Expecting a JSON string in data.candidates[0].content.parts[0].text
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No analysis result');
      const result = JSON.parse(text);
      res.status(200).json(result);
    } else if (type === 'sources') {
      const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const sources = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      res.status(200).json({ analysis, sources });
    } else if (type === 'explain') {
      const explanation = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      res.status(200).json({ explanation });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Gemini API', details: error instanceof Error ? error.message : error });
  }
}
