"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { speakText } from "@/app/components/edu/utils/speech";
import { fishingLevels } from "./fishingLetters.data";
import type { FishingQuestion } from "./fishingLetters.data";
import {
  selectNextQuestion,
  shuffleFishes,
  findTargetIndex,
  recordAttempt,
  loadProgress,
  saveProgress,
  getLevelStatistics,
} from "./fishingLetters.utils";
import type { GameProgress } from "./fishingLetters.utils";

type GameResult = "correct" | "wrong" | null;
type ConfidenceLevel = "easy" | "medium" | "hard" | null;


function getFishPosition(index: number) {
  const positions = [
    { left: "18%", top: "48%" },
    { left: "38%", top: "60%" },
    { left: "60%", top: "48%" },
    { left: "79%", top: "62%" },
    { left: "28%", top: "75%" },
    { left: "52%", top: "76%" },
  ];

  return positions[index % positions.length];
}

type FishProps = {
  letter: string;
  index: number;
  isCaught: boolean;
  isWrong: boolean;
  onChoose: () => void;
};

function Fish({ letter, index, isCaught, isWrong, onChoose }: FishProps) {
  const position = getFishPosition(index);

  const fishColor =
    index % 4 === 0
      ? {
          body: "from-yellow-200 to-orange-500",
          tail: "bg-orange-500",
        }
      : index % 4 === 1
        ? {
            body: "from-cyan-200 to-blue-600",
            tail: "bg-blue-600",
          }
        : index % 4 === 2
          ? {
              body: "from-pink-200 to-pink-600",
              tail: "bg-pink-600",
            }
          : {
              body: "from-lime-200 to-emerald-600",
              tail: "bg-emerald-600",
            };

  return (
    <button
      onClick={onChoose}
      aria-label={`Cá chữ ${letter}`}
      className={[
        "absolute z-20 h-[92px] w-[160px] -translate-x-1/2 -translate-y-1/2 bg-transparent",
        "transition-transform duration-300",
        isCaught
          ? "animate-[caught_0.75s_ease_forwards]"
          : "animate-[swim_4.5s_ease-in-out_infinite]",
        isWrong ? "animate-[shake_0.35s_linear_2]" : "",
      ].join(" ")}
      style={{
        left: position.left,
        top: position.top,
        animationDelay: `${index * 0.35}s`,
      }}
    >
      <div
        className={[
          "absolute left-[23px] top-[15px] h-[62px] w-[108px] rounded-[58%_48%_48%_58%] bg-gradient-to-br",
          "shadow-[inset_-8px_-8px_0_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.18)]",
          fishColor.body,
        ].join(" ")}
      />

      <div
        className={[
          "absolute right-[9px] top-[22px] h-[48px] w-[44px]",
          "[clip-path:polygon(0_50%,100%_0,78%_50%,100%_100%)]",
          fishColor.tail,
        ].join(" ")}
      />

      <div className="absolute left-[42px] top-[25px] h-[18px] w-[18px] rounded-full bg-white shadow-[inset_5px_-2px_0_#102030]" />

      <div className="absolute left-[74px] top-[39px] -translate-x-1/2 -translate-y-1/2 text-[42px] font-black text-slate-900 drop-shadow-sm">
        {letter}
      </div>
    </button>
  );
}

export default function FishingLettersGame() {
  if (!fishingLevels?.length) {
    return <div className="flex min-h-screen items-center justify-center text-red-600">Lỗi: Không thể tải dữ liệu game</div>;
  }

  const [levelIndex, setLevelIndex] = useState(0);
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<GameResult>(null);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [caughtLetter, setCaughtLetter] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null);
  const [showConfidencePrompt, setShowConfidencePrompt] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [recentQuestionIds, setRecentQuestionIds] = useState<number[]>([]);

  // Load progress on mount
  useEffect(() => {
    const saved = loadProgress();
    setProgress(saved);
    console.log('[Game] Mounted, progress loaded');
  }, []);

  const level = fishingLevels[levelIndex];

  // Generate question using spaced retrieval
  const question = useMemo(() => {
    if (!level || !progress) return null;
    return selectNextQuestion(level, progress, recentQuestionIds);
  }, [level, progress, recentQuestionIds]);

  // Generate random fish choices (different each time, not just shuffled)
  const shuffledFishes = useMemo(() => {
    if (!question) return [];

    // All Vietnamese letters to choose from
    const allLetters = [
      'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M',
      'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y', 'Z'
    ];

    const target = question.target;

    // Get 3 random wrong answers from letters not matching target
    const wrongLetters = allLetters.filter(l => l !== target);
    const wrongAnswers: string[] = [];
    for (let i = 0; i < 3; i++) {
      const randomIdx = Math.floor(Math.random() * wrongLetters.length);
      wrongAnswers.push(wrongLetters[randomIdx]);
      // Remove to avoid duplicates
      wrongLetters.splice(randomIdx, 1);
    }

    // Mix target with wrong answers
    const choices = [target, ...wrongAnswers];
    return shuffleFishes(choices);
  }, [question?.id]); // Only regenerate when question changes

  const targetIndex = useMemo(() => {
    if (!question) return -1;
    return findTargetIndex(shuffledFishes, question.target);
  }, [question, shuffledFishes]);

  // Get level statistics
  const levelStats = progress?.levelStats[level.id];
  const levelStats_ = levelStats ? getLevelStatistics(levelStats) : null;

  const canUpgrade =
    score >= level.requiredScoreToUpgrade &&
    levelIndex < fishingLevels.length - 1;

  const bubbles = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 14 + 8}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 4}s`,
    }));
  }, [question?.id]);

  const resetAnswerState = () => {
    setResult(null);
    setWrongLetter(null);
    setCaughtLetter(null);
  };

  const handleChooseFish = (letter: string) => {
    if (result === "correct" || !question) return;

    if (letter === question.target) {
      setResult("correct");
      setCaughtLetter(letter);
      setScore((current) => current + 1);

      // Auto-read celebration (will be muted until first user interaction)
      setTimeout(() => {
        speakText(`Đúng rồi! Đó là chữ ${question.target}`);
      }, 300);

      // Show confidence meter
      setTimeout(() => setShowConfidencePrompt(true), 800);
      setTimerSeconds(15);
      return;
    }

    setResult("wrong");
    setWrongLetter(letter);

    setTimeout(() => {
      setWrongLetter(null);
      setResult(null);
    }, 900);
  };

  const handleConfidenceSubmit = useCallback(
    (confidenceLevel: ConfidenceLevel) => {
      if (!progress) return;

      // Record attempt with confidence
      const updated = recordAttempt(
        progress,
        level.id,
        question,
        true,
        confidenceLevel as any
      );
      setProgress(updated);

      // Add to recent questions (exclude last 5 to prevent repeating)
      setRecentQuestionIds((prev) => {
        const newList = [question.id, ...prev].slice(0, 5);
        return newList;
      });

      // Auto next question after brief delay for celebration
      setTimeout(() => {
        setShowConfidencePrompt(false);
        setConfidence(null);
        setResult(null);
        setCaughtLetter(null);
        setShowHint(false);
      }, 600);
    },
    [progress, level.id, question]
  );

  const handleNextQuestion = () => {
    if (canUpgrade) {
      const nextLevelIndex = levelIndex + 1;
      setLevelIndex(nextLevelIndex);
      setScore(0);
    }
    // Clear recent questions to allow any question to be selected
    setRecentQuestionIds([]);
    resetAnswerState();
  };

  const handleChangeLevel = (nextLevelIndex: number) => {
    setLevelIndex(nextLevelIndex);
    setScore(0);
    setRecentQuestionIds([]);
    resetAnswerState();
  };

  const handleRandomQuestion = () => {
    setRecentQuestionIds([]);
    resetAnswerState();
  };

  // Timer countdown effect
  useEffect(() => {
    if (result !== "correct" || !showConfidencePrompt) return;
    if (timerSeconds <= 0) {
      return; // Handled by separate effect below
    }
    const timer = setInterval(() => setTimerSeconds((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [result, showConfidencePrompt]); // Remove timerSeconds to avoid infinite loop

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerSeconds <= 0 && result === "correct" && showConfidencePrompt) {
      handleConfidenceSubmit("medium");
    }
  }, [timerSeconds, result, showConfidencePrompt, handleConfidenceSubmit]);

  // Auto-read new question (muted initially, unmutes on first user interaction)
  useEffect(() => {
    if (!question || result === "correct") return;
    const timer = setTimeout(() => {
      console.log('[Game] Auto-reading:', question.instruction);
      speakText(question.instruction);
    }, 500);
    return () => clearTimeout(timer);
  }, [question?.id]);

  // Guard: show loading if data not ready (AFTER all hooks)
  if (!progress || !level || !question) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Đang tải...</div>;
  }

  const instructionParts = question.instruction.split(question.target);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4" suppressHydrationWarning>
      <section className="w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Câu cá chữ cái
            </h1>
            <p className="mt-1 text-base font-bold text-slate-500">
              {level.name} · {level.label} · Điểm {score}
              {levelStats_ && (
                <span className="ml-4 text-xs text-slate-400">
                  {levelStats_.overallAccuracy}% chính xác · {levelStats_.masteredCount}/{levelStats.questionsStats.length} thành thạo
                </span>
              )}
            </p>
          </div>

          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-4xl leading-none text-white shadow-lg hover:bg-orange-600">
            ×
          </button>
        </header>

        <div className="bg-[#075463] p-4">
          <div className="relative min-h-[680px] overflow-hidden rounded-2xl border-[10px] border-[#075463] bg-gradient-to-b from-sky-300 via-cyan-100 to-cyan-700">
            <div className="absolute left-[8%] top-[6%] h-28 w-28 rounded-full bg-white/40 blur-sm" />
            <div className="absolute left-[25%] top-[9%] h-14 w-44 rounded-full bg-white/40 blur-md" />
            <div className="absolute right-[13%] top-[14%] h-16 w-60 rounded-full bg-white/35 blur-md" />
            <div className="absolute left-[-10%] right-[-10%] top-[38%] h-20 rounded-[50%] bg-white/20 blur-lg" />

            {bubbles.map((bubble) => (
              <span
                key={bubble.id}
                className="absolute bottom-[-20px] rounded-full bg-white/55 animate-[bubble_5s_linear_infinite]"
                style={{
                  left: bubble.left,
                  width: bubble.size,
                  height: bubble.size,
                  animationDelay: bubble.delay,
                  animationDuration: bubble.duration,
                }}
              />
            ))}

            <div className="absolute bottom-0 left-[5%] h-40 w-24 rotate-[-7deg] bg-gradient-to-br from-emerald-700 to-green-400 opacity-80 [clip-path:polygon(50%_0,70%_100%,20%_100%)]" />
            <div className="absolute bottom-0 left-[13%] h-52 w-24 rotate-[8deg] bg-gradient-to-br from-emerald-700 to-green-400 opacity-80 [clip-path:polygon(50%_0,70%_100%,20%_100%)]" />
            <div className="absolute bottom-0 right-[8%] h-44 w-24 rotate-[6deg] bg-gradient-to-br from-emerald-700 to-green-400 opacity-80 [clip-path:polygon(50%_0,70%_100%,20%_100%)]" />

            <div className="absolute left-4 top-4 z-40">
              <select
                value={levelIndex}
                onChange={(e) => handleChangeLevel(Number(e.target.value))}
                className="rounded-lg px-3 py-2 text-sm font-black text-[#064d5c] bg-white/90 border-2 border-[#064d5c] shadow-lg cursor-pointer hover:bg-white transition md:text-base"
              >
                {fishingLevels.map((item, index) => (
                  <option key={item.id} value={index}>
                    {item.name}: {item.label} - {item.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="pointer-events-none absolute right-12 top-6 z-30 h-56 w-44">
              <div className="absolute right-0 top-2 h-2 w-48 origin-right rotate-[-22deg] rounded-full bg-[#7d4b25] shadow-md" />
              <div className="absolute right-[145px] top-[47px] h-36 w-[3px] bg-slate-800/60" />
              <div className="absolute right-[134px] top-[180px] h-9 w-7 rotate-[22deg] rounded-full border-4 border-l-transparent border-t-transparent border-slate-800" />
            </div>

            <div className="absolute left-1/2 top-16 z-40 flex w-[min(720px,92%)] -translate-x-1/2 flex-col gap-2 rounded-xl bg-[#fffdf8]/95 px-3 py-3 shadow-lg sm:gap-3 sm:px-4 sm:py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(question.instruction)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-cyan-600 bg-white text-lg text-cyan-700 transition hover:bg-cyan-50 sm:h-12 sm:w-12 sm:text-xl"
                  aria-label="Nghe lại yêu cầu"
                >
                  🔊
                </button>

                <p className="flex-1 text-base font-black leading-snug text-[#064d5c] sm:text-lg md:text-xl">
                  {instructionParts[0]}
                  <span className="inline-block min-w-9 text-center text-pink-500">
                    {question.target}
                  </span>
                  {instructionParts.slice(1).join(question.target)}
                </p>

                {question.mnemonic && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="shrink-0 rounded-full bg-yellow-100 px-3 py-2 text-xs font-black text-yellow-700 transition hover:bg-yellow-200 sm:text-sm"
                    aria-label="Gợi ý"
                  >
                    💡
                  </button>
                )}
              </div>

              {showHint && question.mnemonic && (
                <div className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800 sm:text-sm">
                  <span className="font-bold">💭 Gợi ý:</span> {question.mnemonic}
                </div>
              )}
            </div>

            {shuffledFishes.map((letter, index) => (
              <Fish
                key={`${question.id}-${letter}-${index}`}
                letter={letter}
                index={index}
                isCaught={result === "correct" && caughtLetter === letter}
                isWrong={wrongLetter === letter}
                onChoose={() => handleChooseFish(letter)}
              />
            ))}

            <div className="absolute bottom-20 right-10 z-20 flex h-32 w-44 items-center justify-center rounded-[1.5rem_1.5rem_3rem_3rem] border-8 border-white/60 bg-gradient-to-b from-cyan-100 to-cyan-500 text-5xl shadow-xl">
              🪣
            </div>

            {result && !showConfidencePrompt && (
              <div
                className={[
                  "absolute bottom-28 right-6 z-50 rounded-full px-4 py-2 text-sm font-black shadow-lg sm:bottom-32 sm:right-8 sm:px-5 sm:py-3 sm:text-base md:text-lg",
                  result === "correct"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600",
                ].join(" ")}
              >
                {result === "correct"
                  ? "Đúng rồi! 🎉"
                  : "Chưa đúng, thử lại nhé. 💪"}
              </div>
            )}

            {showConfidencePrompt && result === "correct" && (
              <div className="absolute bottom-28 right-6 left-6 z-50 flex flex-col gap-3 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-4 shadow-xl sm:bottom-32 sm:left-auto sm:right-8 sm:w-72">
                <p className="text-sm font-black text-blue-900">
                  Bạn tự tin mấy? ⭐
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfidenceSubmit("easy")}
                    className="flex-1 rounded-lg bg-green-400 py-2 text-xs font-black text-white transition hover:bg-green-500 sm:text-sm"
                  >
                    Dễ 😄 ({timerSeconds}s)
                  </button>
                  <button
                    onClick={() => handleConfidenceSubmit("medium")}
                    className="flex-1 rounded-lg bg-yellow-400 py-2 text-xs font-black text-white transition hover:bg-yellow-500 sm:text-sm"
                  >
                    Bình thường 😐
                  </button>
                  <button
                    onClick={() => handleConfidenceSubmit("hard")}
                    className="flex-1 rounded-lg bg-orange-400 py-2 text-xs font-black text-white transition hover:bg-orange-500 sm:text-sm"
                  >
                    Khó 😅
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-2 left-2 right-2 z-40 flex min-h-16 flex-col items-center justify-between gap-2 rounded-lg bg-[#fffdf8]/95 px-3 py-2 shadow-lg sm:gap-3 sm:px-4 sm:py-3 sm:rounded-2xl">
              <p className="text-xs font-black text-slate-700 sm:text-sm md:text-base">
                Bấm vào con cá có chữ đúng nhé.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleRandomQuestion}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-black text-[#0b7181] shadow-md transition hover:bg-cyan-50 sm:px-5 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base"
                >
                  Đổi câu
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={result !== "correct"}
                  className={[
                    "rounded-full px-5 py-1.5 text-xs font-black shadow-md transition sm:px-6 sm:py-2 sm:text-sm md:px-7 md:py-2.5 md:text-base",
                    result === "correct"
                      ? "bg-lime-300 text-[#60721f] hover:bg-lime-200"
                      : "bg-lime-100 text-slate-300",
                  ].join(" ")}
                >
                  {canUpgrade ? "Lên cấp" : "Câu tiếp theo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes swim {
          0%,
          100% {
            margin-top: 0;
          }
          50% {
            margin-top: -14px;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          25% {
            transform: translate(-50%, -50%) rotate(-8deg);
          }
          75% {
            transform: translate(-50%, -50%) rotate(8deg);
          }
        }

        @keyframes caught {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            transform: translate(240px, -280px) scale(0.6) rotate(20deg);
            opacity: 0.15;
          }
        }

        @keyframes bubble {
          from {
            transform: translateY(0);
            opacity: 0.1;
          }
          20% {
            opacity: 0.8;
          }
          to {
            transform: translateY(-620px);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
