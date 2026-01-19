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

export class SmartAutoAnnotationService {
  private getProxyURL(): string {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5001/api/gemini'
      : 'https://trusty-ldqx.onrender.com/api/gemini';
  }

  // Common words and phrases that shouldn't be flagged
  private genericPhrases = [
    'identify your',
    'airbnb came in',
    'business model',
    'founders are',
    'billion dollar',
    'when needed',
    'at the time',
    'one thing',
    'make you',
    'would make',
    'you want',
    'consider',
    'important',
    'credibility',
    'pillar'
  ];

  // Filter out generic content that shouldn't be annotated
  private isGenericContent(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.genericPhrases.some(phrase => lowerText.includes(phrase));
  }

  // Check if content is worth fact-checking (contains specific claims)
  private isFactCheckWorthy(text: string): boolean {
    const factIndicators = [
      /\d+%/,           // Percentages
      /\$[\d,]+/,       // Dollar amounts
      /\d{4}/,          // Years
      /\d+\s+(million|billion|thousand)/i,  // Large numbers
      /(study|research|report|survey)\s+(shows|found|indicates)/i,
      /(according to|based on|data from)/i
    ];
    
    return factIndicators.some(pattern => pattern.test(text));
  }

  // Check if text actually seems AI-generated (more sophisticated filtering)
  private isLikelyAIContent(text: string, score: number): boolean {
    if (score < 50) return false;
    
    // Additional checks for AI patterns
    const aiPatterns = [
      /as an ai/i,
      /i'm an ai/i,
      /i cannot|i can't/i,
      /it's important to note/i,
      /in conclusion/i,
      /furthermore/i,
      /moreover/i
    ];
    
    const hasAIPatterns = aiPatterns.some(pattern => pattern.test(text));
    const isVeryHighScore = score > 80;
    
    return hasAIPatterns || isVeryHighScore;
  }

  async generateAutoAnnotations(text: string): Promise<Annotation[]> {
    if (!text.trim()) return [];

    const annotations: Annotation[] = [];
    
    try {
      // Get AI analysis with smarter filtering
      const aiAnalysis = await this.getAIAnalysis(text);
      if (this.isLikelyAIContent(text, aiAnalysis.likelihood_score)) {
        annotations.push(...this.createSmartAIAnnotations(text, aiAnalysis));
      }
      
      // Get text complexity analysis
      const complexityAnalysis = await this.getTextComplexity(text);
      annotations.push(...this.createSmartComplexityAnnotations(text, complexityAnalysis));
      
      // Get factual claims analysis with filtering
      if (this.isFactCheckWorthy(text)) {
        const factualAnalysis = await this.getFactualClaims(text);
        annotations.push(...this.createSmartFactualAnnotations(text, factualAnalysis));
      }
      
      // Generate helpful summary for long content
      if (text.length > 500) {
        annotations.push(...this.createHelpfulSummaryAnnotations(text));
      }
      
      return annotations;
    } catch (error) {
      console.error('Failed to generate smart annotations:', error);
      return [];
    }
  }

  private async getAIAnalysis(text: string): Promise<AIAnalysisResult> {
    try {
      const response = await fetch(this.getProxyURL(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Analyze this text for AI generation patterns. Focus on detecting:
          1. Repetitive phrasing or structure
          2. Overly formal or robotic language
          3. Generic expressions without personal voice
          4. Statistical claims without sources
          
          Text: ${text}
          
          Return likelihood score (0-100) and specific observations.`,
          structured: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI analysis');
      }

      return await response.json();
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        likelihood_score: 0,
        observations: [],
        highlights: []
      };
    }
  }

  private async getTextComplexity(text: string): Promise<TextComplexityResult> {
    try {
      const prompt = `Analyze this text for terms that seniors (65+) might find difficult. Focus on:
      - Technical jargon or industry terms
      - Words longer than 10 letters that lack simpler alternatives  
      - Sentences longer than 25 words
      - Skip common words even if long
      
      Text: ${text}
      
      Return JSON with readingLevel, complexWords (only truly difficult ones), longSentences.`;

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
    } catch (error) {
      console.error('Text complexity analysis failed:', error);
      return { 
        readingLevel: 'middle', 
        complexWords: [], 
        longSentences: [] 
      };
    }
  }

  private async getFactualClaims(text: string): Promise<FactualClaimsResult> {
    try {
      const prompt = `Identify specific factual claims that seniors should verify. Only flag:
      - Statistical data (percentages, dollar amounts, dates)
      - Research findings or studies mentioned
      - Direct quotes or attributions
      - Skip generic business advice or obvious statements
      
      Text: ${text}
      
      Return JSON with claims array containing only verifiable facts.`;

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
    } catch (error) {
      console.error('Factual claims analysis failed:', error);
      return { claims: [] };
    }
  }

  private createSmartAIAnnotations(text: string, analysis: AIAnalysisResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Only create annotation for high-confidence AI detection
    if (analysis.likelihood_score > 70) {
      const endPos = Math.min(150, text.length);
      annotations.push({
        id: `ai-warning-${Date.now()}`,
        start: 0,
        end: endPos,
        text: text.substring(0, endPos),
        type: 'comment',
        comment: `🤖 HIGH AI LIKELIHOOD (${analysis.likelihood_score}%): This text shows strong patterns of AI generation. Key indicators: ${analysis.observations.slice(0, 2).join('; ')}. Be especially cautious of any facts or claims.`,
        timestamp: Date.now()
      });
    } else if (analysis.likelihood_score > 85) {
      // Only highlight specific suspicious segments for very high scores
      analysis.highlights.slice(0, 2).forEach((highlight, index) => {
        annotations.push({
          id: `ai-highlight-${Date.now()}-${index}`,
          start: highlight.start,
          end: highlight.end,
          text: highlight.text,
          type: 'comment',
          comment: `🤖 AI Pattern: ${highlight.reason}`,
          timestamp: Date.now()
        });
      });
    }

    return annotations;
  }

  private createSmartComplexityAnnotations(_text: string, complexity: TextComplexityResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Only annotate truly complex words (not common business terms)
    const filteredWords = complexity.complexWords.filter(word => 
      !this.isGenericContent(word.word.toLowerCase()) &&
      word.word.length > 8 &&
      !['business', 'important', 'information', 'organization'].includes(word.word.toLowerCase())
    );
    
    filteredWords.slice(0, 3).forEach((word, index) => {
      annotations.push({
        id: `complex-word-${Date.now()}-${index}`,
        start: word.position,
        end: word.position + word.word.length,
        text: word.word,
        type: 'comment',
        comment: `📚 Complex Term: "${word.word}" means ${word.simplification}. This might be helpful to know.`,
        timestamp: Date.now()
      });
    });

    // Only flag truly problematic long sentences (over 30 words)
    const problematicSentences = complexity.longSentences.filter(sentence => 
      sentence.wordCount > 30
    );
    
    problematicSentences.slice(0, 2).forEach((sentence, index) => {
      annotations.push({
        id: `long-sentence-${Date.now()}-${index}`,
        start: sentence.start,
        end: sentence.end,
        text: sentence.sentence,
        type: 'comment',
        comment: `📝 Long Sentence (${sentence.wordCount} words): This sentence is quite complex. Try reading it in smaller parts if needed.`,
        timestamp: Date.now()
      });
    });

    return annotations;
  }

  private createSmartFactualAnnotations(_text: string, factual: FactualClaimsResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Filter out generic claims, keep only specific factual data
    const meaningfulClaims = factual.claims.filter(claim => 
      !this.isGenericContent(claim.text) &&
      (claim.type === 'statistic' || claim.type === 'date' || claim.confidence === 'high')
    );
    
    meaningfulClaims.slice(0, 3).forEach((claim, index) => {
      let icon = '🔍';
      if (claim.type === 'statistic') icon = '📊';
      else if (claim.type === 'date') icon = '📅';
      
      annotations.push({
        id: `fact-claim-${Date.now()}-${index}`,
        start: claim.start,
        end: claim.end,
        text: claim.text,
        type: 'comment',
        comment: `${icon} Verify This ${claim.type}: Consider checking this information from official sources if it's important for your decision-making.`,
        timestamp: Date.now()
      });
    });

    return annotations;
  }

  private createHelpfulSummaryAnnotations(text: string): Annotation[] {
    const annotations: Annotation[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length > 10) {
      // Add a helpful summary at the beginning
      const firstSentence = sentences[0].trim();
      annotations.push({
        id: `summary-${Date.now()}`,
        start: 0,
        end: firstSentence.length + 1,
        text: firstSentence,
        type: 'comment',
        comment: `📖 Long Article: This text has ${sentences.length} sentences. Take your time reading it. The main topic appears to be about ${this.extractMainTopic(text)}.`,
        timestamp: Date.now()
      });
    }

    return annotations;
  }

  private extractMainTopic(text: string): string {
    // Simple topic extraction - look for repeated important words
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (!['that', 'this', 'with', 'have', 'will', 'they', 'your', 'from', 'were'].includes(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const topWords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);
    
    return topWords.join(', ') || 'various topics';
  }
}

export const smartAutoAnnotationService = new SmartAutoAnnotationService();
