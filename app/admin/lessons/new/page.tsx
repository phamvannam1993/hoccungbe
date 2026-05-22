'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';

interface Course { id: string; title: string; }
interface Volume { id: string; courseId: string; name: string; sortOrder: number; }
interface Topic { id: string; courseId: string; volumeId?: string; name: string; sortOrder: number; }

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function NewLessonPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    courseId: '', title: '', slug: '', lessonType: '', content: '',
    volumeId: '', topicId: '',
    videoUrl: '', audioUrl: '', thumbnailUrl: '', sortOrder: '',
    durationMinutes: '', isPreview: false, isPublished: false,
  });

  useEffect(() => {
    apiFetch<Course[] | { data: Course[] }>('/courses').then((res) => {
      setCourses(Array.isArray(res) ? res : res.data || []);
    }).catch(() => {});
  }, []);

  // Load volumes when courseId changes
  useEffect(() => {
    if (!form.courseId) { setVolumes([]); setTopics([]); return; }
    apiFetch<Volume[]>(`/volumes?courseId=${form.courseId}`).then((res) => {
      setVolumes(Array.isArray(res) ? res : []);
    }).catch(() => setVolumes([]));
    setForm((f) => ({ ...f, volumeId: '', topicId: '' }));
  }, [form.courseId]);

  // Load topics when courseId or volumeId changes
  useEffect(() => {
    if (!form.courseId) { setTopics([]); return; }
    const params = new URLSearchParams({ courseId: form.courseId });
    if (form.volumeId) params.set('volumeId', form.volumeId);
    apiFetch<Topic[]>(`/topics?${params.toString()}`).then((res) => {
      setTopics(Array.isArray(res) ? res : []);
    }).catch(() => setTopics([]));
    setForm((f) => ({ ...f, topicId: '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.courseId, form.volumeId]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch('/lessons', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          courseId: Number(form.courseId),
          volumeId: form.volumeId ? Number(form.volumeId) : undefined,
          topicId: form.topicId ? Number(form.topicId) : undefined,
          sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
          durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
        }),
      });
      toast.success('Tạo bài học thành công!');
      router.push('/admin/lessons');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tạo bài học');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/lessons" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Bài học mới</h1>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học <span className="text-red-500">*</span></label>
            <select required value={form.courseId} onChange={(e) => set('courseId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn khóa học --</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
            <input type="text" required value={form.title} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, title: v, slug: slugify(v) })); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Volume & Topic dropdowns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tập</label>
            <select value={form.volumeId} onChange={(e) => set('volumeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Không có --</option>
              {volumes.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {form.courseId && volumes.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">Chưa có tập nào. <Link href="/admin/volumes" className="text-blue-500 hover:underline">Tạo tập</Link></p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
            <select value={form.topicId} onChange={(e) => set('topicId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Không có --</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {form.courseId && topics.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">Chưa có chủ đề. <Link href="/admin/topics" className="text-blue-500 hover:underline">Tạo chủ đề</Link></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài học</label>
            <select value={form.lessonType} onChange={(e) => set('lessonType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn...</option>
              <option value="video">Video</option>
              <option value="story">Câu chuyện</option>
              <option value="game">Trò chơi</option>
              <option value="quiz">Kiểm tra</option>
              <option value="interactive">Tương tác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
            <input type="number" value={form.durationMinutes} onChange={(e) => set('durationMinutes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL (video bài giảng)</label>
            <input type="text" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio</label>
            <input type="text" value={form.audioUrl} onChange={(e) => set('audioUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
            <input type="text" value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea rows={5} value={form.content} onChange={(e) => set('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPreview} onChange={(e) => set('isPreview', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Preview miễn phí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Xuất bản</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Tạo bài học'}
          </button>
          <Link href="/admin/lessons" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
