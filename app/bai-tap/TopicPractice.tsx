'use client';

import { useState } from 'react';
import type { Difficulty, PracticeQuiz } from '../lib/topicSeo';
import { DIFFICULTIES } from '../lib/topicSeo';
import { playCorrect, playWrong, confetti } from '../lib/celebrate';

// Bộ luyện tập của một chủ đề: 3 mức độ, mỗi mức 10 câu.
//
// Cả 3 mức được render THẲNG vào DOM (không dùng tab ẩn nội dung) vì đây là trang
// SEO — toàn bộ câu hỏi phải nằm trong HTML để Google đọc được. Đây là client
// component nhưng vẫn được SSR, nên HTML đầu tiên đã có đủ nội dung.
//
// Dữ liệu vào đã được chuẩn hoá ở topicSeo.normalizeQuiz: options luôn {key,text}
// và `answers` luôn là danh sách key → component không phải đoán hình dạng nào.

const STYLE: Record<Difficulty, { ring: string; chip: string; dot: string }> = {
  easy: { ring: 'border-emerald-200', chip: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  medium: { ring: 'border-orange-200', chip: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  hard: { ring: 'border-violet-200', chip: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
};

function QuestionCard({ quiz, index, level }: { quiz: PracticeQuiz; index: number; level: Difficulty }) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const isRight = answered && quiz.answers.includes(picked);
  const answerText = quiz.answers
    .map((k) => quiz.options.find((o) => o.key === k)?.text ?? k)
    .join(', ');

  return (
    <li className={`rounded-2xl border-2 ${STYLE[level].ring} bg-white p-4 shadow-sm`}>
      <div className="flex gap-3">
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${STYLE[level].dot} text-sm font-bold text-white`}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-800">{quiz.questionText}</p>

          {quiz.questionImageUrl && (
            // Ảnh câu hỏi nằm trên S3 với kích thước không biết trước → dùng <img>
            // thay vì next/image để khỏi phải khai báo domain và size cho từng ảnh.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={quiz.questionImageUrl}
              alt={`Hình minh hoạ câu ${index + 1}: ${quiz.questionText}`}
              loading="lazy"
              className="mt-3 max-h-56 w-auto rounded-xl border border-slate-200"
            />
          )}

          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {quiz.options.map((opt) => {
              const isAnswer = quiz.answers.includes(opt.key);
              const isPicked = picked === opt.key;
              // Sau khi trả lời: tô xanh đáp án đúng, tô đỏ lựa chọn sai của bé.
              // Phải đặt màu chữ tường minh: body của site dùng chữ sáng trên nền
              // teal, thẻ đáp án nền trắng mà không khai màu thì chữ gần như vô hình.
              const tone = !answered
                ? 'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50'
                : isAnswer
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : isPicked
                    ? 'border-rose-400 bg-rose-50 text-rose-900'
                    : 'border-slate-200 bg-white text-slate-800 opacity-60';
              return (
                <li key={opt.key}>
                  <button
                    type="button"
                    onClick={() => {
                      if (answered) return;
                      setPicked(opt.key);
                      if (quiz.answers.includes(opt.key)) { playCorrect(); confetti('small'); }
                      else playWrong();
                    }}
                    aria-pressed={isPicked}
                    className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm font-medium transition ${tone}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {opt.key}
                    </span>
                    <span className="min-w-0 break-words">{opt.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {answered && (
            <p className={`mt-3 rounded-xl px-3 py-2 text-sm font-medium ${isRight ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
              {isRight ? '🎉 Chính xác!' : `Chưa đúng rồi. Đáp án là ${answerText}.`}
              {quiz.explanation ? ` ${quiz.explanation}` : ''}
            </p>
          )}

          {/* Đáp án luôn có trong HTML (kể cả khi bé chưa bấm) để phụ huynh dò nhanh
              và để Google thấy trang có lời giải, không phải trang mỏng. */}
          {!answered && (
            <details className="mt-3 text-sm text-slate-600">
              <summary className="cursor-pointer font-medium text-sky-700">Xem đáp án</summary>
              <p className="mt-1">
                Đáp án: <strong>{answerText}</strong>
                {quiz.explanation ? ` — ${quiz.explanation}` : ''}
              </p>
            </details>
          )}
        </div>
      </div>
    </li>
  );
}

export default function TopicPractice({ quizzes }: { quizzes: Record<Difficulty, PracticeQuiz[]> }) {
  return (
    <div className="space-y-10">
      {DIFFICULTIES.map(({ key, label, blurb }) => {
        const list = quizzes[key];
        if (!list?.length) return null;
        return (
          <section key={key} id={`muc-${key}`} className="scroll-mt-24">
            <h2 className="flex flex-wrap items-center gap-3 text-xl font-black text-slate-900 kid-display">
              <span className={`rounded-full px-3 py-1 text-sm font-black ${STYLE[key].chip}`}>Mức {label}</span>
              <span>
                {list.length} câu {blurb.toLowerCase()}
              </span>
            </h2>
            <ol className="mt-4 space-y-3">
              {list.map((q, i) => (
                <QuestionCard key={q.id} quiz={q} index={i} level={key} />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
