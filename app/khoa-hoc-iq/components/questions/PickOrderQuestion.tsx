'use client';

import { useMemo, useState } from 'react';
import type { PickOrderQuestion as PickQ } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { seededShuffle, tileClass, type QuestionProps } from './shared';
import { withClocks } from '../Clock';

// ── Chấm phép tính ──
// Ngoài thứ tự đáp án, chấp nhận các cách viết TƯƠNG ĐƯƠNG: đổi chỗ các số trong phép cộng / phép nhân
// và đổi vế: "3 + 4 = 7" ≡ "4 + 3 = 7" ≡ "7 = 3 + 4"; "2 < 5" ≡ "5 > 2".
// Phép trừ / chia phải đúng như đáp án: đề "9 con cá, 1 con bơi đi" thì "9 − 8 = 1" không được tính.

const OPS: Record<string, string> = { '+': '+', '-': '−', '−': '−', '×': '×', x: '×', '*': '×', ':': ':', '÷': ':', '/': ':' };
const CMP = new Set(['=', '<', '>']);

/** Chuẩn hóa một vế: tổng chỉ có "+" hoặc tích chỉ có "×" thì sắp xếp các số; còn lại giữ nguyên. */
function canonSide(tokens: string[]): string {
  const norm = tokens.map((t, i) => (i % 2 === 1 ? (OPS[t] ?? t) : t.replace(/\s+/g, ' ').trim()));
  const ops = new Set(norm.filter((_, i) => i % 2 === 1));
  if (ops.size === 1 && (ops.has('+') || ops.has('×'))) {
    const op = [...ops][0];
    return norm
      .filter((_, i) => i % 2 === 0)
      .sort()
      .join(` ${op} `);
  }
  return norm.join(' ');
}

/** Dạng chuẩn của một đẳng thức / so sánh, hoặc null nếu dãy thẻ không phải dạng đó. */
export function canonicalStatement(cards: string[]): string | null {
  // Thẻ chứa cả phép tính như "4 × 8" được tách ra; thẻ số "1 000" giữ nguyên.
  const tokens = cards.flatMap((c) => (/^[\d\s.]+$/.test(c) ? [c] : c.trim().split(/\s+/)));
  const idx = tokens.findIndex((t) => CMP.has(t));
  if (idx <= 0 || idx === tokens.length - 1 || tokens.slice(idx + 1).some((t) => CMP.has(t))) return null;
  let l = canonSide(tokens.slice(0, idx));
  let r = canonSide(tokens.slice(idx + 1));
  let cmp = tokens[idx];
  if (cmp === '>') [l, r, cmp] = [r, l, '<'];
  if (cmp === '=' && l > r) [l, r] = [r, l];
  return `${l} ${cmp} ${r}`;
}

/** Đúng nếu khớp thứ tự đáp án, hoặc là cách viết tương đương của phép tính đáp án. */
export function grade(words: string[], items: string[]) {
  if (words.length !== items.length) return false;
  if (words.every((w, i) => w === items[i])) return true;
  const target = canonicalStatement(items);
  return target !== null && canonicalStatement(words) === target;
}

/** Chạm lần lượt các thẻ để ghép thành câu / phép tính; chạm thẻ đã chọn để trả lại. */
export default function PickOrderQuestion({ q, done, verdict, onChange }: QuestionProps<PickQ>) {
  const pool = useMemo(() => seededShuffle([...q.items, ...(q.distractors ?? [])], q.id), [q.items, q.distractors, q.id]);
  const [picked, setPicked] = useState<number[]>([]); // chỉ số trong pool

  const update = (next: number[]) => {
    playSfx('tap');
    setPicked(next);
    onChange({ complete: next.length === q.items.length, correct: grade(next.map((p) => pool[p]), q.items) });
  };

  const correct = verdict
    ? verdict === 'correct'
    : grade(
        picked.map((p) => pool[p]),
        q.items,
      );

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div
        className={`flex min-h-20 w-full flex-wrap items-center justify-center gap-2 rounded-3xl border-[3px] border-dashed p-3 ${
          done ? (correct ? 'border-lime-500 bg-lime-50' : 'border-rose-400 bg-rose-50') : 'border-sky-300 bg-sky-50/60'
        }`}
      >
        {picked.length === 0 && <span className="text-slate-400">Chạm các thẻ bên dưới theo đúng thứ tự…</span>}
        {picked.map((p, i) => (
          <button
            key={p}
            type="button"
            disabled={done}
            onClick={() => update(picked.filter((_, j) => j !== i))}
            className={`${tileClass('active')} min-w-14 px-4`}
          >
            {withClocks(pool[p], 44)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((word, p) => {
          const used = picked.includes(p);
          return (
            <button
              key={p}
              type="button"
              disabled={done || used || picked.length >= q.items.length}
              onClick={() => update([...picked, p])}
              className={`${tileClass(used ? 'muted' : 'idle')} min-w-14 px-4`}
            >
              {used ? ' ' : withClocks(word, 44)}
            </button>
          );
        })}
      </div>
      {done && !correct && <p className="text-center font-bold text-lime-700">Đáp án đúng: {q.items.join(' ')}</p>}
    </div>
  );
}
