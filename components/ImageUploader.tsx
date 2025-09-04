import React, { useCallback, useRef } from 'react';
import type { UploadedFile } from '../types';

interface ImageUploaderProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  multiple: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesUpload, multiple }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const uploadedFiles = Array.from(files).map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        preview: URL.createObjectURL(file),
      }));
      onFilesUpload(uploadedFiles);
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center transition-colors hover:border-purple-500 hover:bg-gray-800 focus-within:border-purple-500 focus-within:bg-gray-800">
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        ref={inputRef}
        aria-hidden="true"
      />
      <label 
        htmlFor="file-upload" 
        className="flex flex-col items-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            inputRef.current?.click();
          }
        }}
        aria-label="Upload images"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-semibold text-white">اسحب وأفلت الصور هنا، أو انقر للتصفح</p>
        <p className="text-sm text-gray-400">يدعم PNG, JPG, WEBP</p>
      </label>
    </div>
  );
};

export default ImageUploader;
