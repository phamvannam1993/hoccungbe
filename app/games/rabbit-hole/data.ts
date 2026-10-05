export type RabbitHoleLevel = {
  id: number;
  targetHole: number;
  question: string;
  hint: string;
  holeNumbers: number[]; // các số hiện trên các hang (đã trộn)
};

const BASE_POSITIONS = [
  { left: 235, top: 305 },
  { left: 380, top: 270 },
  { left: 535, top: 310 },
  { left: 690, top: 270 },
  { left: 830, top: 320 },
  { left: 130, top: 290 },
  { left: 920, top: 290 },
  { left: 460, top: 350 },
];

export function getHolePositions(count: number) {
  return BASE_POSITIONS.slice(0, count);
}

// Pseudo-random deterministic
function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const r = prng(seed + i * 131);
    const j = Math.floor(r * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function generateLevel(round: number, avoidTarget?: number): RabbitHoleLevel {
  // Số hang tăng dần
  let holeCount: number;
  let maxNumber: number;
  if (round < 3) { holeCount = 3; maxNumber = 5; }
  else if (round < 6) { holeCount = 4; maxNumber = 9; }
  else if (round < 10) { holeCount = 5; maxNumber = 12; }
  else if (round < 15) { holeCount = 6; maxNumber = 15; }
  else if (round < 22) { holeCount = 7; maxNumber = 20; }
  else { holeCount = 8; maxNumber = 30; }

  // Chọn các số khác nhau cho các hang
  const seed = round * 9973 + 12345;
  const allNumbers: number[] = [];
  for (let i = 1; i <= maxNumber; i++) allNumbers.push(i);
  const shuffled = shuffle(allNumbers, seed);
  const holeNumbers = shuffled.slice(0, holeCount);

  // Chọn target từ các số hang (tránh trùng câu trước)
  let target = holeNumbers[Math.floor(prng(seed + 999) * holeNumbers.length)];
  if (target === avoidTarget && holeNumbers.length > 1) {
    target = holeNumbers.find((n) => n !== avoidTarget) ?? target;
  }

  return {
    id: round + 1,
    targetHole: target,
    question: `Hãy đưa chú thỏ vào đúng hang số ${target}.`,
    hint: `Tìm hang có số ${target} rồi thả thỏ vào đó.`,
    holeNumbers,
  };
}
