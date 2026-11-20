'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { playCorrect, playWrong, playWin, confetti, isSoundEnabled, setSoundEnabled } from '../lib/celebrate';
import { addStars, starsForScore } from '../lib/stars';
import { getCurrentChildId, listChildren } from '../lib/childData';
import {
  IQ_GRADES, TIER_LABEL, TIER_COUNT, buildDailySet, vnDateKey, msUntilNextDay, formatCountdown, formatDateVi,
  getDayResult, saveFirstResult, type IqItem, type IqTier, type IqDayResult,
} from '../lib/thuThachIq';

type Phase = 'lobby' | 'play' | 'done';
type Result = { correct: number; total: number; stars: number; first: boolean; practice: boolean };

const GRADE_KEY = 'bhh_iq_grade';
const TIER_STYLE: Record<IqTier, { bg: string; color: string; border: string; emoji: string }> = {
  easy: { bg: '#DCFCE7', color: '#15803d', border: '#86EFAC', emoji: '🌱' },
  medium: { bg: '#FEF3C7', color: '#b45309', border: '#FCD34D', emoji: '🔥' },
  hard: { bg: '#FEE2E2', color: '#b91c1c', border: '#FCA5A5', emoji: '🚀' },
};
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const BTN = {
  pink: { backgroundImage: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', boxShadow: '0 6px 0 #c81e5b' },
  teal: { backgroundImage: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', boxShadow: '0 6px 0 #0d7a74' },
  purple: { backgroundImage: 'linear-gradient(135deg,#A06CD5,#4ECDC4)', boxShadow: '0 6px 0 #6d28d9' },
};

// ── Đọc đề (giọng Google qua /api/tts) ───────────────────────────────────────
function SpeakButton({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { ref.current?.pause(); }, []);
  const toggle = () => {
    if (on) { ref.current?.pause(); setOn(false); return; }
    const a = new Audio(`/api/tts?tl=vi&q=${encodeURIComponent(text.slice(0, 190))}`);
    ref.current = a;
    a.onended = () => setOn(false);
    a.onerror = () => setOn(false);
    setOn(true);
    a.play().catch(() => setOn(false));
  };
  return (
    <button type="button" onClick={toggle} aria-label={on ? 'Dừng đọc' : 'Nghe đề'}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-3 py-1 text-sm font-black transition"
      style={on ? { borderColor: '#0d7a74', background: '#CCFBF1', color: '#0d7a74' } : { borderColor: '#BAE6FD', color: '#0369a1', background: '#fff' }}>
      <span aria-hidden>{on ? '⏸' : '🔊'}</span><span>{on ? 'Dừng' : 'Nghe'}</span>
    </button>
  );
}

function TierChip({ tier }: { tier: IqTier }) {
  const s = TIER_STYLE[tier];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 px-3 py-0.5 text-sm font-black kid-display" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      <span aria-hidden>{s.emoji}</span>{TIER_LABEL[tier]}
    </span>
  );
}

function Visual({ v }: { v: NonNullable<IqItem['visual']> }) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl p-4" style={{ background: '#F6F0FF' }}>
      {v.emoji && <p className="text-center text-3xl leading-relaxed tracking-wide sm:text-4xl" aria-hidden>{v.emoji}</p>}
      {v.grid && (
        <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(...v.grid.map((r) => r.length))}, minmax(2.75rem, auto))` }}>
          {v.grid.flatMap((row, r) => row.map((cell, c) => (
            <span key={`${r}-${c}`} className="grid h-11 place-items-center rounded-xl border-2 px-2 text-lg font-black kid-display"
              style={cell === '?' || cell === '❓' ? { borderColor: '#FF6B9D', background: '#FFF1F6', color: '#c81e5b' } : { borderColor: '#E9D5FF', background: '#fff', color: '#334155' }}>
              {cell}
            </span>
          )))}
        </div>
      )}
    </div>
  );
}

export default function ThuThachIqClient({ pool }: { pool: IqItem[] }) {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [now, setNow] = useState(0);
  const [grade, setGrade] = useState(2);
  const [childId, setChildId] = useState(0);
  const [childName, setChildName] = useState('');
  const [today, setToday] = useState<IqDayResult | null>(null);
  const [phase, setPhase] = useState<Phase>('lobby');
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [sound, setSound] = useState(true);
  const phaseRef = useRef<Phase>('lobby');
  const dateRef = useRef<string | null>(null);
  useEffect(() => { phaseRef.current = phase; dateRef.current = dateKey; }, [phase, dateKey]);

  // Khởi tạo phía client (ngày theo giờ VN, bé đang chọn, lớp đã chọn trước đó).
  // Chạy sau khung hình đầu (localStorage chỉ có ở client → tránh lệch hydration).
  useEffect(() => {
    const init = () => {
      const t = Date.now();
      const key = vnDateKey(t);
      const id = getCurrentChildId() || 0;
      let saved = 0;
      try { saved = Number(localStorage.getItem(GRADE_KEY) || 0); } catch { /* ignore */ }
      setNow(t);
      setDateKey(key);
      setChildId(id);
      setToday(getDayResult(id, key));
      setSound(isSoundEnabled());
      if (saved >= 1 && saved <= 5) setGrade(saved);
      (async () => {
        try {
          const kids = await listChildren();
          const me = kids.find((k) => k.id === id) || kids[0];
          if (!me) return;
          setChildName(me.nickname || me.fullName || '');
          const g = parseInt(String(me.currentLevel || '').replace(/\D/g, ''), 10);
          if (!(saved >= 1 && saved <= 5) && g >= 1 && g <= 5 && phaseRef.current === 'lobby') setGrade(g);
        } catch { /* khách chưa có hồ sơ */ }
      })();
    };
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, []);

  // Đồng hồ đếm ngược; qua 0h (khi không đang làm bài) thì đổi sang bộ mới.
  useEffect(() => {
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const key = vnDateKey(t);
      if (dateRef.current && dateRef.current !== key && phaseRef.current !== 'play') {
        dateRef.current = key;
        setDateKey(key);
        setToday(getDayResult(getCurrentChildId() || 0, key));
        setPhase('lobby');
        setResult(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const set = useMemo(() => (dateKey ? buildDailySet(pool, dateKey, grade) : []), [pool, dateKey, grade]);
  const q = set[idx];
  const countdown = formatCountdown(msUntilNextDay(now));

  const chooseGrade = (g: number) => {
    setGrade(g);
    try { localStorage.setItem(GRADE_KEY, String(g)); } catch { /* ignore */ }
  };

  const start = () => {
    setIdx(0); setPicked(null); setAnswers([]); setResult(null); setPhase('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    const ok = i === q.correct;
    setAnswers((a) => [...a, ok]);
    if (ok) { playCorrect(); confetti('small'); } else { playWrong(); }
  };

  const finish = (all: boolean[]) => {
    if (!dateKey) return;
    const correct = all.filter(Boolean).length;
    const total = set.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const practice = !!today;
    let stars = 0, first = false;
    if (!practice) {
      const s = starsForScore(pct);
      first = saveFirstResult(childId, dateKey, { grade, correct, total, stars: s });
      if (first) {
        stars = s;
        if (childId) addStars(childId, s);
        setToday({ grade, correct, total, stars: s });
      }
    }
    setResult({ correct, total, stars, first, practice });
    setPhase('done');
    playWin();
    if (pct >= 70) confetti('big');
  };

  const next = () => {
    if (idx + 1 >= set.length) { finish(answers); return; }
    setIdx(idx + 1); setPicked(null);
  };

  const toggleSound = () => { const v = !sound; setSound(v); setSoundEnabled(v); };

  if (!dateKey) {
    return <div className="h-72 animate-pulse rounded-[28px] border-4 border-purple-100 bg-white/70" aria-busy="true" />;
  }

  // ── Màn chờ ────────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <section className="rounded-[28px] border-4 bg-white p-5 sm:p-8 kid-pop-in" style={{ borderColor: '#E9D5FF', boxShadow: '0 10px 34px rgba(160,108,213,0.22)' }}>
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl kid-bounce" style={{ background: '#F6F0FF' }} aria-hidden>🧠</span>
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-widest text-purple-700 kid-display">Ngày {formatDateVi(dateKey)}</p>
            <h1 className="text-2xl font-black kid-display sm:text-4xl" style={{ backgroundImage: 'linear-gradient(135deg,#A06CD5,#FF6B9D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Thử thách IQ hôm nay
            </h1>
            <p className="mt-1 font-semibold text-slate-600">
              {childName ? `${childName} ơi, ` : ''}10 câu đố tư duy mới mỗi ngày — từ dễ đến khó!
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-black text-slate-500">Chọn lớp:</span>
          {IQ_GRADES.map((g) => (
            <button key={g} type="button" onClick={() => chooseGrade(g)} aria-pressed={grade === g}
              className="rounded-full border-2 px-4 py-1.5 font-black kid-display transition"
              style={grade === g ? { background: '#A06CD5', borderColor: '#6d28d9', color: '#fff', boxShadow: '0 3px 0 #6d28d9' } : { background: '#fff', borderColor: '#E9D5FF', color: '#6d28d9' }}>
              Lớp {g}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {(['easy', 'medium', 'hard'] as IqTier[]).map((t) => (
            <div key={t} className="rounded-2xl border-2 p-3 text-center" style={{ background: TIER_STYLE[t].bg, borderColor: TIER_STYLE[t].border }}>
              <div className="text-2xl" aria-hidden>{TIER_STYLE[t].emoji}</div>
              <div className="text-xl font-black kid-display" style={{ color: TIER_STYLE[t].color }}>{TIER_COUNT[t]} câu</div>
              <div className="text-sm font-bold" style={{ color: TIER_STYLE[t].color }}>{TIER_LABEL[t]}</div>
            </div>
          ))}
        </div>

        {today && (
          <p className="mt-5 rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-3 font-bold text-green-800">
            ✅ Hôm nay bé đã hoàn thành: đúng {today.correct}/{today.total} câu (Lớp {today.grade}), nhận {today.stars} ⭐. Làm lại để luyện thêm nhé (không cộng thêm sao).
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" onClick={start} className="kid-btn-3d text-lg" style={today ? BTN.teal : BTN.pink}>
            {today ? '🔁 Làm lại để luyện' : '🚀 Bắt đầu thử thách'}
          </button>
          <p className="text-sm font-bold text-slate-500">
            ⏳ Bộ câu hỏi mới sau <span className="font-black tabular-nums text-purple-700">{countdown}</span>
          </p>
        </div>
      </section>
    );
  }

  // ── Màn kết quả ────────────────────────────────────────────────────────────
  if (phase === 'done' && result) {
    const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
    const praise = pct === 100 ? 'Xuất sắc! Thiên tài nhí đây rồi!' : pct >= 80 ? 'Giỏi quá! Bé suy nghĩ rất nhanh!' : pct >= 50 ? 'Khá lắm! Cố thêm chút nữa nhé!' : 'Không sao, luyện thêm là giỏi ngay!';
    return (
      <section className="rounded-[28px] border-4 bg-white p-5 text-center sm:p-8 kid-pop-in" style={{ borderColor: '#FDE68A', boxShadow: '0 10px 34px rgba(255,217,61,0.3)' }}>
        <div className="text-6xl kid-bounce" aria-hidden>{pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}</div>
        <h2 className="mt-2 text-2xl font-black text-slate-900 kid-display sm:text-3xl">{praise}</h2>
        <p className="mt-3 text-5xl font-black kid-display" style={{ color: '#c81e5b' }}>
          {result.correct}<span className="text-3xl text-slate-400">/{result.total}</span>
        </p>
        <p className="font-bold text-slate-500">câu đúng · Lớp {grade}</p>

        <div className="mt-4 flex justify-center gap-1.5" aria-label="Kết quả từng câu">
          {answers.map((ok, i) => (
            <span key={i} className="grid h-8 w-8 place-items-center rounded-full text-sm font-black text-white"
              style={{ background: ok ? '#6BCB77' : '#FF6B6B' }} title={`Câu ${i + 1}: ${ok ? 'đúng' : 'sai'}`}>
              {i + 1}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-5 max-w-md rounded-2xl border-2 px-4 py-3 font-bold" style={{ borderColor: '#FDE68A', background: '#FEFCE8', color: '#a16207' }}>
          {result.first ? (
            <>
              <span className="text-2xl">+{result.stars} ⭐</span>
              <span className="block text-sm">
                {childId ? 'Sao đã được cất vào ví của bé!' : 'Tạo hồ sơ cho bé để cất sao vào ví nhé!'}
              </span>
            </>
          ) : (
            <span className="text-sm">Lượt luyện tập — hôm nay bé đã nhận sao rồi. Mai quay lại nhận sao tiếp nhé!</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={start} className="kid-btn-3d" style={BTN.teal}>🔁 Làm lại để luyện</button>
          <button type="button" onClick={() => setPhase('lobby')} className="kid-btn-3d" style={BTN.purple}>🏠 Về màn chính</button>
        </div>
        <p className="mt-5 text-sm font-bold text-slate-500">
          ⏳ Bộ câu hỏi mới sau <span className="font-black tabular-nums text-purple-700">{countdown}</span>
        </p>
      </section>
    );
  }

  if (!q) return null;

  // ── Đang làm bài ───────────────────────────────────────────────────────────
  const revealed = picked !== null;
  const ok = picked === q.correct;
  const readOptions = q.options.some((o) => /[\p{L}\p{N}]/u.test(o));
  const speech = [q.speech || q.question.replace(/\n/g, ' '), readOptions ? `Các đáp án: ${q.options.map((o, i) => `${LETTERS[i]}, ${o}`).join('. ')}` : ''].filter(Boolean).join('. ');
  return (
    <section className="rounded-[28px] border-4 bg-white p-4 sm:p-7" style={{ borderColor: TIER_STYLE[q.tier].border, boxShadow: '0 10px 34px rgba(160,108,213,0.18)' }}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-500 kid-display">Câu {idx + 1}/{set.length}</span>
        <TierChip tier={q.tier} />
        <button type="button" onClick={toggleSound} className="ml-auto rounded-full border-2 border-slate-200 px-2.5 py-1 text-sm" aria-label={sound ? 'Tắt âm thanh' : 'Bật âm thanh'}>
          {sound ? '🔔' : '🔕'}
        </button>
      </div>
      <div className="mt-3 flex gap-1" aria-hidden>
        {set.map((_, i) => (
          <span key={i} className="h-2.5 flex-1 rounded-full transition"
            style={{ background: i < answers.length ? (answers[i] ? '#6BCB77' : '#FF6B6B') : i === idx ? '#A06CD5' : '#EDE9FE' }} />
        ))}
      </div>

      <div key={q.id} className="kid-pop-in">
        <div className="mt-5 flex items-start gap-3">
          <p className="min-w-0 flex-1 whitespace-pre-line text-lg font-black leading-relaxed text-slate-900 kid-display sm:text-xl">{q.question}</p>
          <SpeakButton text={speech} />
        </div>
        {q.visual && (q.visual.emoji || q.visual.grid) && <Visual v={q.visual} />}

        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.options.map((op, i) => {
            const isCorrect = i === q.correct, isSel = i === picked;
            let style: React.CSSProperties = { borderColor: '#E9D5FF', background: '#fff', color: '#334155', boxShadow: '0 4px 0 #E9D5FF' };
            if (revealed) {
              if (isCorrect) style = { borderColor: '#6BCB77', background: '#F0FDF4', color: '#15803d', boxShadow: '0 4px 0 #6BCB77' };
              else if (isSel) style = { borderColor: '#FF6B6B', background: '#FEE2E2', color: '#b91c1c', boxShadow: '0 4px 0 #FF6B6B' };
              else style = { borderColor: '#e2e8f0', background: '#fff', color: '#94a3b8', boxShadow: 'none' };
            }
            return (
              <li key={i}>
                <button type="button" disabled={revealed} onClick={() => choose(i)}
                  className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-black transition kid-display ${revealed ? '' : 'hover:-translate-y-0.5 active:translate-y-0.5'} ${revealed && isSel && !isCorrect ? 'kid-shake' : ''}`}
                  style={style}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm text-white" style={{ background: revealed && isCorrect ? '#6BCB77' : revealed && isSel ? '#FF6B6B' : '#A06CD5' }}>{LETTERS[i]}</span>
                  <span className="min-w-0 break-words">{op}</span>
                  {revealed && isCorrect && <span className="ml-auto" aria-hidden>✅</span>}
                  {revealed && isSel && !isCorrect && <span className="ml-auto" aria-hidden>❌</span>}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed && (
          <div className="mt-5 rounded-2xl border-2 p-4 kid-pop-in" style={ok ? { borderColor: '#BBF7D0', background: '#F0FDF4' } : { borderColor: '#FED7AA', background: '#FFF7ED' }} role="status">
            <p className="text-lg font-black kid-display" style={{ color: ok ? '#15803d' : '#c2410c' }}>
              {ok ? '🎉 Đúng rồi! Giỏi quá!' : `🤔 Chưa đúng — đáp án là ${LETTERS[q.correct]}. ${q.options[q.correct]}`}
            </p>
            {q.explanation && <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">💡 {q.explanation}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={next} disabled={!revealed} className="kid-btn-3d text-lg" style={BTN.pink}>
            {idx + 1 >= set.length ? '🏁 Xem kết quả' : 'Câu tiếp ➜'}
          </button>
        </div>
      </div>
    </section>
  );
}
