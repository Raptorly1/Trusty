

import { AnalysisResult, SourceCheckResult, HumanTextExplanationResult } from '../types';

// Calls the backend API route for AI analysis
export async function analyzeTextForAI(text: string): Promise<AnalysisResult> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text, type: 'analyze' })
  });
  if (!res.ok) throw new Error('Failed to analyze text');
  return res.json();
}

export async function findSourcesForText(text: string): Promise<SourceCheckResult> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text, type: 'sources' })
  });
  if (!res.ok) throw new Error('Failed to find sources');
  return res.json();
}

export async function explainHumanText(text: string): Promise<HumanTextExplanationResult> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text, type: 'explain' })
  });
  if (!res.ok) throw new Error('Failed to explain human text');
  return res.json();
}