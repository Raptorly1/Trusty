
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
  acceptedTypes: string[]; // e.g., ['text/plain', 'image/png']
  prompt: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedTypes, prompt }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (file) {
      setError(null);
  // Only allow image/jpeg and image/png
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
        // Check file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
          setError('File is too large. Maximum allowed size is 20MB.');
          return;
        }
        const reader = new FileReader();
        if (file.type.startsWith('text/')) {
            reader.onload = (e) => {
                onFileUpload(e.target?.result as string, file.name);
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
             reader.onload = (e) => {
                let b64 = (e.target?.result as string).split(',')[1];
                // Validate base64: strip whitespace, check length, check padding
                b64 = b64.replace(/\s/g, '');
                if (!b64 || b64.length < 100) {
                  setError('Image file appears to be corrupted or empty.');
                  return;
                }
                // Check base64 padding
                if (b64.length % 4 !== 0) {
                  setError('Image encoding error: base64 string is not properly padded.');
                  return;
                }
                onFileUpload(b64, file.name);
             };
             reader.readAsDataURL(file);
        }
      } else {
  setError('Unsupported file type. Only JPEG and PNG images are allowed.');
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
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 w-full ${isDragging ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-200'}`}
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
          <p className="text-base text-base-content/70 md:inline hidden">or drag and drop</p>
          <p className="text-base text-base-content/70 md:hidden">Tap to select file</p>
        </label>
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
      </div>
  );
};

export default FileUpload;
