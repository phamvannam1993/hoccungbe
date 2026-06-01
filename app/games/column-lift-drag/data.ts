export type ColumnLevel = {
  id: number;
  title: string;
  instruction: string;
  sequence: Array<number | null>;
  answer: number;
  hint: string;
  startValue: number;
};

/** Deterministic PRNG — no Math.random */
function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

const INSTRUCTIONS = [
  "Hoàn thành dãy số.",
  "Điền số còn thiếu.",
  "Tìm quy luật và điền số.",
] as const;

export function generateColumnLevel(round: number, avoidAnswer?: number): ColumnLevel {
  // Attempt up to 10 times to avoid repeating same answer
  for (let attempt = 0; attempt < 10; attempt++) {
    const seed = round * 1000 + attempt;
    const level = buildLevel(round, seed);
    if (avoidAnswer === undefined || level.answer !== avoidAnswer) {
      return level;
    }
  }
  // Fallback: return last attempt regardless
  return buildLevel(round, round * 1000 + 10);
}

function buildLevel(round: number, seed: number): ColumnLevel {
  const r0 = prng(seed);
  const r1 = prng(seed + 1);
  const r2 = prng(seed + 2);
  const r3 = prng(seed + 3);

  let seqLen: number;
  let stepChoices: number[];
  let minVal: number;
  let maxVal: number;

  if (round <= 2) {
    seqLen = 6;
    stepChoices = [5, 10];
    minVal = 10;
    maxVal = 60;
  } else if (round <= 5) {
    seqLen = 7;
    stepChoices = [7, 8];
    minVal = 10;
    maxVal = 90;
  } else if (round <= 9) {
    seqLen = 8;
    stepChoices = [3, 4];
    minVal = 5;
    maxVal = 95;
  } else {
    // rounds 10+: mixed 2-15, length 8-10
    const lenChoices = [8, 9, 10];
    seqLen = lenChoices[Math.floor(r3 * lenChoices.length)];
    const allSteps = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    stepChoices = allSteps;
    minVal = 5;
    maxVal = 99;
  }

  const step = stepChoices[Math.floor(r0 * stepChoices.length)];
  const increasing = r1 < 0.5;

  // Choose start so entire sequence stays within [minVal, maxVal]
  const totalSpan = step * (seqLen - 1);
  const rangeForStart = maxVal - minVal - totalSpan;
  const safeRange = Math.max(1, rangeForStart);
  let start: number;
  if (increasing) {
    start = minVal + Math.floor(r2 * safeRange);
  } else {
    start = minVal + totalSpan + Math.floor(r2 * safeRange);
  }
  // Clamp
  if (increasing) {
    start = Math.max(minVal, Math.min(maxVal - totalSpan, start));
  } else {
    start = Math.max(minVal + totalSpan, Math.min(maxVal, start));
  }

  // Build full sequence
  const full: number[] = [];
  for (let i = 0; i < seqLen; i++) {
    full.push(increasing ? start + step * i : start - step * i);
  }

  // Choose null position — not first or last
  const nullSeed = prng(seed + 4);
  const nullPos = 1 + Math.floor(nullSeed * (seqLen - 2));
  const answer = full[nullPos];
  const sequence: Array<number | null> = full.map((v, i) => (i === nullPos ? null : v));

  const direction = increasing ? "tăng" : "giảm";
  const hint = `Quy luật: mỗi số ${direction} ${step} đơn vị.`;
  const title = "Kéo cột số";
  const instruction = INSTRUCTIONS[round % 3];

  return {
    id: round,
    title,
    instruction,
    sequence,
    answer,
    hint,
    startValue: 0,
  };
}
