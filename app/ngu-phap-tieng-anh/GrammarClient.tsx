'use client';

import { useEffect, useMemo, useState } from 'react';
import { GRAMMAR_TOPICS } from '../lib/grammar';
import { speakEnglish, speakEnThenVi, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, confetti } from '../lib/celebrate';

export default function GrammarClient() {
  const [ti, setTi] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const topic = GRAMMAR_TOPICS[ti];

  useEffect(() => () => stopSpeaking(), []);

  const switchTopic = (i: number) => { unlockAudio(); stopSpeaking(); setTi(i); setAnswers({}); };

  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== undefined) return;
    unlockAudio();
    const q = topic.questions[qi];
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
    if (oi === q.correct) { playCorrect(); confetti('small'); speakEnglish(q.en); }
    else { playWrong(); }
  };

  const score = useMemo(
    () => topic.questions.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0),
    [answers, topic],
  );
  const answered = Object.keys(answers).length;

  return (
    <div className="mt-6">
      {/* Chọn chủ điểm ngữ pháp */}
      <div className="flex flex-wrap gap-2">
        {GRAMMAR_TOPICS.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => switchTopic(i)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
              i === ti ? 'border-transparent bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
            }`}
          >
            {t.emoji} {t.title}
          </button>
        ))}
      </div>

      {/* Quy tắc + ví dụ */}
      <div className="mt-4 rounded-3xl border-2 border-emerald-100 bg-emerald-50/60 p-5">
        <h2 className="text-lg font-black text-slate-900 kid-display">📌 Quy tắc: {topic.title}</h2>
        <p className="mt-1 leading-7 text-slate-700">{topic.rule}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topic.examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { unlockAudio(); speakEnThenVi(ex.en, ex.vi); }}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-emerald-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
            >
              <span className="text-emerald-600">🔊</span> {ex.en}
              <span className="text-slate-400">— {ex.vi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Điểm */}
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100">
        <span className="text-sm font-black text-slate-700 kid-display">🎯 Chọn đáp án đúng để điền vào chỗ trống</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Đúng {score}/{topic.questions.length}</span>
      </div>

      {/* Câu hỏi */}
      <ul className="mt-4 space-y-3">
        {topic.questions.map((q, qi) => {
          const picked = answers[qi];
          const done = picked !== undefined;
          const right = done && picked === q.correct;
          return (
            <li key={qi} className="rounded-3xl border-2 border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-lg font-black text-slate-800">{qi + 1}. {q.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map((op, oi) => {
                  const isCorrect = oi === q.correct;
                  const isPicked = oi === picked;
                  let cls = 'border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50';
                  if (done) {
                    if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                    else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-800';
                    else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={done}
                      onClick={() => choose(qi, oi)}
                      className={`rounded-2xl border-2 px-5 py-2 text-base font-black transition ${cls}`}
                    >
                      {op}
                      {done && isCorrect && <span className="ml-1" aria-hidden>✓</span>}
                      {done && isPicked && !isCorrect && <span className="ml-1" aria-hidden>✗</span>}
                    </button>
                  );
                })}
              </div>
              {done && (
                <div className={`mt-3 flex items-start gap-2 rounded-2xl px-3 py-2 text-sm ${right ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
                  <span className="font-black kid-display">{right ? '🎉 Đúng rồi!' : '💡 Chưa đúng.'}</span>
                  <span className="flex-1">
                    <b>{q.en}</b> — {q.vi}. {q.explain}
                  </span>
                  <button type="button" onClick={() => { unlockAudio(); speakEnThenVi(q.en, q.vi); }} className="shrink-0 text-sky-500" aria-label="Nghe lại">🔊</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {answered === topic.questions.length && (
        <div className="mt-4 rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5 text-center">
          <p className="text-xl font-black text-emerald-700 kid-display">Hoàn thành! Đúng {score}/{topic.questions.length} 🎉</p>
          <button
            type="button"
            onClick={() => { setAnswers({}); stopSpeaking(); }}
            className="mt-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2 text-sm font-black text-white shadow"
          >
            🔁 Làm lại
          </button>
        </div>
      )}
    </div>
  );
}
