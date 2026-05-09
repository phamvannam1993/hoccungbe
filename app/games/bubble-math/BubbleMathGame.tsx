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
  minResult: number;
  maxResult: number;
  optionCount: number;
  operations: ('+' | '-')[];
};

type MathQuestion = {
  left: number;
  right: number;
  operator: '+' | '-';
  answer: number;
  text: string;
};

type BubbleOption = {
  id: string;
  value: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
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

const LOCAL_STORAGE_KEY = 'hoc-cung-be-bubble-math-scores';

const levels: LevelConfig[] = [
  {
    key: 'easy',
    label: 'Mức 1: Làm quen',
    icon: '🎈',
    badge: 'Dễ',
    age: '5-6 tuổi',
    description:
      'Bé làm quen với phép cộng trong phạm vi 1 đến 10, mỗi câu có 3 bong bóng đáp án.',
    totalRounds: 5,
    minResult: 1,
    maxResult: 10,
    optionCount: 3,
    operations: ['+'],
  },
  {
    key: 'medium',
    label: 'Mức 2: Tăng tốc',
    icon: '➕',
    badge: 'Trung bình',
    age: '5-7 tuổi',
    description:
      'Bé luyện phép cộng và trừ trong phạm vi 1 đến 15, có nhiều bong bóng hơn để tăng phản xạ.',
    totalRounds: 6,
    minResult: 1,
    maxResult: 15,
    optionCount: 4,
    operations: ['+', '-'],
  },
  {
    key: 'hard',
    label: 'Mức 3: Thử thách',
    icon: '🧠',
    badge: 'Nâng cao',
    age: '6-8 tuổi',
    description:
      'Bé luyện cộng trừ trong phạm vi 1 đến 20, đáp án gần nhau hơn để rèn tính nhẩm chính xác.',
    totalRounds: 7,
    minResult: 1,
    maxResult: 20,
    optionCount: 5,
    operations: ['+', '-'],
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

function createQuestion(level: LevelConfig): MathQuestion {
  const operator = level.operations[Math.floor(Math.random() * level.operations.length)];

  if (operator === '+') {
    const answer = randomBetween(level.minResult + 1, level.maxResult);
    const left = randomBetween(1, answer - 1);
    const right = answer - left;

    return {
      left,
      right,
      operator,
      answer,
      text: `${left} + ${right}`,
    };
  }

  const answer = randomBetween(level.minResult, level.maxResult - 1);
  const right = randomBetween(1, Math.min(10, level.maxResult - answer));
  const left = answer + right;

  return {
    left,
    right,
    operator,
    answer,
    text: `${left} - ${right}`,
  };
}

function createAnswerValues(answer: number, level: LevelConfig) {
  const values = new Set<number>();
  values.add(answer);

  while (values.size < level.optionCount) {
    const offset = randomBetween(-4, 4);
    const candidate = answer + offset;

    if (
      candidate >= level.minResult &&
      candidate <= level.maxResult &&
      candidate !== answer
    ) {
      values.add(candidate);
    } else {
      const fallback = randomBetween(level.minResult, level.maxResult);
      if (fallback !== answer) values.add(fallback);
    }
  }

  return shuffleArray(Array.from(values));
}

function createBubbleOptions(answer: number, level: LevelConfig): BubbleOption[] {
  const values = createAnswerValues(answer, level);

  return values.map((value, index) => ({
    id: `${value}-${index}`,
    value,
    x: 12 + Math.random() * 76,
    y: 10 + Math.random() * 68,
    size: 72 + Math.random() * 20,
    delay: Math.random() * 0.8,
    duration: 3 + Math.random() * 2,
  }));
}

function buildQuestionSpeech(question: MathQuestion) {
  return `Bạn nhỏ hãy tính ${question.left} ${question.operator === '+' ? 'cộng' : 'trừ'} ${
    question.right
  }, rồi chọn bong bóng có kết quả đúng.`;
}

function buildCorrectSpeech(answer: number) {
  return `Chính xác rồi. Kết quả đúng là ${answer}.`;
}

function buildWrongSpeech(selected: number, answer: number) {
  return `Chưa đúng nhé. Bạn nhỏ chọn ${selected}. Đáp án đúng là ${answer}.`;
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

function playPopSound() {
  playTone(620, 0.07, 'triangle', 0.045);
  setTimeout(() => playTone(840, 0.08, 'triangle', 0.04), 60);
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

export default function BubbleMathGame() {
  const [selectedLevel, setSelectedLevel] = useState<LevelKey | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [bubbles, setBubbles] = useState<BubbleOption[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  const prepareRound = (level: LevelConfig) => {
    const nextQuestion = createQuestion(level);
    const nextBubbles = createBubbleOptions(nextQuestion.answer, level);

    setQuestion(nextQuestion);
    setBubbles(nextBubbles);
    setSelectedAnswer(null);
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
      gameKey: 'bubble-math',
      gameLabel: 'Bắn bong bóng kết quả',
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

  const handleChooseBubble = (answer: number) => {
    if (!levelInfo || !question) return;
    if (finished || showResult) return;

    stopSpeaking();
    playPopSound();

    const isCorrect = answer === question.answer;
    const nextScore = isCorrect ? score + 1 : score;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (isCorrect) {
      setScore(nextScore);
      setMessage(`Chính xác rồi! Kết quả đúng là ${question.answer}.`);
      playCorrectSound();

      speakText(buildCorrectSpeech(question.answer), {
        lang: 'vi-VN',
        rate: 0.92,
        pitch: 1.12,
      });

      return;
    }

    setMessage(`Chưa đúng nhé. Đáp án đúng là ${question.answer}.`);
    playWrongSound();

    speakText(buildWrongSpeech(answer, question.answer), {
      lang: 'vi-VN',
      rate: 0.9,
      pitch: 1.02,
    });
  };

  const handleNext = () => {
    if (!levelInfo || !question || !showResult) return;

    stopSpeaking();

    const isCorrect = selectedAnswer === question.answer;
    const latestScore = isCorrect ? score : score;

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
    if (!levelInfo || !question) return;

    stopSpeaking();
    playResetSound();

    setSelectedAnswer(null);
    setShowResult(false);
    setMessage('Mình thử lại câu này nhé!');

    speakText(buildQuestionSpeech(question), {
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
    setQuestion(null);
    setBubbles([]);
    setSelectedAnswer(null);
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
                Bắn bong bóng kết quả
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Bé nhìn phép tính, tính nhẩm và bấm vào bong bóng có kết quả đúng.
                Trò chơi giúp bé luyện cộng trừ, phản xạ nhanh và tập trung hơn.
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
                    1-{level.maxResult}
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
                  'Tính nhẩm cộng trừ',
                  'Chọn kết quả chính xác',
                  'Phản xạ nhanh khi quan sát',
                  'Tập trung vào phép tính',
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

  if (!question) return null;

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
          <div className="inline-flex rounded-full bg-pink-50 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-pink-600">
            🎈 Bắn bong bóng
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
            Bé hãy chọn kết quả đúng
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-600">
            Bé tính phép tính ở dưới, sau đó bấm vào bong bóng có kết quả đúng.
          </p>

          <div className="mt-5 rounded-[24px] bg-gradient-to-br from-pink-100 via-sky-50 to-violet-50 p-4 ring-1 ring-pink-100 sm:mt-6 sm:rounded-[28px] sm:p-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-600">
              Phép tính
            </p>

            <div className="mt-4 rounded-[28px] bg-white p-5 text-center shadow-sm ring-1 ring-pink-100">
              <span className="text-5xl font-black text-slate-900 sm:text-6xl">
                {question.text}
              </span>

              <span className="ml-3 text-5xl font-black text-pink-500 sm:text-6xl">
                =
              </span>
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
              className="mt-5 inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-bold text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-50"
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
                <button
                  type="button"
                  onClick={() =>
                    speakText(buildQuestionSpeech(question), {
                      lang: 'vi-VN',
                      rate: 0.9,
                      pitch: 1.05,
                    })
                  }
                  className="rounded-full bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  Nghe lại câu hỏi
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-200 via-violet-100 to-pink-100 p-4 shadow-sm ring-1 ring-slate-100 sm:min-h-[620px] sm:rounded-[36px] sm:p-6">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-yellow-200/70 blur-sm" />
          <div className="absolute right-10 top-20 h-28 w-28 rounded-full bg-pink-200/60 blur-md" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-400/30 to-transparent" />

          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="rounded-[28px] bg-white/85 p-4 text-center shadow-lg backdrop-blur ring-1 ring-white sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-600">
                Chọn bong bóng đúng
              </p>

              <h2 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
                {question.text} = ?
              </h2>
            </div>

            <div className="relative mt-5 min-h-[320px] rounded-[32px] bg-white/35 p-4 shadow-inner ring-1 ring-white sm:min-h-[410px]">
              {bubbles.map((bubble) => {
                const isSelected = selectedAnswer === bubble.value;
                const isCorrect = bubble.value === question.answer;

                let bubbleClass =
                  'bg-white/90 text-slate-800 ring-white hover:scale-110 hover:shadow-2xl';

                if (showResult && isCorrect) {
                  bubbleClass = 'bg-emerald-100 text-emerald-700 ring-emerald-200 scale-110';
                } else if (showResult && isSelected && !isCorrect) {
                  bubbleClass = 'bg-rose-100 text-rose-700 ring-rose-200 scale-90 opacity-70';
                } else if (showResult) {
                  bubbleClass = 'bg-white/60 text-slate-400 ring-white opacity-70';
                }

                return (
                  <button
                    key={bubble.id}
                    type="button"
                    disabled={showResult}
                    onClick={() => handleChooseBubble(bubble.value)}
                    className={`absolute flex items-center justify-center rounded-full text-3xl font-black shadow-xl ring-2 transition duration-300 sm:text-4xl ${bubbleClass}`}
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                      transform: 'translate(-50%, -50%)',
                      transitionDelay: `${bubble.delay}s`,
                    }}
                  >
                    <span>{bubble.value}</span>
                    <span className="absolute -bottom-3 h-5 w-[2px] bg-white/80" />
                  </button>
                );
              })}
            </div>

            {showResult && selectedAnswer !== null && (
              <div
                className={`mt-5 rounded-[24px] px-4 py-4 text-sm font-bold leading-7 shadow-sm ring-1 ${
                  selectedAnswer === question.answer
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                    : 'bg-rose-50 text-rose-700 ring-rose-100'
                }`}
              >
                {selectedAnswer === question.answer
                  ? `Chính xác rồi. ${question.text} = ${question.answer}.`
                  : `Chưa đúng nhé. Bạn nhỏ chọn ${selectedAnswer}, đáp án đúng là ${question.answer}.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
