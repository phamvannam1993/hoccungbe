'use client';

import { useEffect, useState } from 'react';
import { VON_TU_TOPICS } from '../lib/vonTu';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

const COLORS = [
  'border-pink-200 bg-pink-50',
  'border-sky-200 bg-sky-50',
  'border-amber-200 bg-amber-50',
  'border-emerald-200 bg-emerald-50',
  'border-violet-200 bg-violet-50',
  'border-orange-200 bg-orange-50',
];

export default function VonTuClient() {
  const [ti, setTi] = useState(0);
  const topic = VON_TU_TOPICS[ti];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {VON_TU_TOPICS.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setTi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === ti ? 'border-transparent bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300'
            }`}
          >
            {t.emoji} {t.title}
          </button>
        ))}
      </div>

      <p className="mt-3 rounded-2xl bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700">
        Bấm từ để nghe, bấm ▶️ để nghe cả câu ví dụ. Đọc nghĩa để hiểu và dùng từ đúng.
      </p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {topic.words.map((w, i) => (
          <li key={w.tu} className={`flex gap-3 rounded-3xl border-2 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow ${COLORS[i % COLORS.length]}`}>
            <button
              type="button"
              onClick={() => { unlockAudio(); speakText(w.tu); }}
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-4xl shadow-inner transition hover:scale-105"
              aria-label={`Nghe từ ${w.tu}`}
            >
              {w.emoji}
            </button>
            <div className="min-w-0 flex-1">
              <button type="button" onClick={() => { unlockAudio(); speakText(w.tu); }} className="text-left" aria-label={`Nghe từ ${w.tu}`}>
                <span className="text-lg font-black text-slate-900">{w.tu}</span>
                <span className="ml-1 text-sky-400" aria-hidden>🔊</span>
              </button>
              <p className="mt-0.5 text-sm leading-6 text-slate-600">{w.nghia}</p>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakSequence([{ text: w.tu, lang: 'vi' }, { text: w.vd, lang: 'vi' }]); }}
                className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-black text-fuchsia-600 shadow-sm ring-1 ring-fuchsia-100 transition hover:bg-white"
              >
                ▶️ Ví dụ: {w.vd}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
