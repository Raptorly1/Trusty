export interface Annotation {
  id: string;
  start: number;
  end: number;
  text: string;
  type: 'highlight' | 'comment' | 'tag';
  color?: 'yellow' | 'red' | 'green' | 'blue' | 'purple';
  comment?: string;
  tags?: string[];
  timestamp: number;
}

export interface HighlightColor {
  name: string;
  value: 'yellow' | 'red' | 'green' | 'blue' | 'purple';
  className: string;
}

export interface CommentAnnotation {
  id: string;
  start: number;
  end: number;
  text: string;
  comment: string;
  timestamp: number;
}

export interface TagAnnotation {
  id: string;
  start: number;
  end: number;
  text: string;
  tags: string[];
  timestamp: number;
}

export interface AIDetectionResult {
  likelihood_score: number;
  last_updated: number;
  observations: string[];
  highlights: Array<{
    start: number;
    end: number;
    text: string;
    reason: string;
  }>;
}

export interface AnnotationService {
  saveAnnotations(textId: string, annotations: Annotation[]): Promise<void>;
  loadAnnotations(textId: string): Promise<Annotation[]>;
  deleteAnnotation(textId: string, annotationId: string): Promise<void>;
}

export interface TeacherFeedbackState {
  text: string;
  annotations: Annotation[];
  aiDetection: AIDetectionResult | null;
  selectedRange: {
    start: number;
    end: number;
    text: string;
  } | null;
  activeAnnotationId: string | null;
}

export const HIGHLIGHT_COLORS: HighlightColor[] = [
  { name: 'Yellow', value: 'yellow', className: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: 'Red', value: 'red', className: 'bg-red-200 hover:bg-red-300' },
  { name: 'Green', value: 'green', className: 'bg-green-200 hover:bg-green-300' },
  { name: 'Blue', value: 'blue', className: 'bg-blue-200 hover:bg-blue-300' },
  { name: 'Purple', value: 'purple', className: 'bg-purple-200 hover:bg-purple-300' },
];

export const COMMON_TAGS = [
  'grammar',
  'argument strength',
  'style',
  'clarity',
  'evidence',
  'logic',
  'tone',
  'structure',
  'fact-check needed',
  'citation needed',
  'well-written',
  'needs improvement'
];
