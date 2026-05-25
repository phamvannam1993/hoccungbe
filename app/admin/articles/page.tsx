'use client';
import { toast } from 'sonner';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff, Sparkles, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

const PRESET_TOPICS: { label: string; category: string; topics: string[] }[] = [
  {
    label: 'Toán lớp 1', category: 'toan-lop-1',
    topics: [
      'Mẹo dạy trẻ học bảng cộng trừ trong phạm vi 10',
      'Cách giải toán có lời văn lớp 1 cho bé',
      'Trò chơi học toán thú vị cho bé lớp 1',
      'Phương pháp dạy trẻ đếm số từ 1 đến 100',
      'Dạy bé nhận biết hình học: tròn, vuông, tam giác',
    ],
  },
  {
    label: 'Tiếng Việt lớp 1', category: 'tieng-viet-lop-1',
    topics: [
      'Mẹo dạy bé học bảng chữ cái tiếng Việt nhanh nhất',
      'Cách dạy bé ghép vần và đánh vần chuẩn lớp 1',
      'Phương pháp dạy trẻ viết chữ đẹp từ đầu',
      'Trò chơi học từ vựng tiếng Việt cho bé lớp 1',
      'Làm thế nào để bé lớp 1 đọc thông viết thạo nhanh',
    ],
  },
  {
    label: 'Tiếng Việt lớp 2', category: 'tieng-viet-lop-2',
    topics: [
      'Cách dạy bé lớp 2 đọc hiểu văn bản hiệu quả',
      'Mẹo luyện viết câu hoàn chỉnh cho bé lớp 2',
      'Phân biệt dấu hỏi và dấu ngã trong tiếng Việt',
      'Dạy bé lớp 2 sử dụng dấu câu đúng cách',
      'Cách giúp bé lớp 2 kể chuyện mạch lạc',
    ],
  },
  {
    label: 'Nuôi dạy con', category: 'nuoi-day-con',
    topics: [
      'Cách tạo thói quen học tập tốt cho bé từ nhỏ',
      'Làm thế nào để bé hứng thú học bài mỗi ngày',
      'Bí quyết giúp trẻ tập trung trong giờ học',
      'Thời gian biểu học và chơi lý tưởng cho bé tiểu học',
      'Cách cha mẹ đồng hành cùng con trong việc học',
    ],
  },
];

interface Article {
  id: number;
  title: string;
  slug: string;
  category?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);
  const [genCategory, setGenCategory] = useState('');
  const [genTopics, setGenTopics] = useState('');
  const [generating, setGenerating] = useState(false);

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

  const handleGenerate = async () => {
    const topics = genTopics.split('\n').map((t) => t.trim()).filter(Boolean);
    if (!topics.length) { toast.error('Nhập ít nhất 1 chủ đề'); return; }
    setGenerating(true);
    let ok = 0;
    for (const topic of topics) {
      try {
        await apiFetch('/articles/generate', {
          method: 'POST',
          body: JSON.stringify({ topic, category: genCategory }),
        });
        ok++;
      } catch {
        toast.error(`Lỗi tạo: ${topic}`);
      }
    }
    setGenerating(false);
    setShowGenModal(false);
    toast.success(`Đã tạo ${ok}/${topics.length} bài viết`);
    fetchArticles();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <Sparkles size={16} /> Tạo bài tự động
          </button>
          <Link href="/admin/articles/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Thêm mới
          </Link>
        </div>
      </div>

      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowGenModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-purple-600" /> Tạo bài viết tự động</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn bộ chủ đề có sẵn</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_TOPICS.map((p) => (
                  <button key={p.category}
                    onClick={() => { setGenCategory(p.category); setGenTopics(p.topics.join('\n')); }}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${genCategory === p.category ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 hover:bg-gray-50'}`}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <input
                type="text" value={genCategory} onChange={(e) => setGenCategory(e.target.value)}
                placeholder="vd: toan-lop-1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề các bài (mỗi dòng 1 bài)</label>
              <textarea
                rows={6} value={genTopics} onChange={(e) => setGenTopics(e.target.value)}
                placeholder="Mẹo dạy trẻ học bảng cộng trừ&#10;Cách giải toán có lời văn lớp 1&#10;..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">{genTopics.split('\n').filter(Boolean).length} bài sẽ được tạo</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate} disabled={generating}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-60 transition-colors"
              >
                {generating ? 'Đang tạo...' : 'Tạo bài viết'}
              </button>
              <button onClick={() => setShowGenModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Hủy</button>
            </div>
          </div>
        </div>
      )}

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
