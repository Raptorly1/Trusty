import React from 'react';
export enum ExerciseType {
  QUIZ = 'QUIZ',
  PASSWORD_CHECKER = 'PASSWORD_CHECKER',
  SCAM_IDENTIFICATION = 'SCAM_IDENTIFICATION',
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizExerciseData {
  type: ExerciseType.QUIZ;
  question: string;
  options: QuizOption[];
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface PasswordCheckerData {
  type: ExerciseType.PASSWORD_CHECKER;
}

export interface ScamItem {
  content: string;
  isScam: boolean;
  explanation: string;
}

export interface ScamIdentificationData {
  type: ExerciseType.SCAM_IDENTIFICATION;
  instructions: string;
  items: ScamItem[];
}

export type ExerciseData = QuizExerciseData | PasswordCheckerData | ScamIdentificationData;

export interface CourseModule {
  title:string;
  description: string;
  content: React.ReactNode;
  exercise: ExerciseData;
}

export interface FinalQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// AI Text Checker
export interface AIHighlight {
  snippet: string;
  reason: string;
}

export interface AITextAnalysisResult {
  likelihood: number;
  summary: string;
  forAI: AIHighlight[];
  againstAI: AIHighlight[];
  wordCount: number;
  readability: string;
  complexWords: number;
}

// Feedback Tool
export enum AnnotationType {
  CLARITY = 'Clarity',
  LOGIC = 'Logic',
  EVIDENCE = 'Evidence',
  TONE = 'Tone',
  AI_WARNING = 'AI Warning',
  FACT_CLAIM = 'Fact Claim',
}

export interface Annotation {
  snippet: string;
  feedback: string;
  suggestion?: string;
  type: AnnotationType;
}

export interface FeedbackResult {
  summary: {
    strengths: string;
    improvements: string;
  };
  annotations: Annotation[];
}

// AI Image Checker
export interface ImageAnomaly {
    reason: string;
    box: { x: number; y: number; width: number; height: number };
}

export interface AIImageAnalysisResult {
    isLikelyAI: boolean;
    likelihood: number;
    anomalies: ImageAnomaly[];
}

// Fact Checker
export interface SourceCredibility {
  url: string;
  title: string;
  credibility: 'Very High' | 'High' | 'Medium High' | 'Medium' | 'Medium Low' | 'Low' | 'Very Low' | 'Unknown';
  explanation: string;
}