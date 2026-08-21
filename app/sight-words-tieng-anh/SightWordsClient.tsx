'use client';

import { useEffect, useState } from 'react';
import { SIGHT_WORD_GROUPS } from '../lib/sightWords';
import { speakEnThenVi, speakEnglish, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

const COLORS = [
  'border-pink-200 bg-pink-50 text-pink-600',
  'border-sky-200 bg-sky-50 text-sky-600',
  'border-amber-200 bg-amber-50 text-amber-600',
  'border-emerald-200 bg-emerald-50 text-emerald-600',
  'border-violet-200 bg-violet-50 text-violet-600',
  'border-orange-200 bg-orange-50 text-orange-600',
];

export default function SightWordsClient() {
  const [gi, setGi] = useState(0);
  const group = SIGHT_WORD_GROUPS[gi];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {SIGHT_WORD_GROUPS.map((g, i) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => { unlockAudio(); setGi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === gi ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
            }`}
          >
            {g.emoji} {g.level}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-2">
        <span className="text-sm font-semibold text-emerald-700">{group.emoji} {group.note} — bấm từ để nghe, di chuột/chạm để xem nghĩa.</span>
        <button
          type="button"
          onClick={() => { unlockAudio(); speakEnglish(group.words.map((w) => w.en).join(', ')); }}
          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-emerald-600 shadow ring-1 ring-emerald-100"
        >
          🔊 Đọc cả nhóm
        </button>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {group.words.map((w, i) => (
          <li key={w.en}>
            <button
              type="button"
              onClick={() => { unlockAudio(); speakEnThenVi(w.en, w.vi); }}
              className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 px-3 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow ${COLORS[i % COLORS.length]}`}
              aria-label={`Nghe từ ${w.en}`}
            >
              <span className="text-2xl font-black">{w.en}</span>
              <span className="text-xs font-semibold text-slate-500">{w.vi}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
