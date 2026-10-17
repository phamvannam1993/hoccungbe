'use client';

import { useState } from 'react';
import type { OrderQuestion as OrderQ } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { TileContent, shuffledIndexes, tileClass, type QuestionProps } from './shared';

/** Kéo thả (máy tính) hoặc chạm 2 ô để đổi chỗ (điện thoại). */
export default function OrderQuestion({ q, done, onChange }: QuestionProps<OrderQ>) {
  const [order, setOrder] = useState(() => shuffledIndexes(q.items.length, q.id));
  const [picked, setPicked] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    playSfx('tap');
    setOrder(next);
    onChange({ complete: true, correct: next.every((v, i) => v === i) });
  };

  const swap = (a: number, b: number) => {
    const next = [...order];
    [next[a], next[b]] = [next[b], next[a]];
    playSfx('tap');
    setOrder(next);
    onChange({ complete: true, correct: next.every((v, i) => v === i) });
  };

  const tap = (pos: number) => {
    if (done) return;
    if (picked === null) return setPicked(pos);
    if (picked !== pos) swap(picked, pos);
    setPicked(null);
  };

  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-semibold text-sky-700">Kéo thả, hoặc chạm 2 ô để đổi chỗ cho nhau</p>
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        {order.map((item, pos) => (
          <div key={item} className="flex items-center gap-3">
            {pos > 0 && <span className="text-2xl font-black text-sky-400">›</span>}
            <button
              type="button"
              draggable={!done}
              onDragStart={(e) => {
                // Firefox chỉ bắt đầu kéo khi có dữ liệu kéo.
                e.dataTransfer.setData('text/plain', String(pos));
                setDragFrom(pos);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragFrom !== null && !done) move(dragFrom, pos);
                setDragFrom(null);
                setPicked(null);
              }}
              onClick={() => tap(pos)}
              disabled={done}
              className={`${tileClass(done ? (item === pos ? 'correct' : 'wrong') : picked === pos ? 'active' : 'idle')} min-h-16 min-w-20 cursor-grab active:cursor-grabbing`}
            >
              <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
                {pos + 1}
              </span>
              <TileContent tile={q.items[item]} />
            </button>
          </div>
        ))}
      </div>
      {done && order.some((v, i) => v !== i) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-bold text-lime-700">
          <span>Thứ tự đúng:</span>
          {q.items.map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>›</span>}
              <span className="rounded-xl bg-lime-50 px-2 py-1 text-base ring-2 ring-lime-300">
                <TileContent tile={t} />
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
