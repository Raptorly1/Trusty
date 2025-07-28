export enum CredibilityRating {
    VERY_HIGH = 'Very High',
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
    VERY_LOW = 'Very Low',
}

export interface Source {
  title: string;
  url: string;
  summary: string;
  credibility: {
    rating: CredibilityRating;
    explanation: string;
  };
}

export interface FactCheckResult {
  statement: string;
  factuality: 'True' | 'Likely True' | 'Misleading' | 'False' | 'Likely False' | 'Unverifiable';
  summary: string;
  sources: Source[];
}