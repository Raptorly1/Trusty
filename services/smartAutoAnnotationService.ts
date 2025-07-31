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
    // Allow more annotations to be generated - lower threshold for production debugging
    if (score < 10) return false;
    
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
    const isModerateScore = score > 30; // Lower threshold for better debugging
    
    return hasAIPatterns || isModerateScore;
  }

  async generateAutoAnnotations(text: string): Promise<Annotation[]> {
    if (!text.trim()) return [];

    console.log('Starting annotation generation for text:', text.substring(0, 100) + '...');
    const annotations: Annotation[] = [];
    
    try {
      // Always add a basic text analysis annotation for testing
      annotations.push({
        id: `basic-analysis-${Date.now()}`,
        start: 0,
        end: Math.min(50, text.length),
        text: text.substring(0, Math.min(50, text.length)),
        type: 'comment',
        comment: `📝 Text Analysis: This text contains ${text.split(' ').length} words and ${text.split('\n').length} lines. Analysis complete.`,
        timestamp: Date.now()
      });

      // Add specific annotations for financial terms
      const financialTerms = ['UGMA', 'brokerage', 'robo-advisor', 'investment', 'custodial'];
      financialTerms.forEach(term => {
        const lowerText = text.toLowerCase();
        const termIndex = lowerText.indexOf(term.toLowerCase());
        if (termIndex !== -1) {
          annotations.push({
            id: `financial-term-${term}-${Date.now()}`,
            start: termIndex,
            end: termIndex + term.length,
            text: text.substring(termIndex, termIndex + term.length),
            type: 'comment',
            comment: `💰 Financial Term: "${term}" - This is a financial term that seniors may want to research further.`,
            timestamp: Date.now()
          });
        }
      });

      // Get AI analysis with smarter filtering - ALWAYS INCLUDE FOR DEBUGGING
      console.log('Getting AI analysis...');
      const aiAnalysis = await this.getAIAnalysis(text);
      console.log('AI analysis result:', aiAnalysis);
      
      // Create AI annotations regardless of score for better analysis visibility
      if (aiAnalysis.likelihood_score > 0) {
        annotations.push(...this.createSmartAIAnnotations(text, aiAnalysis));
      }

      // Get text complexity analysis - ALWAYS INCLUDE
      console.log('Getting complexity analysis...');
      const complexityAnalysis = await this.getTextComplexity(text);
      console.log('Complexity analysis result:', complexityAnalysis);
      annotations.push(...this.createSmartComplexityAnnotations(text, complexityAnalysis));
      
      // Get factual claims analysis with BROADER filtering for more annotations
      console.log('Getting factual claims analysis...');
      const factualAnalysis = await this.getFactualClaims(text);
      console.log('Factual analysis result:', factualAnalysis);
      annotations.push(...this.createSmartFactualAnnotations(text, factualAnalysis));
      
      // Generate helpful summary for ANY content (removed length filter)
      console.log('Adding summary annotations...');
      annotations.push(...this.createHelpfulSummaryAnnotations(text));
      
      console.log('Generated annotations:', annotations);
      return annotations;
    } catch (error) {
      console.error('Failed to generate smart annotations:', error);
      return [];
    }
  }  private async getAIAnalysis(text: string): Promise<AIAnalysisResult> {
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
    
    // Ensure analysis has the expected structure
    if (!analysis || typeof analysis.likelihood_score !== 'number') {
      console.warn('Invalid AI analysis result:', analysis);
      return annotations;
    }
    
    // ALWAYS display AI likelihood score prominently regardless of score
    const endPos = Math.min(150, text.length);
    const observations = Array.isArray(analysis.observations) ? analysis.observations : [];
    
    // Main AI likelihood annotation - ALWAYS SHOW
    annotations.push({
      id: `ai-likelihood-${Date.now()}`,
      start: 0,
      end: endPos,
      text: text.substring(0, endPos),
      type: 'comment',
      comment: `📊 AI Detection Score: ${analysis.likelihood_score}% ${analysis.likelihood_score > 70 ? '(Very High - Likely AI)' : analysis.likelihood_score > 50 ? '(High - Possibly AI)' : analysis.likelihood_score > 25 ? '(Moderate - Some AI Patterns)' : '(Low - Appears Human)'}`,
      timestamp: Date.now()
    });
    
    // Additional analysis for higher scores
    if (analysis.likelihood_score > 50) {
      annotations.push({
        id: `ai-warning-${Date.now()}`,
        start: 0,
        end: endPos,
        text: text.substring(0, endPos),
        type: 'comment',
        comment: `🤖 HIGH AI LIKELIHOOD (${analysis.likelihood_score}%): This text shows strong patterns of AI generation. Key indicators: ${observations.slice(0, 2).join('; ')}. Be especially cautious of any facts or claims.`,
        timestamp: Date.now()
      });
    } else if (analysis.likelihood_score > 0) {
      // Show analysis even for low scores to help with debugging
      annotations.push({
        id: `ai-analysis-${Date.now()}`,
        start: 0,
        end: endPos,
        text: text.substring(0, endPos),
        type: 'comment',
        comment: `🔍 AI Analysis (${analysis.likelihood_score}%): ${observations.length > 0 ? observations.slice(0, 3).join('; ') : 'Analysis completed with human-like characteristics detected.'}`,
        timestamp: Date.now()
      });
    }
    
    // Add specific highlights for any detected patterns
    if (analysis.highlights && Array.isArray(analysis.highlights)) {
      const highlights = analysis.highlights;
      highlights.slice(0, 3).forEach((highlight, index) => {
        if (highlight && typeof highlight.start === 'number' && typeof highlight.end === 'number') {
          annotations.push({
            id: `ai-highlight-${Date.now()}-${index}`,
            start: highlight.start,
            end: highlight.end,
            text: highlight.text || '',
            type: 'comment',
            comment: `🤖 AI Pattern: ${highlight.reason || 'Suspicious pattern detected'}`,
            timestamp: Date.now()
          });
        }
      });
    }

    return annotations;
  }

  private createSmartComplexityAnnotations(_text: string, complexity: TextComplexityResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Ensure complexity has the expected structure
    if (!complexity || !Array.isArray(complexity.complexWords) || !Array.isArray(complexity.longSentences)) {
      console.warn('Invalid complexity analysis result:', complexity);
      return annotations;
    }
    
    // Annotate complex words (removed generic filtering per user request)
    const filteredWords = complexity.complexWords.filter(word => 
      word && 
      word.word && 
      typeof word.word === 'string' &&
      word.word.length > 3 &&
      typeof word.position === 'number'
    );
    
    filteredWords.slice(0, 3).forEach((word, index) => {
      // Double-check the word object is valid before using it
      if (word && word.word && typeof word.word === 'string' && typeof word.position === 'number') {
        annotations.push({
          id: `complex-word-${Date.now()}-${index}`,
          start: word.position,
          end: word.position + word.word.length,
          text: word.word,
          type: 'comment',
          comment: `📚 Complex Term: "${word.word}" means ${word.simplification || 'a more complex concept'}. This might be helpful to know.`,
          timestamp: Date.now()
        });
      }
    });

    // Only flag truly problematic long sentences (over 30 words)
    const problematicSentences = complexity.longSentences.filter(sentence => 
      sentence && 
      sentence.sentence && 
      typeof sentence.wordCount === 'number' &&
      sentence.wordCount > 30
    );
    
    problematicSentences.slice(0, 2).forEach((sentence, index) => {
      // Double-check the sentence object is valid before using it
      if (sentence && sentence.sentence && typeof sentence.sentence === 'string' && 
          typeof sentence.start === 'number' && typeof sentence.end === 'number') {
        annotations.push({
          id: `long-sentence-${Date.now()}-${index}`,
          start: sentence.start,
          end: sentence.end,
          text: sentence.sentence,
          type: 'comment',
          comment: `📝 Long Sentence (${sentence.wordCount || 'many'} words): This sentence is quite complex. Try reading it in smaller parts if needed.`,
          timestamp: Date.now()
        });
      }
    });

    return annotations;
  }

  private createSmartFactualAnnotations(_text: string, factual: FactualClaimsResult): Annotation[] {
    const annotations: Annotation[] = [];
    
    // Ensure factual has the expected structure
    if (!factual || !Array.isArray(factual.claims)) {
      console.warn('Invalid factual analysis result:', factual);
      return annotations;
    }
    
    // Include all factual claims (removed generic filtering per user request)
    const meaningfulClaims = factual.claims.filter(claim => 
      claim &&
      claim.text &&
      typeof claim.text === 'string'
    );
    
    meaningfulClaims.slice(0, 3).forEach((claim, index) => {
      let icon = '🔍';
      if (claim.type === 'statistic') icon = '📊';
      else if (claim.type === 'date') icon = '📅';
      
      annotations.push({
        id: `fact-claim-${Date.now()}-${index}`,
        start: claim.start || 0,
        end: claim.end || claim.text.length,
        text: claim.text,
        type: 'comment',
        comment: `${icon} Verify This ${claim.type || 'claim'}: Consider checking this information from official sources if it's important for your decision-making.`,
        timestamp: Date.now()
      });
    });

    return annotations;
  }

  private createHelpfulSummaryAnnotations(text: string): Annotation[] {
    const annotations: Annotation[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    // Add helpful information for any text content
    if (sentences.length >= 3) {
      // Add a helpful summary at the beginning
      const firstSentence = sentences[0].trim();
      annotations.push({
        id: `summary-${Date.now()}`,
        start: 0,
        end: firstSentence.length + 1,
        text: firstSentence,
        type: 'comment',
        comment: `📖 Text Overview: This content has ${sentences.length} sentences about ${this.extractMainTopic(text)}. ${sentences.length > 10 ? 'Take your time reading this longer text.' : 'This is a manageable length for reading.'}`,
        timestamp: Date.now()
      });
    }
    
    // Add reading tips for any substantial content
    if (text.length > 200) {
      const midPoint = Math.floor(text.length / 2);
      annotations.push({
        id: `reading-tip-${Date.now()}`,
        start: midPoint,
        end: Math.min(midPoint + 50, text.length),
        text: text.substring(midPoint, Math.min(midPoint + 50, text.length)),
        type: 'comment',
        comment: `💡 Reading Tip: This section contains key information. If any terms seem unclear, take time to look them up or ask for clarification.`,
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
