'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [search, page]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);

      const data = await apiFetch<any>(`/categories/admin?${params}`);
      setCategories(data.data || []);
    } catch (error) {
      toast.error('Lỗi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá danh mục này?')) return;

    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      toast.success('Đã xoá danh mục');
      fetchCategories();
    } catch (error) {
      toast.error('Lỗi xoá danh mục');
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Danh Mục</h1>
        <button
          onClick={() => router.push('/admin/categories/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={18} />
          Thêm Danh Mục
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Không có danh mục nào</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tên Danh Mục</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Thứ Tự</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cat.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cat.isActive ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat.sortOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/categories/${cat.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Xoá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
