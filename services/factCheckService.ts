import { FactCheckResult } from '../types/factCheckTypes';

// Use the same proxy URL structure as the main service
const GEMINI_PROXY_URL = import.meta.env.VITE_GEMINI_PROXY_URL || 'http://localhost:5001/api/gemini';

export const getFactCheck = async (context: string, statement: string): Promise<FactCheckResult> => {
    const prompt = `
You are a meticulous and unbiased fact-checking expert AI. Your task is to analyze a highlighted statement within the context of a larger paragraph and determine its veracity.

**Context Paragraph:**
"""
${context}
"""

**Statement to Verify:**
"""
${statement}
"""

Please perform the following steps and return your analysis *only* in the specified JSON format.
1.  **Analyze Factuality**: Assess the statement's truthfulness based on reliable information.
2.  **Summarize Findings**: Provide a concise, neutral summary of your analysis.
3.  **Find Sources**: Identify at least 3-5 relevant and diverse sources to support your findings.
4.  **Rate Credibility**: For each source, assign a credibility rating and explain your reasoning. The rating scale is:
    - **Very High**: Peer-reviewed scientific journals, official government reports, direct data from established research institutions.
    - **High**: Reputable international news organizations (e.g., Reuters, Associated Press), major national newspapers with a history of journalistic integrity, academic books from reputable publishers.
    - **Medium**: Well-regarded encyclopedias (e.g., Wikipedia), established non-partisan organizations, major news magazines.
    - **Low**: Opinion blogs, advocacy websites, publications with a known strong political slant.
    - **Very Low**: Unsubstantiated social media posts, forums, personal websites with no clear expertise.

Your final output must be a single JSON object matching this exact format:

{
  "statement": "The exact statement being verified",
  "factuality": "One of: True, Likely True, Misleading, False, Likely False, Unverifiable",
  "summary": "Concise summary of findings",
  "sources": [
    {
      "title": "Source title",
      "url": "https://example.com",
      "summary": "Brief summary of what this source says",
      "credibility": {
        "rating": "One of: Very High, High, Medium, Low, Very Low",
        "explanation": "Why this source has this credibility rating"
      }
    }
  ]
}

Return only the JSON object, with no extra text before or after.
`;

    try {
        const response = await fetch(GEMINI_PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // The response should be a fact-check result, but let's check its format
        if (result.error) {
            throw new Error(result.error);
        }

        // If it's the standard AI detection format, we need to parse it differently
        if (result.likelihood_score !== undefined) {
            // This means we got an AI detection response instead of a fact-check
            // Let's return a default fact-check response
            return {
                statement: statement,
                factuality: 'Unverifiable',
                summary: 'Unable to fact-check this statement at the moment. The service returned an unexpected response format.',
                sources: []
            };
        }

        // If we got a direct fact-check result
        if (result.statement && result.factuality && result.summary && Array.isArray(result.sources)) {
            return result as FactCheckResult;
        }

        // Try to parse from raw text if it's a string response
        if (typeof result === 'string') {
            const jsonRegex = /\{[\s\S]*\}/;
            const jsonMatch = jsonRegex.exec(result);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.statement && parsed.factuality && parsed.summary && Array.isArray(parsed.sources)) {
                    return parsed as FactCheckResult;
                }
            }
        }

        // Fallback response
        return {
            statement: statement,
            factuality: 'Unverifiable',
            summary: 'Unable to properly parse the fact-check response from the AI service.',
            sources: []
        };

    } catch (error) {
        console.error("Failed to get fact check result:", error);
        throw new Error("Unable to fact-check the statement. Please try again later.");
    }
};