'use client';

import { useEffect, useRef, useState } from 'react';
import { Trash2, Upload, Search, ImageIcon, Link2, Plus } from 'lucide-react';
import { apiFetch, getToken } from '../lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface MediaItem {
  id: number;
  url: string;
  originalName: string;
  folder: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Thêm media từ link ảnh
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkFolder, setLinkFolder] = useState('');
  const [addingLink, setAddingLink] = useState(false);

  const fetchMedia = async (q: string, f: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), limit: '40' });
      if (f) params.set('folder', f);
      if (q) params.set('search', q);
      const data = await apiFetch<MediaListResponse>(`/media?${params}`);
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(search, folder, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMedia(search, folder, 1);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append('file', file);
      if (folder) fd.append('folder', folder);
      const res = await fetch(`${BASE_URL}/api/media/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
      fetchMedia(search, folder, 1);
      setPage(1);
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  };

  const handleAddFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = linkUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError('Link ảnh phải bắt đầu bằng http:// hoặc https://');
      return;
    }
    setAddingLink(true);
    setError('');
    try {
      await apiFetch('/media', {
        method: 'POST',
        body: JSON.stringify({
          url,
          originalName: linkName.trim() || undefined,
          folder: linkFolder.trim() || undefined,
        }),
      });
      setLinkUrl('');
      setLinkName('');
      setPage(1);
      fetchMedia(search, folder, 1);
    } catch (e) {
      setError(String(e));
    } finally {
      setAddingLink(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa ảnh này?')) return;
    try {
      await apiFetch(`/media/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      setError(String(e));
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon size={24} />
            Thư viện Media
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} ảnh</p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          <Upload size={16} />
          {uploading ? 'Đang tải...' : 'Upload ảnh'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            files.forEach((f) => handleUpload(f));
            e.target.value = '';
          }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      {/* Thêm media từ link ảnh */}
      <form
        onSubmit={handleAddFromUrl}
        className="mb-5 p-4 bg-blue-50/60 border border-blue-100 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Link2 size={16} className="text-blue-600" />
          Thêm ảnh từ link
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <input
            type="url"
            required
            placeholder="Dán link ảnh (https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 min-w-[220px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Tên (tùy chọn)"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Folder (tùy chọn)"
            value={linkFolder}
            onChange={(e) => setLinkFolder(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={addingLink || !linkUrl.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 shrink-0"
          >
            <Plus size={16} />
            {addingLink ? 'Đang thêm...' : 'Thêm'}
          </button>
        </div>
        {linkUrl.trim() && /^https?:\/\//i.test(linkUrl.trim()) && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-gray-500">Xem trước:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={linkUrl.trim()}
              alt="preview"
              className="h-16 w-16 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </form>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          type="text"
          placeholder="Lọc theo folder..."
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Tìm
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <ImageIcon size={40} className="mb-2 opacity-40" />
          <p className="text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="aspect-square relative bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.originalName}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate font-medium" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
                {item.folder && (
                  <p className="text-xs text-blue-500 truncate">{item.folder}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex hover:bg-red-600 shadow"
                title="Xóa"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
