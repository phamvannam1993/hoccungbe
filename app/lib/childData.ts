'use client';

// Lớp truy cập dữ liệu học tập của bé.
// - Đã ĐĂNG NHẬP  → gọi API (lưu trên server).
// - KHÁCH (chưa đăng nhập) → lưu HOÀN TOÀN trên localStorage của trình duyệt.
// Nhờ đó khách vẫn tạo được trẻ, cho trẻ học và xem tiến độ như người đăng nhập.

import { apiFetch } from './api';

// currentLevel = LỚP của bé ('1' | '2' | '3' …) — quản lý nội dung theo lớp.
export type Child = { id: number; fullName: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; age?: number; currentLevel?: string };
export type AnswerInput = { quizId: number; isCorrect: boolean };
export type RecordInput = {
  childId: number;
  lessonId: number;
  exerciseNumber: number;
  difficultyLevel?: string;
  answers: AnswerInput[];
  // Thông tin phụ cho chế độ khách (để hiển thị & tính mastery theo môn).
  courseSlug?: string;
  courseTitle?: string;
  lessonSlug?: string;
  lessonTitle?: string;
};
export type ExerciseStatus = { exerciseNumber: number; score: number; correctCount: number; totalQuestions: number; stars: number; completed: boolean };
export type Stats = { childId: number; totalAttempts: number; avgScore: number; accuracy: number; totalTimeSec: number; totalQuestions: number; totalCorrect: number; lessonsCompleted: number };
export type Mastery = { skillId: number; subject: string; masteryPercent: number; level: number; totalCount: number; correctCount: number; skill: { name: string; subject: string; icon?: string } };
export type HistoryItem = { id: number; lessonId: number; lessonTitle?: string; lessonSlug?: string; courseType?: string | null; score: number; correctCount: number; totalQuestions: number; createdAt: string };
export type Streak = { currentStreak: number; longestStreak: number; totalActiveDays: number };

type LocalAttempt = {
  id: number;
  childId: number;
  lessonId: number;
  lessonSlug?: string;
  lessonTitle?: string;
  courseType: string;
  exerciseNumber: number;
  difficultyLevel?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  answers: AnswerInput[];
  createdAt: string;
};

const CHILDREN_KEY = 'bhh_local_children';
const HISTORY_KEY = 'bhh_local_history';

// ── Lớp học (quản lý nội dung theo lớp) ──
export const GRADES = ['1', '2', '3']; // các lớp đang có nội dung xuất bản
export function gradeLabel(g?: string | null): string {
  return g ? `Lớp ${g}` : 'Chưa chọn lớp';
}
// Suy ra lớp từ slug khóa học ("toan-hoc-lop-1" → "1").
export function gradeFromSlug(slug?: string | null): string | null {
  const m = (slug ?? '').toLowerCase().match(/lop-?(\d)/);
  return m ? m[1] : null;
}

// ── Nhận biết chế độ ──
export function isGuest(): boolean {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem('bhh_token');
}
function getUserId(): number {
  try {
    return Number(JSON.parse(localStorage.getItem('bhh_user') || '{}')?.id || 0);
  } catch {
    return 0;
  }
}

// ── localStorage helpers ──
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota / private mode → bỏ qua */
  }
}

// Suy ra MÔN từ slug/tên khóa học (để tính mastery cho khách).
export function inferSubject(slug?: string, title?: string): string {
  const s = `${slug ?? ''} ${title ?? ''}`.toLowerCase();
  if (s.includes('toan') || s.includes('toán')) return 'math';
  if (s.includes('tieng-anh') || s.includes('tiếng anh') || s.includes('english')) return 'english';
  if (s.includes('tieng-viet') || s.includes('tiếng việt')) return 'language';
  return 'other';
}
const SUBJECT_META: Record<string, { id: number; name: string; icon: string }> = {
  math: { id: 1, name: 'Toán', icon: '🔢' },
  language: { id: 2, name: 'Tiếng Việt', icon: '📖' },
  english: { id: 3, name: 'Tiếng Anh', icon: '🅰️' },
  logic: { id: 4, name: 'Tư duy', icon: '🧩' },
  emotion: { id: 5, name: 'Cảm xúc', icon: '💚' },
  creative: { id: 6, name: 'Sáng tạo', icon: '🎨' },
  other: { id: 7, name: 'Khác', icon: '✨' },
};
// Thông tin môn học từ courseType (dùng chung cho bảng theo dõi tuần).
export function subjectInfo(courseType?: string | null): { id: number; name: string; icon: string } {
  return SUBJECT_META[courseType ?? 'other'] ?? SUBJECT_META.other;
}
function levelFor(pct: number): number {
  if (pct < 20) return 0;
  if (pct < 40) return 1;
  if (pct < 60) return 2;
  if (pct < 80) return 3;
  return 4;
}
function starsForScore(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

// ── Danh sách trẻ ──
export function getCurrentChildId(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem('bhh_child_id') || '0');
}
export function setCurrentChildId(id: number) {
  localStorage.setItem('bhh_child_id', String(id));
}

export async function listChildren(): Promise<Child[]> {
  if (isGuest()) return readJSON<Child[]>(CHILDREN_KEY, []);
  const uid = getUserId();
  const r = await apiFetch<Child[]>(uid ? `/children?userId=${uid}` : '/children');
  return Array.isArray(r) ? r : [];
}

export async function createChild(data: { fullName: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; currentLevel?: string }): Promise<Child> {
  if (isGuest()) {
    const list = readJSON<Child[]>(CHILDREN_KEY, []);
    const child: Child = { id: Date.now(), ...data };
    writeJSON(CHILDREN_KEY, [...list, child]);
    return child;
  }
  return apiFetch<Child>('/children', {
    method: 'POST',
    body: JSON.stringify({ userId: getUserId(), ...data }),
  });
}

export async function updateChild(id: number, data: { fullName?: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; currentLevel?: string }): Promise<Child> {
  if (isGuest()) {
    const list = readJSON<Child[]>(CHILDREN_KEY, []);
    const next = list.map((c) => (c.id === id ? { ...c, ...data } : c));
    writeJSON(CHILDREN_KEY, next);
    return next.find((c) => c.id === id)!;
  }
  return apiFetch<Child>(`/children/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteChild(id: number): Promise<void> {
  if (isGuest()) {
    writeJSON(CHILDREN_KEY, readJSON<Child[]>(CHILDREN_KEY, []).filter((c) => c.id !== id));
    // Dọn lịch sử của bé bị xóa.
    writeJSON(HISTORY_KEY, readJSON<LocalAttempt[]>(HISTORY_KEY, []).filter((a) => a.childId !== id));
    return;
  }
  await apiFetch(`/children/${id}`, { method: 'DELETE' });
}

// ── Ghi kết quả làm bài (upsert theo bé + bài + bài tập) ──
export async function recordAttempt(dto: RecordInput) {
  if (!isGuest()) {
    return apiFetch<{ attempt: unknown; rewards?: { newBadges?: { name: string; icon?: string }[]; completedQuests?: { name: string }[] } }>('/attempts', {
      method: 'POST',
      body: JSON.stringify({
        childId: dto.childId,
        lessonId: dto.lessonId,
        exerciseNumber: dto.exerciseNumber,
        difficultyLevel: dto.difficultyLevel,
        answers: dto.answers,
      }),
    });
  }
  // Khách: lưu localStorage, upsert 1 bản ghi cho mỗi bé+bài+bài tập.
  const all = readJSON<LocalAttempt[]>(HISTORY_KEY, []);
  const total = dto.answers.length;
  const correct = dto.answers.filter((a) => a.isCorrect).length;
  const score = total ? Math.round((correct / total) * 10000) / 100 : 0;
  const idx = all.findIndex((a) => a.childId === dto.childId && a.lessonId === dto.lessonId && a.exerciseNumber === dto.exerciseNumber);
  const rec: LocalAttempt = {
    id: idx >= 0 ? all[idx].id : Date.now(),
    childId: dto.childId,
    lessonId: dto.lessonId,
    lessonSlug: dto.lessonSlug,
    lessonTitle: dto.lessonTitle,
    courseType: inferSubject(dto.courseSlug, dto.courseTitle),
    exerciseNumber: dto.exerciseNumber,
    difficultyLevel: dto.difficultyLevel,
    score,
    correctCount: correct,
    totalQuestions: total,
    answers: dto.answers,
    createdAt: new Date().toISOString(),
  };
  if (idx >= 0) all[idx] = rec;
  else all.push(rec);
  writeJSON(HISTORY_KEY, all);
  return { attempt: rec, rewards: { newBadges: [], completedQuests: [] } };
}

function localAttemptsOf(childId: number): LocalAttempt[] {
  return readJSON<LocalAttempt[]>(HISTORY_KEY, []).filter((a) => a.childId === childId);
}

// ── Trạng thái từng bài tập trong 1 bài học ──
export async function lessonStatus(childId: number, lessonId: number): Promise<ExerciseStatus[]> {
  if (!isGuest()) {
    const r = await apiFetch<ExerciseStatus[]>(`/attempts/lesson/${childId}/${lessonId}`);
    return Array.isArray(r) ? r : [];
  }
  return localAttemptsOf(childId)
    .filter((a) => a.lessonId === lessonId)
    .map((a) => ({
      exerciseNumber: a.exerciseNumber,
      score: a.score,
      correctCount: a.correctCount,
      totalQuestions: a.totalQuestions,
      stars: starsForScore(a.score),
      completed: a.score >= 50,
    }));
}

// ── Thống kê tổng ──
export async function childStats(childId: number): Promise<Stats | null> {
  if (!isGuest()) {
    try {
      return await apiFetch<Stats>(`/attempts/stats/${childId}`);
    } catch {
      return null;
    }
  }
  const rows = localAttemptsOf(childId);
  const totalAttempts = rows.length;
  const totalQuestions = rows.reduce((s, a) => s + a.totalQuestions, 0);
  const totalCorrect = rows.reduce((s, a) => s + a.correctCount, 0);
  const avgScore = totalAttempts ? Math.round((rows.reduce((s, a) => s + a.score, 0) / totalAttempts) * 100) / 100 : 0;
  const lessonsCompleted = new Set(rows.filter((a) => a.score >= 50).map((a) => a.lessonId)).size;
  return {
    childId,
    totalAttempts,
    avgScore,
    accuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 10000) / 100 : 0,
    totalTimeSec: 0,
    totalQuestions,
    totalCorrect,
    lessonsCompleted,
  };
}

// ── Mức thành thạo theo MÔN ──
export async function childMastery(childId: number): Promise<Mastery[]> {
  if (!isGuest()) {
    const r = await apiFetch<Mastery[]>(`/skills/child/${childId}/mastery`);
    return Array.isArray(r) ? r : [];
  }
  const rows = localAttemptsOf(childId);
  const bySubject = new Map<string, { correct: number; total: number }>();
  for (const a of rows) {
    const cur = bySubject.get(a.courseType) ?? { correct: 0, total: 0 };
    cur.correct += a.correctCount;
    cur.total += a.totalQuestions;
    bySubject.set(a.courseType, cur);
  }
  return [...bySubject.entries()]
    .map(([subject, v]) => {
      const pct = v.total ? Math.round((v.correct / v.total) * 10000) / 100 : 0;
      const meta = SUBJECT_META[subject] ?? SUBJECT_META.other;
      return { skillId: meta.id, subject, masteryPercent: pct, level: levelFor(pct), totalCount: v.total, correctCount: v.correct, skill: { name: meta.name, subject, icon: meta.icon } };
    })
    .sort((a, b) => b.masteryPercent - a.masteryPercent);
}

// ── Lịch sử làm bài gần đây ──
export async function childHistory(childId: number, limit = 20): Promise<HistoryItem[]> {
  if (!isGuest()) {
    const r = await apiFetch<HistoryItem[]>(`/attempts/history/${childId}?limit=${limit}`);
    return Array.isArray(r) ? r : [];
  }
  return localAttemptsOf(childId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit)
    .map((a) => ({ id: a.id, lessonId: a.lessonId, lessonTitle: a.lessonTitle, lessonSlug: a.lessonSlug, courseType: a.courseType, score: a.score, correctCount: a.correctCount, totalQuestions: a.totalQuestions, createdAt: a.createdAt }));
}

// ── Chuỗi ngày học ──
export async function childStreak(childId: number): Promise<Streak | null> {
  if (!isGuest()) {
    try {
      return await apiFetch<Streak>(`/streaks/${childId}`);
    } catch {
      return null;
    }
  }
  const days = [...new Set(localAttemptsOf(childId).map((a) => a.createdAt.slice(0, 10)))].sort();
  const totalActiveDays = days.length;
  if (!totalActiveDays) return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0 };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    run = diff === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  }
  // Chuỗi hiện tại: đếm ngược từ ngày cuối nếu là hôm nay/hôm qua.
  const today = new Date().toISOString().slice(0, 10);
  const last = days[days.length - 1];
  const lastDiff = Math.round((new Date(today).getTime() - new Date(last).getTime()) / 86400000);
  let current = 0;
  if (lastDiff <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const diff = Math.round((new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000);
      if (diff === 1) current++;
      else break;
    }
  }
  return { currentStreak: current, longestStreak: longest, totalActiveDays };
}
