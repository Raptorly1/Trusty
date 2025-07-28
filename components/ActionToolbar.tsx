import React from 'react';
import { Refresh, ArrowLeft, Printer } from './Icons';

interface ActionToolbarProps {
  onRegenerate?: () => void;
  onClearAll?: () => void;
  onClearText?: () => void;
  onExport?: () => void;
  onBack?: () => void;
  isGenerating?: boolean;
  hasText?: boolean;
  hasAnnotations?: boolean;
  disabled?: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onRegenerate,
  onClearAll,
  onClearText,
  onExport,
  onBack,
  isGenerating = false,
  hasText = false,
  hasAnnotations = false,
  disabled = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
      {/* Left side - Back button */}
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
      </div>

      {/* Center - Primary actions */}
      <div className="flex items-center gap-2">
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={disabled || !hasText || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Refresh className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Regenerating...' : 'Regenerate Analysis'}
          </button>
        )}
      </div>

      {/* Right side - Secondary actions */}
      <div className="flex items-center gap-2">
        {onExport && hasText && (
          <button
            onClick={onExport}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Export
          </button>
        )}
        
        {onClearAll && hasAnnotations && (
          <button
            onClick={onClearAll}
            disabled={disabled}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            Clear Annotations
          </button>
        )}
        
        {onClearText && hasText && (
          <button
            onClick={onClearText}
            disabled={disabled}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActionToolbar;
