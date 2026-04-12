export type GameLevel = 'easy' | 'medium' | 'hard';

export type MissingNumberQuestion = {
  id: number;
  prompt: string;
  sequence: (number | string)[];
  correct: number;
  options: number[];
  level: GameLevel;
};

export type MissingNumberCategory = {
  label: string;
  icon: string;
  questions: MissingNumberQuestion[];
};

export const missingNumberData: Record<string, MissingNumberCategory> = {
  countingUp: {
    label: 'Đếm tăng',
    icon: '🔢',
    questions: [
      {
        id: 1,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [1, 2, '?', 4],
        correct: 3,
        options: [3, 5, 2, 6],
        level: 'easy',
      },
      {
        id: 2,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [2, '?', 4, 5],
        correct: 3,
        options: [1, 3, 6, 4],
        level: 'easy',
      },
      {
        id: 3,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: ['?', 6, 7, 8],
        correct: 5,
        options: [4, 5, 6, 7],
        level: 'easy',
      },
      {
        id: 4,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [7, 8, 9, '?'],
        correct: 10,
        options: [10, 11, 8, 9],
        level: 'easy',
      },
      {
        id: 5,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [10, '?', 12, 13],
        correct: 11,
        options: [9, 10, 11, 14],
        level: 'medium',
      },
      {
        id: 6,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [14, 15, '?', 17],
        correct: 16,
        options: [15, 16, 17, 18],
        level: 'medium',
      },
      {
        id: 7,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: [21, 22, '?', 24],
        correct: 23,
        options: [23, 25, 20, 22],
        level: 'hard',
      },
      {
        id: 8,
        prompt: 'Chọn số còn thiếu trong dãy tăng',
        sequence: ['?', 31, 32, 33],
        correct: 30,
        options: [29, 30, 31, 34],
        level: 'hard',
      },
    ],
  },

  countingDown: {
    label: 'Đếm giảm',
    icon: '⬇️',
    questions: [
      {
        id: 101,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: [10, 9, '?', 7],
        correct: 8,
        options: [8, 6, 9, 10],
        level: 'easy',
      },
      {
        id: 102,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: [7, '?', 5, 4],
        correct: 6,
        options: [6, 3, 5, 7],
        level: 'easy',
      },
      {
        id: 103,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: ['?', 12, 11, 10],
        correct: 13,
        options: [14, 13, 11, 12],
        level: 'medium',
      },
      {
        id: 104,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: [5, 4, 3, '?'],
        correct: 2,
        options: [2, 1, 3, 4],
        level: 'easy',
      },
      {
        id: 105,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: [20, '?', 18, 17],
        correct: 19,
        options: [19, 16, 18, 20],
        level: 'medium',
      },
      {
        id: 106,
        prompt: 'Chọn số còn thiếu trong dãy giảm',
        sequence: [30, 29, '?', 27],
        correct: 28,
        options: [28, 26, 29, 30],
        level: 'hard',
      },
    ],
  },

  plusTwo: {
    label: 'Cộng 2',
    icon: '➕',
    questions: [
      {
        id: 201,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: [2, 4, '?', 8],
        correct: 6,
        options: [6, 5, 7, 4],
        level: 'easy',
      },
      {
        id: 202,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: [6, '?', 10, 12],
        correct: 8,
        options: [7, 8, 9, 10],
        level: 'medium',
      },
      {
        id: 203,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: ['?', 5, 7, 9],
        correct: 3,
        options: [2, 3, 4, 5],
        level: 'easy',
      },
      {
        id: 204,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: [1, 3, 5, '?'],
        correct: 7,
        options: [6, 7, 8, 9],
        level: 'easy',
      },
      {
        id: 205,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: [10, 12, '?', 16],
        correct: 14,
        options: [12, 13, 14, 15],
        level: 'medium',
      },
      {
        id: 206,
        prompt: 'Chọn số còn thiếu theo quy luật cộng 2',
        sequence: [15, '?', 19, 21],
        correct: 17,
        options: [16, 17, 18, 19],
        level: 'hard',
      },
    ],
  },

  beforeAfter: {
    label: 'Trước và sau',
    icon: '🧩',
    questions: [
      {
        id: 301,
        prompt: 'Số nào đứng giữa 3 và 5?',
        sequence: [3, '?', 5],
        correct: 4,
        options: [4, 3, 5, 6],
        level: 'easy',
      },
      {
        id: 302,
        prompt: 'Số nào đứng trước 8?',
        sequence: ['?', 8, 9],
        correct: 7,
        options: [6, 7, 8, 9],
        level: 'easy',
      },
      {
        id: 303,
        prompt: 'Số nào đứng sau 11?',
        sequence: [11, '?', 13],
        correct: 12,
        options: [10, 11, 12, 13],
        level: 'medium',
      },
      {
        id: 304,
        prompt: 'Số nào đứng giữa 14 và 16?',
        sequence: [14, '?', 16],
        correct: 15,
        options: [13, 14, 15, 16],
        level: 'medium',
      },
      {
        id: 305,
        prompt: 'Số nào đứng sau 19?',
        sequence: [19, '?', 21],
        correct: 20,
        options: [18, 19, 20, 21],
        level: 'hard',
      },
      {
        id: 306,
        prompt: 'Số nào đứng trước 25?',
        sequence: ['?', 25, 26],
        correct: 24,
        options: [23, 24, 25, 26],
        level: 'hard',
      },
    ],
  },
};

export const missingNumberCategories = Object.entries(missingNumberData).map(
  ([key, value]) => ({
    key,
    label: value.label,
    icon: value.icon,
    total: value.questions.length,
  })
);
