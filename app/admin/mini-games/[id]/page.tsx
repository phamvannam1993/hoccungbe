'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface MiniGameForm {
  slug: string;
  routeKey: string;
  title: string;
  emoji: string;
  description: string;
  age: string;
  ageGroup: string;
  category: string;
  groupKey: string;
  difficulty: string;
  skills: string;
  sortOrder: number;
  showOnHomepage: boolean;
  homepageOrder: number;
  isActive: boolean;
  status: string;
  id?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const EMPTY_FORM: MiniGameForm = {
  slug: '', routeKey: '', title: '', emoji: '🎮', description: '',
  age: '', ageGroup: '4-6', category: 'Toán học', groupKey: 'math-counting',
  difficulty: 'Dễ', skills: '', sortOrder: 99,
  showOnHomepage: false, homepageOrder: 99, isActive: true, status: 'ready',
};

const GROUPS = [
  { key: 'math-counting', label: 'Toán đếm số' },
  { key: 'math-logic', label: 'Toán tư duy' },
  { key: 'language', label: 'Ngôn ngữ' },
  { key: 'memory', label: 'Ghi nhớ' },
  { key: 'listening', label: 'Nghe hiểu' },
  { key: 'thinking-observation', label: 'Quan sát / Tư duy' },
  { key: 'english', label: 'Tiếng Anh' },
];

export default function MiniGameEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  const [form, setForm] = useState<MiniGameForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    apiFetch<MiniGameForm & { skills: string[] }>(`/mini-games/${id}`)
      .then(data => {
        setForm({
          ...data,
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
        });
      })
      .catch(() => toast.error('Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (field: keyof MiniGameForm, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id: _id, createdAt, updatedAt, ...cleanForm } = form;
      const payload = {
        ...cleanForm,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        sortOrder: Number(form.sortOrder),
        homepageOrder: Number(form.homepageOrder),
      };
      if (isNew) {
        await apiFetch('/mini-games', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Đã tạo game');
      } else {
        await apiFetch(`/mini-games/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        toast.success('Đã lưu');
      }
      router.push('/admin/mini-games');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi lưu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Đang tải...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{isNew ? 'Thêm mini game' : `Sửa: ${form.title}`}</h1>
          <p className="text-sm text-gray-500">Mini game trang chủ & kho trò chơi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Thông tin cơ bản</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
              <input value={form.emoji} onChange={e => set('emoji', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-2xl text-center focus:ring-2 focus:ring-blue-400 outline-none" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên game *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none" />
          </div>
        </div>

        {/* Route */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">URL & Route</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug (tiếng Việt) *</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-r">/tro-choi/</span>
                <input value={form.slug} onChange={e => set('slug', e.target.value)}
                  className="flex-1 px-3 py-2 focus:outline-none font-mono text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Route key (English) *</label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 py-2 bg-gray-50 text-gray-400 text-xs border-r">/games/</span>
                <input value={form.routeKey} onChange={e => set('routeKey', e.target.value)}
                  className="flex-1 px-3 py-2 focus:outline-none font-mono text-sm" required />
              </div>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Phân loại</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm kỹ năng</label>
              <select value={form.groupKey} onChange={e => set('groupKey', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none">
                {GROUPS.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Độ khó</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none">
                <option>Dễ</option>
                <option>Trung bình</option>
                <option>Nâng cao</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Độ tuổi (hiển thị)</label>
              <input value={form.age} onChange={e => set('age', e.target.value)} placeholder="4-7 tuổi"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm tuổi (lọc)</label>
              <select value={form.ageGroup} onChange={e => set('ageGroup', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value="3-5">3-5</option>
                <option value="4-6">4-6</option>
                <option value="5-7">5-7</option>
                <option value="5-8">5-8</option>
                <option value="6-8">6-8</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kỹ năng (phân cách bằng dấu phẩy)</label>
            <input value={form.skills} onChange={e => set('skills', e.target.value)}
              placeholder="Đếm số, Quan sát, Tập trung"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
        </div>

        {/* Display settings */}
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Hiển thị</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Thứ tự trong kho game</label>
              <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)} min={0}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Thứ tự trang chủ</label>
              <input type="number" value={form.homepageOrder} onChange={e => set('homepageOrder', e.target.value)} min={0}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.showOnHomepage} onChange={e => set('showOnHomepage', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm font-medium text-gray-700">Hiển thị trang chủ</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)}
                className="w-4 h-4 rounded accent-green-600" />
              <span className="text-sm font-medium text-gray-700">Hoạt động</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : isNew ? 'Tạo game' : 'Lưu thay đổi'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
