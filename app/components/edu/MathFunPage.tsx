'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { mathFunLevels, type MathDifficultyLevel } from './data/mathFunLevels';
import Link from 'next/link';

type MathQuestion = {
  id: number;
  left: number;
  right: number;
  operator: '+' | '-';
  correctAnswer: number;
  options: number[];
};

type LevelProgress = {
  highScore: number;
  stars: number;
  unlocked: boolean;
  playedCount: number;
  bestStreak: number;
};

type ProgressMap = Record<string, LevelProgress>;

type StickerItem = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

type UnlockState = {
  open: boolean;
  levelTitle: string;
  levelId: string;
};

type ViewMode =
  | 'levels'
  | 'intro'
  | 'game'
  | 'result'
  | 'stickers'
  | 'achievements';

const STORAGE_KEY = 'math-fun-progress-v4';
const STICKER_STORAGE_KEY = 'math-fun-stickers-v1';
const INTRO_STORAGE_KEY = 'math-fun-intro-seen-v1';

const allStickers: StickerItem[] = [
  {
    id: 'starter-heart',
    emoji: '💛',
    title: 'Bé khởi động',
    description: 'Hoàn thành màn chơi đầu tiên.',
  },
  {
    id: 'try-hard-star',
    emoji: '🌟',
    title: 'Bé cố gắng',
    description: 'Nhận ít nhất 1 sao ở một cấp độ.',
  },
  {
    id: 'hardworking-medal',
    emoji: '🏅',
    title: 'Bé chăm chỉ',
    description: 'Nhận ít nhất 2 sao ở một cấp độ.',
  },
  {
    id: 'super-crown',
    emoji: '👑',
    title: 'Siêu sao toán vui',
    description: 'Nhận 3 sao ở một cấp độ.',
  },
  {
    id: 'combo-fire',
    emoji: '🔥',
    title: 'Chuỗi siêu đỉnh',
    description: 'Đạt chuỗi đúng từ 4 câu trở lên.',
  },
  {
    id: 'speed-lightning',
    emoji: '⚡',
    title: 'Thần tốc 30 giây',
    description: 'Hoàn thành chế độ thi nhanh với điểm tốt.',
  },
  {
    id: 'unlock-gift',
    emoji: '🎁',
    title: 'Mở khóa cấp mới',
    description: 'Mở được cấp độ tiếp theo.',
  },
  {
    id: 'collection-bear',
    emoji: '🐻',
    title: 'Bạn của gấu nhỏ',
    description: 'Xem màn giới thiệu của gấu nhỏ.',
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];

  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }

  return cloned;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildInitialProgress(): ProgressMap {
  const progress: ProgressMap = {};

  mathFunLevels.forEach((level, index) => {
    progress[level.id] = {
      highScore: 0,
      stars: 0,
      unlocked: index === 0,
      playedCount: 0,
      bestStreak: 0,
    };
  });

  return progress;
}

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return buildInitialProgress();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialProgress();

    const parsed = JSON.parse(raw) as ProgressMap;

    return {
      ...buildInitialProgress(),
      ...parsed,
    };
  } catch {
    return buildInitialProgress();
  }
}

function saveProgress(progress: ProgressMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadUnlockedStickers(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STICKER_STORAGE_KEY);
    if (!raw) return [];

    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveUnlockedStickers(stickers: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(stickers));
}

function resetAllProgress() {
  const progress = buildInitialProgress();

  saveProgress(progress);
  saveUnlockedStickers([]);

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(INTRO_STORAGE_KEY);
  }

  return progress;
}

function markIntroSeen() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INTRO_STORAGE_KEY, 'true');
}

function hasSeenIntro() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(INTRO_STORAGE_KEY) === 'true';
}

function generateWrongAnswers(
  correctAnswer: number,
  maxNumber: number
): number[] {
  const candidates = new Set<number>();
  let attempts = 0;

  while (candidates.size < 8 && attempts < 50) {
    const offset = randomInt(1, 4);
    const sign = Math.random() > 0.5 ? 1 : -1;
    const value = correctAnswer + offset * sign;

    if (
      value >= 0 &&
      value <= Math.max(maxNumber * 2, 20) &&
      value !== correctAnswer
    ) {
      candidates.add(value);
    }

    attempts += 1;
  }

  for (
    let i = 0;
    candidates.size < 8 && i <= Math.max(maxNumber * 2, 20);
    i += 1
  ) {
    if (i !== correctAnswer) candidates.add(i);
  }

  return [...candidates];
}

function buildMathQuestion(
  id: number,
  level: MathDifficultyLevel
): MathQuestion {
  const shouldUseAddition =
    level.operatorMode === 'add'
      ? true
      : level.operatorMode === 'subtract'
        ? false
        : Math.random() > 0.5;

  if (shouldUseAddition) {
    const left = randomInt(level.minNumber, level.maxNumber);
    const right = randomInt(level.minNumber, level.maxNumber);
    const correctAnswer = left + right;
    const wrongAnswers = shuffleArray(
      generateWrongAnswers(correctAnswer, level.maxNumber)
    ).slice(0, level.optionsCount - 1);

    return {
      id,
      left,
      right,
      operator: '+',
      correctAnswer,
      options: shuffleArray([correctAnswer, ...wrongAnswers]),
    };
  }

  const left = randomInt(Math.max(1, level.minNumber), level.maxNumber);
  const right = randomInt(level.minNumber, left);
  const correctAnswer = left - right;
  const wrongAnswers = shuffleArray(
    generateWrongAnswers(correctAnswer, level.maxNumber)
  ).slice(0, level.optionsCount - 1);

  return {
    id,
    left,
    right,
    operator: '-',
    correctAnswer,
    options: shuffleArray([correctAnswer, ...wrongAnswers]),
  };
}

function buildQuestionSet(level: MathDifficultyLevel): MathQuestion[] {
  return Array.from({ length: level.questionCount }, (_, index) =>
    buildMathQuestion(index + 1, level)
  );
}

function getStarCount(score: number, total: number): number {
  const ratio = total === 0 ? 0 : score / total;

  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio >= 0.3) return 1;

  return 0;
}

function getVisualSymbol(operatorMode: MathDifficultyLevel['operatorMode']) {
  if (operatorMode === 'add') return '🍎';
  if (operatorMode === 'subtract') return '🧸';
  return '🍬';
}

function renderVisualItems(count: number, symbol: string, fadedCount = 0) {
  const safeCount = Math.min(count, 10);

  return Array.from({ length: safeCount }, (_, index) => {
    const shouldFade = index >= safeCount - fadedCount;

    return (
      <span
        key={`${symbol}-${index}`}
        className={`text-xl transition sm:text-3xl ${
          shouldFade ? 'opacity-25 grayscale' : 'opacity-100'
        }`}
      >
        {symbol}
      </span>
    );
  });
}

function getStickerByStars(stars: number): StickerItem {
  if (stars === 3) return allStickers.find((s) => s.id === 'super-crown')!;
  if (stars === 2) return allStickers.find((s) => s.id === 'hardworking-medal')!;
  if (stars === 1) return allStickers.find((s) => s.id === 'try-hard-star')!;

  return allStickers.find((s) => s.id === 'starter-heart')!;
}

function getLevelCardStyle(index: number, unlocked: boolean) {
  const styles = [
    {
      icon: 'bg-emerald-100',
      chip: 'bg-emerald-50 text-emerald-700',
      progress: 'bg-emerald-400',
    },
    {
      icon: 'bg-orange-100',
      chip: 'bg-orange-50 text-orange-700',
      progress: 'bg-orange-400',
    },
    {
      icon: 'bg-violet-100',
      chip: 'bg-violet-50 text-violet-700',
      progress: 'bg-violet-400',
    },
    {
      icon: 'bg-pink-100',
      chip: 'bg-pink-50 text-pink-700',
      progress: 'bg-pink-400',
    },
    {
      icon: 'bg-sky-100',
      chip: 'bg-sky-50 text-sky-700',
      progress: 'bg-sky-400',
    },
  ];

  const style = styles[index % styles.length];

  if (!unlocked) {
    return {
      icon: 'bg-slate-200',
      chip: 'bg-slate-200 text-slate-700',
      progress: 'bg-slate-400',
    };
  }

  return style;
}

function getAchievementStats(
  progress: ProgressMap,
  unlockedStickerIds: string[]
) {
  const levels = Object.values(progress);
  const totalHighScore = levels.reduce((sum, item) => sum + item.highScore, 0);
  const totalStars = levels.reduce((sum, item) => sum + item.stars, 0);
  const completedLevels = levels.filter((item) => item.stars > 0).length;
  const unlockedLevels = levels.filter((item) => item.unlocked).length;
  const totalPlayed = levels.reduce((sum, item) => sum + item.playedCount, 0);
  const bestStreak = Math.max(0, ...levels.map((item) => item.bestStreak));

  return {
    totalHighScore,
    totalStars,
    completedLevels,
    unlockedLevels,
    totalPlayed,
    bestStreak,
    stickerCount: unlockedStickerIds.length,
  };
}

export default function MathFunPage() {
  const [selectedLevel, setSelectedLevel] =
    useState<MathDifficultyLevel | null>(null);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<ProgressMap>(buildInitialProgress());
  const [showResult, setShowResult] = useState(false);
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>([]);
  const [unlockState, setUnlockState] = useState<UnlockState>({
    open: false,
    levelTitle: '',
    levelId: '',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('levels');
  const [streak, setStreak] = useState(0);
  const [bestStreakSession, setBestStreakSession] = useState(0);
  const [mascotMessage, setMascotMessage] = useState('Mình cùng làm toán nhé!');
  const [showCelebration, setShowCelebration] = useState(false);

  const [quickModeScore, setQuickModeScore] = useState(0);
  const [quickModeTimeLeft, setQuickModeTimeLeft] = useState(30);
  const [isQuickMode, setIsQuickMode] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const quickModeRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

  const currentLevelProgress = selectedLevel ? progress[selectedLevel.id] : null;
  const earnedStars = selectedLevel
    ? getStarCount(isQuickMode ? quickModeScore : score, questions.length || 1)
    : 0;
  const visualSymbol = selectedLevel
    ? getVisualSymbol(selectedLevel.operatorMode)
    : '🍎';
  const rewardSticker = getStickerByStars(earnedStars);
  const unlockedLevelData = mathFunLevels.find(
    (level) => level.id === unlockState.levelId
  );
  const achievementStats = getAchievementStats(progress, unlockedStickerIds);

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return null;

      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  };

  const playTone = async (
    frequency: number,
    duration = 0.2,
    type: OscillatorType = 'sine'
  ) => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  };

  const playCorrectSound = async () => {
    await playTone(700, 0.12, 'sine');

    setTimeout(() => {
      playTone(860, 0.12, 'sine');
    }, 110);

    setTimeout(() => {
      playTone(980, 0.16, 'sine');
    }, 220);
  };

  const playWrongSound = async () => {
    await playTone(320, 0.16, 'triangle');

    setTimeout(() => {
      playTone(220, 0.2, 'triangle');
    }, 120);
  };

  const speakText = (text: string) => {
    if (!speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const speakMathQuestion = () => {
    if (!currentQuestion) return;

    const operatorText = currentQuestion.operator === '+' ? 'cộng' : 'trừ';

    speakText(
      `${currentQuestion.left} ${operatorText} ${currentQuestion.right} bằng bao nhiêu`
    );
  };

  const speakAnswerOption = (answer: number) => {
    speakText(`${answer}`);
  };

  const addSticker = (stickerId: string) => {
    setUnlockedStickerIds((prev) => {
      if (prev.includes(stickerId)) return prev;

      const updated = [...prev, stickerId];

      saveUnlockedStickers(updated);

      return updated;
    });
  };

  const startLevel = (level: MathDifficultyLevel) => {
    setSelectedLevel(level);
    setQuestions(buildQuestionSet(level));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
    setStreak(0);
    setBestStreakSession(0);
    setMascotMessage('Mình cùng làm toán nhé!');
    setShowCelebration(false);
    setIsQuickMode(false);
    setQuickModeScore(0);
    setQuickModeTimeLeft(30);
    setViewMode('game');
  };

  const startQuickMode = () => {
    const quickLevel: MathDifficultyLevel = {
      id: 'quick-mode',
      title: 'Thi nhanh 30 giây',
      description: 'Bé trả lời càng nhiều càng tốt trong 30 giây.',
      operatorMode: 'mixed',
      minNumber: 0,
      maxNumber: 10,
      questionCount: 999,
      optionsCount: 4,
    };

    setSelectedLevel(quickLevel);
    setQuestions(buildQuestionSet(quickLevel));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuickModeScore(0);
    setQuickModeTimeLeft(30);
    setShowResult(false);
    setStreak(0);
    setBestStreakSession(0);
    setMascotMessage('Thi nhanh bắt đầu rồi! Bé cố lên nhé!');
    setShowCelebration(false);
    setIsQuickMode(true);
    setViewMode('game');
  };

  const unlockNextLevelIfNeeded = (
    levelId: string,
    stars: number,
    currentProgress: ProgressMap
  ) => {
    const levelIndex = mathFunLevels.findIndex((level) => level.id === levelId);

    if (levelIndex === -1 || stars < 2) {
      return {
        updatedProgress: currentProgress,
        unlockedLevel: null as MathDifficultyLevel | null,
      };
    }

    const nextLevel = mathFunLevels[levelIndex + 1];

    if (!nextLevel) {
      return {
        updatedProgress: currentProgress,
        unlockedLevel: null as MathDifficultyLevel | null,
      };
    }

    if (currentProgress[nextLevel.id]?.unlocked) {
      return {
        updatedProgress: currentProgress,
        unlockedLevel: null as MathDifficultyLevel | null,
      };
    }

    const updatedProgress = {
      ...currentProgress,
      [nextLevel.id]: {
        ...currentProgress[nextLevel.id],
        unlocked: true,
      },
    };

    return {
      updatedProgress,
      unlockedLevel: nextLevel,
    };
  };

  const finishLevel = () => {
    if (!selectedLevel) return;

    const finalScore = isQuickMode ? quickModeScore : score;
    const stars = getStarCount(
      finalScore,
      isQuickMode ? Math.max(finalScore, 5) : questions.length
    );

    if (isQuickMode) {
      if (finalScore >= 8) addSticker('speed-lightning');

      addSticker(getStickerByStars(stars).id);
      setShowResult(true);
      setShowCelebration(true);
      speakText(`Bạn nhỏ đã hoàn thành thi nhanh với ${finalScore} điểm`);

      return;
    }

    setProgress((prev) => {
      const current = prev[selectedLevel.id] ?? {
        highScore: 0,
        stars: 0,
        unlocked: true,
        playedCount: 0,
        bestStreak: 0,
      };

      let updated: ProgressMap = {
        ...prev,
        [selectedLevel.id]: {
          ...current,
          highScore: Math.max(current.highScore, finalScore),
          stars: Math.max(current.stars, stars),
          unlocked: true,
          playedCount: current.playedCount + 1,
          bestStreak: Math.max(current.bestStreak, bestStreakSession),
        },
      };

      const { updatedProgress, unlockedLevel } = unlockNextLevelIfNeeded(
        selectedLevel.id,
        stars,
        updated
      );

      updated = updatedProgress;

      saveProgress(updated);

      if (unlockedLevel) {
        addSticker('unlock-gift');
        setUnlockState({
          open: true,
          levelTitle: unlockedLevel.title,
          levelId: unlockedLevel.id,
        });
      }

      return updated;
    });

    addSticker(getStickerByStars(stars).id);

    if (bestStreakSession >= 4) addSticker('combo-fire');

    setShowResult(true);
    setShowCelebration(true);
    speakText(`Bạn nhỏ đã hoàn thành cấp độ ${selectedLevel.title}`);
  };

  const handleChooseAnswer = async (answer: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(answer);
    speakAnswerOption(answer);

    if (answer === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);

      if (isQuickMode) {
        setQuickModeScore((prev) => prev + 1);
      }

      setStreak((prev) => {
        const next = prev + 1;

        setBestStreakSession((best) => Math.max(best, next));

        if (next >= 4) {
          addSticker('combo-fire');
          setMascotMessage(`Tuyệt lắm! Bé đang đúng ${next} câu liên tiếp!`);
        } else {
          setMascotMessage('Giỏi lắm! Mình làm tiếp nhé!');
        }

        return next;
      });

      await playCorrectSound();

      setTimeout(() => {
        speakText(`Giỏi lắm. Đáp án đúng là ${currentQuestion.correctAnswer}`);
      }, 320);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setMascotMessage('Không sao nhé, mình thử lại câu tiếp theo nào!');
      await playWrongSound();

      setTimeout(() => {
        speakText(`Chưa đúng. Đáp án đúng là ${currentQuestion.correctAnswer}`);
      }, 320);
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (!selectedLevel) return;

    if (isQuickMode) {
      startQuickMode();
      return;
    }

    setQuestions(buildQuestionSet(selectedLevel));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
    setStreak(0);
    setBestStreakSession(0);
    setMascotMessage('Mình thử lại thật giỏi nhé!');
    setShowCelebration(false);
  };

  const handleNextQuestion = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (isQuickMode) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      return;
    }

    finishLevel();
  };

  const handleResetProgress = () => {
    const reset = resetAllProgress();

    setProgress(reset);
    setUnlockedStickerIds([]);
    setSelectedLevel(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuickModeScore(0);
    setQuickModeTimeLeft(30);
    setShowResult(false);
    setStreak(0);
    setBestStreakSession(0);
    setMascotMessage('Mình cùng làm toán nhé!');
    setShowCelebration(false);
    setUnlockState({
      open: false,
      levelTitle: '',
      levelId: '',
    });
    setViewMode('intro');
  };

  useEffect(() => {
    setProgress(loadProgress());
    setUnlockedStickerIds(loadUnlockedStickers());

    if (!hasSeenIntro()) {
      setViewMode('intro');
    }
  }, []);

  useEffect(() => {
    if (!isQuickMode) {
      if (quickModeRef.current) {
        clearInterval(quickModeRef.current);
        quickModeRef.current = null;
      }

      return;
    }

    quickModeRef.current = setInterval(() => {
      setQuickModeTimeLeft((prev) => {
        if (prev <= 1) {
          if (quickModeRef.current) {
            clearInterval(quickModeRef.current);
            quickModeRef.current = null;
          }

          setShowResult(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (quickModeRef.current) {
        clearInterval(quickModeRef.current);
        quickModeRef.current = null;
      }
    };
  }, [isQuickMode]);

  useEffect(() => {
    if (!currentQuestion || viewMode !== 'game') return;

    const timer = setTimeout(() => {
      speakMathQuestion();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestion, viewMode]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progressPercent =
    !isQuickMode && questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : isQuickMode
        ? ((30 - quickModeTimeLeft) / 30) * 100
        : 0;

  if (viewMode === 'intro') {
    return (
      <section className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-100 sm:rounded-[36px]">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-4 text-white sm:p-8">
            <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
              Nhân vật đồng hành
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
              Chào bé, mình là Gấu nhỏ 🐻
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Mình sẽ cùng bé học toán, cổ vũ khi bé làm đúng, và tặng sticker
              sau mỗi màn chơi.
            </p>
          </div>

          <div className="grid gap-5 p-4 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
            <div className="flex items-center justify-center rounded-[24px] bg-amber-50 p-5 sm:rounded-[28px] sm:p-8">
              <div className="text-center">
                <div className="text-7xl sm:text-8xl">🐻</div>

                <p className="mt-4 text-base font-bold text-slate-800 sm:text-lg">
                  Gấu nhỏ ham học
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                Gấu nhỏ sẽ giúp bé:
              </h2>

              <div className="mt-4 space-y-2.5 text-sm text-slate-600 sm:mt-5 sm:space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  ⭐ Cổ vũ khi bé trả lời đúng
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  🎁 Tặng sticker khi bé hoàn thành tốt
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  🔥 Theo dõi chuỗi đúng liên tiếp
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
                  🏆 Lưu thành tích để bé tiến bộ mỗi ngày
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:mt-8 sm:flex sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    markIntroSeen();
                    addSticker('collection-bear');
                    setViewMode('levels');
                  }}
                  className="rounded-full bg-orange-400 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                >
                  Bắt đầu cùng Gấu nhỏ
                </button>

                <button
                  type="button"
                  onClick={() => {
                    markIntroSeen();
                    setViewMode('levels');
                  }}
                  className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (viewMode === 'stickers') {
    return (
      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 rounded-[24px] bg-gradient-to-r from-pink-400 to-orange-400 p-4 text-white shadow-lg sm:mb-6 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
                Bộ sưu tập
              </p>

              <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                Sticker của bé
              </h1>

              <p className="mt-2 text-sm text-white/90 sm:text-base">
                Bạn nhỏ đã mở được {unlockedStickerIds.length}/{allStickers.length}{' '}
                sticker.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('levels')}
              className="rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/30 sm:py-3"
            >
              Quay lại
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {allStickers.map((sticker) => {
            const unlocked = unlockedStickerIds.includes(sticker.id);

            return (
              <div
                key={sticker.id}
                className={`rounded-[22px] p-4 shadow-sm ring-1 sm:rounded-[28px] sm:p-5 ${
                  unlocked
                    ? 'bg-white ring-slate-100'
                    : 'bg-slate-100 opacity-70 ring-slate-200'
                }`}
              >
                <div className="text-4xl sm:text-5xl">
                  {unlocked ? sticker.emoji : '🔒'}
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900 sm:text-xl">
                  {sticker.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {unlocked ? sticker.description : 'Chưa mở khóa sticker này'}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (viewMode === 'achievements') {
    return (
      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 rounded-[24px] bg-gradient-to-r from-sky-400 to-violet-400 p-4 text-white shadow-lg sm:mb-6 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
                Thành tích
              </p>

              <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                Bảng thành tích của bé
              </h1>

              <p className="mt-2 text-sm text-white/90 sm:text-base">
                Theo dõi hành trình tiến bộ của bé qua từng cấp độ.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('levels')}
              className="rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/30 sm:py-3"
            >
              Quay lại
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-semibold text-slate-500">
              Tổng điểm cao nhất
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {achievementStats.totalHighScore}
            </p>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-semibold text-slate-500">Tổng số sao</p>
            <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {achievementStats.totalStars}
            </p>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-semibold text-slate-500">
              Chuỗi tốt nhất
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {achievementStats.bestStreak}
            </p>
          </div>

          <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-semibold text-slate-500">
              Sticker đã mở
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {achievementStats.stickerCount}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:mt-6 sm:rounded-[28px] sm:p-6">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Chi tiết theo cấp độ
          </h2>

          <div className="mt-4 space-y-3 sm:mt-5">
            {mathFunLevels.map((level) => {
              const item = progress[level.id];

              return (
                <div
                  key={level.id}
                  className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div>
                    <p className="font-black text-slate-900">{level.title}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      Chơi {item?.playedCount ?? 0} lần • Chuỗi tốt nhất{' '}
                      {item?.bestStreak ?? 0}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                      Điểm cao nhất: {item?.highScore ?? 0}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200">
                      Sao: {item?.stars ?? 0}/3
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (viewMode === 'levels') {
    return (
      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-4 rounded-[24px] bg-gradient-to-r from-amber-400 to-orange-400 p-4 text-white shadow-lg sm:mb-6 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
                Trò chơi toán học
              </p>

              <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                Toán vui cộng trừ
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                Chọn cấp độ, thi nhanh 30 giây, sưu tập sticker và xem thành
                tích của bé.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetProgress}
              className="w-full rounded-full bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/30 sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
            >
              Reset tiến trình
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <button
              type="button"
              onClick={startQuickMode}
              className="rounded-full bg-white px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-50 sm:px-4 sm:text-sm"
            >
              Thi nhanh
            </button>

            <button
              type="button"
              onClick={() => setViewMode('stickers')}
              className="rounded-full bg-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/30 sm:px-4 sm:text-sm"
            >
              Sticker
            </button>

            <button
              type="button"
              onClick={() => setViewMode('achievements')}
              className="rounded-full bg-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/30 sm:px-4 sm:text-sm"
            >
              Thành tích
            </button>

            <button
              type="button"
              onClick={() => setViewMode('intro')}
              className="rounded-full bg-white/20 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/30 sm:px-4 sm:text-sm"
            >
              Gấu nhỏ
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mathFunLevels.map((level, index) => {
            const levelProgress = progress[level.id];
            const isUnlocked = levelProgress?.unlocked ?? false;
            const stars = levelProgress?.stars ?? 0;
            const starsPercent = (stars / 3) * 100;
            const style = getLevelCardStyle(index, isUnlocked);

            return (
              <button
                key={level.id}
                type="button"
                onClick={() => isUnlocked && startLevel(level)}
                disabled={!isUnlocked}
                className={`rounded-[22px] p-4 text-left shadow-sm ring-1 transition sm:rounded-[28px] sm:p-5 ${
                  isUnlocked
                    ? 'bg-white ring-slate-100 hover:-translate-y-1 hover:shadow-lg'
                    : 'cursor-not-allowed bg-slate-100 ring-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl sm:h-14 sm:w-14 ${style.icon}`}
                  >
                    {getVisualSymbol(level.operatorMode)}
                  </div>

                  {!isUnlocked && (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                      Đã khóa
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900 sm:text-xl">
                  {level.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {level.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                  <span
                    className={`rounded-full px-3 py-1.5 font-semibold ${style.chip}`}
                  >
                    {level.operatorMode === 'add'
                      ? 'Chỉ cộng'
                      : level.operatorMode === 'subtract'
                        ? 'Chỉ trừ'
                        : 'Cộng trừ'}
                  </span>

                  <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">
                    {level.questionCount} câu
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Tiến trình sao</span>
                    <span>{stars}/3 sao</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${style.progress}`}
                      style={{ width: `${starsPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-lg sm:text-xl">
                  {[1, 2, 3].map((star) => (
                    <span key={star}>{star <= stars ? '⭐' : '☆'}</span>
                  ))}
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Điểm cao nhất:{' '}
                  <span className="font-bold">
                    {levelProgress?.highScore ?? 0}
                  </span>
                </p>

                <div
                  className={`mt-5 rounded-full px-4 py-2.5 text-center text-sm font-bold sm:py-3 ${
                    isUnlocked
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {isUnlocked ? 'Bắt đầu cấp độ' : 'Mở khi đạt 2 sao cấp trước'}
                </div>
              </button>
            );
          })}
        </div>

        {unlockState.open && unlockedLevelData && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-[28px] bg-white p-5 text-center shadow-2xl sm:rounded-[32px] sm:p-8">
              <div className="mx-auto flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-amber-100 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                🔓
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-500 sm:text-sm">
                Mở khóa thành công
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {unlockState.levelTitle}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Bạn nhỏ đã mở được cấp độ mới. Mình vào thử ngay nhé.
              </p>

              <div className="mt-6 grid gap-2 sm:flex sm:justify-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUnlockState({
                      open: false,
                      levelTitle: '',
                      levelId: '',
                    });
                    startLevel(unlockedLevelData);
                  }}
                  className="rounded-full bg-orange-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                >
                  Chơi ngay
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setUnlockState({
                      open: false,
                      levelTitle: '',
                      levelId: '',
                    })
                  }
                  className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  if (viewMode === 'result' || showResult) {
    const finalScore = isQuickMode ? quickModeScore : score;
    const finalSticker = getStickerByStars(earnedStars);
    const nextLevel =
      selectedLevel && !isQuickMode
        ? mathFunLevels[
            mathFunLevels.findIndex((level) => level.id === selectedLevel.id) +
              1
          ]
        : null;

    return (
      <section className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-8">
          {showCelebration && (
            <>
              <div className="pointer-events-none absolute left-6 top-6 animate-bounce text-2xl sm:text-3xl">
                ⭐
              </div>
              <div className="pointer-events-none absolute right-8 top-10 animate-pulse text-xl sm:text-2xl">
                ✨
              </div>
              <div className="pointer-events-none absolute left-1/4 top-16 animate-pulse text-xl sm:text-2xl">
                🌟
              </div>
              <div className="pointer-events-none absolute right-1/4 top-20 animate-bounce text-2xl sm:text-3xl">
                ⭐
              </div>
            </>
          )}

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-4xl shadow-sm sm:h-24 sm:w-24 sm:text-5xl">
            {finalSticker.emoji}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 sm:text-sm">
            Hoàn thành {isQuickMode ? 'thi nhanh' : 'cấp độ'}
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {selectedLevel?.title}
          </h2>

          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Cùng xem kết quả của bé nhé.
          </p>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
              <p className="text-sm font-semibold text-slate-500">
                {isQuickMode ? 'Điểm trong 30 giây' : 'Điểm đạt được'}
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {isQuickMode ? finalScore : `${finalScore}/${questions.length}`}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
              <p className="text-sm font-semibold text-slate-500">Số sao</p>

              <p className="mt-2 text-2xl sm:text-3xl">
                {[1, 2, 3].map((star) => (
                  <span key={star}>{star <= earnedStars ? '⭐' : '☆'}</span>
                ))}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4">
              <p className="text-sm font-semibold text-slate-500">
                Chuỗi tốt nhất
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {bestStreakSession}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:mt-6 sm:p-6">
            <div className="animate-pulse text-5xl sm:text-6xl">
              {rewardSticker.emoji}
            </div>

            <h3 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">
              {rewardSticker.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              {rewardSticker.description}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-2xl bg-sky-50 p-4 text-left">
              <p className="text-sm font-semibold text-sky-700">
                Huy hiệu tốc độ
              </p>

              <p className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                {bestStreakSession >= 4 ? '⚡ Siêu tập trung' : '🌱 Đang tiến bộ'}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Chuỗi đúng tốt nhất của bé là {bestStreakSession} câu liên tiếp.
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-4 text-left">
              <p className="text-sm font-semibold text-violet-700">
                Huy hiệu kết quả
              </p>

              <p className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                {earnedStars === 3
                  ? '👑 Nhà vô địch toán vui'
                  : earnedStars === 2
                    ? '🏅 Bé chăm chỉ'
                    : earnedStars === 1
                      ? '🌟 Bé cố gắng'
                      : '💛 Bé khởi động'}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Bạn nhỏ đã nhận được {earnedStars} sao ở lượt chơi này.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:mt-8 sm:flex sm:justify-center sm:gap-3">
            {nextLevel && !isQuickMode && earnedStars >= 2 && (
              <button
                type="button"
                onClick={() => startLevel(nextLevel)}
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Sang cấp tiếp theo
              </button>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="rounded-full bg-orange-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              {isQuickMode ? 'Chơi lại thi nhanh' : 'Chơi lại cấp độ'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResult(false);
                setViewMode('levels');
              }}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Về danh sách
            </button>

            <Link
              href="/games"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Về kho trò chơi
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!selectedLevel || !currentQuestion) {
    return (
      <section className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 sm:p-8">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Chưa có câu hỏi
          </h2>

          <button
            type="button"
            onClick={() => setViewMode('levels')}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Quay lại
          </button>
        </div>
      </section>
    );
  }

  const subtractionFadeCount =
    currentQuestion.operator === '-' ? Math.min(currentQuestion.right, 6) : 0;

  return (
    <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 rounded-[24px] bg-gradient-to-r from-amber-400 to-orange-400 p-4 text-white shadow-lg sm:mb-6 sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
              {isQuickMode ? 'Thi nhanh 30 giây' : 'Trò chơi toán học'}
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
              {selectedLevel.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              {selectedLevel.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[280px] sm:gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
                {isQuickMode ? 'Điểm hiện tại' : 'Điểm số'}
              </p>

              <p className="mt-1 text-xl font-black sm:text-2xl">
                {isQuickMode ? quickModeScore : score}
              </p>
            </div>

            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
                {isQuickMode ? 'Còn lại' : 'Câu hiện tại'}
              </p>

              <p className="mt-1 text-xl font-black sm:text-2xl">
                {isQuickMode
                  ? `${quickModeTimeLeft}s`
                  : `${currentIndex + 1}/${questions.length}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`rounded-full px-2.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-sm ${
            soundEnabled
              ? 'bg-orange-100 text-orange-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {soundEnabled ? '🔊 Hiệu ứng' : '🔇 Hiệu ứng'}
        </button>

        <button
          type="button"
          onClick={() => setSpeechEnabled((prev) => !prev)}
          className={`rounded-full px-2.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-sm ${
            speechEnabled
              ? 'bg-sky-100 text-sky-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {speechEnabled ? '🗣️ Giọng đọc' : '🤫 Giọng đọc'}
        </button>

        <button
          type="button"
          onClick={speakMathQuestion}
          className="rounded-full bg-white px-2.5 py-2 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:px-4 sm:text-sm"
        >
          {isSpeaking ? 'Đang đọc...' : '🔊 Nghe'}
        </button>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:mb-6 sm:rounded-3xl sm:p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600 sm:text-sm">
          <span>{isQuickMode ? 'Tiến trình thời gian' : 'Tiến độ'}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 sm:h-3">
          <div
            className="h-full rounded-full bg-orange-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-orange-500">
                Quan sát phép tính
              </p>

              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                Bé tính giúp nhé
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setViewMode('levels')}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 sm:px-5 sm:py-3 sm:text-sm"
              >
                Danh sách
              </button>

              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 sm:px-5 sm:py-3 sm:text-sm"
              >
                Quay lại
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-dashed border-orange-200 bg-orange-50 p-3 sm:rounded-[28px] sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-6">
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm sm:rounded-3xl sm:p-5">
                <p className="mb-2 text-xs font-bold text-slate-500 sm:mb-3 sm:text-sm">
                  Nhóm bên trái
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {renderVisualItems(
                    currentQuestion.left,
                    visualSymbol,
                    currentQuestion.operator === '-' ? subtractionFadeCount : 0
                  )}
                </div>

                <p className="mt-3 text-2xl font-black text-slate-900 sm:mt-4 sm:text-3xl">
                  {currentQuestion.left}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3 text-center shadow-sm sm:rounded-3xl sm:p-5">
                <p className="mb-2 text-xs font-bold text-slate-500 sm:mb-3 sm:text-sm">
                  Nhóm bên phải
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {renderVisualItems(currentQuestion.right, visualSymbol)}
                </div>

                <p className="mt-3 text-2xl font-black text-slate-900 sm:mt-4 sm:text-3xl">
                  {currentQuestion.right}
                </p>
              </div>
            </div>

            <div className="mt-5 text-center sm:mt-6">
              <div className="text-5xl font-black tracking-tight text-slate-900 sm:text-8xl">
                {currentQuestion.left} {currentQuestion.operator}{' '}
                {currentQuestion.right}
              </div>

              <p className="mt-2 text-base font-bold text-slate-700 sm:mt-3 sm:text-lg">
                Kết quả bằng bao nhiêu?
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <p className="mb-2 text-sm font-bold text-orange-500">
            Gấu nhỏ nhắn bé
          </p>

          <div className="mb-4 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100 sm:mb-5 sm:rounded-3xl sm:p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm sm:h-14 sm:w-14 sm:text-3xl">
                🐻
              </div>

              <div>
                <p className="text-sm font-bold text-orange-500">Thông điệp</p>

                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {mascotMessage}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                    Chuỗi đúng: {streak}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
                    Tốt nhất: {bestStreakSession}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {streak >= 2 && (
            <div className="mb-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 p-3 text-white shadow-sm sm:mb-5 sm:p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                Combo
              </p>

              <p className="mt-1 text-xl font-black sm:text-2xl">
                🔥 {streak} câu đúng liên tiếp
              </p>
            </div>
          )}

          <p className="mb-1 text-sm font-bold text-orange-500">Chọn đáp án</p>

          <h3 className="mb-4 text-xl font-black text-slate-900 sm:mb-5 sm:text-2xl">
            Toán vui cho bé
          </h3>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {currentQuestion.options.map((answer) => {
              const isSelected = selectedAnswer === answer;
              const isRightAnswer = answer === currentQuestion.correctAnswer;

              let buttonClass =
                'min-h-[56px] rounded-2xl border px-3 py-3 text-center text-xl font-black transition duration-200 active:scale-95 sm:min-h-[72px] sm:px-4 sm:py-5 sm:text-2xl';

              if (selectedAnswer === null) {
                buttonClass +=
                  ' border-slate-200 bg-slate-50 text-slate-800 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50';
              } else if (isSelected && isCorrect) {
                buttonClass +=
                  ' border-emerald-300 bg-emerald-50 text-emerald-700';
              } else if (isSelected && !isCorrect) {
                buttonClass += ' border-rose-300 bg-rose-50 text-rose-700';
              } else if (!isSelected && isRightAnswer && !isCorrect) {
                buttonClass +=
                  ' border-emerald-300 bg-emerald-50 text-emerald-700';
              } else {
                buttonClass += ' border-slate-200 bg-slate-100 text-slate-400';
              }

              return (
                <div key={answer} className="flex items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => handleChooseAnswer(answer)}
                    disabled={selectedAnswer !== null}
                    className={`${buttonClass} flex-1`}
                  >
                    {answer}
                  </button>

                  <button
                    type="button"
                    onClick={() => speakAnswerOption(answer)}
                    className="flex min-h-[56px] w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-base transition hover:bg-slate-50 sm:min-h-[72px] sm:w-14 sm:text-lg"
                    aria-label={`Nghe đáp án ${answer}`}
                  >
                    🔊
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3 sm:mt-6 sm:p-4">
            {isCorrect === null && (
              <p className="text-sm font-medium leading-6 text-slate-600">
                Bé hãy nhìn phép tính, nghe âm thanh và chọn đáp án đúng nhé.
              </p>
            )}

            {isCorrect === true && (
              <div>
                <p className="text-base font-bold text-emerald-600">
                  Giỏi lắm! 🎉
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Bạn nhỏ đã trả lời đúng. Kết quả là{' '}
                  <span className="font-bold">
                    {currentQuestion.correctAnswer}
                  </span>
                  .
                </p>
              </div>
            )}

            {isCorrect === false && (
              <div>
                <p className="text-base font-bold text-rose-600">
                  Chưa đúng rồi 😊
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Đáp án đúng là{' '}
                  <span className="font-bold">
                    {currentQuestion.correctAnswer}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={
              isQuickMode && quickModeTimeLeft === 0
                ? finishLevel
                : handleNextQuestion
            }
            className="mt-4 w-full rounded-2xl bg-orange-400 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-500 sm:mt-6 sm:py-4 sm:text-base"
          >
            {isQuickMode
              ? 'Câu tiếp theo'
              : currentIndex < questions.length - 1
                ? 'Câu tiếp theo'
                : 'Xem kết quả'}
          </button>
        </div>
      </div>
    </section>
  );
}
