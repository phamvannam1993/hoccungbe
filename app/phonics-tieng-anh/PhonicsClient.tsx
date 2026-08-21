'use client';

import { useEffect, useState } from 'react';
import { PHONICS_GROUPS } from '../lib/phonics';
import { ENGLISH_ALPHABET } from '../lib/englishAlphabet';
import { speakEnThenVi, speakEnglish, soundOutWord, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

const LETTER_COLORS = [
  { card: 'border-pink-200 bg-pink-50', big: 'text-pink-600', chip: 'bg-pink-100 text-pink-700' },
  { card: 'border-sky-200 bg-sky-50', big: 'text-sky-600', chip: 'bg-sky-100 text-sky-700' },
  { card: 'border-amber-200 bg-amber-50', big: 'text-amber-600', chip: 'bg-amber-100 text-amber-700' },
  { card: 'border-emerald-200 bg-emerald-50', big: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-700' },
  { card: 'border-violet-200 bg-violet-50', big: 'text-violet-600', chip: 'bg-violet-100 text-violet-700' },
  { card: 'border-orange-200 bg-orange-50', big: 'text-orange-600', chip: 'bg-orange-100 text-orange-700' },
];

export default function PhonicsClient() {
  const [view, setView] = useState<'letters' | 'blend'>('letters');
  const [gi, setGi] = useState(0);
  const group = PHONICS_GROUPS[gi];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      {/* Chuyển chế độ: âm chữ cái ↔ ghép vần */}
      <div className="inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100">
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('letters'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'letters' ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🔤 Âm 26 chữ cái
        </button>
        <button
          type="button"
          onClick={() => { unlockAudio(); setView('blend'); }}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${view === 'blend' ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🧩 Ghép vần (CVC)
        </button>
      </div>

      {view === 'letters' ? (
        <>
          <div className="mt-3 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            Mỗi chữ cái có một <b>âm</b> riêng khi đọc. Bấm chữ để nghe <b>âm + từ mẫu</b> (ví dụ B → /b/ như trong “ball”).
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ENGLISH_ALPHABET.map((l, i) => {
              const c = LETTER_COLORS[i % LETTER_COLORS.length];
              return (
                <li key={l.upper} className={`flex flex-col gap-2 rounded-3xl border-2 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${c.card}`}>
                  <button
                    type="button"
                    onClick={() => { unlockAudio(); speakEnThenVi(l.word, l.vi); }}
                    className="flex flex-col items-center gap-1"
                    aria-label={`Nghe âm chữ ${l.upper} và từ ${l.word}`}
                  >
                    <span className={`text-5xl font-black leading-none ${c.big}`}>{l.upper}{l.lower}</span>
                    <span className={`mt-1 rounded-full px-2.5 py-0.5 text-xs font-black ${c.chip}`}>âm {l.sound}</span>
                    <span className="mt-1 text-3xl" aria-hidden>{l.emoji}</span>
                    <span className="font-black text-slate-800">{l.word}</span>
                    <span className="text-sm font-semibold text-emerald-600">{l.vi}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { unlockAudio(); speakEnglish(l.word); }}
                    className="mt-auto rounded-full bg-white/70 px-3 py-1 text-xs font-black text-violet-600 shadow-sm ring-1 ring-violet-100 transition hover:bg-white"
                  >
                    🔊 Nghe lại
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          {/* Chọn nhóm nguyên âm ngắn */}
          <div className="mt-4 flex flex-wrap gap-2">
            {PHONICS_GROUPS.map((g, i) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => { unlockAudio(); setGi(i); }}
                className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${i === gi ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'}`}
              >
                {g.emoji} {g.vowel.toUpperCase()} {g.sound}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
            {group.label} · {group.sound} — bấm từ để nghe, bấm 🐢 để nghe <b>đánh vần chậm</b> rồi đọc thường.
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {group.words.map((w) => (
              <li key={w.word} className="flex flex-col gap-3 rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <button
                  type="button"
                  onClick={() => { unlockAudio(); speakEnThenVi(w.word, w.vi); }}
                  className="flex flex-col items-center gap-1"
                  aria-label={`Nghe từ ${w.word}`}
                >
                  <span className="text-5xl" aria-hidden>{w.emoji}</span>
                  <span className="mt-1 flex gap-0.5 text-4xl font-black tracking-tight">
                    {w.letters.map((ch, i) => (
                      <span key={i} className={i === 1 ? 'text-pink-500' : 'text-slate-800'}>{ch}</span>
                    ))}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">{w.hint}</span>
                  <span className="text-sm font-bold text-emerald-600">{w.vi}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { unlockAudio(); soundOutWord(w.word); }}
                  className="mt-auto rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95"
                >
                  🐢 Đánh vần
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
