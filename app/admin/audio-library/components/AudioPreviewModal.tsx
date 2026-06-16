'use client';

import { X, Download } from 'lucide-react';
import { Audio } from '../types';
import { formatFileSize, formatDuration } from '../utils/audioHelpers';

interface AudioPreviewModalProps {
  audio: Audio;
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioPreviewModal({ audio, isOpen, onClose }: AudioPreviewModalProps) {
  if (!isOpen) return null;

  const createdDate = new Date(audio.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Xem trước âm thanh</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Audio player */}
          <div className="bg-gray-50 rounded-lg p-4">
            <audio
              controls
              className="w-full"
              src={audio.file_path}
              controlsList="nodownload"
            >
              Trình duyệt của bạn không hỗ trợ phát âm thanh.
            </audio>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Tiêu đề</p>
            <p className="text-gray-800 font-medium mt-1">{audio.title}</p>
          </div>

          {/* Description */}
          {audio.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Mô tả</p>
              <p className="text-gray-700 mt-1 text-sm">{audio.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Thời lượng</p>
              <p className="text-gray-800 font-medium text-sm mt-1">
                {formatDuration(audio.duration)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Kích thước</p>
              <p className="text-gray-800 font-medium text-sm mt-1">
                {formatFileSize(audio.file_size)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Định dạng</p>
              <p className="text-gray-800 font-medium text-sm mt-1 uppercase">
                {audio.mime_type.split('/')[1] || 'Unknown'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Trạng thái</p>
              <span
                className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded ${
                  audio.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {audio.status === 'active' ? 'Hoạt động' : 'Đã xóa'}
              </span>
            </div>
          </div>

          {/* Created date */}
          <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-4">
            <p>Tải lên vào: {createdDate}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-gray-200">
          <a
            href={audio.file_path}
            download={audio.title}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Tải xuống
          </a>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
