'use client';

import { useEffect, useState } from 'react';
import { SONGS } from '../lib/songs';
import { speakEnThenVi, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function SongClient() {
  const [si, setSi] = useState(0);
  const s = SONGS[si];

  useEffect(() => () => stopSpeaking(), []);

  const sing = () => {
    unlockAudio();
    // Hát cả bài: đọc lần lượt các dòng tiếng Anh.
    speakSequence(s.lines.map((l) => ({ text: l.en, lang: 'en' as const })));
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {SONGS.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setSi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === si ? 'border-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300'
            }`}
          >
            {x.emoji} {x.title}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border-2 border-fuchsia-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/25 text-2xl ring-1 ring-white/40" aria-hidden>{s.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{s.title}</h2>
              <p className="text-sm font-bold text-white/95" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{s.viTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={sing}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-fuchsia-700 shadow-md ring-1 ring-black/5 transition hover:brightness-105"
          >
            🎵 Hát cả bài
          </button>
        </div>

        <ul className="divide-y divide-slate-100">
          {s.lines.map((l, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakEnThenVi(l.en, l.vi); }}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-fuchsia-50"
                aria-label={`Nghe câu ${l.en}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fuchsia-100 text-xs font-black text-fuchsia-600">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-800">{l.en}</span>
                  <span className="block text-sm font-semibold text-slate-400">{l.vi}</span>
                </span>
                <span className="ml-auto text-fuchsia-400" aria-hidden>🔊</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
