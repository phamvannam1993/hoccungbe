'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MatchMultiQuestion, MatchQuestion as MatchQ, Tile } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { PALETTE, TileContent, shuffledIndexes, tileClass, type QuestionProps } from './shared';

type Box = { left: number; right: number; top: number; bottom: number; cx: number; cy: number };
type Geo = { l: Box[]; r: Box[] };

/**
 * Nối ô: `match` (trái ↔ phải), `match_vertical` (trên ↔ dưới),
 * `match_multi` (mỗi ô bên phải nối vào một nhóm bên trái, nhóm nhận nhiều ô).
 */
export default function MatchQuestion({ q, done, onChange }: QuestionProps<MatchQ | MatchMultiQuestion>) {
  const multi = q.type === 'match_multi';
  const vertical = q.type === 'match_vertical';
  const lefts: Tile[] = multi ? q.groups : q.pairs.map((p) => p.left);
  const rights: Tile[] = multi ? q.items : q.pairs.map((p) => p.right);
  const target = (r: number) => (multi ? q.items[r].group : r);

  const rightOrder = useMemo(() => shuffledIndexes(rights.length, q.id), [rights.length, q.id]);
  const [links, setLinks] = useState<Record<number, number>>({}); // ô phải → ô trái
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [selRight, setSelRight] = useState<number | null>(null);
  const [geo, setGeo] = useState<Geo>({ l: [], r: [] });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftEls = useRef<(HTMLButtonElement | null)[]>([]);
  const rightEls = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const base = container.getBoundingClientRect();
      const box = (el: HTMLElement | null): Box => {
        const r = el?.getBoundingClientRect();
        if (!r) return { left: 0, right: 0, top: 0, bottom: 0, cx: 0, cy: 0 };
        return {
          left: r.left - base.left,
          right: r.right - base.left,
          top: r.top - base.top,
          bottom: r.bottom - base.top,
          cx: r.left - base.left + r.width / 2,
          cy: r.top - base.top + r.height / 2,
        };
      };
      setGeo({ l: leftEls.current.map(box), r: rightEls.current.map(box) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    [...leftEls.current, ...rightEls.current].forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const report = (next: Record<number, number>) => {
    const complete = Object.keys(next).length === rights.length;
    const correct = rights.every((_, r) => next[r] === target(r));
    onChange({ complete, correct });
  };

  const connect = (l: number, r: number) => {
    const next = { ...links };
    if (!multi) {
      for (const key of Object.keys(next)) if (next[Number(key)] === l) delete next[Number(key)];
    }
    next[r] = l;
    playSfx('tap');
    setLinks(next);
    setSelLeft(null);
    setSelRight(null);
    report(next);
  };

  const clickLeft = (l: number) => {
    if (done) return;
    if (selRight !== null) return connect(l, selRight);
    setSelLeft(selLeft === l ? null : l);
  };

  const clickRight = (r: number) => {
    if (done) return;
    if (selLeft !== null) return connect(selLeft, r);
    if (links[r] !== undefined) {
      const next = { ...links };
      delete next[r];
      setLinks(next);
      report(next);
      return;
    }
    setSelRight(selRight === r ? null : r);
  };

  const lines = Object.entries(links).map(([rKey, l]) => {
    const r = Number(rKey);
    const L = geo.l[l];
    const R = geo.r[r];
    if (!L || !R) return null;
    const [x1, y1, x2, y2] = vertical ? [L.cx, L.bottom, R.cx, R.top] : [L.right, L.cy, R.left, R.cy];
    const ok = target(r) === l;
    const color = done ? (ok ? '#62b403' : '#ff5563') : PALETTE[l % PALETTE.length];
    return (
      <g key={r}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={done && !ok ? '8 8' : undefined} />
        <circle cx={x1} cy={y1} r={6} fill={color} />
        <circle cx={x2} cy={y2} r={6} fill={color} />
      </g>
    );
  });

  const leftState = (l: number) => (selLeft === l ? 'active' : 'idle');
  const rightState = (r: number) => {
    if (done) return links[r] === target(r) ? 'correct' : 'wrong';
    return selRight === r ? 'active' : 'idle';
  };

  const leftButtons = lefts.map((t, l) => (
    <button
      key={l}
      type="button"
      ref={(el) => {
        leftEls.current[l] = el;
      }}
      onClick={() => clickLeft(l)}
      disabled={done}
      className={`${tileClass(leftState(l))} min-h-16 ${vertical ? 'w-28 text-base sm:w-36' : 'w-full'}`}
      style={{ borderLeftColor: PALETTE[l % PALETTE.length], borderLeftWidth: vertical ? undefined : 10 }}
    >
      <TileContent tile={t} />
    </button>
  ));

  const rightButtons = rightOrder.map((r) => {
    const linked = links[r];
    return (
      <button
        key={r}
        type="button"
        ref={(el) => {
          rightEls.current[r] = el;
        }}
        onClick={() => clickRight(r)}
        disabled={done}
        className={`${tileClass(rightState(r))} min-h-16 ${vertical ? 'w-28 text-base sm:w-36' : 'w-full'}`}
        style={!done && linked !== undefined ? { borderColor: PALETTE[linked % PALETTE.length] } : undefined}
      >
        <TileContent tile={rights[r]} />
      </button>
    );
  });

  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-semibold text-sky-700">
        {multi ? 'Chạm một ô bên phải rồi chạm vào nhóm của nó' : 'Chạm một ô rồi chạm ô tương ứng để nối'} · chạm lại ô đã nối để gỡ
      </p>
      <div ref={containerRef} className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {lines}
        </svg>
        {vertical ? (
          <div className="flex flex-col gap-24">
            <div className="flex flex-wrap justify-center gap-3">{leftButtons}</div>
            <div className="flex flex-wrap justify-center gap-3">{rightButtons}</div>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_56px_1fr] items-center sm:grid-cols-[1fr_120px_1fr]">
            <div className="flex flex-col justify-around gap-3 self-stretch">{leftButtons}</div>
            <div />
            <div className="flex flex-col gap-3">{rightButtons}</div>
          </div>
        )}
      </div>
    </div>
  );
}
