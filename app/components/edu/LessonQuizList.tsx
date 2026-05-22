'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { buildExerciseUrl } from '../../lib/quiz-slug';

type Exercise = {
  exerciseNumber: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  label: string;
  stars: number;
  quizCount: number;
};

type ExercisesData = {
  total: number;
  exercises: Exercise[];
};

const DIFF_COLOR = { easy: '#1FA8B4', medium: '#D85C4A', hard: '#C4892A' };
const DIFF_BG = { easy: '#f0fafb', medium: '#fdf2f0', hard: '#fdf8f0' };

function StarBubbles({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-6 h-6 rounded-full bg-gray-200" />
      ))}
    </div>
  );
}

export default function LessonQuizList({
  lessonId,
  lessonSlug,
}: {
  lessonId: string | number;
  lessonSlug?: string;
}) {
  const [data, setData] = useState<ExercisesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ExercisesData>(`/quizzes/exercises/${lessonId}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  );

  if (!data || data.exercises.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Danh sách bài tập</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Bạn hoàn thành</span>
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">0%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.exercises.map((ex) => {
          const color = DIFF_COLOR[ex.difficultyLevel];
          const bg = DIFF_BG[ex.difficultyLevel];
          const href = lessonSlug
            ? buildExerciseUrl(lessonSlug, lessonId, ex.difficultyLevel, ex.exerciseNumber)
            : `/lessons/${lessonId}/play/${ex.exerciseNumber}`;

          return (
            <Link
              key={ex.exerciseNumber}
              href={href}
              className="flex items-center gap-4 px-3 py-3 rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: bg }}
            >
              <div
                className="shrink-0 flex items-center justify-center text-white text-sm font-bold py-2"
                style={{
                  background: color,
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
                  minWidth: '110px',
                  paddingLeft: '16px',
                  paddingRight: '20px',
                }}
              >
                Bài tập {ex.exerciseNumber}
              </div>
              <span className="flex-1 text-sm font-medium" style={{ color }}>
                {ex.label}
              </span>
              <StarBubbles count={ex.stars} />
              <span className="text-sm shrink-0 text-gray-400">Chưa làm</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
