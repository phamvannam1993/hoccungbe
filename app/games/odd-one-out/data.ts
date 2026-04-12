export type OddOneOutCategory =
  | 'animals'
  | 'fruits'
  | 'vehicles'
  | 'colors'
  | 'shapes';

export type OddOneOutLevel = 'easy' | 'medium' | 'hard';

export type OddOneOutQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: OddOneOutLevel;
  category: OddOneOutCategory;
  correct: string;
  items: {
    id: string;
    label: string;
    emoji: string;
  }[];
};

export const oddOneOutCategories = [
  { key: 'animals', label: 'Con vật', icon: '🐻', total: 6 },
  { key: 'fruits', label: 'Trái cây', icon: '🍎', total: 6 },
  { key: 'vehicles', label: 'Phương tiện', icon: '🚗', total: 6 },
  { key: 'colors', label: 'Màu sắc', icon: '🌈', total: 6 },
  { key: 'shapes', label: 'Hình dạng', icon: '🔺', total: 6 },
] as const;

export const oddOneOutData: Record<
  OddOneOutCategory,
  {
    label: string;
    icon: string;
    questions: OddOneOutQuestion[];
  }
> = {
  animals: {
    label: 'Con vật',
    icon: '🐻',
    questions: [
      {
        id: 'animals-1',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 con vật và 1 đồ vật',
        level: 'easy',
        category: 'animals',
        correct: '🍎',
        items: [
          { id: 'a1', label: 'Mèo', emoji: '🐱' },
          { id: 'a2', label: 'Chó', emoji: '🐶' },
          { id: 'a3', label: 'Gấu', emoji: '🐻' },
          { id: 'a4', label: 'Táo', emoji: '🍎' },
        ],
      },
      {
        id: 'animals-2',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 con vật biết bơi và 1 con vật biết bay',
        level: 'medium',
        category: 'animals',
        correct: '🐦',
        items: [
          { id: 'a5', label: 'Cá', emoji: '🐟' },
          { id: 'a6', label: 'Vịt', emoji: '🦆' },
          { id: 'a7', label: 'Ếch', emoji: '🐸' },
          { id: 'a8', label: 'Chim', emoji: '🐦' },
        ],
      },
      {
        id: 'animals-3',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 thú trên cạn và 1 loài dưới nước',
        level: 'easy',
        category: 'animals',
        correct: '🐠',
        items: [
          { id: 'a9', label: 'Ngựa', emoji: '🐴' },
          { id: 'a10', label: 'Bò', emoji: '🐮' },
          { id: 'a11', label: 'Thỏ', emoji: '🐰' },
          { id: 'a12', label: 'Cá', emoji: '🐠' },
        ],
      },
      {
        id: 'animals-4',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 con vật nuôi và 1 con vật hoang dã',
        level: 'medium',
        category: 'animals',
        correct: '🦁',
        items: [
          { id: 'a13', label: 'Chó', emoji: '🐶' },
          { id: 'a14', label: 'Mèo', emoji: '🐱' },
          { id: 'a15', label: 'Thỏ', emoji: '🐰' },
          { id: 'a16', label: 'Sư tử', emoji: '🦁' },
        ],
      },
      {
        id: 'animals-5',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 loài có 4 chân và 1 loài có 2 chân',
        level: 'hard',
        category: 'animals',
        correct: '🐔',
        items: [
          { id: 'a17', label: 'Voi', emoji: '🐘' },
          { id: 'a18', label: 'Hổ', emoji: '🐯' },
          { id: 'a19', label: 'Gấu', emoji: '🐻' },
          { id: 'a20', label: 'Gà', emoji: '🐔' },
        ],
      },
      {
        id: 'animals-6',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 con vật và 1 loại phương tiện',
        level: 'hard',
        category: 'animals',
        correct: '🚲',
        items: [
          { id: 'a21', label: 'Khỉ', emoji: '🐵' },
          { id: 'a22', label: 'Hươu', emoji: '🦌' },
          { id: 'a23', label: 'Gấu trúc', emoji: '🐼' },
          { id: 'a24', label: 'Xe đạp', emoji: '🚲' },
        ],
      },
    ],
  },

  fruits: {
    label: 'Trái cây',
    icon: '🍎',
    questions: [
      {
        id: 'fruits-1',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 loại trái cây và 1 con vật',
        level: 'easy',
        category: 'fruits',
        correct: '🐶',
        items: [
          { id: 'f1', label: 'Táo', emoji: '🍎' },
          { id: 'f2', label: 'Chuối', emoji: '🍌' },
          { id: 'f3', label: 'Cam', emoji: '🍊' },
          { id: 'f4', label: 'Chó', emoji: '🐶' },
        ],
      },
      {
        id: 'fruits-2',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 quả và 1 đồ uống',
        level: 'medium',
        category: 'fruits',
        correct: '🥛',
        items: [
          { id: 'f5', label: 'Nho', emoji: '🍇' },
          { id: 'f6', label: 'Dâu', emoji: '🍓' },
          { id: 'f7', label: 'Xoài', emoji: '🥭' },
          { id: 'f8', label: 'Sữa', emoji: '🥛' },
        ],
      },
      {
        id: 'fruits-3',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 trái cây có vỏ và 1 loại rau',
        level: 'medium',
        category: 'fruits',
        correct: '🥕',
        items: [
          { id: 'f9', label: 'Lê', emoji: '🍐' },
          { id: 'f10', label: 'Dứa', emoji: '🍍' },
          { id: 'f11', label: 'Chanh', emoji: '🍋' },
          { id: 'f12', label: 'Cà rốt', emoji: '🥕' },
        ],
      },
      {
        id: 'fruits-4',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 trái cây và 1 phương tiện',
        level: 'easy',
        category: 'fruits',
        correct: '🚗',
        items: [
          { id: 'f13', label: 'Dưa hấu', emoji: '🍉' },
          { id: 'f14', label: 'Anh đào', emoji: '🍒' },
          { id: 'f15', label: 'Kiwi', emoji: '🥝' },
          { id: 'f16', label: 'Ô tô', emoji: '🚗' },
        ],
      },
      {
        id: 'fruits-5',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 loại quả và 1 đồ vật học tập',
        level: 'hard',
        category: 'fruits',
        correct: '✏️',
        items: [
          { id: 'f17', label: 'Táo', emoji: '🍎' },
          { id: 'f18', label: 'Cam', emoji: '🍊' },
          { id: 'f19', label: 'Chuối', emoji: '🍌' },
          { id: 'f20', label: 'Bút chì', emoji: '✏️' },
        ],
      },
      {
        id: 'fruits-6',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 trái cây nhỏ và 1 vật không phải trái cây',
        level: 'hard',
        category: 'fruits',
        correct: '⚽',
        items: [
          { id: 'f21', label: 'Nho', emoji: '🍇' },
          { id: 'f22', label: 'Dâu', emoji: '🍓' },
          { id: 'f23', label: 'Anh đào', emoji: '🍒' },
          { id: 'f24', label: 'Bóng', emoji: '⚽' },
        ],
      },
    ],
  },

  vehicles: {
    label: 'Phương tiện',
    icon: '🚗',
    questions: [
      {
        id: 'vehicles-1',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện và 1 con vật',
        level: 'easy',
        category: 'vehicles',
        correct: '🐱',
        items: [
          { id: 'v1', label: 'Ô tô', emoji: '🚗' },
          { id: 'v2', label: 'Xe buýt', emoji: '🚌' },
          { id: 'v3', label: 'Xe đạp', emoji: '🚲' },
          { id: 'v4', label: 'Mèo', emoji: '🐱' },
        ],
      },
      {
        id: 'vehicles-2',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện đường bộ và 1 phương tiện bay',
        level: 'medium',
        category: 'vehicles',
        correct: '✈️',
        items: [
          { id: 'v5', label: 'Xe tải', emoji: '🚚' },
          { id: 'v6', label: 'Xe máy', emoji: '🏍️' },
          { id: 'v7', label: 'Xe hơi', emoji: '🚗' },
          { id: 'v8', label: 'Máy bay', emoji: '✈️' },
        ],
      },
      {
        id: 'vehicles-3',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện và 1 loại trái cây',
        level: 'easy',
        category: 'vehicles',
        correct: '🍎',
        items: [
          { id: 'v9', label: 'Tàu hỏa', emoji: '🚂' },
          { id: 'v10', label: 'Thuyền', emoji: '⛵' },
          { id: 'v11', label: 'Xe đạp', emoji: '🚲' },
          { id: 'v12', label: 'Táo', emoji: '🍎' },
        ],
      },
      {
        id: 'vehicles-4',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện chở người và 1 đồ vật',
        level: 'medium',
        category: 'vehicles',
        correct: '🪑',
        items: [
          { id: 'v13', label: 'Taxi', emoji: '🚕' },
          { id: 'v14', label: 'Xe buýt', emoji: '🚌' },
          { id: 'v15', label: 'Tàu điện', emoji: '🚋' },
          { id: 'v16', label: 'Ghế', emoji: '🪑' },
        ],
      },
      {
        id: 'vehicles-5',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện nhỏ và 1 loài động vật',
        level: 'hard',
        category: 'vehicles',
        correct: '🐘',
        items: [
          { id: 'v17', label: 'Xe đạp', emoji: '🚲' },
          { id: 'v18', label: 'Xe máy', emoji: '🏍️' },
          { id: 'v19', label: 'Xe tay ga', emoji: '🛵' },
          { id: 'v20', label: 'Voi', emoji: '🐘' },
        ],
      },
      {
        id: 'vehicles-6',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 phương tiện di chuyển và 1 loại thức ăn',
        level: 'hard',
        category: 'vehicles',
        correct: '🍞',
        items: [
          { id: 'v21', label: 'Máy bay', emoji: '✈️' },
          { id: 'v22', label: 'Thuyền', emoji: '🚤' },
          { id: 'v23', label: 'Ô tô', emoji: '🚗' },
          { id: 'v24', label: 'Bánh mì', emoji: '🍞' },
        ],
      },
    ],
  },

  colors: {
    label: 'Màu sắc',
    icon: '🌈',
    questions: [
      {
        id: 'colors-1',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình màu đỏ và 1 hình màu xanh',
        level: 'easy',
        category: 'colors',
        correct: '🟦',
        items: [
          { id: 'c1', label: 'Đỏ 1', emoji: '🟥' },
          { id: 'c2', label: 'Đỏ 2', emoji: '🔴' },
          { id: 'c3', label: 'Đỏ 3', emoji: '❤️' },
          { id: 'c4', label: 'Xanh', emoji: '🟦' },
        ],
      },
      {
        id: 'colors-2',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 màu nóng và 1 màu lạnh',
        level: 'medium',
        category: 'colors',
        correct: '🟦',
        items: [
          { id: 'c5', label: 'Đỏ', emoji: '🟥' },
          { id: 'c6', label: 'Cam', emoji: '🟧' },
          { id: 'c7', label: 'Vàng', emoji: '🟨' },
          { id: 'c8', label: 'Xanh', emoji: '🟦' },
        ],
      },
      {
        id: 'colors-3',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 màu gần giống nhau và 1 màu khác',
        level: 'easy',
        category: 'colors',
        correct: '🟩',
        items: [
          { id: 'c9', label: 'Hồng', emoji: '💗' },
          { id: 'c10', label: 'Đỏ', emoji: '❤️' },
          { id: 'c11', label: 'Cam đỏ', emoji: '🧡' },
          { id: 'c12', label: 'Xanh lá', emoji: '🟩' },
        ],
      },
      {
        id: 'colors-4',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 màu tối và 1 màu sáng',
        level: 'medium',
        category: 'colors',
        correct: '⬜',
        items: [
          { id: 'c13', label: 'Đen', emoji: '⬛' },
          { id: 'c14', label: 'Xám đậm', emoji: '◼️' },
          { id: 'c15', label: 'Nâu', emoji: '🟫' },
          { id: 'c16', label: 'Trắng', emoji: '⬜' },
        ],
      },
      {
        id: 'colors-5',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 màu lạnh và 1 màu nóng',
        level: 'hard',
        category: 'colors',
        correct: '🟥',
        items: [
          { id: 'c17', label: 'Xanh dương', emoji: '🟦' },
          { id: 'c18', label: 'Xanh lá', emoji: '🟩' },
          { id: 'c19', label: 'Tím', emoji: '🟪' },
          { id: 'c20', label: 'Đỏ', emoji: '🟥' },
        ],
      },
      {
        id: 'colors-6',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 màu thuộc nhóm sáng và 1 màu tối',
        level: 'hard',
        category: 'colors',
        correct: '⬛',
        items: [
          { id: 'c21', label: 'Vàng', emoji: '🟨' },
          { id: 'c22', label: 'Trắng', emoji: '⬜' },
          { id: 'c23', label: 'Hồng', emoji: '💗' },
          { id: 'c24', label: 'Đen', emoji: '⬛' },
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
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình tròn và 1 hình vuông',
        level: 'easy',
        category: 'shapes',
        correct: '🟦',
        items: [
          { id: 's1', label: 'Tròn 1', emoji: '⚪' },
          { id: 's2', label: 'Tròn 2', emoji: '🔴' },
          { id: 's3', label: 'Tròn 3', emoji: '🟠' },
          { id: 's4', label: 'Vuông', emoji: '🟦' },
        ],
      },
      {
        id: 'shapes-2',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình góc cạnh và 1 hình cong',
        level: 'medium',
        category: 'shapes',
        correct: '⚪',
        items: [
          { id: 's5', label: 'Tam giác', emoji: '🔺' },
          { id: 's6', label: 'Vuông', emoji: '🟦' },
          { id: 's7', label: 'Hình thoi', emoji: '🔷' },
          { id: 's8', label: 'Tròn', emoji: '⚪' },
        ],
      },
      {
        id: 'shapes-3',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình tam giác và 1 hình tròn',
        level: 'easy',
        category: 'shapes',
        correct: '⚪',
        items: [
          { id: 's9', label: 'Tam giác đỏ', emoji: '🔺' },
          { id: 's10', label: 'Tam giác nhỏ', emoji: '🔻' },
          { id: 's11', label: 'Tam giác khác', emoji: '⏫' },
          { id: 's12', label: 'Tròn', emoji: '⚪' },
        ],
      },
      {
        id: 'shapes-4',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình 4 cạnh và 1 hình 3 cạnh',
        level: 'medium',
        category: 'shapes',
        correct: '🔺',
        items: [
          { id: 's13', label: 'Vuông', emoji: '🟦' },
          { id: 's14', label: 'Chữ nhật', emoji: '▭' },
          { id: 's15', label: 'Hình thoi', emoji: '🔷' },
          { id: 's16', label: 'Tam giác', emoji: '🔺' },
        ],
      },
      {
        id: 'shapes-5',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình đơn giản và 1 hình ngôi sao',
        level: 'hard',
        category: 'shapes',
        correct: '⭐',
        items: [
          { id: 's17', label: 'Tròn', emoji: '⚪' },
          { id: 's18', label: 'Vuông', emoji: '🟦' },
          { id: 's19', label: 'Tam giác', emoji: '🔺' },
          { id: 's20', label: 'Ngôi sao', emoji: '⭐' },
        ],
      },
      {
        id: 'shapes-6',
        prompt: 'Hãy chọn hình khác nhóm',
        hint: 'Có 3 hình kín và 1 dấu cộng',
        level: 'hard',
        category: 'shapes',
        correct: '➕',
        items: [
          { id: 's21', label: 'Tròn', emoji: '⚪' },
          { id: 's22', label: 'Vuông', emoji: '🟦' },
          { id: 's23', label: 'Tam giác', emoji: '🔺' },
          { id: 's24', label: 'Dấu cộng', emoji: '➕' },
        ],
      },
    ],
  },
};
