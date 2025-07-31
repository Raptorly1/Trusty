

import { AnalysisResult, SourceCheckResult, HumanTextExplanationResult } from '../types';

// Use dynamic proxy URL based on environment - same pattern as other services
const getProxyURL = (): string => {
    return window.location.hostname === 'localhost' 
        ? 'http://localhost:5001/api/gemini'
        : 'https://trusty-ldqx.onrender.com/api/gemini';
};

export async function analyzeTextForAI(text: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(getProxyURL(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: text }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch analysis from Gemini proxy');
    }
    const result = await response.json();
    return result as AnalysisResult;
  } catch (error) {
    console.error('Error analyzing text with Gemini proxy:', error);
    throw new Error('Could not analyze the text. The service may be temporarily unavailable.');
  }
}

// For now, stub out the other functions to avoid direct Gemini API calls
export async function findSourcesForText(text: string): Promise<SourceCheckResult> {
  try {
    const prompt = `Fact-check the following text. Return a JSON object with:\n- summary: a summary of your findings\n- sources: an array of objects with 'web.title' and 'web.uri' for each relevant web source you used.\nText: ${text}`;
    const response = await fetch(getProxyURL(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch source check from Gemini proxy');
    }
    const result = await response.json();
    // Accept both {summary, sources} and {analysis, sources}
    const analysis = result.summary || result.analysis || 'No summary available.';
    const sources = Array.isArray(result.sources) ? result.sources : [];
    return { analysis, sources };
  } catch (error) {
    console.error('Error fact-checking text with Gemini proxy:', error);
    throw new Error('Could not fact-check the text. The service may be temporarily unavailable.');
  }
}

export async function explainHumanText(text: string): Promise<HumanTextExplanationResult> {
  try {
    const prompt = `Explain why the following text sounds like it was written by a human. Return a JSON object with:\n- explanation: a detailed explanation string.\nText: ${text}`;
    const response = await fetch(getProxyURL(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch human explanation from Gemini proxy');
    }
    const result = await response.json();
    return result as HumanTextExplanationResult;
  } catch (error) {
    console.error('Error explaining human text with Gemini proxy:', error);
    throw new Error('Could not explain the text. The service may be temporarily unavailable.');
  }
}