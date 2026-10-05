'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Piece {
  id: number;
  position: number;
  content: string;
  display: string;
  configJson?: Record<string, any>;
}

interface PiecesListProps {
  puzzleId: number;
  imageUrl?: string;
  puzzleType: string;
  onPiecesChange: () => void;
}

export default function PiecesList({
  puzzleId,
  imageUrl,
  puzzleType,
  onPiecesChange,
}: PiecesListProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchPieces();
  }, [puzzleId]);

  const fetchPieces = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/${puzzleId}/pieces`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPieces(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch pieces:', error);
      setPieces([]);
      setLoading(false);
    }
  };

  const deletePiece = async (pieceId: number) => {
    if (!confirm('Xóa mảnh này?')) return;

    setDeleting(pieceId);
    try {
      const res = await fetch(`${API_BASE}/api/puzzles/pieces/${pieceId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      setPieces((prev) => prev.filter((p) => p.id !== pieceId));
      toast.success('✅ Xóa mảnh thành công!');
      onPiecesChange();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('❌ Xóa thất bại!');
    } finally {
      setDeleting(null);
    }
  };

  const renderPiecePreview = (piece: Piece) => {
    if (piece.display === 'image' && imageUrl && piece.configJson?.cropBox) {
      const cropBox = piece.configJson.cropBox;
      return (
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: '100% 100%',
            backgroundPosition: `${cropBox.x * 100}% ${cropBox.y * 100}%`,
            backgroundRepeat: 'no-repeat',
            width: '80px',
            height: '80px',
          }}
          className="border border-gray-300 rounded"
        />
      );
    }

    return (
      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white text-2xl font-bold">
        {piece.content}
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-gray-600">⏳ Đang tải mảnh...</div>;
  }

  if (pieces.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        ⚠️ Không có mảnh nào
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-900">
        📦 Danh Sách Mảnh ({pieces.length})
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pieces.map((piece) => (
          <div key={piece.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
            <div className="flex justify-center mb-2">{renderPiecePreview(piece)}</div>

            <div className="text-center text-sm">
              <div className="text-gray-600">Vị trí: {piece.position + 1}</div>
              {piece.display === 'text' && (
                <div className="text-gray-800 font-bold">{piece.content}</div>
              )}
            </div>

            <button
              onClick={() => deletePiece(piece.id)}
              disabled={deleting === piece.id}
              className="w-full mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
            >
              {deleting === piece.id ? '⏳' : '🗑️ Xóa'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
