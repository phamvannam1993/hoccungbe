'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LEVELS, WORDS_PER_ROUND, WORD_GUESS_ITEMS, buildRound, levelOf, type WordGuessLevel, type WordGuessQuestion } from './data';
import { playCorrect, playWin, playWrong, confetti } from '../../lib/celebrate';
import { addStars, starsForScore } from '../../lib/stars';
import { getCurrentChildId } from '../../lib/childData';
import { speakText, stopSpeaking, unlockAudio } from '../../components/edu/utils/speech';

const MAX_PER_WORD = 10;
const HINT_COST = 3;
const WRONG_COST = 1;
const MIN_IF_SOLVED = 2;

type Phase = 'menu' | 'play' | 'done';

/** Trạng thái một câu: ô đáp án trỏ tới id ô chữ (null = trống), ô nào đã khoá do gợi ý. */
type QState = {
  slots: (number | null)[];
  locked: boolean[];
  hints: number;
  wrong: number;
  status: 'playing' | 'wrong' | 'solved' | 'skipped';
};

function freshQ(q: WordGuessQuestion): QState {
  const n = q.syllables.flat().length;
  return { slots: Array(n).fill(null), locked: Array(n).fill(false), hints: 0, wrong: 0, status: 'playing' };
}

function btn3d(color: string, shadow: string) {
  return { background: color, boxShadow: `0 5px 0 ${shadow}` };
}

export default function WordGuessGame() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [level, setLevel] = useState<WordGuessLevel>('de');
  const [round, setRound] = useState<WordGuessQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [qs, setQs] = useState<QState | null>(null);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [reward, setReward] = useState<{ stars: number; saved: boolean } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const counts = useMemo(() => {
    const c: Record<WordGuessLevel, number> = { de: 0, vua: 0, kho: 0 };
    for (const w of WORD_GUESS_ITEMS) c[levelOf(w.word)]++;
    return c;
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  const q = round[qi];
  const flat = q ? q.syllables.flat() : [];

  const start = (lv: WordGuessLevel) => {
    unlockAudio();
    const r = buildRound(lv, Date.now() & 0x7fffffff);
    setLevel(lv);
    setRound(r);
    setQi(0);
    setQs(freshQ(r[0]));
    setScore(0);
    setSolvedCount(0);
    setReward(null);
    setPhase('play');
  };

  const finishRound = (finalScore: number) => {
    const max = round.length * MAX_PER_WORD || 1;
    const pct = Math.round((finalScore / max) * 100);
    const stars = starsForScore(pct);
    const id = getCurrentChildId();
    if (id) addStars(id, stars);
    setReward({ stars, saved: !!id });
    if (pct >= 60) {
      playWin();
      confetti('big');
    }
    setPhase('done');
  };

  const next = () => {
    stopSpeaking();
    if (qi + 1 >= round.length) {
      finishRound(score);
      return;
    }
    setQi(qi + 1);
    setQs(freshQ(round[qi + 1]));
  };

  /** Chấm khi đã đủ ô. */
  const check = (s: QState) => {
    if (!q) return s;
    const guess = s.slots.map((id) => q.tiles.find((t) => t.id === id)?.ch ?? '');
    if (guess.join('') === flat.join('')) {
      const gained = Math.max(MIN_IF_SOLVED, MAX_PER_WORD - s.hints * HINT_COST - s.wrong * WRONG_COST);
      setScore((v) => v + gained);
      setSolvedCount((v) => v + 1);
      playCorrect();
      confetti('small');
      speakText(q.item.word);
      return { ...s, status: 'solved' as const };
    }
    playWrong();
    setShakeKey((k) => k + 1);
    // Sau một nhịp, trả các chữ đặt sai về khay (giữ lại chữ đúng chỗ để bé đỡ nản).
    window.setTimeout(() => {
      setQs((cur) => {
        if (!cur || cur.status !== 'wrong') return cur;
        const slots = cur.slots.map((id, i) => {
          if (cur.locked[i]) return id;
          const ch = q.tiles.find((t) => t.id === id)?.ch;
          return ch === flat[i] ? id : null;
        });
        return { ...cur, slots, status: 'playing' };
      });
    }, 750);
    return { ...s, wrong: s.wrong + 1, status: 'wrong' as const };
  };

  const placeTile = (tileId: number) => {
    if (!qs || qs.status !== 'playing') return;
    if (qs.slots.includes(tileId)) return;
    const idx = qs.slots.findIndex((v) => v === null);
    if (idx < 0) return;
    const slots = [...qs.slots];
    slots[idx] = tileId;
    let s: QState = { ...qs, slots };
    if (slots.every((v) => v !== null)) s = check(s);
    setQs(s);
  };

  const removeSlot = (i: number) => {
    if (!qs || qs.status !== 'playing' || qs.locked[i] || qs.slots[i] === null) return;
    const slots = [...qs.slots];
    slots[i] = null;
    setQs({ ...qs, slots });
  };

  const clearAll = () => {
    if (!qs || qs.status !== 'playing') return;
    setQs({ ...qs, slots: qs.slots.map((v, i) => (qs.locked[i] ? v : null)) });
  };

  /** Gợi ý: đặt đúng chữ vào ô đầu tiên còn trống/sai và khoá lại. */
  const hint = () => {
    if (!qs || !q || qs.status !== 'playing') return;
    const i = qs.slots.findIndex((id, k) => !qs.locked[k] && q.tiles.find((t) => t.id === id)?.ch !== flat[k]);
    if (i < 0) return;
    const slots = [...qs.slots];
    // Chọn một ô chữ đúng chưa nằm ở ô đã khoá; nếu đang ở ô khác thì nhấc ra.
    const tile = q.tiles.find((t) => t.ch === flat[i] && !qs.slots.some((id, k) => id === t.id && (qs.locked[k] || q.tiles.find((x) => x.id === id)?.ch === flat[k])));
    if (!tile) return;
    const from = slots.indexOf(tile.id);
    if (from >= 0) slots[from] = null;
    slots[i] = tile.id;
    const locked = [...qs.locked];
    locked[i] = true;
    let s: QState = { ...qs, slots, locked, hints: qs.hints + 1 };
    if (slots.every((v) => v !== null)) s = check(s);
    setQs(s);
  };

  const skip = () => {
    if (!qs || !q || qs.status !== 'playing') return;
    const used = new Set<number>();
    const slots = flat.map((ch) => {
      const t = q.tiles.find((x) => x.ch === ch && !used.has(x.id))!;
      used.add(t.id);
      return t.id;
    });
    setQs({ ...qs, slots, status: 'skipped' });
    speakText(q.item.word);
  };

  const lv = LEVELS.find((l) => l.key === level)!;

  // ── Màn chọn cấp độ ──
  if (phase === 'menu') {
    return (
      <div className="mt-6 rounded-[28px] border-4 border-[#FBCFE8] bg-white p-5 text-center shadow-[0_10px_34px_rgba(255,107,157,0.18)] sm:p-8">
        <p className="kid-display text-xl font-black text-slate-800 sm:text-2xl">Bé chọn cấp độ nhé!</p>
        <p className="mt-1 font-semibold text-slate-500">Mỗi lượt {WORDS_PER_ROUND} hình · chạm chữ cái để ghép thành tên đúng</p>
        <div className="mx-auto mt-6 grid max-w-xl gap-4 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => start(l.key)}
              className="kid-btn-3d flex flex-col items-center gap-1 !rounded-3xl !px-4 !py-4 text-white"
              style={btn3d(l.color, l.shadow)}
            >
              <span className="text-2xl">{l.label}</span>
              <span className="text-xs font-bold opacity-90">{l.hint}</span>
              <span className="text-[11px] font-bold opacity-80">{counts[l.key]} từ</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Màn kết thúc ──
  if (phase === 'done') {
    const max = round.length * MAX_PER_WORD;
    return (
      <div className="mt-6 rounded-[28px] border-4 border-[#FDE68A] bg-white p-6 text-center shadow-[0_10px_34px_rgba(255,217,61,0.3)] sm:p-8">
        <div className="text-5xl kid-bounce" aria-hidden>🏆</div>
        <p className="kid-display mt-2 text-2xl font-black text-slate-800 sm:text-3xl">Hoàn thành cấp {lv.label}!</p>
        <p className="mt-2 text-lg font-bold text-slate-600">
          Đoán đúng <strong className="text-emerald-600">{solvedCount}/{round.length}</strong> hình · Điểm <strong className="text-[#c81e5b]">{score}/{max}</strong>
        </p>
        {reward && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-lg font-black text-amber-600">
            ⭐ +{reward.stars} sao
          </p>
        )}
        {reward && !reward.saved && <p className="mt-2 text-xs font-semibold text-slate-400">Chọn hồ sơ của bé để lưu sao vào ví nhé.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => start(level)} className="kid-btn-3d" style={btn3d('#FF6B9D', '#c8457a')}>🔁 Chơi lại</button>
          <button type="button" onClick={() => setPhase('menu')} className="kid-btn-3d" style={btn3d('#4ECDC4', '#2a9d95')}>Đổi cấp độ</button>
          <Link href="/san-choi-tri-tue" className="kid-btn-3d inline-block" style={btn3d('#A06CD5', '#7442a8')}>🎪 Sân chơi trí tuệ</Link>
        </div>
      </div>
    );
  }

  if (!q || !qs) return null;

  const done = qs.status === 'solved' || qs.status === 'skipped';
  let slotIdx = 0;

  return (
    <div className="mt-6 rounded-[28px] border-4 border-[#BAE6FD] bg-white p-3 shadow-[0_10px_34px_rgba(135,206,235,0.28)] sm:p-6">
      {/* Thanh trạng thái */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-black">
        <span className="rounded-full px-3 py-1 text-white" style={{ background: lv.color }}>Cấp {lv.label}</span>
        <span className="text-slate-500">Hình {qi + 1}/{round.length}</span>
        <span className="rounded-full bg-pink-50 px-3 py-1 text-[#c81e5b]">⭐ {score} điểm</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-[#FF6B9D] to-[#FFD93D] transition-all" style={{ width: `${(qi / round.length) * 100}%` }} />
      </div>

      {/* Hình */}
      <div className="mx-auto mt-4 grid aspect-square w-full max-w-[260px] place-items-center overflow-hidden rounded-3xl border-4 border-[#FFE5F1] bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={q.item.image} alt={done ? q.item.word : 'Hình cần đoán'} className="max-h-full max-w-full object-contain" draggable={false} />
      </div>
      <p className="mt-2 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{q.item.topic} · {q.syllables.length} tiếng</p>

      {/* Ô đáp án — mỗi tiếng một nhóm, tiếng dài tự xuống dòng trên điện thoại */}
      <div key={shakeKey} className={`mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 ${qs.status === 'wrong' ? 'kid-shake' : ''}`}>
        {q.syllables.map((syl, si) => (
          <div key={si} className="flex gap-1.5">
            {syl.map(() => {
              const i = slotIdx++;
              const id = qs.slots[i];
              const ch = id === null ? '' : q.tiles.find((t) => t.id === id)?.ch;
              const color =
                qs.status === 'solved' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : qs.status === 'skipped' ? 'border-amber-300 bg-amber-50 text-amber-700'
                : qs.status === 'wrong' ? 'border-rose-300 bg-rose-50 text-rose-600'
                : qs.locked[i] ? 'border-sky-300 bg-sky-50 text-sky-700'
                : ch ? 'border-[#A06CD5] bg-[#F6F0FF] text-[#6d28d9]'
                : 'border-dashed border-slate-300 bg-slate-50 text-slate-300';
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => removeSlot(i)}
                  aria-label={ch ? `Bỏ chữ ${ch}` : 'Ô trống'}
                  className={`chu-mau grid h-12 w-10 place-items-center rounded-xl border-2 text-2xl font-black sm:h-14 sm:w-12 sm:text-3xl ${color}`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {done ? (
        <div className="mt-5 text-center">
          <p className={`kid-display text-xl font-black ${qs.status === 'solved' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {qs.status === 'solved' ? '🎉 Giỏi quá! ' : '💡 Đáp án là: '}
            <span className="chu-mau">{q.item.word}</span>
            <button type="button" onClick={() => speakText(q.item.word)} className="ml-2 text-sky-500" aria-label="Nghe đọc">🔊</button>
          </p>
          <button type="button" onClick={next} className="kid-btn-3d mt-4" style={btn3d('#FF6B9D', '#c8457a')}>
            {qi + 1 >= round.length ? 'Xem kết quả 🏆' : 'Hình tiếp →'}
          </button>
        </div>
      ) : (
        <>
          {/* Khay chữ cái */}
          <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2">
            {q.tiles.map((t) => {
              const used = qs.slots.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={used || qs.status !== 'playing'}
                  onClick={() => placeTile(t.id)}
                  className={`chu-mau grid h-12 w-12 place-items-center rounded-2xl text-2xl font-black transition active:translate-y-0.5 ${
                    used ? 'bg-slate-100 text-transparent shadow-none' : 'bg-[#FFD93D] text-slate-800 shadow-[0_4px_0_#d4a915] hover:brightness-105'
                  }`}
                >
                  {t.ch}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={hint} className="kid-btn-3d !px-4 !py-2 text-sm" style={btn3d('#4ECDC4', '#2a9d95')}>💡 Gợi ý (−{HINT_COST})</button>
            <button type="button" onClick={clearAll} className="kid-btn-3d !px-4 !py-2 text-sm" style={btn3d('#87CEEB', '#4f9fc0')}>↺ Xoá</button>
            <button type="button" onClick={skip} className="kid-btn-3d !px-4 !py-2 text-sm" style={btn3d('#94a3b8', '#64748b')}>Bỏ qua</button>
          </div>
          {qs.hints + qs.wrong > 0 && (
            <p className="mt-2 text-center text-xs font-semibold text-slate-400">
              Câu này: {qs.hints} gợi ý · {qs.wrong} lần sai — vẫn được tối thiểu {MIN_IF_SOLVED} điểm khi đoán đúng
            </p>
          )}
        </>
      )}
    </div>
  );
}
