'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import QuestionForm, { ExamQuestion } from '../../QuestionForm';
import { apiFetch } from '../../../lib/api';

const TYPE_LABEL: Record<string, string> = {
  single_choice: 'Chọn 1',
  multiple_choice: 'Nhiều đáp án',
  true_false: 'Đúng/Sai',
  matching: 'Câu nối',
  fill_blank: 'Điền chỗ trống',
  number_compare: 'So sánh số',
  table_fill: 'Điền bảng',
  drag_to_position: 'Kéo thả',
};

const DIFF_LABEL: Record<string, string> = { easy: 'Dễ', medium: 'TB', hard: 'Khó' };
const DIFF_COLOR: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function ExamQuestionsPage() {
  const params = useParams<{ id: string }>();
  const examId = params.id;
  const [exam, setExam] = useState<{ title: string } | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [editing, setEditing] = useState<ExamQuestion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [examData, qs] = await Promise.all([
        apiFetch<{ title: string }>(`/exams/${examId}`),
        apiFetch<ExamQuestion[]>(`/exams/${examId}/questions`),
      ]);
      setExam(examData);
      setQuestions(qs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [examId]);

  const handleCreate = async (q: ExamQuestion) => {
    await apiFetch(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(q) });
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleUpdate = async (q: ExamQuestion) => {
    await apiFetch(`/exams/${examId}/questions/${q.id}`, { method: 'PATCH', body: JSON.stringify(q) });
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (qid: number) => {
    if (!confirm('Xóa câu hỏi này?')) return;
    await apiFetch(`/exams/${examId}/questions/${qid}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/exams" className="hover:text-gray-800 inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Danh sách đề thi
        </Link>
      </div>

      <PageHeader
        title="Câu hỏi"
        subtitle={exam ? `${exam.title} · ${questions.length} câu` : 'Đang tải...'}
        actions={
          !showForm && (
            <button onClick={() => { setEditing(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              <Plus size={15} /> Thêm câu hỏi
            </button>
          )
        }
      />

      {showForm && (
        <QuestionForm
          initial={editing ?? undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {!showForm && (
        loading && questions.length === 0 ? (
          <div className="py-10 text-center text-gray-400">Đang tải...</div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
            <p className="text-gray-500 mb-4">Đề thi này chưa có câu hỏi nào.</p>
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              <Plus size={15} /> Thêm câu đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        {TYPE_LABEL[q.questionType] ?? q.questionType}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${DIFF_COLOR[q.difficultyLevel]}`}>
                        {DIFF_LABEL[q.difficultyLevel]}
                      </span>
                      <span className="text-xs text-gray-400">{q.points} điểm</span>
                    </div>
                    <p className="text-gray-800 font-medium">{q.questionText}</p>
                    {q.optionsJson && q.optionsJson.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {q.optionsJson.map((o) => `${o.key}: ${o.text}`).join(' · ')}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-blue-600 mt-1 italic">💡 {q.explanation}</p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <button onClick={() => { setEditing(q); setShowForm(true); }}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => q.id && handleDelete(q.id)}
                      className="p-1.5 rounded text-red-500 hover:bg-red-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
