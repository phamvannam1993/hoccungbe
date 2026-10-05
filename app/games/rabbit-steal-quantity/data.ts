export type RabbitStealLevel = {
  id: string;
  targetCount: number;
  carrotCount: number;
  question: string;
  hint: string;
};

export const allCarrotPositions = [
  { id: 1, left: 250, top: 295 },
  { id: 2, left: 355, top: 350 },
  { id: 3, left: 470, top: 300 },
  { id: 4, left: 585, top: 360 },
  { id: 5, left: 700, top: 300 },
  { id: 6, left: 815, top: 352 },
  { id: 7, left: 930, top: 310 },
  { id: 8, left: 1030, top: 365 },
  { id: 9, left: 180, top: 340 },
  { id: 10, left: 1120, top: 305 },
];

function seededRand(round: number, attempt: number): number {
  const seed = (round * 9973 + 12345 + attempt * 7331) % 233280;
  return seed / 233280;
}

export function generateLevel(round: number, avoidTarget?: number): RabbitStealLevel {
  let targetCount: number;
  let carrotCount: number;

  if (round <= 2) {
    targetCount = 2 + Math.floor(seededRand(round, 0) * 2); // 2-3
    carrotCount = 6;
  } else if (round <= 5) {
    targetCount = 3 + Math.floor(seededRand(round, 0) * 3); // 3-5
    carrotCount = 7;
  } else if (round <= 9) {
    targetCount = 4 + Math.floor(seededRand(round, 0) * 4); // 4-7
    carrotCount = 8;
  } else if (round <= 14) {
    targetCount = 5 + Math.floor(seededRand(round, 0) * 5); // 5-9
    carrotCount = 9;
  } else {
    targetCount = 6 + Math.floor(seededRand(round, 0) * 7); // 6-12
    carrotCount = 10;
  }

  // Avoid same as previous
  if (avoidTarget !== undefined && targetCount === avoidTarget) {
    let attempt = 1;
    while (targetCount === avoidTarget && attempt < 10) {
      if (round <= 2) {
        targetCount = 2 + Math.floor(seededRand(round, attempt) * 2);
      } else if (round <= 5) {
        targetCount = 3 + Math.floor(seededRand(round, attempt) * 3);
      } else if (round <= 9) {
        targetCount = 4 + Math.floor(seededRand(round, attempt) * 4);
      } else if (round <= 14) {
        targetCount = 5 + Math.floor(seededRand(round, attempt) * 5);
      } else {
        targetCount = 6 + Math.floor(seededRand(round, attempt) * 7);
      }
      attempt++;
    }
  }

  return {
    id: `round-${round}`,
    targetCount,
    carrotCount,
    question: `Hãy giúp thỏ cắp đúng ${targetCount} củ cà rốt.`,
    hint: `Kéo thỏ chạm vào từng củ cà rốt. Cắp đủ ${targetCount} lần thì bấm kiểm tra.`,
  };
}
