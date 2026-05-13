'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  whereBelongsPlaces,
  whereBelongsThemes,
  type WhereBelongsPlaceKey,
  type WhereBelongsQuestion,
  type WhereBelongsTheme,
} from './data';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

const LOCAL_STORAGE_KEY = 'hoc-cung-be-where-belongs-scores';
const QUESTIONS_PER_GAME = 6;

type StoredScore = {
  themeKey: string;
  themeLabel: string;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = WhereBelongsQuestion & {
  shuffledPlaces: WhereBelongsPlaceKey[];
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPlayQuestions(theme: WhereBelongsTheme, count: number): PlayQuestion[] {
  return shuffleArray(theme.questions)
    .slice(0, Math.min(count, theme.questions.length))
    .map((question) => ({
      ...question,
      shuffledPlaces: shuffleArray(theme.places),
    }));
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

export default function WhereBelongsGame() {
  const [selectedThemeKey, setSelectedThemeKey] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<WhereBelongsPlaceKey | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const hasSavedRef = useRef(false);
  const skipAutoSpeakRef = useRef(false);

  const selectedTheme = useMemo(
    () => whereBelongsThemes.find((theme) => theme.key === selectedThemeKey) ?? null,
    [selectedThemeKey]
  );
  const currentQuestion = questions[currentIndex];

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
        `${currentQuestion.itemLabel} thuộc về nơi nào? Bé hãy chọn đúng địa điểm nhé.`,
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

  const startThemeGame = (theme: WhereBelongsTheme) => {
    setSelectedThemeKey(theme.key);
    setQuestions(buildPlayQuestions(theme, QUESTIONS_PER_GAME));
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    hasSavedRef.current = false;
  };

  const handleChoose = (placeKey: WhereBelongsPlaceKey) => {
    if (showResult || !currentQuestion) return;
    setSelected(placeKey);
    setShowResult(true);
    stopSpeaking();

    if (placeKey === currentQuestion.correctPlace) {
      setScore((prev) => prev + 1);
      playCorrectSound();
      speakText('Giỏi lắm. Bé chọn đúng rồi.', { lang: 'vi-VN', rate: 0.92, pitch: 1.12 });
    } else {
      playWrongSound();
      const correctLabel = whereBelongsPlaces[currentQuestion.correctPlace].label;
      speakText(`Chưa đúng nhé. Đáp án đúng là ${correctLabel}.`, {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.02,
      });
    }
  };

  const handleNext = () => {
    if (!questions.length) return;
    stopSpeaking();
    if (currentIndex === questions.length - 1) {
      playFinishSound();
      if (selectedTheme) {
        speakText(
          `Bạn nhỏ đã hoàn thành chủ đề ${selectedTheme.label}. Điểm số của bé là ${score} trên ${questions.length}.`,
          { lang: 'vi-VN', rate: 0.9, pitch: 1.05 }
        );
      }
      setFinished(true);
      return;
    }
    skipAutoSpeakRef.current = true;
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowResult(false);
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
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    hasSavedRef.current = false;
  };

  if (!selectedTheme) {
    return (
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
            Trò chơi tư duy phân loại
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Đồ vật ở đâu?
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé quan sát đồ vật rồi chọn đúng địa điểm nơi nó thường xuất hiện.
            Trò chơi giúp bé phân loại theo bối cảnh, mở rộng vốn từ và phát
            triển tư duy liên hệ thực tế.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whereBelongsThemes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => startThemeGame(theme)}
                className="group rounded-[30px] bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-emerald-300 via-sky-300 to-violet-400 p-[2px] shadow-[0_12px_30px_rgba(16,185,129,0.28)] transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
                  <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                  <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-200 via-sky-100 to-violet-200 text-4xl shadow-inner">
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {theme.places.map((placeKey) => {
                    const place = whereBelongsPlaces[placeKey];
                    return (
                      <span
                        key={placeKey}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-100"
                      >
                        <span>{place.icon}</span>
                        <span>{place.label}</span>
                      </span>
                    );
                  })}
                </div>

                <div className="mt-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
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
                  'Phân loại theo bối cảnh',
                  'Liên hệ đồ vật với cuộc sống',
                  'Mở rộng vốn từ Tiếng Việt',
                  'Tư duy có hệ thống',
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

            <div className="rounded-[30px] bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
              <h3 className="text-2xl font-black tracking-tight text-emerald-950">
                Kết quả gần đây
              </h3>
              <div className="mt-5 space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-emerald-100">
                    Chưa có lượt chơi nào được lưu. Hãy chọn một chủ đề để bắt đầu.
                  </div>
                ) : (
                  history.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
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
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-sky-300 to-violet-400 p-[3px] shadow-[0_12px_30px_rgba(16,185,129,0.28)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                🎉
              </div>
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Hoàn thành chủ đề
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bạn nhỏ đã hoàn thành chủ đề {selectedTheme.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Kết quả đã được lưu lại để phụ huynh xem nhanh những lần chơi gần đây của bé.
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
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-sky-600 hover:shadow-xl"
              >
                Chơi lại chủ đề này
              </button>

              <button
                onClick={handleBackToThemes}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md"
              >
                Chọn chủ đề khác
              </button>

              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md"
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

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
              4-7 tuổi
            </span>
            <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
              {selectedTheme.label}
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
              {questions.length} câu
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Đồ vật ở đâu?
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé quan sát đồ vật rồi chọn đúng địa điểm mà nó thường xuất hiện.
          </p>

          <div className="mt-6 rounded-[24px] bg-gradient-to-br from-emerald-100 via-sky-50 to-violet-100 p-2 sm:mt-8 sm:rounded-[30px] sm:p-5">
            <div className="rounded-[20px] bg-white p-3 shadow-inner sm:rounded-[24px] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Câu hỏi hiện tại</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    {currentQuestion.itemLabel.charAt(0).toUpperCase() +
                      currentQuestion.itemLabel.slice(1)}{' '}
                    thuộc về nơi nào?
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      `${currentQuestion.itemLabel} thuộc về nơi nào? Bé hãy chọn đúng địa điểm nhé.`,
                      { lang: 'vi-VN', rate: 0.9, pitch: 1.08 }
                    )
                  }
                  className="mt-3 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-100"
                >
                  🔊 Nghe câu hỏi
                </button>

                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
                  Câu {currentIndex + 1}/{questions.length}
                </div>
              </div>

              <div className="mt-6">
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6 ring-1 ring-orange-100 sm:mt-6 sm:rounded-3xl sm:p-10">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-500 sm:text-sm">Đồ vật của bé</p>
                  <div className="mt-2 text-7xl leading-none drop-shadow-md sm:mt-3 sm:text-[8rem]">
                    {currentQuestion.item}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                {currentQuestion.shuffledPlaces.map((placeKey) => {
                  const place = whereBelongsPlaces[placeKey];
                  const isCorrect = placeKey === currentQuestion.correctPlace;
                  const isSelected = selected === placeKey;

                  let buttonClass =
                    'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
                  if (showResult && isCorrect) {
                    buttonClass = 'bg-emerald-50 text-emerald-700 ring-emerald-300';
                  } else if (showResult && isSelected && !isCorrect) {
                    buttonClass = 'bg-rose-50 text-rose-700 ring-rose-300';
                  }

                  return (
                    <button
                      key={placeKey}
                      onClick={() => handleChoose(placeKey)}
                      disabled={showResult}
                      className={`relative flex items-center gap-3 rounded-2xl px-3 py-3 text-left shadow-sm ring-2 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed sm:gap-4 sm:rounded-[28px] sm:px-5 sm:py-5 ${buttonClass}`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-md sm:h-16 sm:w-16 sm:rounded-[20px] sm:text-3xl ${place.colorClass}`}
                      >
                        {place.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-black text-slate-900 sm:text-lg">{place.label}</div>
                        <div className="text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
                          {place.description}
                        </div>
                      </div>
                      <span
                        role="button"
                        tabIndex={showResult ? -1 : 0}
                        aria-label={`Nghe tên ${place.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          stopSpeaking();
                          speakText(place.label, {
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
                            speakText(place.label, {
                              lang: 'vi-VN',
                              rate: 0.95,
                              pitch: 1.1,
                            });
                          }
                        }}
                        className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-sm shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:ring-emerald-200 sm:h-9 sm:w-9 sm:text-base"
                      >
                        🔊
                      </span>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold ${
                    selected === currentQuestion.correctPlace
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                  }`}
                >
                  {selected === currentQuestion.correctPlace
                    ? `Chính xác. ${currentQuestion.itemLabel.charAt(0).toUpperCase() + currentQuestion.itemLabel.slice(1)} thường có ở ${whereBelongsPlaces[currentQuestion.correctPlace].label.toLowerCase()}.`
                    : `Chưa đúng nhé. ${currentQuestion.itemLabel.charAt(0).toUpperCase() + currentQuestion.itemLabel.slice(1)} thuộc về ${whereBelongsPlaces[currentQuestion.correctPlace].label.toLowerCase()}.`}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleNext}
                  disabled={!showResult}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-sky-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>

                <button
                  onClick={handleBackToThemes}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md"
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
            <div className="mt-5 flex items-center gap-4 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-emerald-300 via-sky-300 to-violet-400 text-3xl shadow-lg">
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
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
                Điểm hiện tại:{' '}
                <span className="font-bold text-slate-900">{score}</span> / {questions.length}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
            <h3 className="text-2xl font-black tracking-tight text-emerald-950">
              Kết quả gần đây
            </h3>
            <div className="mt-5 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-emerald-100">
                  Chưa có dữ liệu lưu gần đây.
                </div>
              ) : (
                history.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item.playedAt}-${index}`}
                    className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
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
