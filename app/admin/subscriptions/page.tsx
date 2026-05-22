'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge, { statusBadge } from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Subscription {
  id: string;
  planName?: string;
  planType?: string;
  amount?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  user?: { email?: string };
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<Subscription[] | { data: Subscription[] }>('/subscriptions');
      setSubscriptions(Array.isArray(res) ? res : res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const updateStatus = async (sub: Subscription, newStatus: string) => {
    if (!window.confirm(`Cập nhật trạng thái sang "${newStatus}"?`)) return;
    try {
      await apiFetch(`/subscriptions/${sub.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      fetchSubs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const rows = subscriptions.map((s) => [
    s.user?.email || '-',
    s.planName || '-',
    s.planType ? <Badge key="pt" label={s.planType} variant="blue" /> : '-',
    s.amount != null ? `${s.amount.toLocaleString('vi-VN')}₫` : '-',
    statusBadge(s.status || ''),
    s.startDate ? new Date(s.startDate).toLocaleDateString('vi-VN') : '-',
    s.endDate ? new Date(s.endDate).toLocaleDateString('vi-VN') : '-',
    <div key="actions" className="flex items-center gap-1.5">
      <button onClick={() => updateStatus(s, 'active')} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200">Kích hoạt</button>
      <button onClick={() => updateStatus(s, 'expired')} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200">Hết hạn</button>
      <button onClick={() => updateStatus(s, 'cancelled')} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200">Hủy</button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Đăng ký" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Email người dùng', 'Gói', 'Loại gói', 'Số tiền', 'Trạng thái', 'Ngày bắt đầu', 'Ngày kết thúc', 'Thao tác']}
          rows={rows}
        />
      )}
    </div>
  );
}
