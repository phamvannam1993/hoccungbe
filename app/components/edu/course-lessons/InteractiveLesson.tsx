'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export type LessonBuddy = {
  name: string;
  emoji: string;
  message: string;
};

export type LessonMatchPair = {
  id: string;
  leftLabel: string;
  rightLabel: string;
  rightEmoji?: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export type InteractiveLessonData = {
  lessonKey: string;
  lessonNumber: string;
  title: string;
  description: string;
  focusLetterUpper?: string;
  focusLetterLower?: string;
  pronounceUpper?: string;
  pronounceLower?: string;
  examples: LessonExample[];
  quizQuestion: string;
  quizOptions: LessonQuizOption[];
  correctMessage: string;
  wrongMessage: string;
  rewardSticker: LessonSticker;
  nextLessonHref: string;
  tips: string[];

  buddy?: LessonBuddy;

  matchTitle?: string;
  matchInstruction?: string;
  matchPairs?: LessonMatchPair[];
  matchSuccessMessage?: string;
};

export type LessonExample = {
  letter: string;
  word: string;
  emoji: string;
};

export type LessonQuizOption = {
  id: string;
  label: string;
  emoji: string;
  correct: boolean;
};

export type LessonSticker = {
  id: string;
  name: string;
  emoji: string;
};

const STICKER_STORAGE_KEY = 'be-hoc-chu-stickers';
const COMPLETED_LESSONS_KEY = 'be-hoc-chu-completed-lessons';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="rounded-full bg-slate-100 p-1 ring-1 ring-slate-200">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function LearningBuddy({
  buddy,
}: {
  buddy: LessonBuddy;
}) {
  return (
    <div className="rounded-[32px] bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100 lg:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-3xl shadow-sm ring-1 ring-amber-100">
          {buddy.emoji}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber-700">
            Bạn đồng hành: {buddy.name}
          </p>
          <p className="mt-2 text-base leading-8 text-slate-700">
            {buddy.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function speakVietnamese(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

function MatchGame({
  title,
  instruction,
  pairs,
  successMessage = 'Bé ghép đúng rồi, giỏi quá!',
  onComplete,
}: {
  title: string;
  instruction: string;
  pairs: LessonMatchPair[];
  successMessage?: string;
  onComplete?: () => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);

  const [leftItems, setLeftItems] = useState<{ id: string; label: string }[]>([]);
  const [rightItems, setRightItems] = useState<
    { id: string; label: string; emoji?: string }[]
  >([]);

  const buildShuffledItems = () => {
    const nextLeftItems = shuffleArray(
      pairs.map((item) => ({
        id: item.id,
        label: item.leftLabel,
      }))
    );

    const nextRightItems = shuffleArray(
      pairs.map((item) => ({
        id: item.id,
        label: item.rightLabel,
        emoji: item.rightEmoji,
      }))
    );

    setLeftItems(nextLeftItems);
    setRightItems(nextRightItems);
  };

  useEffect(() => {
    buildShuffledItems();
  }, [pairs]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;

    if (selectedLeft === selectedRight) {
      if (!matchedIds.includes(selectedLeft)) {
        const nextMatched = [...matchedIds, selectedLeft];
        setMatchedIds(nextMatched);
        setFeedback('🎉 Ghép đúng rồi!');
        playTone('correct');

        const matchedPair = pairs.find((item) => item.id === selectedLeft);
        if (matchedPair) {
          speakVietnamese(`Giỏi quá. ${matchedPair.leftLabel} ghép với ${matchedPair.rightLabel}`);
        }

        if (nextMatched.length === pairs.length && !done) {
          setDone(true);
          setFeedback(successMessage);

          setTimeout(() => {
            speakVietnamese(successMessage);
          }, 350);

          onComplete?.();
        }
      }
    } else {
      setFeedback('😊 Chưa đúng đâu, mình thử lại nhé.');
      playTone('wrong');

      setTimeout(() => {
        speakVietnamese('Chưa đúng đâu, bé thử lại nhé');
      }, 120);
    }

    const timer = setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedLeft, selectedRight, matchedIds, pairs, successMessage, done, onComplete]);

  const handleReplay = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setFeedback('');
    setDone(false);
    buildShuffledItems();
    speakVietnamese('Mình cùng chơi lại nhé');
  };

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-base leading-8 text-slate-600">{instruction}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => speakVietnamese(instruction)}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5"
          >
            🔈 Nghe hướng dẫn
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
          >
            Chơi lại
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-sky-600">
            Chữ / từ
          </p>
          <div className="space-y-3">
            {leftItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = selectedLeft === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => {
                    setSelectedLeft(item.id);
                    playTone('select');
                    speakVietnamese(item.label);
                  }}
                  className={`w-full rounded-[24px] px-5 py-4 text-left text-lg font-black ring-1 transition duration-300 ${
                    isMatched
                      ? 'cursor-default bg-emerald-50 text-emerald-700 ring-emerald-100'
                      : isActive
                      ? 'bg-sky-50 text-sky-700 ring-sky-300'
                      : 'bg-slate-50 text-slate-900 ring-slate-100 hover:-translate-y-0.5 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-violet-600">
            Hình ảnh / đáp án
          </p>
          <div className="space-y-3">
            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = selectedRight === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isMatched}
                  onClick={() => {
                    setSelectedRight(item.id);
                    playTone('select');
                    speakVietnamese(item.label);
                  }}
                  className={`flex w-full items-center gap-3 rounded-[24px] px-5 py-4 text-left ring-1 transition duration-300 ${
                    isMatched
                      ? 'cursor-default bg-emerald-50 text-emerald-700 ring-emerald-100'
                      : isActive
                      ? 'bg-violet-50 text-violet-700 ring-violet-300'
                      : 'bg-slate-50 text-slate-900 ring-slate-100 hover:-translate-y-0.5 hover:bg-white'
                  }`}
                >
                  {item.emoji && <span className="text-3xl">{item.emoji}</span>}
                  <span className="text-lg font-black">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
          Đã ghép: {matchedIds.length}/{pairs.length}
        </div>

        {feedback && (
          <button
            type="button"
            onClick={() => speakVietnamese(feedback.replace(/[🎉😊]/g, '').trim())}
            className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100"
          >
            {feedback}
          </button>
        )}
      </div>
    </div>
  );
}

function SoundButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 ${
        isSpeaking
          ? 'bg-violet-500 shadow-violet-100'
          : 'bg-gradient-to-r from-sky-500 to-violet-500 shadow-sky-100'
      }`}
    >
      {isSpeaking ? '🔊 Đang đọc...' : `🔈 ${label}`}
    </button>
  );
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(type: 'correct' | 'wrong' | 'select') {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.type = 'sine';

  const now = ctx.currentTime;

  if (type === 'correct') {
    oscillator.frequency.setValueAtTime(700, now);
    oscillator.frequency.linearRampToValueAtTime(950, now + 0.18);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    oscillator.start(now);
    oscillator.stop(now + 0.28);
    return;
  }

  if (type === 'wrong') {
    oscillator.frequency.setValueAtTime(320, now);
    oscillator.frequency.linearRampToValueAtTime(220, now + 0.2);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
    return;
  }

  oscillator.frequency.setValueAtTime(520, now);
  oscillator.frequency.linearRampToValueAtTime(600, now + 0.08);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

function launchConfetti() {
  confetti({
    particleCount: 140,
    spread: 90,
    startVelocity: 35,
    origin: { y: 0.6 },
  });
}

function getStoredStickers(): LessonSticker[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STICKER_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as LessonSticker[];
  } catch {
    return [];
  }
}

function saveSticker(sticker: LessonSticker) {
  if (typeof window === 'undefined') return;

  const current = getStoredStickers();
  const existed = current.some((item) => item.id === sticker.id);
  if (existed) return;

  const next = [...current, sticker];
  window.localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(next));
}

function markLessonCompleted(lessonKey: string) {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem(COMPLETED_LESSONS_KEY);
  let current: string[] = [];

  try {
    current = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    current = [];
  }

  if (!current.includes(lessonKey)) {
    const next = [...current, lessonKey];
    window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(next));
  }
}

function hasLessonCompleted(lessonKey: string) {
  if (typeof window === 'undefined') return false;

  const raw = window.localStorage.getItem(COMPLETED_LESSONS_KEY);
  if (!raw) return false;

  try {
    const current = JSON.parse(raw) as string[];
    return current.includes(lessonKey);
  } catch {
    return false;
  }
}

function LetterHero({
  lessonNumber,
  title,
  description,
  upper,
  lower,
  pronounceUpper,
  pronounceLower,
}: {
  lessonNumber: string;
  title: string;
  description: string;
  upper?: string;
  lower?: string;
  pronounceUpper?: string;
  pronounceLower?: string;
}) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
        {lessonNumber}
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
        {description}
      </p>

      {(upper || lower) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {upper && (
            <div className="rounded-[28px] bg-sky-50 p-6 text-center ring-1 ring-sky-100">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-sky-700">
                Chữ hoa
              </p>
              <div className="mt-4 text-8xl font-black text-sky-700">{upper}</div>
              <div className="mt-5">
                <SoundButton
                  text={pronounceUpper || upper}
                  label={`Nghe chữ ${upper}`}
                />
              </div>
            </div>
          )}

          {lower && (
            <div className="rounded-[28px] bg-violet-50 p-6 text-center ring-1 ring-violet-100">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-violet-700">
                Chữ thường
              </p>
              <div className="mt-4 text-8xl font-black text-violet-700">{lower}</div>
              <div className="mt-5">
                <SoundButton
                  text={pronounceLower || lower}
                  label={`Nghe chữ ${lower}`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExampleCards({ examples }: { examples: LessonExample[] }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Ví dụ gần gũi với bé
      </h2>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {examples.map((item) => (
          <div
            key={`${item.letter}-${item.word}`}
            className="rounded-[28px] bg-slate-50 p-5 text-center ring-1 ring-slate-100"
          >
            <div className="text-5xl font-black text-sky-700">{item.letter}</div>
            <div className="mt-4 text-5xl">{item.emoji}</div>
            <p className="mt-3 text-lg font-black text-slate-900">{item.word}</p>
            <div className="mt-4">
              <SoundButton text={item.word} label={`Nghe từ ${item.word}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickerShelf({ stickers }: { stickers: LessonSticker[] }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Bộ sưu tập sticker
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Mỗi bài học hoàn thành, bé sẽ tích lũy thêm một sticker dễ thương.
          </p>
        </div>

        <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
          {stickers.length} sticker
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {stickers.length > 0 ? (
          stickers.map((sticker) => (
            <div
              key={sticker.id}
              className="rounded-[24px] bg-slate-50 p-4 text-center ring-1 ring-slate-100"
            >
              <div className="text-5xl">{sticker.emoji}</div>
              <p className="mt-2 text-sm font-bold text-slate-700">{sticker.name}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-[24px] bg-slate-50 p-5 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            Bé chưa có sticker nào. Hoàn thành bài đầu tiên để nhận quà nhé.
          </div>
        )}
      </div>
    </div>
  );
}

function RewardModal({
  open,
  onClose,
  nextLessonHref,
  rewardSticker,
}: {
  open: boolean;
  onClose: () => void;
  nextLessonHref: string;
  rewardSticker: LessonSticker;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl">
        <div className="text-6xl">⭐</div>
        <h3 className="mt-4 text-3xl font-black text-slate-900">Giỏi quá!</h3>
        <p className="mt-3 text-base leading-8 text-slate-600">
          Bé đã hoàn thành bài học và nhận được sticker mới.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
            Phần thưởng: {rewardSticker.name} {rewardSticker.emoji}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={nextLessonHref}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5"
          >
            Học tiếp bài sau →
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
          >
            Ở lại xem lại bài
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniQuiz({
  question,
  options,
  correctMessage,
  wrongMessage,
  onComplete,
}: {
  question: string;
  options: LessonQuizOption[];
  correctMessage: string;
  wrongMessage: string;
  onComplete: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const selectedOption = useMemo(
    () => options.find((item) => item.id === selectedId),
    [options, selectedId]
  );

  const handleCheck = () => {
    if (!selectedOption) return;

    const correct = selectedOption.correct;
    setIsCorrect(correct);

    if (correct) {
      playTone('correct');

      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    } else {
      playTone('wrong');
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setIsCorrect(null);
  };

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Bé thử chọn nhé
      </h2>

      <p className="mt-2 text-base leading-8 text-slate-600">{question}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {options.map((option) => {
          const active = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedId(option.id)}
              className={`rounded-[28px] p-5 text-center ring-1 transition duration-300 ${
                active
                  ? 'bg-sky-50 ring-sky-300'
                  : 'bg-slate-50 ring-slate-100 hover:-translate-y-0.5 hover:bg-white'
              }`}
            >
              <div className="text-5xl">{option.emoji}</div>
              <p className="mt-3 text-lg font-black text-slate-900">
                {option.label}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!selectedId}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kiểm tra
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          Chọn lại
        </button>
      </div>

      {isCorrect === true && (
        <div className="mt-5 rounded-[24px] bg-emerald-50 p-4 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
          🎉 {correctMessage}
        </div>
      )}

      {isCorrect === false && (
        <div className="mt-5 rounded-[24px] bg-amber-50 p-4 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
          😊 {wrongMessage}
        </div>
      )}
    </div>
  );
}

function LearningTips({ tips }: { tips: string[] }) {
  return (
    <div className="rounded-[32px] bg-sky-50 p-6 ring-1 ring-sky-100 lg:p-8">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Gợi ý học hiệu quả cho phụ huynh
      </h2>

      <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
        {tips.map((tip) => (
          <p key={tip}>{tip}</p>
        ))}
      </div>
    </div>
  );
}

export default function InteractiveLesson({
  data,
}: {
  data: InteractiveLessonData;
}) {
  const [progress, setProgress] = useState(25);
  const [showReward, setShowReward] = useState(false);
  const [stickers, setStickers] = useState<LessonSticker[]>([]);

  useEffect(() => {
    const storedStickers = getStoredStickers();
    setStickers(storedStickers);

    if (hasLessonCompleted(data.lessonKey)) {
      setProgress(100);
    }
  }, [data.lessonKey]);

  const handleQuizComplete = () => {
    markLessonCompleted(data.lessonKey);
    saveSticker(data.rewardSticker);
    setStickers(getStoredStickers());
    setProgress(100);
    launchConfetti();
    setShowReward(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Tiến độ bài học
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Bé đang học bài này
              </h2>
            </div>

            <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
              {progress}% hoàn thành
            </div>
          </div>

          <div className="mt-5">
            <ProgressBar value={progress} />
          </div>
        </div>

        {data.buddy && <LearningBuddy buddy={data.buddy} />}

        <LetterHero
          lessonNumber={data.lessonNumber}
          title={data.title}
          description={data.description}
          upper={data.focusLetterUpper}
          lower={data.focusLetterLower}
          pronounceUpper={data.pronounceUpper}
          pronounceLower={data.pronounceLower}
        />

        <ExampleCards examples={data.examples} />

        {data.matchPairs && data.matchPairs.length > 0 && (
          <MatchGame
            title={data.matchTitle || 'Bé ghép thử nhé'}
            instruction={
              data.matchInstruction || 'Bé hãy ghép chữ với hình phù hợp.'
            }
            pairs={data.matchPairs}
            successMessage={
              data.matchSuccessMessage || 'Bé hoàn thành trò chơi ghép cặp rồi!'
            }
          />
        )}

        <MiniQuiz
          question={data.quizQuestion}
          options={data.quizOptions}
          correctMessage={data.correctMessage}
          wrongMessage={data.wrongMessage}
          onComplete={handleQuizComplete}
        />

        <StickerShelf stickers={stickers} />

        <LearningTips tips={data.tips} />
      </div>

      <RewardModal
        open={showReward}
        onClose={() => setShowReward(false)}
        nextLessonHref={data.nextLessonHref}
        rewardSticker={data.rewardSticker}
      />
    </>
  );
}
