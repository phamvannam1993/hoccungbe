'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/api';
import PageHeader from '../components/PageHeader';

interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  message: string;
  topic?: string;
  isRead: boolean;
  createdAt: string;
}

interface FeedbackResponse {
  items: FeedbackItem[];
  total: number;
  page: number;
  totalPages: number;
}

const TOPIC_LABELS: Record<string, string> = {
  technical: 'Kỹ thuật',
  content: 'Nội dung',
  payment: 'Thanh toán',
  suggestion: 'Góp ý',
  other: 'Khác',
};

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const res = await apiFetch<FeedbackResponse>(`/feedback?page=${p}&limit=20`);
      setData(res);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleRead = async (id: number) => {
    await apiFetch(`/feedback/${id}/read`, { method: 'PATCH' });
    setData((prev) => prev ? {
      ...prev,
      items: prev.items.map((i) => i.id === id ? { ...i, isRead: true } : i),
    } : prev);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa góp ý này?')) return;
    await apiFetch(`/feedback/${id}`, { method: 'DELETE' });
    load(page);
  };

  const unreadCount = data?.items.filter((i) => !i.isRead).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Góp ý"
        subtitle={unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
        actions={
          <button
            onClick={() => load(page)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        }
      />

      {loading && !data ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Đang tải...</div>
      ) : data?.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <Mail size={40} className="opacity-40" />
          <p className="text-sm">Chưa có góp ý nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {data?.items.map((item) => (
            <div key={item.id} className={`p-4 transition-colors ${!item.isRead ? 'bg-blue-50/40' : ''}`}>
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${!item.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                    <span className="text-gray-400 text-xs">{item.email}</span>
                    {item.topic && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                        {TOPIC_LABELS[item.topic] ?? item.topic}
                      </span>
                    )}
                    {!item.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold">Mới</span>
                    )}
                    <span className="text-gray-400 text-xs ml-auto">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <p
                    className={`mt-1 text-sm text-gray-700 leading-relaxed cursor-pointer ${expanded === item.id ? '' : 'line-clamp-2'}`}
                    onClick={() => {
                      setExpanded(expanded === item.id ? null : item.id);
                      if (!item.isRead) handleRead(item.id);
                    }}
                  >
                    {item.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1">
                  {!item.isRead && (
                    <button
                      onClick={() => handleRead(item.id)}
                      title="Đánh dấu đã đọc"
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition-colors"
                    >
                      <MailOpen size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Xóa"
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => load(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
