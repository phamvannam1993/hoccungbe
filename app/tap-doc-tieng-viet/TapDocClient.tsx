'use client';

import { useEffect, useState } from 'react';
import { TAP_DOC } from '../lib/tapDoc';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, confetti } from '../lib/celebrate';

export default function TapDocClient() {
  const [bi, setBi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const bai = TAP_DOC[bi];

  useEffect(() => () => stopSpeaking(), []);

  const switchBai = (i: number) => { unlockAudio(); stopSpeaking(); setBi(i); setPicked(null); };
  const readAll = () => { unlockAudio(); speakSequence(bai.sentences.map((s) => ({ text: s, lang: 'vi' as const }))); };
  const answer = (oi: number) => {
    if (picked !== null) return;
    unlockAudio();
    setPicked(oi);
    if (oi === bai.question.correct) { playCorrect(); confetti('small'); }
    else playWrong();
  };

  return (
    <div className="mt-6">
      {/* Chọn bài */}
      <div className="flex flex-wrap gap-2">
        {TAP_DOC.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => switchBai(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === bi ? 'border-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'
            }`}
          >
            {b.emoji} {b.title}
          </button>
        ))}
      </div>

      {/* Bài đọc */}
      <div className="mt-4 overflow-hidden rounded-3xl border-2 border-sky-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-sky-500 to-indigo-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/25 text-2xl ring-1 ring-white/40" aria-hidden>{bai.emoji}</span>
            <div>
              <h2 className="text-xl font-black" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{bai.title}</h2>
              <p className="text-sm font-bold text-white/95">{bai.level}</p>
            </div>
          </div>
          <button type="button" onClick={readAll} className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-indigo-700 shadow-md ring-1 ring-black/5 transition hover:brightness-105">
            🔊 Đọc cả bài
          </button>
        </div>

        <ol className="space-y-1 p-4">
          {bai.sentences.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakText(s); }}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-sky-50"
                aria-label={`Nghe câu: ${s}`}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-black text-sky-600">{i + 1}</span>
                <span className="flex-1 text-lg font-semibold leading-8 text-slate-800">{s}</span>
                <span className="mt-1 shrink-0 text-sky-400" aria-hidden>🔊</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Câu hỏi đọc hiểu */}
      <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50/60 p-5">
        <h3 className="text-lg font-black text-slate-900 kid-display">📖 Đọc hiểu: {bai.question.q}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {bai.question.options.map((op, oi) => {
            const done = picked !== null;
            const isCorrect = oi === bai.question.correct;
            const isPicked = oi === picked;
            let cls = 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50';
            if (done) {
              if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-800';
              else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-800';
              else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
            }
            return (
              <button key={oi} type="button" disabled={done} onClick={() => answer(oi)} className={`rounded-2xl border-2 px-5 py-2 text-base font-black transition ${cls}`}>
                {op}
                {done && isCorrect && <span className="ml-1" aria-hidden>✓</span>}
                {done && isPicked && !isCorrect && <span className="ml-1" aria-hidden>✗</span>}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className={`mt-3 rounded-2xl px-3 py-2 text-sm font-semibold ${picked === bai.question.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
            <span className="font-black kid-display">{picked === bai.question.correct ? '🎉 Đúng rồi! ' : '💡 Chưa đúng. '}</span>
            {bai.question.explain}
          </div>
        )}
      </div>
    </div>
  );
}
