'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LeaderboardEntry {
  userId: number;
  userName: string;
  totalPoints: number;
  puzzlesSolved: number;
  successRate: number;
  fastestTime: number;
}

export default function LeaderboardAdminPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'speed' | 'completed'>('points');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/leaderboard/global`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setEntries([]);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏆 Bảng Xếp Hạng</h1>
        <Link
          href="/admin/games/puzzles"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          ← Quay Lại
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSortBy('points')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            sortBy === 'points'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          💎 Theo Điểm
        </button>
        <button
          onClick={() => setSortBy('speed')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            sortBy === 'speed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          ⚡ Theo Tốc Độ
        </button>
        <button
          onClick={() => setSortBy('completed')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            sortBy === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          ✅ Theo Hoàn Thành
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-center w-16">🏅</th>
              <th className="px-6 py-3 text-left">Tên Người Chơi</th>
              <th className="px-6 py-3 text-center">💎 Điểm</th>
              <th className="px-6 py-3 text-center">✅ Hoàn Thành</th>
              <th className="px-6 py-3 text-center">📊 Tỉ Lệ Thành Công</th>
              <th className="px-6 py-3 text-center">⚡ Nhanh Nhất</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.userId} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-center font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </td>
                <td className="px-6 py-3 font-medium">{entry.userName}</td>
                <td className="px-6 py-3 text-center font-semibold">{entry.totalPoints}</td>
                <td className="px-6 py-3 text-center">{entry.puzzlesSolved}</td>
                <td className="px-6 py-3 text-center">
                  {(entry.successRate * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-3 text-center">{entry.fastestTime}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có dữ liệu leaderboard.</p>
        </div>
      )}
    </div>
  );
}
