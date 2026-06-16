'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Search, Volume2, Upload, Loader } from 'lucide-react';
import { useAudioLibrary } from '../audio-library/hooks/useAudioLibrary';
import { Audio } from '../audio-library/types';
import { formatFileSize, formatDuration } from '../audio-library/utils/audioHelpers';
import AudioUploadForm from '../audio-library/components/AudioUploadForm';

interface AudioLibrarySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (audioUrl: string, audioId: string, audioTitle: string) => void;
  currentAudioUrl?: string;
  allowUpload?: boolean;
}

export default function AudioLibrarySelector({
  isOpen,
  onClose,
  onSelect,
  currentAudioUrl,
  allowUpload = true,
}: AudioLibrarySelectorProps) {
  const { fetchAudios, searchAudios, isLoading } = useAudioLibrary();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<Audio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load audios on mount
  useEffect(() => {
    if (isOpen && activeTab === 'library' && audios.length === 0) {
      loadAllAudios();
    }
  }, [isOpen, activeTab]);

  const loadAllAudios = async () => {
    const data = await fetchAudios({ limit: 100 });
    setAudios(data);
    setFilteredAudios(data);
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredAudios(audios);
      return;
    }

    const results = await searchAudios(query, 100);
    setFilteredAudios(results);
  };

  // Handle audio selection
  const handleSelectAudio = (audio: Audio) => {
    setSelectedAudio(audio);
    onSelect(audio.file_path, audio.id, audio.title);
    onClose();
  };

  // Handle upload success
  const handleUploadSuccess = async () => {
    // Reload audios list
    await loadAllAudios();
    // Switch to library tab to show the newly uploaded audio
    setActiveTab('library');
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const audioUrl = currentAudioUrl ? (currentAudioUrl.startsWith('http') ? currentAudioUrl : `${BASE_URL}${currentAudioUrl}`) : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Chọn âm thanh</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Current audio info */}
        {audioUrl && (
          <div className="px-6 pt-4 pb-2 bg-blue-50 border-b border-blue-200">
            <p className="text-xs text-blue-700 mb-2">Audio hiện tại:</p>
            <audio src={audioUrl} controls className="w-full h-8" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Thư viện
          </button>
          {allowUpload && (
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              Tải lên
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm âm thanh..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Loading state */}
              {isLoading && filteredAudios.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-blue-600" size={24} />
                </div>
              )}

              {/* Empty state */}
              {!isLoading && filteredAudios.length === 0 && (
                <div className="text-center py-12">
                  <Volume2 className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-500">
                    {audios.length === 0 ? 'Chưa có âm thanh nào' : 'Không tìm thấy âm thanh'}
                  </p>
                </div>
              )}

              {/* Audio list */}
              <div className="space-y-2">
                {filteredAudios.map((audio) => (
                  <button
                    key={audio.id}
                    onClick={() => handleSelectAudio(audio)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Volume2 className="text-blue-600 flex-shrink-0 mt-1" size={18} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{audio.title}</p>
                        {audio.description && (
                          <p className="text-xs text-gray-500 truncate">{audio.description}</p>
                        )}
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <span>{formatDuration(audio.duration)}</span>
                          <span>{formatFileSize(audio.file_size)}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <audio src={audio.file_path} controls className="h-6" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AudioUploadForm onSuccess={handleUploadSuccess} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
