'use client';

import { useEffect, useMemo, useState } from 'react';
import { KHAM_PHA_TOPICS, type KhamPhaQ } from '../lib/khampha';
import { speakText, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';
import { shuffleQuiz } from '../lib/quizShuffle';

export default function KhamPhaClient() {
  const [topicIdx, setTopicIdx] = useState(0);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const topic = KHAM_PHA_TOPICS[topicIdx];
  const list: KhamPhaQ[] = topic.questions;
  const q = list[qi];
  const done = qi >= list.length;
  // Xáo vị trí đáp án theo nội dung câu hỏi (ổn định, phân bố đều A/B/C/D).
  const sq = q ? shuffleQuiz(q.options, q.correct_index, q.question) : { options: [] as string[], correctIndex: -1 };

  useEffect(() => () => stopSpeaking(), []);

  const switchTopic = (i: number) => {
    unlockAudio();
    stopSpeaking();
    setTopicIdx(i);
    setQi(0);
    setPicked(null);
    setScore(0);
  };

  const choose = (oi: number) => {
    if (picked !== null || !q) return;
    unlockAudio();
    setPicked(oi);
    if (oi === sq.correctIndex) {
      setScore((s) => s + 1);
      playCorrect();
      confetti('small');
    } else {
      playWrong();
    }
    speakText(q.explanation);
  };

  const nextQ = () => {
    if (qi + 1 >= list.length) {
      if (score >= list.length * 0.6) {
        playWin();
        confetti('big');
      }
      setQi(list.length);
      return;
    }
    setQi(qi + 1);
    setPicked(null);
  };

  const restart = () => {
    setQi(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <div className="mt-6">
      {/* Chọn chủ đề */}
      <div className="flex flex-wrap gap-2">
        {KHAM_PHA_TOPICS.map((t, i) => (
          <button
            key={t.slug}
            type="button"
            onClick={() => switchTopic(i)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-black transition ${
              topicIdx === i ? 'border-transparent bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border-2 border-sky-100 bg-white p-6 shadow-sm">
        {done ? (
          <div className="py-6 text-center">
            <p className="text-2xl font-black text-emerald-600 kid-display">Hoàn thành! Đúng {score}/{list.length} 🎉</p>
            <p className="mt-1 font-semibold text-slate-500">Bé vừa khám phá xong chủ đề “{topic.label}”.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={restart} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-black text-white shadow">🔁 Làm lại</button>
              {topicIdx + 1 < KHAM_PHA_TOPICS.length && (
                <button type="button" onClick={() => switchTopic(topicIdx + 1)} className="rounded-full border-2 border-sky-200 px-6 py-2.5 text-sm font-black text-sky-600">Chủ đề tiếp →</button>
              )}
            </div>
          </div>
        ) : q ? (
          <>
            <div className="flex items-center justify-between text-sm font-black text-slate-500">
              <span>Câu {qi + 1}/{list.length} · {topic.emoji} {topic.label}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Đúng {score}</span>
            </div>

            <div className="mt-3 flex items-start justify-center gap-2">
              <p className="text-center text-xl font-black leading-8 text-slate-800 sm:text-2xl">{q.question}</p>
              <button type="button" onClick={() => { unlockAudio(); speakText(q.question); }} className="mt-1 shrink-0 text-sky-400" aria-label="Nghe câu hỏi">🔊</button>
            </div>

            <div className="mx-auto mt-5 grid max-w-lg gap-3 sm:grid-cols-2">
              {sq.options.map((op, oi) => {
                const isCorrect = oi === sq.correctIndex;
                const isPicked = oi === picked;
                let cls = 'border-slate-200 bg-white text-slate-800 hover:border-sky-400 hover:bg-sky-50';
                if (picked !== null) {
                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-700';
                  else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-700';
                  else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
                }
                return (
                  <button key={oi} type="button" disabled={picked !== null} onClick={() => choose(oi)} className={`rounded-2xl border-2 px-4 py-3 text-base font-black transition active:scale-95 ${cls}`}>
                    {op}{picked !== null && isCorrect && ' ✓'}{picked !== null && isPicked && !isCorrect && ' ✗'}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <>
                <div className={`mx-auto mt-4 max-w-lg rounded-2xl px-4 py-3 text-sm leading-7 ${picked === q.correct_index ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-black kid-display">{picked === q.correct_index ? '🎉 Đúng rồi! Vì sao?' : '💡 Cùng khám phá:'}</span>
                    <button type="button" onClick={() => { unlockAudio(); speakText(q.explanation); }} className="text-amber-500" aria-label="Nghe giải thích">🔊</button>
                  </div>
                  {q.explanation}
                </div>
                <div className="mt-3 text-center">
                  <button type="button" onClick={nextQ} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2 text-sm font-black text-white shadow">{qi + 1 >= list.length ? 'Xem kết quả' : 'Câu tiếp →'}</button>
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
