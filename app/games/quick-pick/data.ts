export type QuickPickQuestion = {
    id: number;
    prompt: string;
    correct: string;
    options: string[];
  };
  
  export type QuickPickCategory = {
    label: string;
    icon: string;
    questions: QuickPickQuestion[];
  };
  
  export const quickPickData: Record<string, QuickPickCategory> = {
    animals: {
      label: 'Con vật',
      icon: '🐻',
      questions: [
        {
          id: 1,
          prompt: 'Hãy chọn con mèo',
          correct: '🐱',
          options: ['🐱', '🐶', '🐰', '🐼'],
        },
        {
          id: 2,
          prompt: 'Hãy chọn con chó',
          correct: '🐶',
          options: ['🐸', '🐶', '🐵', '🐷'],
        },
        {
          id: 3,
          prompt: 'Hãy chọn con cá',
          correct: '🐟',
          options: ['🐟', '🐦', '🐘', '🦁'],
        },
        {
          id: 4,
          prompt: 'Hãy chọn con chim',
          correct: '🐦',
          options: ['🐧', '🐦', '🐼', '🐻'],
        },
        {
          id: 5,
          prompt: 'Hãy chọn con voi',
          correct: '🐘',
          options: ['🐘', '🐭', '🦒', '🐨'],
        },
        {
          id: 6,
          prompt: 'Hãy chọn con thỏ',
          correct: '🐰',
          options: ['🐰', '🐱', '🐯', '🐵'],
        },
      ],
    },
  
    fruits: {
      label: 'Trái cây',
      icon: '🍎',
      questions: [
        {
          id: 101,
          prompt: 'Hãy chọn quả táo',
          correct: '🍎',
          options: ['🍎', '🍌', '🍇', '🍓'],
        },
        {
          id: 102,
          prompt: 'Hãy chọn quả chuối',
          correct: '🍌',
          options: ['🍊', '🍍', '🍌', '🍒'],
        },
        {
          id: 103,
          prompt: 'Hãy chọn quả nho',
          correct: '🍇',
          options: ['🍇', '🍋', '🥝', '🍑'],
        },
        {
          id: 104,
          prompt: 'Hãy chọn quả cam',
          correct: '🍊',
          options: ['🍓', '🍊', '🍎', '🍐'],
        },
        {
          id: 105,
          prompt: 'Hãy chọn quả dứa',
          correct: '🍍',
          options: ['🍍', '🍉', '🍒', '🍋'],
        },
        {
          id: 106,
          prompt: 'Hãy chọn quả dâu',
          correct: '🍓',
          options: ['🍓', '🥭', '🍊', '🍇'],
        },
      ],
    },
  
    vehicles: {
      label: 'Phương tiện',
      icon: '🚗',
      questions: [
        {
          id: 201,
          prompt: 'Hãy chọn ô tô',
          correct: '🚗',
          options: ['🚗', '🚲', '🚌', '🚜'],
        },
        {
          id: 202,
          prompt: 'Hãy chọn xe buýt',
          correct: '🚌',
          options: ['🚕', '🚌', '🚙', '🏍️'],
        },
        {
          id: 203,
          prompt: 'Hãy chọn xe đạp',
          correct: '🚲',
          options: ['🚂', '🚲', '🚑', '🚓'],
        },
        {
          id: 204,
          prompt: 'Hãy chọn tàu hỏa',
          correct: '🚂',
          options: ['🚂', '✈️', '⛵', '🚒'],
        },
        {
          id: 205,
          prompt: 'Hãy chọn máy bay',
          correct: '✈️',
          options: ['🚁', '🚀', '✈️', '🛳️'],
        },
        {
          id: 206,
          prompt: 'Hãy chọn xe máy',
          correct: '🏍️',
          options: ['🛴', '🏍️', '🚲', '🚗'],
        },
      ],
    },
  
    shapes: {
      label: 'Hình dạng',
      icon: '🟡',
      questions: [
        {
          id: 301,
          prompt: 'Hãy chọn hình tròn',
          correct: '🟡',
          options: ['🟡', '🔺', '🟦', '⭐'],
        },
        {
          id: 302,
          prompt: 'Hãy chọn hình vuông',
          correct: '🟦',
          options: ['🟦', '🟡', '🔺', '💚'],
        },
        {
          id: 303,
          prompt: 'Hãy chọn hình tam giác',
          correct: '🔺',
          options: ['⭐', '🔺', '🟩', '🟠'],
        },
        {
          id: 304,
          prompt: 'Hãy chọn ngôi sao',
          correct: '⭐',
          options: ['⭐', '🟦', '🟣', '🔺'],
        },
        {
          id: 305,
          prompt: 'Hãy chọn trái tim',
          correct: '💚',
          options: ['🟡', '💚', '⭐', '🟪'],
        },
        {
          id: 306,
          prompt: 'Hãy chọn hình chữ nhật',
          correct: '🟩',
          options: ['🟩', '🟣', '🟠', '⭐'],
        },
      ],
    },
  };
  
  export const quickPickCategories = Object.entries(quickPickData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );
  