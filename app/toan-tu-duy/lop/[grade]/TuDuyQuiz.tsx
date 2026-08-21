'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { playCorrect, playWrong, playWin, confetti, isSoundEnabled, setSoundEnabled } from '../../../lib/celebrate';

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

type Diff = 'all' | 'easy' | 'medium' | 'hard';
type TestResult = { at: number; size: number; score: number; pct: number; diff: Diff };

const DIFF_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  easy: { label: 'Dễ', bg: '#DCFCE7', color: '#15803d' },
  medium: { label: 'Trung bình', bg: '#FEF3C7', color: '#b45309' },
  hard: { label: 'Khó', bg: '#FEE2E2', color: '#b91c1c' },
};
const PER_PAGE_OPTIONS = [10, 20, 50, 100];
const DIFF_TABS: { k: Diff; label: string }[] = [
  { k: 'all', label: 'Tất cả' }, { k: 'easy', label: 'Dễ' }, { k: 'medium', label: 'Trung bình' }, { k: 'hard', label: 'Khó' },
];
const TEST_SIZES = [10, 20, 30];
const SEC_PER_Q = 60; // thời gian mỗi câu khi làm bài kiểm tra
const fmtTime = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

// ── TTS giọng Google ─────────────────────────────────────────────────────────
function toChunks(parts: string[]): string[] {
  const out: string[] = [];
  for (const raw of parts) {
    let s = (raw || '').trim();
    if (!s) continue;
    while (s.length > 180) { let cut = s.lastIndexOf(' ', 180); if (cut < 80) cut = 180; out.push(s.slice(0, cut).trim()); s = s.slice(cut).trim(); }
    if (s) out.push(s);
  }
  return out;
}
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
    stopRef.current = false; setActive(true);
    for (const c of chunks) {
      if (stopRef.current) break;
      await new Promise<void>((resolve) => {
        const a = new Audio(`/api/tts?tl=vi&q=${encodeURIComponent(c)}`);
        audioRef.current = a; a.onended = () => resolve(); a.onerror = () => resolve(); a.play().catch(() => resolve());
      });
    }
    if (!stopRef.current) setActive(false);
  };
  return (
    <button type="button" onClick={play} aria-label={active ? 'Dừng đọc' : label} title={active ? 'Dừng' : label}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-2.5 py-1 text-xs font-black transition"
      style={active ? { borderColor: '#0d7a74', background: '#CCFBF1', color: '#0d7a74' } : { borderColor: '#BAE6FD', color: '#0369a1' }}>
      <span aria-hidden>{active ? '⏸' : '🔊'}</span><span className="hidden sm:inline">{active ? 'Dừng' : label}</span>
    </button>
  );
}

// ── Một câu hỏi (dùng chung Luyện tập & Kiểm tra) ────────────────────────────
function QuestionCard({ q, num, selected, revealed, onChoose }: {
  q: QuizQuestion; num: number; selected: number | undefined; revealed: boolean; onChoose: (i: number) => void;
}) {
  const optLetters = q.options.map((op, i) => `Đáp án ${String.fromCharCode(65 + i)}: ${op}`);
  return (
    <li className="rounded-2xl border-2 p-4 sm:p-5" style={{ borderColor: '#BAE6FD', background: '#fff' }}>
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
          const isCorrect = i === q.correct_index, isSel = i === selected;
          let style: React.CSSProperties = { borderColor: '#e2e8f0', color: '#334155', background: '#fff' };
          if (revealed) {
            if (isCorrect) style = { borderColor: '#6BCB77', background: '#F0FDF4', color: '#15803d' };
            else if (isSel) style = { borderColor: '#FF6B6B', background: '#FEE2E2', color: '#b91c1c' };
            else style = { borderColor: '#e2e8f0', color: '#94a3b8', background: '#fff' };
          } else if (isSel) { style = { borderColor: '#4ECDC4', background: '#ECFEFB', color: '#0d7a74' }; }
          return (
            <li key={i}>
              <button type="button" disabled={revealed} onClick={() => onChoose(i)}
                className={`flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left font-semibold transition ${revealed ? '' : 'hover:-translate-y-0.5 hover:border-sky-300'}`} style={style}>
                <span>{String.fromCharCode(65 + i)}.</span><span className="min-w-0">{op}</span>
                {revealed && isCorrect && <span className="ml-auto" aria-hidden>✓</span>}
                {revealed && isSel && !isCorrect && <span className="ml-auto" aria-hidden>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed && (
        <div className="mt-3 rounded-xl p-3 text-sm leading-7" style={selected === q.correct_index ? { background: '#F0FDF4', color: '#166534' } : { background: '#FFF7ED', color: '#9a3412' }}>
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1">
              <span className="font-black kid-display">{selected === q.correct_index ? '🎉 Đúng rồi! ' : '💡 Chưa đúng. '}</span>
              {q.explanation ? <span className="whitespace-pre-line">{q.explanation}</span> : <span>Đáp án đúng là {String.fromCharCode(65 + q.correct_index)}. {q.options[q.correct_index]}.</span>}
            </p>
            <SpeakButton parts={[selected === q.correct_index ? 'Đúng rồi.' : 'Chưa đúng.', q.explanation_speech || q.explanation || `Đáp án đúng là ${q.options[q.correct_index]}.`]} label="Nghe giải" />
          </div>
        </div>
      )}
    </li>
  );
}

const chip = (on: boolean) =>
  on ? { backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', color: '#fff', borderColor: 'transparent' } as React.CSSProperties
     : { borderColor: '#BAE6FD', color: '#0369a1' } as React.CSSProperties;

export default function TuDuyQuiz({ questions, grade }: { questions: QuizQuestion[]; grade: number }) {
  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);
  const toggleSound = () => { const v = !soundOn; setSoundOn(v); setSoundEnabled(v); if (v) playCorrect(); };
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [diff, setDiff] = useState<Diff>('all');
  const [wrongOnly, setWrongOnly] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [page, setPage] = useState(1);
  // Test mode (hẹn giờ: endsAt = mốc hết giờ; startedAt = id để ghi lịch sử một lần)
  const [test, setTest] = useState<{ ids: string[]; answers: Record<string, number>; submitted: boolean; endsAt: number; startedAt: number } | null>(null);
  const [nowTs, setNowTs] = useState(0);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [histLoaded, setHistLoaded] = useState(false);
  const recordedRef = useRef<Set<number>>(new Set());
  const topRef = useRef<HTMLDivElement | null>(null);
  const HKEY = `iq-history-l${grade}`;

  // Đồng hồ đếm ngược: chạy khi đang làm bài kiểm tra; hết giờ tự nộp.
  useEffect(() => {
    if (mode !== 'test' || !test || test.submitted) return;
    setNowTs(Date.now());
    const id = setInterval(() => {
      const n = Date.now();
      setNowTs(n);
      if (n >= test.endsAt) { clearInterval(id); setTest((t) => (t && !t.submitted ? { ...t, submitted: true } : t)); }
    }, 1000);
    return () => clearInterval(id);
  }, [mode, test]);

  // Nạp/lưu lịch sử điểm.
  useEffect(() => {
    try { const raw = localStorage.getItem(HKEY); if (raw) setHistory(JSON.parse(raw) || []); } catch { /* noop */ }
    setHistLoaded(true);
  }, [HKEY]);
  useEffect(() => { if (histLoaded) try { localStorage.setItem(HKEY, JSON.stringify(history)); } catch { /* noop */ } }, [history, histLoaded, HKEY]);

  // Ghi 1 lần khi bài kiểm tra được nộp (bấm hoặc hết giờ).
  useEffect(() => {
    if (!test || !test.submitted || recordedRef.current.has(test.startedAt)) return;
    recordedRef.current.add(test.startedAt);
    const list = test.ids.map((id) => byId.get(id)).filter(Boolean) as QuizQuestion[];
    const score = list.reduce((n, q) => n + (test.answers[q.id] === q.correct_index ? 1 : 0), 0);
    const rec: TestResult = { at: test.startedAt, size: list.length, score, pct: list.length ? Math.round((score / list.length) * 100) : 0, diff };
    setHistory((prev) => [rec, ...prev].slice(0, 30));
    if (rec.pct >= 50) { playWin(); confetti('big'); } else { playWrong(); }
  }, [test, byId, diff]);

  const KEY = `iq-progress-l${grade}`;
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setAnswers(JSON.parse(raw) || {}); } catch { /* noop */ }
    setLoaded(true);
  }, [KEY]);
  useEffect(() => { if (loaded) try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch { /* noop */ } }, [answers, loaded, KEY]);

  const wrongIds = useMemo(() => {
    const s = new Set<string>();
    for (const q of questions) if (answers[q.id] !== undefined && answers[q.id] !== q.correct_index) s.add(q.id);
    return s;
  }, [answers, questions]);

  const pool = useMemo(() => questions.filter((q) => diff === 'all' || q.difficulty === diff), [questions, diff]);
  const practiceList = useMemo(() => (wrongOnly ? pool.filter((q) => wrongIds.has(q.id)) : pool), [pool, wrongOnly, wrongIds]);

  const totalPages = Math.max(1, Math.ceil(practiceList.length / perPage));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * perPage;
  const pageItems = practiceList.slice(offset, offset + perPage);

  const answeredAll = Object.keys(answers).length;
  const correctAll = useMemo(() => questions.reduce((n, q) => n + (answers[q.id] === q.correct_index ? 1 : 0), 0), [answers, questions]);

  const setDiffReset = (d: Diff) => { setDiff(d); setPage(1); setWrongOnly(false); };
  const go = (p: number) => { setPage(p); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const choosePractice = (id: string, i: number) =>
    setAnswers((prev) => {
      if (prev[id] !== undefined) return prev;
      const q = byId.get(id);
      if (q) {
        if (i === q.correct_index) { playCorrect(); confetti('small'); }
        else playWrong();
      }
      return { ...prev, [id]: i };
    });

  const startTest = (size: number) => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(size, pool.length));
    const startedAt = Date.now();
    const endsAt = startedAt + shuffled.length * SEC_PER_Q * 1000; // 1 phút/câu
    setTest({ ids: shuffled.map((q) => q.id), answers: {}, submitted: false, endsAt, startedAt });
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const chooseTest = (id: string, i: number) => setTest((t) => (t && !t.submitted ? { ...t, answers: { ...t.answers, [id]: i } } : t));
  const submitTest = () => {
    setTest((t) => (t ? { ...t, submitted: true } : t));
    // Ghi kết quả test vào lịch sử để "ôn câu sai" nhớ cả bài kiểm tra.
    setTest((t) => { if (t) setAnswers((prev) => { const next = { ...prev }; for (const id of t.ids) if (t.answers[id] !== undefined && next[id] === undefined) next[id] = t.answers[id]; return next; }); return t; });
  };

  return (
    <div>
      <div ref={topRef} />

      {/* Chế độ */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">Chế độ:</span>
        <button type="button" onClick={() => setMode('practice')} className="rounded-full border-2 px-4 py-1.5 text-sm font-black kid-display" style={chip(mode === 'practice')}>📖 Luyện tập</button>
        <button type="button" onClick={() => { setMode('test'); setTest(null); }} className="rounded-full border-2 px-4 py-1.5 text-sm font-black kid-display" style={chip(mode === 'test')}>📝 Kiểm tra</button>
        <button type="button" onClick={toggleSound} aria-pressed={soundOn} title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} className="ml-auto rounded-full border-2 px-3 py-1.5 text-sm font-black kid-display" style={chip(soundOn)}>{soundOn ? '🔊 Âm thanh' : '🔇 Tắt tiếng'}</button>
      </div>

      {/* Lọc mức khó */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">Mức khó:</span>
        {DIFF_TABS.map((t) => (
          <button key={t.k} type="button" onClick={() => setDiffReset(t.k)} className="rounded-full border-2 px-3.5 py-1.5 text-sm font-black kid-display" style={chip(diff === t.k)}>{t.label}</button>
        ))}
      </div>

      {mode === 'practice' ? (
        <>
          {/* Ôn câu sai + số câu/trang */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {loaded && wrongIds.size > 0 && (
              <button type="button" onClick={() => { setWrongOnly((v) => !v); setPage(1); }} className="rounded-full border-2 px-3.5 py-1.5 text-sm font-black kid-display" style={wrongOnly ? { backgroundImage: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', color: '#fff', borderColor: 'transparent' } : { borderColor: '#FBCFE8', color: '#c81e5b' }}>🔁 Ôn câu sai ({wrongIds.size})</button>
            )}
            {answeredAll > 0 && (
              <button type="button" onClick={() => { if (confirm('Xóa toàn bộ tiến độ đã lưu?')) { setAnswers({}); setWrongOnly(false); } }} className="rounded-full border-2 border-slate-200 px-3.5 py-1.5 text-sm font-black text-slate-500 kid-display">🗑 Xóa tiến độ</button>
            )}
            <span className="ml-auto text-sm font-black text-slate-700 kid-display">Số câu/trang:</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button key={n} type="button" onClick={() => { setPerPage(n); setPage(1); }} className="rounded-full border-2 px-3 py-1.5 text-sm font-black kid-display" style={chip(n === perPage)}>{n}</button>
            ))}
          </div>

          {/* Bảng điểm */}
          <div className="sticky top-2 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 bg-white/95 px-4 py-3 backdrop-blur" style={{ borderColor: '#BAE6FD', boxShadow: '0 4px 16px rgba(56,189,248,0.18)' }}>
            <span className="font-black text-slate-800 kid-display">Đã làm {answeredAll}/{questions.length}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">✓ Đúng {correctAll}</span>
            {wrongIds.size > 0 && <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-rose-600">✗ Sai {wrongIds.size}</span>}
            <span className="text-sm font-bold text-slate-500">{practiceList.length} câu · Trang {safePage}/{totalPages}</span>
          </div>

          {practiceList.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center font-bold text-slate-500">Không có câu nào ở mục này. 🌟</p>
          ) : (
            <>
              <ol className="space-y-5">
                {pageItems.map((q, idx) => (
                  <QuestionCard key={q.id} q={q} num={offset + idx + 1} selected={answers[q.id]} revealed={answers[q.id] !== undefined} onChoose={(i) => choosePractice(q.id, i)} />
                ))}
              </ol>
              <Pager page={safePage} totalPages={totalPages} onGo={go} />
            </>
          )}
        </>
      ) : (
        // ── Chế độ KIỂM TRA ──
        !test ? (
          <>
            <div className="rounded-2xl border-2 bg-white p-6 text-center" style={{ borderColor: '#BAE6FD' }}>
              <p className="font-black text-slate-800 kid-display">Chọn số câu để làm bài kiểm tra ngẫu nhiên{diff !== 'all' ? ` (mức ${DIFF_TABS.find((t) => t.k === diff)?.label})` : ''}:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {TEST_SIZES.map((n) => (
                  <button key={n} type="button" onClick={() => startTest(n)} disabled={pool.length === 0} className="flex flex-col items-center rounded-2xl px-6 py-3 font-black text-white kid-display kid-btn-3d" style={{ backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', boxShadow: '0 6px 0 #0d7a74' }}>
                    <span>{n} câu</span>
                    <span className="text-xs font-bold opacity-90">⏱ {n} phút</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">Mỗi câu 1 phút. Bé làm hết rồi bấm “Nộp bài”; <strong>hết giờ sẽ tự nộp</strong>.</p>
            </div>

            {histLoaded && history.length > 0 && (
              <div className="mt-5 rounded-2xl border-2 bg-white p-5" style={{ borderColor: '#BAE6FD' }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-black kid-display text-slate-800">📊 Lịch sử kiểm tra ({history.length})</h3>
                  <button type="button" onClick={() => { if (confirm('Xóa lịch sử điểm kiểm tra?')) setHistory([]); }} className="rounded-full border-2 border-slate-200 px-3 py-1 text-xs font-black text-slate-500">🗑 Xóa</button>
                </div>
                <ul className="mt-3 space-y-2">
                  {history.slice(0, 15).map((h) => (
                    <li key={h.at} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-slate-100 px-3 py-2 text-sm">
                      <span className="text-slate-500">{new Date(h.at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="font-black text-slate-800">Đúng {h.score}/{h.size}</span>
                      <span className="rounded-full px-2 py-0.5 text-xs font-black" style={h.pct >= 80 ? { background: '#DCFCE7', color: '#15803d' } : h.pct >= 50 ? { background: '#FEF3C7', color: '#b45309' } : { background: '#FEE2E2', color: '#b91c1c' }}>{h.pct} điểm</span>
                      {h.diff !== 'all' && <span className="text-xs font-bold text-slate-400">{DIFF_TABS.find((t) => t.k === h.diff)?.label}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (() => {
          const list = test.ids.map((id) => byId.get(id)).filter(Boolean) as QuizQuestion[];
          const doneCount = Object.keys(test.answers).length;
          const score = list.reduce((n, q) => n + (test.answers[q.id] === q.correct_index ? 1 : 0), 0);
          const pct = list.length ? Math.round((score / list.length) * 100) : 0;
          const remaining = Math.max(0, Math.ceil((test.endsAt - (nowTs || Date.now())) / 1000));
          const low = remaining <= 60;
          return (
            <div>
              {test.submitted && (
                <div className="mb-4 rounded-2xl border-2 p-5 text-center" style={{ borderColor: '#6BCB77', background: '#F0FDF4' }}>
                  <p className="text-2xl font-black kid-display" style={{ color: '#15803d' }}>{pct >= 80 ? '🏆 Giỏi lắm!' : pct >= 50 ? '👍 Khá tốt!' : '💪 Cố lên nhé!'}</p>
                  <p className="mt-1 text-lg font-black text-slate-800">Đúng {score}/{list.length} câu — {pct} điểm</p>
                  <button type="button" onClick={() => setTest(null)} className="mt-4 rounded-full border-2 px-5 py-2 text-sm font-black kid-display" style={{ borderColor: '#6BCB77', color: '#15803d' }}>Làm bài khác</button>
                </div>
              )}
              {!test.submitted && (
                <div className="sticky top-2 z-10 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 bg-white/95 px-4 py-3 backdrop-blur" style={{ borderColor: low ? '#FECACA' : '#BAE6FD' }}>
                  <span className="font-black text-slate-800 kid-display">Đã làm {doneCount}/{list.length}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-black tabular-nums ${low ? 'animate-pulse' : ''}`} style={low ? { background: '#FEE2E2', color: '#b91c1c' } : { background: '#E0F2FE', color: '#0369a1' }}>
                    ⏱ {fmtTime(remaining)}
                  </span>
                  <button type="button" onClick={submitTest} disabled={doneCount === 0} className="ml-auto rounded-full px-5 py-2 text-sm font-black text-white kid-display disabled:opacity-50" style={{ backgroundImage: 'linear-gradient(135deg,#FF6B9D,#FF9F45)' }}>✅ Nộp bài</button>
                </div>
              )}
              <ol className="space-y-5">
                {list.map((q, idx) => (
                  <QuestionCard key={q.id} q={q} num={idx + 1} selected={test.answers[q.id]} revealed={test.submitted} onChoose={(i) => chooseTest(q.id, i)} />
                ))}
              </ol>
              {!test.submitted && (
                <div className="mt-5 text-center">
                  <button type="button" onClick={submitTest} disabled={doneCount === 0} className="rounded-2xl px-8 py-3 font-black text-white kid-display kid-btn-3d disabled:opacity-50" style={{ backgroundImage: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', boxShadow: '0 6px 0 #c81e5b' }}>✅ Nộp bài ({doneCount}/{list.length})</button>
                </div>
              )}
            </div>
          );
        })()
      )}
    </div>
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
      {withGaps.map((p, i) => p === '…' ? <span key={`g${i}`} className="px-1 text-slate-400">…</span>
        : p === page ? <span key={p} className={`${btn} text-white`} style={{ backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', borderColor: 'transparent' }} aria-current="page">{p}</span>
        : <button key={p} type="button" onClick={() => onGo(p)} className={btn} style={{ borderColor: '#BAE6FD', color: '#0369a1' }}>{p}</button>)}
      <button type="button" disabled={page >= totalPages} onClick={() => onGo(page + 1)} className={`${btn} ${page >= totalPages ? 'opacity-40' : ''}`} style={{ borderColor: '#BAE6FD', color: '#0369a1' }}>→</button>
    </nav>
  );
}
