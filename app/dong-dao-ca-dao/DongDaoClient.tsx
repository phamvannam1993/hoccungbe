'use client';

import { useEffect, useState } from 'react';
import { DONG_DAO } from '../lib/dongDao';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function DongDaoClient() {
  const [bi, setBi] = useState(0);
  const bai = DONG_DAO[bi];

  useEffect(() => () => stopSpeaking(), []);

  const switchBai = (i: number) => { unlockAudio(); stopSpeaking(); setBi(i); };
  const readAll = () => { unlockAudio(); speakSequence(bai.lines.map((s) => ({ text: s, lang: 'vi' as const }))); };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {DONG_DAO.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => switchBai(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === bi ? 'border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
            }`}
          >
            {b.emoji} {b.title}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border-2 border-amber-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/25 text-2xl ring-1 ring-white/40" aria-hidden>{bai.emoji}</span>
            <div>
              <h2 className="text-xl font-black" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{bai.title}</h2>
              <p className="text-sm font-bold text-white/95">{bai.type}</p>
            </div>
          </div>
          <button type="button" onClick={readAll} className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-orange-700 shadow-md ring-1 ring-black/5 transition hover:brightness-105">
            🔊 Đọc cả bài
          </button>
        </div>

        <ol className="space-y-1 p-4">
          {bai.lines.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakText(s); }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-amber-50"
                aria-label={`Nghe câu: ${s}`}
              >
                <span className="flex-1 text-lg font-semibold leading-8 text-slate-800">{s}</span>
                <span className="shrink-0 text-amber-400" aria-hidden>🔊</span>
              </button>
            </li>
          ))}
        </ol>

        {bai.meaning && (
          <div className="mx-4 mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
            <span className="font-black kid-display">💡 Ý nghĩa: </span>{bai.meaning}
          </div>
        )}
      </div>
    </div>
  );
}
