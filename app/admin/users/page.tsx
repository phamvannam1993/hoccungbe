'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Badge, { statusBadge } from '../components/Badge';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt?: string;
}

interface ApiResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<ApiResponse | User[]>(`/users?page=${p}&limit=${LIMIT}`);
      if (Array.isArray(res)) {
        setUsers(res);
        setTotal(res.length);
      } else {
        setUsers(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  const toggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    if (!window.confirm(`Chuyển trạng thái ${user.email} sang "${nextStatus}"?`)) return;
    try {
      await apiFetch(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchUsers(page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  const rows = users.map((u) => [
    <span key="id" className="text-xs text-gray-400 font-mono">{u.id}</span>,
    u.fullName,
    u.email,
    <Badge key="role" label={u.role} variant={u.role === 'admin' ? 'purple' : 'blue'} />,
    statusBadge(u.status),
    u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : '-',
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/users/${u.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem chi tiết">
        <Eye size={16} />
      </Link>
      <button
        onClick={() => toggleStatus(u)}
        className={`p-1.5 rounded-lg ${u.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
        title="Bật/tắt trạng thái"
      >
        {u.status === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Người dùng" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <DataTable
            headers={['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Đăng nhập cuối', 'Thao tác']}
            rows={rows}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
