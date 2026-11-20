'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { WS_LEVELS, WS_TOPICS, buildGrid, type WsLevel } from './data';
import { confetti, playCorrect, playWin, playWrong } from '../../lib/celebrate';
import { addStars, starsForScore } from '../../lib/stars';
import { getCurrentChildId } from '../../lib/childData';
import { speakEnglish, speakText, stopSpeaking, unlockAudio } from '../../components/edu/utils/speech';

type Cell = [number, number];
type Found = { idx: number; from: Cell; to: Cell; color: string };

const COLORS = ['#FF6B9D', '#4ECDC4', '#FF9F45', '#A06CD5', '#6BCB77', '#87CEEB', '#FFD93D', '#FF6B6B'];

function topicSeed(key: string): number {
  let h = 2166136261;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function btn3d(color: string, shadow: string) {
  return { background: color, boxShadow: `0 5px 0 ${shadow}` };
}

/** Các ô trên đoạn thẳng from→to (đã được nắn về hướng hợp lệ). */
function lineCells(from: Cell, to: Cell): Cell[] {
  const dr = Math.sign(to[0] - from[0]);
  const dc = Math.sign(to[1] - from[1]);
  const n = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
  return Array.from({ length: n + 1 }, (_, k) => [from[0] + dr * k, from[1] + dc * k] as Cell);
}

/** Nắn điểm cuối về hàng ngang / dọc (/ chéo nếu cho phép) gần nhất với hướng kéo. */
function snap(from: Cell, raw: Cell, size: number, diagonal: boolean): Cell {
  const dr = raw[0] - from[0];
  const dc = raw[1] - from[1];
  const ar = Math.abs(dr);
  const ac = Math.abs(dc);
  if (ar === 0 && ac === 0) return from;
  if (diagonal && ar > 0 && ac > 0 && Math.min(ar, ac) * 2 >= Math.max(ar, ac)) {
    let n = Math.max(ar, ac);
    const sr = Math.sign(dr);
    const sc = Math.sign(dc);
    while (n > 0) {
      const r = from[0] + sr * n;
      const c = from[1] + sc * n;
      if (r >= 0 && r < size && c >= 0 && c < size) return [r, c];
      n--;
    }
    return from;
  }
  return ac >= ar ? [from[0], raw[1]] : [raw[0], from[1]];
}

export default function WordSearchGame() {
  const [topicIdx, setTopicIdx] = useState(0);
  const [level, setLevel] = useState<WsLevel>('de');
  const [roundNo, setRoundNo] = useState(1);
  const [found, setFound] = useState<Found[]>([]);
  const [sel, setSel] = useState<{ from: Cell; to: Cell } | null>(null);
  const [pending, setPending] = useState<Cell | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [reward, setReward] = useState<{ stars: number; saved: boolean } | null>(null);
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ from: Cell; moved: boolean; id: number } | null>(null);

  const topic = WS_TOPICS[topicIdx];
  const diagonal = level === 'kho';
  // Bảng tất định theo (chủ đề, cấp độ, số ván) — server và client dựng ra giống hệt nhau.
  const board = useMemo(() => buildGrid(topic, level, topicSeed(topic.key) + roundNo * 7919 + (diagonal ? 104729 : 0)), [topic, level, roundNo, diagonal]);
  const { size, grid, placed } = board;

  const won = found.length === placed.length && placed.length > 0;
  const elapsed = startAt === null ? 0 : Math.max(0, Math.floor(((endAt ?? now) - startAt) / 1000));

  useEffect(() => {
    if (startAt === null || endAt !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [startAt, endAt]);

  useEffect(() => () => stopSpeaking(), []);

  const reset = (next: { topicIdx?: number; level?: WsLevel; roundNo?: number }) => {
    if (next.topicIdx !== undefined) setTopicIdx(next.topicIdx);
    if (next.level !== undefined) setLevel(next.level);
    if (next.roundNo !== undefined) setRoundNo(next.roundNo);
    setFound([]);
    setSel(null);
    setPending(null);
    setStartAt(null);
    setEndAt(null);
    setReward(null);
  };

  const cellAt = (clientX: number, clientY: number): Cell | null => {
    const el = gridRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((clientX - rect.left) / rect.width) * size);
    const r = Math.floor(((clientY - rect.top) / rect.height) * size);
    return [Math.min(size - 1, Math.max(0, r)), Math.min(size - 1, Math.max(0, c))];
  };

  const ensureStarted = () => {
    if (startAt === null) {
      const t = Date.now();
      setStartAt(t);
      setNow(t);
    }
  };

  const evaluate = (from: Cell, to: Cell) => {
    const cells = lineCells(from, to);
    setSel(null);
    if (cells.length < 2) return;
    const letters = cells.map(([r, c]) => grid[r][c]).join('');
    const backwards = [...cells].reverse().map(([r, c]) => grid[r][c]).join('');
    const idx = placed.findIndex((p, i) => !found.some((f) => f.idx === i) && (p.cells.join('') === letters || p.cells.join('') === backwards));
    if (idx < 0) {
      playWrong();
      setFlash('no');
      window.setTimeout(() => setFlash(null), 400);
      return;
    }
    const nextFound = [...found, { idx, from, to, color: COLORS[found.length % COLORS.length] }];
    setFound(nextFound);
    const w = placed[idx].word;
    if (topic.lang === 'en') speakEnglish(w.text);
    else speakText(w.text);
    if (nextFound.length === placed.length) {
      const t = Date.now();
      setEndAt(t);
      const sec = Math.floor((t - (startAt ?? t)) / 1000);
      // Nhanh (≤ 20 giây/từ) → 100 điểm; vừa (≤ 40 giây/từ) → 85; chậm vẫn được 70 vì đã tìm đủ.
      const score = sec <= placed.length * 20 ? 100 : sec <= placed.length * 40 ? 85 : 70;
      const stars = starsForScore(score);
      const id = getCurrentChildId();
      if (id) addStars(id, stars);
      setReward({ stars, saved: !!id });
      playWin();
      confetti('big');
    } else {
      playCorrect();
      confetti('small');
      setFlash('ok');
      window.setTimeout(() => setFlash(null), 400);
    }
  };

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (won) return;
    unlockAudio();
    ensureStarted();
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { from: pending ?? cell, moved: false, id: e.pointerId };
    if (!pending) setSel({ from: cell, to: cell });
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    // Đang chờ chạm chữ cuối thì không coi là kéo — bé chạm lệch tay một chút vẫn được.
    if (pending) return;
    if (cell[0] !== d.from[0] || cell[1] !== d.from[1]) d.moved = true;
    setSel({ from: d.from, to: snap(d.from, cell, size, diagonal) });
  };

  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    if (d.moved) {
      setPending(null);
      evaluate(d.from, snap(d.from, cell, size, diagonal));
      return;
    }
    // Chế độ chạm: chạm chữ đầu, rồi chạm chữ cuối.
    if (!pending) {
      setPending(cell);
      setSel({ from: cell, to: cell });
      return;
    }
    if (pending[0] === cell[0] && pending[1] === cell[1]) {
      setPending(null);
      setSel(null);
      return;
    }
    const to = snap(pending, cell, size, diagonal);
    setPending(null);
    evaluate(pending, to);
  };

  const onPointerCancel = () => {
    drag.current = null;
    if (!pending) setSel(null);
  };

  const selCells = sel ? lineCells(sel.from, sel.to) : [];
  const isSel = (r: number, c: number) => selCells.some(([a, b]) => a === r && b === c);
  const foundColor = (r: number, c: number) => {
    for (let i = found.length - 1; i >= 0; i--) {
      if (lineCells(found[i].from, found[i].to).some(([a, b]) => a === r && b === c)) return found[i].color;
    }
    return null;
  };

  const viTopics = WS_TOPICS.map((t, i) => ({ t, i })).filter((x) => x.t.lang === 'vi');
  const enTopics = WS_TOPICS.map((t, i) => ({ t, i })).filter((x) => x.t.lang === 'en');
  const fontCls = size >= 10 ? 'text-[clamp(15px,4.6vw,24px)]' : 'text-[clamp(18px,5.6vw,28px)]';

  const topicChip = ({ t, i }: { t: (typeof WS_TOPICS)[number]; i: number }) => (
    <button
      key={t.key}
      type="button"
      onClick={() => reset({ topicIdx: i, roundNo: 1 })}
      className={`rounded-full border-2 px-3 py-1.5 text-sm font-black transition ${
        topicIdx === i ? 'border-transparent bg-gradient-to-r from-[#FF6B9D] to-[#FF9F45] text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300'
      }`}
    >
      {t.emoji} {t.label}
    </button>
  );

  return (
    <div className="mt-6 space-y-4">
      {/* Chọn chủ đề + cấp độ */}
      <div className="rounded-3xl border-2 border-[#FBCFE8] bg-white p-4 shadow-[0_6px_22px_rgba(255,107,157,0.18)]">
        <p className="text-xs font-black uppercase tracking-widest text-[#c81e5b] kid-display">Tiếng Việt</p>
        <div className="mt-2 flex flex-wrap gap-2">{viTopics.map(topicChip)}</div>
        <p className="mt-3 text-xs font-black uppercase tracking-widest text-[#0d7a74] kid-display">Tiếng Anh</p>
        <div className="mt-2 flex flex-wrap gap-2">{enTopics.map(topicChip)}</div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {WS_LEVELS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => reset({ level: l.key, roundNo: 1 })}
              className={`rounded-2xl border-2 px-3 py-1.5 text-left text-sm font-black transition ${
                level === l.key ? 'border-transparent text-white' : 'border-slate-200 bg-white text-slate-600'
              }`}
              style={level === l.key ? { background: l.color } : undefined}
            >
              {l.label} <span className="text-xs font-bold opacity-80">· {l.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thanh trạng thái */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-black">
        <span className="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">⏱️ {fmt(elapsed)}</span>
        <span className="rounded-full bg-white px-3 py-1 text-emerald-600 shadow-sm">✅ {found.length}/{placed.length} từ</span>
        <button type="button" onClick={() => reset({ roundNo: roundNo + 1 })} className="kid-btn-3d !px-4 !py-1.5 text-sm" style={btn3d('#4ECDC4', '#2a9d95')}>
          🔀 Bảng mới
        </button>
      </div>

      {won && reward && (
        <div className="rounded-[28px] border-4 border-[#FDE68A] bg-white p-5 text-center shadow-[0_10px_34px_rgba(255,217,61,0.3)] kid-pop-in">
          <div className="text-5xl" aria-hidden>🏆</div>
          <p className="kid-display mt-1 text-2xl font-black text-slate-800">Bé tìm đủ {placed.length} từ rồi!</p>
          <p className="mt-1 font-bold text-slate-600">Thời gian: {fmt(elapsed)} · Chủ đề {topic.label}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-lg font-black text-amber-600">⭐ +{reward.stars} sao</p>
          {!reward.saved && <p className="mt-2 text-xs font-semibold text-slate-400">Chọn hồ sơ của bé để lưu sao vào ví nhé.</p>}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => reset({ roundNo: roundNo + 1 })} className="kid-btn-3d" style={btn3d('#FF6B9D', '#c8457a')}>🔁 Chơi lại</button>
            <Link href="/san-choi-tri-tue" className="kid-btn-3d inline-block" style={btn3d('#A06CD5', '#7442a8')}>🎪 Sân chơi trí tuệ</Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
        {/* Bảng chữ */}
        <div
          className={`mx-auto w-full max-w-[520px] rounded-2xl border-4 bg-white p-1 shadow-[0_10px_34px_rgba(135,206,235,0.28)] transition-colors ${
            flash === 'ok' ? 'border-emerald-300' : flash === 'no' ? 'border-rose-300 kid-shake' : 'border-[#BAE6FD]'
          }`}
        >
          <div
            ref={gridRef}
            role="grid"
            aria-label={`Bảng tìm từ ${size} x ${size}`}
            className="relative aspect-square w-full touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <svg viewBox={`0 0 ${size} ${size}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              {found.map((f, i) => (
                <line key={i} x1={f.from[1] + 0.5} y1={f.from[0] + 0.5} x2={f.to[1] + 0.5} y2={f.to[0] + 0.5} stroke={f.color} strokeOpacity={0.4} strokeWidth={0.8} strokeLinecap="round" />
              ))}
              {sel && (
                <line x1={sel.from[1] + 0.5} y1={sel.from[0] + 0.5} x2={sel.to[1] + 0.5} y2={sel.to[0] + 0.5} stroke="#FFD93D" strokeOpacity={0.7} strokeWidth={0.8} strokeLinecap="round" />
              )}
            </svg>
            <div className="relative grid h-full w-full" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}>
              {grid.map((row, r) =>
                row.map((ch, c) => {
                  const fc = foundColor(r, c);
                  const s = isSel(r, c);
                  const p = pending && pending[0] === r && pending[1] === c;
                  return (
                    <div
                      key={`${r}-${c}`}
                      role="gridcell"
                      className={`chu-mau grid place-items-center font-black leading-none ${fontCls} ${p ? 'rounded-full ring-4 ring-[#FFD93D]' : ''}`}
                      style={{ color: s ? '#7c2d12' : fc ? '#1e293b' : '#475569' }}
                    >
                      {ch}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {/* Danh sách từ */}
        <div className="rounded-3xl border-2 border-[#E9D5FF] bg-white p-4 shadow-[0_6px_22px_rgba(160,108,213,0.18)]">
          <p className="kid-display text-base font-black text-slate-800">
            {topic.emoji} Tìm {placed.length} từ {topic.lang === 'en' ? '(tiếng Anh)' : ''}
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-1">
            {placed.map((p, i) => {
              const f = found.find((x) => x.idx === i);
              return (
                <li
                  key={i}
                  className={`rounded-xl border-2 px-2.5 py-1.5 text-sm font-black ${f ? 'text-slate-500 line-through' : 'border-slate-100 text-slate-700'}`}
                  style={f ? { borderColor: f.color, background: `${f.color}22` } : undefined}
                >
                  <span className="chu-mau text-base">{topic.lang === 'en' ? p.word.text.toUpperCase() : p.word.text}</span>
                  {p.word.meaning && <span className="block text-[11px] font-bold text-slate-400">{p.word.meaning}</span>}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">
            Kéo ngón tay từ chữ đầu đến chữ cuối, hoặc chạm chữ đầu rồi chạm chữ cuối. Từ nằm {diagonal ? 'ngang, dọc hoặc chéo' : 'ngang hoặc dọc'}.
          </p>
        </div>
      </div>
    </div>
  );
}
