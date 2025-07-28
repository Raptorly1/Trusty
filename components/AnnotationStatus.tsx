import React from 'react';
import { Sparkles, Refresh } from './Icons';

interface AnnotationStatusProps {
  isGenerating: boolean;
  annotationCount: number;
  onRegenerate: () => void;
  disabled?: boolean;
}

export const AnnotationStatus: React.FC<AnnotationStatusProps> = ({
  isGenerating,
  annotationCount,
  onRegenerate,
  disabled = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
        </div>
        {!isGenerating && annotationCount > 0 && (
          <button
            onClick={onRegenerate}
            disabled={disabled}
            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Refresh className="h-3 w-3" />
            Refresh Analysis
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm">Analyzing text to help you understand it better...</span>
        </div>
      )}

      {!isGenerating && annotationCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">✓ Analysis Complete</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {annotationCount} helpful notes
            </span>
          </div>
          <p className="text-sm text-gray-600">
            I've added helpful explanations to make this text easier to understand. Look for the colored highlights and notes!
          </p>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-blue-800 mb-1">What to look for:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>🤖 <span className="font-medium text-red-600">Red highlights:</span> Possible AI-generated text</li>
              <li>📚 <span className="font-medium text-yellow-600">Yellow highlights:</span> Complex words explained</li>
              <li>📊 <span className="font-medium text-blue-600">Blue highlights:</span> Facts to verify</li>
              <li>💬 <span className="font-medium text-gray-600">Comments:</span> Helpful explanations</li>
            </ul>
          </div>
        </div>
      )}

      {!isGenerating && annotationCount === 0 && (
        <div className="text-center text-gray-500 py-4">
          <p className="text-sm">Enter some text above and I'll help you understand it!</p>
          <p className="text-xs text-gray-400 mt-1">I'll highlight complex words, check for AI content, and explain difficult concepts.</p>
        </div>
      )}
    </div>
  );
};
