
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string, mimeType?: string) => void;
  acceptedTypes: string[]; // e.g., ['text/plain', 'image/png']
  prompt: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, acceptedTypes, prompt }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matchesAcceptedType = (fileType: string) => acceptedTypes.some((acceptedType) => {
    if (acceptedType.endsWith('/*')) {
      return fileType.startsWith(acceptedType.slice(0, -1));
    }

    return fileType === acceptedType;
  });

  const readFileAsText = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error('Unable to read text file.'));
    reader.readAsText(file);
  });

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to decode image.'));
    image.src = src;
  });

  const processImage = async (file: File) => {
    const originalDataUrl = await readFileAsDataUrl(file);
    const image = await loadImage(originalDataUrl);
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));

    if (scale === 1 && file.size <= 3 * 1024 * 1024) {
      return {
        content: originalDataUrl.split(',')[1] ?? '',
        mimeType: file.type,
        fileName: file.name,
      };
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to process image.');
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    return {
      content: compressedDataUrl.split(',')[1] ?? '',
      mimeType: 'image/jpeg',
      fileName: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    };
  };

  const handleFile = async (file: File | null) => {
    if (file) {
      setError(null);
      if (!matchesAcceptedType(file.type)) {
        setError(`Unsupported file type. Accepted types: ${acceptedTypes.join(', ')}`);
        return;
      }

      if (file.type.startsWith('text/')) {
        const textContent = await readFileAsText(file);
        onFileUpload(textContent, file.name, file.type);
        return;
      }

      if (file.type.startsWith('image/')) {
        if (file.size > 25 * 1024 * 1024) {
          setError('File is too large. Maximum allowed size is 25MB.');
          return;
        }

        const imageData = await processImage(file);

        if (!imageData.content || imageData.content.length < 100) {
          setError('Image file appears to be corrupted or empty.');
          return;
        }

        onFileUpload(imageData.content, imageData.fileName, imageData.mimeType);
        return;
      }

      setError(`Unsupported file type. Accepted types: ${acceptedTypes.join(', ')}`);
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
