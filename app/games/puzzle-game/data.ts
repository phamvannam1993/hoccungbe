export type PuzzleType = 'animal' | 'fruit' | 'letters' | 'numbers' | 'map' | 'image';

export type PuzzlePiece = {
  id: string;
  position: number; // 0-8 for correct position in grid
  content: string; // emoji, letter, number, or image
  display: 'emoji' | 'text' | 'image';
  configJson?: {
    cropBox?: { x: number; y: number; width: number; height: number };
    edges?: { top: string; right: string; bottom: string; left: string };
    [key: string]: unknown;
  };
};

export type PuzzleLevel = {
  id: number;
  type: PuzzleType;
  title: string;
  instruction: string;
  description: string;
  pieces: PuzzlePiece[];
  gridImage?: string; // background image for completed puzzle
};

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * 9301 + 49297) % 233280) / 233280 * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─── ANIMAL PUZZLE (3x3 = 9 pieces) ────────────────────────────────────────

const animalPuzzle: PuzzleLevel = {
  id: 1,
  type: 'animal',
  title: '🐾 Ghép Hình Con Vật',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình con vật',
  description: 'Ghép 9 mảnh để tạo thành hình con vật hoàn chỉnh',
  pieces: [
    { id: 'a1', position: 0, content: '🦁', display: 'emoji' }, // Lion head-top-left
    { id: 'a2', position: 1, content: '🦁', display: 'emoji' }, // Lion head-top-mid
    { id: 'a3', position: 2, content: '🦁', display: 'emoji' }, // Lion head-top-right
    { id: 'a4', position: 3, content: '🦁', display: 'emoji' }, // Lion body-mid-left
    { id: 'a5', position: 4, content: '🦁', display: 'emoji' }, // Lion body-mid-mid
    { id: 'a6', position: 5, content: '🦁', display: 'emoji' }, // Lion body-mid-right
    { id: 'a7', position: 6, content: '🦁', display: 'emoji' }, // Lion legs-bot-left
    { id: 'a8', position: 7, content: '🦁', display: 'emoji' }, // Lion legs-bot-mid
    { id: 'a9', position: 8, content: '🦁', display: 'emoji' }, // Lion legs-bot-right
  ],
};

// ─── FRUIT PUZZLE (3x3 = 9 pieces) ────────────────────────────────────────

const fruitPuzzle: PuzzleLevel = {
  id: 2,
  type: 'fruit',
  title: '🍎 Ghép Hình Trái Cây',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình trái cây',
  description: 'Ghép 9 mảnh để tạo thành hình trái cây đầy sắc màu',
  pieces: [
    { id: 'f1', position: 0, content: '🍎', display: 'emoji' },
    { id: 'f2', position: 1, content: '🍎', display: 'emoji' },
    { id: 'f3', position: 2, content: '🍎', display: 'emoji' },
    { id: 'f4', position: 3, content: '🍎', display: 'emoji' },
    { id: 'f5', position: 4, content: '🍎', display: 'emoji' },
    { id: 'f6', position: 5, content: '🍎', display: 'emoji' },
    { id: 'f7', position: 6, content: '🍎', display: 'emoji' },
    { id: 'f8', position: 7, content: '🍎', display: 'emoji' },
    { id: 'f9', position: 8, content: '🍎', display: 'emoji' },
  ],
};

// ─── LETTERS PUZZLE (A-B-C) ──────────────────────────────────────────────

const lettersPuzzle: PuzzleLevel = {
  id: 3,
  type: 'letters',
  title: '🔤 Ghép Chữ Cái',
  instruction: 'Kéo chữ cái vào đúng vị trí để tạo thành từ ABC',
  description: 'Ghép 3 chữ cái A, B, C vào đúng vị trí',
  pieces: [
    { id: 'l1', position: 0, content: 'A', display: 'text' },
    { id: 'l2', position: 1, content: 'B', display: 'text' },
    { id: 'l3', position: 2, content: 'C', display: 'text' },
  ],
};

// ─── NUMBERS PUZZLE (1-9) ────────────────────────────────────────────────

const numbersPuzzle: PuzzleLevel = {
  id: 4,
  type: 'numbers',
  title: '🔢 Ghép Số 1-9',
  instruction: 'Kéo các số vào đúng vị trí theo thứ tự từ 1 đến 9',
  description: 'Ghép 9 chữ số từ 1 đến 9 vào đúng vị trí',
  pieces: [
    { id: 'n1', position: 0, content: '1', display: 'text' },
    { id: 'n2', position: 1, content: '2', display: 'text' },
    { id: 'n3', position: 2, content: '3', display: 'text' },
    { id: 'n4', position: 3, content: '4', display: 'text' },
    { id: 'n5', position: 4, content: '5', display: 'text' },
    { id: 'n6', position: 5, content: '6', display: 'text' },
    { id: 'n7', position: 6, content: '7', display: 'text' },
    { id: 'n8', position: 7, content: '8', display: 'text' },
    { id: 'n9', position: 8, content: '9', display: 'text' },
  ],
};

// ─── VIETNAM MAP PUZZLE ──────────────────────────────────────────────────

const mapPuzzle: PuzzleLevel = {
  id: 5,
  type: 'map',
  title: '🗺️ Bản Đồ Việt Nam',
  instruction: 'Kéo các mảnh để ghép lại bản đồ Việt Nam',
  description: 'Ghép 9 mảnh để tạo thành bản đồ đất nước Vietnam',
  pieces: [
    { id: 'm1', position: 0, content: '🏔️', display: 'emoji' }, // Northwest
    { id: 'm2', position: 1, content: '🏔️', display: 'emoji' }, // North
    { id: 'm3', position: 2, content: '🏔️', display: 'emoji' }, // Northeast
    { id: 'm4', position: 3, content: '🌾', display: 'emoji' }, // Central West
    { id: 'm5', position: 4, content: '🇻🇳', display: 'emoji' }, // Central
    { id: 'm6', position: 5, content: '🏖️', display: 'emoji' }, // Central East
    { id: 'm7', position: 6, content: '🌴', display: 'emoji' }, // Southwest
    { id: 'm8', position: 7, content: '🌴', display: 'emoji' }, // South
    { id: 'm9', position: 8, content: '🏝️', display: 'emoji' }, // Southeast
  ],
};

// ─── FOOD PUZZLE ──────────────────────────────────────────────────────────

const foodPuzzle: PuzzleLevel = {
  id: 6,
  type: 'fruit',
  title: '🍕 Ghép Hình Thức Ăn',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình thức ăn',
  description: 'Ghép 9 mảnh để tạo thành hình các loại thức ăn ngon lành',
  pieces: [
    { id: 'food1', position: 0, content: '🍕', display: 'emoji' },
    { id: 'food2', position: 1, content: '🍕', display: 'emoji' },
    { id: 'food3', position: 2, content: '🍕', display: 'emoji' },
    { id: 'food4', position: 3, content: '🍕', display: 'emoji' },
    { id: 'food5', position: 4, content: '🍕', display: 'emoji' },
    { id: 'food6', position: 5, content: '🍕', display: 'emoji' },
    { id: 'food7', position: 6, content: '🍕', display: 'emoji' },
    { id: 'food8', position: 7, content: '🍕', display: 'emoji' },
    { id: 'food9', position: 8, content: '🍕', display: 'emoji' },
  ],
};

// ─── VEHICLES PUZZLE ───────────────────────────────────────────────────────

const vehiclesPuzzle: PuzzleLevel = {
  id: 7,
  type: 'fruit',
  title: '🚗 Ghép Hình Phương Tiện',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình phương tiện giao thông',
  description: 'Ghép 9 mảnh để tạo thành hình các loại phương tiện',
  pieces: [
    { id: 'v1', position: 0, content: '🚗', display: 'emoji' },
    { id: 'v2', position: 1, content: '🚗', display: 'emoji' },
    { id: 'v3', position: 2, content: '🚗', display: 'emoji' },
    { id: 'v4', position: 3, content: '🚗', display: 'emoji' },
    { id: 'v5', position: 4, content: '🚗', display: 'emoji' },
    { id: 'v6', position: 5, content: '🚗', display: 'emoji' },
    { id: 'v7', position: 6, content: '🚗', display: 'emoji' },
    { id: 'v8', position: 7, content: '🚗', display: 'emoji' },
    { id: 'v9', position: 8, content: '🚗', display: 'emoji' },
  ],
};

// ─── SHAPES PUZZLE ────────────────────────────────────────────────────────

const shapesPuzzle: PuzzleLevel = {
  id: 8,
  type: 'fruit',
  title: '⭐ Ghép Hình Hình Dạng',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình hình dạng',
  description: 'Ghép 9 mảnh để tạo thành hình các hình dạng cơ bản',
  pieces: [
    { id: 'shape1', position: 0, content: '⭐', display: 'emoji' },
    { id: 'shape2', position: 1, content: '⭐', display: 'emoji' },
    { id: 'shape3', position: 2, content: '⭐', display: 'emoji' },
    { id: 'shape4', position: 3, content: '⭐', display: 'emoji' },
    { id: 'shape5', position: 4, content: '⭐', display: 'emoji' },
    { id: 'shape6', position: 5, content: '⭐', display: 'emoji' },
    { id: 'shape7', position: 6, content: '⭐', display: 'emoji' },
    { id: 'shape8', position: 7, content: '⭐', display: 'emoji' },
    { id: 'shape9', position: 8, content: '⭐', display: 'emoji' },
  ],
};

// ─── COLORS PUZZLE ────────────────────────────────────────────────────────

const colorsPuzzle: PuzzleLevel = {
  id: 9,
  type: 'fruit',
  title: '🌈 Ghép Hình Màu Sắc',
  instruction: 'Kéo các mảnh vào ô vuông để ghép lại hình màu sắc',
  description: 'Ghép 9 mảnh để tạo thành bảng màu sắc đẹp',
  pieces: [
    { id: 'c1', position: 0, content: '🔴', display: 'emoji' },
    { id: 'c2', position: 1, content: '🟠', display: 'emoji' },
    { id: 'c3', position: 2, content: '🟡', display: 'emoji' },
    { id: 'c4', position: 3, content: '🟢', display: 'emoji' },
    { id: 'c5', position: 4, content: '🔵', display: 'emoji' },
    { id: 'c6', position: 5, content: '🟣', display: 'emoji' },
    { id: 'c7', position: 6, content: '🟤', display: 'emoji' },
    { id: 'c8', position: 7, content: '⚪', display: 'emoji' },
    { id: 'c9', position: 8, content: '⚫', display: 'emoji' },
  ],
};

// ─── Level Sequence by Difficulty ─────────────────────────────────────────

const easyLevels = [
  numbersPuzzle,
  lettersPuzzle,
  colorsPuzzle,
];

const normalLevels = [
  animalPuzzle,
  fruitPuzzle,
  foodPuzzle,
  shapesPuzzle,
];

const hardLevels = [
  mapPuzzle,
  vehiclesPuzzle,
];

const allLevels = [...easyLevels, ...normalLevels, ...hardLevels];

export function generatePuzzleLevel(round: number): PuzzleLevel {
  const levelIndex = round % allLevels.length;
  const level = allLevels[levelIndex];

  return {
    ...level,
    pieces: shuffle(level.pieces, round),
  };
}
