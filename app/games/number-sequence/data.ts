export type SequenceLevel = {
  title: string;
  instruction: string;
  sequence: Array<number | null>;
  answer: string;
};

export const keypadValues = ["1","2","3","4","5","6","7","8","9","0"];

function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

const INSTRUCTIONS = [
  "Hoàn thành dãy số",
  "Điền số còn thiếu vào ô trống",
  "Tìm quy luật và điền số",
];

export function generateSequenceLevel(round: number, avoidAnswer?: string): SequenceLevel {
  for (let attempt = 0; attempt < 6; attempt++) {
    const seed = round * 31 + attempt * 1009;
    const level = buildLevel(round, seed);
    if (avoidAnswer === undefined || level.answer !== avoidAnswer) {
      return level;
    }
  }
  return buildLevel(round, round * 31);
}

function buildLevel(round: number, seed: number): SequenceLevel {
  const r0 = prng(seed);
  const r1 = prng(seed + 1);
  const r2 = prng(seed + 2);

  let start: number;
  let step: number;
  let length: number;
  let direction: 1 | -1 = 1;

  if (round <= 2) {
    step = 1;
    length = 6;
    start = 1 + Math.floor(r0 * 5); // 1-5
  } else if (round <= 5) {
    step = 2;
    length = 6;
    start = 2 + Math.floor(r0 * 7); // 2-8
  } else if (round <= 8) {
    step = 5;
    length = 6;
    start = 5 + Math.floor(r0 * 21); // 5-25
  } else if (round <= 11) {
    step = 10;
    length = 6;
    start = 10 + Math.floor(r0 * 31); // 10-40
  } else if (round <= 14) {
    step = r1 < 0.5 ? 1 : 2;
    direction = -1;
    length = 6;
    // start high enough that all values positive
    start = (length - 1) * step + 1 + Math.floor(r0 * 20);
  } else if (round <= 17) {
    step = 3;
    length = 7;
    start = 3 + Math.floor(r0 * 15);
  } else {
    // mixed
    const stepOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    step = stepOptions[Math.floor(r0 * stepOptions.length)];
    direction = r1 < 0.5 ? 1 : -1;
    length = 6 + Math.floor(r2 * 3); // 6-8
    if (direction === -1) {
      start = (length - 1) * step + 1 + Math.floor(r0 * 30);
    } else {
      start = 1 + Math.floor(r0 * 20);
    }
  }

  // Build sequence
  const nums: number[] = [];
  for (let i = 0; i < length; i++) {
    nums.push(start + direction * step * i);
  }

  // Null position: not first or last, varies by round
  const nullIdx = 1 + (Math.floor(prng(seed + 3) * (length - 2)));
  const answer = nums[nullIdx];
  const sequence: Array<number | null> = nums.map((n, i) => (i === nullIdx ? null : n));

  const instruction = INSTRUCTIONS[round % 3];
  const title = direction === 1
    ? `Dãy số tăng thêm ${step}`
    : `Dãy số giảm ${step}`;

  return {
    title,
    instruction,
    sequence,
    answer: String(answer),
  };
}
