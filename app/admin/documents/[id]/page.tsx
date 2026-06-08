'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { apiFetch } from '../../lib/api';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Document {
  id: number;
  title: string;
  description?: string;
  pdfUrl: string;
  slug?: string;
  isActive: boolean;
  sortOrder: number;
  categoryId?: number;
}

export default function DocumentFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  const [form, setForm] = useState<Document>({
    id: 0,
    title: '',
    description: '',
    pdfUrl: '',
    slug: '',
    isActive: true,
    sortOrder: 999,
    categoryId: undefined,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [useDirectUrl, setUseDirectUrl] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (isNew) return;
    apiFetch<Document>(`/documents/${id}`)
      .then((data) => {
        console.log('[Document Loaded]', data);
        setForm(data);
      })
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const fetchCategories = async () => {
    try {
      const baseUrl = typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
        : 'http://localhost:3001';

      const url = `${baseUrl}/api/categories`;
      console.log('[fetchCategories] Fetching from:', url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('[fetchCategories] Success:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('[fetchCategories] Error:', error);
      setCategories([]);
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // Remove diacritics
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }
      console.log('[handleChange]', name, '=', (updated as any)[name]);
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Chỉ chấp nhận file PDF');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File không vượt quá 50MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get token for authorization
      const token = localStorage.getItem('bhh_admin_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/api/upload/pdf`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (!data.url) {
        throw new Error('No URL returned from server');
      }

      setForm(prev => ({ ...prev, pdfUrl: data.url }));
      setFileName(file.name);
      toast.success('Tải lên thành công');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err instanceof Error ? err.message : 'Lỗi tải lên file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.pdfUrl) {
      toast.error('Vui lòng nhập tiêu đề và link PDF');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        pdfUrl: form.pdfUrl,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        isActive: form.isActive,
        sortOrder: form.sortOrder,
        ...(form.categoryId && { categoryId: form.categoryId }),
      };

      console.log('[handleSubmit] Payload:', payload);
      console.log('[handleSubmit] Form categoryId:', form.categoryId);

      if (isNew) {
        await apiFetch('/documents', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Đã thêm tài liệu');
      } else {
        await apiFetch(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Đã lưu');
      }
      router.push('/admin/documents');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi lưu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Đang tải...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{isNew ? 'Thêm Tài Liệu' : `Sửa: ${form.title}`}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Thông Tin Cơ Bản</h2>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu Đề *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
              placeholder="180 Bài Toán Cơ Bản"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mô Tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              placeholder="Mô tả ngắn về tài liệu..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Danh Mục</label>
            <select
              name="categoryId"
              value={form.categoryId || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                console.log('[Category Select] Changed to:', value, 'Categories available:', categories);
                setForm(prev => ({ ...prev, categoryId: value }));
              }}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
            >
              <option value="" className="text-gray-700">Không chọn danh mục</option>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="text-gray-900">
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled className="text-gray-500">Đang tải danh mục...</option>
              )}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Chưa có danh mục. Tạo danh mục ở /admin/categories trước.</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useDirectUrl}
                  onChange={() => setUseDirectUrl(true)}
                />
                <span className="text-sm font-medium text-gray-700">URL PDF trực tiếp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useDirectUrl}
                  onChange={() => setUseDirectUrl(false)}
                />
                <span className="text-sm font-medium text-gray-700">Upload File (S3)</span>
              </label>
            </div>

            {useDirectUrl ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Link PDF *</label>
                <input
                  type="url"
                  name="pdfUrl"
                  value={form.pdfUrl}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
                  placeholder="https://example.com/file.pdf"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">File PDF *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? 'Đang tải...' : fileName || 'Nhấp để chọn file PDF'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tối đa 50MB</p>
                  </label>
                </div>
                {form.pdfUrl && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✓ File đã tải lên: {form.pdfUrl.split('/').pop()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Slug (tự sinh, có thể sửa)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">/tai-lieu/</span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Cài Đặt</h2>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              id="isActive"
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Hoạt động
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Thứ Tự Sắp Xếp</label>
            <input
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              min="0"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
