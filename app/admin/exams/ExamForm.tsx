'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

export interface ExamFormData {
  id?: number;
  title: string;
  slug: string;
  subject: string;
  grade: number;
  semester: number;
  description?: string;
  timeLimitMinutes?: number;
  totalPoints: number;
  isActive: boolean;
}

interface Props {
  initial?: ExamFormData;
  mode: 'create' | 'edit';
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');

export default function ExamForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ExamFormData>(initial ?? {
    title: '',
    slug: '',
    subject: 'toan',
    grade: 1,
    semester: 1,
    description: '',
    timeLimitMinutes: 40,
    totalPoints: 10,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof ExamFormData>(k: K, v: ExamFormData[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Vui lòng nhập tên đề thi'); return; }
    if (!form.slug.trim()) { setError('Vui lòng nhập slug'); return; }
    setSaving(true);
    try {
      if (mode === 'create') {
        await apiFetch('/exams', { method: 'POST', body: JSON.stringify(form) });
      } else {
        await apiFetch(`/exams/${form.id}`, { method: 'PATCH', body: JSON.stringify(form) });
      }
      router.push('/admin/exams');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đề thi *</label>
        <input type="text" value={form.title}
          onChange={(e) => {
            update('title', e.target.value);
            if (mode === 'create' && (!form.slug || form.slug === slugify(form.title))) {
              update('slug', slugify(e.target.value));
            }
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          placeholder="VD: Kiểm tra giữa học kỳ 1 - Toán lớp 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
        <input type="text" value={form.slug}
          onChange={(e) => update('slug', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none font-mono text-sm"
          placeholder="kiem-tra-giua-hk1-toan-lop-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Môn</label>
          <select value={form.subject} onChange={(e) => update('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option value="toan">Toán</option>
            <option value="tieng-viet">Tiếng Việt</option>
            <option value="tieng-anh">Tiếng Anh</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Lớp</label>
          <select value={form.grade} onChange={(e) => update('grade', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Học kỳ</label>
          <select value={form.semester} onChange={(e) => update('semester', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option value={1}>HK1</option>
            <option value={2}>HK2</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
        <textarea value={form.description ?? ''}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-y"
          placeholder="Mô tả ngắn về đề thi..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời gian (phút)</label>
          <input type="number" min={1} value={form.timeLimitMinutes ?? ''}
            onChange={(e) => update('timeLimitMinutes', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
            placeholder="Để trống = không giới hạn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổng điểm</label>
          <input type="number" min={1} value={form.totalPoints}
            onChange={(e) => update('totalPoints', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive}
          onChange={(e) => update('isActive', e.target.checked)} className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Hiển thị công khai</label>
      </div>

      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo đề thi' : 'Cập nhật'}
        </button>
        <button type="button" onClick={() => router.push('/admin/exams')}
          className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">
          Hủy
        </button>
      </div>
    </form>
  );
}
