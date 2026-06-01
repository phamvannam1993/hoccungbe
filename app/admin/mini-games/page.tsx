'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, GripVertical, Pencil, Trash2, Plus, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { apiFetch } from '../lib/api';

interface MiniGame {
  id: number;
  slug: string;
  routeKey: string;
  title: string;
  emoji: string;
  age: string;
  category: string;
  groupKey: string;
  difficulty: string;
  showOnHomepage: boolean;
  homepageOrder: number;
  sortOrder: number;
  isActive: boolean;
  status: string;
}

const DIFFICULTY_COLOR: Record<string, 'green' | 'yellow' | 'red' | 'blue' | 'gray'> = {
  'Dễ': 'green',
  'Trung bình': 'yellow',
  'Nâng cao': 'red',
};

const GROUP_LABEL: Record<string, string> = {
  'math-counting': 'Toán đếm',
  'math-logic': 'Toán tư duy',
  'language': 'Ngôn ngữ',
  'memory': 'Ghi nhớ',
  'listening': 'Nghe',
  'thinking-observation': 'Quan sát',
  'english': 'Tiếng Anh',
};

export default function MiniGamesAdminPage() {
  const [games, setGames] = useState<MiniGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'homepage' | 'inactive'>('all');
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const dragOverId = useRef<number | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<MiniGame[]>('/mini-games');
      setGames(Array.isArray(res) ? res : []);
    } catch {
      toast.error('Lỗi tải danh sách game');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const toggleHomepage = async (game: MiniGame) => {
    try {
      await apiFetch(`/mini-games/${game.id}/toggle-homepage`, { method: 'PATCH' });
      setGames(prev => prev.map(g => g.id === game.id ? { ...g, showOnHomepage: !g.showOnHomepage } : g));
      toast.success(game.showOnHomepage ? 'Đã ẩn khỏi trang chủ' : 'Đã hiện trên trang chủ');
    } catch {
      toast.error('Lỗi cập nhật');
    }
  };

  const toggleActive = async (game: MiniGame) => {
    try {
      await apiFetch(`/mini-games/${game.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !game.isActive }),
      });
      setGames(prev => prev.map(g => g.id === game.id ? { ...g, isActive: !g.isActive } : g));
      toast.success(game.isActive ? 'Đã vô hiệu hóa' : 'Đã kích hoạt');
    } catch {
      toast.error('Lỗi cập nhật');
    }
  };

  const deleteGame = async (game: MiniGame) => {
    if (!confirm(`Xóa game "${game.title}"?`)) return;
    try {
      await apiFetch(`/mini-games/${game.id}`, { method: 'DELETE' });
      setGames(prev => prev.filter(g => g.id !== game.id));
      toast.success('Đã xóa game');
    } catch {
      toast.error('Lỗi xóa');
    }
  };

  // Drag-to-reorder for homepage
  const handleDragStart = (id: number) => setDraggingId(id);
  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    dragOverId.current = id;
  };
  const handleDrop = async () => {
    if (draggingId === null || dragOverId.current === null || draggingId === dragOverId.current) {
      setDraggingId(null);
      return;
    }
    const homepageGames = games
      .filter(g => g.showOnHomepage)
      .sort((a, b) => a.homepageOrder - b.homepageOrder);

    const fromIdx = homepageGames.findIndex(g => g.id === draggingId);
    const toIdx = homepageGames.findIndex(g => g.id === dragOverId.current);
    if (fromIdx === -1 || toIdx === -1) { setDraggingId(null); return; }

    const reordered = [...homepageGames];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const ids = reordered.map(g => g.id);

    // Optimistic update
    setGames(prev => prev.map(g => {
      const idx = ids.indexOf(g.id);
      return idx !== -1 ? { ...g, homepageOrder: idx } : g;
    }));
    setDraggingId(null);

    try {
      await apiFetch('/mini-games/reorder', { method: 'POST', body: JSON.stringify({ ids }) });
      toast.success('Đã lưu thứ tự');
    } catch {
      toast.error('Lỗi lưu thứ tự');
      fetchGames();
    }
  };

  const filtered = games.filter(g => {
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.slug.includes(search);
    if (!matchSearch) return false;
    if (filter === 'homepage') return g.showOnHomepage;
    if (filter === 'inactive') return !g.isActive;
    return true;
  }).sort((a, b) => {
    if (filter === 'homepage') return a.homepageOrder - b.homepageOrder;
    return a.sortOrder - b.sortOrder;
  });

  const homepageCount = games.filter(g => g.showOnHomepage).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý Mini Game"
        subtitle={`${games.length} game · ${homepageCount} hiển thị trang chủ`}
        addLabel="Thêm game"
        addHref="/admin/mini-games/new"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Tìm game..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'homepage', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {f === 'all' ? 'Tất cả' : f === 'homepage' ? '🏠 Trang chủ' : '⏸ Tắt'}
            </button>
          ))}
        </div>
        <button onClick={fetchGames} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Homepage order hint */}
      {filter === 'homepage' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          💡 Kéo <GripVertical className="w-3.5 h-3.5 inline" /> để thay đổi thứ tự hiển thị trên trang chủ
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {filter === 'homepage' && <th className="w-10 px-3 py-3"></th>}
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Game</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Slug / Route</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Nhóm</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Độ khó</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Trang chủ</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(game => (
                <tr
                  key={game.id}
                  draggable={filter === 'homepage'}
                  onDragStart={() => handleDragStart(game.id)}
                  onDragOver={e => handleDragOver(e, game.id)}
                  onDrop={handleDrop}
                  onDragEnd={() => setDraggingId(null)}
                  className={`hover:bg-gray-50 transition-colors ${draggingId === game.id ? 'opacity-40' : ''}`}
                >
                  {filter === 'homepage' && (
                    <td className="px-3 py-3 text-gray-400 cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{game.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{game.title}</div>
                        <div className="text-xs text-gray-400">{game.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-mono text-blue-600">/tro-choi/{game.slug}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{game.routeKey}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{GROUP_LABEL[game.groupKey] || game.groupKey}</td>
                  <td className="px-4 py-3">
                    <Badge label={game.difficulty} variant={DIFFICULTY_COLOR[game.difficulty] || 'gray'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleHomepage(game)}
                      title={game.showOnHomepage ? 'Ẩn khỏi trang chủ' : 'Hiện trên trang chủ'}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        game.showOnHomepage
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {game.showOnHomepage ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {game.showOnHomepage ? 'Hiện' : 'Ẩn'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(game)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        game.isActive
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {game.isActive ? 'Hoạt động' : 'Tắt'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={`/tro-choi/${game.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Xem game"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={`/admin/mini-games/${game.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteGame(game)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">Không có game nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
