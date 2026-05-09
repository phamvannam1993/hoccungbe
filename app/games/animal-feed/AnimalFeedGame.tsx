'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

type LevelKey = 'easy' | 'medium' | 'hard';

type LevelConfig = {
  key: LevelKey;
  label: string;
  icon: string;
  badge: string;
  age: string;
  description: string;
  totalRounds: number;
  minTarget: number;
  maxTarget: number;
  foodCount: number;
  hasDistractors: boolean;
};

type Animal = {
  id: string;
  name: string;
  emoji: string;
  foodName: string;
  foodEmoji: string;
};

type FoodItem = {
  id: number;
  emoji: string;
  label: string;
  isCorrect: boolean;
  x: number;
  y: number;
  rotate: number;
  delay: number;
};

type StoredScore = {
  gameKey: string;
  gameLabel: string;
  levelKey: LevelKey;
  levelLabel: string;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-animal-feed-scores';

const animals: Animal[] = [
  {
    id: 'rabbit',
    name: 'thỏ',
    emoji: '🐰',
    foodName: 'củ cà rốt',
    foodEmoji: '🥕',
  },
  {
    id: 'cat',
    name: 'mèo',
    emoji: '🐱',
    foodName: 'con cá',
    foodEmoji: '🐟',
  },
  {
    id: 'dog',
    name: 'chó',
    emoji: '🐶',
    foodName: 'khúc xương',
    foodEmoji: '🦴',
  },
  {
    id: 'monkey',
    name: 'khỉ',
    emoji: '🐵',
    foodName: 'quả chuối',
    foodEmoji: '🍌',
  },
  {
    id: 'bird',
    name: 'chim',
    emoji: '🐦',
    foodName: 'hạt ngô',
    foodEmoji: '🌽',
  },
  {
    id: 'bear',
    name: 'gấu',
    emoji: '🐻',
    foodName: 'hũ mật ong',
    foodEmoji: '🍯',
  },
];

const distractorFoods = [
  { emoji: '🍎', label: 'quả táo' },
  { emoji: '🍓', label: 'quả dâu' },
  { emoji: '🍪', label: 'bánh quy' },
  { emoji: '🥦', label: 'bông cải' },
  { emoji: '🍞', label: 'ổ bánh mì' },
  { emoji: '🧀', label: 'miếng phô mai' },
];

const levels: LevelConfig[] = [
  {
    key: 'easy',
    label: 'Mức 1: Làm quen',
    icon: '🐰',
    badge: 'Dễ',
    age: '4-5 tuổi',
    description:
      'Bé cho con vật ăn trong phạm vi 1 đến 5, chưa có đồ ăn gây nhiễu, phù hợp để làm quen với đếm số.',
    totalRounds: 5,
    minTarget: 1,
    maxTarget: 5,
    foodCount: 8,
    hasDistractors: false,
  },
  {
    key: 'medium',
    label: 'Mức 2: Tăng tốc',
    icon: '🧺',
    badge: 'Trung bình',
    age: '5-6 tuổi',
    description:
      'Bé cho con vật ăn trong phạm vi 4 đến 10, có thêm một vài đồ ăn khác để rèn khả năng quan sát.',
    totalRounds: 6,
    minTarget: 4,
    maxTarget: 10,
    foodCount: 14,
    hasDistractors: true,
  },
  {
    key: 'hard',
    label: 'Mức 3: Thử thách',
    icon: '🌳',
    badge: 'Nâng cao',
    age: '6-7 tuổi',
    description:
      'Bé cho con vật ăn trong phạm vi 8 đến 15, nhiều đồ ăn hơn và cần chọn đúng loại thức ăn.',
    totalRounds: 7,
    minTarget: 8,
    maxTarget: 15,
    foodCount: 20,
    hasDistractors: true,
  },
];

function getLevelConfig(levelKey: LevelKey) {
  return levels.find((item) => item.key === levelKey) ?? levels[0];
}

function getRandomAnimal() {
  return animals[Math.floor(Math.random() * animals.length)];
}

function createTargetNumber(level: LevelConfig) {
  return level.minTarget + Math.floor(Math.random() * (level.maxTarget - level.minTarget + 1));
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function createFoodItems(level: LevelConfig, animal: Animal, target: number): FoodItem[] {
  const correctFoodCount = Math.max(target + 2, Math.ceil(level.foodCount * 0.65));
  const wrongFoodCount = level.hasDistractors
    ? Math.max(level.foodCount - correctFoodCount, 3)
    : 0;

  const correctItems = Array.from({ length: correctFoodCount }, (_, index) => ({
    id: index + 1,
    emoji: animal.foodEmoji,
    label: animal.foodName,
    isCorrect: true,
    x: 7 + Math.random() * 84,
    y: 8 + Math.random() * 72,
    rotate: -18 + Math.random() * 36,
    delay: Math.random() * 0.8,
  }));

  const wrongItems = Array.from({ length: wrongFoodCount }, (_, index) => {
    const wrongFood = distractorFoods[Math.floor(Math.random() * distractorFoods.length)];

    return {
      id: correctFoodCount + index + 1,
      emoji: wrongFood.emoji,
      label: wrongFood.label,
      isCorrect: false,
      x: 7 + Math.random() * 84,
      y: 8 + Math.random() * 72,
      rotate: -18 + Math.random() * 36,
      delay: Math.random() * 0.8,
    };
  });

  return shuffleArray([...correctItems, ...wrongItems]).map((item, index) => ({
    ...item,
    id: index + 1,
  }));
}

function buildQuestionSpeech(animal: Animal, target: number) {
  return `Bạn nhỏ hãy cho ${animal.name} ăn đúng ${target} ${animal.foodName}.`;
}

function buildFeedSpeech(count: number, target: number, animal: Animal) {
  if (count === target) {
    return `Giỏi lắm. Bạn nhỏ đã cho ${animal.name} ăn đủ ${target} ${animal.foodName}.`;
  }

  if (count < target) {
    return `Bạn nhỏ đã cho ${animal.name} ăn ${count} ${animal.foodName}. Hãy cho ăn thêm ${
      target - count
    } nữa nhé.`;
  }

  return `Bạn nhỏ cho ăn hơi nhiều rồi nhé.`;
}

function buildWrongFoodSpeech(animal: Animal) {
  return `${animal.name} không ăn món này. Bạn nhỏ hãy chọn ${animal.foodName} nhé.`;
}

function buildCorrectSpeech(animal: Animal, target: number) {
  return `Chính xác rồi. Bạn nhỏ đã cho ${animal.name} ăn đúng ${target} ${animal.foodName}.`;
}

function buildWrongSpeech(count: number, target: number, animal: Animal) {
  if (count < target) {
    return `Chưa đủ nhé. Bạn nhỏ mới cho ${animal.name} ăn ${count} ${animal.foodName}. Cần đủ ${target}.`;
  }

  return `Bạn nhỏ cho ${animal.name} ăn hơi nhiều rồi. Nhiệm vụ yêu cầu ${target} ${animal.foodName}.`;
}

function buildFinishSpeech(levelLabel: string, score: number, total: number) {
  return `Bạn nhỏ đã hoàn thành ${levelLabel}. Điểm số của bạn nhỏ là ${score} trên ${total}.`;
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

function playTone(
  frequency: number,
  duration = 0.18,
  type: OscillatorType = 'sine',
  volume = 0.05
) {
  if (typeof window === 'undefined') return;

  const AudioCtx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtx) return;

  const audioContext = new AudioCtx();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );

  oscillator.stop(audioContext.currentTime + duration);
}

function playFeedSound() {
  playTone(520, 0.08, 'triangle', 0.04);
  setTimeout(() => playTone(680, 0.08, 'triangle', 0.035), 70);
}

function playCorrectSound() {
  playTone(660, 0.12, 'triangle', 0.05);
  setTimeout(() => playTone(880, 0.18, 'triangle', 0.05), 120);
}

function playWrongSound() {
  playTone(220, 0.2, 'sawtooth', 0.035);
  setTimeout(() => playTone(180, 0.16, 'sawtooth', 0.03), 160);
}

function playResetSound() {
  playTone(360, 0.1, 'sine', 0.035);
  setTimeout(() => playTone(300, 0.12, 'sine', 0.03), 100);
}

function playNextRoundSound() {
  playTone(440, 0.1, 'triangle', 0.04);
  setTimeout(() => playTone(560, 0.1, 'triangle', 0.04), 100);
  setTimeout(() => playTone(720, 0.14, 'triangle', 0.04), 200);
}

function playFinishSound() {
  playTone(523, 0.12, 'triangle', 0.05);
  setTimeout(() => playTone(659, 0.12, 'triangle', 0.05), 120);
  setTimeout(() => playTone(784, 0.14, 'triangle', 0.05), 240);
  setTimeout(() => playTone(1046, 0.22, 'triangle', 0.05), 380);
}

export default function AnimalFeedGame() {
  const [selectedLevel, setSelectedLevel] = useState<LevelKey | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(0);
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [fedFoodIds, setFedFoodIds] = useState<number[]>([]);
  const [wrongFoodCount, setWrongFoodCount] = useState(0);
  const [message, setMessage] = useState('Hãy chọn mức độ để bắt đầu nhé!');
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);

  const hasSavedResultRef = useRef(false);

  const levelInfo = selectedLevel ? getLevelConfig(selectedLevel) : null;
  const fedCount = fedFoodIds.length;

  const progress = useMemo(() => {
    if (!levelInfo) return 0;
    if (finished) return 100;

    return Math.round((round / levelInfo.totalRounds) * 100);
  }, [round, finished, levelInfo]);

  const accuracy = useMemo(() => {
    if (!levelInfo) return 0;

    return Math.round((score / levelInfo.totalRounds) * 100);
  }, [score, levelInfo]);

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  const prepareRound = (level: LevelConfig) => {
    const nextAnimal = getRandomAnimal();
    const nextTarget = createTargetNumber(level);
    const nextFoods = createFoodItems(level, nextAnimal, nextTarget);

    setAnimal(nextAnimal);
    setTarget(nextTarget);
    setFoodItems(nextFoods);
    setFedFoodIds([]);
    setWrongFoodCount(0);
    setShowResult(false);
    setMessage('Nhiệm vụ mới đã sẵn sàng!');

    setTimeout(() => {
      speakText(buildQuestionSpeech(nextAnimal, nextTarget), {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.08,
      });
    }, 350);
  };

  const startLevelGame = (levelKey: LevelKey) => {
    stopSpeaking();

    const level = getLevelConfig(levelKey);

    setSelectedLevel(levelKey);
    setRound(1);
    setScore(0);
    setFinished(false);
    hasSavedResultRef.current = false;

    prepareRound(level);
  };

  const saveFinalResult = (finalScore: number) => {
    if (!levelInfo || !selectedLevel) return;
    if (hasSavedResultRef.current) return;

    hasSavedResultRef.current = true;

    const result: StoredScore = {
      gameKey: 'animal-feed',
      gameLabel: 'Cho thú ăn đúng số lượng',
      levelKey: selectedLevel,
      levelLabel: levelInfo.label,
      score: finalScore,
      total: levelInfo.totalRounds,
      accuracy: Math.round((finalScore / levelInfo.totalRounds) * 100),
      playedAt: new Date().toISOString(),
    };

    saveStoredScore(result);
    setHistory(loadStoredScores());
  };

  const handleChooseFood = (food: FoodItem) => {
    if (!levelInfo || !animal) return;
    if (finished || showResult) return;
    if (fedFoodIds.includes(food.id)) return;

    stopSpeaking();

    if (!food.isCorrect) {
      setWrongFoodCount((prev) => prev + 1);
      setMessage(`${animal.name} không ăn ${food.label}. Bé hãy chọn ${animal.foodName} nhé.`);
      playWrongSound();

      speakText(buildWrongFoodSpeech(animal), {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.02,
      });

      return;
    }

    const nextFedFoodIds = [...fedFoodIds, food.id];

    setFedFoodIds(nextFedFoodIds);
    setMessage(`Bé đã cho ${animal.name} ăn ${nextFedFoodIds.length}/${target} ${animal.foodName}.`);
    playFeedSound();

    speakText(buildFeedSpeech(nextFedFoodIds.length, target, animal), {
      lang: 'vi-VN',
      rate: 0.92,
      pitch: 1.1,
    });
  };

  const handleCheck = () => {
    if (!levelInfo || !animal) return;
    if (finished) return;

    stopSpeaking();
    setShowResult(true);

    if (fedCount === target) {
      setScore((prev) => prev + 1);
      setMessage(`Chính xác rồi! Bé đã cho ${animal.name} ăn đúng ${target} ${animal.foodName} ${animal.foodEmoji}`);
      playCorrectSound();

      speakText(buildCorrectSpeech(animal, target), {
        lang: 'vi-VN',
        rate: 0.92,
        pitch: 1.12,
      });

      return;
    }

    setMessage(
      fedCount < target
        ? `Chưa đủ nhé. Bé cần cho ăn thêm ${target - fedCount} ${animal.foodName} nữa.`
        : `Bé cho ăn hơi nhiều rồi. Nhiệm vụ chỉ cần ${target} ${animal.foodName}.`
    );

    playWrongSound();

    speakText(buildWrongSpeech(fedCount, target, animal), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.02,
    });
  };

  const handleNext = () => {
    if (!levelInfo) return;
    if (!showResult) return;

    stopSpeaking();

    const latestScore = score;

    if (round === levelInfo.totalRounds) {
      playFinishSound();
      setFinished(true);
      saveFinalResult(latestScore);

      speakText(buildFinishSpeech(levelInfo.label, latestScore, levelInfo.totalRounds), {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.05,
      });

      return;
    }

    playNextRoundSound();

    setRound((prev) => prev + 1);
    prepareRound(levelInfo);
  };

  const handleResetRound = () => {
    if (!levelInfo || !animal) return;

    stopSpeaking();
    playResetSound();

    setFedFoodIds([]);
    setWrongFoodCount(0);
    setShowResult(false);
    setMessage('Mình thử cho ăn lại vòng này nhé!');

    speakText(`Mình thử lại nhé. Bạn nhỏ hãy cho ${animal.name} ăn đúng ${target} ${animal.foodName}.`, {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.05,
    });
  };

  const handleRestartSameLevel = () => {
    if (!selectedLevel) return;

    startLevelGame(selectedLevel);
  };

  const handleBackToLevels = () => {
    stopSpeaking();

    setSelectedLevel(null);
    setRound(1);
    setScore(0);
    setTarget(0);
    setAnimal(null);
    setFoodItems([]);
    setFedFoodIds([]);
    setWrongFoodCount(0);
    setMessage('Hãy chọn mức độ để bắt đầu nhé!');
    setShowResult(false);
    setFinished(false);
    hasSavedResultRef.current = false;
    setHistory(loadStoredScores());
  };

  if (!selectedLevel || !levelInfo) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Trò chơi toán học
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Cho thú ăn đúng số lượng
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé nghe nhiệm vụ, quan sát con vật và chọn đúng số lượng đồ ăn.
                Trò chơi giúp bé luyện đếm số, làm theo hướng dẫn và tập trung khi thao tác.
              </p>
            </div>

            <Link
              href="/games"
              onClick={() => stopSpeaking()}
              className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            >
              ← Về kho trò chơi
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-3 md:gap-5">
            {levels.map((level) => (
              <button
                key={level.key}
                type="button"
                onClick={() => startLevelGame(level.key)}
                className="group rounded-[24px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[30px] sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)] transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
                    <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-4xl shadow-inner">
                      {level.icon}
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {level.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                  {level.label}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">
                    {level.age}
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                    {level.totalRounds} câu
                  </span>

                  <span className="rounded-full bg-violet-50 px-3 py-1.5 font-semibold text-violet-700">
                    {level.minTarget}-{level.maxTarget} món
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {level.description}
                </p>

                <div className="mt-5 inline-flex rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100">
                  Bắt đầu mức này
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
                  'Đếm số lượng chính xác',
                  'Làm theo nhiệm vụ được nghe',
                  'Chọn đúng loại đồ ăn',
                  'Tập trung và quan sát tốt hơn',
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
                    Chưa có lượt chơi nào được lưu. Hãy chọn một mức độ để bắt đầu.
                  </div>
                ) : (
                  history.slice(0, 4).map((item, index) => (
                    <div
                      key={`${item.playedAt}-${index}`}
                      className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
                    >
                      <div className="font-bold text-slate-900">
                        {item.levelLabel}
                      </div>

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
    return (
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[3px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                🎉
              </div>
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Hoàn thành trò chơi
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Bạn nhỏ đã hoàn thành {levelInfo.label.toLowerCase()}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Kết quả đã được lưu lại để phụ huynh xem nhanh những lần chơi gần đây của bé.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-sky-700">Điểm số</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {score}/{levelInfo.totalRounds}
                </p>
              </div>

              <div className="rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-100">
                <p className="text-sm font-semibold text-violet-700">Độ chính xác</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {accuracy}%
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <p className="text-sm font-semibold text-emerald-700">Đánh giá</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {accuracy >= 90 ? 'Rất tốt' : accuracy >= 60 ? 'Tốt' : 'Cố gắng thêm'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                type="button"
                onClick={handleRestartSameLevel}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl sm:w-auto"
              >
                Chơi lại mức này
              </button>

              <button
                type="button"
                onClick={handleBackToLevels}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
              >
                Chọn mức khác
              </button>

              <button
                type="button"
                onClick={() =>
                  speakText(buildFinishSpeech(levelInfo.label, score, levelInfo.totalRounds), {
                    lang: 'vi-VN',
                    rate: 0.9,
                    pitch: 1.05,
                  })
                }
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
              >
                🔊 Nghe kết quả
              </button>

              <Link
                href="/games"
                onClick={() => stopSpeaking()}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
              >
                Về kho trò chơi
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!animal) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleBackToLevels}
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 sm:w-auto"
        >
          ← Chọn mức khác
        </button>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
            {levelInfo.label}
          </span>

          <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
            Vòng {round}/{levelInfo.totalRounds}
          </span>

          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
            Điểm: {score}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 xl:grid-cols-[390px_1fr]">
        <aside className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <div className="inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-orange-500">
            🐾 Cho thú ăn
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
            Bé hãy cho thú ăn đúng số lượng
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Bé chọn đúng món ăn của con vật. Khi đã cho ăn xong, bé bấm kiểm tra
            để biết mình đã làm đúng chưa.
          </p>

          <div className="mt-5 rounded-[24px] bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 p-4 ring-1 ring-amber-100 sm:mt-6 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
              Nhiệm vụ
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white text-5xl shadow-sm ring-1 ring-orange-100">
                {animal.emoji}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-500">Cho {animal.name} ăn</p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-5xl font-black text-orange-500 sm:text-6xl">
                    {target}
                  </span>

                  <span className="pb-2 text-lg font-black text-slate-800">
                    {animal.foodName}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                speakText(buildQuestionSpeech(animal, target), {
                  lang: 'vi-VN',
                  rate: 0.9,
                  pitch: 1.08,
                })
              }
              className="mt-5 inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              🔊 Nghe nhiệm vụ
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-bold text-slate-500">Đã cho ăn</p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {fedCount}
              </p>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-bold text-slate-500">Cần cho ăn</p>
              <p className="mt-1 text-3xl font-black text-slate-900">
                {target}
              </p>
            </div>
          </div>

          {levelInfo.hasDistractors && (
            <div className="mt-3 rounded-[20px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-100">
              Món chọn sai: {wrongFoodCount}
            </div>
          )}

          <div className="mt-5 rounded-[24px] bg-sky-50 p-4 text-sm font-bold leading-6 text-sky-800 ring-1 ring-sky-100">
            {message}
          </div>

          <div className="mt-6 space-y-4">
            <div>
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

            <div className="flex flex-col gap-3">
              {!showResult ? (
                <button
                  type="button"
                  onClick={handleCheck}
                  className="rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:from-emerald-600 hover:to-sky-600 hover:shadow-xl"
                >
                  {round === levelInfo.totalRounds ? 'Xem kết quả' : 'Vòng tiếp theo'}
                </button>
              )}

              <button
                type="button"
                onClick={handleResetRound}
                className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Cho ăn lại vòng này
              </button>
            </div>
          </div>
        </aside>

        <div className="relative min-h-[430px] overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-200 via-emerald-100 to-lime-100 shadow-sm ring-1 ring-slate-100 sm:min-h-[540px] sm:rounded-[36px] lg:min-h-[620px] xl:min-h-[650px]">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-yellow-200/80 blur-sm" />
          <div className="absolute left-0 right-0 top-0 h-32 bg-white/25" />
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-green-500/50 to-transparent" />

          <div className="absolute left-1/2 top-8 -translate-x-1/2 sm:top-10">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/90 text-7xl shadow-xl ring-1 ring-white sm:h-44 sm:w-44 sm:text-8xl">
              {animal.emoji}
            </div>

            <div className="mx-auto mt-3 w-fit rounded-full bg-white/90 px-5 py-2 text-center text-sm font-black text-slate-700 shadow-sm ring-1 ring-white">
              {animal.name.toUpperCase()} thích ăn {animal.foodEmoji}
            </div>
          </div>

          <div className="absolute inset-x-3 bottom-28 top-52 sm:inset-x-6 sm:bottom-32 sm:top-64">
            {foodItems.map((food) => {
              const isFed = fedFoodIds.includes(food.id);

              return (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleChooseFood(food)}
                  disabled={isFed || showResult}
                  className={`absolute flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl shadow-lg ring-1 ring-white transition duration-300 sm:h-14 sm:w-14 sm:text-4xl ${
                    isFed
                      ? 'scale-75 opacity-20'
                      : 'hover:scale-125 active:scale-95'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{
                    left: `${food.x}%`,
                    top: `${food.y}%`,
                    transform: `translate(-50%, -50%) rotate(${food.rotate}deg)`,
                    transitionDelay: `${food.delay}s`,
                  }}
                  aria-label={food.label}
                >
                  <span className="drop-shadow-[0_8px_10px_rgba(15,23,42,0.18)]">
                    {food.emoji}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-3 right-3 rounded-[22px] bg-white/90 p-3 shadow-lg backdrop-blur ring-1 ring-white sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[28px] sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black text-slate-700">
                Mục tiêu: cho {animal.name} ăn đúng{' '}
                <span className="text-orange-500">{target}</span> {animal.foodName}
              </p>

              <div className="flex flex-wrap gap-1">
                {Array.from({ length: target }, (_, index) => (
                  <span
                    key={index}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-base sm:h-9 sm:w-9 sm:text-lg ${
                      index < fedCount
                        ? 'bg-orange-100'
                        : 'bg-slate-100 grayscale'
                    }`}
                  >
                    {animal.foodEmoji}
                  </span>
                ))}
              </div>
            </div>

            {showResult && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${
                  fedCount === target
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                }`}
              >
                {fedCount === target
                  ? `Chính xác rồi. Bé đã cho ${animal.name} ăn đúng ${target} ${animal.foodName}.`
                  : `Chưa đúng nhé. Bé đã cho ăn ${fedCount} món, nhiệm vụ là ${target} ${animal.foodName}.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
