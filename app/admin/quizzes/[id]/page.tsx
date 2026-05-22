'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuizForm, { type QuizFormData, type Lesson, formToPayload, payloadToForm } from '../components/QuizForm';
import { apiFetch } from '../../lib/api';

export default function EditQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [initial, setInitial] = useState<QuizFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<Lesson[] | { data: Lesson[] }>('/lessons'),
      apiFetch<Record<string, unknown>>(`/quizzes/${id}`),
    ]).then(([lessonsRes, quiz]) => {
      setLessons(Array.isArray(lessonsRes) ? lessonsRes : (lessonsRes as { data: Lesson[] }).data || []);
      setInitial(payloadToForm(quiz));
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form: QuizFormData) => {
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/quizzes/${id}`, { method: 'PATCH', body: JSON.stringify(formToPayload(form)) });
      router.push('/admin/quizzes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
    </div>
  );

  if (!initial) return <div className="text-red-600 p-4">{error || 'Không tìm thấy câu hỏi'}</div>;

  return (
    <QuizForm
      title="Sửa câu hỏi"
      lessons={lessons}
      initial={initial}
      saving={saving}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
