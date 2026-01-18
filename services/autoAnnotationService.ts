import { Annotation } from '../types/teacherFeedbackTypes';

interface AIAnalysisResult {
  likelihood_score: number;
  observations: string[];
  highlights: Array<{
    start: number;
    end: number;
    text: string;
    reason: string;
  }>;
}

interface TextComplexityResult {
  readingLevel: 'elementary' | 'middle' | 'high' | 'college';
  complexWords: Array<{
    word: string;
    position: number;
    simplification: string;
  }>;
  longSentences: Array<{
    sentence: string;
    start: number;
    end: number;
    wordCount: number;
  }>;
}

interface FactualClaimsResult {
  claims: Array<{
    text: string;
    start: number;
    end: number;
    confidence: 'high' | 'medium' | 'low';
    type: 'statistic' | 'claim' | 'quote' | 'date';
  }>;
}

export class AutoAnnotationService {
  private getProxyURL(): string {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5001/api/gemini'
      : 'https://trusty-ldqx.onrender.com/api/gemini';
  }

  async generateAutoAnnotations(text: string): Promise<Annotation[]> {
    if (!text.trim()) return [];

    const annotations: Annotation[] = [];
    
    try {
      // Get AI analysis
      const aiAnalysis = await this.getAIAnalysis(text);
      
      // Generate AI-related annotations
      if (aiAnalysis.likelihood_score > 30) {
        annotations.push(...this.createAIAnnotations(aiAnalysis));
      }
      
      // Get text complexity analysis
      const complexityAnalysis = await this.getTextComplexity(text);
      annotations.push(...this.createComplexityAnnotations(complexityAnalysis));
      
      // Get factual claims analysis
      const factualAnalysis = await this.getFactualClaims(text);
      annotations.push(...this.createFactualAnnotations(factualAnalysis));
      
      // Generate summary annotations for long paragraphs
      annotations.push(...this.createSummaryAnnotations(text));
      
      return annotations;
    } catch (error) {
      console.error('Failed to generate auto annotations:', error);
      return [];
    }
  }

  private async getAIAnalysis(text: string): Promise<AIAnalysisResult> {
    const response = await fetch(this.getProxyURL(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: text,
        structured: false
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI analysis');
    }

    return await response.json();
  }

  private async getTextComplexity(text: string): Promise<TextComplexityResult> {
    const prompt = `Analyze this text for complexity and identify difficult words that seniors might not understand. Return JSON with:
    - readingLevel: elementary/middle/high/college
    - complexWords: array of {word, position, simplification}
    - longSentences: array of {sentence, start, end, wordCount} for sentences over 20 words
    
    Text: ${text}
    
    Return only JSON, no extra text.`;

    const response = await fetch(this.getProxyURL(), {
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
      throw new Error('Failed to analyze text complexity');
    }

    const result = await response.json();
    return result || { readingLevel: 'middle', complexWords: [], longSentences: [] };
  }

  private async getFactualClaims(text: string): Promise<FactualClaimsResult> {
    const prompt = `Identify factual claims in this text that seniors should verify. Return JSON with:
    - claims: array of {text, start, end, confidence, type} where type is statistic/claim/quote/date
    
    Text: ${text}
    
    Return only JSON, no extra text.`;

    const response = await fetch(this.getProxyURL(), {
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
      throw new Error('Failed to analyze factual claims');
    }

    const result = await response.json();
    return result || { claims: [] };
  }

  private createAIAnnotations(analysis: AIAnalysisResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Add AI likelihood annotation
    if (analysis.likelihood_score > 70) {
      annotations.push({
        id: `ai-warning-${Date.now()}`,
        start: 0,
        end: Math.min(100, analysis.highlights[0]?.end || 50),
        text: analysis.highlights[0]?.text || "Beginning of text",
        type: 'comment',
        comment: `⚠️ HIGH AI LIKELIHOOD (${analysis.likelihood_score}%): This text appears to be written by artificial intelligence. Be cautious - AI text can contain false information or be used to deceive. Key signs: ${analysis.observations.slice(0, 2).join('; ')}.`,
        timestamp: Date.now()
      });
    } else if (analysis.likelihood_score > 30) {
      annotations.push({
        id: `ai-caution-${Date.now()}`,
        start: 0,
        end: Math.min(100, analysis.highlights[0]?.end || 50),
        text: analysis.highlights[0]?.text || "Beginning of text",
        type: 'comment',
        comment: `⚡ POSSIBLE AI TEXT (${analysis.likelihood_score}%): This might be AI-generated. Take extra care to verify any facts or claims before trusting this information.`,
        timestamp: Date.now()
      });
    }

    // Add specific highlight annotations for suspicious segments
    analysis.highlights.forEach((highlight, index) => {
      if (index < 3) { // Limit to 3 highlights to avoid clutter
        annotations.push({
          id: `ai-highlight-${Date.now()}-${index}`,
          start: highlight.start,
          end: highlight.end,
          text: highlight.text,
          type: 'highlight',
          color: 'red',
          timestamp: Date.now()
        });
        
        annotations.push({
          id: `ai-reason-${Date.now()}-${index}`,
          start: highlight.start,
          end: highlight.end,
          text: highlight.text,
          type: 'comment',
          comment: `🤖 AI Pattern Detected: ${highlight.reason}`,
          timestamp: Date.now()
        });
      }
    });

    return annotations;
  }

  private createComplexityAnnotations(complexity: TextComplexityResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Annotate complex words
    complexity.complexWords.forEach((word, index) => {
      if (index < 5) { // Limit to 5 words to avoid overwhelming
        annotations.push({
          id: `complex-word-${Date.now()}-${index}`,
          start: word.position,
          end: word.position + word.word.length,
          text: word.word,
          type: 'highlight',
          color: 'yellow',
          timestamp: Date.now()
        });
        
        annotations.push({
          id: `word-help-${Date.now()}-${index}`,
          start: word.position,
          end: word.position + word.word.length,
          text: word.word,
          type: 'comment',
          comment: `📚 Complex Word: "${word.word}" means ${word.simplification}`,
          timestamp: Date.now()
        });
      }
    });

    // Annotate long sentences
    complexity.longSentences.forEach((sentence, index) => {
      if (index < 3) { // Limit to 3 sentences
        annotations.push({
          id: `long-sentence-${Date.now()}-${index}`,
          start: sentence.start,
          end: sentence.end,
          text: sentence.sentence,
          type: 'comment',
          comment: `📝 Long Sentence (${sentence.wordCount} words): This sentence is quite long. Try reading it slowly, one part at a time.`,
          timestamp: Date.now()
        });
      }
    });

    return annotations;
  }

  private createFactualAnnotations(factual: FactualClaimsResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    factual.claims.forEach((claim, index) => {
      if (index < 4) { // Limit to 4 claims
        let icon = '❗';
        if (claim.type === 'statistic') icon = '📊';
        else if (claim.type === 'quote') icon = '💬';
        else if (claim.type === 'date') icon = '📅';
        
        annotations.push({
          id: `fact-claim-${Date.now()}-${index}`,
          start: claim.start,
          end: claim.end,
          text: claim.text,
          type: 'highlight',
          color: 'blue',
          timestamp: Date.now()
        });
        
        annotations.push({
          id: `fact-comment-${Date.now()}-${index}`,
          start: claim.start,
          end: claim.end,
          text: claim.text,
          type: 'comment',
          comment: `${icon} Factual Claim: This appears to be a ${claim.type}. Consider verifying this information from trusted sources like official websites or news organizations.`,
          timestamp: Date.now()
        });
      }
    });

    return annotations;
  }

  private createSummaryAnnotations(text: string): Annotation[] {
    const annotations: Annotation[] = [];
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.length > 300 && index < 2) { // Only annotate long paragraphs, limit to 2
        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim());
        if (sentences.length > 3) {
          const start = text.indexOf(paragraph);
          const end = start + paragraph.length;
          
          annotations.push({
            id: `summary-${Date.now()}-${index}`,
            start,
            end,
            text: paragraph,
            type: 'comment',
            comment: `📖 Long Paragraph: This paragraph has ${sentences.length} sentences. Main idea: ${sentences[0].trim()}. Take your time reading this section.`,
            timestamp: Date.now()
          });
        }
      }
    });

    return annotations;
  }
}

export const autoAnnotationService = new AutoAnnotationService();
