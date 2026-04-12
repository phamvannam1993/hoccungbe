export type PatternCategory =
  | 'shapes'
  | 'colors'
  | 'animals'
  | 'fruits'
  | 'mixed';

export type PatternLevel = 'easy' | 'medium' | 'hard';

export type PatternQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: PatternLevel;
  category: PatternCategory;
  sequence: string[];
  correct: string;
  options: string[];
};

export const patternCategories = [
  { key: 'shapes', label: 'Hình dạng', icon: '🔺', total: 6 },
  { key: 'colors', label: 'Màu sắc', icon: '🌈', total: 6 },
  { key: 'animals', label: 'Con vật', icon: '🐻', total: 6 },
  { key: 'fruits', label: 'Trái cây', icon: '🍎', total: 6 },
  { key: 'mixed', label: 'Tổng hợp', icon: '✨', total: 6 },
] as const;

export const patternData: Record<
  PatternCategory,
  {
    label: string;
    icon: string;
    questions: PatternQuestion[];
  }
> = {
  shapes: {
    label: 'Hình dạng',
    icon: '🔺',
    questions: [
      {
        id: 'shapes-1',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quy luật lặp lại 2 hình',
        level: 'easy',
        category: 'shapes',
        sequence: ['🔺', '⚪', '🔺', '⚪', '?'],
        correct: '🔺',
        options: ['🔺', '⚪', '🟦', '⭐'],
      },
      {
        id: 'shapes-2',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi đang lặp lại 3 hình',
        level: 'easy',
        category: 'shapes',
        sequence: ['🟦', '🔺', '⚪', '🟦', '🔺', '?'],
        correct: '⚪',
        options: ['⚪', '🟦', '🔺', '🔷'],
      },
      {
        id: 'shapes-3',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Nhìn chuỗi đối xứng',
        level: 'medium',
        category: 'shapes',
        sequence: ['⭐', '🔺', '⭐', '🔺', '?'],
        correct: '⭐',
        options: ['⭐', '🔺', '⚪', '🟩'],
      },
      {
        id: 'shapes-4',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quy luật 4 hình luân phiên',
        level: 'medium',
        category: 'shapes',
        sequence: ['🔺', '🟦', '⚪', '⭐', '🔺', '🟦', '?'],
        correct: '⚪',
        options: ['⚪', '⭐', '🔺', '🟦'],
      },
      {
        id: 'shapes-5',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Hình lặp theo cặp',
        level: 'hard',
        category: 'shapes',
        sequence: ['🔺', '🔺', '⚪', '⚪', '🔺', '🔺', '?'],
        correct: '⚪',
        options: ['⚪', '🔺', '🟦', '⭐'],
      },
      {
        id: 'shapes-6',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi đang đổi theo nhóm 3',
        level: 'hard',
        category: 'shapes',
        sequence: ['⭐', '⭐', '🔺', '⭐', '⭐', '🔺', '?'],
        correct: '⭐',
        options: ['⭐', '🔺', '⚪', '🟩'],
      },
    ],
  },

  colors: {
    label: 'Màu sắc',
    icon: '🌈',
    questions: [
      {
        id: 'colors-1',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Màu đỏ và xanh đang lặp lại',
        level: 'easy',
        category: 'colors',
        sequence: ['🟥', '🟦', '🟥', '🟦', '?'],
        correct: '🟥',
        options: ['🟥', '🟦', '🟨', '🟩'],
      },
      {
        id: 'colors-2',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi 3 màu lặp lại',
        level: 'easy',
        category: 'colors',
        sequence: ['🟨', '🟩', '🟦', '🟨', '🟩', '?'],
        correct: '🟦',
        options: ['🟦', '🟨', '🟩', '🟥'],
      },
      {
        id: 'colors-3',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quan sát màu sáng tối xen kẽ',
        level: 'medium',
        category: 'colors',
        sequence: ['⬜', '⬛', '⬜', '⬛', '?'],
        correct: '⬜',
        options: ['⬜', '⬛', '🟦', '🟥'],
      },
      {
        id: 'colors-4',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quy luật lặp 4 màu',
        level: 'medium',
        category: 'colors',
        sequence: ['🟥', '🟨', '🟩', '🟦', '🟥', '🟨', '?'],
        correct: '🟩',
        options: ['🟩', '🟦', '🟥', '🟨'],
      },
      {
        id: 'colors-5',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Mỗi màu xuất hiện 2 lần',
        level: 'hard',
        category: 'colors',
        sequence: ['🟥', '🟥', '🟦', '🟦', '🟥', '🟥', '?'],
        correct: '🟦',
        options: ['🟦', '🟥', '🟨', '🟩'],
      },
      {
        id: 'colors-6',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Nhìn kỹ màu đổi theo nhóm',
        level: 'hard',
        category: 'colors',
        sequence: ['🟨', '🟩', '🟨', '🟩', '🟨', '?'],
        correct: '🟩',
        options: ['🟩', '🟨', '🟥', '🟦'],
      },
    ],
  },

  animals: {
    label: 'Con vật',
    icon: '🐻',
    questions: [
      {
        id: 'animals-1',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: '2 con vật đang lặp lại',
        level: 'easy',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐶', '🐱', '?'],
        correct: '🐶',
        options: ['🐶', '🐱', '🐰', '🐻'],
      },
      {
        id: 'animals-2',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi 3 con vật lặp lại',
        level: 'easy',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐰', '🐶', '🐱', '?'],
        correct: '🐰',
        options: ['🐰', '🐶', '🐱', '🐻'],
      },
      {
        id: 'animals-3',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Con vật xuất hiện xen kẽ',
        level: 'medium',
        category: 'animals',
        sequence: ['🐻', '🐼', '🐻', '🐼', '?'],
        correct: '🐻',
        options: ['🐻', '🐼', '🐯', '🦁'],
      },
      {
        id: 'animals-4',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quy luật 4 con vật',
        level: 'medium',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐰', '🐻', '🐶', '🐱', '?'],
        correct: '🐰',
        options: ['🐰', '🐻', '🐶', '🐱'],
      },
      {
        id: 'animals-5',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Mỗi con vật đi theo cặp',
        level: 'hard',
        category: 'animals',
        sequence: ['🐶', '🐶', '🐱', '🐱', '🐶', '🐶', '?'],
        correct: '🐱',
        options: ['🐱', '🐶', '🐰', '🐻'],
      },
      {
        id: 'animals-6',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Nhìn kỹ nhóm 3 con vật',
        level: 'hard',
        category: 'animals',
        sequence: ['🐰', '🐰', '🐻', '🐰', '🐰', '🐻', '?'],
        correct: '🐰',
        options: ['🐰', '🐻', '🐼', '🦁'],
      },
    ],
  },

  fruits: {
    label: 'Trái cây',
    icon: '🍎',
    questions: [
      {
        id: 'fruits-1',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: '2 loại quả đang lặp lại',
        level: 'easy',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍎', '🍌', '?'],
        correct: '🍎',
        options: ['🍎', '🍌', '🍊', '🍇'],
      },
      {
        id: 'fruits-2',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi 3 loại quả lặp lại',
        level: 'easy',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍊', '🍎', '🍌', '?'],
        correct: '🍊',
        options: ['🍊', '🍎', '🍌', '🍇'],
      },
      {
        id: 'fruits-3',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quả xuất hiện xen kẽ',
        level: 'medium',
        category: 'fruits',
        sequence: ['🍉', '🍇', '🍉', '🍇', '?'],
        correct: '🍉',
        options: ['🍉', '🍇', '🍓', '🍍'],
      },
      {
        id: 'fruits-4',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quy luật 4 loại quả',
        level: 'medium',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍊', '🍇', '🍎', '🍌', '?'],
        correct: '🍊',
        options: ['🍊', '🍇', '🍎', '🍌'],
      },
      {
        id: 'fruits-5',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Mỗi loại quả lặp 2 lần',
        level: 'hard',
        category: 'fruits',
        sequence: ['🍓', '🍓', '🍍', '🍍', '🍓', '🍓', '?'],
        correct: '🍍',
        options: ['🍍', '🍓', '🍉', '🍇'],
      },
      {
        id: 'fruits-6',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Nhìn kỹ nhóm quả đang lặp',
        level: 'hard',
        category: 'fruits',
        sequence: ['🍎', '🍎', '🍌', '🍎', '🍎', '🍌', '?'],
        correct: '🍎',
        options: ['🍎', '🍌', '🍊', '🍇'],
      },
    ],
  },

  mixed: {
    label: 'Tổng hợp',
    icon: '✨',
    questions: [
      {
        id: 'mixed-1',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Hình và con vật đang xen kẽ',
        level: 'easy',
        category: 'mixed',
        sequence: ['🔺', '🐶', '🔺', '🐶', '?'],
        correct: '🔺',
        options: ['🔺', '🐶', '🍎', '🟦'],
      },
      {
        id: 'mixed-2',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Màu và trái cây đang lặp',
        level: 'medium',
        category: 'mixed',
        sequence: ['🟥', '🍎', '🟥', '🍎', '?'],
        correct: '🟥',
        options: ['🟥', '🍎', '🟦', '🍌'],
      },
      {
        id: 'mixed-3',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Chuỗi 3 biểu tượng lặp lại',
        level: 'medium',
        category: 'mixed',
        sequence: ['⭐', '🐱', '🍌', '⭐', '🐱', '?'],
        correct: '🍌',
        options: ['🍌', '⭐', '🐱', '🟩'],
      },
      {
        id: 'mixed-4',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Có 4 biểu tượng luân phiên',
        level: 'hard',
        category: 'mixed',
        sequence: ['🔺', '🍎', '🐶', '🟦', '🔺', '🍎', '🐶', '?'],
        correct: '🟦',
        options: ['🟦', '🔺', '🍎', '🐶'],
      },
      {
        id: 'mixed-5',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Nhóm 2 biểu tượng lặp theo cặp',
        level: 'hard',
        category: 'mixed',
        sequence: ['🍊', '🍊', '⭐', '⭐', '🍊', '🍊', '?'],
        correct: '⭐',
        options: ['⭐', '🍊', '🔺', '🐰'],
      },
      {
        id: 'mixed-6',
        prompt: 'Hãy chọn hình còn thiếu theo quy luật',
        hint: 'Quan sát quy luật xen kẽ',
        level: 'hard',
        category: 'mixed',
        sequence: ['🐻', '🟨', '🐻', '🟨', '🐻', '?'],
        correct: '🟨',
        options: ['🟨', '🐻', '🟦', '🍎'],
      },
    ],
  },
};
