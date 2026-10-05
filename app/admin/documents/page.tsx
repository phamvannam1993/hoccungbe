'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import { apiFetch } from '../lib/api';

interface Document {
  id: number;
  title: string;
  description?: string;
  slug: string;
  pdfUrl: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [page, search]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });
      const res = await apiFetch<{ data: Document[]; total: number; totalPages: number }>(
        `/documents/admin?${query}`,
      );
      setDocuments(res.data);
    } catch {
      toast.error('Lỗi tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number) => {
    if (!confirm('Xóa tài liệu này?')) return;
    try {
      await apiFetch(`/documents/${id}`, { method: 'DELETE' });
      setDocuments(prev => prev.filter(d => d.id !== id));
      toast.success('Đã xóa');
    } catch {
      toast.error('Lỗi xóa');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Kho Tài Liệu" subtitle="Quản lý PDF" />
        <Link
          href="/admin/documents/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={18} /> Thêm Tài Liệu
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Tiêu Đề</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Slug</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Lượt Xem</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Trạng Thái</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-900">{doc.title}</td>
                <td className="px-6 py-3 text-sm text-gray-700 font-mono">{doc.slug}</td>
                <td className="px-6 py-3 text-gray-900">
                  <div className="flex items-center gap-1">
                    <Eye size={16} /> {doc.viewCount}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${doc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {doc.isActive ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <Link
                    href={`/admin/documents/${doc.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">Không có tài liệu nào</div>
        )}
      </div>
    </div>
  );
}
