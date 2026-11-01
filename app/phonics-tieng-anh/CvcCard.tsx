'use client';

import { useEffect, useRef, useState } from 'react';
import { phonemes, wordIpa, type PhonicsWord } from '../lib/phonics';
import PhonicsPic from './PhonicsPic';
import { soundOutWord, speakEnglish, speakEnglishSlow, unlockAudio } from '../components/edu/utils/speech';

const STEP_MS = 650;

/**
 * Thẻ một từ CVC: hình, 3 chữ (nguyên âm hồng), IPA /sʌn/ và 3 nút Nghe từ / Nghe chậm / Đánh vần.
 * Đánh vần = sáng lần lượt từng âm /s/ → /ʌ/ → /n/ rồi gộp thành /sʌn/, đồng thời đọc từ thật chậm
 * rồi đọc thường. Giọng đọc máy không phát được một âm rời cho chuẩn (/t/ thành "tê"), nên âm rời
 * chỉ hiện bằng chữ IPA, còn tai nghe từ thật — tránh kiểu "sờ–â–nờ" thêm âm "ờ".
 */
export default function CvcCard({ w }: { w: PhonicsWord }) {
  const [step, setStep] = useState(-1); // -1: nghỉ · 0..2: đang sáng âm thứ i · 3: đã ghép
  const timers = useRef<number[]>([]);
  const ph = phonemes(w);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const spell = () => {
    unlockAudio();
    clear();
    setStep(0);
    soundOutWord(w.word);
    [1, 2, 3].forEach((s) => timers.current.push(window.setTimeout(() => setStep(s), s * STEP_MS)));
    timers.current.push(window.setTimeout(() => setStep(-1), 4 * STEP_MS + 2500));
  };

  const btn = 'flex-1 whitespace-nowrap rounded-full px-1.5 py-1.5 text-xs font-black shadow-sm transition active:scale-95';

  return (
    <li className="flex flex-col gap-2.5 rounded-3xl border-2 border-sky-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={() => { unlockAudio(); speakEnglish(w.word); }}
        className="flex flex-col items-center gap-1"
        aria-label={`Nghe từ ${w.word}`}
      >
        <span className="text-5xl" aria-hidden><PhonicsPic word={w.word} emoji={w.emoji} /></span>
        <span className="mt-1 flex gap-0.5 text-4xl font-black tracking-tight">
          {w.letters.map((ch, i) => (
            <span
              key={i}
              className={`rounded-lg px-0.5 transition ${i === 1 ? 'text-pink-500' : 'text-slate-800'} ${step === i ? 'scale-125 bg-amber-200' : ''}`}
            >
              {ch}
            </span>
          ))}
        </span>
        <span className="text-sm font-bold text-emerald-600">{w.vi}</span>
      </button>

      {/* Các âm tiếng Anh /s/ – /ʌ/ – /n/ → /sʌn/ */}
      <div className="flex flex-wrap items-center justify-center gap-1 text-sm font-black">
        {ph.map((p, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className={`rounded-md px-1.5 py-0.5 transition ${step === i ? 'bg-amber-400 text-white' : i === 1 ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-600'}`}
            >
              /{p}/
            </span>
            {i < 2 && <span className="text-slate-300">–</span>}
          </span>
        ))}
        <span className="text-slate-300">→</span>
        <span className={`rounded-md px-1.5 py-0.5 transition ${step === 3 ? 'bg-emerald-500 text-white' : 'bg-sky-50 text-sky-700'}`}>{wordIpa(w)}</span>
      </div>

      <div className="mt-auto flex gap-1.5">
        <button type="button" onClick={() => { unlockAudio(); speakEnglish(w.word); }} className={`${btn} bg-sky-500 text-white`}>
          🔊 Nghe từ
        </button>
        <button type="button" onClick={() => { unlockAudio(); speakEnglishSlow(w.word); }} className={`${btn} bg-amber-400 text-white`}>
          🐢 Nghe chậm
        </button>
      </div>
      <button type="button" onClick={spell} className={`${btn} bg-gradient-to-r from-pink-500 to-orange-400 py-2 text-sm text-white`}>
        🔡 Đánh vần {ph.map((p) => `/${p}/`).join(' ')}
      </button>
      <p className="text-center text-[11px] font-semibold text-slate-400" title="Gợi ý kiểu Việt cho phụ huynh — không phải phiên âm chuẩn">
        Gợi ý cho ba mẹ: {w.hint}
      </p>
    </li>
  );
}
