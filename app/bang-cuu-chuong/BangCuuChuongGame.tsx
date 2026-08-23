'use client';

import { useEffect, useMemo, useState } from 'react';
import { speakText, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
const N_QUESTIONS = 10;

type Q = { a: number; b: number; answer: number; options: number[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function makeQuestion(table: number | 'all'): Q {
  const a = table === 'all' ? TABLES[Math.floor(Math.random() * TABLES.length)] : table;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a * b;
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const d = answer + (Math.floor(Math.random() * 11) - 5);
    if (d > 0 && d !== answer) opts.add(d);
  }
  return { a, b, answer, options: shuffle([...opts]) };
}

export default function BangCuuChuongGame() {
  const [table, setTable] = useState<number | 'all'>(2);
  const [mode, setMode] = useState<'hoc' | 'do'>('hoc');
  const [questions, setQuestions] = useState<Q[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => () => stopSpeaking(), []);

  const startQuiz = () => {
    unlockAudio();
    setQuestions(Array.from({ length: N_QUESTIONS }, () => makeQuestion(table)));
    setQi(0); setPicked(null); setScore(0); setMode('do');
  };

  const answer = (opt: number) => {
    if (picked !== null) return;
    unlockAudio();
    const q = questions[qi];
    setPicked(opt);
    if (opt === q.answer) { setScore((s) => s + 1); playCorrect(); confetti('small'); }
    else playWrong();
  };
  const nextQ = () => {
    if (qi + 1 >= questions.length) { if (score >= N_QUESTIONS * 0.5) { playWin(); confetti('big'); } setQi(qi + 1); return; }
    setQi(qi + 1); setPicked(null);
  };

  const rows = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);
  const done = mode === 'do' && questions.length > 0 && qi >= questions.length;
  const q = questions[qi];

  return (
    <div className="mt-6">
      {/* Chọn bảng + chế độ */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">Bảng nhân:</span>
        {TABLES.map((n) => (
          <button key={n} type="button" onClick={() => { setTable(n); setMode('hoc'); }} className={`h-9 w-9 rounded-full border-2 text-sm font-black transition ${table === n ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-pink-300'}`}>{n}</button>
        ))}
        <button type="button" onClick={() => { setTable('all'); setMode('hoc'); }} className={`rounded-full border-2 px-3 py-1.5 text-sm font-black transition ${table === 'all' ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'border-slate-200 bg-white text-slate-700'}`}>Ngẫu nhiên</button>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => { stopSpeaking(); setMode('hoc'); }} className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${mode === 'hoc' ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600'}`}>🎓 Học (bấm nghe)</button>
        <button type="button" onClick={startQuiz} className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${mode === 'do' ? 'border-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600'}`}>🎮 Đố nhân</button>
      </div>

      {/* HỌC */}
      {mode === 'hoc' && (
        <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm">
          {table === 'all' ? (
            <p className="text-center text-slate-600">Chọn một bảng nhân (2–9) để học, hoặc bấm <b>🎮 Đố nhân</b> để luyện ngẫu nhiên.</p>
          ) : (
            <>
              <h3 className="mb-3 text-center text-lg font-black text-emerald-700 kid-display">Bảng nhân {table} — bấm để nghe đọc</h3>
              <ul className="mx-auto grid max-w-md grid-cols-2 gap-2">
                {rows.map((r) => (
                  <li key={r}>
                    <button type="button" onClick={() => { unlockAudio(); speakText(`${table} nhân ${r} bằng ${(table as number) * r}`); }} className="flex w-full items-center justify-between rounded-2xl border-2 border-emerald-100 bg-emerald-50/60 px-4 py-2 text-base font-black text-slate-800 transition hover:bg-emerald-50">
                      <span>{table} × {r} = <span className="text-emerald-600">{(table as number) * r}</span></span>
                      <span className="text-emerald-400" aria-hidden>🔊</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ĐỐ */}
      {mode === 'do' && (
        <div className="mt-4 rounded-3xl border-2 border-sky-100 bg-white p-6 shadow-sm">
          {done ? (
            <div className="py-6 text-center">
              <p className="text-2xl font-black text-emerald-600 kid-display">Hoàn thành! Đúng {score}/{N_QUESTIONS} 🎉</p>
              <button type="button" onClick={startQuiz} className="mt-4 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-black text-white shadow">🔁 Chơi lại</button>
            </div>
          ) : q ? (
            <>
              <div className="flex items-center justify-between text-sm font-black text-slate-500">
                <span>Câu {qi + 1}/{N_QUESTIONS}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Đúng {score}</span>
              </div>
              <p className="mt-3 text-center text-4xl font-black text-slate-800 sm:text-5xl">{q.a} × {q.b} = ?</p>
              <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-3">
                {q.options.map((op) => {
                  const isCorrect = op === q.answer;
                  const isPicked = op === picked;
                  let cls = 'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50';
                  if (picked !== null) {
                    if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-700';
                    else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-700';
                    else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
                  }
                  return (
                    <button key={op} type="button" disabled={picked !== null} onClick={() => answer(op)} className={`rounded-2xl border-2 py-4 text-2xl font-black transition active:scale-95 ${cls}`}>
                      {op}{picked !== null && isCorrect && ' ✓'}{picked !== null && isPicked && !isCorrect && ' ✗'}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <div className="mt-4 text-center">
                  <button type="button" onClick={nextQ} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2 text-sm font-black text-white shadow">{qi + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp →'}</button>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
