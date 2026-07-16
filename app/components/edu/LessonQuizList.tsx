'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import { lessonStatus, getCurrentChildId } from '../../lib/childData';
import { buildExerciseUrl, DIFF_TO_SLUG } from '../../lib/quiz-slug';

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

// Mỗi mức độ = một "Chặng" trong bài học (không gọi là "Bài" để phụ huynh khỏi nhầm là bài khác)
// Thời gian ước tính = số câu × 1 phút (khớp đồng hồ đếm ngược trong lúc làm bài)
const STAGE = {
  easy:   { order: 1, title: 'LÀM QUEN', emoji: '🌱', desc: 'Nhận biết', color: '#6BCB77', bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
  medium: { order: 2, title: 'LUYỆN TẬP', emoji: '🌿', desc: 'Hiểu và thực hành', color: '#FF9F45', bg: 'linear-gradient(135deg,#fff4d6,#ffe2b3)' },
  hard:   { order: 3, title: 'THỬ THÁCH', emoji: '🌳', desc: 'Vận dụng', color: '#A06CD5', bg: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)' },
} as const;

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

  // Trạng thái/điểm từng chặng của bé đang chọn. Khách đọc từ localStorage.
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

  // Sắp xếp: Làm quen → Luyện tập → Thử thách; trong cùng mức thì theo số bài tập.
  // Một bài có thể có nhiều chặng cùng mức (vd 8 chặng) nên số chặng phải đánh theo thứ tự thật.
  const stages = [...data.exercises].sort(
    (a, b) =>
      (STAGE[a.difficultyLevel]?.order ?? 99) - (STAGE[b.difficultyLevel]?.order ?? 99) ||
      a.exerciseNumber - b.exerciseNumber,
  );

  const doneCount = stages.filter((ex) => statusMap[ex.exerciseNumber]?.completed).length;
  // Tổng số câu bé làm sai trong cả bài → để mời in phiếu ôn riêng
  const wrongTotal = stages.reduce((s, ex) => {
    const st = statusMap[ex.exerciseNumber];
    return s + (st ? st.totalQuestions - st.correctCount : 0);
  }, 0);

  return (
    <div className="bg-white rounded-3xl border-4 border-pink-200 p-4 sm:p-5" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.18)' }}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-black text-gray-800 kid-display">🎯 Các chặng học</h2>
        <span className="text-sm font-black text-gray-700 shrink-0">
          Đã hoàn thành {doneCount}/{stages.length} chặng
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((ex, idx) => {
          const stage = STAGE[ex.difficultyLevel];
          const chang = idx + 1; // số chặng theo thứ tự thật, không theo mức độ
          const color = stage.color;
          const st = statusMap[ex.exerciseNumber];
          const href = lessonSlug
            ? buildExerciseUrl(lessonSlug, lessonId, ex.difficultyLevel, ex.exerciseNumber)
            : `/lessons/${lessonId}/play/${ex.exerciseNumber}`;

          const done = !!st;
          const hasWrong = st ? st.correctCount < st.totalQuestions : false;

          return (
            <div
              key={ex.exerciseNumber}
              className="rounded-3xl overflow-hidden"
              style={{ background: stage.bg, border: `3px solid ${color}`, boxShadow: `0 4px 0 ${color}aa` }}
            >
              <div className="flex items-center gap-3 px-4 pt-4">
                <div className="shrink-0 text-4xl">{stage.emoji}</div>

                {/* Badge Chặng N */}
                <div
                  className="shrink-0 flex items-center justify-center text-white text-sm font-black whitespace-nowrap kid-display"
                  style={{
                    background: color,
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)',
                    padding: '6px 20px 6px 12px',
                    minWidth: '96px',
                  }}
                >
                  Chặng {chang}
                </div>

                {/* Nội dung giữa */}
                <div className="flex-1 min-w-0">
                  <div className="text-base font-black truncate kid-display" style={{ color }}>
                    {stage.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {done ? (
                      <>Đúng <b>{st!.correctCount}/{st!.totalQuestions}</b> câu • Đạt {st!.stars} sao</>
                    ) : (
                      <>{stage.desc} • {ex.quizCount} câu • Khoảng {ex.quizCount} phút</>
                    )}
                  </div>
                </div>

                {/* Sao khi đã hoàn thành */}
                {done && (
                  <span className="shrink-0 text-lg tracking-tight" title={`Đạt ${st!.stars} sao`}>
                    {'⭐'.repeat(st!.stars) || '✓'}
                  </span>
                )}
              </div>

              {/* Hàng nút hành động */}
              <div className="px-4 pb-4 pt-3">
                {done ? (
                  <div className="flex gap-2">
                    {hasWrong && (
                      <Link
                        href={`${href}${href.includes('?') ? '&' : '?'}review=wrong`}
                        className="flex-1 text-center text-sm font-black px-3 py-2 rounded-2xl active:scale-95 transition"
                        style={{ background: 'white', color, border: `2px solid ${color}` }}
                      >
                        Ôn câu sai ({st!.totalQuestions - st!.correctCount})
                      </Link>
                    )}
                    <Link
                      href={href}
                      className="flex-1 text-center text-sm font-black px-3 py-2 rounded-2xl text-white active:scale-95 transition"
                      style={{ background: color }}
                    >
                      Làm lại
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={href}
                    className="block text-center text-sm font-black px-3 py-2.5 rounded-2xl text-white active:scale-95 transition"
                    style={{ background: color }}
                  >
                    Bắt đầu
                  </Link>
                )}

                {/* Phiếu in ra giấy tương ứng chặng này */}
                {lessonSlug && (
                  <Link
                    href={`/phieu-bai-tap/${lessonSlug}/${DIFF_TO_SLUG[ex.difficultyLevel]}?ex=${ex.exerciseNumber}`}
                    className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-800"
                  >
                    🖨 Tải phiếu chặng {chang} — {stage.title.toLowerCase()} (PDF)
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phiếu ôn riêng: gom mọi câu bé làm sai trong bài */}
      {lessonSlug && wrongTotal > 0 && (
        <Link
          href={`/phieu-bai-tap/on-cau-sai/${lessonSlug}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-rose-300 bg-rose-50 px-3 py-2.5 text-sm font-black text-rose-600 active:scale-95 transition"
        >
          🖨 Tạo phiếu ôn riêng cho bé ({wrongTotal} câu sai)
        </Link>
      )}
    </div>
  );
}
