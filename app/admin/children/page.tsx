'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Child {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  gender?: string;
  currentLevel?: string;
  status?: string;
  parent?: { email?: string };
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Child[] | { data: Child[] }>('/children')
      .then((res) => setChildren(Array.isArray(res) ? res : res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = children.map((c) => [
    c.fullName,
    c.nickname || '-',
    c.age != null ? `${c.age} tuổi` : '-',
    c.gender ? <Badge key="g" label={c.gender} variant="blue" /> : '-',
    c.currentLevel || '-',
    c.status ? (c.status === 'active' ? <Badge key="s" label="Hoạt động" variant="green" /> : <Badge key="s" label={c.status} variant="gray" />) : '-',
    c.parent?.email || '-',
    <Link key="view" href={`/admin/children/${c.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg inline-block">
      <Eye size={16} />
    </Link>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Trẻ em" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Họ tên', 'Biệt danh', 'Tuổi', 'Giới tính', 'Level hiện tại', 'Trạng thái', 'Email phụ huynh', 'Thao tác']}
          rows={rows}
        />
      )}
    </div>
  );
}
