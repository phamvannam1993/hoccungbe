'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAudioLibrary } from '../hooks/useAudioLibrary';
import { validateAudioFile, validateTitle } from '../utils/audioHelpers';
import { UploadFormData } from '../types';

interface AudioUploadFormProps {
  onSuccess?: () => void;
}

export default function AudioUploadForm({ onSuccess }: AudioUploadFormProps) {
  const { uploadAudio, isUploading } = useAudioLibrary();
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    file: null as unknown as File,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate title
    const titleValidation = validateTitle(formData.title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error || '';
    }

    // Validate file
    if (!formData.file) {
      newErrors.file = 'Vui lòng chọn tệp âm thanh';
    } else {
      const fileValidation = validateAudioFile(formData.file);
      if (!fileValidation.valid) {
        newErrors.file = fileValidation.error || '';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    if (file) {
      const validation = validateAudioFile(file);
      if (validation.valid) {
        setFormData(prev => ({ ...prev, file }));
        setErrors(prev => ({ ...prev, file: '' }));
      } else {
        setErrors(prev => ({ ...prev, file: validation.error || '' }));
      }
    }
  };

  // Handle drag over
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await uploadAudio(formData);
    if (result) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        file: null as unknown as File,
      });
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Nhập tiêu đề âm thanh"
          value={formData.title}
          onChange={e => {
            setFormData(prev => ({ ...prev, title: e.target.value }));
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isUploading}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          placeholder="Nhập mô tả âm thanh (tùy chọn)"
          value={formData.description || ''}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tệp âm thanh <span className="text-red-500">*</span>
        </label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : errors.file
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.mp4,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
            onChange={e => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
            disabled={isUploading}
          />

          <Upload
            size={32}
            className={`mx-auto mb-2 ${
              errors.file ? 'text-red-500' : dragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <p className="text-gray-700 font-medium">
            {formData.file ? (
              <span className="text-green-600 flex items-center justify-center gap-2">
                {formData.file.name}
              </span>
            ) : (
              <>Kéo và thả tệp hoặc nhấp để chọn</>
            )}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Hỗ trợ: MP3, WAV, M4A (tối đa 50MB)
          </p>
        </div>
        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              file: null as unknown as File,
            });
            setErrors({});
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          disabled={isUploading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Xóa
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload size={18} />
              Tải lên
            </>
          )}
        </button>
      </div>
    </form>
  );
}
