import { Annotation, AnnotationService } from '../types/teacherFeedbackTypes';

// Simple localStorage-based annotation service for demo purposes
// In a real application, this would connect to a backend service
class LocalStorageAnnotationService implements AnnotationService {
  private getStorageKey(textId: string): string {
    return `annotations_${textId}`;
  }

  async saveAnnotations(textId: string, annotations: Annotation[]): Promise<void> {
    try {
      const storageKey = this.getStorageKey(textId);
      localStorage.setItem(storageKey, JSON.stringify(annotations));
    } catch (error) {
      console.error('Failed to save annotations:', error);
      throw new Error('Could not save annotations');
    }
  }

  async loadAnnotations(textId: string): Promise<Annotation[]> {
    try {
      const storageKey = this.getStorageKey(textId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load annotations:', error);
      return [];
    }
  }

  async deleteAnnotation(textId: string, annotationId: string): Promise<void> {
    try {
      const annotations = await this.loadAnnotations(textId);
      const filtered = annotations.filter(a => a.id !== annotationId);
      await this.saveAnnotations(textId, filtered);
    } catch (error) {
      console.error('Failed to delete annotation:', error);
      throw new Error('Could not delete annotation');
    }
  }

  // Additional utility methods
  async clearAllAnnotations(textId: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(textId);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear annotations:', error);
      throw new Error('Could not clear annotations');
    }
  }

  async exportAnnotations(textId: string): Promise<string> {
    try {
      const annotations = await this.loadAnnotations(textId);
      return JSON.stringify(annotations, null, 2);
    } catch (error) {
      console.error('Failed to export annotations:', error);
      throw new Error('Could not export annotations');
    }
  }

  async importAnnotations(textId: string, annotationsJson: string): Promise<void> {
    try {
      const annotations = JSON.parse(annotationsJson);
      if (!Array.isArray(annotations)) {
        throw new Error('Invalid annotations format');
      }
      await this.saveAnnotations(textId, annotations);
    } catch (error) {
      console.error('Failed to import annotations:', error);
      throw new Error('Could not import annotations');
    }
  }
}

// Singleton instance
export const annotationService = new LocalStorageAnnotationService();

// AI Detection service that uses the existing Gemini service
export async function detectAIInText(text: string): Promise<{
  likelihood_score: number;
  observations: string[];
  highlights: Array<{
    start: number;
    end: number;
    text: string;
    reason: string;
  }>;
}> {
  if (!text.trim()) {
    return {
      likelihood_score: 0,
      observations: [],
      highlights: []
    };
  }

  try {
    // Use localhost for development, production URL for deployed version
    const GEMINI_PROXY_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001/api/gemini'
      : 'https://trusty-ldqx.onrender.com/api/gemini';
    
    const response = await fetch(GEMINI_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: text,
        structured: false // This will trigger AI detection logic
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI detection from proxy');
    }

    const result = await response.json();
    
    return {
      likelihood_score: result.likelihood_score || 0,
      observations: result.observations || [],
      highlights: result.highlights || []
    };
  } catch (error) {
    console.error('Error detecting AI in text:', error);
    throw new Error('Could not analyze text for AI generation');
  }
}
