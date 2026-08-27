import { addStars } from './stars';

/**
 * Nhiệm vụ tuần — mục tiêu ngắn hạn, đặt lại mỗi tuần → lý do để bé quay lại đều đặn.
 * Hoàn thành nhận sao thưởng (một lần / tuần / nhiệm vụ). Thuần client (localStorage),
 * chạy cho cả khách & offline.
 */

export type QuestKind = 'lessons' | 'activeDays' | 'perfect' | 'subjects';

export type Quest = {
  id: string;
  emoji: string;
  title: string;
  kind: QuestKind;
  goal: number;
  reward: number; // sao thưởng
};

export const WEEKLY_QUESTS: Quest[] = [
  { id: 'q-lessons', emoji: '📚', title: 'Hoàn thành 5 bài học trong tuần', kind: 'lessons', goal: 5, reward: 15 },
  { id: 'q-days', emoji: '🔥', title: 'Học đủ 3 ngày trong tuần', kind: 'activeDays', goal: 3, reward: 20 },
  { id: 'q-perfect', emoji: '💯', title: 'Đạt điểm 100% ở 2 bài', kind: 'perfect', goal: 2, reward: 15 },
  { id: 'q-subjects', emoji: '🧠', title: 'Học từ 2 môn khác nhau', kind: 'subjects', goal: 2, reward: 10 },
];

export type WeekStats = { lessons: number; activeDays: number; perfect: number; subjects: number };

export function questCurrent(q: Quest, s: WeekStats): number {
  return s[q.kind];
}

/** Khoá tuần dạng "YYYY-Www" theo ISO (thứ 2 đầu tuần). */
export function weekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const KEY = 'bhh_quests_v1';

function read(): Record<string, Record<string, string[]>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(store: Record<string, Record<string, string[]>>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
}

/** Danh sách quest đã nhận thưởng trong tuần hiện tại của bé. */
export function getClaimed(childId: number, wk = weekKey()): string[] {
  return read()[String(childId)]?.[wk] || [];
}

export function isClaimed(childId: number, questId: string, wk = weekKey()): boolean {
  return getClaimed(childId, wk).includes(questId);
}

/**
 * Nhận thưởng một nhiệm vụ nếu đã đạt & chưa nhận trong tuần.
 * Trả về số sao được cộng (0 nếu chưa đủ điều kiện / đã nhận).
 */
export function claimQuest(childId: number, quest: Quest, s: WeekStats): number {
  const wk = weekKey();
  if (isClaimed(childId, quest.id, wk)) return 0;
  if (questCurrent(quest, s) < quest.goal) return 0;
  const store = read();
  const key = String(childId);
  store[key] = store[key] || {};
  store[key][wk] = [...(store[key][wk] || []), quest.id];
  write(store);
  addStars(childId, quest.reward);
  return quest.reward;
}
