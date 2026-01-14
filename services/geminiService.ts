

import { AnalysisResult, SourceCheckResult, HumanTextExplanationResult } from '../types';

const GEMINI_PROXY_URL = 'http://localhost:5001/api/gemini';

export async function analyzeTextForAI(text: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(GEMINI_PROXY_URL, {
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
  return { analysis: 'Source checking is temporarily unavailable.', sources: [] };
}

export async function explainHumanText(text: string): Promise<HumanTextExplanationResult> {
  return { explanation: 'Human text explanation is temporarily unavailable.' };
}