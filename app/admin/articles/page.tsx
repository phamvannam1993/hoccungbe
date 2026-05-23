'use client';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Article {
  id: number;
  title: string;
  slug: string;
  category?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<Article[]>('/articles/all');
      setArticles(Array.isArray(res) ? res : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const deleteArticle = async (article: Article) => {
    if (!window.confirm(`Xóa bài viết "${article.title}"?`)) return;
    try {
      await apiFetch(`/articles/${article.id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      await apiFetch(`/articles/${article.id}/publish`, { method: 'PATCH' });
      fetchArticles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const rows = articles.map((a) => [
    a.title,
    a.category ? <Badge key="cat" label={a.category} variant="blue" /> : '-',
    a.isPublished
      ? <Badge key="pub" label="Đã xuất bản" variant="green" />
      : <Badge key="draft" label="Nháp" variant="gray" />,
    a.viewCount,
    new Date(a.createdAt).toLocaleDateString('vi-VN'),
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/articles/${a.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Sửa">
        <Edit size={16} />
      </Link>
      <button onClick={() => togglePublish(a)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Toggle xuất bản">
        {a.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button onClick={() => deleteArticle(a)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa">
        <Trash2 size={16} />
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Bài viết" addHref="/admin/articles/new" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Tiêu đề', 'Danh mục', 'Trạng thái', 'Lượt xem', 'Ngày tạo', 'Thao tác']}
          rows={rows}
        />
      )}
    </div>
  );
}
