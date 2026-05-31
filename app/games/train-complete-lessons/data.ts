export type TrainSkill =
  | "count_carriages"
  | "add_carriages"
  | "remove_carriages"
  | "passengers_add"
  | "passengers_subtract"
  | "number_order"
  | "missing_number"
  | "compare"
  | "make_train"
  | "compose_number"
  | "decompose_number"
  | "ten_frame"
  | "even_odd"
  | "ordinal"
  | "greater_less_symbol"
  | "skip_count";

export type TrainLevel = {
  id: number;
  skill: TrainSkill;
  title: string;
  trainCars: number;
  addCars?: number;
  removeCars?: number;
  passengersOn?: number;
  passengersAdd?: number;
  passengersOff?: number;
  target?: number;
  compareLeft?: number;
  compareRight?: number;
  sequence?: Array<number | null>;
  ordinalIndex?: number;
  skipStep?: number;
  question: string;
  options: string[];
};

export function getTrainAnswer(level: TrainLevel): string {
  if (level.skill === "add_carriages") return String(level.trainCars + (level.addCars ?? 0));
  if (level.skill === "remove_carriages") return String(level.trainCars - (level.removeCars ?? 0));
  if (level.skill === "passengers_add") return String((level.passengersOn ?? 0) + (level.passengersAdd ?? 0));
  if (level.skill === "passengers_subtract") return String((level.passengersOn ?? 0) - (level.passengersOff ?? 0));
  if (level.skill === "number_order") return String(level.sequence?.[level.sequence.length - 1] ?? "");
  if (level.skill === "missing_number") {
    const seq = level.sequence ?? [];
    const idx = seq.indexOf(null);
    if (idx > 0) return String((seq[idx - 1] as number) + 1);
    return "3";
  }
  if (level.skill === "compare") {
    if ((level.compareLeft ?? 0) > (level.compareRight ?? 0)) return "Tàu xanh";
    if ((level.compareLeft ?? 0) < (level.compareRight ?? 0)) return "Tàu đỏ";
    return "Bằng nhau";
  }
  if (level.skill === "make_train") return String(level.target ?? 0);
  if (level.skill === "compose_number") return String((level.compareLeft ?? 0) + (level.compareRight ?? 0));
  if (level.skill === "decompose_number") return String((level.trainCars ?? 0) - (level.compareLeft ?? 0));
  if (level.skill === "ten_frame") return String((level.target ?? 10) - level.trainCars);
  if (level.skill === "even_odd") return level.trainCars % 2 === 0 ? "Chẵn" : "Lẻ";
  if (level.skill === "ordinal") return String(level.ordinalIndex ?? 0);
  if (level.skill === "greater_less_symbol") {
    if ((level.compareLeft ?? 0) > (level.compareRight ?? 0)) return ">";
    if ((level.compareLeft ?? 0) < (level.compareRight ?? 0)) return "<";
    return "=";
  }
  if (level.skill === "skip_count") {
    const seq = level.sequence ?? [];
    const step = level.skipStep ?? 2;
    const last = seq.filter((v) => v !== null).pop() as number;
    return String(last + step);
  }
  return String(level.trainCars);
}

function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function intRange(rnd: number, min: number, max: number): number {
  return min + Math.floor(rnd * (max - min + 1));
}

function makeOptions(correctStr: string, seed: number, pool?: string[]): string[] {
  if (pool) {
    const opts = [correctStr];
    for (const v of pool) {
      if (v !== correctStr && opts.length < 4) opts.push(v);
    }
    while (opts.length < 4) opts.push("?");
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(prng(seed + i * 17) * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }
  const correct = Number(correctStr);
  const distractors = new Set<number>();
  const offsets = [-2, -1, 1, 2, 3, -3];
  for (const off of offsets) {
    const v = correct + off;
    if (v >= 0 && v !== correct) distractors.add(v);
    if (distractors.size >= 3) break;
  }
  let s = seed;
  while (distractors.size < 3) {
    s = Math.floor(prng(s + 1) * 10000);
    const v = Math.max(0, correct + Math.floor(prng(s) * 7) - 3);
    if (v !== correct) distractors.add(v);
  }
  const opts = [correct, ...Array.from(distractors).slice(0, 3)];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(prng(seed + i * 31 + 7) * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts.map(String);
}

const ALL_SKILLS: TrainSkill[] = [
  "count_carriages",
  "add_carriages",
  "remove_carriages",
  "passengers_add",
  "passengers_subtract",
  "missing_number",
  "compare",
  "compose_number",
  "decompose_number",
  "ten_frame",
  "even_odd",
  "ordinal",
  "greater_less_symbol",
  "skip_count",
  "number_order",
  "make_train",
];

export function generateTrainLevel(round: number, avoidAnswerStr?: string): TrainLevel {
  let level: TrainLevel | null = null;
  let attempt = 0;
  while (attempt < 6) {
    const seed = round * 2333 + attempt * 4919;
    const r0 = prng(seed);
    const r1 = prng(seed + 1);
    const r2 = prng(seed + 2);

    const tier = round < 16 ? Math.floor(round / 2) : (round % ALL_SKILLS.length);
    let skill: TrainSkill;
    if (round < 16) {
      const tierMap: TrainSkill[] = [
        "count_carriages", "add_carriages", "remove_carriages",
        "passengers_add", "passengers_subtract", "missing_number",
        "compare", "compose_number",
      ];
      skill = tierMap[Math.floor(tier)] ?? "count_carriages";
    } else {
      skill = ALL_SKILLS[tier % ALL_SKILLS.length];
    }

    const scale = round >= 16 ? Math.floor(round / ALL_SKILLS.length) : 0;
    const si = Math.floor(prng(seed + 77) * 3);

    // Story templates
    const countStories = [
      (n: number) => `Bé nhìn ra cửa sổ và đếm số toa tàu đang lăn bánh. Hỏi đoàn tàu có bao nhiêu toa?`,
      (n: number) => `Đoàn tàu chạy qua sân ga, bé đếm từng toa một. Hỏi tất cả có bao nhiêu toa trong đoàn tàu đó?`,
      (_n: number) => `Bé và bố đứng trên cầu nhìn xuống. Một đoàn tàu đang chạy qua bên dưới. Hỏi đoàn tàu có bao nhiêu toa?`,
    ];
    const addStories = [
      (x: number, y: number) => `Đoàn tàu đang chạy với ${x} toa, tại ga tiếp theo ${y} toa được nối thêm vào. Hỏi tất cả có bao nhiêu toa?`,
      (x: number, y: number) => `Bác lái tàu nối ${y} toa mới vào đoàn tàu đang có ${x} toa. Hỏi đoàn tàu bây giờ có bao nhiêu toa?`,
      (x: number, y: number) => `Ga đầu có ${x} toa chở hàng. Ga sau nối thêm ${y} toa nữa. Hỏi tổng cộng có bao nhiêu toa?`,
    ];
    const removeStories = [
      (x: number, y: number) => `Đoàn tàu có ${x} toa, đến ga lớn tách ra ${y} toa. Hỏi còn lại bao nhiêu toa?`,
      (x: number, y: number) => `Tàu đang chạy với ${x} toa nhưng ${y} toa bị hỏng phải để lại ở ga. Hỏi tàu còn bao nhiêu toa?`,
      (x: number, y: number) => `Bác trưởng ga tách ${y} toa ra khỏi đoàn tàu ${x} toa để sửa chữa. Hỏi đoàn tàu còn lại bao nhiêu toa?`,
    ];
    const passAddStories = [
      (x: number, y: number) => `Trên tàu có ${x} hành khách, đến ga mới ${y} bạn nhỏ lên tàu. Hỏi tất cả có bao nhiêu hành khách?`,
      (x: number, y: number) => `Có ${x} người ngồi trên tàu. Tại ga kế tiếp, thêm ${y} người bước lên. Hỏi tổng cộng có bao nhiêu người?`,
      (x: number, y: number) => `Đoàn tàu đang chở ${x} hành khách. Ở bến tiếp theo ${y} người nữa lên tàu. Hỏi có tất cả bao nhiêu hành khách?`,
    ];
    const passSubStories = [
      (x: number, y: number) => `Trên tàu có ${x} hành khách, đến ga ${y} người xuống. Hỏi còn lại bao nhiêu hành khách?`,
      (x: number, y: number) => `Tàu chở ${x} người. Ở ga thứ hai ${y} người bước xuống. Hỏi trên tàu còn bao nhiêu người?`,
      (x: number, y: number) => `Có ${x} khách trên tàu. Đến điểm cuối ${y} khách xuống trước. Hỏi còn bao nhiêu khách chưa xuống?`,
    ];
    const missingStories = [
      (_seq: string) => `Các toa tàu được đánh số theo thứ tự nhưng một toa bị mất số. Hỏi số còn thiếu là số mấy?`,
      (_seq: string) => `Bé nhìn vào dãy số trên các toa tàu và thấy một toa không có số. Hỏi toa đó mang số mấy?`,
      (_seq: string) => `Đoàn tàu có dãy số trên các toa nhưng một số bị xóa mất. Hỏi số bị thiếu là bao nhiêu?`,
    ];
    const compareStories = [
      (l: number, r: number) => `Tàu xanh có ${l} toa, tàu đỏ có ${r} toa đang cùng chạy trên đường ray. Hỏi tàu nào dài hơn?`,
      (l: number, r: number) => `Trên hai đường ray song song: tàu xanh có ${l} toa và tàu đỏ có ${r} toa. Hỏi đoàn tàu nào nhiều toa hơn?`,
      (l: number, r: number) => `Hai đoàn tàu xuất phát cùng lúc. Tàu xanh có ${l} toa, tàu đỏ có ${r} toa. Hỏi tàu nào ngắn hơn?`,
    ];
    const composeStories = [
      (l: number, r: number) => `Tàu xanh có ${l} toa, tàu vàng có ${r} toa được nối lại thành một đoàn. Hỏi gộp lại có bao nhiêu toa?`,
      (l: number, r: number) => `Hai đoàn tàu ${l} toa và ${r} toa ghép lại với nhau. Hỏi có tất cả bao nhiêu toa?`,
    ];
    const decomposeStories = [
      (total: number, left: number) => `Đoàn tàu ${total} toa được tách thành toa xanh ${left} toa và một phần chưa biết. Hỏi phần còn lại có bao nhiêu toa?`,
      (total: number, left: number) => `Bác lái tàu tách đoàn tàu ${total} toa ra: ${left} toa đi về phía bắc, phần còn lại đi về phía nam. Hỏi phần đi nam có bao nhiêu toa?`,
    ];
    const tenFrameStories = [
      (n: number) => `Bảng 10 ô trên tàu đang có ${n} ô được tô màu. Hỏi cần tô thêm bao nhiêu ô để đủ 10 ô?`,
      (n: number) => `Khung 10 ghế trên tàu đã có ${n} ghế có người ngồi. Hỏi còn bao nhiêu ghế trống?`,
    ];
    const evenOddStories = [
      (n: number) => `Đoàn tàu có ${n} toa được ghép thành từng cặp. Hỏi số ${n} là số chẵn hay số lẻ?`,
      (n: number) => `Bé đếm ${n} toa tàu và thử ghép đôi từng toa một. Hỏi số ${n} là số chẵn hay số lẻ?`,
    ];
    const ordinalStories = [
      (idx: number) => `Bé muốn tìm toa đứng ở vị trí thứ ${idx} trong đoàn tàu. Hỏi đó là toa số mấy?`,
      (idx: number) => `Đoàn tàu có nhiều toa được đánh số. Toa đứng ở vị trí số ${idx} mang số mấy?`,
    ];
    const greaterLessStories = [
      (l: number, r: number) => `Tàu xanh có ${l} toa, tàu đỏ có ${r} toa. Cần điền dấu gì vào chỗ trống: ${l} __ ${r}?`,
      (l: number, r: number) => `Bé so sánh ${l} toa và ${r} toa. Hỏi phải dùng dấu nào để so sánh đúng?`,
    ];
    const skipCountStories = [
      (_step: number) => `Trên các toa tàu có dãy số đếm cách đều. Hỏi số tiếp theo trong dãy là số mấy?`,
      (_step: number) => `Dãy số trên các toa tàu đếm theo bước nhảy đều nhau. Hỏi số còn thiếu ở cuối dãy là bao nhiêu?`,
    ];

    let candidate: TrainLevel;

    if (skill === "count_carriages") {
      const n = intRange(r0, 3 + scale, 6 + scale * 2);
      candidate = {
        id: round, skill, title: "Đếm toa tàu",
        trainCars: n,
        question: countStories[si % countStories.length](n),
        options: makeOptions(String(n), seed + 100),
      };
    } else if (skill === "add_carriages") {
      const x = intRange(r0, 3 + scale, 6 + scale * 2);
      const y = intRange(r1, 1, 3 + scale);
      candidate = {
        id: round, skill, title: "Nối thêm toa",
        trainCars: x, addCars: y,
        question: addStories[si % addStories.length](x, y),
        options: makeOptions(String(x + y), seed + 100),
      };
    } else if (skill === "remove_carriages") {
      const x = intRange(r0, 5 + scale, 9 + scale * 2);
      const y = intRange(r1, 1, Math.min(4 + scale, x - 1));
      candidate = {
        id: round, skill, title: "Bớt toa tàu",
        trainCars: x, removeCars: y,
        question: removeStories[si % removeStories.length](x, y),
        options: makeOptions(String(x - y), seed + 100),
      };
    } else if (skill === "passengers_add") {
      const x = intRange(r0, 3 + scale, 6 + scale * 2);
      const y = intRange(r1, 1, 3 + scale);
      candidate = {
        id: round, skill, title: "Thêm hành khách",
        trainCars: x + y, passengersOn: x, passengersAdd: y,
        question: passAddStories[si % passAddStories.length](x, y),
        options: makeOptions(String(x + y), seed + 100),
      };
    } else if (skill === "passengers_subtract") {
      const x = intRange(r0, 5 + scale, 8 + scale * 2);
      const y = intRange(r1, 1, Math.min(4 + scale, x - 1));
      candidate = {
        id: round, skill, title: "Bớt hành khách",
        trainCars: x, passengersOn: x, passengersOff: y,
        question: passSubStories[si % passSubStories.length](x, y),
        options: makeOptions(String(x - y), seed + 100),
      };
    } else if (skill === "missing_number") {
      const start = intRange(r0, 1 + scale, 5 + scale);
      const seq: Array<number | null> = [start, start + 1, null, start + 3, start + 4];
      const seqStr = seq.map((v) => (v === null ? "?" : String(v))).join(", ");
      candidate = {
        id: round, skill, title: "Tìm số còn thiếu",
        trainCars: 5, sequence: seq,
        question: missingStories[si % missingStories.length](seqStr),
        options: makeOptions(String(start + 2), seed + 100),
      };
    } else if (skill === "compare") {
      let l = intRange(r0, 3 + scale, 8 + scale);
      let r = intRange(r1, 2 + scale, 7 + scale);
      if (l === r) r = r < 7 + scale ? r + 1 : r - 1;
      const correctAns = l > r ? "Tàu xanh" : "Tàu đỏ";
      candidate = {
        id: round, skill, title: "So sánh đoàn tàu",
        trainCars: Math.max(l, r), compareLeft: l, compareRight: r,
        question: compareStories[si % compareStories.length](l, r),
        options: makeOptions(correctAns, seed + 100, ["Tàu xanh", "Tàu đỏ", "Bằng nhau"]),
      };
    } else if (skill === "compose_number") {
      const l = intRange(r0, 2 + scale, 6 + scale);
      const r = intRange(r1, 2 + scale, 5 + scale);
      candidate = {
        id: round, skill, title: "Gộp số",
        trainCars: l + r, compareLeft: l, compareRight: r,
        question: composeStories[si % composeStories.length](l, r),
        options: makeOptions(String(l + r), seed + 100),
      };
    } else if (skill === "decompose_number") {
      const left = intRange(r0, 2 + scale, 6 + scale);
      const right = intRange(r1, 2 + scale, 5 + scale);
      const total = left + right;
      candidate = {
        id: round, skill, title: "Tách số",
        trainCars: total, compareLeft: left, compareRight: right,
        question: decomposeStories[si % decomposeStories.length](total, left),
        options: makeOptions(String(right), seed + 100),
      };
    } else if (skill === "ten_frame") {
      const n = intRange(r0, 3, 9);
      candidate = {
        id: round, skill, title: "Làm tròn 10",
        trainCars: n, target: 10,
        question: tenFrameStories[si % tenFrameStories.length](n),
        options: makeOptions(String(10 - n), seed + 100),
      };
    } else if (skill === "even_odd") {
      const n = intRange(r0, 2 + scale, 10 + scale * 2);
      candidate = {
        id: round, skill, title: "Chẵn hay lẻ",
        trainCars: n,
        question: evenOddStories[si % evenOddStories.length](n),
        options: makeOptions(n % 2 === 0 ? "Chẵn" : "Lẻ", seed + 100, ["Chẵn", "Lẻ"]),
      };
    } else if (skill === "ordinal") {
      const total = intRange(r0, 5, 8 + scale);
      const idx = intRange(r1, 2, total - 1);
      candidate = {
        id: round, skill, title: "Số thứ tự",
        trainCars: total, ordinalIndex: idx,
        question: ordinalStories[si % ordinalStories.length](idx),
        options: makeOptions(String(idx), seed + 100),
      };
    } else if (skill === "greater_less_symbol") {
      let l = intRange(r0, 3 + scale, 9 + scale);
      let r = intRange(r1, 2 + scale, 8 + scale);
      if (l === r) r = r < 8 + scale ? r + 1 : r - 1;
      const sym = l > r ? ">" : l < r ? "<" : "=";
      candidate = {
        id: round, skill, title: "Dấu so sánh",
        trainCars: Math.max(l, r), compareLeft: l, compareRight: r,
        question: greaterLessStories[si % greaterLessStories.length](l, r),
        options: makeOptions(sym, seed + 100, [">", "<", "="]),
      };
    } else if (skill === "skip_count") {
      const step = intRange(r0, 2, 3 + scale);
      const start = intRange(r1, 1, 3 + scale) * step;
      const seq: Array<number | null> = [start, start + step, start + step * 2, start + step * 3, null];
      candidate = {
        id: round, skill, title: "Đếm nhảy",
        trainCars: 5, sequence: seq, skipStep: step,
        question: skipCountStories[si % skipCountStories.length](step),
        options: makeOptions(String(start + step * 4), seed + 100),
      };
    } else if (skill === "number_order") {
      const start = intRange(r0, 1 + scale, 4 + scale);
      const seq = Array.from({ length: 5 }, (_, i) => start + i);
      candidate = {
        id: round, skill, title: "Thứ tự số",
        trainCars: 5, sequence: seq,
        question: `Các toa tàu xếp theo thứ tự từ ${start} đến ${start + 4}. Toa cuối cùng mang số mấy?`,
        options: makeOptions(String(start + 4), seed + 100),
      };
    } else {
      // make_train
      const target = intRange(r0, 3 + scale, 7 + scale);
      const total = target + intRange(r1, 2, 4);
      candidate = {
        id: round, skill, title: "Tạo đoàn tàu đúng số",
        trainCars: total, target,
        question: `Đoàn tàu đang có nhiều toa. Hãy bấm chọn đúng ${target} toa để tạo đoàn tàu theo yêu cầu.`,
        options: makeOptions(String(target), seed + 100),
      };
    }

    const ans = getTrainAnswer(candidate);
    if (!avoidAnswerStr || ans !== avoidAnswerStr) {
      level = candidate;
      break;
    }
    attempt++;
  }

  return level!;
}
