'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import type { ThiQ } from '../lib/thiTai';
import { capRun, pointsFor } from '../lib/sanChoi';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';

// Đồng hồ cho các handler (đặt ngoài component để lint không nhầm là gọi trong lúc render).
const nowMs = () => Date.now();

/**
 * Màn chơi 10 câu dùng chung cho Thử thách hôm nay và Phòng thi đấu: hỏi biệt danh (nếu
 * cần) → từng câu một, chấm điểm 10 + thưởng tốc độ → màn kết quả. Phần ghi điểm/thưởng do
 * `onFinish` của trang mẹ quyết định và trả về nội dung hiện dưới điểm số.
 */
export default function PlayModal({
  questions, emoji = '🎯', title, intro, needName, initialName, onSaveNick, onFinish, onClose, closeLabel = 'Về Sân chơi',
}: {
  questions: ThiQ[];
  emoji?: string;
  title: string;
  intro: ReactNode;
  needName: boolean;
  initialName: string;
  onSaveNick?: (n: string) => void;
  onFinish: (score: number, correct: number, timeSec: number, name: string) => ReactNode | Promise<ReactNode>;
  onClose: () => void;
  closeLabel?: string;
}) {
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [name, setName] = useState(initialName);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [gain, setGain] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [notes, setNotes] = useState<ReactNode>(null);
  const [saving, setSaving] = useState(false);
  const qStart = useRef(0);
  const runStart = useRef(0);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cur = questions[idx];
  const total = questions.length;

  // Khoá cuộn nền + Esc để đóng. Chỉ chạy lúc mở/đóng modal: trang mẹ re-render
  // (vd bảng điểm tự làm mới) không được huỷ hẹn giờ chuyển câu.
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => { if (phase === 'play') qStart.current = nowMs(); }, [phase, idx]);

  const start = () => {
    const n = name.trim();
    if (needName) { if (!n) return; onSaveNick?.(n); }
    scoreRef.current = 0; correctRef.current = 0;
    setScore(0); setCorrect(0); setIdx(0); setPicked(null); setGain(0); setNotes(null);
    runStart.current = nowMs();
    setPhase('play');
  };

  const finish = async () => {
    const timeSec = Math.round((nowMs() - runStart.current) / 1000);
    setPhase('result');
    playWin();
    confetti('big');
    setSaving(true);
    try {
      setNotes(await onFinish(scoreRef.current, correctRef.current, timeSec, name.trim()));
    } finally {
      setSaving(false);
    }
  };

  const answer = (oi: number) => {
    if (picked !== null || !cur) return;
    setPicked(oi);
    const ok = oi === cur.correctIndex;
    if (ok) {
      const pts = pointsFor(nowMs() - qStart.current);
      scoreRef.current += pts; correctRef.current += 1;
      setScore(scoreRef.current); setCorrect(correctRef.current); setGain(pts);
      playCorrect(); confetti('small');
    } else {
      setGain(0);
      playWrong();
    }
    timer.current = setTimeout(() => {
      if (idx + 1 < total) { setIdx(idx + 1); setPicked(null); setGain(0); }
      else void finish();
    }, ok ? 900 : 1600);
  };

  const finalScore = capRun(score);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <style>{'@keyframes sc-shrink{from{width:100%}to{width:0}}'}</style>
      <div className="relative max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-5 sm:p-7"
        style={{ boxShadow: '0 8px 0 #c2410c, 0 24px 50px rgba(0,0,0,.3)' }}>
        <button type="button" onClick={onClose} aria-label="Đóng"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg font-black text-slate-500 hover:bg-slate-200">
          ✕
        </button>

        {phase === 'intro' && (
          <div className="text-center">
            <p className="text-5xl" aria-hidden>{emoji}</p>
            <h2 className="kid-display mt-2 text-2xl font-black text-slate-800">{title}</h2>
            <p className="mt-2 text-sm font-bold text-slate-600">
              10 câu đủ môn: Toán, Tiếng Việt, Tiếng Anh, Khám phá. Mỗi câu đúng <b>+10 điểm</b>, trả lời nhanh được thưởng thêm tới <b>+5</b>.
            </p>
            {intro}
            {needName && (
              <label className="mt-4 block text-left">
                <span className="text-sm font-black text-slate-700">Biệt danh của bé trên bảng điểm</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="Ví dụ: Bin siêu nhân"
                  className="mt-1 w-full rounded-2xl border-2 border-orange-200 px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-orange-400" />
              </label>
            )}
            <button type="button" onClick={start} disabled={needName && !name.trim()}
              className="kid-btn-3d mt-5 w-full text-lg"
              style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
              Bắt đầu ▶
            </button>
          </div>
        )}

        {phase === 'play' && cur && (
          <div>
            <div className="flex items-center justify-between pr-10 text-sm font-black">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">Câu {idx + 1}/{total}</span>
              <span className="text-amber-600">⭐ {score} điểm</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${(idx / total) * 100}%` }} />
            </div>
            {/* Thanh thưởng tốc độ: co dần trong 15 giây */}
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-amber-50" aria-hidden>
              <div key={idx} className="h-full bg-amber-300" style={{ animation: picked === null ? 'sc-shrink 15s linear forwards' : 'none' }} />
            </div>
            <p className="kid-display mt-5 min-h-[4rem] text-center text-xl font-black leading-snug text-slate-800 sm:text-2xl">{cur.prompt}</p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {cur.options.map((o, oi) => {
                const isRight = picked !== null && oi === cur.correctIndex;
                const isWrong = picked === oi && oi !== cur.correctIndex;
                return (
                  <button key={oi} type="button" onClick={() => answer(oi)} disabled={picked !== null}
                    className={`rounded-2xl border-2 px-4 py-3 text-left text-base font-black transition ${
                      isRight ? 'border-green-500 bg-green-50 text-green-700' : isWrong ? 'kid-shake border-red-400 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50'
                    }`}
                    style={{ boxShadow: isRight ? '0 3px 0 #16a34a' : isWrong ? '0 3px 0 #ef4444' : '0 3px 0 #e2e8f0' }}>
                    <span className="mr-2 text-slate-400">{'ABCD'[oi]}.</span>{o}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 h-6 text-center text-sm font-black" aria-live="polite">
              {picked !== null && (picked === cur.correctIndex
                ? <span className="text-green-600">🎉 Đúng rồi! +{gain} điểm</span>
                : <span className="text-red-500">Chưa đúng — đáp án là “{cur.options[cur.correctIndex]}”</span>)}
            </p>
          </div>
        )}

        {phase === 'result' && (
          <div className="text-center">
            <Image src="/assets/images/05-trophy-cup.webp" alt="" width={284} height={254} aria-hidden className="mx-auto w-28" />
            <h2 className="kid-display mt-1 text-2xl font-black text-slate-800">
              {correct >= 9 ? 'Xuất sắc!' : correct >= 6 ? 'Giỏi lắm!' : 'Cố lên nào!'}
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Bé trả lời đúng {correct}/{total} câu</p>
            <p className="kid-display mt-3 text-5xl font-black text-violet-600">{finalScore}<span className="ml-1 text-xl">điểm</span></p>
            <div aria-live="polite">
              {saving
                ? <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500">Đang lưu điểm…</p>
                : notes}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={start} disabled={saving} className="kid-btn-3d w-full"
                style={{ background: 'linear-gradient(180deg,#A78BFA,#7C3AED)', boxShadow: '0 4px 0 #5B21B6' }}>
                Chơi lại
              </button>
              <button type="button" onClick={onClose} className="kid-btn-3d w-full"
                style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
                {closeLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
