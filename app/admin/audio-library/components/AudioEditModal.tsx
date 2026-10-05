'use client';

import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Audio } from '../types';
import { validateTitle, formatFileSize, formatDuration } from '../utils/audioHelpers';
import { useAudioLibrary } from '../hooks/useAudioLibrary';

interface AudioEditModalProps {
  audio: Audio;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AudioEditModal({
  audio,
  isOpen,
  onClose,
  onSuccess,
}: AudioEditModalProps) {
  const { updateAudio, deleteAudio, isLoading, isDeleting } = useAudioLibrary();
  const [formData, setFormData] = useState({
    title: audio.title,
    description: audio.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleValidation = validateTitle(formData.title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.error || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await updateAudio(audio.id, {
      title: formData.title,
      description: formData.description,
    });

    if (result) {
      onSuccess?.();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const success = await deleteAudio(audio.id);
    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa âm thanh</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading || isDeleting}
            aria-label="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title input */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={e => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                setErrors(prev => ({ ...prev, title: '' }));
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading || isDeleting}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDeleting}
            />
          </div>

          {/* File info (read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Thông tin tệp</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Thời lượng</p>
                <p className="text-gray-800 mt-1">{formatDuration(audio.duration)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Kích thước</p>
                <p className="text-gray-800 mt-1">{formatFileSize(audio.file_size)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Định dạng</p>
                <p className="text-gray-800 mt-1 uppercase">{audio.mime_type.split('/')[1]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Trạng thái</p>
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
          </div>

          {/* Delete section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-900">Xóa âm thanh</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Hành động này không thể hoàn tác. Âm thanh sẽ bị xóa vĩnh viễn.
                  </p>
                </div>
              </div>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isLoading || isDeleting}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 w-full justify-center"
                >
                  <Trash2 size={16} />
                  Xóa âm thanh này
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={confirmDelete}
                      onChange={e => setConfirmDelete(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
                      disabled={isDeleting}
                    />
                    <span className="text-red-700">
                      Tôi chắc chắn muốn xóa âm thanh này
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={!confirmDelete || isDeleting}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          Xóa
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading || isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isDeleting || confirmDelete}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
