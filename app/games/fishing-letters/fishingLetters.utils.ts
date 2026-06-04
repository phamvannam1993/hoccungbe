import { FishingQuestion, FishingLevel } from "./fishingLetters.data";

// ========== Progress Tracking ==========
export type QuestionStats = {
  id: number;
  target: string;
  timesSeenTotal: number;
  timesCorrect: number;
  accuracy: number; // 0-100%
  lastAttemptTime: number; // timestamp
  confidenceScores: ("easy" | "medium" | "hard")[]; // History
};

export type LevelStats = {
  levelId: string;
  score: number;
  questionsStats: QuestionStats[];
  lastUpdated: number;
};

export type GameProgress = {
  currentLevel: number;
  totalScore: number;
  levelStats: Record<string, LevelStats>;
  confusionPairs: Array<{ pair: [string, string]; count: number }>; // E.g., Đ-D
};

// Load progress from localStorage
export function loadProgress(): GameProgress {
  if (typeof window === "undefined") return getEmptyProgress();
  try {
    const saved = localStorage.getItem("fishingLettersProgress");
    return saved ? JSON.parse(saved) : getEmptyProgress();
  } catch {
    return getEmptyProgress();
  }
}

function getEmptyProgress(): GameProgress {
  return {
    currentLevel: 0,
    totalScore: 0,
    levelStats: {},
    confusionPairs: [],
  };
}

// Save progress
export function saveProgress(progress: GameProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fishingLettersProgress", JSON.stringify(progress));
}

// ========== Spaced Retrieval Algorithm ==========
// Select questions using spaced retrieval: prioritize:
// 1. Questions not seen recently (HARD filter)
// 2. Questions with medium accuracy (not too easy, not too hard)
// 3. Questions student struggled with
export function selectNextQuestion(
  level: FishingLevel,
  progress: GameProgress,
  recentQuestionIds: number[] = []
): FishingQuestion {
  const levelStats = progress.levelStats[level.id];
  if (!levelStats) {
    // First time - random shuffle
    return level.questions[Math.floor(Math.random() * level.questions.length)];
  }

  // HARD FILTER: Exclude recently seen questions
  const availableQuestions = level.questions.filter(
    (q) => !recentQuestionIds.includes(q.id)
  );

  // If all questions are recent, reset - use all questions
  const questionsToConsider =
    availableQuestions.length > 0 ? availableQuestions : level.questions;

  // Score each question for selection
  const scoredQuestions = questionsToConsider.map((q) => {
    const stats = levelStats.questionsStats.find((s) => s.id === q.id);
    const now = Date.now();

    // Prioritize medium difficulty (not too easy, not too hard)
    const accuracyScore = stats
      ? Math.abs(50 - stats.accuracy) // 50% = best for learning
      : 50;

    // Prioritize struggling questions (low accuracy = high priority)
    const strugglingScore = stats ? (1 - stats.accuracy / 100) * 100 : 100;

    // Prioritize not-recently-attempted (spaced practice)
    const timeSinceAttempt = stats ? (now - stats.lastAttemptTime) / 1000 : 0;
    const spacingScore = Math.min(timeSinceAttempt / 60, 10); // Max 10 points

    // Higher = better
    const totalScore = spacingScore + accuracyScore + strugglingScore;

    return {
      question: q,
      score: totalScore,
    };
  });

  // Sort by score and pick from top 5 (randomized to avoid pattern)
  const topQuestions = scoredQuestions.sort((a, b) => b.score - a.score);
  const candidateIndex = Math.floor(Math.random() * Math.min(5, topQuestions.length));
  return topQuestions[candidateIndex].question;
}

// ========== Question Shuffling ==========
// Shuffle answer choices so target is not always in same position
export function shuffleFishes(fishes: string[]): string[] {
  const shuffled = [...fishes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Find target index after shuffle
export function findTargetIndex(fishes: string[], target: string): number {
  return fishes.indexOf(target);
}

// ========== Error Analysis ==========
export function recordAttempt(
  progress: GameProgress,
  levelId: string,
  question: FishingQuestion,
  isCorrect: boolean,
  confidence?: "easy" | "medium" | "hard"
): GameProgress {
  const updatedProgress = { ...progress };

  if (!updatedProgress.levelStats[levelId]) {
    updatedProgress.levelStats[levelId] = {
      levelId,
      score: 0,
      questionsStats: [],
      lastUpdated: Date.now(),
    };
  }

  const levelStats = updatedProgress.levelStats[levelId];
  let questionStats = levelStats.questionsStats.find((s) => s.id === question.id);

  if (!questionStats) {
    questionStats = {
      id: question.id,
      target: question.target,
      timesSeenTotal: 0,
      timesCorrect: 0,
      accuracy: 0,
      lastAttemptTime: Date.now(),
      confidenceScores: [],
    };
    levelStats.questionsStats.push(questionStats);
  }

  questionStats.timesSeenTotal += 1;
  if (isCorrect) questionStats.timesCorrect += 1;
  questionStats.accuracy = Math.round(
    (questionStats.timesCorrect / questionStats.timesSeenTotal) * 100
  );
  questionStats.lastAttemptTime = Date.now();
  if (confidence) questionStats.confidenceScores.push(confidence);

  levelStats.lastUpdated = Date.now();
  if (isCorrect) {
    levelStats.score += 1;
    updatedProgress.totalScore += 1;
  }

  saveProgress(updatedProgress);
  return updatedProgress;
}

// Track which letters student confuses
export function getConfusionPairs(progress: GameProgress): Array<[string, string]> {
  const mistakes: Record<string, Record<string, number>> = {};

  // Scan all attempts
  Object.values(progress.levelStats).forEach((levelStats) => {
    levelStats.questionsStats.forEach((questionStats) => {
      // If low accuracy, likely confused
      if (questionStats.accuracy < 70 && questionStats.timesSeenTotal >= 2) {
        const target = questionStats.target;
        if (!mistakes[target]) mistakes[target] = {};
        // Count as "confused with similar looking"
        // This would be more accurate with actual attempt data
        mistakes[target]["_"] = (mistakes[target]["_"] || 0) + 1;
      }
    });
  });

  return Object.keys(mistakes)
    .map((letter) => [letter, "similar"] as [string, string])
    .slice(0, 5);
}

// ========== Statistics ==========
export function getLevelStatistics(
  levelStats: LevelStats
): {
  overallAccuracy: number;
  masteredCount: number; // accuracy >= 80%
  strugglingCount: number; // accuracy < 60%
  mediumCount: number; // 60-80%
} {
  const stats = levelStats.questionsStats;
  const masteredCount = stats.filter((s) => s.accuracy >= 80).length;
  const strugglingCount = stats.filter((s) => s.accuracy < 60).length;
  const mediumCount = stats.filter((s) => s.accuracy >= 60 && s.accuracy < 80).length;

  const overallAccuracy =
    stats.length > 0
      ? Math.round(
          stats.reduce((sum, s) => sum + s.accuracy, 0) / stats.length
        )
      : 0;

  return { overallAccuracy, masteredCount, strugglingCount, mediumCount };
}
