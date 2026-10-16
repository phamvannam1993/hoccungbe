'use client';

import { useState } from 'react';
import type { InputQuestion as InputQ } from '../../lib/types';
import type { QuestionProps } from './shared';

// NFC: bàn phím gõ dấu kiểu tổ hợp (vd Unikey "Unicode tổ hợp") tạo ký tự tách rời → gộp lại trước khi so.
const normalize = (s: string) => s.normalize('NFC').toLowerCase().replace(/[\s.,]/g, '').trim();

export default function InputQuestion({ q, done, verdict, onChange }: QuestionProps<InputQ>) {
  const [value, setValue] = useState('');
  const numeric = q.answers.every((a) => /^[\d\s.,]+$/.test(a));
  // Sau khi chấm, tô theo kết quả thật: hết giờ thì không tính đúng dù ô đang có đáp án đúng.
  const correct = verdict ? verdict === 'correct' : q.answers.some((a) => normalize(a) === normalize(value));

  const update = (v: string) => {
    setValue(v);
    onChange({ complete: v.trim().length > 0, correct: q.answers.some((a) => normalize(a) === normalize(v)) });
  };

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'C'];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => update(e.target.value)}
          disabled={done}
          inputMode={numeric ? 'numeric' : 'text'}
          placeholder="?"
          aria-label="Nhập đáp án"
          className={`h-16 w-44 rounded-2xl border-[3px] bg-white text-center text-3xl font-black outline-none transition ${
            done
              ? correct
                ? 'border-lime-500 bg-lime-50 text-lime-700'
                : 'border-rose-400 bg-rose-50 text-rose-600 line-through'
              : 'border-sky-300 text-slate-800 focus:border-sky-500 focus:shadow-[0_3px_0_#339bde]'
          }`}
        />
        {q.unit && <span className="text-xl font-bold text-slate-600">{q.unit}</span>}
      </div>

      {done && !correct && (
        <p className="rounded-full bg-lime-100 px-4 py-1 text-lg font-bold text-lime-700">
          Đáp án đúng: {q.answers[0]} {q.unit}
        </p>
      )}

      {numeric && !done && (
        <div className="grid grid-cols-3 gap-2">
          {keypad.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => update(k === '⌫' ? value.slice(0, -1) : k === 'C' ? '' : value + k)}
              className="h-12 w-16 rounded-xl border-2 border-slate-200 bg-white text-xl font-black text-slate-700 shadow-[0_3px_0_#c6c6c7] active:translate-y-0.5 active:shadow-none"
            >
              {k}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
