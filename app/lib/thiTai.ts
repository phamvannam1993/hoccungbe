// Engine "Thi Tài": sinh bộ câu hỏi thi đấu theo MÔN + LỚP, sinh phía client.
// Tái dùng nguồn có sẵn: Toán (sinh theo lớp), Tiếng Anh (VOCAB_TOPICS), Khám phá (KHAM_PHA_TOPICS).

import { VOCAB_TOPICS } from './vocab';
import { KHAM_PHA_TOPICS } from './khampha';
import { CHINH_TA_TOPICS } from './chinhTa';
import { LTC_TOPICS } from './luyenTuCau';
import { GRAMMAR_TOPICS } from './grammar';
import { TRUYEN_CO_TICH } from './truyenCoTich';
import { TAP_DOC } from './tapDoc';
import { TOAN_TU_DUY } from '../toan-tu-duy/data';
import { shuffleQuiz } from './quizShuffle';

export type ThiQ = { prompt: string; options: string[]; correctIndex: number };
export type ThiSubject = 'toan' | 'tieng-viet' | 'tieng-anh' | 'kham-pha' | 'tong-hop';

export const THI_SUBJECTS: { key: ThiSubject; label: string; short: string; emoji: string; color: string }[] = [
  { key: 'tong-hop', label: 'Tổng hợp', short: 'Tổng hợp', emoji: '🏆', color: '#8B5CF6' },
  { key: 'toan', label: 'Toán', short: 'Toán', emoji: '➗', color: '#22C55E' },
  { key: 'tieng-viet', label: 'Tiếng Việt', short: 'Tiếng Việt', emoji: '📖', color: '#F97316' },
  { key: 'tieng-anh', label: 'Tiếng Anh', short: 'Tiếng Anh', emoji: '🅰️', color: '#3B82F6' },
  { key: 'kham-pha', label: 'IQ – Đố vui', short: 'IQ', emoji: '🧠', color: '#EC4899' },
];
export const SUBJECT_LABEL: Record<ThiSubject, string> = {
  toan: 'Toán', 'tieng-viet': 'Tiếng Việt', 'tieng-anh': 'Tiếng Anh', 'kham-pha': 'IQ', 'tong-hop': 'Tổng hợp',
};

// Chủ đề thi theo NGÀY (getDay: 0=CN … 6=T7) — cho bé lý do quay lại mỗi ngày.
export const DAILY_THEMES: { name: string; emoji: string; desc: string; subject: ThiSubject }[] = [
  { name: 'Chung kết tuần', emoji: '👑', desc: 'Tổng hợp toàn lực, chốt hạng tuần!', subject: 'tong-hop' }, // CN
  { name: 'Ngày hội Tính nhanh', emoji: '🧮', desc: 'Luyện Toán phản xạ nhanh', subject: 'toan' }, // T2
  { name: 'Ngày hội IQ', emoji: '🧠', desc: 'Suy luận & quan sát', subject: 'kham-pha' }, // T3
  { name: 'Ngày hội Thần tốc', emoji: '⚡', desc: 'Ai nhanh tay hơn?', subject: 'toan' }, // T4
  { name: 'Ngày hội Bài toán', emoji: '📚', desc: 'Toán có lời văn', subject: 'toan' }, // T5
  { name: 'Ngày Tổng hợp', emoji: '🎯', desc: 'Đủ các môn, thử sức toàn diện', subject: 'tong-hop' }, // T6
  { name: 'Đại chiến cuối tuần', emoji: '🏆', desc: 'Thử thách lớn, thưởng lớn', subject: 'tong-hop' }, // T7
];
export function todayTheme() { return DAILY_THEMES[new Date().getDay()]; }

// Hệ LEVEL theo điểm kỷ lục (best) của từng môn+lớp — game hoá "mở khoá Cao thủ".
export const LEVELS = [
  { level: 1, min: 0, name: 'Tập sự', color: '#22C55E' },
  { level: 2, min: 80, name: 'Cơ bản', color: '#3B82F6' },
  { level: 3, min: 150, name: 'Khá', color: '#F59E0B' },
  { level: 4, min: 230, name: 'Nâng cao', color: '#F97316' },
  { level: 5, min: 320, name: 'Cao thủ', color: '#EF4444' },
];
export function levelOf(best: number) { return [...LEVELS].reverse().find((l) => best >= l.min)!; }
export function nextLevel(best: number) { return LEVELS.find((l) => l.min > best); }

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const KHAM_PHA_ALL = KHAM_PHA_TOPICS.flatMap((t) => t.questions);
const EN_WORDS = VOCAB_TOPICS.flatMap((t) => t.words).filter((w) => w.en && w.vi);

// Kho câu hỏi trắc nghiệm chuẩn hoá {question, options, correct} từ nhiều nguồn.
type Raw = { question: string; options: string[]; correct: number };
// Tiếng Việt = Chính tả + Luyện từ & câu + Đọc hiểu (truyện + tập đọc).
const TV_ALL: Raw[] = [
  ...CHINH_TA_TOPICS.flatMap((t) => t.questions).map((q) => ({ question: q.text, options: q.options, correct: q.correct })),
  ...LTC_TOPICS.flatMap((t) => t.questions).map((q) => ({ question: q.text, options: q.options, correct: q.correct })),
  ...TRUYEN_CO_TICH.flatMap((t) => t.cauHoi).map((q) => ({ question: q.q, options: q.options, correct: q.correct })),
  ...TAP_DOC.map((b) => ({ question: b.question.q, options: b.question.options, correct: b.question.correct })),
];
// Ngữ pháp tiếng Anh (bổ sung cho môn Tiếng Anh).
const GRAMMAR_ALL: Raw[] = GRAMMAR_TOPICS.flatMap((t) => t.questions).map((q) => ({ question: q.text, options: q.options, correct: q.correct }));

// Bốc 1 câu từ kho Raw + xáo đáp án.
function makeRaw(pool: Raw[]): ThiQ {
  const q = pool[randInt(0, pool.length - 1)];
  const s = shuffleQuiz(q.options, q.correct, `${q.question}|${randInt(0, 999999)}`);
  return { prompt: q.question, options: s.options, correctIndex: s.correctIndex };
}
function rawToThi(q: Raw): ThiQ {
  const s = shuffleQuiz(q.options, q.correct, `${q.question}|${randInt(0, 999999)}`);
  return { prompt: q.question, options: s.options, correctIndex: s.correctIndex };
}

// ── Chống học vẹt: XOAY TUA câu hỏi (nhớ các câu vừa ra gần đây theo lớp) ──
// Ưu tiên câu CHƯA gặp gần đây; đáp án luôn được xáo vị trí (shuffleQuiz) nên khó nhớ.
const RECENT_MAX = 8; // nhớ 8 câu gần nhất mỗi lớp — đủ để tránh lặp lại ngay giữa 2 lượt
function recentKey(g: number) { return `bhh_thi_recent_${g}`; }
function loadRecent(g: number): string[] {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(recentKey(g)) || '[]'); } catch { return []; }
}
function saveRecent(g: number, questions: string[]) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(recentKey(g), JSON.stringify(questions.slice(-RECENT_MAX))); } catch { /* ignore */ }
}
// Bốc 1 câu từ pool, tránh câu đã có trong `recent`; ghi lại câu vừa bốc vào `recent`.
function drawRotate(pool: Raw[], recent: Set<string>): ThiQ {
  const fresh = pool.filter((q) => !recent.has(q.question));
  const src = fresh.length ? fresh : pool; // hết câu mới thì cho phép lặp
  const q = src[randInt(0, src.length - 1)];
  recent.add(q.question);
  const s = shuffleQuiz(q.options, q.correct, `${q.question}|${randInt(0, 999999)}`);
  return { prompt: q.question, options: s.options, correctIndex: s.correctIndex };
}

// Kho câu Toán TƯ DUY theo lớp (app/toan-tu-duy/data.ts) — dùng toàn bộ cho Thi Tài.
const TUDUY_BY_GRADE: Record<number, Raw[]> = {};
// Phân loại: bài toán LỜI VĂN vs SUY LUẬN (dãy số/so sánh/logic) — cho các vòng đấu.
const LOIVAN_BY_GRADE: Record<number, Raw[]> = {};
const SUYLUAN_BY_GRADE: Record<number, Raw[]> = {};
function isLoiVan(t: string): boolean {
  // Bài toán có LỜI VĂN / ngữ cảnh đời thực (khác câu tính/khái niệm thuần).
  return /Hỏi|còn lại|tất cả|chia đều|mỗi (rổ|hộp|thùng|xe|bình|hàng)|mua |cho (bạn|Minh|đi)|cao hơn|thấp hơn|nhiều hơn|ít hơn|diện tích|chu vi|vận tốc|quãng đường|ô tô|mảnh vườn|thửa ruộng/i.test(t);
}
for (let g = 1; g <= 5; g++) {
  const qs = TOAN_TU_DUY[g]?.questions || [];
  const pool = qs
    .filter((q) => Array.isArray(q.options) && q.options.length >= 2 && q.correct_index >= 0 && q.correct_index < q.options.length)
    .map((q) => ({ question: q.question, options: q.options, correct: q.correct_index }));
  TUDUY_BY_GRADE[g] = pool;
  LOIVAN_BY_GRADE[g] = pool.filter((q) => isLoiVan(q.question));
  SUYLUAN_BY_GRADE[g] = pool.filter((q) => !isLoiVan(q.question));
}

// ── Toán: đa dạng dạng câu theo lớp ──
// Tạo 4 đáp án số quanh đáp án đúng.
function numOptions(answer: number): { options: string[]; correctIndex: number } {
  const spread = Math.max(2, Math.round(Math.abs(answer) * 0.15)) + 3;
  const nums = new Set<number>([answer]);
  let guard = 0;
  while (nums.size < 4 && guard++ < 60) {
    const cand = answer + randInt(-spread, spread);
    if (cand >= 0 && cand !== answer) nums.add(cand);
  }
  const arr = [...nums].sort(() => randInt(-1, 1));
  return { options: arr.map(String), correctIndex: arr.indexOf(answer) };
}
function mcqNum(prompt: string, answer: number): ThiQ {
  const o = numOptions(answer);
  return { prompt, options: o.options, correctIndex: o.correctIndex };
}
function arith(text: string, answer: number): ThiQ { return mcqNum(`${text} = ?`, answer); }
// So sánh dấu < > =
function compareQ(a: number, b: number): ThiQ {
  const correct = a < b ? '<' : a > b ? '>' : '=';
  const options = ['<', '>', '='];
  return { prompt: `${a}  ⬚  ${b}`, options, correctIndex: options.indexOf(correct) };
}
// Điền số còn thiếu: a op ⬚ = c
function missingQ(a: number, b: number, op: '+' | '−'): ThiQ {
  const c = op === '+' ? a + b : a - b;
  return mcqNum(`${a} ${op} ⬚ = ${c}`, b);
}

// Bộ sinh Toán theo lớp: lớp 1 dễ → lớp 5 khó dần, xen nhiều dạng.
function makeMath(grade: number): ThiQ {
  const g = Math.min(5, Math.max(1, grade));
  const r = randInt(0, 5);
  if (g === 1) {
    if (r <= 1) { const a = randInt(1, 10), b = randInt(1, 10); return arith(`${a} + ${b}`, a + b); }
    if (r <= 3) { const a = randInt(2, 20), b = randInt(1, a); return arith(`${a} − ${b}`, a - b); }
    if (r === 4) return compareQ(randInt(1, 20), randInt(1, 20));
    { const a = randInt(1, 8), b = randInt(1, 8); return missingQ(a, b, '+'); }
  }
  if (g === 2) {
    if (r === 0) { const a = randInt(5, 50), b = randInt(5, 50); return arith(`${a} + ${b}`, a + b); }
    if (r === 1) { const a = randInt(10, 90), b = randInt(1, a); return arith(`${a} − ${b}`, a - b); }
    if (r === 2) { const a = randInt(2, 5), b = randInt(2, 5); return arith(`${a} × ${b}`, a * b); }
    if (r === 3) return compareQ(randInt(1, 100), randInt(1, 100));
    if (r === 4) { const a = randInt(10, 40), b = randInt(1, 30); return missingQ(a, b, '+'); }
    { const n = randInt(2, 10); return mcqNum(`Gấp đôi ${n} là ?`, n * 2); }
  }
  if (g === 3) {
    if (r === 0) { const a = randInt(2, 9), b = randInt(2, 9); return arith(`${a} × ${b}`, a * b); }
    if (r === 1) { const b = randInt(2, 9), q = randInt(2, 9); return arith(`${b * q} ÷ ${b}`, q); }
    if (r === 2) { const a = randInt(20, 90), b = randInt(10, 90); return arith(`${a} + ${b}`, a + b); }
    if (r === 3) { const a = randInt(30, 99), b = randInt(1, a); return arith(`${a} − ${b}`, a - b); }
    if (r === 4) return compareQ(randInt(10, 200), randInt(10, 200));
    { const b = randInt(2, 9), q = randInt(2, 9); return mcqNum(`⬚ × ${b} = ${q * b}`, q); }
  }
  if (g === 4) {
    if (r === 0) { const a = randInt(11, 30), b = randInt(2, 9); return arith(`${a} × ${b}`, a * b); }
    if (r === 1) { const b = randInt(2, 9), q = randInt(10, 20); return arith(`${b * q} ÷ ${b}`, q); }
    if (r === 2) { const a = randInt(100, 900), b = randInt(50, 500); return arith(`${a} + ${b}`, a + b); }
    if (r === 3) { const a = randInt(200, 999), b = randInt(1, a); return arith(`${a} − ${b}`, a - b); }
    if (r === 4) return compareQ(randInt(100, 999), randInt(100, 999));
    { const n = randInt(10, 40); return mcqNum(`Một nửa của ${n * 2} là ?`, n); }
  }
  // g5
  if (r === 0) { const a = randInt(11, 40), b = randInt(3, 12); return arith(`${a} × ${b}`, a * b); }
  if (r === 1) { const b = randInt(3, 12), q = randInt(10, 40); return arith(`${b * q} ÷ ${b}`, q); }
  if (r === 2) { const a = randInt(1000, 9000), b = randInt(100, 900); return arith(`${a} + ${b}`, a + b); }
  if (r === 3) { const a = randInt(25, 99), b = randInt(11, 25); return arith(`${a} × ${b}`, a * b); }
  if (r === 4) return compareQ(randInt(1000, 9999), randInt(1000, 9999));
  { const a = randInt(100, 900), b = randInt(50, 400); return missingQ(a, b, '+'); }
}

// Tiếng Việt: chính tả / luyện từ & câu / đọc hiểu.
function makeTiengViet(): ThiQ {
  return makeRaw(TV_ALL);
}

// Tiếng Anh: 50% nghĩa từ vựng, 50% ngữ pháp.
function makeEnglish(): ThiQ {
  if (GRAMMAR_ALL.length && randInt(0, 1) === 0) return makeRaw(GRAMMAR_ALL);
  const w = EN_WORDS[randInt(0, EN_WORDS.length - 1)];
  const opts = new Set<string>([w.vi]);
  let guard = 0;
  while (opts.size < 4 && guard++ < 40) {
    const d = EN_WORDS[randInt(0, EN_WORDS.length - 1)];
    if (d.vi !== w.vi) opts.add(d.vi);
  }
  const arr = [...opts].sort(() => randInt(-1, 1));
  return { prompt: `Nghĩa của “${w.en}” là gì?`, options: arr, correctIndex: arr.indexOf(w.vi) };
}

// Khám phá: bốc ngẫu nhiên, xáo đáp án.
function makeKham(): ThiQ {
  const q = KHAM_PHA_ALL[randInt(0, KHAM_PHA_ALL.length - 1)];
  const s = shuffleQuiz(q.options, q.correct_index, `${q.question}|${randInt(0, 999999)}`);
  return { prompt: q.question, options: s.options, correctIndex: s.correctIndex };
}

// Toán = ưu tiên câu TƯ DUY của lớp (nếu có) ~40%, còn lại tính toán tự sinh.
function makeToan(grade: number): ThiQ {
  const g = Math.min(5, Math.max(1, grade));
  const pool = TUDUY_BY_GRADE[g] || [];
  if (pool.length && randInt(0, 9) < 4) return makeRaw(pool);
  return makeMath(g);
}

// Tổng hợp: trộn ngẫu nhiên các môn (phần Toán cũng ưu tiên tư duy).
function makeTongHop(grade: number): ThiQ {
  const r = randInt(0, 3);
  return r === 0 ? makeToan(grade) : r === 1 ? makeTiengViet() : r === 2 ? makeEnglish() : makeKham();
}

function makeOne(subject: ThiSubject, grade: number): ThiQ {
  switch (subject) {
    case 'toan': return makeMath(grade); // lấp phần còn lại sau khi đã nạp hết câu tư duy
    case 'tieng-viet': return makeTiengViet();
    case 'tieng-anh': return makeEnglish();
    case 'kham-pha': return makeKham();
    default: return makeTongHop(grade);
  }
}

// ── ĐỀ 5 VÒNG (ma trận + kiểu thi) ──
export type ThiRound = {
  key: string; name: string; emoji: string; color: string;
  mechanic: 'chill' | 'speed' | 'normal' | 'boss';
  perQ?: number; // giây/câu (vòng thần tốc)
  doubleLast?: boolean; // câu cuối ×2 điểm
  questions: ThiQ[];
};

function uniqueN(fn: () => ThiQ, n: number, seen: Set<string>): ThiQ[] {
  const out: ThiQ[] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 15) {
    const q = fn();
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}

/** Dựng ĐỀ 5 VÒNG: Khởi động → Thần tốc → IQ · Suy luận → Bài toán → Siêu thử thách (18 câu). */
export function buildMatch(subject: ThiSubject, grade: number): ThiRound[] {
  const g = Math.min(5, Math.max(1, grade));
  const isToan = subject === 'toan' || subject === 'tong-hop';
  const seen = new Set<string>();
  const recent = new Set<string>(loadRecent(g)); // các câu tư duy vừa ra lượt trước → né
  const basic = () => (isToan ? makeMath(g) : makeOne(subject, g));
  const fast = () => (isToan ? makeMath(g) : makeOne(subject, g));
  const iq = () => (isToan && SUYLUAN_BY_GRADE[g].length ? drawRotate(SUYLUAN_BY_GRADE[g], recent) : makeOne(subject, g));
  const word = () => (isToan && LOIVAN_BY_GRADE[g].length ? drawRotate(LOIVAN_BY_GRADE[g], recent) : makeOne(subject, g));
  const boss = () => {
    if (isToan && TUDUY_BY_GRADE[g].length) return drawRotate(TUDUY_BY_GRADE[g], recent);
    return isToan ? makeMath(Math.min(5, g + 1)) : makeOne(subject, g);
  };
  const rounds: ThiRound[] = [
    { key: 'khoi-dong', name: 'Khởi động', emoji: '🟢', color: '#22C55E', mechanic: 'chill', questions: uniqueN(basic, 5, seen) },
    { key: 'than-toc', name: 'Thần tốc', emoji: '⚡', color: '#F59E0B', mechanic: 'speed', perQ: 5, questions: uniqueN(fast, 5, seen) },
    { key: 'iq', name: 'IQ · Suy luận', emoji: '🧠', color: '#8B5CF6', mechanic: 'normal', questions: uniqueN(iq, 3, seen) },
    { key: 'bai-toan', name: 'Bài toán', emoji: '📚', color: '#3B82F6', mechanic: 'normal', questions: uniqueN(word, 3, seen) },
    { key: 'sieu', name: 'Siêu thử thách', emoji: '👑', color: '#EF4444', mechanic: 'boss', doubleLast: true, questions: uniqueN(boss, 2, seen) },
  ];
  // Lưu lại các câu tư duy vừa dùng để lượt sau xoay tua sang câu khác.
  saveRecent(g, [...recent]);
  return rounds;
}

/** Sinh N câu hỏi cho một lượt thi (chống trùng đề trong cùng lượt). */
export function buildThiTai(subject: ThiSubject, grade: number, n = 12): ThiQ[] {
  const out: ThiQ[] = [];
  const seen = new Set<string>();
  // Môn Toán: NẠP TOÀN BỘ câu tư duy của lớp trước (xáo thứ tự), tối đa n câu.
  if (subject === 'toan') {
    const g = Math.min(5, Math.max(1, grade));
    const tuduy = [...(TUDUY_BY_GRADE[g] || [])].sort(() => randInt(-1, 1));
    for (const q of tuduy) {
      if (out.length >= n) break;
      const t = rawToThi(q);
      if (seen.has(t.prompt)) continue;
      seen.add(t.prompt);
      out.push(t);
    }
  }
  let guard = 0;
  while (out.length < n && guard++ < n * 12) {
    const q = makeOne(subject, grade);
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push(q);
  }
  return out;
}
