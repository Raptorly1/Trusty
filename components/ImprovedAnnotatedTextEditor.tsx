import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Annotation } from '../types/teacherFeedbackTypes';
import { AlertTriangle, Brain, BookOpen, InfoIcon, XCircle } from './Icons';

interface AnnotatedTextEditorProps {
  text: string;
  annotations: Annotation[];
  activeAnnotationId?: string | null;
  onTextChange: (text: string) => void;
  onAnnotationChange?: (annotations: Annotation[]) => void;
  onAnnotationSelect?: (id: string | null) => void;
  onAnnotationEdit?: (id: string, text: string, comment: string) => void;
  onAnnotationDelete?: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Enhanced annotation with categorization
interface EnhancedAnnotation extends Annotation {
  category: 'ai-warning' | 'complexity' | 'factual' | 'general';
  priority: 'high' | 'medium' | 'low';
}

// Smart categorization based on comment content
function categorizeAnnotation(annotation: Annotation): EnhancedAnnotation {
  const comment = (annotation.comment || '').toLowerCase();
  
  if (comment.includes('ai') || comment.includes('generated') || comment.includes('artificial')) {
    return { ...annotation, category: 'ai-warning', priority: 'high' };
  }
  
  if (comment.includes('complex') || comment.includes('difficult') || comment.includes('simplify')) {
    return { ...annotation, category: 'complexity', priority: 'medium' };
  }
  
  if (comment.includes('fact') || comment.includes('verify') || comment.includes('source') || comment.includes('claim')) {
    return { ...annotation, category: 'factual', priority: 'high' };
  }
  
  return { ...annotation, category: 'general', priority: 'low' };
}

// Get category styling
function getCategoryStyle(category: string, isActive: boolean = false) {
  const baseStyle = {
    borderRadius: '2px',
    padding: '0 2px',
    position: 'relative' as const,
    transition: 'all 0.2s ease'
  };

  const styles = {
    'ai-warning': {
      backgroundColor: isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.15)',
      borderBottom: '2px solid #ef4444',
      color: '#dc2626'
    },
    'complexity': {
      backgroundColor: isActive ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)',
      borderBottom: '2px solid #f59e0b',
      color: '#d97706'
    },
    'factual': {
      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)',
      borderBottom: '2px solid #3b82f6',
      color: '#2563eb'
    },
    'general': {
      backgroundColor: isActive ? 'rgba(107, 114, 128, 0.3)' : 'rgba(107, 114, 128, 0.15)',
      borderBottom: '2px solid #6b7280',
      color: '#4b5563'
    }
  };

  return { ...baseStyle, ...styles[category as keyof typeof styles] };
}

// Get category icon
function getCategoryIcon(category: string) {
  const iconProps = { className: "h-4 w-4 inline mr-1" };
  switch (category) {
    case 'ai-warning': return <AlertTriangle {...iconProps} />;
    case 'complexity': return <Brain {...iconProps} />;
    case 'factual': return <BookOpen {...iconProps} />;
    default: return <InfoIcon {...iconProps} />;
  }
}

export const AnnotatedTextEditor: React.FC<AnnotatedTextEditorProps> = ({
  text,
  annotations,
  activeAnnotationId,
  onTextChange,
  onAnnotationSelect,
  onAnnotationEdit,
  onAnnotationDelete,
  disabled = false,
  placeholder = "Paste or type your text here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editComment, setEditComment] = useState('');

  // Enhanced annotations with categorization
  const enhancedAnnotations = annotations.map(categorizeAnnotation);

  // Synchronize scroll between textarea and overlay
  const handleScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleTextChangeInternal = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  }, [onTextChange]);

  // Create highlighted text segments
  const createHighlightedText = () => {
    if (!text || enhancedAnnotations.length === 0) {
      return [{ text, annotation: null }];
    }

    // Sort annotations by start position
    const sortedAnnotations = [...enhancedAnnotations].sort((a, b) => a.start - b.start);
    
    const segments: Array<{ text: string; annotation: EnhancedAnnotation | null }> = [];
    let currentIndex = 0;

    for (const annotation of sortedAnnotations) {
      // Add text before annotation
      if (currentIndex < annotation.start) {
        segments.push({
          text: text.slice(currentIndex, annotation.start),
          annotation: null
        });
      }

      // Add annotated text
      segments.push({
        text: text.slice(annotation.start, annotation.end),
        annotation
      });

      currentIndex = Math.max(currentIndex, annotation.end);
    }

    // Add remaining text
    if (currentIndex < text.length) {
      segments.push({
        text: text.slice(currentIndex),
        annotation: null
      });
    }

    return segments;
  };

  const segments = createHighlightedText();

  const handleAnnotationClick = useCallback((annotation: EnhancedAnnotation) => {
    if (onAnnotationSelect) {
      onAnnotationSelect(activeAnnotationId === annotation.id ? null : annotation.id);
    }
  }, [activeAnnotationId, onAnnotationSelect]);

  const handleEditStart = (annotation: Annotation) => {
    setEditingAnnotation(annotation.id);
    setEditText(annotation.text);
    setEditComment(annotation.comment || '');
  };

  const handleEditSave = () => {
    if (editingAnnotation && onAnnotationEdit) {
      onAnnotationEdit(editingAnnotation, editText, editComment);
    }
    setEditingAnnotation(null);
    setEditText('');
    setEditComment('');
  };

  const handleEditCancel = () => {
    setEditingAnnotation(null);
    setEditText('');
    setEditComment('');
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'ai-warning': return 'AI Content Warning';
      case 'complexity': return 'Complexity Issue';
      case 'factual': return 'Factual Concern';
      default: return 'General Note';
    }
  };

  return (
    <div className="space-y-4">
      {/* Annotation Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">AI Content</span>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-amber-600" />
          <span className="text-amber-600">Complexity</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600">Factual</span>
        </div>
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-gray-600" />
          <span className="text-gray-600">General</span>
        </div>
      </div>

      {/* Text Editor Container */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChangeInternal}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full h-64 p-4 resize-none border-none outline-none bg-transparent relative z-10 font-mono text-sm leading-relaxed"
          style={{
            background: 'transparent',
            color: 'transparent',
            caretColor: '#000'
          }}
        />

        {/* Overlay with highlighting */}
        <div
          ref={overlayRef}
          className="absolute inset-0 p-4 pointer-events-none overflow-hidden font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
          style={{
            color: '#000',
            wordBreak: 'break-word'
          }}
        >
          {segments.map((segment, index) => {
            if (segment.annotation) {
              const isActive = activeAnnotationId === segment.annotation.id;
              const style = getCategoryStyle(segment.annotation.category, isActive);

              return (
                <button
                  key={`${segment.annotation.id}-${index}`}
                  className="relative hover:opacity-80 transition-opacity pointer-events-auto border-none outline-none p-0 m-0 font-mono text-sm leading-relaxed"
                  style={style}
                  onClick={() => handleAnnotationClick(segment.annotation!)}
                  aria-label={`Annotation: ${segment.annotation.comment || 'No comment'}`}
                  type="button"
                >
                  {segment.text}
                </button>
              );
            }
            return <span key={`text-segment-${index}`}>{segment.text}</span>;
          })}
        </div>
      </div>

      {/* Active Annotation Details */}
      {activeAnnotationId && (
        (() => {
          const activeAnnotation = enhancedAnnotations.find(a => a.id === activeAnnotationId);
          if (!activeAnnotation) return null;

          return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(activeAnnotation.category)}
                  <span className="font-semibold text-gray-900">
                    {getCategoryTitle(activeAnnotation.category)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStart(activeAnnotation)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Edit annotation"
                    type="button"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onAnnotationDelete?.(activeAnnotation.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete annotation"
                    type="button"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => onAnnotationSelect?.(null)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Close"
                    type="button"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {editingAnnotation === activeAnnotation.id ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="edit-text" className="block text-sm font-medium text-gray-700 mb-1">
                      Highlighted Text
                    </label>
                    <input
                      id="edit-text"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      id="edit-comment"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Text: </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                      "{activeAnnotation.text}"
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Comment: </span>
                    <span className="text-gray-900">{activeAnnotation.comment || 'No comment'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
  );
};
