'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface Game {
  id: string;
  title: string;
  gameType?: string;
  lessonId?: string;
  timeLimit?: number;
  points?: number;
  isActive: boolean;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<Game[] | { data: Game[] }>('/games');
      setGames(Array.isArray(res) ? res : res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const deleteGame = async (game: Game) => {
    if (!window.confirm(`Xóa game "${game.title}"?`)) return;
    try {
      await apiFetch(`/games/${game.id}`, { method: 'DELETE' });
      fetchGames();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const rows = games.map((g) => [
    g.title,
    g.gameType ? <Badge key="gt" label={g.gameType} variant="purple" /> : '-',
    g.lessonId || '-',
    g.timeLimit != null ? `${g.timeLimit}s` : '-',
    g.points ?? '-',
    g.isActive ? <Badge key="a" label="Hoạt động" variant="green" /> : <Badge key="i" label="Tắt" variant="gray" />,
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/games/${g.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Sửa / Xem">
        <Edit size={16} />
      </Link>
      <Link href={`/admin/games/${g.id}`} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Xem câu hỏi">
        <Eye size={16} />
      </Link>
      <button onClick={() => deleteGame(g)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa">
        <Trash2 size={16} />
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Trò chơi" addHref="/admin/games/new" />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable headers={['Tiêu đề', 'Loại trò chơi', 'Bài học', 'Thời gian', 'Điểm', 'Trạng thái', 'Thao tác']} rows={rows} />
      )}
    </div>
  );
}
