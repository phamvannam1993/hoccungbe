export type FirstLetterQuestion = {
    id: number;
    prompt: string;
    word: string;
    image: string;
    correct: string;
    options: string[];
  };
  
  export type FirstLetterCategory = {
    label: string;
    icon: string;
    questions: FirstLetterQuestion[];
  };
  
  export const firstLetterData: Record<string, FirstLetterCategory> = {
    animals: {
      label: 'Con vật',
      icon: '🐻',
      questions: [
        {
          id: 1,
          prompt: 'Chữ cái đầu của từ mèo là gì?',
          word: 'mèo',
          image: '🐱',
          correct: 'M',
          options: ['M', 'N', 'B', 'C'],
        },
        {
          id: 2,
          prompt: 'Chữ cái đầu của từ chó là gì?',
          word: 'chó',
          image: '🐶',
          correct: 'C',
          options: ['C', 'D', 'G', 'H'],
        },
        {
          id: 3,
          prompt: 'Chữ cái đầu của từ cá là gì?',
          word: 'cá',
          image: '🐟',
          correct: 'C',
          options: ['C', 'K', 'T', 'P'],
        },
        {
          id: 4,
          prompt: 'Chữ cái đầu của từ voi là gì?',
          word: 'voi',
          image: '🐘',
          correct: 'V',
          options: ['V', 'B', 'W', 'M'],
        },
        {
          id: 5,
          prompt: 'Chữ cái đầu của từ thỏ là gì?',
          word: 'thỏ',
          image: '🐰',
          correct: 'T',
          options: ['T', 'Th', 'H', 'L'],
        },
        {
          id: 6,
          prompt: 'Chữ cái đầu của từ gấu là gì?',
          word: 'gấu',
          image: '🐻',
          correct: 'G',
          options: ['G', 'C', 'Q', 'D'],
        },
      ],
    },
  
    fruits: {
      label: 'Trái cây',
      icon: '🍎',
      questions: [
        {
          id: 101,
          prompt: 'Chữ cái đầu của từ táo là gì?',
          word: 'táo',
          image: '🍎',
          correct: 'T',
          options: ['T', 'Tt', 'A', 'B'],
        },
        {
          id: 102,
          prompt: 'Chữ cái đầu của từ cam là gì?',
          word: 'cam',
          image: '🍊',
          correct: 'C',
          options: ['C', 'K', 'O', 'Q'],
        },
        {
          id: 103,
          prompt: 'Chữ cái đầu của từ chuối là gì?',
          word: 'chuối',
          image: '🍌',
          correct: 'C',
          options: ['C', 'Ch', 'T', 'B'],
        },
        {
          id: 104,
          prompt: 'Chữ cái đầu của từ nho là gì?',
          word: 'nho',
          image: '🍇',
          correct: 'N',
          options: ['N', 'M', 'G', 'H'],
        },
        {
          id: 105,
          prompt: 'Chữ cái đầu của từ dứa là gì?',
          word: 'dứa',
          image: '🍍',
          correct: 'D',
          options: ['D', 'Đ', 'G', 'B'],
        },
        {
          id: 106,
          prompt: 'Chữ cái đầu của từ lê là gì?',
          word: 'lê',
          image: '🍐',
          correct: 'L',
          options: ['L', 'N', 'R', 'B'],
        },
      ],
    },
  
    objects: {
      label: 'Đồ vật',
      icon: '🎒',
      questions: [
        {
          id: 201,
          prompt: 'Chữ cái đầu của từ bàn là gì?',
          word: 'bàn',
          image: '🪑',
          correct: 'B',
          options: ['B', 'P', 'M', 'L'],
        },
        {
          id: 202,
          prompt: 'Chữ cái đầu của từ sách là gì?',
          word: 'sách',
          image: '📘',
          correct: 'S',
          options: ['S', 'X', 'C', 'T'],
        },
        {
          id: 203,
          prompt: 'Chữ cái đầu của từ bút là gì?',
          word: 'bút',
          image: '✏️',
          correct: 'B',
          options: ['B', 'P', 'D', 'T'],
        },
        {
          id: 204,
          prompt: 'Chữ cái đầu của từ đèn là gì?',
          word: 'đèn',
          image: '💡',
          correct: 'Đ',
          options: ['Đ', 'D', 'B', 'L'],
        },
        {
          id: 205,
          prompt: 'Chữ cái đầu của từ đồng hồ là gì?',
          word: 'đồng hồ',
          image: '⏰',
          correct: 'Đ',
          options: ['Đ', 'D', 'H', 'G'],
        },
        {
          id: 206,
          prompt: 'Chữ cái đầu của từ ba lô là gì?',
          word: 'ba lô',
          image: '🎒',
          correct: 'B',
          options: ['B', 'L', 'T', 'Đ'],
        },
      ],
    },
  
    nature: {
      label: 'Thiên nhiên',
      icon: '🌈',
      questions: [
        {
          id: 301,
          prompt: 'Chữ cái đầu của từ hoa là gì?',
          word: 'hoa',
          image: '🌸',
          correct: 'H',
          options: ['H', 'O', 'A', 'K'],
        },
        {
          id: 302,
          prompt: 'Chữ cái đầu của từ cây là gì?',
          word: 'cây',
          image: '🌳',
          correct: 'C',
          options: ['C', 'K', 'G', 'L'],
        },
        {
          id: 303,
          prompt: 'Chữ cái đầu của từ sao là gì?',
          word: 'sao',
          image: '⭐',
          correct: 'S',
          options: ['S', 'X', 'C', 'A'],
        },
        {
          id: 304,
          prompt: 'Chữ cái đầu của từ mây là gì?',
          word: 'mây',
          image: '☁️',
          correct: 'M',
          options: ['M', 'N', 'B', 'V'],
        },
        {
          id: 305,
          prompt: 'Chữ cái đầu của từ nắng là gì?',
          word: 'nắng',
          image: '☀️',
          correct: 'N',
          options: ['N', 'L', 'M', 'G'],
        },
        {
          id: 306,
          prompt: 'Chữ cái đầu của từ cầu vồng là gì?',
          word: 'cầu vồng',
          image: '🌈',
          correct: 'C',
          options: ['C', 'K', 'V', 'Q'],
        },
      ],
    },
  };
  
  export const firstLetterCategories = Object.entries(firstLetterData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );