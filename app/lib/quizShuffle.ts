// Xáo trộn vị trí đáp án cho câu hỏi trắc nghiệm — tránh đáp án đúng luôn nằm ở vị trí đầu.
// Xáo theo SEED lấy từ nội dung câu hỏi → ổn định (không đổi khi re-render, không lệch
// hydration giữa server/client) nhưng phân bố đều A/B/C/D giữa các câu khác nhau.

export function seededPerm(n: number, seedStr: string): number[] {
  // FNV-1a hash → xorshift PRNG cho phân bố đều A/B/C/D.
  let seed = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed ^= seedStr.charCodeAt(i);
    seed = Math.imul(seed, 16777619) >>> 0;
  }
  const next = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >>> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed >>> 0;
  };
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = next() % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Trả về options đã xáo + vị trí mới của đáp án đúng. */
export function shuffleQuiz<T>(options: T[], correctIndex: number, seedStr: string): { options: T[]; correctIndex: number } {
  const perm = seededPerm(options.length, seedStr);
  return { options: perm.map((i) => options[i]), correctIndex: perm.indexOf(correctIndex) };
}
