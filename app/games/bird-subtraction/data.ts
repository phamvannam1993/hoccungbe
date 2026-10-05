export type BirdSubtractionLevel = {
  id: number;
  total: number;
  flyAway: number;
  question: string;
  options: number[];
};

// Deterministic pseudo-random
function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function generateLevel(round: number, avoidAnswer?: number): BirdSubtractionLevel {
  // Difficulty tiers
  let minTotal: number, maxTotal: number, optionCount: number;
  if (round < 3)       { minTotal = 4;  maxTotal = 6;  optionCount = 3; }
  else if (round < 6)  { minTotal = 5;  maxTotal = 8;  optionCount = 4; }
  else if (round < 10) { minTotal = 6;  maxTotal = 10; optionCount = 4; }
  else if (round < 15) { minTotal = 7;  maxTotal = 12; optionCount = 5; }
  else                 { minTotal = 8;  maxTotal = 15; optionCount = 5; }

  // Deterministic total
  let attempt = 0;
  let total: number, flyAway: number, correctAnswer: number;
  do {
    const s1 = (round * 9973 + 12345 + attempt * 7331) % 233280;
    total = minTotal + Math.floor((s1 / 233280) * (maxTotal - minTotal + 1));
    const s2 = (round * 6271 + 54321 + attempt * 3137) % 233280;
    flyAway = 1 + Math.floor((s2 / 233280) * (total - 1)); // 1..total-1
    correctAnswer = total - flyAway;
    attempt++;
  } while (correctAnswer === avoidAnswer && attempt < 12);

  // Options: correctAnswer + distractors near it, shuffled deterministically
  const distSet = new Set<number>();
  distSet.add(correctAnswer);
  for (let d = 1; distSet.size < optionCount; d++) {
    if (correctAnswer - d >= 0) distSet.add(correctAnswer - d);
    if (correctAnswer + d <= total) distSet.add(correctAnswer + d);
  }
  const options = [...distSet];
  // Shuffle options deterministically
  for (let i = options.length - 1; i > 0; i--) {
    const r = prng(round * 31 + i * 17);
    const j = Math.floor(r * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    id: round + 1,
    total,
    flyAway,
    question: `Có ${total} con chim, ${flyAway} con bay mất. Còn lại bao nhiêu con?`,
    options,
  };
}
