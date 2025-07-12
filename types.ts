export enum InteractiveType {
  TAP_RISKY_BEHAVIOR = 'TAP_RISKY_BEHAVIOR',
  REAL_OR_SCAM = 'REAL_OR_SCAM',
  CHOOSE_REAL_SITE = 'CHOOSE_REAL_SITE',
  PASSWORD_CHECKER = 'PASSWORD_CHECKER',
  AI_IMAGE_GUESS = 'AI_IMAGE_GUESS',
  GUIDED_REPORTING = 'GUIDED_REPORTING',
  CHEAT_SHEET = 'CHEAT_SHEET',
}

export interface InteractiveExercise {
  type: InteractiveType;
  prompt: string;
  options?: { text: string; isCorrect: boolean; feedback: string }[];
  correctAnswerFeedback?: string;
  extraData?: any;
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  markdownContent: string;
  interactive: InteractiveExercise;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

// Types for the new AI Checker feature
export interface AnalysisObservation {
    trait: string;
    explanation: string;
    quote: string;
}

export interface AnalysisResult {
    likelihood_score: number;
    observations: AnalysisObservation[];
}

// Types for the Fact-Check feature
export interface WebSource {
    uri: string;
    title: string;
}

export interface GroundingSource {
    web: WebSource;
}

export interface SourceCheckResult {
    analysis: string;
    sources: GroundingSource[];
}

// Type for the human text explanation feature
export interface HumanTextExplanationResult {
    explanation: string;
}