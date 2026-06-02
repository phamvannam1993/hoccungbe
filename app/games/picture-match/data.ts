export type MatchType =
  | 'image_image'   // ảnh ↔ ảnh (bóng/màu sắc)
  | 'number_qty'    // số ↔ số lượng chấm
  | 'word_image'    // chữ ↔ ảnh
  | 'math_result'   // phép tính ↔ kết quả
  | 'upper_lower'   // chữ hoa ↔ chữ thường
  | 'viet_meaning'  // từ tiếng Việt ↔ hình ảnh nghĩa
  | 'shape_name'    // hình ↔ tên hình
  | 'color_name';   // màu ↔ tên màu

export type MatchItem = {
  id: string;
  label: string;    // displayed text or emoji
  display: 'text' | 'emoji' | 'dots' | 'math';
  pairId: string;   // matches with the item that has same pairId on other side
};

export type MatchLevel = {
  id: number;
  type: MatchType;
  title: string;
  instruction: string;
  left: MatchItem[];
  right: MatchItem[];
};

function prng(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(prng(seed + i * 131) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Data pools ──────────────────────────────────────────────────────────────

const ANIMALS = [
  { emoji: '🐶', name: 'Chó' }, { emoji: '🐱', name: 'Mèo' },
  { emoji: '🐭', name: 'Chuột' }, { emoji: '🐰', name: 'Thỏ' },
  { emoji: '🐻', name: 'Gấu' }, { emoji: '🐼', name: 'Gấu trúc' },
  { emoji: '🐨', name: 'Koala' }, { emoji: '🦊', name: 'Cáo' },
  { emoji: '🐸', name: 'Ếch' }, { emoji: '🐧', name: 'Chim cánh cụt' },
  { emoji: '🐦', name: 'Chim' }, { emoji: '🦆', name: 'Vịt' },
  { emoji: '🦋', name: 'Bướm' }, { emoji: '🐢', name: 'Rùa' },
  { emoji: '🐠', name: 'Cá nhiệt đới' }, { emoji: '🐙', name: 'Bạch tuộc' },
];

const FRUITS = [
  { emoji: '🍎', name: 'Táo' }, { emoji: '🍊', name: 'Cam' },
  { emoji: '🍋', name: 'Chanh' }, { emoji: '🍇', name: 'Nho' },
  { emoji: '🍓', name: 'Dâu' }, { emoji: '🍑', name: 'Đào' },
  { emoji: '🍍', name: 'Dứa' }, { emoji: '🥭', name: 'Xoài' },
  { emoji: '🫐', name: 'Việt quất' }, { emoji: '🍒', name: 'Cherry' },
];

const OBJECTS = [
  { emoji: '✏️', name: 'Bút chì' }, { emoji: '📚', name: 'Sách' },
  { emoji: '🎒', name: 'Ba lô' }, { emoji: '🖊️', name: 'Bút' },
  { emoji: '📏', name: 'Thước' }, { emoji: '✂️', name: 'Kéo' },
  { emoji: '🎨', name: 'Màu vẽ' }, { emoji: '🎸', name: 'Đàn' },
  { emoji: '⚽', name: 'Bóng' }, { emoji: '🎀', name: 'Nơ' },
];

const COLORS = [
  { emoji: '🔴', name: 'Đỏ' }, { emoji: '🟠', name: 'Cam' },
  { emoji: '🟡', name: 'Vàng' }, { emoji: '🟢', name: 'Xanh lá' },
  { emoji: '🔵', name: 'Xanh dương' }, { emoji: '🟣', name: 'Tím' },
  { emoji: '⚫', name: 'Đen' }, { emoji: '⚪', name: 'Trắng' },
  { emoji: '🟤', name: 'Nâu' }, { emoji: '🩷', name: 'Hồng' },
];

const SHAPES = [
  { emoji: '⭕', name: 'Tròn' }, { emoji: '▪️', name: 'Vuông' },
  { emoji: '🔺', name: 'Tam giác' }, { emoji: '♦️', name: 'Thoi' },
  { emoji: '⭐', name: 'Ngôi sao' }, { emoji: '❤️', name: 'Trái tim' },
];

const ALPHABET_VI = 'ABCDEFGHIKLMNOPRSTU'.split('').map(c => ({
  upper: c, lower: c.toLowerCase(),
}));

// ── Generator ───────────────────────────────────────────────────────────────

export function generateMatchLevel(round: number, avoidType?: MatchType): MatchLevel {
  // Cycle through types based on round
  const types: MatchType[] = [
    'word_image', 'number_qty', 'math_result', 'upper_lower',
    'color_name', 'shape_name', 'image_image', 'viet_meaning',
  ];

  let typeIdx = round % types.length;
  // Avoid same type as previous
  if (avoidType && types[typeIdx] === avoidType && types.length > 1) {
    typeIdx = (typeIdx + 1) % types.length;
  }
  const type = types[typeIdx];

  // Number of pairs: 3 → 4 → 5 with difficulty
  const pairCount = round < 4 ? 3 : round < 10 ? 4 : 5;

  const seed = round * 7919 + typeIdx * 1337;

  return buildLevel(round, type, pairCount, seed);
}

function buildLevel(round: number, type: MatchType, pairCount: number, seed: number): MatchLevel {
  switch (type) {
    case 'word_image':
      return buildWordImage(round, pairCount, seed);
    case 'number_qty':
      return buildNumberQty(round, pairCount, seed);
    case 'math_result':
      return buildMathResult(round, pairCount, seed);
    case 'upper_lower':
      return buildUpperLower(round, pairCount, seed);
    case 'color_name':
      return buildColorName(round, pairCount, seed);
    case 'shape_name':
      return buildShapeName(round, pairCount, seed);
    case 'image_image':
      return buildImageImage(round, pairCount, seed);
    case 'viet_meaning':
      return buildVietMeaning(round, pairCount, seed);
    default:
      return buildWordImage(round, pairCount, seed);
  }
}

function buildWordImage(round: number, pairCount: number, seed: number): MatchLevel {
  const pool = round < 5 ? ANIMALS : round < 10 ? [...ANIMALS, ...FRUITS] : [...ANIMALS, ...FRUITS, ...OBJECTS];
  const picked = shuffle(pool, seed).slice(0, pairCount);
  return {
    id: round,
    type: 'word_image',
    title: 'Ghép chữ với ảnh',
    instruction: 'Nối từ bên trái với hình ảnh bên phải.',
    left: shuffle(picked.map((p, i) => ({ id: `L${i}`, label: p.name, display: 'text' as const, pairId: p.emoji })), seed + 1),
    right: shuffle(picked.map((p, i) => ({ id: `R${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.emoji })), seed + 2),
  };
}

function buildNumberQty(round: number, pairCount: number, seed: number): MatchLevel {
  const maxNum = round < 5 ? 6 : round < 10 ? 10 : 15;
  const nums = shuffle(Array.from({ length: maxNum }, (_, i) => i + 1), seed).slice(0, pairCount);
  return {
    id: round,
    type: 'number_qty',
    title: 'Ghép số với số lượng',
    instruction: 'Nối số bên trái với số chấm tương ứng bên phải.',
    left: shuffle(nums.map((n, i) => ({ id: `L${i}`, label: String(n), display: 'text' as const, pairId: String(n) })), seed + 1),
    right: shuffle(nums.map((n, i) => ({ id: `R${i}`, label: '●'.repeat(n), display: 'dots' as const, pairId: String(n) })), seed + 2),
  };
}

function buildMathResult(round: number, pairCount: number, seed: number): MatchLevel {
  const pairs: Array<{ expr: string; result: number }> = [];
  let attempt = 0;
  while (pairs.length < pairCount && attempt < 50) {
    const s = Math.floor(prng(seed + attempt * 17) * 8) + 1;
    const a = Math.floor(prng(seed + attempt * 31) * (round < 5 ? 4 : 8)) + 1;
    const b = Math.floor(prng(seed + attempt * 47) * (round < 5 ? 4 : 8)) + 1;
    const isAdd = prng(seed + attempt * 61) > 0.4;
    const result = isAdd ? a + b : Math.abs(a - b);
    const expr = isAdd ? `${a} + ${b}` : `${Math.max(a, b)} - ${Math.min(a, b)}`;
    if (!pairs.find(p => p.expr === expr || p.result === result)) {
      pairs.push({ expr, result });
    }
    attempt++;
  }
  return {
    id: round,
    type: 'math_result',
    title: 'Ghép phép tính với kết quả',
    instruction: 'Nối phép tính bên trái với kết quả đúng bên phải.',
    left: shuffle(pairs.map((p, i) => ({ id: `L${i}`, label: p.expr, display: 'math' as const, pairId: String(p.result) })), seed + 1),
    right: shuffle(pairs.map((p, i) => ({ id: `R${i}`, label: String(p.result), display: 'text' as const, pairId: String(p.result) })), seed + 2),
  };
}

function buildUpperLower(round: number, pairCount: number, seed: number): MatchLevel {
  const pool = shuffle(ALPHABET_VI, seed).slice(0, pairCount);
  return {
    id: round,
    type: 'upper_lower',
    title: 'Ghép chữ hoa - chữ thường',
    instruction: 'Nối chữ hoa bên trái với chữ thường tương ứng bên phải.',
    left: shuffle(pool.map((p, i) => ({ id: `L${i}`, label: p.upper, display: 'text' as const, pairId: p.upper })), seed + 1),
    right: shuffle(pool.map((p, i) => ({ id: `R${i}`, label: p.lower, display: 'text' as const, pairId: p.upper })), seed + 2),
  };
}

function buildColorName(round: number, pairCount: number, seed: number): MatchLevel {
  const picked = shuffle(COLORS, seed).slice(0, pairCount);
  return {
    id: round,
    type: 'color_name',
    title: 'Ghép màu với tên màu',
    instruction: 'Nối ô màu bên trái với tên màu bên phải.',
    left: shuffle(picked.map((p, i) => ({ id: `L${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.name })), seed + 1),
    right: shuffle(picked.map((p, i) => ({ id: `R${i}`, label: p.name, display: 'text' as const, pairId: p.name })), seed + 2),
  };
}

function buildShapeName(round: number, pairCount: number, seed: number): MatchLevel {
  const count = Math.min(pairCount, SHAPES.length);
  const picked = shuffle(SHAPES, seed).slice(0, count);
  return {
    id: round,
    type: 'shape_name',
    title: 'Ghép hình với tên hình',
    instruction: 'Nối hình bên trái với tên gọi của nó bên phải.',
    left: shuffle(picked.map((p, i) => ({ id: `L${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.name })), seed + 1),
    right: shuffle(picked.map((p, i) => ({ id: `R${i}`, label: p.name, display: 'text' as const, pairId: p.name })), seed + 2),
  };
}

function buildImageImage(round: number, pairCount: number, seed: number): MatchLevel {
  const pool = round < 6 ? FRUITS : OBJECTS;
  const picked = shuffle(pool, seed).slice(0, pairCount);
  // Left: emoji, Right: same emoji (memory matching — both sides shuffled differently)
  return {
    id: round,
    type: 'image_image',
    title: 'Ghép ảnh giống nhau',
    instruction: 'Nối hình bên trái với hình giống nhau ở bên phải.',
    left: shuffle(picked.map((p, i) => ({ id: `L${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.name })), seed + 1),
    right: shuffle(picked.map((p, i) => ({ id: `R${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.name })), seed + 2),
  };
}

function buildVietMeaning(round: number, pairCount: number, seed: number): MatchLevel {
  const pool = round < 5 ? ANIMALS : round < 10 ? FRUITS : OBJECTS;
  const picked = shuffle(pool, seed).slice(0, pairCount);
  return {
    id: round,
    type: 'viet_meaning',
    title: 'Ghép hình với nghĩa',
    instruction: 'Nhìn hình bên trái và nối với từ đúng bên phải.',
    left: shuffle(picked.map((p, i) => ({ id: `L${i}`, label: p.emoji, display: 'emoji' as const, pairId: p.name })), seed + 1),
    right: shuffle(picked.map((p, i) => ({ id: `R${i}`, label: p.name, display: 'text' as const, pairId: p.name })), seed + 2),
  };
}
