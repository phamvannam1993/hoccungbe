'use client';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';

interface Lesson { id: string; title: string; }
interface Game {
  id: string; title: string; gameType?: string; lessonId?: string;
  description?: string; instruction?: string; timeLimit?: number;
  points?: number; sortOrder?: number; isActive: boolean;
}
interface GameQuestion {
  id: string; questionText?: string; sortOrder?: number;
  items?: { id: string; content?: string; imageUrl?: string }[];
}

const GAME_TYPES = ['choose_correct', 'connect', 'arrange', 'image_match', 'drag', 'drag_arrange'];

export default function EditGamePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', gameType: '', lessonId: '', description: '',
    instruction: '', timeLimit: '', points: '', sortOrder: '', isActive: true,
  });

  useEffect(() => {
    Promise.all([
      apiFetch<Lesson[] | { data: Lesson[] }>('/lessons'),
      apiFetch<Game>(`/games/${id}`),
    ]).then(([lessonsRes, game]) => {
      setLessons(Array.isArray(lessonsRes) ? lessonsRes : lessonsRes.data || []);
      setForm({
        title: game.title,
        gameType: game.gameType || '',
        lessonId: game.lessonId || '',
        description: game.description || '',
        instruction: game.instruction || '',
        timeLimit: game.timeLimit != null ? String(game.timeLimit) : '',
        points: game.points != null ? String(game.points) : '',
        sortOrder: game.sortOrder != null ? String(game.sortOrder) : '',
        isActive: game.isActive,
      });
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));

    // Try to fetch game questions
    apiFetch<{ questions?: GameQuestion[] } | GameQuestion[]>(`/games/${id}/play`).then((res) => {
      if (Array.isArray(res)) setQuestions(res);
      else if (res && typeof res === 'object' && 'questions' in res) setQuestions(res.questions || []);
    }).catch(() => {});
  }, [id]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/games/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...form,
          timeLimit: form.timeLimit ? Number(form.timeLimit) : undefined,
          points: form.points ? Number(form.points) : undefined,
          sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
        }),
      });
      toast.success('Cập nhật thành công!');
      router.push('/admin/games');
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
        <Link href="/admin/games" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Game</h1>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại game</label>
            <select value={form.gameType} onChange={(e) => set('gameType', e.target.value)}
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
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link href="/admin/games" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Hủy</Link>
        </div>
      </form>

      {/* Game Questions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Câu hỏi trong game ({questions.length})</h2>
        <DataTable
          headers={['ID', 'Nội dung câu hỏi', 'Thứ tự', 'Số items']}
          rows={questions.map((q) => [
            <span key="id" className="text-xs font-mono text-gray-400">{q.id}</span>,
            q.questionText || '-',
            q.sortOrder ?? '-',
            <Badge key="items" label={String(q.items?.length || 0)} variant="blue" />,
          ])}
          emptyMessage="Không có câu hỏi nào"
        />
      </div>
    </div>
  );
}
