'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { matchWordData, shuffleArray } from './data/matchWordData';
import type { MatchWordItem } from './data/matchWordData';
import Link from 'next/link';

type GameQuestion = MatchWordItem & {
  correctWord: string;
  options: string[];
};

function buildOptions(item: MatchWordItem): string[] {
  return shuffleArray([item.word, ...item.distractors]).slice(0, 4);
}

function buildQuestions(data: MatchWordItem[], count = 5): GameQuestion[] {
  return shuffleArray(data)
    .slice(0, count)
    .map((item) => ({
      ...item,
      correctWord: item.word,
      options: buildOptions(item),
    }));
}

export default function WordPictureMatchPage() {
  const [questions, setQuestions] = useState<GameQuestion[]>(() =>
    buildQuestions(matchWordData, 5)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

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
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  };

  const playCorrectSound = async () => {
    await playTone(523.25, 0.15, 'sine');

    setTimeout(() => {
      playTone(659.25, 0.15, 'sine');
    }, 120);

    setTimeout(() => {
      playTone(783.99, 0.2, 'sine');
    }, 240);
  };

  const playWrongSound = async () => {
    await playTone(320, 0.18, 'square');

    setTimeout(() => {
      playTone(220, 0.22, 'square');
    }, 140);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakQuestion = () => {
    if (!currentQuestion) return;

    speakText(
      `Đây là từ gì? Hãy chọn đáp án đúng cho hình ${currentQuestion.correctWord}`
    );
  };

  const handleSpeakWord = (word: string) => {
    speakText(word);
  };

  const handleChooseWord = async (word: string) => {
    if (selectedWord || !currentQuestion) return;

    setSelectedWord(word);
    speakText(word);

    if (word === currentQuestion.correctWord) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      await playCorrectSound();

      setTimeout(() => {
        speakText(`Chính xác rồi. Đây là ${currentQuestion.correctWord}`);
      }, 350);
    } else {
      setIsCorrect(false);
      await playWrongSound();

      setTimeout(() => {
        speakText(`Chưa đúng. Đáp án đúng là ${currentQuestion.correctWord}`);
      }, 350);
    }
  };

  const handleRestart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setQuestions(buildQuestions(matchWordData, 5));
    setCurrentIndex(0);
    setSelectedWord(null);
    setIsCorrect(null);
    setScore(0);
  };

  const handleNextQuestion = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setIsCorrect(null);
      return;
    }

    handleRestart();
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;

    const timer = setTimeout(() => {
      speakText('Hãy chọn từ đúng cho hình này');
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const progressPercent =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (!currentQuestion) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 sm:p-8">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Chưa có dữ liệu trò chơi
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Hãy kiểm tra lại file dữ liệu ghép chữ với hình.
          </p>

          <Link
            href="/games"
            className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Quay lại kho trò chơi
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 rounded-[24px] bg-gradient-to-r from-sky-500 to-cyan-400 p-4 text-white shadow-lg sm:mb-6 sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold sm:text-sm">
              Trò chơi học chữ
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
              Ghép chữ với hình
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Bé quan sát hình ảnh, nghe âm thanh và chọn từ đúng tương ứng.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[240px] sm:gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
                Điểm số
              </p>

              <p className="mt-1 text-xl font-black sm:text-2xl">{score}</p>
            </div>

            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80 sm:text-xs">
                Câu hiện tại
              </p>

              <p className="mt-1 text-xl font-black sm:text-2xl">
                {currentIndex + 1}/{questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:mb-6 sm:rounded-3xl sm:p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600 sm:text-sm">
          <span>Tiến độ</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 sm:h-3">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-sky-600">Quan sát hình</p>

              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                Hình nào đây?
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className="inline-flex items-center justify-center rounded-full bg-sky-100 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-200 sm:px-4 sm:text-sm"
              >
                {isSpeaking ? 'Đang đọc...' : '🔊 Nghe'}
              </button>

              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 sm:px-5 sm:py-3 sm:text-sm"
              >
                Quay lại
              </Link>
            </div>
          </div>

          <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border-2 border-dashed border-sky-200 bg-sky-50 px-3 py-6 sm:min-h-[320px] sm:rounded-[28px] sm:py-8">
            <div className="text-center">
              <div className="mb-3 text-[88px] leading-none sm:mb-4 sm:text-[140px]">
                {currentQuestion.image}
              </div>

              <p className="text-base font-bold text-slate-700 sm:text-lg">
                Bé hãy chọn từ đúng
              </p>

              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                Chủ đề: {currentQuestion.category}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[32px] sm:p-6">
          <p className="mb-1 text-sm font-bold text-violet-600">Chọn đáp án</p>

          <h3 className="mb-4 text-xl font-black text-slate-900 sm:mb-5 sm:text-2xl">
            Ghép chữ phù hợp
          </h3>

          <div className="space-y-2.5 sm:space-y-3">
            {currentQuestion.options.map((word) => {
              const isSelected = selectedWord === word;
              const isRightAnswer = word === currentQuestion.correctWord;

              let buttonClass =
                'min-h-[52px] w-full rounded-2xl border px-4 py-3 text-left text-base font-bold transition sm:min-h-[60px] sm:py-4 sm:text-lg';

              if (!selectedWord) {
                buttonClass +=
                  ' border-slate-200 bg-slate-50 text-slate-800 hover:border-sky-300 hover:bg-sky-50';
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
                <div key={word} className="flex items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => handleChooseWord(word)}
                    disabled={!!selectedWord}
                    className={buttonClass}
                  >
                    {word}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeakWord(word)}
                    className="flex min-h-[52px] w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-base transition hover:bg-slate-50 sm:min-h-[60px] sm:w-14 sm:text-lg"
                    aria-label={`Nghe từ ${word}`}
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
                Bé hãy nhìn hình, nghe âm thanh rồi bấm vào từ phù hợp nhé.
              </p>
            )}

            {isCorrect === true && (
              <div>
                <p className="text-base font-bold text-emerald-600">
                  Chính xác rồi! 🎉
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Bé đã ghép đúng hình với chữ{' '}
                  <span className="font-bold">
                    {currentQuestion.correctWord}
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
                    {currentQuestion.correctWord}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="mt-4 w-full rounded-2xl bg-sky-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 sm:mt-6 sm:py-4 sm:text-base"
          >
            {currentIndex < questions.length - 1
              ? 'Câu tiếp theo'
              : 'Chơi lại từ đầu'}
          </button>
        </div>
      </div>
    </section>
  );
}
