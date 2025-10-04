import React, { useState } from 'react';
import { HIGHLIGHT_COLORS, COMMON_TAGS } from '../types/teacherFeedbackTypes';
import { XCircle } from './Icons';

interface AnnotationControlsProps {
  selectedRange: { start: number; end: number; text: string } | null;
  onAddHighlight: (color: string) => void;
  onAddComment: (comment: string) => void;
  onAddTag: (tags: string[]) => void;
  disabled?: boolean;
}

export const AnnotationControls: React.FC<AnnotationControlsProps> = ({
  selectedRange,
  onAddHighlight,
  onAddComment,
  onAddTag,
  disabled = false
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const handleAddTag = () => {
    if (selectedTags.length > 0) {
      onAddTag(selectedTags);
      setSelectedTags([]);
      setCustomTag('');
      setShowTagInput(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  if (!selectedRange) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        <p className="text-sm">Select text to add highlights, comments, or tags</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-semibold text-gray-900 mb-1">Add Annotation</h3>
        <p className="text-sm text-gray-600 truncate">
          Selected: "{selectedRange.text.slice(0, 50)}..."
        </p>
      </div>

      {/* Highlight Colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Add Highlight</h4>
        <div className="flex flex-wrap gap-2">
          {HIGHLIGHT_COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => onAddHighlight(color.value)}
              disabled={disabled}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${color.className} ${
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'
              }`}
              title={`Highlight in ${color.name}`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Add Comment</h4>
          {!showCommentInput && (
            <button
              onClick={() => setShowCommentInput(true)}
              disabled={disabled}
              className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-50"
            >
              Add Comment
            </button>
          )}
        </div>
        {showCommentInput && (
          <div className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={3}
              disabled={disabled}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCommentInput(false);
                  setCommentText('');
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || disabled}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tag Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Add Tags</h4>
          {!showTagInput && (
            <button
              onClick={() => setShowTagInput(true)}
              disabled={disabled}
              className="text-xs text-blue-500 hover:text-blue-700 disabled:opacity-50"
            >
              Add Tags
            </button>
          )}
        </div>
        {showTagInput && (
          <div className="space-y-3">
            {/* Common Tags */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Common tags:</p>
              <div className="flex flex-wrap gap-1">
                {COMMON_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Custom tag"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              />
              <button
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Add
              </button>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Selected tags:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded border border-green-200"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-green-900"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTagInput(false);
                  setSelectedTags([]);
                  setCustomTag('');
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                disabled={selectedTags.length === 0 || disabled}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
              >
                Add Tags
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
