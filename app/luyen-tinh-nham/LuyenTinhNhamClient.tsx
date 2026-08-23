'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';

type Op = '+' | '−' | '×' | '÷';
type Problem = { a: number; b: number; op: Op; answer: number };

type Level = { key: string; label: string; gen: () => Problem };

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function addSub(max: number): Problem {
  const op: Op = pick(['+', '−']);
  if (op === '+') {
    const a = rnd(0, max);
    const b = rnd(0, max - a);
    return { a, b, op, answer: a + b };
  }
  const a = rnd(0, max);
  const b = rnd(0, a);
  return { a, b, op, answer: a - b };
}
function mul(): Problem {
  const a = rnd(2, 9), b = rnd(2, 9);
  return { a, b, op: '×', answer: a * b };
}
function div(): Problem {
  const b = rnd(2, 9), q = rnd(1, 9);
  return { a: b * q, b, op: '÷', answer: q };
}

// Giải thích cách tính từng bước cho bé (mẹo làm tròn chục / bảng nhân).
function explain(p: Problem): string {
  const { a, b, op, answer } = p;
  if (op === '+') {
    const need = 10 - (a % 10);
    if (a % 10 !== 0 && b > need && a >= 10) {
      return `${a} + ${need} = ${a + need} (cho tròn chục), còn ${b - need} nữa → ${a + need} + ${b - need} = ${answer}.`;
    }
    return `${a} cộng thêm ${b} bằng ${answer}. Mẹo: đếm thêm từng đơn vị từ ${a}.`;
  }
  if (op === '−') {
    const down = a % 10;
    if (down > 0 && b > down && a >= 10) {
      return `${a} − ${down} = ${a - down} (về tròn chục), rồi bớt ${b - down} nữa → ${answer}.`;
    }
    return `${a} bớt đi ${b} còn ${answer}. Mẹo: đếm lùi từ ${a}.`;
  }
  if (op === '×') {
    if (a === 9 || b === 9) { const m = a === 9 ? b : a; return `${a} × ${b} = ${answer}. Mẹo nhân 9: 9 × ${m} = 10 × ${m} − ${m} = ${10 * m} − ${m} = ${answer}.`; }
    if (a === 5 || b === 5) { const m = a === 5 ? b : a; return `${a} × ${b} = ${answer}. Mẹo nhân 5: bằng một nửa của 10 × ${m} = ${10 * m} ÷ 2 = ${answer}.`; }
    return `${a} × ${b} = ${answer} (đọc theo bảng nhân ${a}).`;
  }
  // ÷
  return `${a} ÷ ${b} = ${answer} vì ${b} × ${answer} = ${a}.`;
}

const LEVELS: Level[] = [
  { key: 'ct10', label: 'Cộng trừ trong 10', gen: () => addSub(10) },
  { key: 'ct20', label: 'Cộng trừ trong 20', gen: () => addSub(20) },
  { key: 'ct100', label: 'Cộng trừ trong 100', gen: () => addSub(100) },
  { key: 'nhan', label: 'Bảng nhân (×)', gen: mul },
  { key: 'chia', label: 'Bảng chia (÷)', gen: div },
  { key: 'mix', label: 'Hỗn hợp', gen: () => pick([() => addSub(100), mul, div])() },
];

const DURATION = 60;

export default function LuyenTinhNhamClient() {
  const [li, setLi] = useState(0);
  const [mode, setMode] = useState<'practice' | 'race'>('practice');
  const [prob, setProb] = useState<Problem | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'right' | 'wrong'>('none');
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  // race
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const level = LEVELS[li];
  const bestKey = `ltn-best-${level.key}`;

  const next = useCallback(() => { setProb(level.gen()); setInput(''); setFeedback('none'); }, [level]);

  // Sinh câu đầu tiên sau khi mount (tránh hydration mismatch do Math.random).
  useEffect(() => { setProb(level.gen()); setInput(''); setFeedback('none'); }, [level]);
  useEffect(() => { try { setBest(Number(localStorage.getItem(bestKey) || 0)); } catch { setBest(0); } }, [bestKey]);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const stopRace = useCallback((finalCorrect: number) => {
    setRunning(false);
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setBest((b) => {
      if (finalCorrect > b) { try { localStorage.setItem(bestKey, String(finalCorrect)); } catch { /* noop */ } return finalCorrect; }
      return b;
    });
    if (finalCorrect > 0) { playWin(); confetti('big'); }
  }, [bestKey]);

  const startRace = () => {
    setMode('race'); setCorrect(0); setTotal(0); setStreak(0); setTimeLeft(DURATION); setRunning(true); next();
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setCorrect((c) => { stopRace(c); return c; }); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const submit = () => {
    if (!prob || input === '' || feedback !== 'none') return;
    if (mode === 'race' && !running) return;
    const ok = Number(input) === prob.answer;
    setTotal((t) => t + 1);
    if (ok) {
      setCorrect((c) => c + 1); setStreak((s) => s + 1); playCorrect();
      if (mode === 'race') { next(); } // Tính nhanh: chuyển câu ngay để thi tốc độ.
      else { setFeedback('right'); confetti('small'); } // Luyện tập: dừng lại để bé đọc giải thích, tự bấm "Câu tiếp".
    } else {
      setStreak(0); playWrong(); setFeedback('wrong');
      if (mode === 'race') setTimeout(next, 500);
    }
  };

  const press = (d: string) => {
    if (feedback !== 'none' && mode === 'practice') return;
    if (mode === 'race' && !running) return;
    if (d === 'del') setInput((s) => s.slice(0, -1));
    else if (d === 'ok') submit();
    else setInput((s) => (s.length < 6 ? s + d : s));
  };

  const acc = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mt-6">
      {/* Chế độ + mức */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">Chế độ:</span>
        <button type="button" onClick={() => { setMode('practice'); setRunning(false); if (timer.current) clearInterval(timer.current); }} className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${mode === 'practice' ? 'border-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600'}`}>📖 Luyện tập</button>
        <button type="button" onClick={startRace} className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${mode === 'race' ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'border-slate-200 bg-white text-slate-600'}`}>⏱️ Tính nhanh 60s</button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {LEVELS.map((l, i) => (
          <button key={l.key} type="button" onClick={() => { setLi(i); if (mode === 'race') { setRunning(false); if (timer.current) clearInterval(timer.current); setMode('practice'); } }} className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-black transition ${i === li ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}>{l.label}</button>
        ))}
      </div>

      {/* Thanh trạng thái */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
        <span className="text-sm font-black text-slate-700">✅ Đúng: {correct}/{total} ({acc}%) · 🔥 Chuỗi: {streak}</span>
        {mode === 'race'
          ? <span className={`rounded-full px-3 py-1 text-sm font-black ${timeLeft <= 10 ? 'bg-rose-100 text-rose-700' : 'bg-pink-100 text-pink-700'}`}>⏱️ {timeLeft}s · 🏆 Kỷ lục {best}</span>
          : <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">🏆 Kỷ lục 60s: {best}</span>}
      </div>

      {/* Bảng phép tính */}
      <div className="mt-4 rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm">
        {mode === 'race' && !running ? (
          <div className="py-8 text-center">
            <p className="text-lg font-black text-slate-700 kid-display">Trả lời đúng càng nhiều càng tốt trong 60 giây!</p>
            {total > 0 && <p className="mt-2 text-2xl font-black text-emerald-600">Kết quả: đúng {correct} câu 🎉</p>}
            <button type="button" onClick={startRace} className="mt-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-2.5 text-sm font-black text-white shadow">▶️ Bắt đầu</button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-4xl font-black tracking-wider text-slate-800 sm:text-5xl">
                {prob ? `${prob.a} ${prob.op} ${prob.b} = ` : '…'}
                <span className={`ml-1 inline-block min-w-[1.5em] rounded-xl px-2 ${feedback === 'right' ? 'bg-emerald-100 text-emerald-700' : feedback === 'wrong' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-sky-600'}`}>{input || '?'}</span>
              </span>
            </div>
            {mode === 'practice' && feedback !== 'none' && prob && (
              <div className={`mx-auto mt-3 max-w-md rounded-2xl px-4 py-2.5 text-sm leading-6 ${feedback === 'right' ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
                <span className="font-black kid-display">{feedback === 'right' ? '🎉 Đúng rồi! ' : `💡 Đáp án đúng: ${prob.answer}. `}</span>
                {explain(prob)}
              </div>
            )}

            {/* Bàn phím số */}
            <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button key={d} type="button" onClick={() => press(d)} className="rounded-2xl border-2 border-slate-200 bg-white py-3 text-xl font-black text-slate-800 transition hover:bg-slate-50 active:scale-95">{d}</button>
              ))}
              <button type="button" onClick={() => press('del')} className="rounded-2xl border-2 border-amber-200 bg-amber-50 py-3 text-lg font-black text-amber-700 active:scale-95">⌫</button>
              <button type="button" onClick={() => press('0')} className="rounded-2xl border-2 border-slate-200 bg-white py-3 text-xl font-black text-slate-800 transition hover:bg-slate-50 active:scale-95">0</button>
              <button type="button" onClick={() => press('ok')} className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-lg font-black text-white active:scale-95">✓</button>
            </div>

            {mode === 'practice' && feedback !== 'none' && (
              <div className="mt-4 text-center">
                <button type="button" onClick={next} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2 text-sm font-black text-white shadow">Câu tiếp →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
