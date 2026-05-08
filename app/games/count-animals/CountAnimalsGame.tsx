'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  countAnimalsCategories,
  countAnimalsData,
  type CountAnimalsQuestion,
} from './data';
import { speakText, stopSpeaking } from '../../components/edu/utils/speech';

type CategoryKey = keyof typeof countAnimalsData;

type StoredScore = {
  categoryKey: string;
  categoryLabel: string;
  score: number;
  total: number;
  accuracy: number;
  playedAt: string;
};

type PlayQuestion = CountAnimalsQuestion & {
  shuffledOptions: number[];
};

const LOCAL_STORAGE_KEY = 'hoc-cung-be-count-animals-scores';
const QUESTIONS_PER_GAME = 5;

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPlayQuestions(source: CountAnimalsQuestion[], count: number): PlayQuestion[] {
  return shuffleArray(source)
    .slice(0, Math.min(count, source.length))
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

function playTone(
  frequency: number,
  duration = 0.18,
  type: OscillatorType = 'sine'
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
  gainNode.gain.value = 0.05;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );

  oscillator.stop(audioContext.currentTime + duration);
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

function buildQuestionSpeech(question: CountAnimalsQuestion) {
  return `${question.prompt}. Bé hãy đếm thật kỹ rồi chọn đáp án đúng.`;
}

function buildCorrectSpeech(count: number, label: string) {
  return `Giỏi lắm. Có ${count} ${label}.`;
}

function buildWrongSpeech(count: number, label: string) {
  return `Chưa đúng nhé. Có ${count} ${label}.`;
}

function buildFinishSpeech(categoryLabel: string, score: number, total: number) {
  return `Bé đã hoàn thành chủ đề ${categoryLabel}. Điểm số của bé là ${score} trên ${total}.`;
}

export default function CountAnimalsGame() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [questions, setQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState<StoredScore[]>([]);
  const hasSavedResultRef = useRef(false);
  const skipAutoSpeakRef = useRef(false);

  const currentQuestion = questions[currentIndex];

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex + (finished ? 1 : 0)) / questions.length) * 100);
  }, [currentIndex, finished, questions.length]);

  useEffect(() => {
    setHistory(loadStoredScores());
  }, []);

  useEffect(() => {
    if (!finished || !selectedCategory || hasSavedResultRef.current || !questions.length) return;

    const categoryInfo = countAnimalsData[selectedCategory];
    const storedScore: StoredScore = {
      categoryKey: selectedCategory,
      categoryLabel: categoryInfo.label,
      score,
      total: questions.length,
      accuracy: Math.round((score / questions.length) * 100),
      playedAt: new Date().toISOString(),
    };

    saveStoredScore(storedScore);
    setHistory(loadStoredScores());
    hasSavedResultRef.current = true;
  }, [finished, selectedCategory, score, questions.length]);

  useEffect(() => {
    if (!currentQuestion || finished) return;

    if (skipAutoSpeakRef.current) {
      skipAutoSpeakRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      speakText(buildQuestionSpeech(currentQuestion), {
        lang: 'vi-VN',
        rate: 0.9,
        pitch: 1.08,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestion, finished]);

  const startCategoryGame = (key: CategoryKey) => {
    const sourceQuestions = countAnimalsData[key].questions;
    const nextQuestions = buildPlayQuestions(sourceQuestions, QUESTIONS_PER_GAME);

    setSelectedCategory(key);
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    hasSavedResultRef.current = false;
  };

  const handleChoose = (option: number) => {
    if (showResult || !currentQuestion) return;

    setSelected(option);
    setShowResult(true);
    stopSpeaking();

    if (option === currentQuestion.correct) {
      setScore((prev) => prev + 1);
      playCorrectSound();
      speakText(buildCorrectSpeech(currentQuestion.correct, currentQuestion.animalLabel), {
        lang: 'vi-VN',
        rate: 0.92,
        pitch: 1.12,
      });
    } else {
      playWrongSound();
      speakText(buildWrongSpeech(currentQuestion.correct, currentQuestion.animalLabel), {
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

      if (selectedCategory) {
        speakText(
          buildFinishSpeech(
            countAnimalsData[selectedCategory].label,
            score,
            questions.length
          ),
          {
            lang: 'vi-VN',
            rate: 0.9,
            pitch: 1.05,
          }
        );
      }

      setFinished(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextQuestion = questions[nextIndex];

    skipAutoSpeakRef.current = true;
    setCurrentIndex(nextIndex);
    setSelected(null);
    setShowResult(false);

    if (nextQuestion) {
      setTimeout(() => {
        speakText(buildQuestionSpeech(nextQuestion), {
          lang: 'vi-VN',
          rate: 0.9,
          pitch: 1.08,
        });
      }, 250);
    }
  };

  const handleRestartSameCategory = () => {
    if (!selectedCategory) return;
    stopSpeaking();
    startCategoryGame(selectedCategory);
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

  if (!selectedCategory) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Trò chơi đếm số
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Đếm con vật
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé nhìn nhóm con vật, đếm số lượng rồi chọn đáp án đúng. Trò chơi giúp
            rèn quan sát, tập trung và làm quen với số đếm.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {countAnimalsCategories.map((category) => (
              <button
                key={category.key}
                onClick={() => startCategoryGame(category.key as CategoryKey)}
                className="group rounded-[30px] bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)] transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
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
                  {Math.min(QUESTIONS_PER_GAME, category.total)} câu mỗi lượt chơi, trực quan và vui nhộn.
                </p>

                <div className="mt-5 inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
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
                  'Đếm số lượng chính xác hơn',
                  'Quan sát nhóm con vật tốt hơn',
                  'Tăng tập trung khi làm bài',
                  'Phản xạ chọn số đúng nhanh hơn',
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
                      <div className="font-bold text-slate-900">{item.categoryLabel}</div>
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
    const categoryInfo = countAnimalsData[selectedCategory];
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
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
              3-6 tuổi
            </span>
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
              {countAnimalsData[selectedCategory].label}
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
              {questions.length} câu
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Đếm con vật
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Bé nhìn nhóm con vật, đếm thật kỹ rồi chọn đúng số lượng tương ứng.
          </p>

          <div className="mt-8 rounded-[30px] bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-5">
            <div className="rounded-[24px] bg-white p-5 shadow-inner">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Câu hỏi hiện tại</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    {currentQuestion.prompt}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      speakText(buildQuestionSpeech(currentQuestion), {
                        lang: 'vi-VN',
                        rate: 0.9,
                        pitch: 1.08,
                      })
                    }
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                  >
                    🔊 Nghe câu hỏi
                  </button>
                </div>

                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
                  Câu {currentIndex + 1}/{questions.length}
                </div>
              </div>

              <div className="mt-6">
                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-sky-50 p-6 text-center ring-1 ring-sky-100">
                <p className="text-sm font-semibold text-slate-500">Các con vật cần đếm</p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                  {currentQuestion.items.map((item, index) => (
                    <div
                      key={`${currentQuestion.id}-${index}`}
                      className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-5xl shadow-sm ring-1 ring-slate-200"
                    >
                      {item}
                    </div>
                  ))}
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
                    selected === currentQuestion.correct
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                  }`}
                >
                  {selected === currentQuestion.correct
                    ? `Chính xác rồi. Có ${currentQuestion.correct} ${currentQuestion.animalLabel}.`
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
                {countAnimalsData[selectedCategory].icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  {countAnimalsData[selectedCategory].label}
                </p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  Câu hỏi được trộn ngẫu nhiên mỗi lượt.
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
                history.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item.playedAt}-${index}`}
                    className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100"
                  >
                    <div className="font-bold text-slate-900">{item.categoryLabel}</div>
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