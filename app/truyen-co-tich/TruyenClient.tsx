'use client';

import { useEffect, useMemo, useState } from 'react';
import { TRUYEN_CO_TICH } from '../lib/truyenCoTich';
import { speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, confetti } from '../lib/celebrate';

export default function TruyenClient() {
  const [ti, setTi] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const t = TRUYEN_CO_TICH[ti];

  useEffect(() => () => stopSpeaking(), []);

  const switchTruyen = (i: number) => { unlockAudio(); stopSpeaking(); setTi(i); setAnswers({}); };
  const readAll = () => { unlockAudio(); speakSequence(t.cau.map((c) => ({ text: c, lang: 'vi' as const }))); };

  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== undefined) return;
    unlockAudio();
    const q = t.cauHoi[qi];
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
    if (oi === q.correct) { playCorrect(); confetti('small'); } else playWrong();
  };
  const score = useMemo(() => t.cauHoi.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0), [answers, t]);

  return (
    <div className="mt-6">
      {/* Chọn truyện */}
      <div className="flex flex-wrap gap-2">
        {TRUYEN_CO_TICH.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            onClick={() => switchTruyen(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === ti ? 'border-transparent bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300'
            }`}
          >
            {x.emoji} {x.title}
          </button>
        ))}
      </div>

      {/* Truyện */}
      <div className="mt-4 overflow-hidden rounded-3xl border-2 border-amber-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500 to-pink-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/25 text-2xl ring-1 ring-white/40" aria-hidden>{t.emoji}</span>
            <h2 className="text-xl font-black" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{t.title}</h2>
          </div>
          <button type="button" onClick={readAll} className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-pink-700 shadow-md ring-1 ring-black/5 transition hover:brightness-105">
            🔊 Đọc cả truyện
          </button>
        </div>

        <ol className="space-y-1 p-4 sm:p-5">
          {t.cau.map((c, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => { unlockAudio(); speakText(c); }}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-amber-50"
                aria-label={`Nghe câu: ${c}`}
              >
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-black text-amber-600">{i + 1}</span>
                <span className="flex-1 text-lg font-medium leading-8 text-slate-800">{c}</span>
                <span className="mt-1 shrink-0 text-amber-400" aria-hidden>🔊</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mx-4 mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 sm:mx-5">
          <span className="font-black kid-display">💡 Bài học: </span>{t.baiHoc}
        </div>
      </div>

      {/* Câu hỏi đọc hiểu */}
      <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 kid-display">📖 Câu hỏi đọc hiểu</h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Đúng {score}/{t.cauHoi.length}</span>
        </div>
        <ul className="mt-3 space-y-3">
          {t.cauHoi.map((q, qi) => {
            const picked = answers[qi];
            const done = picked !== undefined;
            const right = done && picked === q.correct;
            return (
              <li key={qi} className="rounded-2xl border-2 border-slate-100 bg-white p-4">
                <p className="font-black text-slate-800">{qi + 1}. {q.q}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options.map((op, oi) => {
                    const isCorrect = oi === q.correct;
                    const isPicked = oi === picked;
                    let cls = 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50';
                    if (done) {
                      if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                      else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-800';
                      else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
                    }
                    return (
                      <button key={oi} type="button" disabled={done} onClick={() => choose(qi, oi)} className={`rounded-2xl border-2 px-4 py-2 text-sm font-black transition ${cls}`}>
                        {op}
                        {done && isCorrect && <span className="ml-1" aria-hidden>✓</span>}
                        {done && isPicked && !isCorrect && <span className="ml-1" aria-hidden>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {done && (
                  <div className={`mt-2 rounded-xl px-3 py-2 text-sm font-semibold ${right ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
                    <span className="font-black kid-display">{right ? '🎉 Đúng rồi! ' : '💡 '}</span>{q.explain}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
