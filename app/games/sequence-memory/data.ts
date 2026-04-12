export type SequenceMemoryCategory =
  | 'animals'
  | 'fruits'
  | 'shapes'
  | 'objects'
  | 'mixed';

export type SequenceMemoryLevel = 'easy' | 'medium' | 'hard';

export type SequenceMemoryQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: SequenceMemoryLevel;
  category: SequenceMemoryCategory;
  sequence: string[];
  options: string[];
};

export const sequenceMemoryCategories = [
  { key: 'animals', label: 'Con vật', icon: '🐻', total: 6 },
  { key: 'fruits', label: 'Trái cây', icon: '🍎', total: 6 },
  { key: 'shapes', label: 'Hình dạng', icon: '🔺', total: 6 },
  { key: 'objects', label: 'Đồ vật', icon: '🧸', total: 6 },
  { key: 'mixed', label: 'Tổng hợp', icon: '✨', total: 6 },
] as const;

export const sequenceMemoryData: Record<
  SequenceMemoryCategory,
  {
    label: string;
    icon: string;
    questions: SequenceMemoryQuestion[];
  }
> = {
  animals: {
    label: 'Con vật',
    icon: '🐻',
    questions: [
      {
        id: 'animals-1',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Nhìn kỹ rồi bấm lại đúng thứ tự',
        level: 'easy',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐰'],
        options: ['🐶', '🐱', '🐰', '🐻'],
      },
      {
        id: 'animals-2',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này có 3 con vật',
        level: 'easy',
        category: 'animals',
        sequence: ['🐻', '🐶', '🐱'],
        options: ['🐶', '🐱', '🐰', '🐻'],
      },
      {
        id: 'animals-3',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi dài hơn một chút',
        level: 'medium',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐰', '🐻'],
        options: ['🐶', '🐱', '🐰', '🐻'],
      },
      {
        id: 'animals-4',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Hãy nhớ thật kỹ vị trí từng con vật',
        level: 'medium',
        category: 'animals',
        sequence: ['🐵', '🐶', '🐱', '🐰'],
        options: ['🐵', '🐶', '🐱', '🐰'],
      },
      {
        id: 'animals-5',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này dài 5 biểu tượng',
        level: 'hard',
        category: 'animals',
        sequence: ['🐶', '🐱', '🐰', '🐻', '🐵'],
        options: ['🐶', '🐱', '🐰', '🐻', '🐵'],
      },
      {
        id: 'animals-6',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Quan sát thật kỹ trước khi bấm',
        level: 'hard',
        category: 'animals',
        sequence: ['🦁', '🐯', '🐻', '🐵', '🐶'],
        options: ['🦁', '🐯', '🐻', '🐵', '🐶'],
      },
    ],
  },

  fruits: {
    label: 'Trái cây',
    icon: '🍎',
    questions: [
      {
        id: 'fruits-1',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Nhìn các loại quả rồi bấm lại',
        level: 'easy',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍊'],
        options: ['🍎', '🍌', '🍊', '🍇'],
      },
      {
        id: 'fruits-2',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi có 3 loại quả',
        level: 'easy',
        category: 'fruits',
        sequence: ['🍇', '🍎', '🍌'],
        options: ['🍇', '🍎', '🍌', '🍉'],
      },
      {
        id: 'fruits-3',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Nhớ đúng từng quả theo thứ tự',
        level: 'medium',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍊', '🍇'],
        options: ['🍎', '🍌', '🍊', '🍇'],
      },
      {
        id: 'fruits-4',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Hãy bấm lại giống hệt lúc hiện ra',
        level: 'medium',
        category: 'fruits',
        sequence: ['🍉', '🍓', '🍎', '🍍'],
        options: ['🍉', '🍓', '🍎', '🍍'],
      },
      {
        id: 'fruits-5',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này dài 5 biểu tượng',
        level: 'hard',
        category: 'fruits',
        sequence: ['🍎', '🍌', '🍊', '🍇', '🍉'],
        options: ['🍎', '🍌', '🍊', '🍇', '🍉'],
      },
      {
        id: 'fruits-6',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Quan sát kỹ vì chuỗi khá dài',
        level: 'hard',
        category: 'fruits',
        sequence: ['🍓', '🍍', '🍋', '🍎', '🍒'],
        options: ['🍓', '🍍', '🍋', '🍎', '🍒'],
      },
    ],
  },

  shapes: {
    label: 'Hình dạng',
    icon: '🔺',
    questions: [
      {
        id: 'shapes-1',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Nhìn kỹ các hình rồi bấm lại',
        level: 'easy',
        category: 'shapes',
        sequence: ['⚪', '🔺', '🟦'],
        options: ['⚪', '🔺', '🟦', '⭐'],
      },
      {
        id: 'shapes-2',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Có 3 hình trong chuỗi',
        level: 'easy',
        category: 'shapes',
        sequence: ['⭐', '⚪', '🔺'],
        options: ['⭐', '⚪', '🔺', '🟩'],
      },
      {
        id: 'shapes-3',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi dài hơn và dễ nhầm',
        level: 'medium',
        category: 'shapes',
        sequence: ['⚪', '🔺', '🟦', '⭐'],
        options: ['⚪', '🔺', '🟦', '⭐'],
      },
      {
        id: 'shapes-4',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Hãy bấm lại đúng như lúc đầu',
        level: 'medium',
        category: 'shapes',
        sequence: ['🔷', '⭐', '⚪', '🔺'],
        options: ['🔷', '⭐', '⚪', '🔺'],
      },
      {
        id: 'shapes-5',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này có 5 hình',
        level: 'hard',
        category: 'shapes',
        sequence: ['⚪', '🔺', '🟦', '⭐', '🔷'],
        options: ['⚪', '🔺', '🟦', '⭐', '🔷'],
      },
      {
        id: 'shapes-6',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Quan sát kỹ từng hình một',
        level: 'hard',
        category: 'shapes',
        sequence: ['⭐', '🔷', '⚪', '🟦', '🔺'],
        options: ['⭐', '🔷', '⚪', '🟦', '🔺'],
      },
    ],
  },

  objects: {
    label: 'Đồ vật',
    icon: '🧸',
    questions: [
      {
        id: 'objects-1',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Nhìn đồ vật rồi bấm lại',
        level: 'easy',
        category: 'objects',
        sequence: ['⚽', '🎒', '🖊️'],
        options: ['⚽', '🎒', '🖊️', '📘'],
      },
      {
        id: 'objects-2',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi có 3 đồ vật',
        level: 'easy',
        category: 'objects',
        sequence: ['⏰', '✂️', '📘'],
        options: ['⏰', '✂️', '📘', '🧸'],
      },
      {
        id: 'objects-3',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này dài hơn',
        level: 'medium',
        category: 'objects',
        sequence: ['⚽', '🎒', '🖊️', '📘'],
        options: ['⚽', '🎒', '🖊️', '📘'],
      },
      {
        id: 'objects-4',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Hãy ghi nhớ thật kỹ',
        level: 'medium',
        category: 'objects',
        sequence: ['✂️', '📏', '🎒', '⏰'],
        options: ['✂️', '📏', '🎒', '⏰'],
      },
      {
        id: 'objects-5',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này có 5 đồ vật',
        level: 'hard',
        category: 'objects',
        sequence: ['⚽', '🎒', '🖊️', '📘', '⏰'],
        options: ['⚽', '🎒', '🖊️', '📘', '⏰'],
      },
      {
        id: 'objects-6',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Bé nhìn kỹ rồi bấm lại đúng thứ tự',
        level: 'hard',
        category: 'objects',
        sequence: ['✂️', '📏', '⏰', '📘', '🧸'],
        options: ['✂️', '📏', '⏰', '📘', '🧸'],
      },
    ],
  },

  mixed: {
    label: 'Tổng hợp',
    icon: '✨',
    questions: [
      {
        id: 'mixed-1',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi có nhiều loại biểu tượng khác nhau',
        level: 'easy',
        category: 'mixed',
        sequence: ['🐶', '🍎', '⚽'],
        options: ['🐶', '🍎', '⚽', '⭐'],
      },
      {
        id: 'mixed-2',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Hãy nhớ đúng thứ tự từng hình',
        level: 'easy',
        category: 'mixed',
        sequence: ['😊', '🎒', '🍌'],
        options: ['😊', '🎒', '🍌', '🐱'],
      },
      {
        id: 'mixed-3',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này gồm 4 biểu tượng',
        level: 'medium',
        category: 'mixed',
        sequence: ['🐱', '🍎', '🔺', '⚽'],
        options: ['🐱', '🍎', '🔺', '⚽'],
      },
      {
        id: 'mixed-4',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Đừng bấm vội, hãy nhớ thật kỹ',
        level: 'medium',
        category: 'mixed',
        sequence: ['😊', '🐶', '📘', '🍓'],
        options: ['😊', '🐶', '📘', '🍓'],
      },
      {
        id: 'mixed-5',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Chuỗi này có 5 biểu tượng khác nhau',
        level: 'hard',
        category: 'mixed',
        sequence: ['🐶', '🍎', '🔺', '⚽', '😊'],
        options: ['🐶', '🍎', '🔺', '⚽', '😊'],
      },
      {
        id: 'mixed-6',
        prompt: 'Hãy nhớ thứ tự xuất hiện',
        hint: 'Quan sát kỹ để không nhầm thứ tự',
        level: 'hard',
        category: 'mixed',
        sequence: ['📘', '🐱', '🍌', '⭐', '⏰'],
        options: ['📘', '🐱', '🍌', '⭐', '⏰'],
      },
    ],
  },
};
