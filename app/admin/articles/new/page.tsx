'use client';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import RichTextEditor from '../../components/RichTextEditor';
import ThumbnailUpload from '../../components/ThumbnailUpload';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnailUrl: '',
    category: '',
    tags: '',
    authorName: '',
    isPublished: false,
  });

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch('/articles', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      toast.success('Tạo bài viết thành công!');
      router.push('/admin/articles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tạo bài viết');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/articles" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Bài viết mới</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input
              type="text" required value={form.title}
              onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, title: v, slug: slugify(v) })); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              type="text" required value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
            <textarea
              rows={2} value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
            <RichTextEditor
              value={form.content}
              onChange={(val) => set('content', val)}
              placeholder="Nhập nội dung bài viết..."
              height={400}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
            <ThumbnailUpload value={form.thumbnailUrl} onChange={(url) => set('thumbnailUrl', url)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              value={form.category} onChange={(e) => set('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn danh mục...</option>
              <option value="kien-thuc">Kiến thức</option>
              <option value="kinh-nghiem">Kinh nghiệm</option>
              <option value="tin-tuc">Tin tức</option>
              <option value="hoat-dong">Hoạt động</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
            <input
              type="text" value={form.authorName}
              onChange={(e) => set('authorName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bằng dấu phẩy)</label>
            <input
              type="text" value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="vd: giáo dục, trẻ em, học tập"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.isPublished}
                onChange={(e) => set('isPublished', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Xuất bản ngay</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Tạo bài viết'}
          </button>
          <Link href="/admin/articles" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
