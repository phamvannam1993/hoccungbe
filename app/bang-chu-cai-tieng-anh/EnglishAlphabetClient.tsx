'use client';

import { useEffect, useState } from 'react';
import { ENGLISH_ALPHABET } from '../lib/englishAlphabet';
import { speakEnglish, speakEnThenVi, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

const COLORS = [
  { card: 'border-pink-200 bg-pink-50', big: 'text-pink-600', chip: 'bg-pink-100 text-pink-700' },
  { card: 'border-sky-200 bg-sky-50', big: 'text-sky-600', chip: 'bg-sky-100 text-sky-700' },
  { card: 'border-amber-200 bg-amber-50', big: 'text-amber-600', chip: 'bg-amber-100 text-amber-700' },
  { card: 'border-emerald-200 bg-emerald-50', big: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-700' },
  { card: 'border-violet-200 bg-violet-50', big: 'text-violet-600', chip: 'bg-violet-100 text-violet-700' },
  { card: 'border-orange-200 bg-orange-50', big: 'text-orange-600', chip: 'bg-orange-100 text-orange-700' },
];

export default function EnglishAlphabetClient() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => () => stopSpeaking(), []);

  // Hát bảng chữ cái: đọc lần lượt A, B, C… bằng giọng Anh.
  const singAbc = () => {
    unlockAudio();
    const names = ENGLISH_ALPHABET.map((l) => l.upper).join(', ');
    speakEnglish(names);
  };

  return (
    <div className="mt-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500">🔊 Bấm chữ để nghe tên chữ · bấm từ để nghe Anh → Việt</span>
        <button
          type="button"
          onClick={singAbc}
          className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-2 text-sm font-black text-white shadow transition hover:brightness-105"
        >
          🎵 Hát bảng chữ cái
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ENGLISH_ALPHABET.map((l, i) => {
          const c = COLORS[i % COLORS.length];
          const on = active === l.upper;
          return (
            <li
              key={l.upper}
              className={`flex flex-col gap-3 rounded-3xl border-2 p-4 shadow-sm transition ${c.card} ${on ? 'ring-4 ring-offset-2 ring-pink-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { unlockAudio(); setActive(l.upper); speakEnglish(l.upper); }}
                  className={`text-5xl font-black leading-none transition hover:scale-110 active:scale-95 ${c.big}`}
                  aria-label={`Nghe tên chữ ${l.upper}`}
                  title="Nghe tên chữ"
                >
                  {l.upper}{l.lower}
                </button>
                <div className="text-right">
                  <div className={`rounded-full px-2.5 py-0.5 text-xs font-black ${c.chip}`}>tên: {l.name}</div>
                  <div className="mt-1 text-sm font-bold text-slate-400">âm {l.sound}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { unlockAudio(); setActive(l.upper); speakEnThenVi(l.word, l.vi); }}
                className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 text-left transition hover:bg-white active:scale-[0.98]"
                aria-label={`Nghe từ ${l.word}`}
                title="Nghe từ (Anh → Việt)"
              >
                <span className="text-3xl" aria-hidden>{l.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate font-black text-slate-800">{l.word}</span>
                  <span className="block truncate text-sm font-semibold text-slate-500">{l.vi}</span>
                </span>
                <span className="ml-auto text-sky-400" aria-hidden>🔊</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
