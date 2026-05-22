'use client';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

interface Course {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  courseType?: string;
  difficultyLevel?: string;
  targetAgeMin?: number;
  targetAgeMax?: number;
  estimatedMinutes?: number;
  isPublished: boolean;
  isFree: boolean;
  price?: number;
}

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', slug: '', shortDescription: '', description: '', thumbnailUrl: '', videoUrl: '',
    courseType: '', difficultyLevel: '', targetAgeMin: '', targetAgeMax: '',
    estimatedMinutes: '', isPublished: false, isFree: true, price: '',
  });

  useEffect(() => {
    apiFetch<Course>(`/courses/${id}`).then((data) => {
      setForm({
        title: data.title,
        slug: data.slug || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        thumbnailUrl: data.thumbnailUrl || '',
        videoUrl: data.videoUrl || '',
        courseType: data.courseType || '',
        difficultyLevel: data.difficultyLevel || '',
        targetAgeMin: data.targetAgeMin != null ? String(data.targetAgeMin) : '',
        targetAgeMax: data.targetAgeMax != null ? String(data.targetAgeMax) : '',
        estimatedMinutes: data.estimatedMinutes != null ? String(data.estimatedMinutes) : '',
        isPublished: data.isPublished,
        isFree: data.isFree,
        price: data.price != null ? String(data.price) : '',
      });
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/courses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          targetAgeMin: form.targetAgeMin ? Number(form.targetAgeMin) : undefined,
          targetAgeMax: form.targetAgeMax ? Number(form.targetAgeMax) : undefined,
          estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : undefined,
          price: form.price ? Number(form.price) : 0,
        }),
      });
      toast.success('Cập nhật thành công!');
      router.push('/admin/courses');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/courses" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Khóa học</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <input type="text" required value={form.title} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, title: v, slug: slugify(v) })); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
            <input type="text" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh thumbnail</label>
            <input type="text" value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL (video giới thiệu)</label>
            <input type="text" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại khóa học</label>
            <input type="text" value={form.courseType} onChange={(e) => set('courseType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
            <select value={form.difficultyLevel} onChange={(e) => set('difficultyLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi tối thiểu</label>
            <input type="number" value={form.targetAgeMin} onChange={(e) => set('targetAgeMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi tối đa</label>
            <input type="number" value={form.targetAgeMax} onChange={(e) => set('targetAgeMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian ước tính (phút)</label>
            <input type="number" value={form.estimatedMinutes} onChange={(e) => set('estimatedMinutes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (₫)</label>
            <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Xuất bản</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFree} onChange={(e) => set('isFree', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Miễn phí</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link href="/admin/courses" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
