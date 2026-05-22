'use client';

import { useState } from 'react';
import type { ConnectData } from '../../../lib/play-api';

type Props = { data: ConnectData; onCorrect: () => void; onWrong: () => void };

export default function ConnectGame({ data, onCorrect, onWrong }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | null>(null);

  const correctMap = Object.fromEntries(data.pairs.map((p) => [p.left, p.right]));
  const allMatched = data.leftItems.every((l) => matched[l]);

  const pickRight = (right: string) => {
    if (!selectedLeft) return;
    if (correctMap[selectedLeft] === right) {
      const newMatched = { ...matched, [selectedLeft]: right };
      setMatched(newMatched);
      setSelectedLeft(null);
      if (data.leftItems.every((l) => newMatched[l])) {
        setTimeout(onCorrect, 600);
      }
    } else {
      setWrong(right);
      setTimeout(() => { setWrong(null); setSelectedLeft(null); onWrong(); }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-slate-500">{data.hint || 'Nối hình bên trái với hình phù hợp bên phải!'}</p>

      <div className="grid grid-cols-[1fr_48px_1fr] items-start gap-4 w-full max-w-sm">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {data.leftItems.map((left) => {
            const isMatched = !!matched[left];
            const isSelected = selectedLeft === left;
            return (
              <button key={left}
                disabled={isMatched}
                onClick={() => setSelectedLeft(left)}
                className={`flex h-16 items-center justify-center rounded-2xl text-3xl shadow-sm transition-all ${
                  isMatched ? 'bg-emerald-100 ring-2 ring-emerald-400'
                  : isSelected ? 'bg-sky-100 ring-2 ring-sky-400 scale-105'
                  : 'bg-white ring-1 ring-slate-200 hover:bg-amber-50 hover:scale-105'
                }`}>
                {left}
              </button>
            );
          })}
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-3">
          {data.leftItems.map((left) => (
            <div key={left} className={`h-16 flex items-center justify-center`}>
              {matched[left] && <div className="h-0.5 w-10 bg-emerald-400 rounded" />}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {data.rightItems.map((right) => {
            const isMatched = Object.values(matched).includes(right);
            const isWrongPick = wrong === right;
            return (
              <button key={right}
                disabled={isMatched || !selectedLeft}
                onClick={() => pickRight(right)}
                className={`flex h-16 items-center justify-center rounded-2xl text-3xl shadow-sm transition-all ${
                  isMatched ? 'bg-emerald-100 ring-2 ring-emerald-400'
                  : isWrongPick ? 'bg-red-100 ring-2 ring-red-400'
                  : selectedLeft ? 'bg-white ring-2 ring-amber-300 hover:bg-amber-50 hover:scale-105 cursor-pointer'
                  : 'bg-white ring-1 ring-slate-200 opacity-60'
                }`}>
                {right}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="rounded-2xl bg-emerald-100 px-8 py-3 text-lg font-black text-emerald-700">
          🎉 Xuất sắc! Nối đúng hết rồi!
        </div>
      )}
    </div>
  );
}
