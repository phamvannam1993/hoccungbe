'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ThumbnailUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/upload/image`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else throw new Error(data.message || 'No URL');
    } catch (e) {
      alert('Upload thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {uploading ? 'Đang upload...' : 'Chọn ảnh'}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc nhập URL ảnh..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />

      {value && (
        <div className="relative w-full max-w-xs h-40 rounded-lg overflow-hidden border border-gray-200">
          <Image src={value} alt="thumbnail" fill className="object-cover" unoptimized />
        </div>
      )}
    </div>
  );
}
