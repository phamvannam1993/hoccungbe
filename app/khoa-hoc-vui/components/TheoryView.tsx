'use client';

import { useState } from 'react';
import type { Theory } from '../lib/types';
import { playSfx } from '../lib/sound';
import { clockFromEmoji, withClocks } from './Clock';
import Visual from './Visual';

type Props = {
  theory: Theory;
  title: string;
  emoji: string;
  questionCount: number;
  types: string[];
  onPractice: () => void;
};

/** Phần ĐỌC của bài học: khái niệm → ví dụ trực quan → các bước làm → mẹo ghi nhớ. */
export default function TheoryView({ theory, title, emoji, questionCount, types, onPractice }: Props) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-[#333] sm:text-base">
      <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
        {emoji} {title}
      </h2>

      <Section icon="💡" title="Khái niệm" tone="bg-[#e6f6fb] ring-[#bfe6f2]" titleTone="text-[#1d9bbd]">
        <p className="whitespace-pre-line font-semibold text-slate-800">{withClocks(theory.concept, 28)}</p>
      </Section>

      <Section icon="👀" title={theory.examples.length > 1 ? 'Ví dụ trực quan' : 'Ví dụ'} tone="bg-[#f3f0ff] ring-[#ddd3ff]" titleTone="text-[#7c5ce0]">
        <div className="space-y-3">
          {theory.examples.map((ex, i) => (
            <Example key={i} index={theory.examples.length > 1 ? i + 1 : 0} {...ex} />
          ))}
        </div>
      </Section>

      <Section icon="🪜" title="Các bước làm" tone="bg-[#ecfaef] ring-[#c8eecf]" titleTone="text-[#2f9e47]">
        <ol className="space-y-2">
          {theory.steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#43c35e] text-sm font-black text-white shadow-[0_2px_0_#2f9e47]">
                {i + 1}
              </span>
              <span className="pt-0.5">{withClocks(s, 26)}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon="🧠" title="Mẹo ghi nhớ" tone="bg-[#fff6e0] ring-[#ffe2a3]" titleTone="text-[#e19a21]">
        <ul className="space-y-2">
          {theory.tips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-white/80 px-3 py-2 font-semibold text-slate-800 shadow-[0_2px_0_#ffe2a3]">
              <span>⭐</span>
              <span>{withClocks(t, 26)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center ring-1 ring-[#e5e5e5] sm:flex-row sm:text-left">
        <div className="flex-1">
          <p className="font-bold text-slate-800">Bài luyện tập có {questionCount} câu</p>
          <div className="mt-1 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {types.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                {t}
              </span>
            ))}
          </div>
        </div>
        <button type="button" onClick={onPractice} className="khv-btn-buy shrink-0 px-6">
          Luyện tập ngay ▶
        </button>
      </div>
    </div>
  );
}

function Section({ icon, title, tone, titleTone, children }: { icon: string; title: string; tone: string; titleTone: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-2xl p-4 ring-1 ${tone}`}>
      <h3 className={`mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider ${titleTone}`}>
        <span className="text-xl">{icon}</span> {title}
      </h3>
      {children}
    </section>
  );
}

function Example({ index, prompt, visual, answer }: Theory['examples'][number] & { index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-white p-3 shadow-[0_2px_0_#ddd3ff]">
      <p className="whitespace-pre-line font-bold text-slate-800">
        {index > 0 && <span className="mr-1 text-[#7c5ce0]">Ví dụ {index}:</span>}
        {withClocks(prompt, 28)}
      </p>
      {visual && <Visual visual={visual} compact />}
      {open ? (
        <p className="mt-3 whitespace-pre-line rounded-lg bg-[#ecfaef] px-3 py-2 text-slate-800">
          <b className="text-[#2f9e47]">Lời giải: </b>
          {withClocks(answer, 26)}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            playSfx('tap');
            setOpen(true);
          }}
          className="mt-3 rounded-full bg-[#7c5ce0] px-4 py-1.5 text-sm font-bold text-white shadow-[0_3px_0_#5b3fc0]"
        >
          👉 Bé nghĩ xong rồi, xem lời giải
        </button>
      )}
    </div>
  );
}

/** Chuỗi để nút NGHE đọc to phần lý thuyết. */
export function theorySpeech(theory: Theory, title: string) {
  return [
    `${title}.`,
    theory.concept,
    'Các bước làm.',
    ...theory.steps.map((s, i) => `Bước ${i + 1}: ${s}`),
    'Mẹo ghi nhớ.',
    ...theory.tips,
  ]
    .join(' ')
    // Emoji đồng hồ đọc thành giờ, các emoji khác bỏ đi.
    .replace(/[\u{1F550}-\u{1F567}]/gu, (ch) => {
      const t = clockFromEmoji(ch);
      return t ? ` ${t.hour} giờ${t.minute ? ` ${t.minute} phút` : ''} ` : '';
    })
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
}
