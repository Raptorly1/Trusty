import { Annotation } from '../types/teacherFeedbackTypes';

export const exportAnnotationsAsHTML = (text: string, annotations: Annotation[]): string => {
  const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);
  
  let html = '<html><head><style>';
  html += `
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    .highlight-yellow { background-color: #fef3c7; }
    .highlight-red { background-color: #fecaca; }
    .highlight-green { background-color: #d1fae5; }
    .highlight-blue { background-color: #dbeafe; }
    .highlight-purple { background-color: #e9d5ff; }
    .comment { border-left: 3px solid #3b82f6; padding-left: 8px; margin: 10px 0; background-color: #f8fafc; }
    .tag { display: inline-block; background-color: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin: 2px; }
    .annotation-info { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
  `;
  html += '</style></head><body>';
  
  html += '<h1>Text Analysis Report</h1>';
  html += '<div class="text-content">';
  
  let currentPos = 0;
  for (const annotation of sortedAnnotations) {
    // Add text before annotation
    if (currentPos < annotation.start) {
      html += escapeHtml(text.slice(currentPos, annotation.start));
    }
    
    // Add annotated text
    if (annotation.type === 'highlight') {
      html += `<span class="highlight-${annotation.color || 'yellow'}">${escapeHtml(annotation.text)}</span>`;
    } else {
      html += escapeHtml(annotation.text);
    }
    
    currentPos = Math.max(currentPos, annotation.end);
  }
  
  // Add remaining text
  if (currentPos < text.length) {
    html += escapeHtml(text.slice(currentPos));
  }
  
  html += '</div>';
  
  // Add annotations summary
  html += '<h2>Annotations Summary</h2>';
  
  const groupedAnnotations = annotations.reduce((groups, annotation) => {
    if (!groups[annotation.type]) groups[annotation.type] = [];
    groups[annotation.type].push(annotation);
    return groups;
  }, {} as Record<string, Annotation[]>);
  
  Object.entries(groupedAnnotations).forEach(([type, anns]) => {
    html += `<div class="annotation-info">`;
    html += `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}s (${anns.length})</h3>`;
    
    anns.forEach(annotation => {
      html += '<div style="margin: 10px 0;">';
      html += `<strong>"${escapeHtml(annotation.text.slice(0, 50))}..."</strong><br>`;
      
      if (annotation.comment) {
        html += `<div class="comment">${escapeHtml(annotation.comment)}</div>`;
      }
      
      if (annotation.tags && annotation.tags.length > 0) {
        annotation.tags.forEach(tag => {
          html += `<span class="tag">${escapeHtml(tag)}</span>`;
        });
      }
      
      html += `<small>Added: ${new Date(annotation.timestamp).toLocaleString()}</small>`;
      html += '</div>';
    });
    
    html += '</div>';
  });
  
  html += '</body></html>';
  return html;
};

export const exportAnnotationsAsJSON = (text: string, annotations: Annotation[]): string => {
  const exportData = {
    text,
    annotations,
    exportedAt: new Date().toISOString(),
    summary: {
      totalAnnotations: annotations.length,
      highlights: annotations.filter(a => a.type === 'highlight').length,
      comments: annotations.filter(a => a.type === 'comment').length,
      tags: annotations.filter(a => a.type === 'tag').length,
    }
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const downloadFile = (content: string, filename: string, contentType: string = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getTextStatistics = (text: string): {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
} => {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const readingTime = Math.ceil(words / 200); // Average reading speed
  
  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTime
  };
};

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
