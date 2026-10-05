'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';

type Course = {
  id: number;
  title: string;
};

type Lesson = {
  id: number;
  title: string;
  slug: string;
  courseId: number;
  course?: Course;
  seoDescription?: string;
  thumbnailUrl?: string;
  lessonType?: 'video' | 'story' | 'game' | 'quiz' | 'interactive';
  durationMinutes?: number;
  videoUrl?: string;
  audioUrl?: string;
};

const PAGE_SIZE = 20;

export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [filterCourse, setFilterCourse] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  useEffect(() => {
    Promise.all([
      apiFetch<Lesson[]>('/lessons').then(setLessons).catch(() => {}),
      apiFetch<Course[]>('/courses').then(setCourses).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async (lesson: Lesson, thumbnailFile?: File) => {
    setSaving(true);
    try {
      const data: any = {
        title: lesson.title,
        slug: lesson.slug,
        courseId: lesson.courseId,
        seoDescription: lesson.seoDescription,
        lessonType: lesson.lessonType,
        durationMinutes: lesson.durationMinutes,
        videoUrl: lesson.videoUrl,
        audioUrl: lesson.audioUrl,
      };

      // Upload file nếu có
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          data.thumbnailUrl = url;
        }
      }

      await fetch(API+`/api/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setLessons((l: Lesson[]) =>
        l.map((item) => (item.id === lesson.id ? { ...item, ...data } : item))
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const filtered = lessons.filter((l) => {
    const matchCourse = !filterCourse || l.courseId === Number(filterCourse);
    const matchTitle = !filterTitle || l.title.toLowerCase().includes(filterTitle.toLowerCase());
    return matchCourse && matchTitle;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedLessons = filtered.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">📚 Danh sách Bài học</h1>

      {editingId ? (
        <EditForm
          lesson={lessons.find((l) => l.id === editingId)!}
          courses={courses}
          saving={saving}
          onSave={(l: Lesson, file?: File) => handleSave(l, file)}
          onCancel={() => setEditingId(null)}
          onChange={(field: string, value: any) => {
            setLessons((l: Lesson[]) =>
              l.map((item) =>
                item.id === editingId
                  ? { ...item, [field]: value }
                  : item
              )
            );
          }}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Khóa học</label>
              <select
                value={filterCourse}
                onChange={(e) => {
                  setFilterCourse(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-xl border border-slate-300"
              >
                <option value="">Tất cả ({lessons.length})</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({lessons.filter(l => l.courseId === c.id).length})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Tên bài học</label>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={filterTitle}
                onChange={(e) => {
                  setFilterTitle(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-900">Khóa học</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-900">Bài học</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-900">Slug</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900">SEO</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900">Thumbnail</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">{lesson.course?.title || '-'}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{lesson.title}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{lesson.slug}</td>
                    <td className="px-4 py-3 text-center">
                      {lesson.seoDescription ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✓</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {lesson.thumbnailUrl ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">✓</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingId(lesson.id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                        >
                          ✎ Sửa
                        </button>
                        <a
                          href={`/admin/lessons/${lesson.id}/import`}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700"
                        >
                          📥 Import
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-slate-500">
              Hiển thị {start + 1}-{Math.min(start + PAGE_SIZE, filtered.length)} / {filtered.length} bài học
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 disabled:opacity-50"
              >
                ← Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-bold text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 disabled:opacity-50"
              >
                Sau →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function EditForm({ lesson, courses, saving, onSave, onCancel, onChange }: any) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const lessonTypes = [
    { value: 'video', label: 'Video' },
    { value: 'interactive', label: 'Tương tác' },
    { value: 'game', label: 'Trò chơi' },
    { value: 'quiz', label: 'Kiểm tra' },
    { value: 'story', label: 'Câu chuyện' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900">{lesson.title}</h3>
        <button onClick={onCancel} className="text-2xl text-slate-400 hover:text-slate-600">✕</button>
      </div>

      <div className="space-y-4">
        {/* Khóa học */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">Khóa học</label>
          <select
            value={lesson.courseId || ''}
            onChange={(e) => onChange('courseId', Number(e.target.value))}
            className="w-full px-4 py-2 rounded-xl border border-slate-300"
          >
            <option value="">Chọn khóa học</option>
            {courses?.map((c: Course) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Tiêu đề */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">Tiêu đề</label>
          <input
            type="text"
            value={lesson.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">Slug</label>
          <input
            type="text"
            value={lesson.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300"
          />
        </div>

        {/* Loại bài học & Thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-slate-900 block mb-2">Loại bài học</label>
            <select
              value={lesson.lessonType || 'interactive'}
              onChange={(e) => onChange('lessonType', e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
            >
              {lessonTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-900 block mb-2">Thời gian (phút)</label>
            <input
              type="number"
              value={lesson.durationMinutes || ''}
              onChange={(e) => onChange('durationMinutes', e.target.value ? Number(e.target.value) : 0)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        {/* URLs */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">YouTube URL (bài giảng)</label>
          <input
            type="url"
            value={lesson.videoUrl || ''}
            onChange={(e) => onChange('videoUrl', e.target.value)}
            placeholder="https://youtube.com/..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">URL Audio</label>
          <input
            type="url"
            value={lesson.audioUrl || ''}
            onChange={(e) => onChange('audioUrl', e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">📸 Upload Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
          />
          {thumbnailFile && <p className="text-xs text-blue-600 mt-1">✓ {thumbnailFile.name}</p>}
          {lesson.thumbnailUrl && !thumbnailFile && <p className="text-xs text-green-600 mt-1">✓ Đã có ảnh</p>}
        </div>

        {/* SEO */}
        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">📖 Nội dung SEO</label>
          <textarea
            value={lesson.seoDescription || ''}
            onChange={(e) => onChange('seoDescription', e.target.value)}
            rows={6}
            placeholder="Mô tả bài học..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">{lesson.seoDescription?.length || 0} ký tự</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => onSave(lesson, thumbnailFile)}
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? '⏳ Lưu...' : '💾 Lưu'}
          </button>
          <button onClick={onCancel} className="flex-1 px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold">✕ Hủy</button>
        </div>
      </div>
    </div>
  );
}
