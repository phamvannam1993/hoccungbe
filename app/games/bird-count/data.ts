export type BirdCountQuestion = {
  id: number;
  birdCount: number;
  question: string;
  options: number[];
  speedFactor: number; // 1 = bình thường, <1 = nhanh hơn (khó hơn)
};

// Sinh câu hỏi theo độ khó tăng dần — vô hạn câu
// round bắt đầu từ 0; avoidCount để tránh trùng với câu trước
export function generateQuestion(round: number, avoidCount?: number): BirdCountQuestion {
  // Tier theo round
  let minBirds: number;
  let maxBirds: number;
  let optionCount: number;
  let speedFactor: number;

  if (round < 3) {
    // Dễ: 2-4 chim, 4 đáp án, bay chậm
    minBirds = 2; maxBirds = 4; optionCount = 4; speedFactor = 1.15;
  } else if (round < 6) {
    minBirds = 3; maxBirds = 6; optionCount = 6; speedFactor = 1.0;
  } else if (round < 10) {
    minBirds = 4; maxBirds = 8; optionCount = 8; speedFactor = 0.85;
  } else if (round < 15) {
    minBirds = 6; maxBirds = 10; optionCount = 10; speedFactor = 0.7;
  } else {
    // Cực khó: 8-15 chim, 10 đáp án, bay rất nhanh
    minBirds = 8; maxBirds = 15; optionCount = 10;
    speedFactor = Math.max(0.5, 0.7 - (round - 15) * 0.02);
  }

  // Pseudo-random deterministic theo round → tránh hydration mismatch
  let attempt = 0;
  let birdCount: number;
  do {
    const seed = (round * 9973 + 12345 + attempt * 7331) % 233280;
    const rand = seed / 233280;
    birdCount = minBirds + Math.floor(rand * (maxBirds - minBirds + 1));
    attempt++;
  } while (birdCount === avoidCount && attempt < 12);

  // Options: dãy số liên tiếp chứa đáp án
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
