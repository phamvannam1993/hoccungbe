'use client';

import { useState } from 'react';
import type { MatrixData } from '../../../lib/play-api';

type Props = {
  data: MatrixData;
  onCorrect: () => void;
  onWrong: () => void;
};

export default function MatrixGame({ data, onCorrect, onWrong }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [er, ec] = data.emptyPos;

  const choose = (opt: string) => {
    if (result) return;
    setPicked(opt);
    if (opt === data.answer) {
      setResult('correct');
      setTimeout(onCorrect, 900);
    } else {
      setResult('wrong');
      setTimeout(() => { setPicked(null); setResult(null); onWrong(); }, 900);
    }
  };

  const gs = data.gridSize;
  const cellSize = gs === 2 ? 'h-32 w-32 text-5xl' : gs === 3 ? 'h-24 w-24 text-4xl' : 'h-20 w-20 text-3xl';

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Grid */}
      <div
        className="rounded-3xl bg-white p-4 shadow-xl ring-2 ring-amber-200"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${gs}, 1fr)`, gap: '10px' }}>
        {data.grid.map((row, r) =>
          row.map((cell, c) => {
            const isEmpty = r === er && c === ec;
            const showAnswer = isEmpty && result === 'correct';
            return (
              <div
                key={`${r}-${c}`}
                className={`${cellSize} flex items-center justify-center rounded-2xl font-bold transition-all ${
                  isEmpty
                    ? result === 'correct'
                      ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-105'
                      : 'bg-sky-50 ring-2 ring-sky-300 ring-dashed animate-pulse'
                    : 'bg-amber-50 ring-1 ring-amber-200'
                }`}>
                {isEmpty ? (showAnswer ? data.answer : '?') : cell}
              </div>
            );
          })
        )}
      </div>

      {/* Hint */}
      {data.hint && (
        <p className="text-center text-sm text-slate-500">{data.hint}</p>
      )}

      {/* Options */}
      <div>
        <p className="mb-3 text-center text-sm font-bold text-slate-600">Chọn đáp án:</p>
        <div className="flex gap-4">
          {data.options.map((opt) => {
            const isPicked = picked === opt;
            const isCorrect = result === 'correct' && isPicked;
            const isWrong = result === 'wrong' && isPicked;
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={!!result}
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-md transition-all active:scale-95 ${
                  isCorrect ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-110'
                  : isWrong ? 'bg-red-100 ring-2 ring-red-400 shake'
                  : isPicked ? 'bg-sky-100 ring-2 ring-sky-400'
                  : 'bg-white ring-1 ring-slate-200 hover:bg-amber-50 hover:ring-amber-300 hover:scale-105'
                }`}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl px-8 py-3 text-lg font-black ${result === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {result === 'correct' ? '🎉 Chính xác!' : '❌ Thử lại nhé!'}
        </div>
      )}
    </div>
  );
}
