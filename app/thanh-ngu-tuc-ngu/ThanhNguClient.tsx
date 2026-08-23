'use client';

import { useEffect, useState } from 'react';
import { THANH_NGU_GROUPS } from '../lib/thanhNgu';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function ThanhNguClient() {
  const [gi, setGi] = useState(0);
  const group = THANH_NGU_GROUPS[gi];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {THANH_NGU_GROUPS.map((g, i) => (
          <button
            key={g.slug}
            type="button"
            onClick={() => { unlockAudio(); stopSpeaking(); setGi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === gi ? 'border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
            }`}
          >
            {g.emoji} {g.title}
          </button>
        ))}
      </div>

      <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
        Bấm câu để nghe, bấm ▶️ để nghe cả nghĩa và ví dụ. Chủ đề: {group.title}.
      </p>

      <ul className="mt-5 space-y-3">
        {group.items.map((it) => (
          <li key={it.cau} className="rounded-3xl border-2 border-amber-100 bg-white p-5 shadow-sm">
            <button
              type="button"
              onClick={() => { unlockAudio(); speakText(it.cau); }}
              className="flex w-full items-center gap-2 text-left"
              aria-label={`Nghe câu ${it.cau}`}
            >
              <span className="text-lg font-black text-amber-700">“{it.cau}”</span>
              <span className="ml-auto shrink-0 text-amber-400" aria-hidden>🔊</span>
            </button>
            <p className="mt-2 leading-7 text-slate-700"><span className="font-black text-slate-900">Nghĩa: </span>{it.nghia}</p>
            <div className="mt-2 flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2">
              <span className="text-sm leading-6 text-slate-600"><span className="font-bold text-slate-700">Ví dụ: </span>{it.vd}</span>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakSequence([{ text: it.cau, lang: 'vi' }, { text: it.nghia, lang: 'vi' }, { text: it.vd, lang: 'vi' }]); }}
                className="ml-auto shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-amber-600 shadow-sm ring-1 ring-amber-100"
              >
                ▶️ Nghe
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
