export type ListenDoCategory =
  | 'colors'
  | 'animals'
  | 'shapes'
  | 'objects'
  | 'mixed';

export type ListenDoLevel = 'easy' | 'medium' | 'hard';

export type ListenDoItem = {
  id: string;
  label: string;
  emoji: string;
};

export type ListenDoQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: ListenDoLevel;
  category: ListenDoCategory;
  correct: string;
  items: ListenDoItem[];
};

export const listenDoCategories = [
  { key: 'colors', label: 'Màu sắc', icon: '🌈', total: 6 },
  { key: 'animals', label: 'Con vật', icon: '🐻', total: 6 },
  { key: 'shapes', label: 'Hình dạng', icon: '🔺', total: 6 },
  { key: 'objects', label: 'Đồ vật', icon: '🧸', total: 6 },
  { key: 'mixed', label: 'Tổng hợp', icon: '✨', total: 6 },
] as const;

export const listenDoData: Record<
  ListenDoCategory,
  {
    label: string;
    icon: string;
    questions: ListenDoQuestion[];
  }
> = {
  colors: {
    label: 'Màu sắc',
    icon: '🌈',
    questions: [
      {
        id: 'colors-1',
        prompt: 'Hãy chọn màu đỏ',
        hint: 'Nghe kỹ yêu cầu rồi chọn đúng màu',
        level: 'easy',
        category: 'colors',
        correct: '🟥',
        items: [
          { id: 'c1', label: 'Đỏ', emoji: '🟥' },
          { id: 'c2', label: 'Xanh', emoji: '🟦' },
          { id: 'c3', label: 'Vàng', emoji: '🟨' },
          { id: 'c4', label: 'Xanh lá', emoji: '🟩' },
        ],
      },
      {
        id: 'colors-2',
        prompt: 'Hãy chọn màu xanh dương',
        hint: 'Bé tìm ô màu xanh dương',
        level: 'easy',
        category: 'colors',
        correct: '🟦',
        items: [
          { id: 'c5', label: 'Đỏ', emoji: '🟥' },
          { id: 'c6', label: 'Xanh dương', emoji: '🟦' },
          { id: 'c7', label: 'Vàng', emoji: '🟨' },
          { id: 'c8', label: 'Tím', emoji: '🟪' },
        ],
      },
      {
        id: 'colors-3',
        prompt: 'Hãy chọn màu xanh lá',
        hint: 'Nghe yêu cầu và chọn đúng màu',
        level: 'medium',
        category: 'colors',
        correct: '🟩',
        items: [
          { id: 'c9', label: 'Xanh lá', emoji: '🟩' },
          { id: 'c10', label: 'Cam', emoji: '🟧' },
          { id: 'c11', label: 'Đỏ', emoji: '🟥' },
          { id: 'c12', label: 'Trắng', emoji: '⬜' },
        ],
      },
      {
        id: 'colors-4',
        prompt: 'Hãy chọn màu tím',
        hint: 'Tìm đúng màu được nhắc tới',
        level: 'medium',
        category: 'colors',
        correct: '🟪',
        items: [
          { id: 'c13', label: 'Tím', emoji: '🟪' },
          { id: 'c14', label: 'Vàng', emoji: '🟨' },
          { id: 'c15', label: 'Đen', emoji: '⬛' },
          { id: 'c16', label: 'Xanh', emoji: '🟦' },
        ],
      },
      {
        id: 'colors-5',
        prompt: 'Hãy chọn màu trắng',
        hint: 'Chú ý nghe kỹ',
        level: 'hard',
        category: 'colors',
        correct: '⬜',
        items: [
          { id: 'c17', label: 'Đen', emoji: '⬛' },
          { id: 'c18', label: 'Trắng', emoji: '⬜' },
          { id: 'c19', label: 'Xám', emoji: '◻️' },
          { id: 'c20', label: 'Nâu', emoji: '🟫' },
        ],
      },
      {
        id: 'colors-6',
        prompt: 'Hãy chọn màu cam',
        hint: 'Bé tìm ô màu cam',
        level: 'hard',
        category: 'colors',
        correct: '🟧',
        items: [
          { id: 'c21', label: 'Cam', emoji: '🟧' },
          { id: 'c22', label: 'Đỏ', emoji: '🟥' },
          { id: 'c23', label: 'Vàng', emoji: '🟨' },
          { id: 'c24', label: 'Xanh', emoji: '🟦' },
        ],
      },
    ],
  },

  animals: {
    label: 'Con vật',
    icon: '🐻',
    questions: [
      {
        id: 'animals-1',
        prompt: 'Hãy chọn con mèo',
        hint: 'Nghe tên con vật rồi chọn đúng',
        level: 'easy',
        category: 'animals',
        correct: '🐱',
        items: [
          { id: 'a1', label: 'Mèo', emoji: '🐱' },
          { id: 'a2', label: 'Chó', emoji: '🐶' },
          { id: 'a3', label: 'Gấu', emoji: '🐻' },
          { id: 'a4', label: 'Thỏ', emoji: '🐰' },
        ],
      },
      {
        id: 'animals-2',
        prompt: 'Hãy chọn con chó',
        hint: 'Tìm đúng con vật được nhắc tới',
        level: 'easy',
        category: 'animals',
        correct: '🐶',
        items: [
          { id: 'a5', label: 'Mèo', emoji: '🐱' },
          { id: 'a6', label: 'Chó', emoji: '🐶' },
          { id: 'a7', label: 'Cá', emoji: '🐟' },
          { id: 'a8', label: 'Gà', emoji: '🐔' },
        ],
      },
      {
        id: 'animals-3',
        prompt: 'Hãy chọn con cá',
        hint: 'Nghe kỹ tên con vật',
        level: 'medium',
        category: 'animals',
        correct: '🐟',
        items: [
          { id: 'a9', label: 'Cá', emoji: '🐟' },
          { id: 'a10', label: 'Vịt', emoji: '🦆' },
          { id: 'a11', label: 'Khỉ', emoji: '🐵' },
          { id: 'a12', label: 'Gấu', emoji: '🐻' },
        ],
      },
      {
        id: 'animals-4',
        prompt: 'Hãy chọn con vịt',
        hint: 'Bé chọn đúng con vịt',
        level: 'medium',
        category: 'animals',
        correct: '🦆',
        items: [
          { id: 'a13', label: 'Gà', emoji: '🐔' },
          { id: 'a14', label: 'Vịt', emoji: '🦆' },
          { id: 'a15', label: 'Thỏ', emoji: '🐰' },
          { id: 'a16', label: 'Mèo', emoji: '🐱' },
        ],
      },
      {
        id: 'animals-5',
        prompt: 'Hãy chọn con voi',
        hint: 'Chú ý nghe tên con vật',
        level: 'hard',
        category: 'animals',
        correct: '🐘',
        items: [
          { id: 'a17', label: 'Voi', emoji: '🐘' },
          { id: 'a18', label: 'Gấu', emoji: '🐻' },
          { id: 'a19', label: 'Hổ', emoji: '🐯' },
          { id: 'a20', label: 'Khỉ', emoji: '🐵' },
        ],
      },
      {
        id: 'animals-6',
        prompt: 'Hãy chọn con sư tử',
        hint: 'Bé tìm đúng con sư tử',
        level: 'hard',
        category: 'animals',
        correct: '🦁',
        items: [
          { id: 'a21', label: 'Sư tử', emoji: '🦁' },
          { id: 'a22', label: 'Hổ', emoji: '🐯' },
          { id: 'a23', label: 'Gấu', emoji: '🐻' },
          { id: 'a24', label: 'Chó', emoji: '🐶' },
        ],
      },
    ],
  },

  shapes: {
    label: 'Hình dạng',
    icon: '🔺',
    questions: [
      {
        id: 'shapes-1',
        prompt: 'Hãy chọn hình tròn',
        hint: 'Nghe tên hình rồi chọn đúng',
        level: 'easy',
        category: 'shapes',
        correct: '⚪',
        items: [
          { id: 's1', label: 'Tròn', emoji: '⚪' },
          { id: 's2', label: 'Vuông', emoji: '🟦' },
          { id: 's3', label: 'Tam giác', emoji: '🔺' },
          { id: 's4', label: 'Ngôi sao', emoji: '⭐' },
        ],
      },
      {
        id: 'shapes-2',
        prompt: 'Hãy chọn hình vuông',
        hint: 'Tìm đúng hình vuông',
        level: 'easy',
        category: 'shapes',
        correct: '🟦',
        items: [
          { id: 's5', label: 'Tròn', emoji: '⚪' },
          { id: 's6', label: 'Vuông', emoji: '🟦' },
          { id: 's7', label: 'Tam giác', emoji: '🔺' },
          { id: 's8', label: 'Trái tim', emoji: '❤️' },
        ],
      },
      {
        id: 'shapes-3',
        prompt: 'Hãy chọn hình tam giác',
        hint: 'Nghe kỹ tên hình',
        level: 'medium',
        category: 'shapes',
        correct: '🔺',
        items: [
          { id: 's9', label: 'Tam giác', emoji: '🔺' },
          { id: 's10', label: 'Vuông', emoji: '🟦' },
          { id: 's11', label: 'Ngôi sao', emoji: '⭐' },
          { id: 's12', label: 'Tròn', emoji: '⚪' },
        ],
      },
      {
        id: 'shapes-4',
        prompt: 'Hãy chọn ngôi sao',
        hint: 'Bé tìm đúng ngôi sao',
        level: 'medium',
        category: 'shapes',
        correct: '⭐',
        items: [
          { id: 's13', label: 'Ngôi sao', emoji: '⭐' },
          { id: 's14', label: 'Tam giác', emoji: '🔺' },
          { id: 's15', label: 'Tròn', emoji: '⚪' },
          { id: 's16', label: 'Vuông', emoji: '🟦' },
        ],
      },
      {
        id: 'shapes-5',
        prompt: 'Hãy chọn trái tim',
        hint: 'Nghe yêu cầu rồi chọn đúng',
        level: 'hard',
        category: 'shapes',
        correct: '❤️',
        items: [
          { id: 's17', label: 'Trái tim', emoji: '❤️' },
          { id: 's18', label: 'Ngôi sao', emoji: '⭐' },
          { id: 's19', label: 'Tròn', emoji: '⚪' },
          { id: 's20', label: 'Tam giác', emoji: '🔺' },
        ],
      },
      {
        id: 'shapes-6',
        prompt: 'Hãy chọn hình thoi',
        hint: 'Tìm đúng hình được nhắc tới',
        level: 'hard',
        category: 'shapes',
        correct: '🔷',
        items: [
          { id: 's21', label: 'Hình thoi', emoji: '🔷' },
          { id: 's22', label: 'Vuông', emoji: '🟦' },
          { id: 's23', label: 'Tròn', emoji: '⚪' },
          { id: 's24', label: 'Ngôi sao', emoji: '⭐' },
        ],
      },
    ],
  },

  objects: {
    label: 'Đồ vật',
    icon: '🧸',
    questions: [
      {
        id: 'objects-1',
        prompt: 'Hãy chọn cái bàn',
        hint: 'Nghe tên đồ vật rồi chọn đúng',
        level: 'easy',
        category: 'objects',
        correct: '🪑',
        items: [
          { id: 'o1', label: 'Bàn', emoji: '🪑' },
          { id: 'o2', label: 'Bút', emoji: '🖊️' },
          { id: 'o3', label: 'Cốc', emoji: '🥤' },
          { id: 'o4', label: 'Bóng', emoji: '⚽' },
        ],
      },
      {
        id: 'objects-2',
        prompt: 'Hãy chọn cái bút',
        hint: 'Tìm đúng đồ vật được nhắc tới',
        level: 'easy',
        category: 'objects',
        correct: '🖊️',
        items: [
          { id: 'o5', label: 'Bút', emoji: '🖊️' },
          { id: 'o6', label: 'Cặp', emoji: '🎒' },
          { id: 'o7', label: 'Ghế', emoji: '🪑' },
          { id: 'o8', label: 'Cốc', emoji: '🥤' },
        ],
      },
      {
        id: 'objects-3',
        prompt: 'Hãy chọn cái cặp',
        hint: 'Nghe kỹ tên đồ vật',
        level: 'medium',
        category: 'objects',
        correct: '🎒',
        items: [
          { id: 'o9', label: 'Cặp', emoji: '🎒' },
          { id: 'o10', label: 'Bóng', emoji: '⚽' },
          { id: 'o11', label: 'Bàn', emoji: '🪑' },
          { id: 'o12', label: 'Đồng hồ', emoji: '⏰' },
        ],
      },
      {
        id: 'objects-4',
        prompt: 'Hãy chọn cái đồng hồ',
        hint: 'Bé tìm đúng đồng hồ',
        level: 'medium',
        category: 'objects',
        correct: '⏰',
        items: [
          { id: 'o13', label: 'Đồng hồ', emoji: '⏰' },
          { id: 'o14', label: 'Bút', emoji: '🖊️' },
          { id: 'o15', label: 'Cặp', emoji: '🎒' },
          { id: 'o16', label: 'Ly', emoji: '🥛' },
        ],
      },
      {
        id: 'objects-5',
        prompt: 'Hãy chọn cái kéo',
        hint: 'Chú ý nghe kỹ yêu cầu',
        level: 'hard',
        category: 'objects',
        correct: '✂️',
        items: [
          { id: 'o17', label: 'Kéo', emoji: '✂️' },
          { id: 'o18', label: 'Thước', emoji: '📏' },
          { id: 'o19', label: 'Bút', emoji: '🖊️' },
          { id: 'o20', label: 'Túi', emoji: '👜' },
        ],
      },
      {
        id: 'objects-6',
        prompt: 'Hãy chọn cái thước',
        hint: 'Bé nghe và chọn đúng',
        level: 'hard',
        category: 'objects',
        correct: '📏',
        items: [
          { id: 'o21', label: 'Thước', emoji: '📏' },
          { id: 'o22', label: 'Kéo', emoji: '✂️' },
          { id: 'o23', label: 'Sách', emoji: '📘' },
          { id: 'o24', label: 'Cặp', emoji: '🎒' },
        ],
      },
    ],
  },

  mixed: {
    label: 'Tổng hợp',
    icon: '✨',
    questions: [
      {
        id: 'mixed-1',
        prompt: 'Hãy chọn con mèo',
        hint: 'Có nhiều nhóm hình khác nhau',
        level: 'easy',
        category: 'mixed',
        correct: '🐱',
        items: [
          { id: 'm1', label: 'Mèo', emoji: '🐱' },
          { id: 'm2', label: 'Đỏ', emoji: '🟥' },
          { id: 'm3', label: 'Tròn', emoji: '⚪' },
          { id: 'm4', label: 'Bút', emoji: '🖊️' },
        ],
      },
      {
        id: 'mixed-2',
        prompt: 'Hãy chọn màu vàng',
        hint: 'Nghe kỹ yêu cầu',
        level: 'medium',
        category: 'mixed',
        correct: '🟨',
        items: [
          { id: 'm5', label: 'Vàng', emoji: '🟨' },
          { id: 'm6', label: 'Chó', emoji: '🐶' },
          { id: 'm7', label: 'Ngôi sao', emoji: '⭐' },
          { id: 'm8', label: 'Cặp', emoji: '🎒' },
        ],
      },
      {
        id: 'mixed-3',
        prompt: 'Hãy chọn hình tam giác',
        hint: 'Có hình, màu, con vật và đồ vật',
        level: 'medium',
        category: 'mixed',
        correct: '🔺',
        items: [
          { id: 'm9', label: 'Tam giác', emoji: '🔺' },
          { id: 'm10', label: 'Voi', emoji: '🐘' },
          { id: 'm11', label: 'Xanh', emoji: '🟦' },
          { id: 'm12', label: 'Đồng hồ', emoji: '⏰' },
        ],
      },
      {
        id: 'mixed-4',
        prompt: 'Hãy chọn cái kéo',
        hint: 'Nghe rồi chọn đúng biểu tượng',
        level: 'hard',
        category: 'mixed',
        correct: '✂️',
        items: [
          { id: 'm13', label: 'Kéo', emoji: '✂️' },
          { id: 'm14', label: 'Sư tử', emoji: '🦁' },
          { id: 'm15', label: 'Vuông', emoji: '🟦' },
          { id: 'm16', label: 'Đỏ', emoji: '🟥' },
        ],
      },
      {
        id: 'mixed-5',
        prompt: 'Hãy chọn con vịt',
        hint: 'Bé chú ý nghe tên đúng',
        level: 'hard',
        category: 'mixed',
        correct: '🦆',
        items: [
          { id: 'm17', label: 'Vịt', emoji: '🦆' },
          { id: 'm18', label: 'Tròn', emoji: '⚪' },
          { id: 'm19', label: 'Bàn', emoji: '🪑' },
          { id: 'm20', label: 'Xanh lá', emoji: '🟩' },
        ],
      },
      {
        id: 'mixed-6',
        prompt: 'Hãy chọn ngôi sao',
        hint: 'Nghe kỹ rồi chọn thật nhanh',
        level: 'hard',
        category: 'mixed',
        correct: '⭐',
        items: [
          { id: 'm21', label: 'Ngôi sao', emoji: '⭐' },
          { id: 'm22', label: 'Mèo', emoji: '🐱' },
          { id: 'm23', label: 'Thước', emoji: '📏' },
          { id: 'm24', label: 'Tím', emoji: '🟪' },
        ],
      },
    ],
  },
};
