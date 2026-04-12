export type CountAnimalsQuestion = {
    id: number;
    prompt: string;
    animal: string;
    animalLabel: string;
    items: string[];
    correct: number;
    options: number[];
  };
  
  export type CountAnimalsCategory = {
    label: string;
    icon: string;
    questions: CountAnimalsQuestion[];
  };
  
  export const countAnimalsData: Record<string, CountAnimalsCategory> = {
    farm: {
      label: 'Nông trại',
      icon: '🐮',
      questions: [
        {
          id: 1,
          prompt: 'Có bao nhiêu con gà?',
          animal: '🐥',
          animalLabel: 'con gà',
          items: ['🐥', '🐥', '🐥'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 2,
          prompt: 'Có bao nhiêu con bò?',
          animal: '🐮',
          animalLabel: 'con bò',
          items: ['🐮', '🐮', '🐮', '🐮'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
        {
          id: 3,
          prompt: 'Có bao nhiêu con heo?',
          animal: '🐷',
          animalLabel: 'con heo',
          items: ['🐷', '🐷'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
        {
          id: 4,
          prompt: 'Có bao nhiêu con vịt?',
          animal: '🦆',
          animalLabel: 'con vịt',
          items: ['🦆', '🦆', '🦆', '🦆', '🦆'],
          correct: 5,
          options: [4, 5, 6, 7],
        },
        {
          id: 5,
          prompt: 'Có bao nhiêu con cừu?',
          animal: '🐑',
          animalLabel: 'con cừu',
          items: ['🐑', '🐑', '🐑'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 6,
          prompt: 'Có bao nhiêu con ngựa?',
          animal: '🐴',
          animalLabel: 'con ngựa',
          items: ['🐴', '🐴', '🐴', '🐴'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
      ],
    },
  
    jungle: {
      label: 'Rừng xanh',
      icon: '🦁',
      questions: [
        {
          id: 101,
          prompt: 'Có bao nhiêu con khỉ?',
          animal: '🐵',
          animalLabel: 'con khỉ',
          items: ['🐵', '🐵', '🐵'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 102,
          prompt: 'Có bao nhiêu con sư tử?',
          animal: '🦁',
          animalLabel: 'con sư tử',
          items: ['🦁', '🦁'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
        {
          id: 103,
          prompt: 'Có bao nhiêu con voi?',
          animal: '🐘',
          animalLabel: 'con voi',
          items: ['🐘', '🐘', '🐘', '🐘'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
        {
          id: 104,
          prompt: 'Có bao nhiêu con hổ?',
          animal: '🐯',
          animalLabel: 'con hổ',
          items: ['🐯', '🐯', '🐯'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 105,
          prompt: 'Có bao nhiêu con gấu?',
          animal: '🐻',
          animalLabel: 'con gấu',
          items: ['🐻', '🐻', '🐻', '🐻', '🐻'],
          correct: 5,
          options: [4, 5, 6, 7],
        },
        {
          id: 106,
          prompt: 'Có bao nhiêu con cáo?',
          animal: '🦊',
          animalLabel: 'con cáo',
          items: ['🦊', '🦊'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
      ],
    },
  
    ocean: {
      label: 'Đại dương',
      icon: '🐟',
      questions: [
        {
          id: 201,
          prompt: 'Có bao nhiêu con cá?',
          animal: '🐟',
          animalLabel: 'con cá',
          items: ['🐟', '🐟', '🐟', '🐟'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
        {
          id: 202,
          prompt: 'Có bao nhiêu con cá heo?',
          animal: '🐬',
          animalLabel: 'con cá heo',
          items: ['🐬', '🐬', '🐬'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 203,
          prompt: 'Có bao nhiêu con bạch tuộc?',
          animal: '🐙',
          animalLabel: 'con bạch tuộc',
          items: ['🐙', '🐙'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
        {
          id: 204,
          prompt: 'Có bao nhiêu con cua?',
          animal: '🦀',
          animalLabel: 'con cua',
          items: ['🦀', '🦀', '🦀', '🦀', '🦀'],
          correct: 5,
          options: [4, 5, 6, 7],
        },
        {
          id: 205,
          prompt: 'Có bao nhiêu con cá voi?',
          animal: '🐳',
          animalLabel: 'con cá voi',
          items: ['🐳', '🐳'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
        {
          id: 206,
          prompt: 'Có bao nhiêu con tôm?',
          animal: '🦐',
          animalLabel: 'con tôm',
          items: ['🦐', '🦐', '🦐'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
      ],
    },
  
    birds: {
      label: 'Chim chóc',
      icon: '🐦',
      questions: [
        {
          id: 301,
          prompt: 'Có bao nhiêu con chim?',
          animal: '🐦',
          animalLabel: 'con chim',
          items: ['🐦', '🐦', '🐦'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 302,
          prompt: 'Có bao nhiêu con gà con?',
          animal: '🐥',
          animalLabel: 'con gà con',
          items: ['🐥', '🐥', '🐥', '🐥'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
        {
          id: 303,
          prompt: 'Có bao nhiêu con cú?',
          animal: '🦉',
          animalLabel: 'con cú',
          items: ['🦉', '🦉'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
        {
          id: 304,
          prompt: 'Có bao nhiêu con chim cánh cụt?',
          animal: '🐧',
          animalLabel: 'con chim cánh cụt',
          items: ['🐧', '🐧', '🐧'],
          correct: 3,
          options: [2, 3, 4, 5],
        },
        {
          id: 305,
          prompt: 'Có bao nhiêu con công?',
          animal: '🦚',
          animalLabel: 'con công',
          items: ['🦚', '🦚', '🦚', '🦚'],
          correct: 4,
          options: [3, 4, 5, 6],
        },
        {
          id: 306,
          prompt: 'Có bao nhiêu con vịt?',
          animal: '🦆',
          animalLabel: 'con vịt',
          items: ['🦆', '🦆'],
          correct: 2,
          options: [1, 2, 3, 4],
        },
      ],
    },
  };
  
  export const countAnimalsCategories = Object.entries(countAnimalsData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );
  