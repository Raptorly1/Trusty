import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Annotation, HIGHLIGHT_COLORS } from '../types/teacherFeedbackTypes';

interface AnnotatedTextEditorProps {
  text: string;
  annotations: Annotation[];
  onTextChange: (text: string) => void;
  onSelectionChange: (selection: { start: number; end: number; text: string } | null) => void;
  onAnnotationClick: (annotation: Annotation) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const AnnotatedTextEditor: React.FC<AnnotatedTextEditorProps> = ({
  text,
  annotations,
  onTextChange,
  onSelectionChange,
  onAnnotationClick,
  disabled = false,
  placeholder = "Paste or type your text here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  }, [onTextChange]);

  const handleSelectionChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const selectedText = text.slice(start, end);
      setSelection({ start, end });
      onSelectionChange({ start, end, text: selectedText });
    } else {
      setSelection(null);
      onSelectionChange(null);
    }
  }, [text, onSelectionChange]);

  const getColorClassName = (color: string) => {
    const colorConfig = HIGHLIGHT_COLORS.find(c => c.value === color);
    return colorConfig?.className || 'bg-yellow-200';
  };

  const renderTextWithAnnotations = () => {
    if (!text) return null;

    // Sort annotations by start position
    const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);
    
    const segments: Array<{
      text: string;
      annotation?: Annotation;
      start: number;
      end: number;
    }> = [];
    
    let currentPos = 0;
    
    for (const annotation of sortedAnnotations) {
      // Add text before annotation
      if (currentPos < annotation.start) {
        segments.push({
          text: text.slice(currentPos, annotation.start),
          start: currentPos,
          end: annotation.start
        });
      }
      
      // Add annotated text
      segments.push({
        text: text.slice(annotation.start, annotation.end),
        annotation,
        start: annotation.start,
        end: annotation.end
      });
      
      currentPos = Math.max(currentPos, annotation.end);
    }
    
    // Add remaining text
    if (currentPos < text.length) {
      segments.push({
        text: text.slice(currentPos),
        start: currentPos,
        end: text.length
      });
    }
    
    return segments.map((segment, index) => {
      if (segment.annotation) {
        const colorClass = segment.annotation.type === 'highlight' 
          ? getColorClassName(segment.annotation.color || 'yellow')
          : 'bg-blue-100 border-l-2 border-blue-400';
          
        return (
          <span
            key={`${segment.annotation.id}-${index}`}
            className={`${colorClass} cursor-pointer relative group`}
            onClick={() => onAnnotationClick(segment.annotation!)}
            title={segment.annotation.comment || segment.annotation.tags?.join(', ') || 'Click to view annotation'}
          >
            {segment.text}
            {segment.annotation.type === 'comment' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                💬
              </span>
            )}
            {segment.annotation.type === 'tag' && segment.annotation.tags && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                🏷️
              </span>
            )}
          </span>
        );
      }
      
      return <span key={index}>{segment.text}</span>;
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        {/* Background div with annotations for visual feedback */}
        <div 
          className="absolute inset-0 p-4 text-transparent whitespace-pre-wrap break-words pointer-events-none font-mono text-sm leading-6 border border-gray-300 rounded-lg overflow-hidden"
          style={{ 
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        >
          {renderTextWithAnnotations()}
        </div>
        
        {/* Textarea for actual text input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          disabled={disabled}
          placeholder={placeholder}
          className="relative bg-transparent w-full p-4 min-h-96 resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm leading-6"
          style={{ 
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        />
      </div>
      
      {selection && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Selected: {selection.end - selection.start} characters
        </div>
      )}
    </div>
  );
};
