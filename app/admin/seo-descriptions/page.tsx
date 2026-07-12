'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';

type Lesson = {
  id: number;
  title: string;
  slug: string;
  seoDescription?: string;
};

export default function AdminSeoDescriptions() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  useEffect(() => {
    apiFetch<Lesson[]>('/lessons')
      .then(setLessons)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (lessonId: number, newDescription: string) => {
    setSaving((s) => ({ ...s, [lessonId]: true }));
    try {
      const response = await fetch(`/api/lessons/${lessonId}/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seoDescription: newDescription }),
      });

      if (response.ok) {
        setLessons((l) =>
          l.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, seoDescription: newDescription } : lesson
          )
        );
        setEditing(null);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving((s) => ({ ...s, [lessonId]: false }));
    }
  };

  const filtered = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">📝 Quản lý SEO Bài học</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-2xl p-4 ring-1 ring-blue-200">
          <p className="text-sm text-blue-600 font-bold">Tổng bài học</p>
          <p className="text-2xl font-black text-blue-900">{lessons.length}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 ring-1 ring-green-200">
          <p className="text-sm text-green-600 font-bold">Có SEO</p>
          <p className="text-2xl font-black text-green-900">
            {lessons.filter((l) => l.seoDescription).length}
          </p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 ring-1 ring-orange-200">
          <p className="text-sm text-orange-600 font-bold">Chưa có SEO</p>
          <p className="text-2xl font-black text-orange-900">
            {lessons.filter((l) => !l.seoDescription).length}
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filtered.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900">{lesson.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{lesson.slug}</p>
                </div>
                <div className="flex gap-2">
                  {lesson.seoDescription ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      ✓ Có
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                      ⚠ Chưa
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              {editing === lesson.id ? (
                <div className="space-y-3">
                  <textarea
                    defaultValue={lesson.seoDescription || ''}
                    id={`seo-${lesson.id}`}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-blue-300 bg-blue-50 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Nhập mô tả SEO cho bài học..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const text = (document.getElementById(`seo-${lesson.id}`) as HTMLTextAreaElement)
                          ?.value;
                        if (text !== undefined) {
                          handleSave(lesson.id, text);
                        }
                      }}
                      disabled={saving[lesson.id]}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving[lesson.id] ? '⏳ Đang lưu...' : '💾 Lưu'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-300"
                    >
                      ✕ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {lesson.seoDescription ? (
                    <p className="text-sm text-slate-700 leading-6 mb-3">{lesson.seoDescription}</p>
                  ) : (
                    <p className="text-sm text-slate-500 italic mb-3">Chưa có mô tả SEO</p>
                  )}
                  <button
                    onClick={() => setEditing(lesson.id)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    ✎ Chỉnh sửa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
