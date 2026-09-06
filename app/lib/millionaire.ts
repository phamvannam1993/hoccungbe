'use client';

// Lớp gọi API cho game "Ai Là Triệu Phú Nhí".
// Câu hỏi lấy từ kho riêng của phần luyện kỹ năng (skill_questions) nên game
// dùng chung ngân hàng câu đã được soát kỹ, không phải viết lại nội dung.

import { apiFetch } from './api';

export type GameMode = 'classic' | 'speed' | 'boss';

export type GameQuestion = {
  id: number;
  questionText: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  /** Bậc khó 1–15, ứng với mốc thưởng cùng số thứ tự. */
  band: number;
  skillCode: string;
  skillName: string;
  /** Môn — quyết định cách đọc câu hỏi lên thành tiếng. */
  subject: 'math' | 'language' | 'english';
};

export type GameSession = {
  grade: number;
  mode: GameMode;
  prizes: number[];
  safeLevels: number[];
  questions: GameQuestion[];
};

export type CheckResult = {
  questionId: number;
  isCorrect: boolean;
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
};

export type SkillAnalysis = {
  code: string; name: string; icon?: string | null;
  correct: number; total: number; percent: number;
};

export type LeaderRow = { rank: number; name: string; avatar?: string | null; score: number; prize: number };

export const MODES: { key: GameMode; label: string; desc: string; emoji: string }[] = [
  { key: 'classic', label: 'Chinh phục triệu phú', desc: '15 câu hỏi · Tăng dần độ khó', emoji: '🏆' },
  { key: 'speed', label: 'Thử thách 60 giây', desc: 'Trả lời càng nhiều càng tốt', emoji: '⏱️' },
  { key: 'boss', label: 'Thử thách Boss', desc: '10 câu khó liên tiếp', emoji: '👹' },
];

export function getSession(grade: number, mode: GameMode) {
  return apiFetch<GameSession>(`/millionaire/session?grade=${grade}&mode=${mode}`);
}

export function checkAnswer(questionId: number, selectedIndex: number | null) {
  return apiFetch<CheckResult>('/millionaire/check', {
    method: 'POST',
    body: JSON.stringify({ questionId, selectedIndex }),
  });
}

/** Gợi ý 50:50 — server trả về 2 đáp án sai để loại, client không biết đáp án đúng. */
export function hintFifty(questionId: number) {
  return apiFetch<{ questionId: number; remove: number[] }>(`/millionaire/hint/fifty?questionId=${questionId}`);
}

export function hintFriends(questionId: number) {
  return apiFetch<{ questionId: number; votes: number[] }>(`/millionaire/hint/friends?questionId=${questionId}`);
}

export function hintSwap(grade: number, band: number, excludeIds: number[]) {
  return apiFetch<GameQuestion>(
    `/millionaire/hint/swap?grade=${grade}&band=${band}&exclude=${excludeIds.join(',')}`,
  );
}

export function finishRun(dto: {
  childId?: number | null; name: string; avatar?: string; grade: number; mode: GameMode;
  totalQuestions: number; correctCount: number; prize: number; bestCombo: number; timeSec: number;
  /** Đúng/sai từng câu — để server chấm lại bậc khó theo số liệu thật. */
  answers?: { questionId: number; isCorrect: boolean }[];
}) {
  return apiFetch<{ id: number; score: number; prize: number }>('/millionaire/finish', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function analyse(answers: { questionId: number; isCorrect: boolean }[]) {
  return apiFetch<SkillAnalysis[]>('/millionaire/analyse', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export function leaderboard(grade: number, period: 'week' | 'month' | 'all') {
  return apiFetch<{ grade: number; period: string; rows: LeaderRow[] }>(
    `/millionaire/leaderboard?grade=${grade}&period=${period}`,
  );
}

// ── Ví xu (localStorage) ────────────────────────────────────────────────
// Xu để mua trợ giúp. Lưu tại máy nên khách chưa đăng nhập vẫn chơi được,
// giống ví sao ⭐ của phần học.
const COIN_KEY = 'bhh_tp_coins';
const START_COINS = 1250;

export function getCoins(): number {
  if (typeof window === 'undefined') return START_COINS;
  try {
    const v = localStorage.getItem(COIN_KEY);
    return v == null ? START_COINS : Math.max(0, Number(v) || 0);
  } catch { return START_COINS; }
}

export function setCoins(n: number) {
  try { localStorage.setItem(COIN_KEY, String(Math.max(0, Math.floor(n)))); } catch { /* bỏ qua */ }
}

export const formatVnd = (n: number) => n.toLocaleString('vi-VN');
