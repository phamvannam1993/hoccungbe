'use client';

import { useMemo, useState } from 'react';
import type { RevealMatchQuestion as RevealQ } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { PALETTE, TileContent, shuffledIndexes, type QuestionProps } from './shared';

/** Số lần chọn sai tối đa vẫn được tính là làm đúng. */
const ALLOWED_MISTAKES = 2;

export default function RevealMatchQuestion({ q, done, onChange }: QuestionProps<RevealQ>) {
  const order = useMemo(() => shuffledIndexes(q.pairs.length, q.id), [q.pairs.length, q.id]);
  const [open, setOpen] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<number | null>(null);

  const reveal = (i: number) => {
    if (done || matched.includes(i)) return;
    playSfx('tap');
    setOpen(i);
  };

  const pick = (i: number) => {
    if (done || open === null || matched.includes(i)) return;
    if (i === open) {
      playSfx('match');
      const next = [...matched, i];
      setMatched(next);
      setOpen(null);
      if (next.length === q.pairs.length) {
        onChange({ complete: true, correct: mistakes <= ALLOWED_MISTAKES, auto: true });
      }
    } else {
      playSfx('miss');
      setMistakes(mistakes + 1);
      setShake(i);
      setTimeout(() => setShake(null), 450);
    }
  };

  // Chữ dài (vd "3 áo, 2 quần") thì dùng ô chữ nhật, ít cột hơn để không tràn.
  const longest = Math.max(...q.pairs.flatMap((p) => [p.front.text?.length ?? 0, p.back.text?.length ?? 0]));
  const long = longest > 8;
  const cols = long ? 'grid-cols-1 sm:grid-cols-2' : q.pairs.length > 4 ? 'grid-cols-3' : 'grid-cols-2';
  const size = long ? 'min-h-[64px] px-2 py-2 text-sm leading-snug sm:text-base' : 'aspect-square text-lg sm:text-xl';

  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-semibold text-sky-700">
        Chạm ô màu để lật, rồi chạm ô đúng bên phải · Sai: {mistakes}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:gap-10">
        <div className={`grid ${cols} gap-2 sm:gap-3`}>
          {q.pairs.map((p, i) => {
            const isOpen = open === i || matched.includes(i) || done;
            return (
              <button
                key={i}
                type="button"
                onClick={() => reveal(i)}
                className={`flex items-center justify-center rounded-2xl font-black shadow-[0_4px_0_rgba(0,0,0,0.18)] transition ${size} ${
                  open === i ? 'ring-4 ring-sky-400' : ''
                } ${isOpen ? 'bg-white text-slate-800' : 'text-white hover:-translate-y-0.5'}`}
                style={{
                  backgroundColor: isOpen ? undefined : PALETTE[i % PALETTE.length],
                  border: matched.includes(i) ? `4px solid ${PALETTE[i % PALETTE.length]}` : undefined,
                }}
              >
                {isOpen ? <TileContent tile={p.front} /> : <span className="text-3xl">?</span>}
              </button>
            );
          })}
        </div>
        <div className={`grid ${cols} gap-2 sm:gap-3`}>
          {order.map((i) => {
            const isMatched = matched.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                className={`flex items-center justify-center rounded-2xl border-[3px] font-black transition ${size} ${
                  isMatched ? 'text-white' : 'border-slate-200 bg-white text-slate-800 shadow-[0_3px_0_#c6c6c7]'
                } ${shake === i ? 'khv-shake border-rose-400' : ''}`}
                style={isMatched ? { backgroundColor: PALETTE[i % PALETTE.length], borderColor: PALETTE[i % PALETTE.length] } : undefined}
              >
                <TileContent tile={q.pairs[i].back} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
