'use client';

import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Reward {
  id: string;
  rewardType?: string;
  rewardName?: string;
  points?: number;
  awardedAt?: string;
  child?: { fullName?: string };
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Reward[] | { data: Reward[] }>('/rewards')
      .then((res) => setRewards(Array.isArray(res) ? res : res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = rewards.map((r) => [
    r.child?.fullName || '-',
    r.rewardType ? <Badge key="rt" label={r.rewardType} variant="purple" /> : '-',
    r.rewardName || '-',
    r.points != null ? String(r.points) : '-',
    r.awardedAt ? new Date(r.awardedAt).toLocaleString('vi-VN') : '-',
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Phần thưởng" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          headers={['Tên trẻ', 'Loại phần thưởng', 'Tên phần thưởng', 'Điểm', 'Thời gian trao']}
          rows={rows}
        />
      )}
    </div>
  );
}
