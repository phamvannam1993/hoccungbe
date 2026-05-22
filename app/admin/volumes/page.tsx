'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';

interface Course { id: string; title: string; }
interface Volume { id: string; courseId: string; name: string; sortOrder: number; }

export default function VolumesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ courseId: '', name: '', sortOrder: '1' });
  const [saving, setSaving] = useState(false);
  const [filterCourse, setFilterCourse] = useState('');

  const fetchVolumes = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterCourse ? `/volumes?courseId=${filterCourse}` : '/volumes';
      const res = await apiFetch<Volume[]>(url);
      setVolumes(Array.isArray(res) ? res : []);
    } finally {
      setLoading(false);
    }
  }, [filterCourse]);

  useEffect(() => {
    apiFetch<Course[] | { data: Course[] }>('/courses').then((res) => {
      setCourses(Array.isArray(res) ? res : res.data || []);
    });
  }, []);

  useEffect(() => { fetchVolumes(); }, [fetchVolumes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/volumes', {
        method: 'POST',
        body: JSON.stringify({ ...form, courseId: Number(form.courseId), sortOrder: Number(form.sortOrder) }),
      });
      toast.success('Tạo tập thành công!');
      setForm((f) => ({ ...f, name: '', sortOrder: '1' }));
      fetchVolumes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tạo tập');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vol: Volume) => {
    if (!window.confirm(`Xóa tập "${vol.name}"?`)) return;
    try {
      await apiFetch(`/volumes/${vol.id}`, { method: 'DELETE' });
      toast.success('Đã xóa');
      fetchVolumes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Tập (Volume)</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 max-w-xl">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Thêm tập mới</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Khóa học <span className="text-red-500">*</span></label>
            <select required value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn --</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Thứ tự</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Tên tập <span className="text-red-500">*</span></label>
            <input required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Toán lớp 1 - Tập 1"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              <Plus size={14} />{saving ? 'Đang lưu...' : 'Thêm'}
            </button>
          </div>
        </div>
      </form>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Tất cả khóa học</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" /></div>
        ) : volumes.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chưa có tập nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Tên tập</th>
                <th className="px-4 py-3 text-left">Thứ tự</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volumes.map((vol) => (
                <tr key={vol.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{vol.name}</td>
                  <td className="px-4 py-3 text-gray-500">{vol.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(vol)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
