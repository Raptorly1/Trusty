import React from 'react';
import { AIDetectionResult } from '../types/teacherFeedbackTypes';
import { ZapIcon, EyeIcon, EyeSlashIcon } from './Icons';

interface AIDetectionWidgetProps {
  result: AIDetectionResult | null;
  isVisible: boolean;
  onToggleVisibility: () => void;
  isLoading?: boolean;
}

export const AIDetectionWidget: React.FC<AIDetectionWidgetProps> = ({
  result,
  isVisible,
  onToggleVisibility,
  isLoading = false
}) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (score < 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score < 30) return 'Likely Human';
    if (score < 70) return 'Uncertain';
    return 'Likely AI';
  };

  const getProgressBarColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isVisible) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors w-full"
        >
          <EyeIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Show AI Detection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ZapIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">AI Detection</h3>
        </div>
        <button
          onClick={onToggleVisibility}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <EyeSlashIcon className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm">Analyzing...</span>
        </div>
      ) : null}
      
      {!isLoading && result ? (
        <div className="space-y-3">
          {/* Score Display */}
          <div className={`p-3 rounded-lg border ${getScoreColor(result.likelihood_score)}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Likelihood</span>
              <span className="text-lg font-bold">{result.likelihood_score}%</span>
            </div>
            <div className="text-xs mt-1 opacity-75">
              {getScoreLabel(result.likelihood_score)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(result.likelihood_score)}`}
              style={{ width: `${result.likelihood_score}%` }}
            ></div>
          </div>

          {/* Observations */}
          {result.observations && result.observations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Observations:</h4>
              <ul className="space-y-1">
                {result.observations.slice(0, 3).map((observation, index) => (
                  <li key={`observation-${index}-${observation.slice(0, 20)}`} className="text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{observation}</span>
                  </li>
                ))}
              </ul>
              {result.observations.length > 3 && (
                <button className="text-xs text-blue-500 hover:text-blue-700 mt-1">
                  Show {result.observations.length - 3} more...
                </button>
              )}
            </div>
          )}

          {/* Highlighted Segments Count */}
          {result.highlights && result.highlights.length > 0 && (
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="font-medium">{result.highlights.length}</span> suspicious segments detected
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-gray-400 pt-1">
            Updated {new Date(result.last_updated).toLocaleTimeString()}
          </div>
        </div>
      ) : null}
      
      {!isLoading && !result && (
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">Enter text to analyze AI likelihood</p>
        </div>
      )}
    </div>
  );
};
