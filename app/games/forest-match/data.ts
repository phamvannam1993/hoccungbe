export type MatchContentType = 'number' | 'text' | 'image';
export type DisplayType = 'text' | 'emoji' | 'number' | 'dots' | 'dots-pattern';

export type MatchItem = {
  id: string;
  label: string;
  display: DisplayType;
  imageUrl?: string;
  pairId: string;
};

export type MatchLevel = {
  id: number;
  difficulty: 'easy' | 'normal' | 'hard';
  contentType: MatchContentType;
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

// ─── NUMBER MATCHING LEVELS ────────────────────────────────────────────────────

const numberEasy: MatchLevel = {
  id: 1,
  difficulty: 'easy',
  contentType: 'number',
  title: '🎮 Ghép Số (Dễ)',
  instruction: 'Chọn số bên trái và ghép với số giống bên phải',
  left: [
    { id: 'l1', label: '1', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: '2', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: '3', display: 'text', pairId: 'pair3' },
    { id: 'l4', label: '4', display: 'text', pairId: 'pair4' },
  ],
  right: [
    { id: 'r1', label: '4', display: 'text', pairId: 'pair4' },
    { id: 'r2', label: '1', display: 'text', pairId: 'pair1' },
    { id: 'r3', label: '2', display: 'text', pairId: 'pair2' },
    { id: 'r4', label: '3', display: 'text', pairId: 'pair3' },
  ],
};

const numberNormal: MatchLevel = {
  id: 2,
  difficulty: 'normal',
  contentType: 'number',
  title: '🎮 Ghép Số (Trung Bình)',
  instruction: 'Ghép số với số lượng chấm tương ứng',
  left: [
    { id: 'l1', label: '2', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: '5', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: '3', display: 'text', pairId: 'pair3' },
    { id: 'l4', label: '4', display: 'text', pairId: 'pair4' },
    { id: 'l5', label: '6', display: 'text', pairId: 'pair5' },
  ],
  right: [
    { id: 'r1', label: '5', display: 'dots', pairId: 'pair2' },
    { id: 'r2', label: '3', display: 'dots', pairId: 'pair3' },
    { id: 'r3', label: '2', display: 'dots', pairId: 'pair1' },
    { id: 'r4', label: '6', display: 'dots', pairId: 'pair5' },
    { id: 'r5', label: '4', display: 'dots', pairId: 'pair4' },
  ],
};

const numberHard: MatchLevel = {
  id: 3,
  difficulty: 'hard',
  contentType: 'number',
  title: '🎮 Ghép Số (Khó)',
  instruction: 'Ghép kết quả phép tính với đáp án',
  left: [
    { id: 'l1', label: '2 + 3', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: '4 + 2', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: '1 + 5', display: 'text', pairId: 'pair3' },
    { id: 'l4', label: '3 + 3', display: 'text', pairId: 'pair4' },
    { id: 'l5', label: '2 + 4', display: 'text', pairId: 'pair5' },
    { id: 'l6', label: '5 + 1', display: 'text', pairId: 'pair3' },
  ],
  right: [
    { id: 'r1', label: '5', display: 'text', pairId: 'pair1' },
    { id: 'r2', label: '6', display: 'text', pairId: 'pair5' },
    { id: 'r3', label: '6', display: 'text', pairId: 'pair2' },
    { id: 'r4', label: '6', display: 'text', pairId: 'pair6' },
    { id: 'r5', label: '6', display: 'text', pairId: 'pair4' },
    { id: 'r6', label: '6', display: 'text', pairId: 'pair6' },
  ],
};

// ─── IMAGE MATCHING LEVELS ────────────────────────────────────────────────────

const imageEasy: MatchLevel = {
  id: 4,
  difficulty: 'easy',
  contentType: 'image',
  title: '🖼️ Ghép Hình Ảnh (Dễ)',
  instruction: 'Ghép ảnh giống nhau bên trái và bên phải',
  left: [
    { id: 'l1', label: 'Apple', display: 'emoji', imageUrl: '', pairId: 'pair1' },
    { id: 'l2', label: 'Banana', display: 'emoji', imageUrl: '', pairId: 'pair2' },
    { id: 'l3', label: 'Cherry', display: 'emoji', imageUrl: '', pairId: 'pair3' },
  ],
  right: [
    { id: 'r1', label: 'Banana', display: 'emoji', imageUrl: '', pairId: 'pair2' },
    { id: 'r2', label: 'Cherry', display: 'emoji', imageUrl: '', pairId: 'pair3' },
    { id: 'r3', label: 'Apple', display: 'emoji', imageUrl: '', pairId: 'pair1' },
  ],
};

const imageNormal: MatchLevel = {
  id: 5,
  difficulty: 'normal',
  contentType: 'image',
  title: '🖼️ Ghép Hình Ảnh (Trung Bình)',
  instruction: 'Ghép động vật với âm thanh của nó',
  left: [
    { id: 'l1', label: 'Dog', display: 'emoji', pairId: 'pair1' },
    { id: 'l2', label: 'Cat', display: 'emoji', pairId: 'pair2' },
    { id: 'l3', label: 'Duck', display: 'emoji', pairId: 'pair3' },
    { id: 'l4', label: 'Cow', display: 'emoji', pairId: 'pair4' },
  ],
  right: [
    { id: 'r1', label: '🐄', display: 'emoji', pairId: 'pair4' },
    { id: 'r2', label: '🐶', display: 'emoji', pairId: 'pair1' },
    { id: 'r3', label: '🦆', display: 'emoji', pairId: 'pair3' },
    { id: 'r4', label: '🐱', display: 'emoji', pairId: 'pair2' },
  ],
};

const imageHard: MatchLevel = {
  id: 6,
  difficulty: 'hard',
  contentType: 'image',
  title: '🖼️ Ghép Hình Ảnh (Khó)',
  instruction: 'Ghép động vật với môi trường sống của nó',
  left: [
    { id: 'l1', label: 'Fish', display: 'emoji', pairId: 'pair1' },
    { id: 'l2', label: 'Bird', display: 'emoji', pairId: 'pair2' },
    { id: 'l3', label: 'Rabbit', display: 'emoji', pairId: 'pair3' },
    { id: 'l4', label: 'Bear', display: 'emoji', pairId: 'pair4' },
    { id: 'l5', label: 'Snake', display: 'emoji', pairId: 'pair5' },
  ],
  right: [
    { id: 'r1', label: 'Tree', display: 'emoji', pairId: 'pair2' },
    { id: 'r2', label: 'Cave', display: 'emoji', pairId: 'pair4' },
    { id: 'r3', label: 'Water', display: 'emoji', pairId: 'pair1' },
    { id: 'r4', label: 'Hole', display: 'emoji', pairId: 'pair5' },
    { id: 'r5', label: 'Burrow', display: 'emoji', pairId: 'pair3' },
  ],
};

// ─── TEXT MATCHING LEVELS ─────────────────────────────────────────────────────

const textEasy: MatchLevel = {
  id: 7,
  difficulty: 'easy',
  contentType: 'text',
  title: '✏️ Ghép Chữ (Dễ)',
  instruction: 'Ghép các chữ hoa với chữ thường giống nhau',
  left: [
    { id: 'l1', label: 'A', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: 'B', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: 'C', display: 'text', pairId: 'pair3' },
  ],
  right: [
    { id: 'r1', label: 'c', display: 'text', pairId: 'pair3' },
    { id: 'r2', label: 'a', display: 'text', pairId: 'pair1' },
    { id: 'r3', label: 'b', display: 'text', pairId: 'pair2' },
  ],
};

const textNormal: MatchLevel = {
  id: 8,
  difficulty: 'normal',
  contentType: 'text',
  title: '✏️ Ghép Chữ (Trung Bình)',
  instruction: 'Ghép từ tiếng Anh với nghĩa tiếng Việt',
  left: [
    { id: 'l1', label: 'Cat', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: 'Dog', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: 'Apple', display: 'text', pairId: 'pair3' },
    { id: 'l4', label: 'Tree', display: 'text', pairId: 'pair4' },
  ],
  right: [
    { id: 'r1', label: 'Cây', display: 'text', pairId: 'pair4' },
    { id: 'r2', label: 'Mèo', display: 'text', pairId: 'pair1' },
    { id: 'r3', label: 'Quả táo', display: 'text', pairId: 'pair3' },
    { id: 'r4', label: 'Chó', display: 'text', pairId: 'pair2' },
  ],
};

const textHard: MatchLevel = {
  id: 9,
  difficulty: 'hard',
  contentType: 'text',
  title: '✏️ Ghép Chữ (Khó)',
  instruction: 'Ghép từ vựng với định nghĩa của chúng',
  left: [
    { id: 'l1', label: 'Rừng', display: 'text', pairId: 'pair1' },
    { id: 'l2', label: 'Sông', display: 'text', pairId: 'pair2' },
    { id: 'l3', label: 'Núi', display: 'text', pairId: 'pair3' },
    { id: 'l4', label: 'Biển', display: 'text', pairId: 'pair4' },
    { id: 'l5', label: 'Thành phố', display: 'text', pairId: 'pair5' },
  ],
  right: [
    { id: 'r1', label: 'Nơi có nhiều cây cối', display: 'text', pairId: 'pair1' },
    { id: 'r2', label: 'Dòng nước chảy lớn', display: 'text', pairId: 'pair2' },
    { id: 'r3', label: 'Đỉnh cao nhất trên đất', display: 'text', pairId: 'pair3' },
    { id: 'r4', label: 'Nước mặn rộng lớn', display: 'text', pairId: 'pair4' },
    { id: 'r5', label: 'Nơi có nhiều nhà cửa', display: 'text', pairId: 'pair5' },
  ],
};

// ─── Level Sequence ───────────────────────────────────────────────────────────

const allLevels = [
  numberEasy,
  numberNormal,
  imageEasy,
  textEasy,
  numberHard,
  imageNormal,
  textNormal,
  imageHard,
  textHard,
];

export function generateMatchLevel(round: number): MatchLevel {
  const levelIndex = round % allLevels.length;
  const level = allLevels[levelIndex];

  return {
    ...level,
    right: shuffle(level.right, round),
  };
}
