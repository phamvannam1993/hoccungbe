export type AppleSkill =
  | "count"
  | "pick"
  | "addition"
  | "subtraction"
  | "compare"
  | "make_number"
  | "number_bond"
  | "missing_addend"
  | "before_after"
  | "ten_frame";

export type AppleLessonLevel = {
  id: number;
  skill: AppleSkill;
  title: string;
  totalApples: number;
  addApples?: number;
  pickApples?: number;
  target?: number;
  compareLeft?: number;
  compareRight?: number;
  missingTotal?: number;
  knownPart?: number;
  beforeAfterNumber?: number;
  question: string;
  options: string[];
};

export function getAnswer(level: AppleLessonLevel): string {
  if (level.skill === "addition") return String(level.totalApples + (level.addApples ?? 0));
  if (level.skill === "subtraction") return String(level.totalApples - (level.pickApples ?? 0));
  if (level.skill === "pick") return String(level.pickApples ?? 0);
  if (level.skill === "make_number") return String(level.target ?? 0);
  if (level.skill === "compare") {
    if ((level.compareLeft ?? 0) > (level.compareRight ?? 0)) return "Trái";
    if ((level.compareLeft ?? 0) < (level.compareRight ?? 0)) return "Phải";
    return "Bằng nhau";
  }
  if (level.skill === "number_bond") return String((level.compareLeft ?? 0) + (level.compareRight ?? 0));
  if (level.skill === "missing_addend") return String((level.missingTotal ?? 0) - (level.knownPart ?? 0));
  if (level.skill === "before_after") return String((level.beforeAfterNumber ?? 0) + 1);
  if (level.skill === "ten_frame") return String(10 - level.totalApples);
  return String(level.totalApples);
}

function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function intRange(rnd: number, min: number, max: number): number {
  return min + Math.floor(rnd * (max - min + 1));
}

function makeOptions(correctStr: string, seed: number, isText: boolean): string[] {
  if (isText) {
    const pool = ["Trái", "Phải", "Bằng nhau"];
    const opts = [correctStr];
    for (const v of pool) {
      if (v !== correctStr && opts.length < 4) opts.push(v);
    }
    while (opts.length < 4) opts.push("Không biết");
    // shuffle
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(prng(seed + i * 17) * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }
  const correct = Number(correctStr);
  const distractors = new Set<number>();
  let s = seed;
  const offsets = [-2, -1, 1, 2, 3, -3];
  for (const off of offsets) {
    const v = correct + off;
    if (v >= 0 && v !== correct) distractors.add(v);
    if (distractors.size >= 3) break;
  }
  while (distractors.size < 3) {
    s = Math.floor(prng(s + 1) * 10000);
    const v = Math.max(0, correct + Math.floor(prng(s) * 7) - 3);
    if (v !== correct) distractors.add(v);
  }
  const opts = [correct, ...Array.from(distractors).slice(0, 3)];
  // shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(prng(seed + i * 31 + 7) * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts.map(String);
}

const ALL_SKILLS: AppleSkill[] = [
  "count", "addition", "subtraction", "compare",
  "number_bond", "missing_addend", "before_after", "ten_frame",
];

export function generateLevel(round: number, avoidAnswerStr?: string): AppleLessonLevel {
  let level: AppleLessonLevel | null = null;
  let attempt = 0;
  while (attempt < 6) {
    const seed = round * 2333 + attempt * 4919;
    const r0 = prng(seed);
    const r1 = prng(seed + 1);
    const r2 = prng(seed + 2);
    const r3 = prng(seed + 3);

    const tier = round < 16 ? Math.floor(round / 2) : (round % ALL_SKILLS.length);
    let skill: AppleSkill;
    if (round < 16) {
      const tierSkills: AppleSkill[] = [
        "count", "addition", "subtraction", "compare",
        "number_bond", "missing_addend", "before_after", "ten_frame",
      ];
      skill = tierSkills[tier];
    } else {
      // cycle all skills with scaling
      skill = ALL_SKILLS[tier % ALL_SKILLS.length];
    }

    const scale = round >= 16 ? Math.floor(round / ALL_SKILLS.length) : 0;

    let candidate: AppleLessonLevel;

    // Story templates for each skill
    const countStories = [
      (_n: number) => `Bé nhìn lên cây và thấy những quả táo đỏ mọng. Hỏi trên cây có tất cả bao nhiêu quả táo?`,
      (_n: number) => `Trên cây có nhiều quả táo chín đỏ. Hỏi trên cây có tất cả bao nhiêu quả táo?`,
      (_n: number) => `Bé và mẹ đi thăm vườn táo. Bé nhìn lên cây và đếm số táo. Hỏi trên cây có bao nhiêu quả táo?`,
    ];
    const addStories = [
      (a: number, b: number) => `Trên cây có ${a} quả táo đỏ chín và ${b} quả táo xanh. Hỏi trên cây có tất cả bao nhiêu quả táo?`,
      (a: number, b: number) => `Bác nông dân hái được ${a} quả táo để vào giỏ. Bé hái thêm được ${b} quả nữa. Hỏi trong giỏ có bao nhiêu quả táo?`,
      (a: number, b: number) => `Buổi sáng bé hái được ${a} quả táo. Buổi chiều bé hái thêm ${b} quả nữa. Hỏi bé hái được tất cả bao nhiêu quả?`,
    ];
    const subStories = [
      (a: number, b: number) => `Trên cây có ${a} quả táo chín mọng. Bé hái xuống ${b} quả để ăn. Hỏi trên cây còn lại bao nhiêu quả táo?`,
      (a: number, b: number) => `Cây táo có ${a} quả. Gió thổi làm rụng mất ${b} quả. Hỏi trên cây còn lại bao nhiêu quả?`,
      (a: number, b: number) => `Mẹ nhìn lên cây thấy ${a} quả táo. Mẹ hái ${b} quả cho bé. Hỏi còn bao nhiêu quả trên cây?`,
    ];
    const compareStories = [
      (l: number, r: number) => `Cây bên trái có ${l} quả táo, cây bên phải có ${r} quả táo. Hỏi cây nào nhiều táo hơn?`,
      (l: number, r: number) => `Giỏ bên trái đựng ${l} quả táo, giỏ bên phải đựng ${r} quả. Hỏi giỏ nào đựng nhiều táo hơn?`,
    ];
    const bondStories = [
      (a: number, b: number) => `Bé để ${a} quả táo vào giỏ này và ${b} quả vào giỏ kia. Hỏi bé có tất cả bao nhiêu quả táo?`,
      (a: number, b: number) => `Trên bàn có ${a} quả táo đỏ và ${b} quả táo vàng. Hỏi tất cả có bao nhiêu quả táo?`,
    ];
    const missingStories = [
      (k: number, t: number) => `Bé đã có ${k} quả táo trong giỏ. Bé muốn có tất cả ${t} quả. Hỏi bé cần hái thêm bao nhiêu quả nữa?`,
      (k: number, t: number) => `Trong rổ có ${k} quả táo. Mẹ muốn có đủ ${t} quả táo. Hỏi mẹ cần thêm bao nhiêu quả nữa?`,
    ];
    const beforeAfterStories = [
      (n: number) => `Bé đang học đếm. Số liền sau của ${n} là số nào?`,
      (n: number) => `Trên dây số, số đứng ngay sau số ${n} là số mấy?`,
    ];
    const tenFrameStories = [
      (n: number) => `Khung 10 đang có ${n} quả táo đỏ. Hỏi cần thêm bao nhiêu quả để đủ 10 quả?`,
      (n: number) => `Mẹ xếp táo vào khung 10 ô. Đã xếp được ${n} quả. Hỏi còn thiếu mấy ô nữa?`,
    ];

    const si = Math.floor(prng(seed + 77) * 3); // story index

    if (skill === "count") {
      const totalApples = intRange(r0, 3 + scale, 7 + scale * 2);
      candidate = {
        id: round, skill, title: "Đếm số lượng", totalApples,
        question: countStories[si % countStories.length](totalApples),
        options: makeOptions(String(totalApples), seed + 100, false),
      };
    } else if (skill === "addition") {
      const totalApples = intRange(r0, 3 + scale, 6 + scale * 2);
      const addApples = intRange(r1, 1, 3 + scale);
      candidate = {
        id: round, skill, title: "Cộng thêm", totalApples, addApples,
        question: addStories[si % addStories.length](totalApples, addApples),
        options: makeOptions(String(totalApples + addApples), seed + 100, false),
      };
    } else if (skill === "subtraction") {
      const totalApples = intRange(r0, 5 + scale, 9 + scale * 2);
      const pickApples = intRange(r1, 1, Math.min(4 + scale, totalApples - 1));
      candidate = {
        id: round, skill, title: "Bớt đi", totalApples, pickApples,
        question: subStories[si % subStories.length](totalApples, pickApples),
        options: makeOptions(String(totalApples - pickApples), seed + 100, false),
      };
    } else if (skill === "compare") {
      let compareLeft = intRange(r0, 3, 8 + scale);
      let compareRight = intRange(r1, 2, 7 + scale);
      if (compareLeft === compareRight) compareRight = compareRight < 7 + scale ? compareRight + 1 : compareRight - 1;
      candidate = {
        id: round, skill, title: "So sánh nhiều hơn - ít hơn",
        totalApples: Math.max(compareLeft, compareRight), compareLeft, compareRight,
        question: compareStories[si % compareStories.length](compareLeft, compareRight),
        options: makeOptions(compareLeft > compareRight ? "Trái" : "Phải", seed + 100, true),
      };
    } else if (skill === "number_bond") {
      const compareLeft = intRange(r0, 2, 6 + scale);
      const compareRight = intRange(r1, 2, 5 + scale);
      candidate = {
        id: round, skill, title: "Tách - gộp số",
        totalApples: compareLeft + compareRight, compareLeft, compareRight,
        question: bondStories[si % bondStories.length](compareLeft, compareRight),
        options: makeOptions(String(compareLeft + compareRight), seed + 100, false),
      };
    } else if (skill === "missing_addend") {
      const knownPart = intRange(r0, 2, 7 + scale);
      const missingTotal = knownPart + intRange(r1, 2, 5 + scale);
      candidate = {
        id: round, skill, title: "Tìm số còn thiếu",
        totalApples: missingTotal, knownPart, missingTotal,
        question: missingStories[si % missingStories.length](knownPart, missingTotal),
        options: makeOptions(String(missingTotal - knownPart), seed + 100, false),
      };
    } else if (skill === "before_after") {
      const beforeAfterNumber = intRange(r0, 3, 18 + scale * 3);
      candidate = {
        id: round, skill, title: "Số liền trước - liền sau",
        totalApples: Math.min(beforeAfterNumber, 12), beforeAfterNumber,
        question: beforeAfterStories[si % beforeAfterStories.length](beforeAfterNumber),
        options: makeOptions(String(beforeAfterNumber + 1), seed + 100, false),
      };
    } else {
      const totalApples = intRange(r0, 3, 9);
      candidate = {
        id: round, skill, title: "Khung 10", totalApples,
        question: tenFrameStories[si % tenFrameStories.length](totalApples),
        options: makeOptions(String(10 - totalApples), seed + 100, false),
      };
    }

    const ans = getAnswer(candidate);
    if (!avoidAnswerStr || ans !== avoidAnswerStr) {
      level = candidate;
      break;
    }
    attempt++;
  }

  return level!;
}

// Static levels kept for backward compatibility
export const appleLessonLevels: AppleLessonLevel[] = Array.from({ length: 10 }, (_, i) =>
  generateLevel(i)
);
