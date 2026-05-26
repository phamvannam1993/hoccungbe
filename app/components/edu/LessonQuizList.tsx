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

const DIFF_COLOR = { easy: '#6BCB77', medium: '#FF9F45', hard: '#A06CD5' };
const DIFF_BG   = { easy: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', medium: 'linear-gradient(135deg,#fff4d6,#ffe2b3)', hard: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' };
const DIFF_LABEL = { easy: 'Dễ', medium: 'Trung bình', hard: 'Nâng cao' };
const DIFF_EMOJI: Record<string, string> = { easy: '🌱', medium: '🌿', hard: '🌳' };

function StarBubbles({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-full"
          style={{ background: `${color}30`, border: `2px solid ${color}50` }}
        />
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
    <div className="bg-white rounded-3xl border-4 border-pink-200 p-4 sm:p-5" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.18)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 kid-display">🎯 Danh sách bài tập</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">Bạn hoàn thành</span>
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-700">0%</span>
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
              className="flex items-center gap-3 px-4 py-4 rounded-3xl active:scale-[0.98] transition-all kid-card-hover"
              style={{ background: bg, border: `3px solid ${color}`, boxShadow: `0 4px 0 ${color}aa` }}
            >
              <div className="shrink-0 text-4xl">{DIFF_EMOJI[ex.difficultyLevel]}</div>

              {/* Badge mũi tên */}
              <div
                className="shrink-0 flex items-center justify-center text-white text-sm font-black whitespace-nowrap kid-display"
                style={{
                  background: color,
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
                  padding: '6px 20px 6px 12px',
                  minWidth: '90px',
                }}
              >
                Bài {ex.exerciseNumber}
              </div>

              {/* Nội dung giữa */}
              <div className="flex-1 min-w-0">
                <div className="text-base font-black truncate kid-display" style={{ color }}>
                  {DIFF_LABEL[ex.difficultyLevel]}
                </div>
                <div className="mt-1">
                  <StarBubbles count={ex.stars} color={color} />
                </div>
              </div>

              {/* Trạng thái */}
              <span
                className="shrink-0 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ background: 'white', color, border: `2px solid ${color}` }}
              >
                Chưa làm
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
