import React, { useCallback } from 'react';
import { BookOpen } from './Icons';

interface FileUploadProps {
  onTextLoaded: (text: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTextLoaded, disabled = false }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onTextLoaded(text);
      }
    };
    
    // Handle different file types
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      // For PDF, we'd need a PDF parsing library, but for now show an error
      alert('PDF support coming soon! Please copy and paste the text for now.');
      event.target.value = '';
    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      // For Word docs, we'd need a parsing library
      alert('Word document support coming soon! Please copy and paste the text for now.');
      event.target.value = '';
    } else {
      // Try to read as text anyway
      reader.readAsText(file);
    }
  }, [onTextLoaded]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <BookOpen className="h-12 w-12 text-gray-400" />
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Text File</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a .txt file or copy and paste text directly into the editor below
          </p>
          <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
            <span>Choose File</span>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf,text/*"
              onChange={handleFileUpload}
              disabled={disabled}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Supported formats: .txt files (PDF and Word coming soon)
        </p>
      </div>
    </div>
  );
};
