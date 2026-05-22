'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Course { id: string; title: string; }
interface Lesson {
  id: string;
  title: string;
  lessonType?: string;
  sortOrder?: number;
  isPublished: boolean;
  isPreview?: boolean;
  durationMinutes?: number;
}

export default function LessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLessons = useCallback(async (cid: string) => {
    setLoading(true);
    setError('');
    try {
      const url = cid ? `/lessons?courseId=${cid}` : '/lessons';
      const res = await apiFetch<Lesson[] | { data: Lesson[] }>(url);
      setLessons(Array.isArray(res) ? res : res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    apiFetch<Course[] | { data: Course[] }>('/courses').then((res) => {
      setCourses(Array.isArray(res) ? res : res.data || []);
    }).catch(() => {});
    fetchLessons('');
  }, [fetchLessons]);

  const deleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Xóa bài học "${lesson.title}"?`)) return;
    try {
      await apiFetch(`/lessons/${lesson.id}`, { method: 'DELETE' });
      fetchLessons(courseId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const togglePublish = async (lesson: Lesson) => {
    try {
      await apiFetch(`/lessons/${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ isPublished: !lesson.isPublished }) });
      fetchLessons(courseId);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const rows = lessons.map((l) => [
    l.title,
    l.lessonType ? <Badge key="lt" label={l.lessonType} variant="blue" /> : '-',
    l.sortOrder ?? '-',
    l.isPublished ? <Badge key="pub" label="Đã xuất bản" variant="green" /> : <Badge key="draft" label="Nháp" variant="gray" />,
    l.isPreview ? <Badge key="pre" label="Preview" variant="yellow" /> : '-',
    l.durationMinutes != null ? `${l.durationMinutes} phút` : '-',
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/lessons/${l.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Sửa">
        <Edit size={16} />
      </Link>
      <button onClick={() => togglePublish(l)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Toggle xuất bản">
        {l.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button onClick={() => deleteLesson(l)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa">
        <Trash2 size={16} />
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Bài học" addHref="/admin/lessons/new" />

      <div className="mb-4">
        <select
          value={courseId}
          onChange={(e) => { setCourseId(e.target.value); fetchLessons(e.target.value); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-64"
        >
          <option value="">-- Lọc theo khóa học --</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Tiêu đề', 'Loại', 'Thứ tự', 'Xuất bản', 'Preview', 'Thời gian', 'Thao tác']}
          rows={rows}
          emptyMessage="Không có bài học nào"
        />
      )}
    </div>
  );
}
