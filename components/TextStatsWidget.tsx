import React from 'react';
import { BookOpen, Printer } from './Icons';
import { getTextStatistics, exportAnnotationsAsHTML, exportAnnotationsAsJSON, downloadFile } from '../utils/exportUtils';
import { Annotation } from '../types/teacherFeedbackTypes';

interface TextStatsWidgetProps {
  text: string;
  annotations: Annotation[];
}

export const TextStatsWidget: React.FC<TextStatsWidgetProps> = ({ text, annotations }) => {
  const stats = getTextStatistics(text);
  
  const handleExportHTML = () => {
    const html = exportAnnotationsAsHTML(text, annotations);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(html, `text-analysis-${timestamp}.html`, 'text/html');
  };
  
  const handleExportJSON = () => {
    const json = exportAnnotationsAsJSON(text, annotations);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(json, `annotations-${timestamp}.json`, 'application/json');
  };
  
  if (!text.trim()) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900">Text Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-bold text-lg text-gray-900">{stats.words.toLocaleString()}</div>
          <div className="text-gray-600">Words</div>
        </div>
        
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-bold text-lg text-gray-900">{stats.characters.toLocaleString()}</div>
          <div className="text-gray-600">Characters</div>
        </div>
        
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-bold text-lg text-gray-900">{stats.sentences}</div>
          <div className="text-gray-600">Sentences</div>
        </div>
        
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-bold text-lg text-gray-900">{stats.readingTime}</div>
          <div className="text-gray-600">Min Read</div>
        </div>
      </div>
      
      {annotations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Export Options</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Export as HTML Report
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              💾 Export Annotations JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
