'use client';

import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import AudioUploadForm from './components/AudioUploadForm';
import AudioList from './components/AudioList';

export function AudioLibraryContent() {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Refresh the list
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <a href="/admin/dashboard" className="hover:text-gray-900 transition-colors">
          Tổng quan
        </a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Kho Âm Thanh</span>
      </nav>

      {/* Page Header */}
      <PageHeader title="Kho Âm Thanh" subtitle="Quản lý thư viện âm thanh hệ thống" />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Danh Sách
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Tải Lên
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'list' ? (
          <div key={refreshKey}>
            <AudioList />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <AudioUploadForm onSuccess={handleUploadSuccess} />
          </div>
        )}
      </div>
    </div>
  );
}
