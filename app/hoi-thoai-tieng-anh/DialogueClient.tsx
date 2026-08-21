'use client';

import { useEffect, useState } from 'react';
import { DIALOGUES } from '../lib/dialogues';
import { speakEnThenVi, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function DialogueClient() {
  const [di, setDi] = useState(0);
  const d = DIALOGUES[di];

  useEffect(() => () => stopSpeaking(), []);

  const playAll = () => {
    unlockAudio();
    // Phát cả hội thoại: mỗi lượt đọc tiếng Anh rồi nghĩa tiếng Việt.
    const seq = d.lines.flatMap((l) => [
      { text: l.en, lang: 'en' as const },
      { text: l.vi, lang: 'vi' as const },
    ]);
    speakSequence(seq);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {DIALOGUES.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setDi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === di ? 'border-transparent bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'
            }`}
          >
            {x.emoji} {x.title}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border-2 border-sky-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">{d.emoji} {d.title}</h2>
            <p className="text-sm font-semibold text-slate-400">{d.scene}</p>
          </div>
          <button
            type="button"
            onClick={playAll}
            className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-2 text-sm font-black text-white shadow transition hover:brightness-105"
          >
            ▶️ Nghe cả hội thoại
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {d.lines.map((l, i) => {
            const isA = l.who === 'A';
            return (
              <li key={i} className={`flex ${isA ? 'justify-start' : 'justify-end'}`}>
                <button
                  type="button"
                  onClick={() => { unlockAudio(); speakEnThenVi(l.en, l.vi); }}
                  className={`max-w-[85%] rounded-2xl border-2 px-4 py-2.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow ${
                    isA ? 'border-sky-200 bg-sky-50' : 'border-pink-200 bg-pink-50'
                  }`}
                  aria-label={`Nghe câu ${l.en}`}
                >
                  <span className={`text-xs font-black ${isA ? 'text-sky-600' : 'text-pink-600'}`}>{isA ? d.a : d.b} 🔊</span>
                  <span className="mt-0.5 block font-bold text-slate-800">{l.en}</span>
                  <span className="block text-sm font-semibold text-slate-500">{l.vi}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
