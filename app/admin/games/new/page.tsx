'use client';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Lesson { id: string; title: string; }

const GAME_TYPES = ['choose_correct', 'connect', 'arrange', 'image_match', 'drag', 'drag_arrange'];

export default function NewGamePage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', gameType: '', lessonId: '', description: '',
    instruction: '', timeLimit: '', points: '', sortOrder: '', isActive: true,
  });

  useEffect(() => {
    apiFetch<Lesson[] | { data: Lesson[] }>('/lessons').then((res) => {
      setLessons(Array.isArray(res) ? res : res.data || []);
    }).catch(() => {});
  }, []);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch('/games', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          timeLimit: form.timeLimit ? Number(form.timeLimit) : undefined,
          points: form.points ? Number(form.points) : undefined,
          sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
        }),
      });
      toast.success('Tạo game thành công!');
      router.push('/admin/games');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tạo game');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/games" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Thêm Game mới</h1>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
            <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại game <span className="text-red-500">*</span></label>
            <select required value={form.gameType} onChange={(e) => set('gameType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn loại --</option>
              {GAME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bài học</label>
            <select value={form.lessonId} onChange={(e) => set('lessonId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn bài học --</option>
              {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn</label>
            <textarea rows={2} value={form.instruction} onChange={(e) => set('instruction', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn thời gian (giây)</label>
            <input type="number" value={form.timeLimit} onChange={(e) => set('timeLimit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm</label>
            <input type="number" value={form.points} onChange={(e) => set('points', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer mt-6">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Kích hoạt</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Tạo game'}
          </button>
          <Link href="/admin/games" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Hủy</Link>
        </div>
      </form>
    </div>
  );
}
