'use client';

// Lớp gọi API cho phiên "Luyện theo kỹ năng".
//
// Khác với làm bài theo bài học: một phiên ở đây TỔNG HỢP câu của cùng một kỹ năng
// (vd 10 câu phép chia) và được ghi nhận riêng qua /skill-practice, không đi qua
// /attempts — bản ghi ở đó khoá theo bài + số bài tập nên nhét phiên trộn nhiều
// bài vào sẽ ghi đè tiến độ của chính những bài ấy.

import { apiFetch } from './api';

export type PracticeQuestion = {
  id: number;
  skillCode: string;
  skillName: string;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options: string[];
};

export type PracticeSession = {
  skill: { id: number; code: string; name: string; icon?: string | null };
  grade: number;
  /** Bậc thành thạo hiện tại của bé với kỹ năng này (0–4) — quyết định độ khó phiên. */
  level: number;
  levelName: string;
  questions: PracticeQuestion[];
};

export type MasteryProgress = {
  level: number;
  levelName: string;
  changed: 'up' | 'down' | 'same';
  masteryPercent: number;
  /** Còn bao nhiêu câu đúng nữa (ở mức khó của bậc) là lên bậc. */
  toNextLevel: number;
  /** Đã luyện bậc này trong mấy ngày khác nhau / cần mấy ngày. */
  distinctDays: number;
  needDays: number;
};

export type CheckResult = {
  questionId: number;
  isCorrect: boolean;
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
};

export type PracticeAnswer = { questionId: number; selectedIndex: number | null; retriedCorrect?: boolean };

export type ChildSkillLevel = {
  skillCode: string;
  level: number;
  levelName: string;
  masteryPercent: number;
  practiced: boolean;
  nextReviewAt: string | null;
  dueForReview: boolean;
  /** Điều kiện còn thiếu để lên bậc — để giao diện nói đúng con số thật. */
  progress: {
    difficulty: 'easy' | 'medium' | 'hard';
    needCorrect: number;
    needQuestions: number;
    toNextLevel: number;
    distinctDays: number;
    needDays: number;
    isMax: boolean;
  };
};

/** Bậc thành thạo hiện tại — để trang kỹ năng hiện tiến trình ngay khi mở. */
export function getChildSkillLevel(childId: number, code: string) {
  return apiFetch<ChildSkillLevel>(`/skill-practice/child/${childId}/skill/${encodeURIComponent(code)}`);
}

export type SkillOverviewItem = {
  code: string;
  name: string;
  icon?: string | null;
  subject: string;
  practiced: boolean;
  level: number;
  levelName: string;
  masteryPercent: number;
  dueForReview: boolean;
  status: 'yeu' | 'can-luyen' | 'on' | 'tot' | 'chua-luyen';
  label: string;
};

/** Tình trạng của bé trên TOÀN BỘ kỹ năng của một lớp — để chỉ ra chỗ đang yếu. */
export function getChildOverview(childId: number, grade: string | number, subject?: string) {
  const st = subject ? `&subject=${subject}` : '';
  return apiFetch<SkillOverviewItem[]>(`/skill-practice/child/${childId}/overview?grade=${grade}${st}`);
}

export function getSession(skill: string, grade: string | number, limit = 10, childId?: number | null) {
  const cid = childId ? `&childId=${childId}` : '';
  return apiFetch<PracticeSession>(
    `/skill-practice/session?skill=${encodeURIComponent(skill)}&grade=${grade}&limit=${limit}${cid}`,
  );
}

/** Chấm ở server để đáp án không nằm sẵn trong trang. */
export function checkAnswer(questionId: number, selectedIndex: number | null) {
  return apiFetch<CheckResult>('/skill-practice/check', {
    method: 'POST',
    body: JSON.stringify({ questionId, selectedIndex }),
  });
}

/** Câu cùng dạng khác số liệu — cho vòng "Sai → Giải thích → Thử câu tương tự". */
export function getVariant(questionId: number) {
  return apiFetch<PracticeQuestion | null>(`/skill-practice/variant/${questionId}`);
}

export function submitSession(dto: {
  childId: number;
  skillCode: string;
  grade: number;
  timeSpentSec?: number;
  answers: PracticeAnswer[];
}) {
  return apiFetch<{ score: number; correct: number; total: number; mastery: MasteryProgress }>('/skill-practice/attempts', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
