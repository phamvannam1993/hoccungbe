'use client';

import { useMemo, useState } from 'react';
import type { FillBlankQuestion as FillQ } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { seededShuffle, tileClass, type QuestionProps } from './shared';
import { withClocks } from '../Clock';

type Segment = { text: string } | { blank: number; answer: string };

function parse(sentence: string): Segment[] {
  const out: Segment[] = [];
  let blank = 0;
  sentence.split(/(\[\[.*?\]\])/).forEach((part) => {
    const m = /^\[\[(.*)\]\]$/.exec(part);
    if (m) out.push({ blank: blank++, answer: m[1] });
    else if (part) out.push({ text: part });
  });
  return out;
}

export default function FillBlankQuestion({ q, done, onChange }: QuestionProps<FillQ>) {
  const segments = useMemo(() => parse(q.sentence), [q.sentence]);
  const answers = segments.flatMap((s) => ('blank' in s ? [s.answer] : []));
  const choiceOrder = useMemo(
    () =>
      seededShuffle(
        q.choices.map((_, i) => i),
        q.id,
      ),
    [q.choices, q.id],
  );
  // filled[b] = chỉ số thẻ trong q.choices đang nằm ở chỗ trống b
  const [filled, setFilled] = useState<(number | null)[]>(() => answers.map(() => null));

  const update = (next: (number | null)[]) => {
    setFilled(next);
    onChange({
      complete: next.every((x) => x !== null),
      correct: next.every((c, b) => c !== null && q.choices[c] === answers[b]),
    });
  };

  const put = (choice: number) => {
    if (done) return;
    const slot = filled.indexOf(null);
    if (slot === -1) return;
    playSfx('tap');
    update(filled.map((c, b) => (b === slot ? choice : c)));
  };

  const clear = (b: number) => {
    if (done || filled[b] === null) return;
    update(filled.map((c, i) => (i === b ? null : c)));
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <p className="text-center text-2xl font-bold leading-[3.2rem] text-slate-800">
        {segments.map((s, i) => {
          if ('text' in s) return <span key={i} className="whitespace-pre-wrap">{s.text}</span>;
          const c = filled[s.blank];
          const ok = c !== null && q.choices[c] === s.answer;
          return (
            <button
              key={i}
              type="button"
              onClick={() => clear(s.blank)}
              className={`mx-1 inline-flex h-12 min-w-20 items-center justify-center rounded-xl border-[3px] border-dashed px-3 align-middle text-2xl font-black ${
                done
                  ? ok
                    ? 'border-solid border-lime-500 bg-lime-50 text-lime-700'
                    : 'border-solid border-rose-400 bg-rose-50 text-rose-600'
                  : c !== null
                    ? 'border-solid border-sky-400 bg-sky-50 text-sky-800'
                    : 'border-slate-300 bg-white'
              }`}
            >
              {c !== null ? withClocks(q.choices[c], 40) : ' '}
              {done && !ok && <span className="ml-2 text-base text-lime-700">→ {s.answer}</span>}
            </button>
          );
        })}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {choiceOrder.map((ci) => {
          const used = filled.includes(ci);
          return (
            <button
              key={ci}
              type="button"
              onClick={() => !used && put(ci)}
              disabled={done || used}
              className={`${tileClass(used ? 'muted' : 'idle')} min-w-16 px-5`}
            >
              {withClocks(q.choices[ci], 44)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
