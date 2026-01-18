import React from 'react';
import { Annotation, HIGHLIGHT_COLORS } from '../types/teacherFeedbackTypes';
import { ChatBubble, XCircle } from './Icons';

interface AnnotationsSidebarProps {
  annotations: Annotation[];
  onDeleteAnnotation: (id: string) => void;
  onAnnotationClick: (annotation: Annotation) => void;
  activeAnnotationId?: string | null;
}

export const AnnotationsSidebar: React.FC<AnnotationsSidebarProps> = ({
  annotations,
  onDeleteAnnotation,
  onAnnotationClick,
  activeAnnotationId
}) => {
  const getColorClassName = (color?: string) => {
    const colorConfig = HIGHLIGHT_COLORS.find(c => c.value === color);
    return colorConfig?.className || 'bg-yellow-200';
  };

  const groupedAnnotations = annotations.reduce((groups, annotation) => {
    if (!groups[annotation.type]) {
      groups[annotation.type] = [];
    }
    groups[annotation.type].push(annotation);
    return groups;
  }, {} as Record<string, Annotation[]>);

  if (annotations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Annotations</h3>
        <div className="text-center text-gray-500 py-8">
          <ChatBubble className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No annotations yet</p>
          <p className="text-xs text-gray-400 mt-1">Select text to add highlights, comments, or tags</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Annotations</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {annotations.length}
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Highlights */}
        {groupedAnnotations.highlight && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-300 rounded"></div>
              Highlights ({groupedAnnotations.highlight.length})
            </h4>
            <div className="space-y-2">
              {groupedAnnotations.highlight.map(annotation => (
                <button
                  key={annotation.id}
                  className={`w-full p-2 border rounded-lg cursor-pointer transition-colors text-left ${
                    activeAnnotationId === annotation.id 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onAnnotationClick(annotation)}
                  onKeyDown={(e) => e.key === 'Enter' && onAnnotationClick(annotation)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs p-1 rounded ${getColorClassName(annotation.color)} mb-1`}>
                        {annotation.color || 'yellow'}
                      </div>
                      <p className="text-sm text-gray-900 truncate">
                        "{annotation.text}"
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnnotation(annotation.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete annotation"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {groupedAnnotations.comment && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ChatBubble className="h-4 w-4 text-blue-500" />
              Comments ({groupedAnnotations.comment.length})
            </h4>
            <div className="space-y-2">
              {groupedAnnotations.comment.map(annotation => (
                <button
                  key={annotation.id}
                  className={`w-full p-3 border rounded-lg cursor-pointer transition-colors text-left ${
                    activeAnnotationId === annotation.id 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onAnnotationClick(annotation)}
                  onKeyDown={(e) => e.key === 'Enter' && onAnnotationClick(annotation)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="bg-blue-100 border-l-2 border-blue-400 p-1 mb-2">
                        <p className="text-xs text-gray-600 truncate">
                          "{annotation.text}"
                        </p>
                      </div>
                      <p className="text-sm text-gray-900">
                        {annotation.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(annotation.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnnotation(annotation.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete comment"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {groupedAnnotations.tag && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-green-500">🏷️</span>
              Tags ({groupedAnnotations.tag.length})
            </h4>
            <div className="space-y-2">
              {groupedAnnotations.tag.map(annotation => (
                <button
                  key={annotation.id}
                  className={`w-full p-2 border rounded-lg cursor-pointer transition-colors text-left ${
                    activeAnnotationId === annotation.id 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onAnnotationClick(annotation)}
                  onKeyDown={(e) => e.key === 'Enter' && onAnnotationClick(annotation)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate mb-2">
                        "{annotation.text}"
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {annotation.tags?.map(tag => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded border border-green-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnnotation(annotation.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete tags"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
