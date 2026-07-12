export type PoolFishLevel = {
  id: number;
  skill: "count" | "addition" | "subtraction";
  totalFish: number;
  addFish?: number;
  swimAway?: number;
  question: string;
  options: number[];
};

export function getAnswer(level: PoolFishLevel): number {
  if (level.skill === "addition") return level.totalFish + (level.addFish ?? 0);
  if (level.skill === "subtraction") return level.totalFish - (level.swimAway ?? 0);
  return level.totalFish;
}

function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function deterministicInt(seed: number, min: number, max: number): number {
  return min + Math.floor(prng(seed) * (max - min + 1));
}

function shuffleOptions(options: number[], seed: number): number[] {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(prng(seed * 7919 + i * 3571) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildOptions(correctAnswer: number, optionCount: number, seed: number): number[] {
  const spread = Math.max(3, Math.floor(optionCount / 2));
  const candidates = new Set<number>([correctAnswer]);
  let attempt = 0;
  while (candidates.size < optionCount) {
    const offset = deterministicInt(seed + attempt * 13, -spread, spread);
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate !== correctAnswer) candidates.add(candidate);
    attempt++;
    if (attempt > 200) break;
  }
  // Fill with sequential if not enough
  let fill = correctAnswer + spread + 1;
  while (candidates.size < optionCount) {
    if (!candidates.has(fill) && fill >= 0) candidates.add(fill);
    fill++;
  }
  return shuffleOptions(Array.from(candidates), seed);
}

export function generateLevel(round: number, avoidAnswer?: number): PoolFishLevel {
  let skill: "count" | "addition" | "subtraction";
  let totalFish: number;
  let addFish: number | undefined;
  let swimAway: number | undefined;
  let optionCount: number;

  const s = round * 9973;

  if (round <= 2) {
    // Tier 1: count only
    skill = "count";
    optionCount = 3;
    totalFish = deterministicInt(s + 1, 2, 5);
    // Avoid same answer
    if (totalFish === avoidAnswer) {
      totalFish = totalFish < 5 ? totalFish + 1 : totalFish - 1;
    }
  } else if (round <= 5) {
    // Tier 2: addition
    skill = "addition";
    optionCount = 4;
    totalFish = deterministicInt(s + 2, 3, 6);
    addFish = deterministicInt(s + 3, 1, 3);
    const ans = totalFish + addFish;
    if (ans === avoidAnswer) {
      addFish = addFish < 3 ? addFish + 1 : addFish - 1;
    }
  } else if (round <= 8) {
    // Tier 3: subtraction
    skill = "subtraction";
    optionCount = 4;
    totalFish = deterministicInt(s + 4, 5, 8);
    swimAway = deterministicInt(s + 5, 1, 3);
    if (swimAway >= totalFish) swimAway = totalFish - 1;
    const ans = totalFish - swimAway;
    if (ans === avoidAnswer) {
      swimAway = swimAway < totalFish - 1 ? swimAway + 1 : Math.max(1, swimAway - 1);
    }
  } else if (round <= 12) {
    // Tier 4: alternating, larger numbers
    skill = round % 2 === 0 ? "addition" : "subtraction";
    optionCount = 5;
    totalFish = deterministicInt(s + 6, 6, 10);
    if (skill === "addition") {
      addFish = deterministicInt(s + 7, 1, 4);
      const ans = totalFish + addFish;
      if (ans === avoidAnswer) addFish = addFish < 4 ? addFish + 1 : addFish - 1;
    } else {
      swimAway = deterministicInt(s + 8, 1, 4);
      if (swimAway >= totalFish) swimAway = totalFish - 1;
      const ans = totalFish - swimAway;
      if (ans === avoidAnswer) swimAway = swimAway < totalFish - 1 ? swimAway + 1 : Math.max(1, swimAway - 1);
    }
  } else {
    // Tier 5: largest numbers
    skill = round % 2 === 0 ? "addition" : "subtraction";
    optionCount = 6;
    totalFish = deterministicInt(s + 9, 8, 15);
    if (skill === "addition") {
      addFish = deterministicInt(s + 10, 2, 5);
      const ans = totalFish + addFish;
      if (ans === avoidAnswer) addFish = addFish < 5 ? addFish + 1 : addFish - 1;
    } else {
      swimAway = deterministicInt(s + 11, 2, 5);
      if (swimAway >= totalFish) swimAway = totalFish - 1;
      const ans = totalFish - swimAway;
      if (ans === avoidAnswer) swimAway = swimAway < totalFish - 1 ? swimAway + 1 : Math.max(1, swimAway - 1);
    }
  }

  // Build question string
  let question: string;
  if (skill === "count") {
    question = "Trong hồ có bao nhiêu con cá?";
  } else if (skill === "addition") {
    question = `Có ${totalFish} con cá đang bơi, thêm ${addFish} con cá bơi tới. Tất cả có bao nhiêu con cá?`;
  } else {
    question = `Có ${totalFish} con cá trong hồ, ${swimAway} con bơi đi. Còn lại bao nhiêu con cá?`;
  }

  const correctAnswer =
    skill === "addition"
      ? totalFish + (addFish ?? 0)
      : skill === "subtraction"
      ? totalFish - (swimAway ?? 0)
      : totalFish;

  const options = buildOptions(correctAnswer, optionCount, s + 99);

  return {
    id: round + 1,
    skill,
    totalFish,
    addFish,
    swimAway,
    question,
    options,
  };
}
