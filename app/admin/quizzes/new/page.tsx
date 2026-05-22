'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizForm, { type QuizFormData, type Lesson, formToPayload } from '../components/QuizForm';
import { apiFetch } from '../../lib/api';

const DEFAULT_FORM: QuizFormData = {
  lessonId: '',
  questionText: '',
  questionType: 'single_choice',
  difficultyLevel: 'easy',
  exerciseNumber: '1',
  questionImageUrl: '',
  questionAudioUrl: '',
  explanation: '',
  explanationAudioUrl: '',
  points: '10',
  sortOrder: '1',
  isActive: true,
  options: [
    { key: 'A', text: '', audioUrl: '' },
    { key: 'B', text: '', audioUrl: '' },
    { key: 'C', text: '', audioUrl: '' },
  ],
  correctKeys: [],
  trueFalseAnswer: true,
};

export default function NewQuizPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Lesson[] | { data: Lesson[] }>('/lessons').then((res) => {
      setLessons(Array.isArray(res) ? res : res.data || []);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (form: QuizFormData) => {
    setSaving(true);
    setError('');
    try {
      await apiFetch('/quizzes', { method: 'POST', body: JSON.stringify(formToPayload(form)) });
      router.push('/admin/quizzes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi tạo câu hỏi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <QuizForm
      title="Thêm câu hỏi mới"
      lessons={lessons}
      initial={DEFAULT_FORM}
      saving={saving}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
