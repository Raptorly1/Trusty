
import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
  acceptedTypes: string[]; // e.g., ['text/plain', 'image/png']
  prompt: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedTypes, prompt }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (file) {
      if (acceptedTypes.includes(file.type)) {
        const reader = new FileReader();
        if (file.type.startsWith('text/')) {
            reader.onload = (e) => {
                onFileUpload(e.target?.result as string, file.name);
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
             reader.onload = (e) => {
                onFileUpload((e.target?.result as string).split(',')[1], file.name); // Send base64
             };
             reader.readAsDataURL(file);
        }
      } else {
        alert(`Unsupported file type. Please upload one of: ${acceptedTypes.join(', ')}`);
      }
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files ? e.target.files[0] : null);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-200'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept={acceptedTypes.join(',')}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
        <UploadCloud className="h-16 w-16 text-primary/70 mb-4" />
        <p className="text-xl font-semibold text-base-content">{prompt}</p>
        <p className="text-base text-base-content/70">or drag and drop</p>
      </label>
    </div>
  );
};

export default FileUpload;
