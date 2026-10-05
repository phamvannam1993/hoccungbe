'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface UserProgress {
  userId: number;
  userName: string;
  puzzleId: number;
  puzzleTitle: string;
  attempts: number;
  completed: boolean;
  completionTime: number;
  points: number;
}

export default function ProgressAdminPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/progress`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProgress(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setProgress([]);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📊 Tiến Độ Người Chơi</h1>
        <Link
          href="/admin/games/puzzles"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          ← Quay Lại
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Người Chơi</th>
              <th className="px-4 py-3 text-left">Puzzle</th>
              <th className="px-4 py-3 text-center">Lần Thử</th>
              <th className="px-4 py-3 text-center">Hoàn Thành</th>
              <th className="px-4 py-3 text-center">Thời Gian (s)</th>
              <th className="px-4 py-3 text-center">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.userName}</td>
                <td className="px-4 py-3">{p.puzzleTitle}</td>
                <td className="px-4 py-3 text-center">{p.attempts}</td>
                <td className="px-4 py-3 text-center">
                  {p.completed ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">✅ Có</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">⏳ Chưa</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">{p.completionTime || '-'}</td>
                <td className="px-4 py-3 text-center font-semibold">{p.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {progress.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Chưa có dữ liệu tiến độ.</p>
        </div>
      )}
    </div>
  );
}
