import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, ShieldCheck, AlertTriangle } from './Icons';
import { Annotation } from '../types/teacherFeedbackTypes';

interface SmartAnalysisPanelProps {
  text: string;
  annotations: Annotation[];
  aiDetection: {
    likelihood_score: number;
    observations: string[];
  } | null;
}

const SmartAnalysisPanel: React.FC<SmartAnalysisPanelProps> = ({
  text,
  annotations,
  aiDetection
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInsightCounts = () => {
    // Categorize annotations based on their content and type
    const highlightCount = annotations.filter(a => a.type === 'highlight').length;
    const commentCount = annotations.filter(a => a.type === 'comment').length;
    const tagCount = annotations.filter(a => a.type === 'tag').length;
    
    return { highlightCount, commentCount, tagCount };
  };

  const { highlightCount, commentCount, tagCount } = getInsightCounts();
  const totalInsights = highlightCount + commentCount + tagCount;

  const renderInsightSummary = () => {
    if (!text.trim()) {
      return (
        <div className="text-gray-500 text-sm">
          Add text to see smart analysis insights
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4 text-sm">
        {highlightCount > 0 && (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{highlightCount} highlight{highlightCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {commentCount > 0 && (
          <div className="flex items-center gap-1 text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {tagCount > 0 && (
          <div className="flex items-center gap-1 text-green-600">
            <ShieldCheck className="w-4 h-4" />
            <span>{tagCount} tag{tagCount !== 1 ? 's' : ''}</span>
          </div>
        )}
        {totalInsights === 0 && (
          <div className="text-green-600 text-sm">
            ✓ Text looks clear and straightforward
          </div>
        )}
      </div>
    );
  };

  const renderDetailedAnalysis = () => {
    if (!isExpanded) return null;

    return (
      <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
        {/* AI Detection Details */}
        {aiDetection && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">AI Detection Analysis</h4>
            <div className="text-sm text-gray-700">
              <p className="mb-2">Likelihood Score: {aiDetection.likelihood_score}%</p>
              {aiDetection.observations.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Key Observations:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {aiDetection.observations.map((obs) => (
                      <li key={obs}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Annotation Categories */}
        {annotations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Analysis Categories</h4>
            
            {highlightCount > 0 && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Highlights ({highlightCount})</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Important text sections marked for attention
                </p>
              </div>
            )}

            {commentCount > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Comments ({commentCount})</span>
                </div>
                <p className="text-sm text-blue-700">
                  Explanatory notes and feedback on text sections
                </p>
              </div>
            )}

            {tagCount > 0 && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">Tags ({tagCount})</span>
                </div>
                <p className="text-sm text-green-700">
                  Categorized labels for easy organization
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Smart Analysis</h3>
            <div className="mt-1">
              {renderInsightSummary()}
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </button>
      
      {renderDetailedAnalysis()}
    </div>
  );
};

export default SmartAnalysisPanel;
