'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const PUZZLE_TEMPLATES = [
  // 1x1 (1 piece) - trivial
  { id: 100, title: '1x1: Quả lê vàng', gridRows: 1, gridCols: 1, pieceCount: 1, difficulty: 'very_easy', points: 1 },
  { id: 101, title: '1x1: Chuối vàng', gridRows: 1, gridCols: 1, pieceCount: 1, difficulty: 'very_easy', points: 1 },
  { id: 102, title: '1x1: Cam cam', gridRows: 1, gridCols: 1, pieceCount: 1, difficulty: 'very_easy', points: 1 },
  { id: 103, title: '1x1: Dâu tây đỏ', gridRows: 1, gridCols: 1, pieceCount: 1, difficulty: 'very_easy', points: 1 },
  // 2x2 (4 pieces) - very easy
  { id: 1, title: '2x2: Quả táo đỏ', gridRows: 2, gridCols: 2, pieceCount: 4, difficulty: 'very_easy', points: 5 },
  { id: 2, title: '2x2: Mặt trời', gridRows: 2, gridCols: 2, pieceCount: 4, difficulty: 'very_easy', points: 5 },
  { id: 3, title: '2x2: Con mèo', gridRows: 2, gridCols: 2, pieceCount: 4, difficulty: 'very_easy', points: 5 },
  { id: 4, title: '2x2: Bông hoa', gridRows: 2, gridCols: 2, pieceCount: 4, difficulty: 'very_easy', points: 5 },
  // 2x3 (6 pieces) - easy
  { id: 5, title: '2x3: Con chó', gridRows: 2, gridCols: 3, pieceCount: 6, difficulty: 'easy', points: 10 },
  { id: 6, title: '2x3: Xe buýt vàng', gridRows: 2, gridCols: 3, pieceCount: 6, difficulty: 'easy', points: 10 },
  { id: 7, title: '2x3: Ngôi nhà nhỏ', gridRows: 2, gridCols: 3, pieceCount: 6, difficulty: 'easy', points: 10 },
  { id: 8, title: '2x3: Cầu vồng', gridRows: 2, gridCols: 3, pieceCount: 6, difficulty: 'easy', points: 10 },
  // 2x4 (8 pieces) - easy
  { id: 9, title: '2x4: Gấu trúc', gridRows: 2, gridCols: 4, pieceCount: 8, difficulty: 'easy', points: 15 },
  { id: 10, title: '2x4: Cá vàng', gridRows: 2, gridCols: 4, pieceCount: 8, difficulty: 'easy', points: 15 },
  // 2x5 (10 pieces) - medium
  { id: 11, title: '2x5: Tàu hỏa', gridRows: 2, gridCols: 5, pieceCount: 10, difficulty: 'medium', points: 20 },
  { id: 12, title: '2x5: Sinh nhật', gridRows: 2, gridCols: 5, pieceCount: 10, difficulty: 'medium', points: 20 },
  // 3x2 (6 pieces) - easy
  { id: 13, title: '3x2: Khỉ con', gridRows: 3, gridCols: 2, pieceCount: 6, difficulty: 'easy', points: 10 },
  { id: 14, title: '3x2: Hoa hướng dương', gridRows: 3, gridCols: 2, pieceCount: 6, difficulty: 'easy', points: 10 },
  // 3x3 (9 pieces) - medium
  { id: 15, title: '3x3: Công viên', gridRows: 3, gridCols: 3, pieceCount: 9, difficulty: 'medium', points: 20 },
  { id: 16, title: '3x3: Gà mái', gridRows: 3, gridCols: 3, pieceCount: 9, difficulty: 'medium', points: 20 },
  { id: 17, title: '3x3: Bướm', gridRows: 3, gridCols: 3, pieceCount: 9, difficulty: 'medium', points: 20 },
  { id: 18, title: '3x3: Cây xanh', gridRows: 3, gridCols: 3, pieceCount: 9, difficulty: 'medium', points: 20 },
  // 3x4 (12 pieces) - hard
  { id: 19, title: '3x4: Nông trại', gridRows: 3, gridCols: 4, pieceCount: 12, difficulty: 'hard', points: 30 },
  { id: 20, title: '3x4: Đại dương', gridRows: 3, gridCols: 4, pieceCount: 12, difficulty: 'hard', points: 30 },
  { id: 21, title: '3x4: Lớp học', gridRows: 3, gridCols: 4, pieceCount: 12, difficulty: 'hard', points: 30 },
  { id: 22, title: '3x4: Thành phố', gridRows: 3, gridCols: 4, pieceCount: 12, difficulty: 'hard', points: 30 },
  // 3x5 (15 pieces) - hard
  { id: 23, title: '3x5: Rừng xanh', gridRows: 3, gridCols: 5, pieceCount: 15, difficulty: 'hard', points: 40 },
  { id: 24, title: '3x5: Bãi biển', gridRows: 3, gridCols: 5, pieceCount: 15, difficulty: 'hard', points: 40 },
  // 4x2 (8 pieces) - easy
  { id: 25, title: '4x2: Xe tải', gridRows: 4, gridCols: 2, pieceCount: 8, difficulty: 'easy', points: 15 },
  { id: 26, title: '4x2: Lâu đài', gridRows: 4, gridCols: 2, pieceCount: 8, difficulty: 'easy', points: 15 },
  // 4x3 (12 pieces) - hard
  { id: 27, title: '4x3: Vườn thú', gridRows: 4, gridCols: 3, pieceCount: 12, difficulty: 'hard', points: 35 },
  { id: 28, title: '4x3: Lâu đài cổ', gridRows: 4, gridCols: 3, pieceCount: 12, difficulty: 'hard', points: 35 },
  // 4x4 (16 pieces) - hard
  { id: 29, title: '4x4: Bản đồ Việt Nam', gridRows: 4, gridCols: 4, pieceCount: 16, difficulty: 'hard', points: 50 },
  { id: 30, title: '4x4: Gia đình', gridRows: 4, gridCols: 4, pieceCount: 16, difficulty: 'hard', points: 50 },
  { id: 31, title: '4x4: Phòng học', gridRows: 4, gridCols: 4, pieceCount: 16, difficulty: 'hard', points: 50 },
  { id: 32, title: '4x4: Công viên lớn', gridRows: 4, gridCols: 4, pieceCount: 16, difficulty: 'hard', points: 50 },
  // 4x5 (20 pieces) - very hard
  { id: 33, title: '4x5: Thế giới', gridRows: 4, gridCols: 5, pieceCount: 20, difficulty: 'hard', points: 60 },
  { id: 34, title: '4x5: Rừng nhiệt đới', gridRows: 4, gridCols: 5, pieceCount: 20, difficulty: 'hard', points: 60 },
  // 5x2 (10 pieces) - medium
  { id: 35, title: '5x2: Chiếc xe', gridRows: 5, gridCols: 2, pieceCount: 10, difficulty: 'medium', points: 25 },
  { id: 36, title: '5x2: Tòa nhà', gridRows: 5, gridCols: 2, pieceCount: 10, difficulty: 'medium', points: 25 },
  // 5x3 (15 pieces) - hard
  { id: 37, title: '5x3: Cảnh quê', gridRows: 5, gridCols: 3, pieceCount: 15, difficulty: 'hard', points: 45 },
  { id: 38, title: '5x3: Bến sông', gridRows: 5, gridCols: 3, pieceCount: 15, difficulty: 'hard', points: 45 },
  // 5x4 (20 pieces) - very hard
  { id: 39, title: '5x4: Lâu đài hoàng gia', gridRows: 5, gridCols: 4, pieceCount: 20, difficulty: 'hard', points: 60 },
  { id: 40, title: '5x4: Thành phố đêm', gridRows: 5, gridCols: 4, pieceCount: 20, difficulty: 'hard', points: 60 },
  // 5x5 (25 pieces) - very hard
  { id: 41, title: '5x5: Hòn đảo', gridRows: 5, gridCols: 5, pieceCount: 25, difficulty: 'hard', points: 75 },
  { id: 42, title: '5x5: Rừng sâu', gridRows: 5, gridCols: 5, pieceCount: 25, difficulty: 'hard', points: 75 },
];

interface Puzzle {
  id: number;
  title: string;
  description: string;
  puzzleType: string;
  difficulty: string;
  pieceCount: number;
  points: number;
  sortOrder: number;
  createdAt: string;
}

export default function PuzzleAdminPage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editOrder, setEditOrder] = useState<number>(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState<number | null>(null);

  useEffect(() => {
    fetchPuzzles();
  }, []);

  const fetchPuzzles = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/puzzles`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPuzzles(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch puzzles:', error);
      setPuzzles([]);
      setLoading(false);
    }
  };

  const deletePuzzle = async (id: number) => {
    if (!confirm('Xóa puzzle này?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('✅ Xóa thành công!');
      fetchPuzzles();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('❌ Xóa thất bại!');
    }
  };

  const createFromTemplate = async (templateId: number) => {
    const template = PUZZLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setCreatingTemplate(templateId);
    try {
      const res = await fetch(`${API_BASE}/api/puzzles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          description: template.title,
          puzzleType: 'image',
          difficulty: template.difficulty,
          pieceCount: template.pieceCount,
          points: template.points,
          gridRows: template.gridRows,
          gridCols: template.gridCols,
          imageUrl: `https://via.placeholder.com/${template.gridCols * 150}x${template.gridRows * 150}?text=${template.title}`,
          sortOrder: puzzles.length + 1,
        }),
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('✅ Tạo puzzle thành công!');
      setShowTemplates(false);
      fetchPuzzles();
    } catch (error) {
      console.error('Failed to create puzzle:', error);
      toast.error('❌ Tạo puzzle thất bại!');
    } finally {
      setCreatingTemplate(null);
    }
  };

  const updateSortOrder = async (id: number, newOrder: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: newOrder }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('✅ Cập nhật thứ tự thành công!');
      setEditingId(null);
      fetchPuzzles();
    } catch (error) {
      console.error('Failed to update:', error);
      toast.error('❌ Cập nhật thất bại!');
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🎮 Quản Lý Puzzles</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            📋 Từ Template
          </button>
          <Link
            href="/admin/games/puzzles/create"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            ➕ Tạo Mới
          </Link>
        </div>
      </div>

      {showTemplates && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h2 className="text-xl font-bold mb-4">📋 Chọn Template</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PUZZLE_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => createFromTemplate(template.id)}
                disabled={creatingTemplate === template.id}
                className="p-3 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-100 text-left text-sm font-medium transition"
              >
                <div className="font-bold text-gray-900">{template.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {template.gridRows}×{template.gridCols} ({template.pieceCount}m) • {template.difficulty}
                </div>
                {creatingTemplate === template.id && <div className="text-xs text-blue-600 mt-1">⏳ Đang tạo...</div>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-gray-900">ID</th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">Tiêu Đề</th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">Loại</th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">Độ Khó</th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">Mảnh</th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">Điểm</th>
              <th className="px-6 py-3 text-center font-bold text-gray-900">Thứ Tự</th>
              <th className="px-6 py-3 text-center font-bold text-gray-900">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {puzzles.map((puzzle) => (
              <tr key={puzzle.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-800 font-medium">{puzzle.id}</td>
                <td className="px-6 py-3 font-bold text-gray-900">{puzzle.title}</td>
                <td className="px-6 py-3 text-gray-800 font-medium">{puzzle.puzzleType}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
                      puzzle.difficulty === 'easy'
                        ? 'bg-green-500'
                        : puzzle.difficulty === 'normal'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {puzzle.difficulty}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-800 font-bold">{puzzle.pieceCount}</td>
                <td className="px-6 py-3 text-gray-900 font-bold">{puzzle.points} pts</td>
                <td className="px-6 py-3 text-center">
                  {editingId === puzzle.id ? (
                    <div className="flex gap-2 justify-center">
                      <input
                        type="number"
                        min="1"
                        value={editOrder}
                        onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-800"
                      />
                      <button
                        onClick={() => updateSortOrder(puzzle.id, editOrder)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(puzzle.id);
                        setEditOrder(puzzle.sortOrder);
                      }}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      #{puzzle.sortOrder} 📝
                    </button>
                  )}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/admin/games/puzzles/${puzzle.id}/edit`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      ✏️ Sửa
                    </Link>
                    <button
                      onClick={() => deletePuzzle(puzzle.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {puzzles.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p className="text-lg font-medium">Chưa có puzzle nào. Tạo puzzle mới để bắt đầu!</p>
        </div>
      )}
    </div>
  );
}
