'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type QuizQuestion = {
  id: string;
  question: string;
  question_speech?: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  explanation_speech?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

const DIFF_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  easy: { label: 'Dễ', bg: '#DCFCE7', color: '#15803d' },
  medium: { label: 'Trung bình', bg: '#FEF3C7', color: '#b45309' },
  hard: { label: 'Khó', bg: '#FEE2E2', color: '#b91c1c' },
};

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

// Cắt văn bản thành các đoạn ≤180 ký tự (Google Translate TTS giới hạn ~200).
function toChunks(parts: string[]): string[] {
  const out: string[] = [];
  for (const raw of parts) {
    let s = (raw || '').trim();
    if (!s) continue;
    while (s.length > 180) {
      let cut = s.lastIndexOf(' ', 180);
      if (cut < 80) cut = 180;
      out.push(s.slice(0, cut).trim());
      s = s.slice(cut).trim();
    }
    if (s) out.push(s);
  }
  return out;
}

// Nút loa đọc bằng GIỌNG GOOGLE (proxy /api/tts → Google Translate TTS).
function SpeakButton({ parts, label = 'Nghe' }: { parts: string[]; label?: string }) {
  const [active, setActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(false);

  useEffect(() => () => { stopRef.current = true; audioRef.current?.pause(); }, []);

  const stop = () => { stopRef.current = true; audioRef.current?.pause(); audioRef.current = null; setActive(false); };

  const play = async () => {
    if (active) { stop(); return; }
    const chunks = toChunks(parts);
    if (!chunks.length) return;
    stopRef.current = false;
    setActive(true);
    for (const c of chunks) {
      if (stopRef.current) break;
      await new Promise<void>((resolve) => {
        const a = new Audio(`/api/tts?tl=vi&q=${encodeURIComponent(c)}`);
        audioRef.current = a;
        a.onended = () => resolve();
        a.onerror = () => resolve();
        a.play().catch(() => resolve());
      });
    }
    if (!stopRef.current) setActive(false);
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={active ? 'Dừng đọc' : label}
      title={active ? 'Dừng' : label}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-2.5 py-1 text-xs font-black transition"
      style={active ? { borderColor: '#0d7a74', background: '#CCFBF1', color: '#0d7a74' } : { borderColor: '#BAE6FD', color: '#0369a1' }}
    >
      <span aria-hidden>{active ? '⏸' : '🔊'}</span>
      <span className="hidden sm:inline">{active ? 'Dừng' : label}</span>
    </button>
  );
}

function Pager({ page, totalPages, onGo }: { page: number; totalPages: number; onGo: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const nums = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const list = [...nums].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const withGaps: (number | '…')[] = [];
  let prev = 0;
  for (const p of list) { if (p - prev > 1) withGaps.push('…'); withGaps.push(p); prev = p; }
  const btn = 'grid h-10 min-w-10 place-items-center rounded-2xl border-2 px-3 text-sm font-black kid-display transition';
  return (
    <nav aria-label="Phân trang" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={page <= 1} onClick={() => onGo(page - 1)} className={`${btn} ${page <= 1 ? 'opacity-40' : ''}`} style={{ borderColor: '#BAE6FD', color: '#0369a1' }}>←</button>
      {withGaps.map((p, i) =>
        p === '…' ? <span key={`g${i}`} className="px-1 text-slate-400">…</span>
        : p === page ? <span key={p} className={`${btn} text-white`} style={{ backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', borderColor: 'transparent' }} aria-current="page">{p}</span>
        : <button key={p} type="button" onClick={() => onGo(p)} className={btn} style={{ borderColor: '#BAE6FD', color: '#0369a1' }}>{p}</button>,
      )}
      <button type="button" disabled={page >= totalPages} onClick={() => onGo(page + 1)} className={`${btn} ${page >= totalPages ? 'opacity-40' : ''}`} style={{ borderColor: '#BAE6FD', color: '#0369a1' }}>→</button>
    </nav>
  );
}

// Chế độ LÀM BÀI tương tác: chọn số câu/trang, phân trang client-side (không đổi URL),
// bé chọn đáp án → chấm ngay + lời giải + điểm + nghe giọng Google.
export default function TuDuyQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [perPage, setPerPage] = useState(50);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  const total = questions.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * perPage;
  const pageQuestions = questions.slice(offset, offset + perPage);

  const answered = Object.keys(answers).length;
  const correct = useMemo(() => questions.reduce((n, q) => n + (answers[q.id] === q.correct_index ? 1 : 0), 0), [answers, questions]);
  const wrong = answered - correct;

  const choose = (id: string, i: number) => setAnswers((prev) => (prev[id] !== undefined ? prev : { ...prev, [id]: i }));
  const go = (p: number) => { setPage(p); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const changePerPage = (n: number) => { setPerPage(n); setPage(1); };

  return (
    <div>
      <div ref={topRef} />

      {/* Số câu mỗi trang */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">Số câu / trang:</span>
        {PER_PAGE_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => changePerPage(n)}
            className="rounded-full border-2 px-3.5 py-1.5 text-sm font-black kid-display transition"
            style={n === perPage ? { backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', color: '#fff', borderColor: 'transparent' } : { borderColor: '#BAE6FD', color: '#0369a1' }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Bảng điểm dính */}
      <div className="sticky top-2 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 bg-white/95 px-4 py-3 backdrop-blur" style={{ borderColor: '#BAE6FD', boxShadow: '0 4px 16px rgba(56,189,248,0.18)' }}>
        <span className="font-black text-slate-800 kid-display">Đã làm {answered}/{total}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">✓ Đúng {correct}</span>
        {wrong > 0 && <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-rose-600">✗ Sai {wrong}</span>}
        <span className="text-sm font-bold text-slate-500">Trang {safePage}/{totalPages}</span>
        {answered > 0 && (
          <button type="button" onClick={() => setAnswers({})} className="ml-auto rounded-full border-2 border-slate-200 px-4 py-1.5 text-sm font-black text-slate-600 transition hover:bg-slate-50 kid-display">↺ Làm lại</button>
        )}
      </div>

      <ol className="space-y-5">
        {pageQuestions.map((q, idx) => {
          const num = offset + idx + 1;
          const sel = answers[q.id];
          const done = sel !== undefined;
          const optLetters = q.options.map((op, i) => `Đáp án ${String.fromCharCode(65 + i)}: ${op}`);
          return (
            <li key={q.id} className="rounded-2xl border-2 p-4 sm:p-5" style={{ borderColor: '#BAE6FD', background: '#fff' }}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm text-white kid-display" style={{ background: '#0d7a74' }}>{num}</span>
                <p className="min-w-0 flex-1 font-bold text-slate-900">
                  {q.difficulty && DIFF_BADGE[q.difficulty] && (
                    <span className="mr-2 inline-block rounded-full px-2 py-0.5 text-xs font-black align-middle" style={{ background: DIFF_BADGE[q.difficulty].bg, color: DIFF_BADGE[q.difficulty].color }}>{DIFF_BADGE[q.difficulty].label}</span>
                  )}
                  <span className="whitespace-pre-line">{q.question}</span>
                </p>
                <SpeakButton parts={[`Câu ${num}.`, q.question_speech || q.question, 'Các đáp án.', ...optLetters]} label="Nghe" />
              </div>

              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((op, i) => {
                  const isCorrect = i === q.correct_index;
                  const isSel = i === sel;
                  let style: React.CSSProperties = { borderColor: '#e2e8f0', color: '#334155', background: '#fff' };
                  if (done) {
                    if (isCorrect) style = { borderColor: '#6BCB77', background: '#F0FDF4', color: '#15803d' };
                    else if (isSel) style = { borderColor: '#FF6B6B', background: '#FEE2E2', color: '#b91c1c' };
                    else style = { borderColor: '#e2e8f0', color: '#94a3b8', background: '#fff' };
                  }
                  return (
                    <li key={i}>
                      <button type="button" disabled={done} onClick={() => choose(q.id, i)} className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left font-semibold transition ${done ? '' : 'hover:-translate-y-0.5 hover:border-sky-300'}`} style={style}>
                        <span>{String.fromCharCode(65 + i)}.</span>
                        <span className="min-w-0">{op}</span>
                        {done && isCorrect && <span className="ml-auto" aria-hidden>✓</span>}
                        {done && isSel && !isCorrect && <span className="ml-auto" aria-hidden>✗</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {done && (
                <div className="mt-3 rounded-xl p-3 text-sm leading-7" style={sel === q.correct_index ? { background: '#F0FDF4', color: '#166534' } : { background: '#FFF7ED', color: '#9a3412' }}>
                  <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1">
                      <span className="font-black kid-display">{sel === q.correct_index ? '🎉 Đúng rồi! ' : '💡 Chưa đúng. '}</span>
                      {q.explanation ? <span className="whitespace-pre-line">{q.explanation}</span> : <span>Đáp án đúng là {String.fromCharCode(65 + q.correct_index)}. {q.options[q.correct_index]}.</span>}
                    </p>
                    <SpeakButton parts={[sel === q.correct_index ? 'Đúng rồi.' : 'Chưa đúng.', q.explanation_speech || q.explanation || `Đáp án đúng là ${q.options[q.correct_index]}.`]} label="Nghe giải" />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <Pager page={safePage} totalPages={totalPages} onGo={go} />
    </div>
  );
}
