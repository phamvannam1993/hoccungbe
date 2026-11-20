// "Sân chơi Trí tuệ" — thử thách 10 câu MỖI NGÀY, cùng một bộ câu cho mọi bé cùng lớp
// trong cùng ngày (seed theo ngày + lớp). Câu hỏi lấy từ engine Thi Tài (app/lib/thiTai.ts)
// chạy với PRNG có seed, nên Thi Tài vẫn dùng Math.random như cũ.
//
// Điểm & thành tích lưu localStorage theo từng bé (khách chưa tạo hồ sơ dùng khoá "guest"),
// chạy được cả khi offline. Bảng xếp hạng đi qua API /challenges (subject = 'san-choi').

import { buildThiTai, mulberry32, seedFromString, withSeededRandom, type ThiQ, type ThiSubject } from './thiTai';

export const SAN_CHOI_SUBJECT = 'san-choi';
export const DAILY_COUNT = 10;
export const DAILY_STARS = 100;
export const RUN_CAP = 200;

/** Ngày theo giờ máy của bé, dạng YYYY-MM-DD (ổn định trong ngày, đổi lúc nửa đêm). */
export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Cơ cấu 10 câu mỗi ngày: Toán 3 · IQ/Khám phá 3 · Tiếng Việt 2 · Tiếng Anh 2.
const MIX: [ThiSubject, number][] = [
  ['toan', 3],
  ['kham-pha', 3],
  ['tieng-viet', 2],
  ['tieng-anh', 2],
];

/** Bộ câu thử thách của ngày `date` cho lớp `grade` — tất định: cùng ngày + lớp → cùng câu, cùng thứ tự. */
export function buildDailyChallenge(date: string, grade: number): ThiQ[] {
  const g = clampGrade(grade);
  return buildFromSeed(`san-choi|${date}|${g}`, g);
}

/** Bộ câu của một Phòng thi đấu: tất định theo seed phòng + lớp của phòng (mọi người trong phòng cùng đề). */
export function buildRoomChallenge(seed: string, grade: number): ThiQ[] {
  const g = clampGrade(grade);
  return buildFromSeed(`phong|${seed}|${g}`, g);
}

function clampGrade(grade: number): number {
  return Math.min(5, Math.max(1, Math.round(grade) || 2));
}

function buildFromSeed(seedStr: string, g: number): ThiQ[] {
  const rng = mulberry32(seedFromString(seedStr));
  return withSeededRandom(rng, () => {
    const seen = new Set<string>();
    const out: ThiQ[] = [];
    for (const [subject, n] of MIX) {
      // Bốc dư một chút để còn chỗ bỏ câu trùng giữa các môn.
      let taken = 0;
      for (const q of buildThiTai(subject, g, n + 2)) {
        if (taken >= n) break;
        if (seen.has(q.prompt)) continue;
        seen.add(q.prompt);
        out.push(q);
        taken++;
      }
    }
    // Xáo thứ tự các môn bằng chính rng có seed.
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.slice(0, DAILY_COUNT);
  });
}

/** Điểm một câu đúng: 10 + thưởng tốc độ (≤5s: +5, ≤10s: +3, ≤15s: +1). */
export function pointsFor(ms: number): number {
  const s = ms / 1000;
  return 10 + (s <= 5 ? 5 : s <= 10 ? 3 : s <= 15 ? 1 : 0);
}
export function capRun(score: number): number {
  return Math.max(0, Math.min(RUN_CAP, Math.round(score)));
}

// ── Lưu trữ cục bộ ──
type DayRun = { score: number; correct: number; at: string };
export type SanChoiState = {
  total: number; // tổng điểm Sân chơi (chỉ cộng lượt ĐẦU mỗi ngày)
  days: Record<string, DayRun>; // lượt đầu tiên mỗi ngày
  bestScore: number;
  perfectDays: number;
  badges: Record<string, string>; // id huy hiệu → ngày đạt
};

const KEY = 'bhh_sanchoi_v1';
const NICK_KEY = 'bhh_sanchoi_nick';

export function childKey(childId: number): string {
  return childId ? String(childId) : 'guest';
}

function readAll(): Record<string, SanChoiState> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function blank(): SanChoiState {
  return { total: 0, days: {}, bestScore: 0, perfectDays: 0, badges: {} };
}
export function getSanChoi(key: string): SanChoiState {
  const s = readAll()[key];
  return s ? { ...blank(), ...s } : blank();
}

export function doneToday(key: string, date = dayKey()): DayRun | null {
  return getSanChoi(key).days[date] || null;
}

/** Chuỗi ngày hoàn thành thử thách liên tiếp (tới hôm nay, hoặc tới hôm qua nếu hôm nay chưa chơi). */
export function sanChoiStreak(s: SanChoiState): number {
  const cur = new Date();
  if (!s.days[dayKey(cur)]) cur.setDate(cur.getDate() - 1);
  let n = 0;
  while (s.days[dayKey(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
  return n;
}

// ── Huy hiệu riêng của Sân chơi (có ngày đạt). Huy hiệu chung vẫn ở app/lib/achievements.ts ──
export type SanChoiBadge = { id: string; emoji: string; title: string; test: (s: SanChoiState) => boolean };
export const SAN_CHOI_BADGES: SanChoiBadge[] = [
  { id: 'sc-first', emoji: '🎯', title: 'Khởi động trí tuệ', test: (s) => Object.keys(s.days).length >= 1 },
  { id: 'sc-perfect', emoji: '💯', title: 'Mười câu mười điểm', test: (s) => s.perfectDays >= 1 },
  { id: 'sc-streak3', emoji: '🔥', title: 'Ba ngày liền mạch', test: (s) => sanChoiStreak(s) >= 3 },
  { id: 'sc-500', emoji: '🥉', title: 'Nhà thông thái nhí', test: (s) => s.total >= 500 },
  { id: 'sc-streak7', emoji: '🌟', title: 'Tuần lễ trí tuệ', test: (s) => sanChoiStreak(s) >= 7 },
  { id: 'sc-2000', emoji: '🏆', title: 'Cao thủ Sân chơi', test: (s) => s.total >= 2000 },
];

/** Huy hiệu Sân chơi xịn nhất đã đạt (đứng sau trong danh sách = khó hơn). */
export function bestSanChoiBadge(s: SanChoiState): { badge: SanChoiBadge; date: string } | null {
  for (let i = SAN_CHOI_BADGES.length - 1; i >= 0; i--) {
    const b = SAN_CHOI_BADGES[i];
    if (s.badges[b.id]) return { badge: b, date: s.badges[b.id] };
  }
  return null;
}

/**
 * Ghi một lượt chơi. Chỉ lượt ĐẦU TIÊN trong ngày được tính điểm & thưởng;
 * các lượt sau là luyện tập. Trả về `first` + các huy hiệu vừa mở.
 */
export function recordRun(key: string, score: number, correct: number, date = dayKey()): { first: boolean; state: SanChoiState; newBadges: SanChoiBadge[] } {
  const all = readAll();
  const s = all[key] ? { ...blank(), ...all[key] } : blank();
  if (s.days[date]) return { first: false, state: s, newBadges: [] };
  const sc = capRun(score);
  s.days = { ...s.days, [date]: { score: sc, correct, at: new Date().toISOString() } };
  s.total += sc;
  s.bestScore = Math.max(s.bestScore, sc);
  if (correct >= DAILY_COUNT) s.perfectDays += 1;
  const newBadges: SanChoiBadge[] = [];
  for (const b of SAN_CHOI_BADGES) {
    if (!s.badges[b.id] && b.test(s)) { s.badges = { ...s.badges, [b.id]: date }; newBadges.push(b); }
  }
  all[key] = s;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* ignore */ }
  return { first: true, state: s, newBadges };
}

// ── Biệt danh cho khách chưa có hồ sơ bé ──
export function getNick(): string {
  if (typeof window === 'undefined') return '';
  try { return localStorage.getItem(NICK_KEY) || ''; } catch { return ''; }
}
export function setNick(name: string) {
  try { localStorage.setItem(NICK_KEY, name.trim().slice(0, 24)); } catch { /* ignore */ }
}
