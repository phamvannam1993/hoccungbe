'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';

interface Child {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  gender?: string;
  currentLevel?: string;
  status?: string;
  createdAt?: string;
  parent?: { email?: string; fullName?: string };
}

interface ProgressRecord {
  id: string;
  lessonId?: string;
  score?: number;
  completedAt?: string;
  status?: string;
}

export default function ChildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Child>(`/children/${id}`)
      .then((data) => {
        setChild(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    apiFetch<ProgressRecord[] | { data: ProgressRecord[] }>(`/progress?childId=${id}`)
      .then((res) => setProgress(Array.isArray(res) ? res : res.data || []))
      .catch(() => {});
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;
  if (error) return <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>;
  if (!child) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/children" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết trẻ em</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Thông tin</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div><dt className="text-gray-500 mb-0.5">Họ tên</dt><dd className="font-medium">{child.fullName}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Biệt danh</dt><dd>{child.nickname || '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Tuổi</dt><dd>{child.age != null ? `${child.age} tuổi` : '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Giới tính</dt><dd>{child.gender ? <Badge label={child.gender} variant="blue" /> : '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Level hiện tại</dt><dd>{child.currentLevel || '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Trạng thái</dt><dd>{child.status === 'active' ? <Badge label="Hoạt động" variant="green" /> : <Badge label={child.status || '-'} variant="gray" />}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Phụ huynh</dt><dd>{child.parent?.fullName || child.parent?.email || '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Ngày tạo</dt><dd>{child.createdAt ? new Date(child.createdAt).toLocaleDateString('vi-VN') : '-'}</dd></div>
        </dl>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Tiến độ học tập ({progress.length})</h2>
        <DataTable
          headers={['ID', 'Bài học', 'Điểm', 'Trạng thái', 'Hoàn thành lúc']}
          rows={progress.map((p) => [
            <span key="id" className="text-xs font-mono text-gray-400">{p.id}</span>,
            p.lessonId || '-',
            p.score != null ? String(p.score) : '-',
            p.status ? <Badge key="s" label={p.status} variant={p.status === 'completed' ? 'green' : 'gray'} /> : '-',
            p.completedAt ? new Date(p.completedAt).toLocaleString('vi-VN') : '-',
          ])}
          emptyMessage="Chưa có tiến độ nào"
        />
      </div>
    </div>
  );
}
