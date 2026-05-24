'use client';
import { toast } from 'sonner';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import { apiFetch } from '../lib/api';

const PAGE_SIZE = 20;

interface Course { id: string; title: string; }
interface Lesson { id: string; title: string; courseId?: string; }
interface Quiz {
  id: string;
  questionText?: string;
  questionType?: string;
  difficultyLevel?: string;
  points?: number;
  sortOrder?: number;
  isActive: boolean;
  lessonId?: string;
  lesson?: { id: string; title: string; courseId?: string };
}
interface QuizPage { data: Quiz[]; total: number; page: number; totalPages: number; }

export default function QuizzesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    apiFetch<Course[] | { data: Course[] }>('/courses').then((res) => {
      setCourses(Array.isArray(res) ? res : (res as { data: Course[] }).data || []);
    }).catch(() => {});
    apiFetch<Lesson[] | { data: Lesson[] }>('/lessons').then((res) => {
      setLessons(Array.isArray(res) ? res : (res as { data: Lesson[] }).data || []);
    }).catch(() => {});
    fetchQuizzes('', '', '', '', 1);
  }, []);

  const fetchQuizzes = useCallback(async (lid: string, cid: string, qt: string, q: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (lid) params.set('lessonId', lid);
      if (cid) params.set('courseId', cid);
      if (qt) params.set('questionType', qt);
      if (q) params.set('search', q);
      const res = await apiFetch<QuizPage>(`/quizzes?${params.toString()}`);
      setQuizzes(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCourseChange = (cid: string) => {
    setCourseId(cid);
    setLessonId('');
    setPage(1);
    fetchQuizzes('', cid, questionType, search, 1);
  };

  const handleLessonChange = (lid: string) => {
    setLessonId(lid);
    setPage(1);
    fetchQuizzes(lid, courseId, questionType, search, 1);
  };

  const handleTypeChange = (qt: string) => {
    setQuestionType(qt);
    setPage(1);
    fetchQuizzes(lessonId, courseId, qt, search, 1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchQuizzes(lessonId, courseId, questionType, val, 1);
    }, 350);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchQuizzes(lessonId, courseId, questionType, search, p);
  };

  const deleteQuiz = async (quiz: Quiz) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await apiFetch(`/quizzes/${quiz.id}`, { method: 'DELETE' });
      fetchQuizzes(lessonId, courseId, search, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const diffBadge = (level?: string) => {
    if (level === 'easy') return <Badge key="diff" label="Dễ" variant="blue" />;
    if (level === 'medium') return <Badge key="diff" label="Trung bình" variant="orange" />;
    if (level === 'hard') return <Badge key="diff" label="Nâng cao" variant="red" />;
    return <span>-</span>;
  };

  const filteredLessons = courseId
    ? lessons.filter((l) => String(l.courseId) === courseId)
    : lessons;

  const rows = quizzes.map((q, i) => [
    <span key="idx" className="text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</span>,
    <span key="qt" className="max-w-xs truncate block" title={q.questionText}>{q.questionText?.substring(0, 60) || '-'}{(q.questionText?.length || 0) > 60 ? '...' : ''}</span>,
    <span key="lesson" className="text-xs text-gray-500 max-w-[140px] truncate block">{q.lesson?.title || '-'}</span>,
    q.questionType ? <Badge key="type" label={q.questionType} variant="blue" /> : '-',
    diffBadge(q.difficultyLevel),
    q.points ?? '-',
    q.isActive ? <Badge key="active" label="Hoạt động" variant="green" /> : <Badge key="inactive" label="Tắt" variant="gray" />,
    <div key="actions" className="flex items-center gap-2">
      <Link href={`/admin/quizzes/${q.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
        <Edit size={16} />
      </Link>
      <button onClick={() => deleteQuiz(q)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
        <Trash2 size={16} />
      </button>
    </div>,
  ]);

  return (
    <div>
      <PageHeader title="Quản lý Câu hỏi" addHref="/admin/quizzes/new" />

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={courseId}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
        >
          <option value="">-- Tất cả khóa học --</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <select
          value={lessonId}
          onChange={(e) => handleLessonChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
        >
          <option value="">-- Tất cả bài học --</option>
          {filteredLessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>

        <select
          value={questionType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-44"
        >
          <option value="">-- Tất cả loại --</option>
          <option value="single_choice">Một đáp án</option>
          <option value="multiple_choice">Nhiều đáp án</option>
          <option value="true_false">Đúng/Sai</option>
          <option value="fill_blank">Điền chỗ trống</option>
          <option value="matching">Nối cặp</option>
          <option value="sorting">Sắp xếp</option>
          <option value="drag_drop">Kéo thả</option>
          <option value="cross_out">Gạch bỏ</option>
          <option value="counting">Đếm số</option>
          <option value="coloring">Tô màu</option>
          <option value="puzzle">Ghép hình</option>
          <option value="game">Trò chơi</option>
          <option value="image_choice">Chọn hình</option>
          <option value="table_fill">Điền bảng</option>
          <option value="number_line">Trục số</option>
        </select>

        {!loading && (
          <span className="text-sm text-gray-500 ml-auto">{total} câu hỏi</span>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <DataTable headers={['#', 'Câu hỏi', 'Bài học', 'Loại', 'Trình độ', 'Điểm', 'Trạng thái', 'Thao tác']} rows={rows} />
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} total={total} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
