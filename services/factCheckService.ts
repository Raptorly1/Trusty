import { FactCheckResult } from '../types/factCheckTypes';

// Use dynamic proxy URL based on environment - same pattern as other services
const getProxyURL = (): string => {
    return window.location.hostname === 'localhost' 
        ? 'http://localhost:5001/api/gemini'
        : 'https://trusty-ldqx.onrender.com/api/gemini';
};

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

Please perform the following steps and return your analysis in the exact JSON format specified below.

1. **Analyze Factuality**: Assess the statement's truthfulness based on reliable information.
2. **Summarize Findings**: Provide a concise, neutral summary of your analysis.
3. **Find Sources**: Identify at least 3-5 relevant and diverse sources to support your findings.
4. **Rate Credibility**: For each source, assign a credibility rating using this scale:
   - **Very High**: Peer-reviewed scientific journals, official government reports, direct data from established research institutions
   - **High**: Reputable international news organizations (Reuters, Associated Press), major national newspapers with journalistic integrity, academic books from reputable publishers
   - **Medium**: Well-regarded encyclopedias (Wikipedia), established non-partisan organizations, major news magazines
   - **Low**: Opinion blogs, advocacy websites, publications with strong political slant
   - **Very Low**: Unsubstantiated social media posts, forums, personal websites with no clear expertise

Return ONLY a JSON object in this exact format (no markdown, no extra text):

{
  "statement": "${statement}",
  "factuality": "True|Likely True|Misleading|False|Likely False|Unverifiable",
  "summary": "Your detailed analysis summary here",
  "sources": [
    {
      "title": "Source title",
      "url": "https://example.com",
      "summary": "Brief summary of what this source says about the statement",
      "credibility": {
        "rating": "Very High|High|Medium|Low|Very Low",
        "explanation": "Explanation of why this source has this credibility rating"
      }
    }
  ]
}
`;

    try {
        const response = await fetch(getProxyURL(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt,
                structured: true
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Check for error in response
        if (result.error) {
            console.error("API error:", result.error);
            throw new Error(result.error.message || result.error);
        }

        // Handle the actual response format from our API
        if (result.statement && result.factuality && result.summary && Array.isArray(result.sources)) {
            // Transform the sources to match our expected format
            const transformedSources = result.sources.map((source: any) => ({
                title: source.title || source.name || 'Untitled Source',
                url: source.url || '',
                summary: source.summary || 'No summary available',
                credibility: {
                    rating: source.credibility?.rating || 'Medium',
                    explanation: source.credibility?.explanation || source.credibility?.reason || 'Source credibility not evaluated'
                }
            }));

            return {
                statement: result.statement,
                factuality: result.factuality,
                summary: result.summary,
                sources: transformedSources
            } as FactCheckResult;
        }

        // Fallback: try to parse as JSON string if needed
        if (typeof result === 'string') {
            try {
                const parsed = JSON.parse(result);
                if (parsed.statement && parsed.factuality && parsed.summary && Array.isArray(parsed.sources)) {
                    return parsed as FactCheckResult;
                }
            } catch (parseError) {
                console.error("Failed to parse result as JSON:", parseError);
            }
        }

        // Log unexpected response format for debugging
        console.error("Unexpected response format:", result);
        
        // Return fallback response
        return {
            statement: statement,
            factuality: 'Unverifiable',
            summary: 'The AI service returned an unexpected response format. Please try again.',
            sources: []
        };

    } catch (error) {
        console.error("Failed to get fact check result:", error);
        throw new Error("Unable to fact-check the statement. Please try again later.");
    }
};