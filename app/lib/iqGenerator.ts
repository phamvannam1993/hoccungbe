// Bộ SINH câu hỏi quy luật cho "Thử thách IQ" (/thu-thach-iq) — bổ sung cho ngân hàng
// câu hỏi có sẵn (toán tư duy + bài học thử miễn phí của khóa IQ) để mỗi ngày luôn có
// câu "tìm quy luật" đúng chất IQ. Mọi câu đều SINH TỪ QUY LUẬT rồi mới tính đáp án,
// nên đáp án luôn khớp; `checkGenerated` kiểm tra lại (đáp án duy nhất, đủ 4 lựa chọn…).
// Thuần TS, không phụ thuộc trình duyệt — chạy được cả server lẫn client.

export type IqTier = 'easy' | 'medium' | 'hard';

export type GeneratedQuestion = {
  id: string;
  kind: string;
  question: string;
  speech?: string;
  /** Dòng emoji minh họa (vd "🍎 🍌 🍎 ❓"). */
  visual?: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Rng = () => number;

// ── RNG có seed ──────────────────────────────────────────────────────────────
export function hashSeed(s: string): number {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rngFor = (seed: string): Rng => mulberry32(hashSeed(seed));
export const randInt = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
export const pickOne = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
export function shuffled<T>(rng: Rng, arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Dữ liệu emoji (nhóm rõ ràng, không nhập nhằng) ──────────────────────────
const GROUPS: { name: string; items: string[] }[] = [
  { name: 'trái cây', items: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🍒', '🍑'] },
  { name: 'xe cộ', items: ['🚗', '🚌', '🚲', '🚂', '🚀', '🚢', '🚁', '🛵'] },
  { name: 'con vật', items: ['🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🐯', '🐸'] },
  { name: 'quần áo, giày mũ', items: ['👕', '👖', '👗', '🧦', '🧢', '👟', '🧣', '🧤'] },
];
const PATTERN_EMOJI = ['🔴', '🔵', '🟡', '🟢', '⭐', '🌙', '❤️', '🔺', '🟦', '🍀', '🐟', '🌸'];

// ── Tiện ích tạo lựa chọn ────────────────────────────────────────────────────
function numberOptions(rng: Rng, ans: number, cands: number[]): { options: string[]; correct: number } {
  const out: number[] = [];
  for (const c of [...cands, ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans + 3]) {
    if (c >= 0 && c !== ans && !out.includes(c) && Number.isInteger(c)) out.push(c);
    if (out.length === 3) break;
  }
  const opts = shuffled(rng, [ans, ...out]);
  return { options: opts.map(String), correct: opts.indexOf(ans) };
}

function emojiOptions(rng: Rng, ans: string, pool: string[]): { options: string[]; correct: number } {
  const others = shuffled(rng, pool.filter((e) => e !== ans));
  const extra = shuffled(rng, PATTERN_EMOJI.filter((e) => e !== ans && !others.includes(e)));
  const wrong = [...others, ...extra].slice(0, 3);
  const opts = shuffled(rng, [ans, ...wrong]);
  return { options: opts, correct: opts.indexOf(ans) };
}

const seqText = (terms: (number | string)[]) => terms.join(', ');

type Gen = Omit<GeneratedQuestion, 'id'>;

// ── Các dạng câu ─────────────────────────────────────────────────────────────

/** Hình nào khác nhóm (3 cùng nhóm + 1 khác nhóm). */
function oddOneOut(rng: Rng): Gen {
  const [ga, gb] = shuffled(rng, GROUPS);
  const same = shuffled(rng, ga.items).slice(0, 3);
  const odd = pickOne(rng, gb.items);
  const opts = shuffled(rng, [...same, odd]);
  return {
    kind: 'odd-one-out',
    question: 'Hình nào KHÁC nhóm với các hình còn lại?',
    visual: opts.join(' '),
    options: opts,
    correct: opts.indexOf(odd),
    explanation: `${same.join(' ')} đều là ${ga.name}, còn ${odd} thuộc nhóm ${gb.name}. Vậy ${odd} khác nhóm.`,
  };
}

/** Dãy hình lặp lại — hỏi hình tiếp theo. unit: số hình trong nhóm lặp, layout: chuỗi chỉ số. */
function repeatNext(rng: Rng, layout: number[], reps: number): Gen {
  const k = Math.max(...layout) + 1;
  const sym = shuffled(rng, PATTERN_EMOJI).slice(0, k);
  const unit = layout.map((i) => sym[i]);
  const shown: string[] = [];
  const len = unit.length * reps + randInt(rng, 0, unit.length - 1);
  for (let i = 0; i < len; i++) shown.push(unit[i % unit.length]);
  const ans = unit[len % unit.length];
  const { options, correct } = emojiOptions(rng, ans, sym);
  return {
    kind: `repeat-next-${layout.join('')}`,
    question: 'Các hình xếp theo quy luật. Hình tiếp theo là hình nào?',
    visual: [...shown, '❓'].join(' '),
    options,
    correct,
    explanation: `Nhóm hình lặp lại là ${unit.join(' ')}. Lặp tiếp theo nhóm đó thì hình ở chỗ ❓ là ${ans}.`,
  };
}

/** Dãy hình lặp lại, ô ❓ nằm GIỮA dãy (đã có ít nhất 2 nhóm trọn vẹn phía trước). */
function repeatMissing(rng: Rng, layout: number[]): Gen {
  const k = Math.max(...layout) + 1;
  const sym = shuffled(rng, PATTERN_EMOJI).slice(0, k);
  const unit = layout.map((i) => sym[i]);
  const len = unit.length * 3;
  const hole = randInt(rng, unit.length * 2, len - 2); // trong nhóm thứ 3, không phải ô cuối
  const shown: string[] = [];
  for (let i = 0; i < len; i++) shown.push(i === hole ? '❓' : unit[i % unit.length]);
  const ans = unit[hole % unit.length];
  const { options, correct } = emojiOptions(rng, ans, sym);
  return {
    kind: `repeat-missing-${layout.join('')}`,
    question: 'Dãy hình lặp lại theo quy luật. Hình nào điền vào chỗ ❓?',
    visual: shown.join(' '),
    options,
    correct,
    explanation: `Nhóm hình lặp lại là ${unit.join(' ')}. Đếm theo nhóm đó thì chỗ ❓ là ${ans}.`,
  };
}

/** Dãy số cộng đều (tăng hoặc giảm). hole = -1: hỏi số tiếp theo; ngược lại: số ở vị trí hole. */
function arith(rng: Rng, g: number, opts: { down?: boolean; missing?: boolean; big?: boolean }): Gen {
  const stepMax = [3, 5, 9, 12, 15][g - 1] + (opts.big ? 5 : 0);
  const stepMin = opts.big ? Math.min(stepMax, [2, 3, 4, 6, 7][g - 1]) : 1 + (g > 2 ? 1 : 0);
  const step = randInt(rng, stepMin, stepMax);
  const n = 5;
  const startMax = [10, 30, 60, 100, 200][g - 1];
  let start = randInt(rng, opts.down ? step * (n + 1) : 0, Math.max(opts.down ? step * (n + 1) : 0, startMax));
  if (opts.down && start - step * n < 0) start = step * n + randInt(rng, 0, 5);
  const terms = Array.from({ length: n + 1 }, (_, i) => start + (opts.down ? -1 : 1) * step * i);
  const hole = opts.missing ? randInt(rng, 2, n - 1) : n;
  const ans = terms[hole];
  const shown = terms.map((t, i) => (i === hole ? '?' : t)).slice(0, opts.missing ? n + 1 : n + 1);
  const { options, correct } = numberOptions(rng, ans, [ans + step, ans - step, ans + (opts.down ? 1 : -1)]);
  const verb = opts.down ? 'kém' : 'hơn';
  return {
    kind: `arith${opts.down ? '-down' : ''}${opts.missing ? '-missing' : ''}`,
    question: `${opts.missing ? 'Tìm số còn thiếu' : 'Tìm số tiếp theo'} trong dãy:\n${seqText(shown)}`,
    options,
    correct,
    explanation: `Mỗi số ${verb} số đứng trước ${step} đơn vị: ${seqText(terms)}. Vậy số cần tìm là ${ans}.`,
  };
}

/** Khoảng cách tăng dần: +d, +(d+1), +(d+2)… */
function growingDiff(rng: Rng, g: number): Gen {
  const d0 = randInt(rng, 1, g >= 4 ? 4 : 2);
  const start = randInt(rng, 1, [5, 10, 20, 30, 50][g - 1]);
  const terms = [start];
  for (let i = 0; i < 5; i++) terms.push(terms[i] + d0 + i);
  const ans = terms[5];
  const diffs = Array.from({ length: 5 }, (_, i) => `+${d0 + i}`);
  const { options, correct } = numberOptions(rng, ans, [ans - 1, ans + 1, terms[4] + (d0 + 3)]);
  return {
    kind: 'growing-diff',
    question: `Tìm số tiếp theo trong dãy:\n${seqText([...terms.slice(0, 5), '?'])}`,
    options,
    correct,
    explanation: `Khoảng cách giữa hai số liền nhau tăng dần: ${diffs.join(', ')}. Vậy số tiếp theo là ${terms[4]} + ${d0 + 4} = ${ans}.`,
  };
}

/** Dãy nhân: mỗi số gấp r lần số trước. */
function geometric(rng: Rng, g: number): Gen {
  const r = g >= 3 ? pickOne(rng, [2, 3]) : 2;
  const start = randInt(rng, 1, r === 3 ? 2 : g >= 4 ? 6 : 3);
  const terms = [start];
  for (let i = 0; i < 4; i++) terms.push(terms[i] * r);
  const ans = terms[4];
  const { options, correct } = numberOptions(rng, ans, [terms[3] + (terms[3] - terms[2]), ans + r, ans - r]);
  return {
    kind: 'geometric',
    question: `Tìm số tiếp theo trong dãy:\n${seqText([...terms.slice(0, 4), '?'])}`,
    options,
    correct,
    explanation: `Mỗi số gấp ${r} lần số đứng trước: ${seqText(terms.slice(0, 4))}. Vậy số tiếp theo là ${terms[3]} × ${r} = ${ans}.`,
  };
}

/** Xen kẽ hai bước: +a rồi −b, +a rồi −b… */
function alternating(rng: Rng, g: number): Gen {
  const a = randInt(rng, 3, 4 + g);
  const b = randInt(rng, 1, a - 1);
  const start = randInt(rng, 5, [10, 20, 30, 50, 80][g - 1]);
  const terms = [start];
  for (let i = 0; i < 6; i++) terms.push(terms[i] + (i % 2 === 0 ? a : -b));
  const ans = terms[6];
  const { options, correct } = numberOptions(rng, ans, [terms[5] - b, terms[5] + a - b, ans + b]);
  return {
    kind: 'alternating',
    question: `Tìm số tiếp theo trong dãy:\n${seqText([...terms.slice(0, 6), '?'])}`,
    options,
    correct,
    explanation: `Dãy xen kẽ: cộng ${a} rồi trừ ${b}, cứ thế lặp lại. Số cuối ${terms[5]} vừa bị trừ ${b}, nên tiếp theo cộng ${a}: ${terms[5]} + ${a} = ${ans}.`,
  };
}

/** Mỗi số bằng tổng hai số đứng trước. */
function fibLike(rng: Rng): Gen {
  const a = randInt(rng, 1, 4), b = randInt(rng, a, a + 4);
  const terms = [a, b];
  for (let i = 2; i < 7; i++) terms.push(terms[i - 1] + terms[i - 2]);
  const ans = terms[6];
  const { options, correct } = numberOptions(rng, ans, [terms[5] + (terms[5] - terms[4]), ans - 1, ans + 2]);
  return {
    kind: 'fib-like',
    question: `Tìm số tiếp theo trong dãy:\n${seqText([...terms.slice(0, 6), '?'])}`,
    options,
    correct,
    explanation: `Mỗi số bằng tổng hai số đứng ngay trước nó (vd ${terms[2]} = ${terms[0]} + ${terms[1]}). Vậy số tiếp theo là ${terms[4]} + ${terms[5]} = ${ans}.`,
  };
}

/** Sinh 1 câu quy luật cho lớp g (1–5) ở mức độ `tier`. */
export function generateQuestion(grade: number, tier: IqTier, seed: string): GeneratedQuestion {
  const g = Math.min(5, Math.max(1, Math.round(grade)));
  const rng = rngFor(seed);
  const makers: (() => Gen)[] =
    tier === 'easy'
      ? [() => oddOneOut(rng), () => repeatNext(rng, [0, 1], 2), () => arith(rng, g, {})]
      : tier === 'medium'
        ? [
            () => repeatNext(rng, pickOne(rng, [[0, 1, 2], [0, 0, 1], [0, 1, 1]]), 2),
            () => arith(rng, g, { missing: true }),
            () => arith(rng, g, { down: g >= 2, missing: g < 2 }),
          ]
        : g === 1
          ? [
              () => repeatMissing(rng, pickOne(rng, [[0, 1, 1, 2], [0, 0, 1, 1], [0, 1, 2]])),
              () => arith(rng, g, { down: true, big: true }),
              () => growingDiff(rng, g),
            ]
          : [
              () => repeatMissing(rng, pickOne(rng, [[0, 1, 1, 2], [0, 0, 1, 2], [0, 1, 2, 3]])),
              () => growingDiff(rng, g),
              () => geometric(rng, g),
              ...(g >= 3 ? [() => alternating(rng, g)] : []),
              ...(g >= 4 ? [() => fibLike(rng)] : []),
            ];
  const q = pickOne(rng, makers)();
  return { id: `gen:${seed}`, ...q, speech: q.visual ? q.question : q.question.replace('\n', ' ') };
}

/** Kiểm tra câu sinh ra hợp lệ: 3–4 lựa chọn khác nhau, đáp án đúng nằm trong lựa chọn. */
export function checkGenerated(q: GeneratedQuestion): string | null {
  if (q.options.length < 3 || q.options.length > 4) return `${q.id}: số lựa chọn ${q.options.length}`;
  if (new Set(q.options).size !== q.options.length) return `${q.id}: lựa chọn trùng`;
  if (q.correct < 0 || q.correct >= q.options.length) return `${q.id}: correct ngoài phạm vi`;
  if (q.options.some((o) => /^-/.test(o))) return `${q.id}: số âm`;
  return null;
}
