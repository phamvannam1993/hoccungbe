'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../lib/api';
import Badge from '../../components/Badge';

interface Course { id: string; title: string; }
interface Volume { id: string; courseId: string; name: string; sortOrder: number; }
interface Topic { id: string; courseId: string; volumeId?: string; name: string; sortOrder: number; }
interface Lesson {
  id: string; courseId?: string; title: string; slug?: string;
  volumeId?: string; topicId?: string;
  lessonType?: string; content?: string; videoUrl?: string; audioUrl?: string;
  thumbnailUrl?: string; sortOrder?: number; durationMinutes?: number;
  isPreview: boolean; isPublished: boolean;
}
interface Quiz {
  id: string; questionText?: string; questionType?: string;
  difficultyLevel?: string; points?: number; isActive: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function EditLessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [form, setForm] = useState({
    courseId: '', title: '', slug: '', lessonType: '', content: '',
    volumeId: '', topicId: '',
    videoUrl: '', audioUrl: '', thumbnailUrl: '', sortOrder: '',
    durationMinutes: '', isPreview: false, isPublished: false,
  });
  // Track if volumes/topics have been loaded after course is known
  const [volumesLoaded, setVolumesLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch<Course[] | { data: Course[] }>('/courses'),
      apiFetch<Lesson>(`/lessons/${id}`),
    ]).then(([coursesRes, lesson]) => {
      const courseList = Array.isArray(coursesRes) ? coursesRes : coursesRes.data || [];
      setCourses(courseList);
      const cId = lesson.courseId || '';
      setForm({
        courseId: cId,
        title: lesson.title,
        slug: lesson.slug || '',
        volumeId: lesson.volumeId ? String(lesson.volumeId) : '',
        topicId: lesson.topicId ? String(lesson.topicId) : '',
        lessonType: lesson.lessonType || '',
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        audioUrl: lesson.audioUrl || '',
        thumbnailUrl: lesson.thumbnailUrl || '',
        sortOrder: lesson.sortOrder != null ? String(lesson.sortOrder) : '',
        durationMinutes: lesson.durationMinutes != null ? String(lesson.durationMinutes) : '',
        isPreview: lesson.isPreview,
        isPublished: lesson.isPublished,
      });
      // Load volumes & topics for this course
      if (cId) {
        Promise.all([
          apiFetch<Volume[]>(`/volumes?courseId=${cId}`),
          apiFetch<Topic[]>(`/topics?courseId=${cId}${lesson.volumeId ? '&volumeId=' + lesson.volumeId : ''}`),
        ]).then(([vols, tops]) => {
          setVolumes(Array.isArray(vols) ? vols : []);
          setTopics(Array.isArray(tops) ? tops : []);
          setVolumesLoaded(true);
        }).catch(() => setVolumesLoaded(true));
      } else {
        setVolumesLoaded(true);
      }
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));

    // Load quizzes for this lesson
    setQuizLoading(true);
    apiFetch<Quiz[]>(`/quizzes?lessonId=${id}`).then((res) => {
      setQuizzes(Array.isArray(res) ? res : []);
    }).catch(() => {}).finally(() => setQuizLoading(false));
  }, [id]);

  // Reload volumes when courseId changes (user switches course)
  useEffect(() => {
    if (!volumesLoaded) return; // skip on initial load
    if (!form.courseId) { setVolumes([]); setTopics([]); return; }
    apiFetch<Volume[]>(`/volumes?courseId=${form.courseId}`).then((res) => {
      setVolumes(Array.isArray(res) ? res : []);
    });
    apiFetch<Topic[]>(`/topics?courseId=${form.courseId}`).then((res) => {
      setTopics(Array.isArray(res) ? res : []);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.courseId]);

  // Reload topics when volumeId changes
  useEffect(() => {
    if (!volumesLoaded || !form.courseId) return;
    const params = new URLSearchParams({ courseId: form.courseId });
    if (form.volumeId) params.set('volumeId', form.volumeId);
    apiFetch<Topic[]>(`/topics?${params.toString()}`).then((res) => {
      setTopics(Array.isArray(res) ? res : []);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.volumeId]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const deleteQuiz = async (quiz: Quiz) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await apiFetch(`/quizzes/${quiz.id}`, { method: 'DELETE' });
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const diffBadge = (level?: string) => {
    if (level === 'easy') return <Badge label="Dễ" variant="blue" />;
    if (level === 'medium') return <Badge label="Trung bình" variant="orange" />;
    if (level === 'hard') return <Badge label="Nâng cao" variant="red" />;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/lessons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          courseId: Number(form.courseId),
          volumeId: form.volumeId ? Number(form.volumeId) : null,
          topicId: form.topicId ? Number(form.topicId) : null,
          lessonType: form.lessonType,
          content: form.content,
          videoUrl: form.videoUrl,
          audioUrl: form.audioUrl,
          thumbnailUrl: form.thumbnailUrl,
          sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
          durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
          isPreview: form.isPreview,
          isPublished: form.isPublished,
        }),
      });
      toast.success('Cập nhật thành công!');
      router.push('/admin/lessons');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/lessons" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Bài học</h1>
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học</label>
            <select value={form.courseId} onChange={(e) => set('courseId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn khóa học --</option>
              {courses.map((c) => <option key={c.id} value={String(c.id)}>{c.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <input type="text" required value={form.title} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, title: v, slug: slugify(v) })); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Volume & Topic dropdowns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tập</label>
            <select value={form.volumeId} onChange={(e) => { set('volumeId', e.target.value); set('topicId', ''); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Không có --</option>
              {volumes.map((v) => <option key={v.id} value={String(v.id)}>{v.name}</option>)}
            </select>
            {form.courseId && volumes.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">Chưa có tập. <Link href="/admin/volumes" className="text-blue-500 hover:underline">Tạo tập</Link></p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
            <select value={form.topicId} onChange={(e) => set('topicId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Không có --</option>
              {topics.map((t) => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
            </select>
            {form.courseId && topics.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">Chưa có chủ đề. <Link href="/admin/topics" className="text-blue-500 hover:underline">Tạo chủ đề</Link></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài học</label>
            <select value={form.lessonType} onChange={(e) => set('lessonType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn...</option>
              <option value="video">Video</option>
              <option value="story">Câu chuyện</option>
              <option value="game">Trò chơi</option>
              <option value="quiz">Kiểm tra</option>
              <option value="interactive">Tương tác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
            <input type="number" value={form.durationMinutes} onChange={(e) => set('durationMinutes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL (video bài giảng)</label>
            <input type="text" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio</label>
            <input type="text" value={form.audioUrl} onChange={(e) => set('audioUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Thumbnail</label>
            <input type="text" value={form.thumbnailUrl} onChange={(e) => set('thumbnailUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea rows={5} value={form.content} onChange={(e) => set('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPreview} onChange={(e) => set('isPreview', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Preview miễn phí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Xuất bản</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link href="/admin/lessons" className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Hủy</Link>
        </div>
      </form>

      {/* Quizzes section */}
      <div className="mt-8 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Câu hỏi bài học
            {!quizLoading && <span className="ml-2 text-sm font-normal text-gray-500">({quizzes.length} câu)</span>}
          </h2>
          <Link
            href={`/admin/quizzes/new?lessonId=${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            <Plus size={15} /> Thêm câu hỏi
          </Link>
        </div>

        {quizLoading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            Chưa có câu hỏi nào. <Link href={`/admin/quizzes/new?lessonId=${id}`} className="text-blue-500 hover:underline">Thêm ngay</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Group by difficulty */}
            {(['easy', 'medium', 'hard'] as const).map((level) => {
              const group = quizzes.filter((q) => q.difficultyLevel === level);
              if (!group.length) return null;
              const label = level === 'easy' ? 'Dễ' : level === 'medium' ? 'Trung bình' : 'Nâng cao';
              const headerCls = level === 'easy' ? 'bg-blue-50 text-blue-700' : level === 'medium' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700';
              return (
                <div key={level}>
                  <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${headerCls}`}>
                    {label} — {group.length} câu
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-50">
                      {group.map((q, i) => (
                        <tr key={q.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-400 w-8">{i + 1}</td>
                          <td className="px-4 py-2 text-gray-700 max-w-xl">
                            <span className="line-clamp-1" title={q.questionText}>{q.questionText}</span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <Badge label={q.questionType || '-'} variant="gray" />
                          </td>
                          <td className="px-4 py-2 text-gray-500 text-xs whitespace-nowrap">{q.points ?? '-'} đ</td>
                          <td className="px-4 py-2">
                            {q.isActive ? <Badge label="✓" variant="green" /> : <Badge label="✗" variant="gray" />}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Link href={`/admin/quizzes/${q.id}`} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Edit size={14} />
                              </Link>
                              <button onClick={() => deleteQuiz(q)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
