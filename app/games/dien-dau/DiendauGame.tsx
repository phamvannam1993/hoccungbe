'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';
import {
  dienDauCategories,
  dienDauData,
  type ToneQuestion,
  type GameLevel,
} from './data';

type CategoryKey = keyof typeof dienDauData;

type StoredScore = {
  categoryKey: string;
  categoryLabel: string;
  level?: GameLevel;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = ToneQuestion & {
  shuffledOptions: string[];
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-dien-dau-scores';
const SOUND_ENABLED_KEY = 'hoc-cung-be-dien-dau-sound-enabled';
const SPEECH_ENABLED_KEY = 'hoc-cung-be-dien-dau-speech-enabled';
const QUESTIONS_PER_GAME = 5;

const levelConfig: Record<GameLevel, { label: string; color: string }> = {
  easy: { label: 'Dễ', color: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  medium: { label: 'Trung bình', color: 'bg-amber-50 text-amber-700 ring-amber-100' },
  hard: { label: 'Khó', color: 'bg-rose-50 text-rose-700 ring-rose-100' },
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPlayQuestions(
  source: ToneQuestion[],
  count: number,
  level: GameLevel
): PlayQuestion[] {
  const filtered = source.filter((q) => q.level === level);
  const sourceToUse = filtered.length ? filtered : source;

  return shuffleArray(sourceToUse)
    .slice(0, Math.min(count, sourceToUse.length))
    .map((q) => ({
      ...q,
      shuffledOptions: shuffleArray([q.answer, ...q.distractors].slice(0, 4)),
    }));
}

function getStars(score: number, total: number): number {
  const pct = total ? (score / total) * 100 : 0;
  if (pct === 100) return 3;
  if (pct >= 60) return 2;
  return 1;
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

function loadBooleanSetting(key: string, fallback = true) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as boolean) : fallback;
  } catch {
    return fallback;
  }
}

function saveBooleanSetting(key: string, value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getSafeLevel(level?: GameLevel): GameLevel {
  if (level === 'easy' || level === 'medium' || level === 'hard') return level;
  return 'easy';
}

export default function DiendauGame() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>('easy');
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const hasSavedResultRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = questions[currentIndex];

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + (finished ? 1 : 0)) / questions.length) * 100);
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    setHistory(loadStoredScores());
    setSoundEnabled(loadBooleanSetting(SOUND_ENABLED_KEY, true));
    setSpeechEnabled(loadBooleanSetting(SPEECH_ENABLED_KEY, true));
  }, []);

  useEffect(() => {
    saveBooleanSetting(SOUND_ENABLED_KEY, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    saveBooleanSetting(SPEECH_ENABLED_KEY, speechEnabled);
  }, [speechEnabled]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (!finished || !selectedCategory || hasSavedResultRef.current || !questions.length) return;

    const categoryInfo = dienDauData[selectedCategory];
    const storedScore: StoredScore = {
      categoryKey: selectedCategory,
      categoryLabel: categoryInfo.label,
      level: selectedLevel,
      score,
      total: questions.length,
      accuracy: Math.round((score / questions.length) * 100),
      playedAt: new Date().toISOString(),
    };

    saveStoredScore(storedScore);
    setHistory(loadStoredScores());
    hasSavedResultRef.current = true;

    playFinishSound();

    const accuracy = Math.round((score / questions.length) * 100);
    setTimeout(() => {
      if (speechEnabled)
        speakText(
          accuracy === 100
            ? 'Xuất sắc! Bạn nhỏ điền đúng tất cả các dấu thanh!'
            : accuracy >= 60
            ? `Bạn nhỏ đã hoàn thành tốt với độ chính xác ${accuracy} phần trăm`
            : `Bạn nhỏ hãy cố gắng thêm nhé. Độ chính xác ${accuracy} phần trăm`
        );
    }, 250);
  }, [finished, selectedCategory, selectedLevel, score, questions.length, speechEnabled]);

  useEffect(() => {
    if (!currentQuestion || showResult || finished) return;
    const timer = setTimeout(() => {
      if (speechEnabled) speakText(currentQuestion.answer);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentQuestion, showResult, finished, speechEnabled]);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  };

  const playTone = async (frequency: number, duration = 0.18, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    const audioContext = getAudioContext();
    if (!audioContext) return;
    if (audioContext.state === 'suspended') await audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playCorrectSound = async () => {
    await playTone(660, 0.12, 'triangle');
    setTimeout(() => playTone(880, 0.18, 'triangle'), 120);
  };

  const playWrongSound = async () => {
    await playTone(220, 0.2, 'sawtooth');
  };

  const playSelectSound = async () => {
    await playTone(430, 0.08, 'triangle');
  };

  const playFinishSound = async () => {
    await playTone(523.25, 0.12, 'sine');
    setTimeout(() => playTone(659.25, 0.12, 'sine'), 100);
    setTimeout(() => playTone(783.99, 0.14, 'sine'), 220);
    setTimeout(() => playTone(1046.5, 0.18, 'sine'), 340);
  };

  const startCategoryGame = (key: CategoryKey, level: GameLevel) => {
    const sourceQuestions = dienDauData[key].questions;
    const nextQuestions = buildPlayQuestions(sourceQuestions, QUESTIONS_PER_GAME, level);

    stopSpeaking();
    setSelectedCategory(key);
    setSelectedLevel(level);
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    hasSavedResultRef.current = false;
  };

  const handleChoose = async (option: string) => {
    if (showResult || !currentQuestion) return;
    await playSelectSound();
    setSelected(option);
    setShowResult(true);

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1);
      setTimeout(() => playCorrectSound(), 80);
      setTimeout(() => {
        if (speechEnabled) speakText(`Chính xác rồi! Từ đúng là "${currentQuestion.answer}"`);
      }, 220);
    } else {
      setTimeout(() => playWrongSound(), 80);
      setTimeout(() => {
        if (speechEnabled)
          speakText(`Chưa đúng nhé. Đáp án đúng là "${currentQuestion.answer}"`);
      }, 220);
    }
  };

  const handleNext = () => {
    if (!questions.length) return;
    stopSpeaking();
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowResult(false);
  };

  const handleRestartSameCategory = () => {
    if (!selectedCategory) return;
    startCategoryGame(selectedCategory, selectedLevel);
  };

  const handleBackToCategories = () => {
    stopSpeaking();
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    hasSavedResultRef.current = false;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveBooleanSetting(SOUND_ENABLED_KEY, next);
  };

  const toggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    saveBooleanSetting(SPEECH_ENABLED_KEY, next);
    if (!next) stopSpeaking();
  };

  // ─── Category select screen ────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
                Tiếng Việt lớp 2
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Điền dấu thanh
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé đọc câu gợi ý và chọn đúng dấu thanh cho từ còn thiếu. Luyện phân biệt
                dấu hỏi/ngã, sắc/huyền và các thanh điệu tiếng Việt.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleSound}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {soundEnabled ? '🔊 Bật hiệu ứng' : '🔇 Tắt hiệu ứng'}
              </button>
              <button
                onClick={toggleSpeech}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-black text-slate-900">Chọn nhóm dấu thanh</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {dienDauCategories.map((cat) => {
                const data = dienDauData[cat.key];
                return (
                  <div
                    key={cat.key}
                    className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-teal-300 via-cyan-400 to-sky-500 p-[2px] shadow-[0_12px_30px_rgba(6,182,212,0.28)]">
                      <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                      <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-teal-400 via-cyan-300 to-sky-400 text-3xl font-black text-white shadow-inner">
                        {cat.icon}
                      </div>
                    </div>

                    <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                      {cat.label}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {data.questions.length} câu hỏi trong nhóm này.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(['easy', 'medium', 'hard'] as GameLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => startCategoryGame(cat.key as CategoryKey, level)}
                          className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${levelConfig[level].color}`}
                        >
                          {levelConfig[level].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[30px] bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Tính năng trò chơi
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  'Phân biệt dấu hỏi và dấu ngã',
                  'Phân biệt dấu sắc và dấu huyền',
                  'Luyện 6 thanh điệu tiếng Việt',
                  'Có giọng đọc và gợi ý ngữ cảnh',
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

            <div className="rounded-[30px] bg-teal-50 p-6 shadow-sm ring-1 ring-teal-100">
              <h3 className="text-2xl font-black tracking-tight text-teal-950">
                Kết quả gần đây
              </h3>
              <div className="mt-5 space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-teal-100">
                    Chưa có lượt chơi nào được lưu.
                  </div>
                ) : (
                  history.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-teal-100"
                    >
                      <div className="font-bold text-slate-900">
                        {item.categoryLabel} · {levelConfig[item.level ?? 'easy']?.label ?? 'Dễ'}
                      </div>
                      <div>
                        Điểm: {item.score}/{item.total} · {item.accuracy}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/tro-choi"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
            >
              ← Về kho trò chơi
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── Result screen ─────────────────────────────────────────────────────────
  if (finished) {
    const categoryInfo = dienDauData[selectedCategory];
    const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const stars = getStars(score, questions.length);

    return (
      <section className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 via-cyan-400 to-sky-500 p-[3px] shadow-[0_12px_30px_rgba(6,182,212,0.28)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                🎉
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-1 text-4xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < stars ? 'opacity-100' : 'opacity-20'}>
                  ⭐
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              Hoàn thành
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bé đã hoàn thành nhóm {categoryInfo.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Kết quả đã được lưu lại để phụ huynh theo dõi sự tiến bộ của bé.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="rounded-3xl bg-teal-50 p-5 ring-1 ring-teal-100">
                <p className="text-sm font-semibold text-teal-700">Điểm số</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {score}/{questions.length}
                </p>
              </div>
              <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-sky-700">Độ chính xác</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{accuracy}%</p>
              </div>
              <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-100">
                <p className="text-sm font-semibold text-amber-700">Mức độ</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {levelConfig[selectedLevel].label}
                </p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <p className="text-sm font-semibold text-emerald-700">Đánh giá</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {stars === 3 ? 'Xuất sắc' : stars === 2 ? 'Tốt lắm' : 'Cố gắng thêm'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRestartSameCategory}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition duration-300 hover:-translate-y-0.5 hover:from-teal-600 hover:to-sky-600 hover:shadow-xl"
              >
                Chơi lại nhóm này
              </button>
              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
              >
                Chọn nhóm khác
              </button>
              <Link
                href="/tro-choi"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
              >
                Về kho trò chơi
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Game screen ───────────────────────────────────────────────────────────
  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Main question card */}
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          {/* Header badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 ring-1 ring-teal-100">
                Lớp 2
              </span>
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
                {dienDauData[selectedCategory].label}
              </span>
              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${levelConfig[selectedLevel].color}`}
              >
                {levelConfig[selectedLevel].label}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleSound}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
              <button
                onClick={toggleSpeech}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {speechEnabled ? '🗣️' : '🤫'}
              </button>
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Điền dấu thanh
          </h1>

          {/* Progress bar */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
              <span>Tiến độ</span>
              <span>
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="mt-8 rounded-[30px] bg-gradient-to-br from-teal-100 via-cyan-50 to-sky-100 p-5">
            <div className="rounded-[24px] bg-white p-5 shadow-inner">
              {/* Sentence hint */}
              <div className="flex items-start gap-4">
                {currentQuestion.image && (
                  <span className="mt-1 flex-shrink-0 text-4xl">{currentQuestion.image}</span>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500">Câu gợi ý</p>
                  <h2 className="mt-1 text-xl font-black leading-8 text-slate-900">
                    {currentQuestion.hint}
                  </h2>
                </div>
              </div>

              {/* Bare word display */}
              <div className="mt-6 rounded-3xl bg-teal-50 p-6 text-center ring-1 ring-teal-100">
                <p className="text-sm font-semibold text-slate-500">Từ cần điền dấu</p>
                <div className="mt-3 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 shadow-sm ring-1 ring-teal-200">
                  <span className="text-5xl font-black tracking-wide text-teal-700">
                    {currentQuestion.bareWord}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  Chọn từ đúng dấu thanh bên dưới
                </p>
              </div>

              {/* Option buttons */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.shuffledOptions.map((option) => {
                  const isCorrect = option === currentQuestion.answer;
                  const isSelected = selected === option;

                  let buttonClass = 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
                  if (showResult && isCorrect) {
                    buttonClass = 'bg-emerald-50 text-emerald-700 ring-emerald-300';
                  } else if (showResult && isSelected && !isCorrect) {
                    buttonClass = 'bg-rose-50 text-rose-700 ring-rose-300';
                  }

                  return (
                    <button
                      key={`${currentQuestion.id}-${option}`}
                      onClick={() => handleChoose(option)}
                      disabled={showResult}
                      className={`rounded-[28px] px-4 py-5 text-center text-3xl font-black shadow-sm ring-1 transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${buttonClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showResult && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold leading-7 ${
                    selected === currentQuestion.answer
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                  }`}
                >
                  {selected === currentQuestion.answer ? (
                    <>
                      Chính xác rồi! Từ đúng là{' '}
                      <span className="font-black">{currentQuestion.answer}</span>.{' '}
                      {currentQuestion.explanation}
                    </>
                  ) : (
                    <>
                      Chưa đúng nhé. Đáp án đúng là{' '}
                      <span className="font-black">{currentQuestion.answer}</span>.{' '}
                      {currentQuestion.explanation}
                    </>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleNext}
                  disabled={!showResult}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition duration-300 hover:-translate-y-0.5 hover:from-teal-600 hover:to-sky-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>

                <button
                  onClick={() => {
                    if (currentQuestion && speechEnabled) speakText(currentQuestion.answer);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
                >
                  🔊 Nghe từ
                </button>

                <button
                  onClick={handleBackToCategories}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:shadow-md"
                >
                  Đổi nhóm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Đang chơi</h3>
            <div className="mt-5 flex items-center gap-4 rounded-3xl bg-teal-50 p-5 ring-1 ring-teal-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-teal-300 via-cyan-400 to-sky-500 text-2xl font-black text-white shadow-lg">
                {dienDauData[selectedCategory].icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {dienDauData[selectedCategory].label}
                </p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Mức độ: {levelConfig[selectedLevel].label}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Tiến độ</h3>
            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>Hoàn thành</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
                Điểm hiện tại: <span className="font-bold text-slate-900">{score}</span> /{' '}
                {questions.length}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-teal-50 p-6 shadow-sm ring-1 ring-teal-100">
            <h3 className="text-2xl font-black tracking-tight text-teal-950">Kết quả gần đây</h3>
            <div className="mt-5 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-teal-100">
                  Chưa có dữ liệu lưu gần đây.
                </div>
              ) : (
                history.slice(0, 3).map((item, index) => {
                  const safeLevel = getSafeLevel(item.level);
                  return (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-teal-100"
                    >
                      <div className="font-bold text-slate-900">
                        {item.categoryLabel} · {levelConfig[safeLevel].label}
                      </div>
                      <div>
                        Điểm: {item.score}/{item.total} · {item.accuracy}%
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
