'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Progress {
  id: string;
  childId?: string;
  lessonId?: string;
  score?: number;
  status?: string;
  completedAt?: string;
  child?: { fullName?: string };
  lesson?: { title?: string };
}

export default function ProgressPage() {
  const [records, setRecords] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Progress[] | { data: Progress[] }>('/progress')
      .then((res) => setRecords(Array.isArray(res) ? res : res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = records.map((p) => [
    p.child?.fullName || p.childId || '-',
    p.lesson?.title || p.lessonId || '-',
    p.score != null ? String(p.score) : '-',
    p.status ? <Badge key="s" label={p.status} variant={p.status === 'completed' ? 'green' : p.status === 'in_progress' ? 'blue' : 'gray'} /> : '-',
    p.completedAt ? new Date(p.completedAt).toLocaleString('vi-VN') : '-',
  ]);

  return (
    <div>
      <PageHeader title="Tiến độ học tập" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Trẻ em', 'Bài học', 'Điểm', 'Trạng thái', 'Hoàn thành lúc']}
          rows={rows}
        />
      )}
    </div>
  );
}
