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
  exerciseNumber?: number;
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
  const [exerciseNumber, setExerciseNumber] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    apiFetch<Course[] | { data: Course[] }>('/courses').then((res) => {
      setCourses(Array.isArray(res) ? res : (res as { data: Course[] }).data || []);
    }).catch(() => {});
    apiFetch<Lesson[] | { data: Lesson[] }>('/lessons').then((res) => {
      setLessons(Array.isArray(res) ? res : (res as { data: Lesson[] }).data || []);
    }).catch(() => {});
    fetchQuizzes('', '', '', '', '', 1);
  }, []);

  const fetchQuizzes = useCallback(async (lid: string, cid: string, qt: string, q: string, ex: string, p: number) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE) });
      if (lid) params.set('lessonId', lid);
      if (cid) params.set('courseId', cid);
      if (qt) params.set('questionType', qt);
      if (ex) params.set('exerciseNumber', ex);
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
    fetchQuizzes('', cid, questionType, search, exerciseNumber, 1);
  };

  const handleLessonChange = (lid: string) => {
    setLessonId(lid);
    setPage(1);
    fetchQuizzes(lid, courseId, questionType, search, exerciseNumber, 1);
  };

  const handleTypeChange = (qt: string) => {
    setQuestionType(qt);
    setPage(1);
    fetchQuizzes(lessonId, courseId, qt, search, exerciseNumber, 1);
  };

  const handleExerciseChange = (ex: string) => {
    setExerciseNumber(ex);
    setPage(1);
    fetchQuizzes(lessonId, courseId, questionType, search, ex, 1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchQuizzes(lessonId, courseId, questionType, val, exerciseNumber, 1);
    }, 350);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, p);
  };

  const toggleActive = async (quiz: Quiz) => {
    try {
      await apiFetch(`/quizzes/${quiz.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !quiz.isActive }),
      });
      toast.success(quiz.isActive ? '✓ Tắt câu hỏi' : '✓ Kích hoạt câu hỏi');
      fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const updateDifficulty = async (quiz: Quiz, newLevel: string) => {
    try {
      await apiFetch(`/quizzes/${quiz.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ difficultyLevel: newLevel }),
      });
      toast.success('✓ Cập nhật trình độ');
      fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const updateExerciseNumber = async (quiz: Quiz, newNumber: number) => {
    if (newNumber < 1) {
      toast.error('Bài tập phải >= 1');
      return;
    }
    try {
      await apiFetch(`/quizzes/${quiz.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ exerciseNumber: newNumber }),
      });
      toast.success('✓ Cập nhật bài tập');
      fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi cập nhật');
    }
  };

  const deleteQuiz = async (quiz: Quiz) => {
    if (!window.confirm('Xóa câu hỏi này?')) return;
    try {
      await apiFetch(`/quizzes/${quiz.id}`, { method: 'DELETE' });
      fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi xóa');
    }
  };

  const toggleSelectQuiz = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === quizzes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(quizzes.map(q => q.id)));
    }
  };

  const deleteSelectedQuizzes = async () => {
    if (!window.confirm(`Xóa ${selectedIds.size} câu hỏi này?`)) return;
    try {
      // Delete each quiz
      await Promise.all(Array.from(selectedIds).map(id =>
        apiFetch(`/quizzes/${id}`, { method: 'DELETE' })
      ));
      toast.success(`✓ Đã xóa ${selectedIds.size} câu hỏi`);
      setSelectedIds(new Set());
      fetchQuizzes(lessonId, courseId, questionType, search, exerciseNumber, page);
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
    <input
      key="checkbox"
      type="checkbox"
      checked={selectedIds.has(q.id)}
      onChange={() => toggleSelectQuiz(q.id)}
      className="w-4 h-4 rounded cursor-pointer"
    />,
    <span key="idx" className="text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</span>,
    <span key="qt" className="max-w-xs truncate block" title={q.questionText}>{q.questionText?.substring(0, 60) || '-'}{(q.questionText?.length || 0) > 60 ? '...' : ''}</span>,
    <span key="lesson" className="text-xs text-gray-500 max-w-[140px] truncate block">{q.lesson?.title || '-'}</span>,
    <input
      key="exercise"
      type="number"
      min="1"
      value={q.exerciseNumber || 1}
      onChange={(e) => updateExerciseNumber(q, parseInt(e.target.value) || 1)}
      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />,
    q.questionType ? <Badge key="type" label={q.questionType} variant="blue" /> : '-',
    <select
      key="diff"
      value={q.difficultyLevel || 'easy'}
      onChange={(e) => updateDifficulty(q, e.target.value)}
      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="easy">Dễ</option>
      <option value="medium">Trung bình</option>
      <option value="hard">Nâng cao</option>
    </select>,
    q.points ?? '-',
    <button
      key="toggle"
      onClick={() => toggleActive(q)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        q.isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {q.isActive ? '✓ Bật' : '✕ Tắt'}
    </button>,
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Tất cả loại --</option>
          <option value="single_choice">Trắc nghiệm 1 đáp án</option>
          <option value="multiple_choice">Trắc nghiệm nhiều đáp án</option>
          <option value="true_false">Đúng / Sai</option>
          <option value="drag_drop">Kéo thả sắp xếp</option>
          <option value="sorting">Sắp xếp thứ tự</option>
          <option value="image_choice">Chọn theo hình ảnh</option>
          <option value="matching">Câu nối</option>
          <option value="fill_blank">Điền chỗ trống</option>
          <option value="counting">Đếm và điền số</option>
          <option value="coloring">Tô màu</option>
          <option value="trace_number">Tô số</option>
          <option value="letter_tracing">Tô chữ</option>
          <option value="number_line">Trục số</option>
          <option value="table_fill">Bảng điền</option>
          <option value="cross_out">Gạch chéo</option>
          <option value="puzzle">Ghép hình</option>
          <option value="find_errors">Tìm lỗi</option>
          <option value="game">Trò chơi</option>
        </select>

        <select
          value={exerciseNumber}
          onChange={(e) => handleExerciseChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Lọc theo bài tập"
        >
          <option value="">-- Tất cả bài tập --</option>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>Bài tập {n}</option>
          ))}
        </select>

        {!loading && (
          <span className="text-sm text-gray-500 ml-auto">{total} câu hỏi</span>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-bold text-blue-900">
            Đã chọn: {selectedIds.size}/{quizzes.length} câu hỏi
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-sm rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Bỏ chọn
            </button>
            <button
              onClick={deleteSelectedQuizzes}
              className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Xóa ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              checked={selectedIds.size === quizzes.length && quizzes.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-600 font-medium">
              Chọn tất cả ({quizzes.length})
            </span>
          </div>
          <DataTable headers={['', '#', 'Câu hỏi', 'Bài học', 'Bài tập #', 'Loại', 'Trình độ', 'Điểm', 'Hoạt động', 'Thao tác']} rows={rows} />
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} total={total} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
