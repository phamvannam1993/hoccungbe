// "Thử thách IQ" (/thu-thach-iq) — dựng bộ 10 câu mỗi ngày (3 Dễ → 4 Vừa → 3 Khó).
//
// • Ngày tính theo giờ Việt Nam (UTC+7) → mọi người cùng một bộ, đổi lúc 0h.
// • Mỗi mức độ có một "băng chuyền" câu hỏi của lớp: ngân hàng (n câu) được xáo theo seed cố
//   định (lớp + mức + năm), ngày thứ d lấy k câu ở vị trí d·k … d·k+k−1 (mod n). Hai ngày liền
//   nhau là hai đoạn liên tiếp nên KHÔNG trùng câu (khi n ≥ 2k); ngày 1/1 đổi hoán vị thì
//   bỏ các câu đã ra hôm 31/12.
// • Mỗi mức có thêm 1 câu quy luật SINH theo seed "YYYY-MM-DD:lopN:mức" (app/lib/iqGenerator.ts);
//   nếu ngân hàng thiếu câu thì câu sinh bù vào cho đủ.
// • Thứ tự đáp án được xáo theo seed ngày + id câu (ngân hàng gốc hay để đáp án đúng ở A).
// Thuần TS — server dựng ngân hàng (pool), client gọi buildDailySet theo ngày + lớp.

import { generateQuestion, rngFor, shuffled, hashSeed, mulberry32, type IqTier } from './iqGenerator';

export type { IqTier };

export type IqItem = {
  id: string;
  grade: number;
  tier: IqTier;
  source: 'tu-duy' | 'iq' | 'gen';
  question: string;
  speech?: string;
  visual?: { emoji?: string; grid?: string[][] };
  options: string[];
  correct: number;
  explanation?: string;
};

export const IQ_TIERS: IqTier[] = ['easy', 'medium', 'hard'];
export const TIER_COUNT: Record<IqTier, number> = { easy: 3, medium: 4, hard: 3 };
export const TIER_LABEL: Record<IqTier, string> = { easy: 'Dễ', medium: 'Vừa', hard: 'Khó' };
export const IQ_GRADES = [1, 2, 3, 4, 5] as const;
/** Số câu SINH mỗi mức (phần còn lại lấy từ ngân hàng). */
const GEN_PER_TIER = 1;

// ── Ngày theo giờ Việt Nam ───────────────────────────────────────────────────
const VN_OFFSET = 7 * 3600 * 1000;
const DAY = 86400 * 1000;

/** "YYYY-MM-DD" theo giờ Việt Nam. */
export function vnDateKey(now = Date.now()): string {
  return new Date(now + VN_OFFSET).toISOString().slice(0, 10);
}
/** Số mili-giây tới 0h hôm sau (giờ Việt Nam). */
export function msUntilNextDay(now = Date.now()): number {
  const t = now + VN_OFFSET;
  return DAY - (t % DAY);
}
export function dayIndex(key: string): number {
  return Math.floor(Date.parse(`${key}T00:00:00Z`) / DAY);
}
export function shiftDateKey(key: string, days: number): string {
  return new Date(Date.parse(`${key}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
}
export function formatDateVi(key: string): string {
  const [y, m, d] = key.split('-');
  return `${d}/${m}/${y}`;
}
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

// ── Băng chuyền theo mức độ ──────────────────────────────────────────────────
const permCache = new Map<string, number[]>();
function perm(seed: string, n: number): number[] {
  const key = `${seed}#${n}`;
  let p = permCache.get(key);
  if (!p) {
    p = shuffled(mulberry32(hashSeed(seed)), Array.from({ length: n }, (_, i) => i));
    permCache.set(key, p);
  }
  return p;
}
/** Câu ở vị trí `pos` của băng chuyền năm `year` (một hoán vị cố định, quay vòng mod n). */
function itemAt(pool: IqItem[], seed: string, year: string, pos: number): IqItem {
  const n = pool.length;
  return pool[perm(`${seed}:${year}`, n)[((pos % n) + n) % n]];
}
function windowOf(pool: IqItem[], seed: string, dateKey: string, k: number): IqItem[] {
  const day = dayIndex(dateKey), year = dateKey.slice(0, 4);
  return Array.from({ length: Math.min(k, pool.length) }, (_, i) => itemAt(pool, seed, year, day * k + i));
}
function pickBank(pool: IqItem[], seed: string, dateKey: string, k: number): IqItem[] {
  if (!pool.length || k <= 0) return [];
  const base = windowOf(pool, seed, dateKey, k);
  const prevKey = shiftDateKey(dateKey, -1);
  // Trong cùng một năm, hai ngày liền nhau là hai đoạn liên tiếp mod n → không trùng khi n ≥ 2k.
  if (prevKey.slice(0, 4) === dateKey.slice(0, 4)) return base;
  // Ngày 1/1 đổi hoán vị: câu nào đã ra hôm 31/12 thì thay bằng câu ở các vị trí NGAY TRƯỚC
  // đoạn hôm nay (không thuộc đoạn của ngày 2/1 khi n ≥ 3k) → ngày 2/1 khỏi phải chỉnh gì.
  const yesterday = new Set(windowOf(pool, seed, prevKey, k).map((q) => q.id));
  const tomorrow = new Set(windowOf(pool, seed, shiftDateKey(dateKey, 1), k).map((q) => q.id));
  const day = dayIndex(dateKey), year = dateKey.slice(0, 4);
  const out = base.filter((q) => !yesterday.has(q.id));
  for (let p = day * k - 1; out.length < base.length && p > day * k - pool.length; p--) {
    const q = itemAt(pool, seed, year, p);
    if (!yesterday.has(q.id) && !tomorrow.has(q.id) && !out.includes(q)) out.push(q);
  }
  for (const q of base) if (out.length < base.length && !out.includes(q)) out.push(q);
  return out;
}

function shuffleOptions(q: IqItem, seed: string): IqItem {
  if (q.source === 'gen') return q; // câu sinh đã tự xáo
  const order = shuffled(rngFor(`${seed}:${q.id}`), q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), correct: order.indexOf(q.correct) };
}

/** Bộ 10 câu của ngày `dateKey` cho lớp `grade`, đã sắp Dễ → Vừa → Khó. */
export function buildDailySet(pool: IqItem[], dateKey: string, grade: number): IqItem[] {
  const out: IqItem[] = [];
  for (const tier of IQ_TIERS) {
    const need = TIER_COUNT[tier];
    const bankPool = pool.filter((q) => q.grade === grade && q.tier === tier);
    const bank = pickBank(bankPool, `lop${grade}:${tier}`, dateKey, need - GEN_PER_TIER);
    const gens: IqItem[] = [];
    for (let i = 0; bank.length + gens.length < need; i++) {
      const g = generateQuestion(grade, tier, `${dateKey}:lop${grade}:${tier}:${i}`);
      gens.push({ id: g.id, grade, tier, source: 'gen', question: g.question, speech: g.speech, visual: g.visual ? { emoji: g.visual } : undefined, options: g.options, correct: g.correct, explanation: g.explanation });
    }
    const tierItems = shuffled(rngFor(`${dateKey}:lop${grade}:${tier}:order`), [...bank, ...gens]);
    out.push(...tierItems.map((q) => shuffleOptions(q, dateKey)));
  }
  return out;
}

// ── Xếp mức độ cho ngân hàng không ghi sẵn độ khó ────────────────────────────
/**
 * `rank` ∈ [0,1]: vị trí tương đối của câu trong bài/lớp (ngân hàng được soạn từ dễ tới khó)
 * cộng thêm độ dài đề. Trong mỗi lớp: 1/3 thấp nhất → Dễ, 1/3 giữa → Vừa, 1/3 cao nhất → Khó.
 * Câu có `difficulty` ghi sẵn thì giữ nguyên.
 */
export function assignTiers<T extends { grade: number; rank: number; difficulty?: IqTier }>(items: T[]): (T & { tier: IqTier })[] {
  const out: (T & { tier: IqTier })[] = [];
  for (const g of new Set(items.map((x) => x.grade))) {
    const fixed = items.filter((x) => x.grade === g && x.difficulty);
    for (const x of fixed) out.push({ ...x, tier: x.difficulty! });
    const rest = items.filter((x) => x.grade === g && !x.difficulty).sort((a, b) => a.rank - b.rank);
    rest.forEach((x, i) => {
      const f = i / rest.length;
      out.push({ ...x, tier: f < 1 / 3 ? 'easy' : f < 2 / 3 ? 'medium' : 'hard' });
    });
  }
  return out;
}

export function rankOf(position: number, total: number, text: string): number {
  const pos = total > 1 ? position / (total - 1) : 0;
  const len = Math.min(text.length / 140, 1);
  const lines = text.includes('\n') ? 1 : 0;
  return 0.7 * pos + 0.2 * len + 0.1 * lines;
}

// ── Lưu kết quả theo bé + ngày (localStorage) ────────────────────────────────
const DONE_KEY = 'bhh_iq_daily_v1';
export type IqDayResult = { grade: number; correct: number; total: number; stars: number };
type DoneStore = Record<string, Record<string, IqDayResult>>;

function readDone(): DoneStore {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(DONE_KEY) || '{}') as DoneStore; } catch { return {}; }
}
export function getDayResult(childId: number, dateKey: string): IqDayResult | null {
  return readDone()[String(childId)]?.[dateKey] ?? null;
}
/** Ghi lần hoàn thành ĐẦU TIÊN trong ngày. Trả về false nếu hôm nay đã có kết quả. */
export function saveFirstResult(childId: number, dateKey: string, r: IqDayResult): boolean {
  const store = readDone();
  const kid = { ...(store[String(childId)] || {}) };
  if (kid[dateKey]) return false;
  kid[dateKey] = r;
  // Giữ 60 ngày gần nhất.
  const keep = Object.keys(kid).sort().slice(-60);
  store[String(childId)] = Object.fromEntries(keep.map((k) => [k, kid[k]]));
  try { localStorage.setItem(DONE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
  return true;
}
