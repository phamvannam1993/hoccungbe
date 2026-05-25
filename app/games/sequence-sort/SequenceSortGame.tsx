'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

type LevelKey = 'easy' | 'medium' | 'hard';
type SortDirection = 'asc' | 'desc';

type LevelConfig = {
  key: LevelKey;
  label: string;
  icon: string;
  badge: string;
  age: string;
  description: string;
  totalRounds: number;
  minNumber: number;
  maxNumber: number;
  itemCount: number;
  directions: SortDirection[];
};

type SortQuestion = {
  numbers: number[];
  direction: SortDirection;
  answer: number[];
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

const LOCAL_STORAGE_KEY = 'hoc-cung-be-sequence-sort-scores';

const levels: LevelConfig[] = [
  {
    key: 'easy',
    label: 'Mức 1: Làm quen',
    icon: '📏',
    badge: 'Dễ',
    age: '5-6 tuổi',
    description:
      'Bé sắp xếp 4 số trong phạm vi 1 đến 10, phù hợp để làm quen với thứ tự tăng dần và giảm dần.',
    totalRounds: 5,
    minNumber: 1,
    maxNumber: 10,
    itemCount: 4,
    directions: ['asc', 'desc'],
  },
  {
    key: 'medium',
    label: 'Mức 2: Tăng tốc',
    icon: '🔢',
    badge: 'Trung bình',
    age: '5-7 tuổi',
    description:
      'Bé sắp xếp 6 số trong phạm vi 1 đến 20, giúp rèn khả năng so sánh và ghi nhớ thứ tự số.',
    totalRounds: 6,
    minNumber: 1,
    maxNumber: 20,
    itemCount: 6,
    directions: ['asc', 'desc'],
  },
  {
    key: 'hard',
    label: 'Mức 3: Thử thách',
    icon: '🧠',
    badge: 'Nâng cao',
    age: '6-8 tuổi',
    description:
      'Bé sắp xếp 7 số trong phạm vi 1 đến 50, các số có thể gần nhau hơn để tăng độ thử thách.',
    totalRounds: 7,
    minNumber: 1,
    maxNumber: 50,
    itemCount: 7,
    directions: ['asc', 'desc'],
  },
];

function getLevelConfig(levelKey: LevelKey) {
  return levels.find((item) => item.key === levelKey) ?? levels[0];
}

function randomBetween(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function createUniqueNumbers(level: LevelConfig) {
  const values = new Set<number>();

  while (values.size < level.itemCount) {
    values.add(randomBetween(level.minNumber, level.maxNumber));
  }

  return shuffleArray(Array.from(values));
}

function createQuestion(level: LevelConfig): SortQuestion {
  const numbers = createUniqueNumbers(level);
  const direction = level.directions[Math.floor(Math.random() * level.directions.length)];

  const answer = [...numbers].sort((a, b) =>
    direction === 'asc' ? a - b : b - a
  );

  return {
    numbers,
    direction,
    answer,
  };
}

function getDirectionLabel(direction: SortDirection) {
  return direction === 'asc' ? 'từ bé đến lớn' : 'từ lớn đến bé';
}

function buildQuestionSpeech(question: SortQuestion) {
  return `Bạn nhỏ hãy sắp xếp các số ${question.numbers.join(', ')} theo thứ tự ${getDirectionLabel(
    question.direction
  )}.`;
}

function buildCorrectSpeech() {
  return 'Chính xác rồi. Bạn nhỏ đã sắp xếp đúng dãy số.';
}

function buildWrongSpeech() {
  return 'Chưa đúng nhé. Bạn nhỏ hãy kiểm tra lại thứ tự các số.';
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

function playTapSound() {
  playTone(500, 0.08, 'triangle', 0.04);
  setTimeout(() => playTone(640, 0.08, 'triangle', 0.035), 70);
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

export default function SequenceSortGame() {
  const [selectedLevel, setSelectedLevel] = useState<LevelKey | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<SortQuestion | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [message, setMessage] = useState('Hãy chọn mức độ để bắt đầu nhé!');
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);

  const hasSavedResultRef = useRef(false);

  const levelInfo = selectedLevel ? getLevelConfig(selectedLevel) : null;

  const progress = useMemo(() => {
    if (!levelInfo) return 0;
    if (finished) return 100;

    return Math.round((round / levelInfo.totalRounds) * 100);
  }, [round, finished, levelInfo]);

  const accuracy = useMemo(() => {
    if (!levelInfo) return 0;

    return Math.round((score / levelInfo.totalRounds) * 100);
  }, [score, levelInfo]);

  const isComplete = useMemo(() => {
    if (!question) return false;

    return selectedNumbers.length === question.numbers.length;
  }, [question, selectedNumbers]);

  const remainingNumbers = useMemo(() => {
    if (!question) return [];

    return question.numbers.filter((num) => !selectedNumbers.includes(num));
  }, [question, selectedNumbers]);

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  const prepareRound = (level: LevelConfig) => {
    const nextQuestion = createQuestion(level);

    setQuestion(nextQuestion);
    setSelectedNumbers([]);
    setShowResult(false);
    setMessage('Nhiệm vụ mới đã sẵn sàng!');

    setTimeout(() => {
      speakText(buildQuestionSpeech(nextQuestion), {
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
      gameKey: 'sequence-sort',
      gameLabel: 'Sắp xếp số theo thứ tự',
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

  const handlePickNumber = (num: number) => {
    if (!question) return;
    if (finished || showResult) return;
    if (selectedNumbers.includes(num)) return;

    playTapSound();

    setSelectedNumbers((prev) => [...prev, num]);
    setMessage('Bé hãy tiếp tục chọn số theo đúng thứ tự nhé!');
  };

  const handleRemoveLast = () => {
    if (showResult) return;

    playResetSound();

    setSelectedNumbers((prev) => prev.slice(0, -1));
    setMessage('Đã xóa số vừa chọn. Bé chọn lại nhé!');
  };

  const handleRemoveSelectedNumber = (indexToRemove: number) => {
    if (showResult) return;
  
    playResetSound();
  
    setSelectedNumbers((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  
    setMessage('Đã đưa số về lại danh sách chọn. Bé chọn tiếp nhé!');
  };

  const handleResetRound = () => {
    if (!question) return;

    stopSpeaking();
    playResetSound();

    setSelectedNumbers([]);
    setShowResult(false);
    setMessage('Mình thử lại câu này nhé!');

    speakText(buildQuestionSpeech(question), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.05,
    });
  };

  const checkAnswer = () => {
    if (!levelInfo || !question) return;
    if (finished || showResult) return;

    stopSpeaking();
    playTapSound();

    const isCorrect = question.answer.every(
      (num, index) => selectedNumbers[index] === num
    );

    const nextScore = isCorrect ? score + 1 : score;

    setShowResult(true);

    if (isCorrect) {
      setScore(nextScore);
      setMessage('Chính xác rồi! Bé đã sắp xếp đúng dãy số.');
      playCorrectSound();

      speakText(buildCorrectSpeech(), {
        lang: 'vi-VN',
        rate: 0.92,
        pitch: 1.12,
      });

      return;
    }

    setMessage(`Chưa đúng nhé. Thứ tự đúng là: ${question.answer.join(', ')}.`);
    playWrongSound();

    speakText(buildWrongSpeech(), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.02,
    });
  };

  const handleNext = () => {
    if (!levelInfo || !question || !showResult) return;

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

  const handleRestartSameLevel = () => {
    if (!selectedLevel) return;

    startLevelGame(selectedLevel);
  };

  const handleBackToLevels = () => {
    stopSpeaking();

    setSelectedLevel(null);
    setRound(1);
    setScore(0);
    setQuestion(null);
    setSelectedNumbers([]);
    setMessage('Hãy chọn mức độ để bắt đầu nhé!');
    setShowResult(false);
    setFinished(false);
    hasSavedResultRef.current = false;
    setHistory(loadStoredScores());
  };

  if (!selectedLevel || !levelInfo) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[36px] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Trò chơi toán học
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Sắp xếp số theo thứ tự
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé quan sát một dãy số chưa đúng thứ tự, sau đó chọn lần lượt các số
                để sắp xếp theo yêu cầu từ bé đến lớn hoặc từ lớn đến bé. Trò chơi
                giúp bé biết số nào lớn hơn, nhỏ hơn và đặt đúng thứ tự.
              </p>
            </div>

            <Link
              href="/tro-choi"
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
                    {level.itemCount} số
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
                  'Biết số nào lớn hơn, nhỏ hơn',
                  'Sắp xếp từ bé đến lớn',
                  'Sắp xếp từ lớn đến bé',
                  'Tăng khả năng so sánh và tư duy thứ tự',
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
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
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
                href="/tro-choi"
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

  if (!question) return null;

  const isCorrectAnswer =
    showResult &&
    question.answer.every((num, index) => selectedNumbers[index] === num);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
     <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"> 
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

      <div className="grid gap-4 xl:grid-cols-[380px_1fr] xl:gap-6">
        <aside className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <div className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-sky-600">
            📏 Sắp xếp số
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">
            Bé hãy sắp xếp đúng thứ tự
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Bé chọn lần lượt các số để tạo thành dãy đúng theo yêu cầu.
          </p>

          <div className="mt-4 rounded-[22px] bg-gradient-to-br from-sky-100 via-cyan-50 to-violet-50 p-3 ring-1 ring-sky-100 sm:mt-6 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-600">
              Yêu cầu
            </p>

            <div className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-sky-100">
              <p className="text-sm font-bold text-slate-500">
                Sắp xếp các số:
              </p>

              <p className="mt-2 break-words text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                {question.numbers.join(', ')}
              </p>

              <p className="mt-4 rounded-2xl bg-sky-50 px-4 py-3 text-lg font-black text-sky-700 ring-1 ring-sky-100">
                {getDirectionLabel(question.direction)}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                speakText(buildQuestionSpeech(question), {
                  lang: 'vi-VN',
                  rate: 0.9,
                  pitch: 1.08,
                })
              }
              className="mt-5 inline-flex items-center justify-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
            >
              🔊 Nghe nhiệm vụ
            </button>
          </div>

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
              {showResult ? (
                <>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:from-emerald-600 hover:to-sky-600 hover:shadow-xl"
                  >
                    {round === levelInfo.totalRounds ? 'Xem kết quả' : 'Câu tiếp theo'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetRound}
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Làm lại câu này
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={checkAnswer}
                    disabled={!isComplete}
                    className={`rounded-full px-6 py-3 text-sm font-black shadow-lg transition ${
                      isComplete
                        ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-sky-100 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl'
                        : 'cursor-not-allowed bg-slate-100 text-slate-400 shadow-slate-100'
                    }`}
                  >
                    Kiểm tra
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveLast}
                    disabled={selectedNumbers.length === 0}
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    Xóa số vừa chọn
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        <div className="relative min-h-[500px] overflow-hidden rounded-[24px] bg-gradient-to-b from-sky-100 via-violet-50 to-pink-100 p-3 shadow-sm ring-1 ring-slate-100 sm:min-h-[620px] sm:rounded-[36px] sm:p-6">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-yellow-200/70 blur-sm" />
          <div className="absolute right-10 top-20 h-28 w-28 rounded-full bg-pink-200/60 blur-md" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="rounded-[22px] bg-white/90 p-3 text-center shadow-lg backdrop-blur ring-1 ring-white sm:rounded-[28px] sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
                {getDirectionLabel(question.direction)}
              </p>

              <h2 className="mt-2 break-words text-2xl font-black leading-tight text-slate-900 sm:text-5xl">
                {question.numbers.join(', ')}
              </h2>
            </div>

            <div className="mt-4 rounded-[24px] bg-white/85 p-3 shadow-inner ring-1 ring-white sm:mt-6 sm:rounded-[32px] sm:p-6">
              <p className="text-xs font-bold leading-5 text-slate-500 sm:text-sm">
                Dãy bé đang sắp xếp · Bấm vào số đã chọn để đưa quay lại
              </p>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
                {Array.from({ length: question.numbers.length }, (_, index) => {
                  const value = selectedNumbers[index];

                  let boxClass = 'bg-white text-slate-900 ring-slate-100';

                  if (showResult) {
                    boxClass =
                      value === question.answer[index]
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-rose-50 text-rose-700 ring-rose-200';
                  }

                  if (value === undefined || value === null) {
                    return (
                      <div
                        key={index}
                        className="flex min-h-[64px] items-center justify-center rounded-[18px] bg-white/70 text-3xl font-black text-slate-300 shadow-sm ring-2 ring-dashed ring-slate-200 transition sm:min-h-[100px] sm:rounded-[26px] sm:text-5xl"
                      >
                        ?
                      </div>
                    );
                  }

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={showResult}
                      onClick={() => handleRemoveSelectedNumber(index)}
                      className={`relative flex min-h-[64px] items-center justify-center rounded-[18px] text-3xl font-black shadow-sm ring-2 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-default sm:min-h-[100px] sm:rounded-[26px] sm:text-5xl ${boxClass}`}
                      aria-label={`Bỏ số ${value} khỏi dãy đã chọn`}
                      title="Bấm để đưa số này quay lại"
                    >
                      {value}

                      {!showResult && (
                       <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white shadow-md sm:-right-2 sm:-top-2 sm:h-7 sm:w-7 sm:text-xs">
                          ↩
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-[24px] bg-white/85 p-3 shadow-inner ring-1 ring-white sm:mt-6 sm:rounded-[32px] sm:p-6">
              <p className="text-xs font-bold text-slate-500 sm:text-sm">
                Chọn số
              </p>

              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
                {remainingNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={showResult}
                    onClick={() => handlePickNumber(num)}
                    className="rounded-[18px] bg-white px-3 py-4 text-3xl font-black text-slate-900 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-[24px] sm:px-4 sm:py-5 sm:text-5xl"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div
                className={`mt-4 rounded-[22px] px-4 py-3 text-sm font-bold leading-7 shadow-sm ring-1 sm:mt-5 sm:rounded-[24px] sm:py-4 ${
                  isCorrectAnswer
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                    : 'bg-rose-50 text-rose-700 ring-rose-100'
                }`}
              >
                {isCorrectAnswer
                  ? 'Chính xác rồi. Bé đã sắp xếp đúng dãy số.'
                  : `Chưa đúng nhé. Thứ tự đúng là: ${question.answer.join(', ')}.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
