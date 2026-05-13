'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  storyOrderThemes,
  type StoryOrderQuestion,
  type StoryOrderTheme,
} from './data';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

const LOCAL_STORAGE_KEY = 'hoc-cung-be-story-order-scores';
const QUESTIONS_PER_GAME = 4;

type StoredScore = {
  themeKey: string;
  themeLabel: string;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = StoryOrderQuestion & {
  shuffledIndices: number[];
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPlayQuestions(theme: StoryOrderTheme, count: number): PlayQuestion[] {
  return shuffleArray(theme.questions)
    .slice(0, Math.min(count, theme.questions.length))
    .map((question) => {
      let shuffled = shuffleArray(question.steps.map((_, idx) => idx));
      // Tránh trường hợp xáo trộn ra đúng thứ tự
      if (shuffled.every((v, i) => v === i)) {
        shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
      }
      return { ...question, shuffledIndices: shuffled };
    });
}

function loadStoredScores(): StoredScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredScore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredScore(score: StoredScore) {
  if (typeof window === 'undefined') return;
  try {
    const current = loadStoredScores();
    const next = [score, ...current].slice(0, 12);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function playTone(frequency: number, duration = 0.18, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

function playPlaceSound() {
  playTone(660, 0.1, 'triangle');
}

function playCorrectSound() {
  playTone(660, 0.12, 'triangle');
  setTimeout(() => playTone(880, 0.18, 'triangle'), 120);
}

function playWrongSound() {
  playTone(220, 0.2, 'sawtooth');
}

function playFinishSound() {
  playTone(523, 0.12, 'triangle');
  setTimeout(() => playTone(659, 0.12, 'triangle'), 120);
  setTimeout(() => playTone(784, 0.2, 'triangle'), 240);
}

export default function StoryOrderGame() {
  const [selectedThemeKey, setSelectedThemeKey] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedOrder, setPlacedOrder] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrongFlashIdx, setWrongFlashIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const hasSavedRef = useRef(false);
  const skipAutoSpeakRef = useRef(false);

  const selectedTheme = useMemo(
    () => storyOrderThemes.find((theme) => theme.key === selectedThemeKey) ?? null,
    [selectedThemeKey]
  );
  const currentQuestion = questions[currentIndex];
  const isQuestionDone =
    currentQuestion && placedOrder.length === currentQuestion.steps.length;

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + (finished ? 1 : 0)) / questions.length) * 100);
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  useEffect(() => {
    if (!selectedTheme || !currentQuestion || finished) return;
    if (skipAutoSpeakRef.current) {
      skipAutoSpeakRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      speakText(
        `${currentQuestion.title}. ${currentQuestion.hint} Bé hãy chạm vào các hình theo đúng thứ tự từ trước đến sau.`,
        { lang: 'vi-VN', rate: 0.9, pitch: 1.08 }
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedTheme, currentQuestion, finished]);

  useEffect(() => {
    if (!finished || hasSavedRef.current || !selectedTheme) return;
    hasSavedRef.current = true;
    const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const entry: StoredScore = {
      themeKey: selectedTheme.key,
      themeLabel: selectedTheme.label,
      score,
      total: questions.length,
      accuracy,
      playedAt: new Date().toISOString(),
    };
    saveStoredScore(entry);
    setHistory((prev) => [entry, ...prev].slice(0, 12));
  }, [finished, score, questions.length, selectedTheme]);

  const startThemeGame = (theme: StoryOrderTheme) => {
    setSelectedThemeKey(theme.key);
    setQuestions(buildPlayQuestions(theme, QUESTIONS_PER_GAME));
    setCurrentIndex(0);
    setPlacedOrder([]);
    setMistakes(0);
    setWrongFlashIdx(null);
    setScore(0);
    setFinished(false);
    hasSavedRef.current = false;
  };

  const handleChooseStep = (stepIndex: number) => {
    if (!currentQuestion || isQuestionDone) return;
    if (placedOrder.includes(stepIndex)) return;

    const expected = placedOrder.length;
    if (stepIndex === expected) {
      const nextOrder = [...placedOrder, stepIndex];
      setPlacedOrder(nextOrder);
      playPlaceSound();
      stopSpeaking();
      speakText(currentQuestion.steps[stepIndex].label, {
        lang: 'vi-VN',
        rate: 0.95,
        pitch: 1.1,
      });

      if (nextOrder.length === currentQuestion.steps.length) {
        playCorrectSound();
        if (mistakes === 0) {
          setScore((prev) => prev + 1);
        }
        setTimeout(() => {
          stopSpeaking();
          speakText(
            mistakes === 0
              ? 'Tuyệt vời. Bé sắp xếp đúng hoàn toàn.'
              : 'Bé đã hoàn thành. Lần sau hãy thử lại nhé.',
            { lang: 'vi-VN', rate: 0.92, pitch: 1.12 }
          );
        }, 350);
      }
    } else {
      setMistakes((prev) => prev + 1);
      setWrongFlashIdx(stepIndex);
      playWrongSound();
      stopSpeaking();
      speakText('Chưa đúng. Bé thử lại nhé.', { lang: 'vi-VN', rate: 0.92, pitch: 1.0 });
      setTimeout(() => setWrongFlashIdx(null), 600);
    }
  };

  const handleNext = () => {
    if (!questions.length) return;
    stopSpeaking();
    if (currentIndex === questions.length - 1) {
      playFinishSound();
      if (selectedTheme) {
        speakText(
          `Bạn nhỏ đã hoàn thành chủ đề ${selectedTheme.label}. Điểm của bé là ${score} trên ${questions.length}.`,
          { lang: 'vi-VN', rate: 0.9, pitch: 1.05 }
        );
      }
      setFinished(true);
      return;
    }
    skipAutoSpeakRef.current = true;
    setCurrentIndex((prev) => prev + 1);
    setPlacedOrder([]);
    setMistakes(0);
    setWrongFlashIdx(null);
  };

  const handleResetCurrent = () => {
    setPlacedOrder([]);
    setWrongFlashIdx(null);
  };

  const handleRestartSameTheme = () => {
    if (!selectedTheme) return;
    stopSpeaking();
    startThemeGame(selectedTheme);
  };

  const handleBackToThemes = () => {
    stopSpeaking();
    setSelectedThemeKey(null);
    setQuestions([]);
    setCurrentIndex(0);
    setPlacedOrder([]);
    setMistakes(0);
    setScore(0);
    setFinished(false);
    hasSavedRef.current = false;
  };

  if (!selectedTheme) {
    return (
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-sm">
            Trò chơi tư duy thời gian
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Sắp xếp trước - sau
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé quan sát các hình ảnh rồi chạm vào chúng theo đúng thứ tự câu
            chuyện. Trò chơi giúp bé hiểu trình tự thời gian, quan hệ nguyên
            nhân - kết quả và phát triển tư duy logic.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {storyOrderThemes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => startThemeGame(theme)}
                className="group rounded-[30px] bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-300 via-pink-300 to-amber-300 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)] transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
                  <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100 text-4xl shadow-inner">
                    <span className="drop-shadow-[0_4px_8px_rgba(255,255,255,0.55)]">
                      {theme.icon}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                  {theme.label}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {theme.description}
                </p>

                <div className="mt-4 text-xs font-semibold text-slate-500">
                  {theme.questions.length} câu chuyện · Mỗi câu 4 bước
                </div>

                <div className="mt-5 inline-flex rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
                  Bắt đầu chủ đề
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[30px] bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Bé sẽ rèn được gì?
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  'Hiểu trình tự thời gian',
                  'Tư duy nguyên nhân - kết quả',
                  'Quan sát chi tiết hình ảnh',
                  'Kể chuyện theo trình tự',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white px-4 py-4 text-sm font-medium leading-7 text-slate-700 ring-1 ring-slate-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-violet-50 p-6 shadow-sm ring-1 ring-violet-100">
              <h3 className="text-2xl font-black tracking-tight text-violet-950">
                Kết quả gần đây
              </h3>
              <div className="mt-5 space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-violet-100">
                    Chưa có lượt chơi nào được lưu. Hãy chọn một chủ đề để bắt đầu.
                  </div>
                ) : (
                  history.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-violet-100"
                    >
                      <div className="font-bold text-slate-900">{item.themeLabel}</div>
                      <div>
                        Điểm: {item.score}/{item.total} · Chính xác: {item.accuracy}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <section className="mx-auto max-w-5xl px-3 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 via-pink-300 to-amber-300 p-[3px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                🎉
              </div>
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              Hoàn thành chủ đề
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bạn nhỏ đã hoàn thành chủ đề {selectedTheme.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Mỗi câu sắp xếp đúng ngay lần đầu sẽ được tính 1 điểm.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-sky-700">Điểm số</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {score}/{questions.length}
                </p>
              </div>
              <div className="rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-100">
                <p className="text-sm font-semibold text-violet-700">Độ chính xác</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{accuracy}%</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <p className="text-sm font-semibold text-emerald-700">Đánh giá</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {accuracy >= 90 ? 'Rất tốt' : accuracy >= 60 ? 'Tốt' : 'Cố gắng thêm'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRestartSameTheme}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-100 transition duration-300 hover:-translate-y-0.5 hover:from-violet-600 hover:to-pink-600 hover:shadow-xl"
              >
                Chơi lại chủ đề này
              </button>
              <button
                onClick={handleBackToThemes}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md"
              >
                Chọn chủ đề khác
              </button>
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md"
              >
                Về kho trò chơi
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentQuestion) return null;

  const nextExpectedIdx = placedOrder.length;

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
              5-8 tuổi
            </span>
            <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
              {selectedTheme.label}
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
              Câu {currentIndex + 1}/{questions.length}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:mt-5 sm:text-4xl">
            {currentQuestion.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
            {currentQuestion.hint}
          </p>

          <div className="mt-5 rounded-[24px] bg-gradient-to-br from-violet-100 via-pink-50 to-amber-100 p-2 sm:mt-6 sm:rounded-[30px] sm:p-5">
            <div className="rounded-[20px] bg-white p-3 shadow-inner sm:rounded-[24px] sm:p-5">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                Thứ tự bé đã sắp xếp
              </p>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
                {currentQuestion.steps.map((_, slotIdx) => {
                  const placedStepIdx = placedOrder[slotIdx];
                  const isFilled = placedStepIdx !== undefined;
                  return (
                    <div
                      key={`slot-${slotIdx}`}
                      className={`relative flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed transition duration-300 sm:rounded-[20px] ${
                        isFilled
                          ? 'border-emerald-300 bg-emerald-50'
                          : slotIdx === nextExpectedIdx
                          ? 'border-violet-300 bg-violet-50/60'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <span className="absolute left-1.5 top-1 text-[10px] font-bold text-slate-400 sm:left-2 sm:top-1.5 sm:text-xs">
                        {slotIdx + 1}
                      </span>
                      {isFilled ? (
                        <span className="text-3xl drop-shadow-md sm:text-5xl">
                          {currentQuestion.steps[placedStepIdx].emoji}
                        </span>
                      ) : (
                        <span className="text-xl text-slate-300 sm:text-3xl">?</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${(placedOrder.length / currentQuestion.steps.length) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-5 text-xs font-semibold text-slate-500 sm:mt-6 sm:text-sm">
                Chọn theo thứ tự từ trước đến sau:
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {currentQuestion.shuffledIndices.map((stepIdx) => {
                  const step = currentQuestion.steps[stepIdx];
                  const isPlaced = placedOrder.includes(stepIdx);
                  const isWrong = wrongFlashIdx === stepIdx;

                  let cardClass =
                    'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:-translate-y-1';
                  if (isPlaced) {
                    cardClass = 'bg-emerald-50 text-emerald-700 ring-emerald-200 opacity-60';
                  } else if (isWrong) {
                    cardClass = 'bg-rose-50 text-rose-700 ring-rose-300 animate-pulse';
                  }

                  return (
                    <button
                      key={`step-${stepIdx}`}
                      onClick={() => handleChooseStep(stepIdx)}
                      disabled={isPlaced || isQuestionDone}
                      className={`relative flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 shadow-sm ring-2 transition duration-300 disabled:cursor-not-allowed sm:gap-2 sm:rounded-[24px] sm:px-3 sm:py-5 ${cardClass}`}
                    >
                      <span
                        role="button"
                        tabIndex={isPlaced || isQuestionDone ? -1 : 0}
                        aria-label={`Nghe ${step.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          stopSpeaking();
                          speakText(step.label, {
                            lang: 'vi-VN',
                            rate: 0.95,
                            pitch: 1.1,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            e.preventDefault();
                            stopSpeaking();
                            speakText(step.label, {
                              lang: 'vi-VN',
                              rate: 0.95,
                              pitch: 1.1,
                            });
                          }
                        }}
                        className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[11px] shadow-sm ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-200 sm:right-2 sm:top-2 sm:h-7 sm:w-7 sm:text-xs"
                      >
                        🔊
                      </span>
                      <span className="text-4xl drop-shadow-md sm:text-5xl">{step.emoji}</span>
                      <span className="text-[11px] font-bold leading-tight text-center text-slate-700 sm:text-xs">
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isQuestionDone && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold ${
                    mistakes === 0
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                  }`}
                >
                  {mistakes === 0
                    ? 'Tuyệt vời. Bé sắp xếp đúng hoàn toàn ngay lần đầu.'
                    : `Bé đã hoàn thành. Bé sai ${mistakes} lần - cố gắng thêm ở câu sau nhé.`}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleNext}
                  disabled={!isQuestionDone}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-100 transition duration-300 hover:-translate-y-0.5 hover:from-violet-600 hover:to-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>

                <button
                  onClick={handleResetCurrent}
                  disabled={placedOrder.length === 0 || isQuestionDone}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Làm lại câu này
                </button>

                <button
                  onClick={handleBackToThemes}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md"
                >
                  Đổi chủ đề
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Chủ đề đang chơi
            </h3>
            <div className="mt-5 flex items-center gap-4 rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-violet-300 via-pink-300 to-amber-300 text-3xl shadow-lg">
                {selectedTheme.icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">{selectedTheme.label}</p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  {selectedTheme.description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Tiến độ hiện tại
            </h3>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>Hoàn thành</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
                Điểm: <span className="font-bold text-slate-900">{score}</span> /{' '}
                {questions.length}
              </div>
              <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-700 ring-1 ring-amber-100">
                Sai trong câu này:{' '}
                <span className="font-bold text-amber-900">{mistakes}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-violet-50 p-6 shadow-sm ring-1 ring-violet-100">
            <h3 className="text-2xl font-black tracking-tight text-violet-950">
              Kết quả gần đây
            </h3>
            <div className="mt-5 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-violet-100">
                  Chưa có dữ liệu lưu gần đây.
                </div>
              ) : (
                history.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item.playedAt}-${index}`}
                    className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-violet-100"
                  >
                    <div className="font-bold text-slate-900">{item.themeLabel}</div>
                    <div>
                      Điểm: {item.score}/{item.total} · {item.accuracy}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
