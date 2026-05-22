'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Course {
  id: string;
  title: string;
  courseType?: string;
  difficultyLevel?: string;
  isPublished: boolean;
  isFree: boolean;
  price?: number;
  totalLessons?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<Course[] | { data: Course[] }>('/courses');
      setCourses(Array.isArray(res) ? res : res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const deleteCourse = async (course: Course) => {
    if (!window.confirm(`Xóa khóa học "${course.title}"?`)) return;
    try {
      await apiFetch(`/courses/${course.id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      await apiFetch(`/courses/${course.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });
      fetchCourses();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const rows = courses.map((c) => [
    c.title,
    c.courseType ? <Badge key="ct" label={c.courseType} variant="blue" /> : '-',
    c.difficultyLevel || '-',
    c.isPublished ? <Badge key="pub" label="Đã xuất bản" variant="green" /> : <Badge key="draft" label="Nháp" variant="gray" />,
    c.isFree ? <Badge key="free" label="Miễn phí" variant="green" /> : <Badge key="paid" label="Trả phí" variant="orange" />,
    c.price != null ? `${c.price.toLocaleString('vi-VN')}₫` : '-',
    c.totalLessons ?? '-',
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/courses/${c.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Sửa">
        <Edit size={16} />
      </Link>
      <button onClick={() => togglePublish(c)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Toggle xuất bản">
        {c.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button onClick={() => deleteCourse(c)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa">
        <Trash2 size={16} />
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Khóa học" addHref="/admin/courses/new" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Tiêu đề', 'Loại', 'Độ khó', 'Xuất bản', 'Phí', 'Giá', 'Số bài', 'Thao tác']}
          rows={rows}
        />
      )}
    </div>
  );
}
