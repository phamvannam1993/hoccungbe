'use client';

import { useState } from 'react';
import type { ChoiceQuestion as ChoiceQ, MultiChoiceQuestion } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { TileContent, tileClass, type QuestionProps } from './shared';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function ChoiceQuestion({ q, done, onChange }: QuestionProps<ChoiceQ | MultiChoiceQuestion>) {
  const [selected, setSelected] = useState<number[]>([]);
  const multi = q.type === 'multi_choice';
  const correctSet = multi ? q.answers : [q.answer];

  const toggle = (i: number) => {
    if (done) return;
    playSfx('tap');
    const next = multi ? (selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i]) : [i];
    setSelected(next);
    const correct = next.length === correctSet.length && next.every((x) => correctSet.includes(x));
    onChange({ complete: next.length > 0, correct });
  };

  const hasMedia = q.options.some((o) => o.emoji || o.image);
  const cols = q.options.length <= 2 ? 'grid-cols-2' : hasMedia ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="w-full">
      {multi && (
        <p className="mb-3 text-center text-sm font-semibold text-sky-700">Có thể chọn nhiều đáp án</p>
      )}
      <div className={`grid gap-3 ${cols}`}>
        {q.options.map((opt, i) => {
          const isSel = selected.includes(i);
          const isRight = correctSet.includes(i);
          const state = done ? (isRight ? 'correct' : isSel ? 'wrong' : 'muted') : isSel ? 'active' : 'idle';
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              disabled={done}
              className={`${tileClass(state)} flex min-h-16 items-center gap-3 ${hasMedia ? 'flex-col justify-center' : 'justify-start'}`}
            >
              {!hasMedia && (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-black ${
                    isSel || (done && isRight) ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {LETTERS[i]}
                </span>
              )}
              <TileContent tile={opt} />
              {multi && !done && (
                <span
                  className={`absolute right-2 top-2 h-5 w-5 rounded-md border-2 ${
                    isSel ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                  }`}
                >
                  {isSel && <span className="block text-center text-xs leading-4 text-white">✓</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
