'use client';

import Link from 'next/link';

export default function PrintBar({
  lessonSlug,
  answerHref,
  isAnswer,
}: {
  lessonSlug: string;
  answerHref: string;
  isAnswer: boolean;
}) {
  return (
    <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <Link
        href={`/${lessonSlug}`}
        className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
      >
        ← Quay lại bài học
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href={answerHref}
          className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          {isAnswer ? '👦 Xem bản của bé' : '👪 Bản đáp án cho ba mẹ'}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700"
        >
          🖨 In / Tải PDF
        </button>
      </div>
    </div>
  );
}
