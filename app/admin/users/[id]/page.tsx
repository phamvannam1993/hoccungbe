'use client';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { statusBadge } from '../../components/Badge';
import DataTable from '../../components/DataTable';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  lastLoginAt?: string;
  createdAt?: string;
  children?: Child[];
}

interface Child {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  gender?: string;
  currentLevel?: string;
  status?: string;
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', role: '', status: '' });
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch<User>(`/users/${id}`);
        setUser(data);
        setForm({ fullName: data.fullName, phone: data.phone || '', role: data.role, status: data.status });
        setChildren(data.children || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(form) });
      toast.success('Cập nhật thành công!');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;
  if (error) return <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết User</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Thông tin hiện tại</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex gap-2"><dt className="text-gray-500 w-32">ID:</dt><dd className="font-mono text-xs">{user.id}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-32">Email:</dt><dd>{user.email}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-32">Trạng thái:</dt><dd>{statusBadge(user.status)}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-32">Tạo lúc:</dt><dd>{user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : '-'}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-32">Đăng nhập cuối:</dt><dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : '-'}</dd></div>
          </dl>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Chỉnh sửa</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="parent">parent</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="banned">banned</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      </div>

      {/* Children list */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Danh sách trẻ em ({children.length})</h2>
        <DataTable
          headers={['ID', 'Họ tên', 'Biệt danh', 'Tuổi', 'Giới tính', 'Level', 'Trạng thái']}
          rows={children.map((c) => [
            <span key="id" className="text-xs font-mono text-gray-400">{c.id}</span>,
            c.fullName,
            c.nickname || '-',
            c.age ?? '-',
            c.gender || '-',
            c.currentLevel || '-',
            statusBadge(c.status || 'active'),
          ])}
          emptyMessage="Không có trẻ em nào"
        />
      </div>
    </div>
  );
}
