'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, Baby, CreditCard } from 'lucide-react';
import StatCard from '../components/StatCard';
import { apiFetch } from '../lib/api';

interface Stats {
  users: number;
  courses: number;
  children: number;
  subscriptions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ users: 0, courses: 0, children: 0, subscriptions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes, childrenRes, subsRes] = await Promise.allSettled([
          apiFetch<{ data?: unknown[]; total?: number } | unknown[]>('/users?page=1&limit=1'),
          apiFetch<{ data?: unknown[]; total?: number } | unknown[]>('/courses?page=1&limit=1'),
          apiFetch<{ data?: unknown[]; total?: number } | unknown[]>('/children?page=1&limit=1'),
          apiFetch<{ data?: unknown[]; total?: number } | unknown[]>('/subscriptions?page=1&limit=1'),
        ]);

        const getCount = (res: PromiseSettledResult<{ data?: unknown[]; total?: number } | unknown[]>) => {
          if (res.status === 'rejected') return 0;
          const val = res.value;
          if (Array.isArray(val)) return val.length;
          if (val && typeof val === 'object' && 'total' in val && typeof (val as { total: number }).total === 'number') {
            return (val as { total: number }).total;
          }
          if (val && typeof val === 'object' && 'data' in val && Array.isArray((val as { data: unknown[] }).data)) {
            return (val as { data: unknown[] }).data.length;
          }
          return 0;
        };

        setStats({
          users: getCount(usersRes),
          courses: getCount(coursesRes),
          children: getCount(childrenRes),
          subscriptions: getCount(subsRes),
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Tổng người dùng" value={stats.users} color="text-blue-600" />
        <StatCard icon={BookOpen} label="Tổng khóa học" value={stats.courses} color="text-green-600" />
        <StatCard icon={Baby} label="Tổng trẻ em" value={stats.children} color="text-purple-600" />
        <StatCard icon={CreditCard} label="Tổng đăng ký" value={stats.subscriptions} color="text-orange-600" />
      </div>
    </div>
  );
}
