'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  patternCategories,
  patternData,
  type PatternCategory,
  type PatternLevel,
  type PatternQuestion,
} from './data';

type CategoryKey = keyof typeof patternData;

type StoredScore = {
  categoryKey: string;
  categoryLabel: string;
  level: PatternLevel;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = PatternQuestion & {
  shuffledOptions: string[];
};

type StickerItem = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-pattern-complete-scores';
const SOUND_ENABLED_KEY = 'hoc-cung-be-pattern-complete-sound-enabled';
const SPEECH_ENABLED_KEY = 'hoc-cung-be-pattern-complete-speech-enabled';
const STICKERS_KEY = 'hoc-cung-be-pattern-complete-stickers';

const QUESTIONS_PER_GAME = 5;

const levelConfig: Record<
  PatternLevel,
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

const stickers: StickerItem[] = [
  {
    id: 'first-win',
    emoji: '🌟',
    title: 'Khởi đầu thật tốt',
    description: 'Hoàn thành một màn đầu tiên.',
  },
  {
    id: 'perfect',
    emoji: '👑',
    title: 'Bé nhìn quy luật giỏi',
    description: 'Đạt độ chính xác rất cao.',
  },
  {
    id: 'combo-3',
    emoji: '🔥',
    title: 'Combo suy luận',
    description: 'Đạt 3 câu đúng liên tiếp.',
  },
  {
    id: 'shapes-master',
    emoji: '🔺',
    title: 'Bạn của hình dạng',
    description: 'Hoàn thành chủ đề hình dạng.',
  },
  {
    id: 'mixed-master',
    emoji: '✨',
    title: 'Bé siêu suy luận',
    description: 'Hoàn thành chủ đề tổng hợp.',
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPlayQuestions(
  source: PatternQuestion[],
  count: number,
  level: PatternLevel
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

function loadUnlockedStickers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STICKERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlockedStickers(values: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STICKERS_KEY, JSON.stringify(values));
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

export default function PatternCompleteGame() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<PatternLevel>('easy');
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>([]);

  const hasSavedResultRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = questions[currentIndex];

  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + (finished ? 1 : 0)) / questions.length) * 100);
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    setHistory(loadStoredScores());
    setSoundEnabled(loadBooleanSetting(SOUND_ENABLED_KEY, true));
    setSpeechEnabled(loadBooleanSetting(SPEECH_ENABLED_KEY, true));
    setUnlockedStickerIds(loadUnlockedStickers());
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

    const categoryInfo = patternData[selectedCategory];
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

    unlockSticker('first-win');
    if (accuracy >= 90) unlockSticker('perfect');
    if (selectedCategory === 'shapes') unlockSticker('shapes-master');
    if (selectedCategory === 'mixed') unlockSticker('mixed-master');

    playFinishSound();

    setTimeout(() => {
      speakVietnamese(
        accuracy >= 90
          ? `Bạn nhỏ đã hoàn thành rất tốt với độ chính xác ${accuracy} phần trăm`
          : accuracy >= 60
          ? `Bạn nhỏ đã hoàn thành tốt với độ chính xác ${accuracy} phần trăm`
          : `Bạn nhỏ đã hoàn thành trò chơi với độ chính xác ${accuracy} phần trăm`
      );
    }, 250);
  }, [finished, selectedCategory, selectedLevel, score, questions.length, accuracy]);

  useEffect(() => {
    if (!currentQuestion || showResult || finished) return;

    const timer = setTimeout(() => {
      speakPrompt();
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

  const speakPrompt = async () => {
    if (!currentQuestion) return;
    await playPromptSound();
    speakVietnamese(
      `${currentQuestion.prompt}. ${currentQuestion.hint}. Bé hãy tìm hình còn thiếu`
    );
  };

  const speakHint = async () => {
    if (!currentQuestion) return;
    await playPromptSound();
    speakVietnamese(currentQuestion.hint);
  };

  const unlockSticker = (id: string) => {
    setUnlockedStickerIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveUnlockedStickers(next);
      return next;
    });
  };

  const startCategoryGame = (key: CategoryKey, level: PatternLevel) => {
    const sourceQuestions = patternData[key].questions;
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
    setCombo(0);
    setBestCombo(0);
    setIsSpeaking(false);
    hasSavedResultRef.current = false;
  };

  const handleChoose = async (value: string) => {
    if (showResult || !currentQuestion) return;

    await playSelectSound();

    setSelected(value);
    setShowResult(true);

    const passed = value === currentQuestion.correct;

    if (passed) {
      setScore((prev) => prev + 1);
      setCombo((prev) => {
        const next = prev + 1;
        setBestCombo((best) => Math.max(best, next));
        if (next >= 3) unlockSticker('combo-3');
        return next;
      });

      setTimeout(() => {
        playCorrectSound();
      }, 80);

      setTimeout(() => {
        speakVietnamese('Chính xác rồi. Bạn nhỏ đã tìm đúng hình còn thiếu');
      }, 220);
    } else {
      setCombo(0);

      setTimeout(() => {
        playWrongSound();
      }, 80);

      setTimeout(() => {
        speakVietnamese('Chưa đúng nhé. Bé thử nhìn lại quy luật nào');
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
    setCombo(0);
    setBestCombo(0);
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
                Trò chơi tư duy
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Điền hình theo quy luật
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé quan sát chuỗi hình rồi chọn hình còn thiếu theo quy luật. Trò chơi giúp
                bé phát triển khả năng nhận biết mẫu lặp và suy luận logic.
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

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {patternCategories.map((category) => (
                <div
                  key={category.key}
                  className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
                    <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-4xl shadow-inner">
                      <span>{category.icon}</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                    {category.label}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {category.total} câu hỏi theo chủ đề này.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(['easy', 'medium', 'hard'] as PatternLevel[]).map((level) => (
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
                Bé sẽ rèn được gì?
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  'Nhận biết quy luật lặp',
                  'Suy luận hình còn thiếu',
                  'Tăng tư duy logic',
                  'Quan sát chuỗi trực quan tốt hơn',
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
                Sticker đã mở
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {stickers.map((item) => {
                  const unlocked = unlockedStickerIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl px-4 py-4 text-sm leading-7 ring-1 ${
                        unlocked
                          ? 'bg-white text-slate-700 ring-emerald-100'
                          : 'bg-slate-50 text-slate-400 ring-slate-100'
                      }`}
                    >
                      <div className="text-2xl">{unlocked ? item.emoji : '🔒'}</div>
                      <div className="mt-2 font-bold">{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const categoryInfo = patternData[selectedCategory];

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
              Bạn nhỏ đã hoàn thành chủ đề {categoryInfo.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Kết quả đã được lưu lại để phụ huynh theo dõi khả năng nhận biết quy luật và suy luận của bé.
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
                <p className="text-sm font-semibold text-emerald-700">Combo tốt nhất</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{bestCombo}</p>
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
                {patternData[selectedCategory].label}
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
            Điền hình theo quy luật
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé hãy nhìn chuỗi hình và chọn đúng hình còn thiếu.
          </p>

          {combo >= 2 && (
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 p-4 text-white shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">Combo</p>
              <p className="mt-1 text-2xl font-black">🔥 {combo} câu đúng liên tiếp</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={speakPrompt}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              {isSpeaking ? 'Đang đọc...' : '🔊 Đọc câu hỏi'}
            </button>

            <button
              onClick={speakHint}
              className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200"
            >
              🔊 Gợi ý
            </button>
          </div>

          <div className="mt-6 rounded-[30px] bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-5">
            <div className="rounded-[24px] bg-white p-5 shadow-inner">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Câu hỏi hiện tại</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    {currentQuestion.prompt}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{currentQuestion.hint}</p>
                </div>

                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
                  Câu {currentIndex + 1}/{questions.length}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>Tiến độ</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-sky-50 p-6 text-center ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-slate-500">Chuỗi quy luật</p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {currentQuestion.sequence.map((item, index) => {
                    const isMissing = item === '?';

                    return (
                      <div
                        key={`${currentQuestion.id}-${index}`}
                        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ring-1 ${
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
                {currentQuestion.shuffledOptions.map((value) => {
                  const isCorrect = value === currentQuestion.correct;
                  const isSelected = selected === value;

                  let buttonClass =
                    'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';

                  if (showResult && isCorrect) {
                    buttonClass = 'bg-emerald-50 text-emerald-700 ring-emerald-200';
                  } else if (showResult && isSelected && !isCorrect) {
                    buttonClass = 'bg-rose-50 text-rose-700 ring-rose-200';
                  }

                  return (
                    <button
                      key={value}
                      onClick={() => handleChoose(value)}
                      disabled={showResult}
                      className={`rounded-[28px] px-4 py-5 text-center shadow-sm ring-1 transition duration-300 ${buttonClass}`}
                    >
                      <div className="text-5xl">{value}</div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div
                  className={`mt-6 rounded-2xl px-4 py-4 text-sm font-semibold ${
                    selected === currentQuestion.correct
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                  }`}
                >
                  {selected === currentQuestion.correct
                    ? 'Chính xác rồi. Bạn nhỏ đã tìm đúng hình còn thiếu.'
                    : 'Chưa đúng nhé. Bé thử nhìn lại quy luật nào.'}
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
                {patternData[selectedCategory].icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {patternData[selectedCategory].label}
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

              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
                Combo tốt nhất: <span className="font-bold text-slate-900">{bestCombo}</span>
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
                    <div className="font-bold text-slate-900">
                      {item.categoryLabel} · {levelConfig[item.level].label}
                    </div>
                    <div>
                      Điểm: {item.score}/{item.total} · {item.accuracy}%
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {stickers.map((item) => {
                const unlocked = unlockedStickerIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl px-4 py-4 text-sm leading-7 ring-1 ${
                      unlocked
                        ? 'bg-white text-slate-700 ring-emerald-100'
                        : 'bg-slate-50 text-slate-400 ring-slate-100'
                    }`}
                  >
                    <div className="text-2xl">{unlocked ? item.emoji : '🔒'}</div>
                    <div className="mt-2 font-bold">{item.title}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
