'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  missingNumberCategories,
  missingNumberData,
  type MissingNumberQuestion,
  type GameLevel,
} from './data';

type CategoryKey = keyof typeof missingNumberData;

type StoredScore = {
  categoryKey: string;
  categoryLabel: string;
  level?: GameLevel;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = MissingNumberQuestion & {
  shuffledOptions: number[];
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-missing-number-scores';
const SOUND_ENABLED_KEY = 'hoc-cung-be-missing-number-sound-enabled';
const SPEECH_ENABLED_KEY = 'hoc-cung-be-missing-number-speech-enabled';
const QUESTIONS_PER_GAME = 5;
const TIMER_SECONDS = 10;

const levelConfig: Record<
  GameLevel,
  {
    label: string;
    color: string;
  }
> = {
  easy: {
    label: 'Dễ',
    color: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  medium: {
    label: 'Trung bình',
    color: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  hard: {
    label: 'Khó',
    color: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
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
  source: MissingNumberQuestion[],
  count: number,
  level: GameLevel
): PlayQuestion[] {
  const filtered = source.filter((question) => question.level === level);
  const sourceToUse = filtered.length ? filtered : source;

  return shuffleArray(sourceToUse)
    .slice(0, Math.min(count, sourceToUse.length))
    .map((question) => ({
      ...question,
      shuffledOptions: shuffleArray(question.options),
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

function loadBooleanSetting(key: string, fallback = true) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveBooleanSetting(key: string, value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getPreferredVietnameseFemaleVoice(voices: SpeechSynthesisVoice[]) {
  const vietnameseVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith('vi')
  );

  const femaleHints = ['female', 'woman', 'girl', 'linh', 'mai', 'han', 'oanh', 'vy'];

  const preferredFemale = vietnameseVoices.find((voice) =>
    femaleHints.some((hint) => voice.name.toLowerCase().includes(hint))
  );

  return preferredFemale || vietnameseVoices[0] || null;
}

function getSafeLevel(level?: GameLevel): GameLevel {
  if (level === 'easy' || level === 'medium' || level === 'hard') {
    return level;
  }
  return 'easy';
}

export default function MissingNumberGame() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<GameLevel>('easy');
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!finished || !selectedCategory || hasSavedResultRef.current || !questions.length) return;

    const categoryInfo = missingNumberData[selectedCategory];
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
      speakVietnamese(
        accuracy >= 90
          ? `Bé đã hoàn thành rất tốt với độ chính xác ${accuracy} phần trăm`
          : accuracy >= 60
          ? `Bé đã hoàn thành tốt với độ chính xác ${accuracy} phần trăm`
          : `Bé đã hoàn thành trò chơi với độ chính xác ${accuracy} phần trăm`
      );
    }, 250);
  }, [finished, selectedCategory, selectedLevel, score, questions.length]);

  useEffect(() => {
    if (!selectedCategory || finished || showResult || !questions.length) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedCategory, finished, showResult, questions.length, timeLeft]);

  useEffect(() => {
    if (!selectedCategory || finished || showResult) return;
    if (timeLeft > 0) return;

    setTimedOut(true);
    setShowResult(true);
    playTimeoutSound();

    setTimeout(() => {
      if (currentQuestion) {
        speakVietnamese(`Hết giờ rồi. Đáp án đúng là ${currentQuestion.correct}`);
      }
    }, 200);
  }, [timeLeft, selectedCategory, finished, showResult, currentQuestion]);

  useEffect(() => {
    if (!currentQuestion || showResult || finished) return;

    const timer = setTimeout(() => {
      speakPrompt(currentQuestion.prompt);
    }, 350);

    return () => clearTimeout(timer);
  }, [currentQuestion, showResult, finished]);

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

  const playTone = async (
    frequency: number,
    duration = 0.18,
    type: OscillatorType = 'sine'
  ) => {
    if (!soundEnabled) return;

    const audioContext = getAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.stop(audioContext.currentTime + duration);
  };

  const playPromptSound = async () => {
    await playTone(520, 0.08, 'triangle');
  };

  const playSelectSound = async () => {
    await playTone(430, 0.08, 'triangle');
  };

  const playCorrectSound = async () => {
    await playTone(660, 0.12, 'triangle');
    setTimeout(() => playTone(880, 0.18, 'triangle'), 120);
  };

  const playWrongSound = async () => {
    await playTone(220, 0.2, 'sawtooth');
  };

  const playTimeoutSound = async () => {
    await playTone(180, 0.15, 'square');
    setTimeout(() => playTone(150, 0.2, 'square'), 160);
  };

  const playFinishSound = async () => {
    await playTone(523.25, 0.12, 'sine');
    setTimeout(() => playTone(659.25, 0.12, 'sine'), 100);
    setTimeout(() => playTone(783.99, 0.14, 'sine'), 220);
    setTimeout(() => playTone(1046.5, 0.18, 'sine'), 340);
  };

  const speakVietnamese = (text: string) => {
    if (!speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const preferredVoice = getPreferredVietnameseFemaleVoice(voices);

    utterance.lang = 'vi-VN';
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const speakPrompt = async (text: string) => {
    await playPromptSound();
    speakVietnamese(text);
  };

  const startCategoryGame = (key: CategoryKey, level: GameLevel) => {
    const sourceQuestions = missingNumberData[key].questions;
    const nextQuestions = buildPlayQuestions(sourceQuestions, QUESTIONS_PER_GAME, level);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setSelectedCategory(key);
    setSelectedLevel(level);
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
    setIsSpeaking(false);
    hasSavedResultRef.current = false;
  };

  const handleChoose = async (option: number) => {
    if (showResult || !currentQuestion) return;

    await playSelectSound();

    setSelected(option);
    setShowResult(true);

    if (option === currentQuestion.correct) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        playCorrectSound();
      }, 80);

      setTimeout(() => {
        speakVietnamese(`Chính xác rồi. Số còn thiếu là ${currentQuestion.correct}`);
      }, 220);
    } else {
      setTimeout(() => {
        playWrongSound();
      }, 80);

      setTimeout(() => {
        speakVietnamese(`Chưa đúng nhé. Đáp án đúng là ${currentQuestion.correct}`);
      }, 220);
    }
  };

  const handleNext = () => {
    if (!questions.length) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowResult(false);
    setTimedOut(false);
    setTimeLeft(TIMER_SECONDS);
  };

  const handleRestartSameCategory = () => {
    if (!selectedCategory) return;
    startCategoryGame(selectedCategory, selectedLevel);
  };

  const handleBackToCategories = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setSelectedCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(TIMER_SECONDS);
    setTimedOut(false);
    setIsSpeaking(false);
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

    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (!selectedCategory) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Trò chơi toán học
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Tìm số còn thiếu
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé quan sát dãy số, tìm quy luật và chọn đúng số còn thiếu. Mỗi câu có
                10 giây để trả lời, giúp bé tăng phản xạ và tập trung tốt hơn.
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
            <h2 className="text-xl font-black text-slate-900">Chọn chủ đề và mức độ</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {missingNumberCategories.map((category) => (
                <div
                  key={category.key}
                  className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
                    <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-4xl shadow-inner">
                      <span className="drop-shadow-[0_4px_8px_rgba(255,255,255,0.55)]">
                        {category.icon}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                    {category.label}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {category.total} câu hỏi theo chủ đề này.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(['easy', 'medium', 'hard'] as GameLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => startCategoryGame(category.key as CategoryKey, level)}
                        className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${levelConfig[level].color}`}
                      >
                        {levelConfig[level].label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[30px] bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Bản nâng cấp của trò chơi
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  'Có đồng hồ đếm ngược 10 giây',
                  'Có 3 mức độ: dễ, trung bình, khó',
                  'Có âm thanh đúng, sai và hết giờ',
                  'Lưu kết quả chơi gần đây cho phụ huynh',
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
                    Chưa có lượt chơi nào được lưu.
                  </div>
                ) : (
                  history.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
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
        </div>
      </section>
    );
  }

  if (finished) {
    const categoryInfo = missingNumberData[selectedCategory];
    const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

    return (
      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[3px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                🎉
              </div>
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Hoàn thành chủ đề
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bé đã hoàn thành chủ đề {categoryInfo.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Kết quả đã được lưu lại cùng với mức độ chơi để phụ huynh theo dõi sự tiến bộ của bé.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
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

              <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-100">
                <p className="text-sm font-semibold text-amber-700">Mức độ</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {levelConfig[selectedLevel].label}
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <p className="text-sm font-semibold text-emerald-700">Đánh giá</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  {accuracy >= 90 ? 'Rất tốt' : accuracy >= 60 ? 'Tốt' : 'Cố gắng thêm'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRestartSameCategory}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
              >
                Chơi lại chủ đề này
              </button>

              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Chọn chủ đề khác
              </button>

              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Về kho trò chơi
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
                4-7 tuổi
              </span>

              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
                {missingNumberData[selectedCategory].label}
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
                {soundEnabled ? '🔊 Bật hiệu ứng' : '🔇 Tắt hiệu ứng'}
              </button>
              <button
                onClick={toggleSpeech}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {speechEnabled ? '🗣️ Bật giọng đọc' : '🤫 Tắt giọng đọc'}
              </button>
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tìm số còn thiếu
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé quan sát dãy số, tìm quy luật và chọn đúng số còn thiếu trước khi hết giờ.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => currentQuestion && speakPrompt(currentQuestion.prompt)}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              {isSpeaking ? 'Đang đọc...' : '🔊 Đọc câu hỏi'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>Tiến độ câu hỏi</span>
                <span>
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>Thời gian còn lại</span>
                <span>{timeLeft}s</span>
              </div>
              <div className="h-3 rounded-full bg-slate-200">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    timeLeft <= 3
                      ? 'bg-rose-500'
                      : timeLeft <= 6
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[30px] bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-5">
            <div className="rounded-[24px] bg-white p-5 shadow-inner">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Câu hỏi hiện tại</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    {currentQuestion.prompt}
                  </h3>
                </div>

                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
                  Câu {currentIndex + 1}/{questions.length}
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-sky-50 p-6 text-center ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-slate-500">Dãy số cần quan sát</p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {currentQuestion.sequence.map((item, index) => {
                    const isMissing = item === '?';

                    return (
                      <div
                        key={`${currentQuestion.id}-${index}`}
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black shadow-sm ring-1 ${
                          isMissing
                            ? 'bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 text-white ring-transparent'
                            : 'bg-white text-slate-900 ring-slate-200'
                        }`}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {currentQuestion.shuffledOptions.map((option) => {
                  const isCorrect = option === currentQuestion.correct;
                  const isSelected = selected === option;

                  let buttonClass =
                    'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';

                  if (showResult && isCorrect) {
                    buttonClass = 'bg-emerald-50 text-emerald-700 ring-emerald-200';
                  } else if (showResult && isSelected && !isCorrect) {
                    buttonClass = 'bg-rose-50 text-rose-700 ring-rose-200';
                  } else if (timedOut && isCorrect) {
                    buttonClass = 'bg-amber-50 text-amber-700 ring-amber-200';
                  }

                  return (
                    <button
                      key={`${currentQuestion.id}-${option}`}
                      onClick={() => handleChoose(option)}
                      disabled={showResult}
                      className={`rounded-[28px] px-4 py-5 text-center text-3xl font-black shadow-sm ring-1 transition duration-300 ${buttonClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold ${
                    timedOut
                      ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                      : selected === currentQuestion.correct
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                  }`}
                >
                  {timedOut
                    ? `Hết giờ rồi. Đáp án đúng là ${currentQuestion.correct}.`
                    : selected === currentQuestion.correct
                    ? `Chính xác rồi. Số còn thiếu là ${currentQuestion.correct}.`
                    : `Chưa đúng nhé. Đáp án đúng là ${currentQuestion.correct}.`}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleNext}
                  disabled={!showResult}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>

                <button
                  onClick={handleBackToCategories}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
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

            <div className="mt-5 flex items-center gap-4 rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 text-3xl shadow-lg">
                {missingNumberData[selectedCategory].icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {missingNumberData[selectedCategory].label}
                </p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Mức độ: {levelConfig[selectedLevel].label}
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
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
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
                history.slice(0, 3).map((item, index) => {
                  const safeLevel = getSafeLevel(item.level);

                  return (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
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
