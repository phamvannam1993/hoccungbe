'use client';

import { useEffect, useState } from 'react';
import { SENTENCE_PATTERNS } from '../lib/sentencePatterns';
import { speakEnThenVi, speakEnglish, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';

export default function SentenceClient() {
  const [pi, setPi] = useState(0);
  const p = SENTENCE_PATTERNS[pi];

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="mt-6">
      {/* Chọn mẫu câu */}
      <div className="flex flex-wrap gap-2">
        {SENTENCE_PATTERNS.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => { unlockAudio(); setPi(i); }}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === pi
                ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300'
            }`}
          >
            {s.emoji} {s.pattern}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-pink-50 px-4 py-2">
        <span className="text-sm font-semibold text-pink-700">{p.emoji} {p.desc} — bấm câu để nghe tiếng Anh rồi nghĩa tiếng Việt.</span>
        <button
          type="button"
          onClick={() => { unlockAudio(); speakEnglish(p.sentences.map((s) => s.en).join('. ')); }}
          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-black text-pink-600 shadow ring-1 ring-pink-100"
        >
          🔊 Nghe cả nhóm
        </button>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {p.sentences.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => { unlockAudio(); speakEnThenVi(s.en, s.vi); }}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-sky-200 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow active:scale-[0.99]"
              aria-label={`Nghe câu ${s.en}`}
            >
              <span className="text-3xl" aria-hidden>{s.emoji || '💬'}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-slate-800">{s.en}</span>
                <span className="block text-sm font-semibold text-slate-500">{s.vi}</span>
              </span>
              <span className="ml-auto text-sky-400" aria-hidden>🔊</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
