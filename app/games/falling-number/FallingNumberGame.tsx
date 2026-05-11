'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

type LevelKey = 'easy' | 'medium' | 'hard' | 'extreme';

type LevelConfig = {
  key: LevelKey;
  label: string;
  badge: string;
  icon: string;
  age: string;
  description: string;
  totalRounds: number;
  targetCoins: number;
  coinPerCorrect: number;
  wrongLimit: number;
  minBase: number;
  maxBase: number;
  steps: number[];
  fallEveryMs: number;
  minFallDuration: number;
  maxFallDuration: number;
  maxVisibleNumbers: number;
};

type FallingNumber = {
  id: string;
  value: number;
  left: number;
  duration: number;
  rotate: number;
  size: number;
};

type StoredScore = {
  gameKey: string;
  gameLabel: string;
  levelKey: LevelKey;
  levelLabel: string;
  score: number;
  total: number;
  accuracy: number;
  coins: number;
  playedAt: string;
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-falling-number-scores';

const levels: LevelConfig[] = [
  {
    key: 'easy',
    label: 'Mức 1: Làm quen',
    badge: 'Dễ',
    icon: '🌱',
    age: '6-7 tuổi',
    description:
      'Bé luyện tìm số tiếp theo với quy luật tăng +1. Tốc độ rơi chậm, đáp án dễ quan sát và dễ bấm.',
    totalRounds: 5,
    targetCoins: 100,
    coinPerCorrect: 20,
    wrongLimit: 5,
    minBase: 0,
    maxBase: 10,
    steps: [1],
    fallEveryMs: 950,
    minFallDuration: 7200,
    maxFallDuration: 9000,
    maxVisibleNumbers: 8,
  },
  {
    key: 'medium',
    label: 'Mức 2: Tăng tốc',
    badge: 'Trung bình',
    icon: '⚡',
    age: '7-8 tuổi',
    description:
      'Bé luyện tăng +1 và +3. Số rơi nhanh hơn, có thêm nhiều đáp án gần đúng để rèn quan sát.',
    totalRounds: 6,
    targetCoins: 200,
    coinPerCorrect: 20,
    wrongLimit: 4,
    minBase: 0,
    maxBase: 30,
    steps: [1, 3],
    fallEveryMs: 820,
    minFallDuration: 6200,
    maxFallDuration: 7800,
    maxVisibleNumbers: 10,
  },
  {
    key: 'hard',
    label: 'Mức 3: Thử thách',
    badge: 'Khó',
    icon: '🔥',
    age: '8-9 tuổi',
    description:
      'Bé luyện tăng +3 và +5 trong phạm vi lớn hơn. Cần phản xạ nhanh và tính nhẩm chắc hơn.',
    totalRounds: 8,
    targetCoins: 300,
    coinPerCorrect: 25,
    wrongLimit: 3,
    minBase: 5,
    maxBase: 70,
    steps: [3, 5],
    fallEveryMs: 700,
    minFallDuration: 5200,
    maxFallDuration: 6800,
    maxVisibleNumbers: 12,
  },
  {
    key: 'extreme',
    label: 'Mức 4: Siêu thử thách',
    badge: 'Cực khó',
    icon: '🚀',
    age: '9-10 tuổi',
    description:
      'Bé luyện tăng +5, +10 và xử lý nhiều số gây nhiễu. Phù hợp khi bé đã tính nhẩm tốt.',
    totalRounds: 10,
    targetCoins: 500,
    coinPerCorrect: 30,
    wrongLimit: 3,
    minBase: 10,
    maxBase: 120,
    steps: [5, 10],
    fallEveryMs: 580,
    minFallDuration: 4300,
    maxFallDuration: 5700,
    maxVisibleNumbers: 14,
  },
];

function getLevelConfig(levelKey: LevelKey) {
  return levels.find((item) => item.key === levelKey) ?? levels[0];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function createRound(level: LevelConfig) {
  const step = randomItem(level.steps);
  const safeMaxBase = Math.max(level.minBase, level.maxBase - step);
  const base = randomInt(level.minBase, safeMaxBase);

  return {
    base,
    step,
    answer: base + step,
  };
}

function createDistractor(answer: number, level: LevelConfig) {
  const offsets = [-10, -5, -3, -2, -1, 1, 2, 3, 5, 10];
  const offset = randomItem(offsets);
  const nearValue = answer + offset;

  if (nearValue >= 0 && Math.random() < 0.75) {
    return nearValue;
  }

  return randomInt(level.minBase, level.maxBase + Math.max(...level.steps));
}

function createFallingNumber(level: LevelConfig, answer: number): FallingNumber {
  const shouldShowCorrect = Math.random() < 0.35;
  const value = shouldShowCorrect ? answer : createDistractor(answer, level);

  return {
    id: `${Date.now()}-${Math.random()}`,
    value,
    left: randomInt(9, 86),
    duration: randomInt(level.minFallDuration, level.maxFallDuration),
    rotate: randomInt(-10, 10),
    size: randomInt(60, 76),
  };
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
  duration = 0.16,
  type: OscillatorType = 'sine',
  volume = 0.045
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

  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.stop(audioContext.currentTime + duration);
}

function playCorrectSound() {
  playTone(660, 0.1, 'triangle', 0.05);
  setTimeout(() => playTone(880, 0.14, 'triangle', 0.05), 110);
}

function playWrongSound() {
  playTone(220, 0.18, 'sawtooth', 0.035);
  setTimeout(() => playTone(170, 0.14, 'sawtooth', 0.03), 150);
}

function playFinishSound() {
  playTone(523, 0.1, 'triangle', 0.05);
  setTimeout(() => playTone(659, 0.1, 'triangle', 0.05), 100);
  setTimeout(() => playTone(784, 0.12, 'triangle', 0.05), 200);
  setTimeout(() => playTone(1046, 0.18, 'triangle', 0.05), 340);
}

function buildQuestionSpeech(base: number, step: number) {
  return `Số tiếp theo của ${base}, khi tăng thêm ${step}, là số nào?`;
}

function buildCorrectSpeech(base: number, step: number, answer: number) {
  return `Chính xác. ${base} cộng ${step} bằng ${answer}.`;
}

function buildWrongSpeech(value: number, base: number, step: number, answer: number) {
  return `Chưa đúng. Bạn nhỏ đã chọn ${value}. Đáp án đúng là ${answer}, vì ${base} cộng ${step} bằng ${answer}.`;
}

function buildFinishSpeech(levelLabel: string, score: number, total: number) {
  return `Bạn nhỏ đã hoàn thành ${levelLabel}. Điểm số là ${score} trên ${total}.`;
}

function formatPlayedAt(value: string) {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

export default function FallingNumberGame() {
  const [selectedLevel, setSelectedLevel] = useState<LevelKey | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [baseNumber, setBaseNumber] = useState(0);
  const [step, setStep] = useState(1);
  const [answer, setAnswer] = useState(1);
  const [fallingNumbers, setFallingNumbers] = useState<FallingNumber[]>([]);
  const [message, setMessage] = useState('Hãy chọn mức độ để bắt đầu nhé!');
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);

  const hasSavedResultRef = useRef(false);

  const levelInfo = selectedLevel ? getLevelConfig(selectedLevel) : null;

  const progress = useMemo(() => {
    if (!levelInfo) return 0;
    if (finished) return 100;

    return Math.min(100, Math.round((coins / levelInfo.targetCoins) * 100));
  }, [coins, finished, levelInfo]);

  const accuracy = useMemo(() => {
    const totalAttempts = score + wrongCount;
    if (totalAttempts === 0) return 0;

    return Math.round((score / totalAttempts) * 100);
  }, [score, wrongCount]);

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  const prepareRound = (level: LevelConfig) => {
    const nextRound = createRound(level);

    setBaseNumber(nextRound.base);
    setStep(nextRound.step);
    setAnswer(nextRound.answer);
    setFallingNumbers([]);
    setMessage(`Nhiệm vụ mới: chọn số ${nextRound.answer}.`);

    window.setTimeout(() => {
      speakText(buildQuestionSpeech(nextRound.base, nextRound.step), {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.08,
      });
    }, 300);
  };

  const startLevelGame = (levelKey: LevelKey) => {
    stopSpeaking();

    const level = getLevelConfig(levelKey);

    setSelectedLevel(levelKey);
    setRound(1);
    setScore(0);
    setCoins(0);
    setWrongCount(0);
    setFinished(false);
    hasSavedResultRef.current = false;

    prepareRound(level);
  };

  const saveFinalResult = (finalScore: number, finalCoins: number) => {
    if (!levelInfo || !selectedLevel) return;
    if (hasSavedResultRef.current) return;

    hasSavedResultRef.current = true;

    const result: StoredScore = {
      gameKey: 'falling-number',
      gameLabel: 'Bắt số đúng',
      levelKey: selectedLevel,
      levelLabel: levelInfo.label,
      score: finalScore,
      total: levelInfo.totalRounds,
      accuracy: Math.round((finalScore / levelInfo.totalRounds) * 100),
      coins: finalCoins,
      playedAt: new Date().toISOString(),
    };

    saveStoredScore(result);
    setHistory(loadStoredScores());
  };

  const finishGame = (finalScore: number, finalCoins: number) => {
    if (!levelInfo) return;

    stopSpeaking();
    playFinishSound();
    setFinished(true);
    setFallingNumbers([]);
    saveFinalResult(finalScore, finalCoins);

    speakText(buildFinishSpeech(levelInfo.label, finalScore, levelInfo.totalRounds), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.05,
    });
  };

  const prepareNextRound = (currentLevel: LevelConfig) => {
    setRound((prev) => prev + 1);
    prepareRound(currentLevel);
  };

  const handleChooseNumber = (item: FallingNumber) => {
    if (!levelInfo || finished) return;

    stopSpeaking();
    setFallingNumbers((prev) => prev.filter((number) => number.id !== item.id));

    if (item.value === answer) {
      const nextScore = score + 1;
      const nextCoins = coins + levelInfo.coinPerCorrect;

      setScore(nextScore);
      setCoins(nextCoins);
      setMessage(`Chính xác! ${baseNumber} + ${step} = ${answer}. Bé nhận ${levelInfo.coinPerCorrect}đ.`);
      playCorrectSound();

      speakText(buildCorrectSpeech(baseNumber, step, answer), {
        lang: 'vi-VN',
        rate: 0.92,
        pitch: 1.1,
      });

      if (nextScore >= levelInfo.totalRounds || nextCoins >= levelInfo.targetCoins) {
        window.setTimeout(() => finishGame(nextScore, nextCoins), 650);
        return;
      }

      window.setTimeout(() => prepareNextRound(levelInfo), 700);
      return;
    }

    const nextWrongCount = wrongCount + 1;
    setWrongCount(nextWrongCount);
    setMessage(`Chưa đúng. Cần chọn ${answer}, vì ${baseNumber} + ${step} = ${answer}.`);
    playWrongSound();

    speakText(buildWrongSpeech(item.value, baseNumber, step, answer), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.02,
    });

    if (nextWrongCount >= levelInfo.wrongLimit) {
      window.setTimeout(() => finishGame(score, coins), 750);
    }
  };

  const handleRemoveFallingNumber = (id: string) => {
    setFallingNumbers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSkipRound = () => {
    if (!levelInfo || finished) return;

    stopSpeaking();
    setMessage('Mình đổi sang câu khác nhé!');

    if (round >= levelInfo.totalRounds) {
      finishGame(score, coins);
      return;
    }

    prepareNextRound(levelInfo);
  };

  const handleRepeatQuestion = () => {
    stopSpeaking();

    speakText(buildQuestionSpeech(baseNumber, step), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.08,
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
    setCoins(0);
    setWrongCount(0);
    setBaseNumber(0);
    setStep(1);
    setAnswer(1);
    setFallingNumbers([]);
    setMessage('Hãy chọn mức độ để bắt đầu nhé!');
    setFinished(false);
    hasSavedResultRef.current = false;
    setHistory(loadStoredScores());
  };

  useEffect(() => {
    if (!levelInfo || finished) return;

    const timer = window.setInterval(() => {
      setFallingNumbers((prev) => {
        const next = [...prev, createFallingNumber(levelInfo, answer)];
        return next.slice(-levelInfo.maxVisibleNumbers);
      });
    }, levelInfo.fallEveryMs);

    return () => window.clearInterval(timer);
  }, [levelInfo, answer, finished]);

  if (!selectedLevel || !levelInfo) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
          <div className="overflow-hidden rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600 sm:text-sm">
                  Trò chơi toán học
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  Bắt số đúng
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                  Số sẽ rơi từ trên xuống. Bé nhìn nhiệm vụ, tính số tiếp theo rồi bấm đúng số đang rơi.
                  Trò chơi giúp bé luyện quy luật tăng dần như +1, +3, +5 và +10.
                </p>
              </div>

              <Link
                href="/games"
                onClick={() => stopSpeaking()}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 sm:w-fit"
              >
                ← Về kho trò chơi
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-4">
              {levels.map((level) => (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => startLevelGame(level.key)}
                  className="group flex min-h-[292px] flex-col rounded-[26px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-100 sm:rounded-[32px] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-4xl shadow-lg shadow-sky-100 transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg] sm:h-20 sm:w-20 sm:rounded-[28px]">
                      {level.icon}
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                      {level.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {level.label}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="rounded-full bg-sky-50 px-3 py-1.5 font-bold text-sky-700">
                      {level.age}
                    </span>

                    <span className="rounded-full bg-amber-50 px-3 py-1.5 font-bold text-amber-700">
                      {level.totalRounds} câu
                    </span>

                    <span className="rounded-full bg-violet-50 px-3 py-1.5 font-bold text-violet-700">
                      Mốc {level.targetCoins}đ
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                    {level.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="inline-flex rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100">
                      Bắt đầu mức này
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[28px] bg-slate-50 p-4 ring-1 ring-slate-100 sm:p-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Luật chơi
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {[
                    'Nhìn phép tăng trên màn hình',
                    'Chọn đúng số đang rơi',
                    'Chọn đúng được cộng tiền thưởng',
                    'Sai quá số lần quy định thì kết thúc lượt chơi',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white px-4 py-4 text-sm font-semibold leading-7 text-slate-700 ring-1 ring-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-emerald-50 p-4 shadow-sm ring-1 ring-emerald-100 sm:p-6">
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
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-black text-slate-900">{item.levelLabel}</div>
                          <div className="text-xs font-bold text-slate-400">{formatPlayedAt(item.playedAt)}</div>
                        </div>

                        <div className="mt-1">
                          Điểm: {item.score}/{item.total} · Tiền: {item.coins}đ · Chính xác: {item.accuracy}%
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
        <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
          <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[3px] shadow-[0_12px_30px_rgba(168,85,247,0.28)]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-5xl">
                  🎉
                </div>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-sky-600 sm:text-sm">
                Hoàn thành trò chơi
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Bé đã hoàn thành {levelInfo.label.toLowerCase()}
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Kết quả đã được lưu lại để phụ huynh xem nhanh những lần chơi gần đây của bé.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-sky-50 p-5 ring-1 ring-sky-100">
                  <p className="text-sm font-bold text-sky-700">Điểm đúng</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {score}/{levelInfo.totalRounds}
                  </p>
                </div>

                <div className="rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-100">
                  <p className="text-sm font-bold text-violet-700">Tiền thưởng</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{coins}đ</p>
                </div>

                <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                  <p className="text-sm font-bold text-emerald-700">Đánh giá</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {score >= levelInfo.totalRounds ? 'Rất tốt' : accuracy >= 60 ? 'Tốt' : 'Cố gắng thêm'}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <button
                  type="button"
                  onClick={handleRestartSameLevel}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl sm:w-auto"
                >
                  Chơi lại mức này
                </button>

                <button
                  type="button"
                  onClick={handleBackToLevels}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
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
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
                >
                  🔊 Nghe kết quả
                </button>

                <Link
                  href="/games"
                  onClick={() => stopSpeaking()}
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md sm:w-auto"
                >
                  Về kho trò chơi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleBackToLevels}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 sm:w-auto"
          >
            ← Chọn mức khác
          </button>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700 ring-1 ring-violet-100 sm:text-sm">
              {levelInfo.label}
            </span>

            <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-black text-sky-700 ring-1 ring-sky-100 sm:text-sm">
              Câu {round}/{levelInfo.totalRounds}
            </span>

            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700 ring-1 ring-amber-100 sm:text-sm">
              Tiền: {coins}/{levelInfo.targetCoins}đ
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:gap-6 xl:grid-cols-[360px_1fr] 2xl:grid-cols-[390px_1fr]">
          <aside className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
            <div className="inline-flex rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-500 sm:text-sm">
              🔢 Bắt số đúng
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Bé hãy chọn đúng số đang rơi
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Bé tính số tiếp theo theo quy luật tăng, sau đó bấm đúng số đang rơi trong khu vực chơi.
            </p>

            <div className="mt-5 rounded-[24px] bg-gradient-to-br from-amber-100 via-orange-50 to-red-50 p-4 ring-1 ring-amber-100 sm:rounded-[28px] sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600 sm:text-sm">
                Nhiệm vụ
              </p>

              <div className="mt-4 rounded-[22px] bg-white p-4 text-center shadow-sm ring-1 ring-orange-100">
                <p className="text-sm font-bold text-slate-500">Số tiếp theo của</p>

                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-5xl font-black text-orange-500 sm:text-6xl">{baseNumber}</span>
                  <span className="rounded-full bg-sky-50 px-4 py-2 text-lg font-black text-sky-700 sm:text-xl">
                    +{step}
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold text-slate-500">là số nào?</p>
              </div>

              <button
                type="button"
                onClick={handleRepeatQuestion}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-white px-4 py-2.5 text-sm font-black text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50 sm:w-auto"
              >
                🔊 Nghe nhiệm vụ
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-bold text-slate-500 sm:text-sm">Đáp án cần bắt</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{answer}</p>
              </div>

              <div className="rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
                <p className="text-xs font-bold text-slate-500 sm:text-sm">Điểm đúng</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{score}</p>
              </div>
            </div>

            <div className="mt-3 rounded-[20px] bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 ring-1 ring-rose-100">
              Lượt sai: {wrongCount}/{levelInfo.wrongLimit}
            </div>

            <div className="mt-5 rounded-[24px] bg-sky-50 p-4 text-sm font-bold leading-6 text-sky-800 ring-1 ring-sky-100">
              {message}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                  <span>Tiến độ mốc tiền</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSkipRound}
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Đổi câu khác
              </button>
            </div>
          </aside>

          <div className="relative min-h-[480px] overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-200 via-emerald-100 to-lime-100 shadow-sm ring-1 ring-slate-100 sm:min-h-[600px] sm:rounded-[36px] lg:min-h-[660px]">
            <div className="absolute left-6 top-8 h-24 w-24 rounded-full bg-yellow-200/80 blur-sm sm:left-8" />
            <div className="absolute left-0 right-0 top-0 h-32 bg-white/25" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-500/50 to-transparent" />

            <div className="absolute left-1/2 top-4 z-20 w-[92%] -translate-x-1/2 rounded-[24px] bg-white/90 p-3 text-center shadow-lg backdrop-blur ring-1 ring-white sm:top-8 sm:w-auto sm:rounded-[26px] sm:px-8 sm:py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600 sm:text-sm">Hãy bắt số</p>
              <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl font-black text-slate-900 sm:text-3xl">{baseNumber}</span>
                <span className="text-xl font-black text-sky-600 sm:text-2xl">+ {step}</span>
                <span className="text-xl font-black text-slate-400 sm:text-2xl">=</span>
                <span className="rounded-full bg-orange-100 px-4 py-2 text-2xl font-black text-orange-600 sm:px-5 sm:text-3xl">
                  ?
                </span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden">
              {fallingNumbers.map((item) => {
                const animationName = `fall-${item.id.replace(/[^a-zA-Z0-9]/g, '')}`;
                const size = Math.max(item.size, 62);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChooseNumber(item)}
                    onAnimationEnd={() => handleRemoveFallingNumber(item.id)}
                    className="absolute -top-20 z-10 flex items-center justify-center rounded-full bg-white font-black text-sky-800 shadow-xl ring-4 ring-white/80 transition hover:scale-110 active:scale-95 sm:hover:scale-125"
                    style={{
                      left: `${item.left}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      fontSize: `${Math.max(24, size * 0.42)}px`,
                      transform: `translateX(-50%) rotate(${item.rotate}deg)`,
                      animation: `${animationName} ${item.duration}ms linear forwards`,
                    }}
                    aria-label={`Chọn số ${item.value}`}
                  >
                    {item.value}

                    <style>{`
                      @keyframes ${animationName} {
                        from { top: -90px; opacity: 1; }
                        to { top: calc(100% + 100px); opacity: 0.92; }
                      }
                    `}</style>
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-3 left-3 right-3 rounded-[22px] bg-white/90 p-3 shadow-lg backdrop-blur ring-1 ring-white sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[28px] sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-black leading-6 text-slate-700">
                  Mục tiêu: chọn đúng số <span className="text-orange-500">{answer}</span> để nhận{' '}
                  <span className="text-sky-600">{levelInfo.coinPerCorrect}đ</span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: levelInfo.totalRounds }, (_, index) => (
                    <span
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black sm:h-9 sm:w-9 ${
                        index < score
                          ? 'bg-emerald-100 text-emerald-700'
                          : index + 1 === round
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
