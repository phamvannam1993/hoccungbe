'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PiecesList from './components/PiecesList';
import ImagePiecesPreview from './components/ImagePiecesPreview';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface PuzzleFormProps {
  puzzleId?: number;
}

export default function PuzzleForm({ puzzleId }: PuzzleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!puzzleId);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [piecesKey, setPiecesKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instruction: '',
    puzzleType: 'animal',
    difficulty: 'easy',
    pieceCount: 9,
    points: 10,
    sortOrder: 1,
    imageUrl: '',
    gridRows: 3,
    gridCols: 3,
  });

  useEffect(() => {
    console.log('PuzzleForm mounted, puzzleId:', puzzleId);
    if (puzzleId) {
      fetchPuzzle();
    } else {
      setLoading(false);
    }
  }, [puzzleId]);

  const fetchPuzzle = async () => {
    try {
      console.log('Fetching puzzle from:', `${API_BASE}/api/puzzles/${puzzleId}`);
      const res = await fetch(`${API_BASE}/api/puzzles/${puzzleId}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Puzzle data:', data);

      setFormData({
        title: data.title || '',
        description: data.description || '',
        instruction: data.instruction || '',
        puzzleType: data.puzzleType || 'animal',
        difficulty: data.difficulty || 'easy',
        pieceCount: data.pieceCount || 9,
        points: data.points || 10,
        sortOrder: data.sortOrder || 1,
        imageUrl: data.imageUrl || '',
        gridRows: data.gridRows || 3,
        gridCols: data.gridCols || 3,
      });
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }

      setError('');
      setLoading(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to fetch puzzle:', msg);
      setError(`Lỗi: ${msg}`);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to S3
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const uploadRes = await fetch(`${API_BASE}/api/upload/image`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const uploadData = await uploadRes.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadData.url,
      }));

      toast.success('✅ Tải ảnh thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('❌ Tải ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image puzzle requirements
    if (formData.puzzleType === 'image' && !formData.imageUrl) {
      toast.error('❌ Vui lòng tải ảnh cho puzzle loại hình ảnh');
      return;
    }

    setLoading(true);

    try {
      const method = puzzleId ? 'PATCH' : 'POST';
      const url = puzzleId
        ? `${API_BASE}/api/puzzles/${puzzleId}`
        : `${API_BASE}/api/puzzles`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }

      toast.success(puzzleId ? '✅ Cập nhật thành công!' : '✅ Tạo mới thành công!');
      router.push('/admin/games/puzzles');
    } catch (error) {
      console.error('Error:', error);
      toast.error(`❌ Lỗi: ${error instanceof Error ? error.message : 'Kết nối thất bại'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && puzzleId) {
    return <div className="p-8 text-center">⏳ Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {puzzleId ? '✏️ Chỉnh Sửa Puzzle' : '➕ Tạo Puzzle Mới'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900">Tiêu Đề *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
            placeholder="VD: Ghép Hình Con Vật"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900">Mô Tả *</label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
            placeholder="VD: Ghép 9 mảnh hình sư tử"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-gray-900">Hướng Dẫn *</label>
          <textarea
            required
            value={formData.instruction}
            onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 text-gray-800 placeholder-gray-400"
            placeholder="Hướng dẫn cho trẻ..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Loại Puzzle *</label>
            <select
              value={formData.puzzleType}
              onChange={(e) => setFormData({ ...formData, puzzleType: e.target.value, imageUrl: '' })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-medium"
            >
              <option value="animal">Con Vật</option>
              <option value="fruit">Trái Cây</option>
              <option value="letters">Chữ Cái</option>
              <option value="numbers">Số</option>
              <option value="map">Bản Đồ</option>
              <option value="food">Đồ Ăn</option>
              <option value="shapes">Hình Dạng</option>
              <option value="vehicles">Phương Tiện</option>
              <option value="colors">Màu Sắc</option>
              <option value="image">📷 Ảnh Tùy Chỉnh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Độ Khó *</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-medium"
            >
              <option value="easy">Dễ</option>
              <option value="normal">Trung Bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>
        </div>

        {formData.puzzleType === 'image' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">
                    {puzzleId ? 'Thay Thế Ảnh' : 'Tải Ảnh Puzzle'} *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  {uploading && <p className="text-sm text-blue-600 mt-2">⏳ Đang tải...</p>}
                  {formData.imageUrl && <p className="text-sm text-green-600 mt-2">✅ Ảnh đã tải</p>}
                </div>

                <div>
                  {imagePreview && (
                    <div className="text-sm font-bold text-gray-900 mb-2">Xem Trước:</div>
                  )}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Hàng (Rows) *</label>
                  <select
                    value={formData.gridRows}
                    onChange={(e) => setFormData({ ...formData, gridRows: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-medium"
                  >
                    <option value={1}>1x2 (2 mảnh)</option>
                    <option value={2}>2x2 (4 mảnh)</option>
                    <option value={3}>3x3 (9 mảnh)</option>
                    <option value={4}>4x4 (16 mảnh)</option>
                    <option value={5}>5x5 (25 mảnh)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-900">Cột (Cols) *</label>
                  <select
                    value={formData.gridCols}
                    onChange={(e) => setFormData({ ...formData, gridCols: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 font-medium"
                  >
                    <option value={2}>1x2 (2 mảnh)</option>
                    <option value={2}>2x2 (4 mảnh)</option>
                    <option value={3}>3x3 (9 mảnh)</option>
                    <option value={4}>4x4 (16 mảnh)</option>
                    <option value={5}>5x5 (25 mảnh)</option>
                  </select>
                </div>
              </div>

              {puzzleId && (
                <p className="text-xs text-blue-600 mt-3 p-2 bg-blue-100 rounded">
                  💡 Thay đổi grid size sẽ tự động chia lại tất cả mảnh khi bạn cập nhật
                </p>
              )}
            </div>

            {formData.imageUrl && (
              <ImagePiecesPreview
                imageUrl={formData.imageUrl}
                gridRows={formData.gridRows}
                gridCols={formData.gridCols}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Số Mảnh *</label>
            <input
              type="number"
              required
              min="1"
              value={
                formData.puzzleType === 'image'
                  ? formData.gridRows * formData.gridCols
                  : formData.pieceCount
              }
              onChange={(e) => {
                if (formData.puzzleType !== 'image') {
                  setFormData({ ...formData, pieceCount: parseInt(e.target.value) });
                }
              }}
              disabled={formData.puzzleType === 'image'}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 disabled:bg-gray-100"
            />
            {formData.puzzleType === 'image' && (
              <p className="text-xs text-gray-500 mt-1">🔒 Tự động tính từ grid size</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Điểm Thưởng *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Thứ Tự Hiển Thị *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">📊 Số nhỏ hơn = hiển thị trước</p>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold"
          >
            {loading ? '⏳ Đang xử lý...' : puzzleId ? '💾 Cập Nhật' : '✨ Tạo Mới'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-bold"
          >
            ← Hủy
          </button>
        </div>
      </form>

      {puzzleId && formData.puzzleType === 'image' && (
        <div className="mt-8">
          <PiecesList
            key={piecesKey}
            puzzleId={puzzleId}
            imageUrl={formData.imageUrl}
            puzzleType={formData.puzzleType}
            onPiecesChange={() => setPiecesKey((k) => k + 1)}
          />
        </div>
      )}
    </div>
  );
}
