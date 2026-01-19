import React, { useState } from 'react';
import { BarChart3, Brain, Eye, EyeOff } from './Icons';

interface TextStats {
  wordCount: number;
  readabilityScore: number;
  complexWords: number;
  averageSentenceLength: number;
}

interface OverviewCardProps {
  text: string;
  aiLikelihood: number | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

// Helper functions
const calculateTextStats = (text: string): TextStats => {
  if (!text.trim()) {
    return {
      wordCount: 0,
      readabilityScore: 0,
      complexWords: 0,
      averageSentenceLength: 0
    };
  }

  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const complexWords = words.filter(word => word.length > 6).length;
  
  // Simple readability approximation (higher = more readable)
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const readabilityScore = Math.max(0, Math.min(100, 
    100 - (avgWordsPerSentence * 2) - (complexWords / words.length * 50)
  ));

  return {
    wordCount: words.length,
    readabilityScore: Math.round(readabilityScore),
    complexWords,
    averageSentenceLength: Math.round(avgWordsPerSentence * 10) / 10
  };
};

const getReadabilityLevel = (score: number): string => {
  if (score >= 80) return 'Very Easy';
  if (score >= 60) return 'Easy';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Hard';
  return 'Very Hard';
};

const getReadabilityColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  if (score >= 20) return 'text-orange-600';
  return 'text-red-600';
};

const getReadabilityBarColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  if (score >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

const getAIRiskColor = (likelihood: number): string => {
  if (likelihood >= 70) return 'text-red-600';
  if (likelihood >= 40) return 'text-yellow-600';
  return 'text-green-600';
};

const getAIRiskBackground = (likelihood: number): string => {
  if (likelihood >= 70) return 'bg-red-50';
  if (likelihood >= 40) return 'bg-yellow-50';
  return 'bg-green-50';
};

const OverviewCard: React.FC<OverviewCardProps> = ({
  text,
  aiLikelihood,
  isAnalyzing,
  onAnalyze
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'ai'>('stats');
  const [showDetails, setShowDetails] = useState(false);

  const stats = calculateTextStats(text);

  const renderAnalyzingState = () => (
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Analyzing...</span>
    </div>
  );

  const renderAnalyzeButton = () => (
    <button
      onClick={onAnalyze}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
    >
      <Brain className="w-4 h-4" />
      Analyze Text
    </button>
  );

  const renderAIResults = (likelihood: number) => {
    const isHighRisk = likelihood >= 70;
    const riskColor = getAIRiskColor(likelihood);
    const bgColor = getAIRiskBackground(likelihood);

    return (
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${riskColor}`} />
            <span className={`font-medium ${riskColor}`}>
              {likelihood}% AI Likelihood
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-2 text-sm text-gray-600">
            <p>
              This analysis uses advanced patterns to detect potential AI-generated content.
              {isHighRisk 
                ? ' High likelihood suggests possible AI generation.' 
                : ' Low likelihood suggests human authorship.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAILikelihoodDisplay = () => {
    if (isAnalyzing) return renderAnalyzingState();
    if (aiLikelihood === null) return renderAnalyzeButton();
    return renderAIResults(aiLikelihood);
  };

  const renderStatsTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.wordCount}</div>
          <div className="text-sm text-gray-500">Words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.complexWords}</div>
          <div className="text-sm text-gray-500">Complex Words</div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Readability</span>
          <span className={`text-sm font-medium ${getReadabilityColor(stats.readabilityScore)}`}>
            {getReadabilityLevel(stats.readabilityScore)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getReadabilityBarColor(stats.readabilityScore)}`}
            style={{ width: `${stats.readabilityScore}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Avg. sentence length: {stats.averageSentenceLength} words
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Text Statistics
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Detection
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'stats' ? renderStatsTab() : (
          <div>
            {renderAILikelihoodDisplay()}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
