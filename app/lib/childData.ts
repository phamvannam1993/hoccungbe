'use client';

// Lớp truy cập dữ liệu học tập của bé.
// - Đã ĐĂNG NHẬP  → gọi API (lưu trên server).
// - KHÁCH (chưa đăng nhập) → lưu HOÀN TOÀN trên localStorage của trình duyệt.
// Nhờ đó khách vẫn tạo được trẻ, cho trẻ học và xem tiến độ như người đăng nhập.

import { apiFetch } from './api';
import { awardForExercise } from './stars';

// currentLevel = LỚP của bé ('1' | '2' | '3' …) — quản lý nội dung theo lớp.
export type ChildPrefs = {
  book?: string;            // Bộ sách đang dùng
  priority?: string;        // Môn ưu tiên: 'math' | 'language' | 'english'
  mathLesson?: string;      // Bài Toán đang học trên lớp
  vietLesson?: string;      // Bài Tiếng Việt đang học trên lớp
  dailyGoalMin?: number;    // Mục tiêu phút/ngày (10/15/20)
  desiredLevel?: string;    // Mức độ mong muốn: 'easy' | 'medium' | 'hard'
  weakSkills?: string[];    // Kỹ năng phụ huynh thấy bé còn yếu
};
export type Child = { id: number; fullName: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; age?: number; currentLevel?: string; prefsJson?: ChildPrefs; placementJson?: PlacementResult };
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
export type HistoryItem = { id: number; lessonId: number; lessonTitle?: string; lessonSlug?: string; courseSlug?: string | null; courseType?: string | null; score: number; correctCount: number; totalQuestions: number; createdAt: string };
export type Streak = { currentStreak: number; longestStreak: number; totalActiveDays: number };

// URL bài học CHUẨN: /{courseSlug}/{lessonSlug} (đi thẳng, không qua redirect).
// Thiếu courseSlug (dữ liệu cũ) → /{lessonSlug} (nhờ redirect 308). Không có slug → /lessons/{id}.
export function lessonHref(x: { courseSlug?: string | null; lessonSlug?: string | null; lessonId?: number }): string {
  if (x.courseSlug && x.lessonSlug) return `/${x.courseSlug}/${x.lessonSlug}`;
  if (x.lessonSlug) return `/${x.lessonSlug}`;
  return `/lessons/${x.lessonId ?? ''}`;
}

type LocalAttempt = {
  id: number;
  childId: number;
  lessonId: number;
  lessonSlug?: string;
  courseSlug?: string;
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
export const GRADES = ['1', '2', '3', '4', '5']; // các lớp có thể có nội dung; tab tự ẩn lớp chưa có khóa
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

export async function createChild(data: { fullName: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; currentLevel?: string; prefsJson?: ChildPrefs }): Promise<Child> {
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

export async function updateChild(id: number, data: { fullName?: string; nickname?: string; gender?: string; birthDate?: string; avatarUrl?: string; currentLevel?: string; prefsJson?: ChildPrefs }): Promise<Child> {
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
  const totalQ = dto.answers.length;
  const correctQ = dto.answers.filter((a) => a.isCorrect).length;
  const scorePct = totalQ ? Math.round((correctQ / totalQ) * 100) : 0;
  // Thưởng sao (ví client) — 1 lần cho mỗi bài, cho cả khách lẫn tài khoản.
  try { awardForExercise(dto.childId, dto.lessonId, dto.exerciseNumber, scorePct); } catch { /* ignore */ }

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
    courseSlug: dto.courseSlug,
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

// ── Các câu bé làm SAI ở lần gần nhất của 1 chặng (để "Ôn câu sai" riêng chặng đó) ──
export async function wrongQuizIdsFor(
  childId: number,
  lessonId: number,
  exerciseNumber: number,
): Promise<number[]> {
  if (!isGuest()) {
    // Server trả về các quiz mà lần trả lời gần nhất là sai (mọi bài) → lọc theo bài + chặng.
    try {
      const quizzes = await apiFetch<{ id: number; lessonId: number; exerciseNumber: number }[]>(
        `/attempts/wrong/${childId}`,
      );
      return (Array.isArray(quizzes) ? quizzes : [])
        .filter((q) => Number(q.lessonId) === lessonId && Number(q.exerciseNumber) === exerciseNumber)
        .map((q) => q.id);
    } catch {
      return [];
    }
  }
  // Khách: đọc bản ghi gần nhất của chặng trong localStorage.
  const rec = localAttemptsOf(childId).find(
    (a) => a.lessonId === lessonId && a.exerciseNumber === exerciseNumber,
  );
  if (!rec || !Array.isArray(rec.answers)) return [];
  return rec.answers.filter((a) => !a.isCorrect).map((a) => a.quizId);
}

// ── Toàn bộ câu sai của 1 bài học (gộp mọi chặng) → dùng cho phiếu ôn câu sai ──
export async function wrongQuizIdsForLesson(childId: number, lessonId: number): Promise<number[]> {
  if (!isGuest()) {
    try {
      const quizzes = await apiFetch<{ id: number; lessonId: number }[]>(`/attempts/wrong/${childId}`);
      return (Array.isArray(quizzes) ? quizzes : [])
        .filter((q) => Number(q.lessonId) === lessonId)
        .map((q) => q.id);
    } catch {
      return [];
    }
  }
  const ids: number[] = [];
  for (const rec of localAttemptsOf(childId).filter((a) => a.lessonId === lessonId)) {
    for (const a of rec.answers ?? []) if (!a.isCorrect) ids.push(a.quizId);
  }
  return [...new Set(ids)];
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
    .map((a) => ({ id: a.id, lessonId: a.lessonId, lessonTitle: a.lessonTitle, lessonSlug: a.lessonSlug, courseSlug: a.courseSlug, courseType: a.courseType, score: a.score, correctCount: a.correctCount, totalQuestions: a.totalQuestions, createdAt: a.createdAt }));
}

// ── Kế hoạch hôm nay (lộ trình cá nhân hóa — công thức 40/30/20/10) ──
export type PlanKind = 'review_wrong' | 'current' | 'review_old' | 'challenge';
export type PlanTask = {
  id?: number;
  kind: PlanKind;
  lessonId: number;
  lessonTitle?: string | null;
  lessonSlug?: string | null;
  courseSlug?: string | null;
  courseType?: string | null;
  reason?: string;
  wrongCount?: number;
  status?: 'pending' | 'done' | 'skipped';
};

/**
 * Kế hoạch học hôm nay của bé.
 * - Đã đăng nhập → engine server /recommendations (40% ôn câu sai, 30% bài đang học,
 *   20% ôn cũ, 10% thử thách).
 * - Khách (guest) → dựng từ lịch sử local: bài còn câu sai, bài đang dở, bài đã đạt để ôn lại.
 */
export async function dailyPlan(childId: number): Promise<PlanTask[]> {
  if (!isGuest()) {
    try {
      const recs = await apiFetch<Array<PlanTask & { lessonTitle?: string; lessonSlug?: string }>>(`/recommendations/${childId}`);
      return Array.isArray(recs)
        ? recs.map((r) => ({
            id: r.id, kind: r.kind, lessonId: r.lessonId,
            lessonTitle: r.lessonTitle ?? null, lessonSlug: r.lessonSlug ?? null,
            reason: r.reason, wrongCount: r.wrongCount, status: r.status,
          }))
        : [];
    } catch {
      return [];
    }
  }
  // GUEST — dựng từ lịch sử local (gộp theo bài: điểm cao nhất + lần gần nhất)
  const attempts = localAttemptsOf(childId);
  if (!attempts.length) return [];
  type Agg = { lessonId: number; title?: string; slug?: string; cSlug?: string; ct?: string; best: number; last: string; wrong: number };
  const byLesson = new Map<number, Agg>();
  for (const a of attempts) {
    const wrong = Math.max(0, (a.totalQuestions || 0) - (a.correctCount || 0));
    const cur = byLesson.get(a.lessonId);
    if (!cur) {
      byLesson.set(a.lessonId, { lessonId: a.lessonId, title: a.lessonTitle, slug: a.lessonSlug, cSlug: a.courseSlug, ct: a.courseType, best: a.score, last: a.createdAt, wrong });
    } else {
      cur.best = Math.max(cur.best, a.score);
      if (a.createdAt > cur.last) { cur.last = a.createdAt; cur.wrong = wrong; }
    }
  }
  const list = [...byLesson.values()];
  const used = new Set<number>();
  const plan: PlanTask[] = [];
  const newest = (a: Agg, b: Agg) => (a.last < b.last ? 1 : -1);

  const wrongLesson = list.filter((l) => l.best < 100 && l.wrong > 0).sort(newest)[0];
  if (wrongLesson) {
    plan.push({ kind: 'review_wrong', lessonId: wrongLesson.lessonId, lessonTitle: wrongLesson.title, lessonSlug: wrongLesson.slug, courseSlug: wrongLesson.cSlug, courseType: wrongLesson.ct, wrongCount: wrongLesson.wrong, reason: `Ôn ${wrongLesson.wrong} câu con từng làm sai` });
    used.add(wrongLesson.lessonId);
  }
  const cur = list.filter((l) => !used.has(l.lessonId) && l.best < 70).sort(newest)[0];
  if (cur) {
    plan.push({ kind: 'current', lessonId: cur.lessonId, lessonTitle: cur.title, lessonSlug: cur.slug, courseSlug: cur.cSlug, courseType: cur.ct, reason: 'Học tiếp bài đang còn dang dở' });
    used.add(cur.lessonId);
  }
  const old = list.filter((l) => !used.has(l.lessonId) && l.best >= 70).sort((a, b) => (a.last > b.last ? 1 : -1))[0];
  if (old) {
    plan.push({ kind: 'review_old', lessonId: old.lessonId, lessonTitle: old.title, lessonSlug: old.slug, courseSlug: old.cSlug, courseType: old.ct, reason: 'Ôn lại kiến thức đã học cho nhớ lâu' });
    used.add(old.lessonId);
  }
  // 10% Thử thách — với khách, gắn một trò chơi vui (slug 'tro-choi').
  if (plan.length) {
    plan.push({ kind: 'challenge', lessonId: 0, lessonTitle: 'Trò chơi ôn tập vui', lessonSlug: 'tro-choi', reason: 'Một thử thách vui để nâng cao phản xạ' });
  }
  return plan;
}

// ── Khảo sát đầu vào (placement) ──
export type PlacementSkill = { skillId: number; name: string; subject: string; pct: number; correct: number; total: number };
export type PlacementResult = {
  overallPct: number; correct: number; total: number;
  tier: 'easy' | 'medium' | 'hard'; level: string; desc: string;
  skills: PlacementSkill[]; strengths: string[]; weaknesses: string[]; date: string;
};

const placementKey = (childId: number) => `bhh_placement_${childId}`;

export function savePlacementLocal(childId: number, result: PlacementResult) {
  try { localStorage.setItem(placementKey(childId), JSON.stringify(result)); } catch { /* ignore */ }
}
export function getPlacementLocal(childId: number): PlacementResult | null {
  try { const s = localStorage.getItem(placementKey(childId)); return s ? (JSON.parse(s) as PlacementResult) : null; } catch { return null; }
}

/** Danh sách bài Toán & Tiếng Việt của một lớp — cho dropdown "bài đang học trên lớp". */
export async function lessonOptions(grade: string): Promise<{ math: { id: number; title: string }[]; viet: { id: number; title: string }[] }> {
  try {
    const cr = await apiFetch<unknown>('/courses?limit=500');
    const courses = (Array.isArray(cr) ? cr : ((cr as { data?: unknown[] })?.data ?? [])) as Array<{ id: number; title?: string; courseType?: string; isPublished?: boolean }>;
    const inGrade = courses.filter((c) => c?.isPublished && String(c?.title ?? '').toLowerCase().includes(`lớp ${grade}`));
    const mathC = inGrade.find((c) => c.courseType === 'math');
    const vietC = inGrade.find((c) => c.courseType === 'language');
    const fetchL = async (id?: number) => {
      if (!id) return [];
      const r = await apiFetch<Array<{ id: number; title?: string; isPublished?: boolean }>>(`/lessons?courseId=${id}&slim=1`);
      return (Array.isArray(r) ? r : []).filter((l) => l.isPublished !== false).map((l) => ({ id: l.id, title: l.title ?? `Bài #${l.id}` }));
    };
    const [math, viet] = await Promise.all([fetchL(mathC?.id), fetchL(vietC?.id)]);
    return { math, viet };
  } catch {
    return { math: [], viet: [] };
  }
}

/** Lấy bộ câu hỏi khảo sát theo lớp. */
export async function placementQuestions(grade: string, count = 12) {
  return apiFetch<Array<{ quizId: number; lessonId: number; questionText: string; options: { key: string; text: string }[]; difficulty: string; courseType: string }>>(
    `/placement/questions?grade=${encodeURIComponent(grade)}&count=${count}`,
  );
}

/** Nộp bài khảo sát → kết quả; đăng nhập thì lưu server, khách thì lưu localStorage. */
export async function placementSubmit(childId: number, grade: string, answers: { quizId: number; selected: string }[]): Promise<PlacementResult> {
  const body = { grade, answers, ...(isGuest() ? {} : { childId }) };
  const result = await apiFetch<PlacementResult>(`/placement/submit`, { method: 'POST', body: JSON.stringify(body) });
  if (isGuest()) savePlacementLocal(childId, result);
  return result;
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
