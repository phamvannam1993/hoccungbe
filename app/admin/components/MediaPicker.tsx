'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, CloudUpload } from 'lucide-react';
import { apiFetch, getToken } from '../lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MediaItem {
  id: number;
  url: string;
  originalName: string;
  folder: string;
  createdAt: string;
}

interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Props {
  value: string;
  folder?: string;
  onChange: (url: string) => void;
}

const LIMIT = 12;

export default function MediaPicker({ value, folder = 'quizzes', onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async (p: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      const data = await apiFetch<MediaListResponse>(`/media?${params}`);
      setItems((prev) => append ? [...prev, ...data.items] : data.items);
      setHasMore(p < data.totalPages);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === 'library') fetchMedia(1, false);
  }, [open, tab, fetchMedia]);

  const handleUpload = async (file: File) => {
    setUploadError('');
    setUploading(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const url = `${BASE_URL}/api/media/upload`;
      console.log('[MediaPicker] Uploading to', url, 'file:', file.name, file.size, 'bytes');
      const res = await fetch(url, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);
      const data: MediaItem = JSON.parse(txt);
      onChange(data.url);
      setOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload thất bại';
      console.error('[MediaPicker] Upload error:', err);
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  };

  return (
    <>
      {/* Trigger */}
      {value ? (
        <div className="relative inline-block">
          <button type="button" onClick={() => setOpen(true)} className="block">
            <Image
              src={value}
              alt="preview"
              width={80}
              height={80}
              className="rounded-lg border border-gray-200 object-cover w-20 h-20 hover:opacity-80 transition-opacity"
            />
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setOpen(true); setTab('upload'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <CloudUpload size={13} />
          Chọn ảnh
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Chọn ảnh</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {(['upload', 'library'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors ${
                    tab === t
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'upload' ? 'Tải lên từ máy tính' : 'Thư viện ảnh'}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {tab === 'upload' && (
                <>
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    style={{ minHeight: 280 }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f);
                        e.target.value = '';
                      }}
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3 text-blue-500">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Đang tải lên...</span>
                      </div>
                    ) : (
                      <>
                        <CloudUpload size={48} className="text-gray-400" strokeWidth={1.5} />
                        <span className="text-sm text-gray-500">Bấm để chọn ảnh hoặc kéo thả vào đây</span>
                      </>
                    )}
                  </label>
                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {uploadError}
                    </div>
                  )}
                </>
              )}

              {tab === 'library' && (
                <>
                  {loading && items.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Đang tải...</div>
                  ) : items.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chưa có ảnh nào</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-3">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => { onChange(item.url); setOpen(false); }}
                            className="group relative aspect-square rounded-xl border-2 border-transparent hover:border-blue-500 overflow-hidden bg-gray-100 transition-all"
                          >
                            <Image
                              src={item.url}
                              alt={item.originalName ?? ''}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                          </button>
                        ))}
                      </div>

                      {hasMore && (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => fetchMedia(page + 1, true)}
                          className="mt-4 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-colors"
                        >
                          {loading ? 'Đang tải...' : 'Tải thêm'}
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  );
}
