// Logic sinh đề tính nhẩm — tách khỏi component để kiểm thử được độc lập.
//
// Đề sinh từ MỘT hạt giống số (seed) chứ không dùng Math.random trực tiếp: cùng
// seed → cùng đề trên server và trên client, nên bản SSR khớp bản hydrate (không
// lỗi hydration) và Google vẫn đọc được một đề hoàn chỉnh trong HTML đầu tiên.

export type Op = '+' | '-' | '×' | '÷';

export type Problem = { a: number; b: number; op: Op; answer: number };

/** mulberry32 — PRNG 32-bit gọn, đủ ngẫu nhiên cho việc ra đề và tái lập được. */
export function rng(seed: number): () => number {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sinh một phép tính hợp lệ cho bậc tiểu học:
 *  - cộng: tổng không vượt phạm vi,
 *  - trừ: hiệu không âm,
 *  - nhân/chia: giới hạn trong bảng cửu chương, chia luôn chia hết, không chia cho 0.
 */
export function makeProblem(rand: () => number, op: Op, max: number): Problem {
  const pick = (n: number) => Math.floor(rand() * n);
  if (op === '+') {
    const a = pick(max + 1);
    const b = pick(max + 1 - a);
    return { a, b, op, answer: a + b };
  }
  if (op === '-') {
    const a = pick(max + 1);
    const b = pick(a + 1);
    return { a, b, op, answer: a - b };
  }
  if (op === '×') {
    const a = pick(10) + 1;
    const b = pick(10) + 1;
    return { a, b, op, answer: a * b };
  }
  const b = pick(9) + 2; // số chia 2..10
  const q = pick(10) + 1;
  return { a: b * q, b, op, answer: q };
}

export function generate(seed: number, ops: Op[], max: number, count: number): Problem[] {
  const rand = rng(seed);
  const list: Problem[] = [];
  const seen = new Set<string>();
  // Lặp có trần để không quay vô hạn khi phạm vi quá nhỏ so với số câu yêu cầu
  // (vd 40 câu trong phạm vi 10 thì buộc phải có câu trùng).
  for (let guard = 0; list.length < count && guard < count * 40; guard++) {
    const op = ops[Math.floor(rand() * ops.length)];
    const p = makeProblem(rand, op, max);
    const key = `${p.a}${p.op}${p.b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(p);
  }
  // Không đủ câu khác nhau → lặp lại lần lượt cả bộ đã sinh, chứ không nhân bản
  // mỗi câu đầu tiên.
  const unique = list.length;
  while (unique > 0 && list.length < count) list.push(list[list.length % unique]);
  return list;
}
