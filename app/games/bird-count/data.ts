export type BirdCountQuestion = {
  id: number;
  birdCount: number;
  question: string;
  options: number[];
  speedFactor: number;
};

export function generateQuestion(round: number, avoidCount?: number): BirdCountQuestion {
  let minBirds: number;
  let maxBirds: number;
  let optionCount: number;
  let speedFactor: number;

  if (round < 3) {
    minBirds = 2; maxBirds = 5; optionCount = 4; speedFactor = 1.15;
  } else if (round < 6) {
    minBirds = 3; maxBirds = 7; optionCount = 5; speedFactor = 1.0;
  } else if (round < 10) {
    minBirds = 4; maxBirds = 9; optionCount = 6; speedFactor = 0.85;
  } else if (round < 15) {
    minBirds = 5; maxBirds = 12; optionCount = 8; speedFactor = 0.7;
  } else {
    minBirds = 7; maxBirds = 15; optionCount = 10;
    speedFactor = Math.max(0.45, 0.7 - (round - 15) * 0.02);
  }

  const range = maxBirds - minBirds + 1;

  // Build a shuffled sequence so no repeats within a full cycle
  // Use round to pick from a permutation deterministically
  const perm: number[] = [];
  for (let i = 0; i < range; i++) perm.push(i);
  // Fisher-Yates with seed based on round's cycle number
  const cycle = Math.floor(round / range);
  for (let i = range - 1; i > 0; i--) {
    const seed = ((cycle * 9973 + i * 7331 + round * 1237) % 233280) / 233280;
    const j = Math.floor(seed * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const posInCycle = round % range;
  let birdCount = minBirds + perm[posInCycle];

  // Still avoid same as previous if possible
  if (birdCount === avoidCount) {
    const alt = perm[(posInCycle + 1) % range];
    birdCount = minBirds + alt;
  }

  // Options: consecutive range containing the answer
  let start = Math.max(1, birdCount - Math.floor(optionCount / 2));
  if (start + optionCount - 1 > 20) start = Math.max(1, 20 - optionCount + 1);
  const options = Array.from({ length: optionCount }, (_, i) => start + i);

  return {
    id: round + 1,
    birdCount,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options,
    speedFactor,
  };
}
