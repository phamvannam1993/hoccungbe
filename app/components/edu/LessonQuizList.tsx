'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { lessonStatus, getCurrentChildId } from '../../lib/childData';
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

type ExerciseStatus = {
  exerciseNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  stars: number;
  completed: boolean;
};

const DIFF_COLOR = { easy: '#6BCB77', medium: '#FF9F45', hard: '#A06CD5' };
const DIFF_BG   = { easy: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', medium: 'linear-gradient(135deg,#fff4d6,#ffe2b3)', hard: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' };
const DIFF_LABEL = { easy: 'Dễ', medium: 'Trung bình', hard: 'Nâng cao' };
const DIFF_EMOJI: Record<string, string> = { easy: '🌱', medium: '🌿', hard: '🌳' };

// Auto-generate meaningful exercise labels
const EXERCISE_TEMPLATES = {
  easy: [
    'Luyện tập cơ bản',
    'Nhận biết & xác định',
    'Chọn đáp án đúng',
    'Sắp xếp & phân loại',
    'Hoàn thành mẫu',
    'Quan sát & trả lời',
  ],
  medium: [
    'Tính toán & áp dụng',
    'Giải quyết vấn đề',
    'Kết hợp kiến thức',
    'Phân tích & so sánh',
    'Vận dụng linh hoạt',
    'Tìm quy luật',
  ],
  hard: [
    'Thách thức & sáng tạo',
    'Tư duy nâng cao',
    'Giải pháp phức hợp',
    'Suy luận logic',
    'Ứng dụng toàn diện',
    'Đột phá tư duy',
  ],
};

function generateExerciseLabel(exerciseNumber: number, difficultyLevel: 'easy' | 'medium' | 'hard'): string {
  const templates = EXERCISE_TEMPLATES[difficultyLevel];
  const index = (exerciseNumber - 1) % templates.length;
  return templates[index];
}

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
  const [statusMap, setStatusMap] = useState<Record<number, ExerciseStatus>>({});

  useEffect(() => {
    apiFetch<ExercisesData>(`/quizzes/exercises/${lessonId}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Trạng thái/điểm từng bài tập của bé đang chọn (để hiện % đã làm). Khách đọc từ localStorage.
  useEffect(() => {
    const childId = getCurrentChildId();
    if (!childId) return;
    lessonStatus(childId, Number(lessonId))
      .then((rows) => {
        const map: Record<number, ExerciseStatus> = {};
        (Array.isArray(rows) ? rows : []).forEach((r) => { map[r.exerciseNumber] = r; });
        setStatusMap(map);
      })
      .catch(() => {});
  }, [lessonId]);

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  );

  if (!data || data.exercises.length === 0) return null;

  const doneCount = data.exercises.filter((ex) => statusMap[ex.exerciseNumber]).length;
  const overallPct = data.exercises.length
    ? Math.round((doneCount / data.exercises.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-3xl border-4 border-pink-200 p-4 sm:p-5" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.18)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-gray-800 kid-display">🎯 Danh sách bài tập</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">
            Bạn hoàn thành {doneCount}/{data.exercises.length} bài
          </span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `conic-gradient(#6BCB77 ${overallPct * 3.6}deg, #e5e7eb 0deg)`,
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <span className="text-[11px] font-black text-gray-700">{overallPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.exercises.map((ex) => {
          const color = DIFF_COLOR[ex.difficultyLevel];
          const bg = DIFF_BG[ex.difficultyLevel];
          const href = lessonSlug
            ? buildExerciseUrl(lessonSlug, lessonId, ex.difficultyLevel, ex.exerciseNumber)
            : `/lessons/${lessonId}/play/${ex.exerciseNumber}`;

          // Use manual label or auto-generate
          const displayLabel = ex.label && ex.label.trim()
            ? ex.label
            : generateExerciseLabel(ex.exerciseNumber, ex.difficultyLevel);

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
                title={displayLabel}
              >
                Bài {ex.exerciseNumber}
              </div>

              {/* Nội dung giữa */}
              <div className="flex-1 min-w-0">
                <div className="text-base font-black truncate kid-display" style={{ color }}>
                  {displayLabel}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {DIFF_LABEL[ex.difficultyLevel]} • {ex.quizCount} câu hỏi
                </div>
              </div>

              {/* Trạng thái / điểm */}
              {(() => {
                const st = statusMap[ex.exerciseNumber];
                if (!st) {
                  return (
                    <span
                      className="shrink-0 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{ background: 'white', color, border: `2px solid ${color}` }}
                    >
                      Chưa làm
                    </span>
                  );
                }
                const pct = Math.round(st.score);
                const passed = st.score >= 50;
                const badge = passed ? '#16a34a' : '#f59e0b';
                return (
                  <span
                    className="shrink-0 flex flex-col items-center gap-0.5 text-xs font-black px-3 py-1 rounded-2xl whitespace-nowrap"
                    style={{ background: 'white', color: badge, border: `2px solid ${badge}` }}
                    title={`Đúng ${st.correctCount}/${st.totalQuestions} câu`}
                  >
                    <span className="text-sm leading-none">{pct}%</span>
                    <span className="text-[10px] leading-none tracking-wide">
                      {'⭐'.repeat(st.stars) || 'Đã làm'}
                    </span>
                  </span>
                );
              })()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
