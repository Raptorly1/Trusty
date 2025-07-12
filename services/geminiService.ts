
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SourceCheckResult, HumanTextExplanationResult } from '../types';
import { API_KEY } from '../config';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        likelihood_score: {
            type: Type.INTEGER,
            description: "A score from 0 (definitely human) to 100 (definitely AI) indicating the likelihood the text is AI-generated."
        },
        observations: {
            type: Type.ARRAY,
            description: "A list of observations about the text. If no AI traits are found, this should be an empty array.",
            items: {
                type: Type.OBJECT,
                properties: {
                    trait: {
                        type: Type.STRING,
                        description: "A short, descriptive name for the observed trait.",
                        enum: [
                            "Too Perfect Grammar",
                            "Lacks Personal Voice",
                            "Overly Formal Tone",
                            "Repetitive Phrasing",
                            "Unusual Word Choice",
                            "General and Vague"
                        ]
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A user-friendly, encouraging explanation of why this trait might suggest AI generation, written in simple terms for seniors."
                    },
                    quote: {
                        type: Type.STRING,
                        description: "The exact quote from the input text that exhibits this trait. This must be a verbatim substring from the original text."
                    }
                },
                required: ["trait", "explanation", "quote"]
            }
        }
    },
    required: ["likelihood_score", "observations"]
};

export async function analyzeTextForAI(text: string): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please analyze the following text: "${text}"`,
      config: {
        systemInstruction: `You are an expert AI text analyzer with a friendly, mentor-like personality, like a helpful teacher reviewing a paper. Your purpose is to help users, especially seniors, learn to spot signs of AI-written text, as this can sometimes be used in scams or misinformation. Your tone should always be encouraging and educational, not alarming.

        Analyze the user's provided text and respond in the required JSON format.
        - Your analysis should feel like you're adding helpful notes in the margin of a document.
        - For each observation, you MUST identify the specific part of the text (the 'quote') that demonstrates the trait. The quote must be an EXACT, verbatim substring of the original text. Do not make up quotes.
        - Provide a likelihood_score from 0 (definitely human) to 100 (definitely AI).
        - If the text looks human-written, give it a low score and return an empty list for 'observations'.
        - For the 'explanation' of each trait, explain it in simple, clear terms. For example, instead of saying "The text exhibits a formal register," you could say, "This part sounds a little stiff and formal, not like how most people talk. It's just something to keep an eye on!"`,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!response.text) {
        throw new Error("No response text received from Gemini API.");
    }
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation to ensure the result matches the expected structure
    if (typeof result.likelihood_score !== 'number' || !Array.isArray(result.observations)) {
        throw new Error("Invalid response format from API.");
    }
    
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing text with APIs:", error);
    throw new Error("Could not analyze the text. The service may be temporarily unavailable.");
  }
}


export async function findSourcesForText(text: string): Promise<SourceCheckResult> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please provide a brief analysis of the following statement's accuracy. Keep the tone helpful and neutral. State whether the claim is generally supported, unsupported, or lacks evidence. Do not make definitive judgments, but rather summarize what sources suggest. In your analysis, please also comment on the general credibility of the sources you found (e.g., are they reputable news sites, scientific journals, or personal blogs?). Statement: "${text}"`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const analysis = response.text ?? "";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        // The type from the SDK might not be directly compatible, so we cast it.
        return { analysis, sources: sources as SourceCheckResult['sources'] };

    } catch (error) {
        console.error("Error finding sources with API:", error);
        throw new Error("Could not fact-check the text. The search service may be temporarily unavailable.");
    }
}

export async function explainHumanText(text: string): Promise<HumanTextExplanationResult> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please explain why the following text sounds like it was written by a human. Focus on elements like personal voice, natural phrasing, use of slang or idiom, specific details, or any slight imperfections that make it feel authentic. Keep your explanation concise and encouraging. The text is: "${text}"`,
            config: {
                systemInstruction: `You are a friendly writing coach. Your goal is to help users understand the positive, human-like qualities in a piece of text. Your tone should be positive and educational. Do not be critical.`,
            },
        });

        return { explanation: response.text ?? "" };

    } catch (error) {
        console.error("Error explaining human text with API:", error);
        throw new Error("Could not get an explanation. The service may be temporarily unavailable.");
    }
}