'use client';

import { useEffect, useState } from 'react';
import { GRADES, TINH_NHANH_BY_GRADE, type TinhNhanhQ } from '../lib/tinhNhanhNangCao';
import { speakText, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';

// Chuyển ký hiệu toán sang lời để đọc khi câu không có *_speech.
function toSpeech(s: string): string {
  return s
    .replace(/\n/g, '. ')
    .replace(/\.\.\./g, ' và cứ như vậy ')
    .replace(/×/g, ' nhân ')
    .replace(/[:÷]/g, ' chia ')
    .replace(/[−-]/g, ' trừ ')
    .replace(/\+/g, ' cộng ')
    .replace(/=/g, ' bằng ')
    .replace(/\?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function TinhNhanhClient() {
  const [grade, setGrade] = useState(1);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const list: TinhNhanhQ[] = TINH_NHANH_BY_GRADE[grade] || [];
  const q = list[qi];
  const done = qi >= list.length;

  useEffect(() => () => stopSpeaking(), []);

  const switchGrade = (g: number) => { unlockAudio(); stopSpeaking(); setGrade(g); setQi(0); setPicked(null); setScore(0); };

  const choose = (oi: number) => {
    if (picked !== null || !q) return;
    unlockAudio();
    setPicked(oi);
    if (oi === q.correct_index) {
      setScore((s) => s + 1); playCorrect(); confetti('small');
      speakText(q.explanation_speech || toSpeech(q.explanation));
    } else {
      playWrong();
      speakText(q.explanation_speech || toSpeech(q.explanation));
    }
  };

  const nextQ = () => {
    if (qi + 1 >= list.length) { if (score >= list.length * 0.6) { playWin(); confetti('big'); } setQi(list.length); return; }
    setQi(qi + 1); setPicked(null);
  };
  const restart = () => { setQi(0); setPicked(null); setScore(0); };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-slate-700 kid-display">🧠 Tính nhanh có mẹo — chọn lớp:</span>
        {GRADES.map((g) => (
          <button key={g} type="button" onClick={() => switchGrade(g)} className={`h-9 w-14 rounded-full border-2 text-sm font-black transition ${grade === g ? 'border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'}`}>Lớp {g}</button>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border-2 border-violet-100 bg-white p-6 shadow-sm">
        {done ? (
          <div className="py-6 text-center">
            <p className="text-2xl font-black text-emerald-600 kid-display">Hoàn thành! Đúng {score}/{list.length} 🎉</p>
            <button type="button" onClick={restart} className="mt-4 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow">🔁 Làm lại</button>
          </div>
        ) : q ? (
          <>
            <div className="flex items-center justify-between text-sm font-black text-slate-500">
              <span>Câu {qi + 1}/{list.length} · Lớp {grade}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Đúng {score}</span>
            </div>
            <div className="mt-3 flex items-start justify-center gap-2">
              <p className="whitespace-pre-line text-center text-2xl font-black leading-9 text-slate-800 sm:text-3xl">{q.question}</p>
              <button type="button" onClick={() => { unlockAudio(); speakText(q.question_speech || toSpeech(q.question)); }} className="mt-1 shrink-0 text-violet-400" aria-label="Nghe đề">🔊</button>
            </div>

            <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3">
              {q.options.map((op, oi) => {
                const isCorrect = oi === q.correct_index;
                const isPicked = oi === picked;
                let cls = 'border-slate-200 bg-white text-slate-800 hover:border-violet-400 hover:bg-violet-50';
                if (picked !== null) {
                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-700';
                  else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-700';
                  else cls = 'border-slate-200 bg-white text-slate-400 opacity-60';
                }
                return (
                  <button key={oi} type="button" disabled={picked !== null} onClick={() => choose(oi)} className={`rounded-2xl border-2 py-3.5 text-xl font-black transition active:scale-95 ${cls}`}>
                    {op}{picked !== null && isCorrect && ' ✓'}{picked !== null && isPicked && !isCorrect && ' ✗'}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <>
                <div className={`mx-auto mt-4 max-w-lg rounded-2xl px-4 py-3 text-sm leading-7 ${picked === q.correct_index ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-black kid-display">{picked === q.correct_index ? '🎉 Đúng rồi! Mẹo:' : '💡 Mẹo tính:'}</span>
                    <button type="button" onClick={() => { unlockAudio(); speakText(q.explanation_speech || toSpeech(q.explanation)); }} className="text-amber-500" aria-label="Nghe giải thích">🔊</button>
                  </div>
                  {q.explanation}
                </div>
                <div className="mt-3 text-center">
                  <button type="button" onClick={nextQ} className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2 text-sm font-black text-white shadow">{qi + 1 >= list.length ? 'Xem kết quả' : 'Câu tiếp →'}</button>
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
