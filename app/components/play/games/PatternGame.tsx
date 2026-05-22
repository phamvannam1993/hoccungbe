'use client';

import { useState } from 'react';
import type { PatternData } from '../../../lib/play-api';

type Props = { data: PatternData; onCorrect: () => void; onWrong: () => void };

export default function PatternGame({ data, onCorrect, onWrong }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

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

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Sequence */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {data.sequence.map((item, i) => {
          const isEmpty = i === data.emptyPos;
          const showAnswer = isEmpty && result === 'correct';
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-md transition-all ${
                isEmpty
                  ? result === 'correct'
                    ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-110'
                    : 'bg-sky-50 ring-2 ring-sky-400 ring-dashed animate-pulse'
                  : 'bg-white ring-1 ring-slate-200'
              }`}>
                {isEmpty ? (showAnswer ? data.answer : '?') : item}
              </div>
              {i < data.sequence.length - 1 && (
                <span className="text-slate-300">→</span>
              )}
            </div>
          );
        })}
      </div>

      {data.hint && <p className="text-center text-sm text-slate-500">{data.hint}</p>}

      {/* Options */}
      <div>
        <p className="mb-3 text-center text-sm font-bold text-slate-600">Số tiếp theo là?</p>
        <div className="flex gap-4">
          {data.options.map((opt) => {
            const isPicked = picked === opt;
            const isCorrect = result === 'correct' && isPicked;
            const isWrong = result === 'wrong' && isPicked;
            return (
              <button key={opt} onClick={() => choose(opt)} disabled={!!result}
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-md transition-all active:scale-95 ${
                  isCorrect ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-110'
                  : isWrong ? 'bg-red-100 ring-2 ring-red-400'
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
