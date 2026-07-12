'use client';

import { useEffect, useState, useMemo } from 'react';
import { Play, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Audio } from '../types';
import { useAudioLibrary } from '../hooks/useAudioLibrary';
import { formatFileSize, formatDuration } from '../utils/audioHelpers';
import AudioPreviewModal from './AudioPreviewModal';
import AudioEditModal from './AudioEditModal';
import Badge from '../../components/Badge';

const ITEMS_PER_PAGE = 10;

export default function AudioList() {
  const { fetchAudios, deleteAudio, isLoading, isDeleting } = useAudioLibrary();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'created_date'>('created_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewAudio, setPreviewAudio] = useState<Audio | null>(null);
  const [editAudio, setEditAudio] = useState<Audio | null>(null);

  // Fetch audios on mount and when sort changes
  useEffect(() => {
    const loadAudios = async () => {
      const data = await fetchAudios({
        sortBy,
      });
      setAudios(data);
      setCurrentPage(1);
    };
    loadAudios();
  }, [sortBy, fetchAudios]);

  // Filter audios by search query
  const filteredAudios = useMemo(() => {
    if (!search.trim()) return audios;
    const query = search.toLowerCase();
    return audios.filter(
      audio =>
        audio.title.toLowerCase().includes(query) ||
        audio.description?.toLowerCase().includes(query)
    );
  }, [audios, search]);

  // Paginate audios
  const paginatedAudios = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAudios.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredAudios, currentPage]);

  const totalPages = Math.ceil(filteredAudios.length / ITEMS_PER_PAGE);

  const handleDelete = async (audio: Audio) => {
    if (!window.confirm(`Xóa âm thanh "${audio.title}"?`)) return;

    const success = await deleteAudio(audio.id);
    if (success) {
      setAudios(prev => prev.filter(a => a.id !== audio.id));
    }
  };

  // Loading skeleton
  if (isLoading && audios.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Empty state
  if (audios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có âm thanh nào. Hãy tải lên âm thanh đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <input
            id="search"
            type="text"
            placeholder="Tìm theo tiêu đề hoặc mô tả..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'title' | 'created_date')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_date">Ngày tải lên (mới nhất)</option>
            <option value="title">Tiêu đề (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Hiển thị {paginatedAudios.length} trên {filteredAudios.length} âm thanh
        {search && ` (tìm kiếm: "${search}")`}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Tiêu đề
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Thời lượng
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Kích thước
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Trạng thái
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Ngày tải lên
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAudios.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-400"
                >
                  Không tìm thấy âm thanh nào
                </td>
              </tr>
            ) : (
              paginatedAudios.map((audio, idx) => (
                <tr
                  key={audio.id}
                  className={`border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-3 text-gray-900 font-medium max-w-xs truncate">
                    {audio.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDuration(audio.duration)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatFileSize(audio.file_size)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={audio.status === 'active' ? 'Hoạt động' : 'Đã xóa'}
                      variant={audio.status === 'active' ? 'green' : 'gray'}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap text-xs">
                    {new Date(audio.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewAudio(audio)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem trước"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => setEditAudio(audio)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(audio)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              Tiếp
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AudioPreviewModal
        audio={previewAudio!}
        isOpen={!!previewAudio}
        onClose={() => setPreviewAudio(null)}
      />
      <AudioEditModal
        audio={editAudio!}
        isOpen={!!editAudio}
        onClose={() => setEditAudio(null)}
        onSuccess={() => {
          // Refresh the list
          setAudios(prev =>
            prev.map(a =>
              a.id === editAudio?.id ? { ...editAudio, ...editAudio } : a
            )
          );
        }}
      />
    </div>
  );
}
