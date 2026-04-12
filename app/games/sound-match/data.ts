export type SoundMatchQuestion = {
    id: number;
    word: string;
    emoji: string;
    options: string[];
    correct: string;
  };
  
  export type SoundMatchCategory = {
    label: string;
    icon: string;
    questions: SoundMatchQuestion[];
  };
  
  export const soundMatchData: Record<string, SoundMatchCategory> = {
    animals: {
      label: 'Con vật',
      icon: '🐻',
      questions: [
        { id: 1, word: 'con mèo', emoji: '🐱', options: ['🐱', '🐶', '🐰', '🦊'], correct: '🐱' },
        { id: 2, word: 'con chó', emoji: '🐶', options: ['🐸', '🐶', '🐼', '🐵'], correct: '🐶' },
        { id: 3, word: 'con thỏ', emoji: '🐰', options: ['🐰', '🐻', '🐯', '🐷'], correct: '🐰' },
        { id: 4, word: 'con cá', emoji: '🐟', options: ['🐦', '🐟', '🐘', '🦁'], correct: '🐟' },
        { id: 5, word: 'con chim', emoji: '🐦', options: ['🐙', '🐼', '🐦', '🐧'], correct: '🐦' },
        { id: 6, word: 'con voi', emoji: '🐘', options: ['🐘', '🐭', '🐨', '🦒'], correct: '🐘' },
      ],
    },
  
    fruits: {
      label: 'Trái cây',
      icon: '🍎',
      questions: [
        { id: 101, word: 'quả táo', emoji: '🍎', options: ['🍌', '🍎', '🍇', '🍓'], correct: '🍎' },
        { id: 102, word: 'quả chuối', emoji: '🍌', options: ['🍍', '🍉', '🍌', '🍒'], correct: '🍌' },
        { id: 103, word: 'quả nho', emoji: '🍇', options: ['🥝', '🍇', '🍋', '🍑'], correct: '🍇' },
        { id: 104, word: 'quả dâu', emoji: '🍓', options: ['🍓', '🍐', '🥭', '🍊'], correct: '🍓' },
        { id: 105, word: 'quả cam', emoji: '🍊', options: ['🍎', '🍊', '🍍', '🥥'], correct: '🍊' },
        { id: 106, word: 'quả dứa', emoji: '🍍', options: ['🍍', '🍋', '🍐', '🍉'], correct: '🍍' },
      ],
    },
  
    vehicles: {
      label: 'Phương tiện',
      icon: '🚗',
      questions: [
        { id: 201, word: 'ô tô', emoji: '🚗', options: ['🚲', '🚗', '🚌', '🚜'], correct: '🚗' },
        { id: 202, word: 'xe buýt', emoji: '🚌', options: ['🚕', '🚌', '🚙', '🏍️'], correct: '🚌' },
        { id: 203, word: 'xe đạp', emoji: '🚲', options: ['🚲', '🚂', '🚑', '🚓'], correct: '🚲' },
        { id: 204, word: 'tàu hỏa', emoji: '🚂', options: ['🚂', '✈️', '⛵', '🚒'], correct: '🚂' },
        { id: 205, word: 'máy bay', emoji: '✈️', options: ['🚁', '✈️', '🚀', '🛳️'], correct: '✈️' },
        { id: 206, word: 'xe máy', emoji: '🏍️', options: ['🛴', '🏍️', '🚲', '🚗'], correct: '🏍️' },
      ],
    },
  
    nature: {
      label: 'Thiên nhiên',
      icon: '🌈',
      questions: [
        { id: 301, word: 'mặt trời', emoji: '☀️', options: ['🌙', '⭐', '☀️', '☁️'], correct: '☀️' },
        { id: 302, word: 'mặt trăng', emoji: '🌙', options: ['☀️', '🌙', '⭐', '🌈'], correct: '🌙' },
        { id: 303, word: 'ngôi sao', emoji: '⭐', options: ['⭐', '☁️', '🌧️', '❄️'], correct: '⭐' },
        { id: 304, word: 'bông hoa', emoji: '🌸', options: ['🌳', '🌸', '🍀', '🌵'], correct: '🌸' },
        { id: 305, word: 'cây xanh', emoji: '🌳', options: ['🌳', '🌻', '🌙', '☘️'], correct: '🌳' },
        { id: 306, word: 'cầu vồng', emoji: '🌈', options: ['🌈', '⭐', '☀️', '❄️'], correct: '🌈' },
      ],
    },
  };
  
  export const soundMatchCategories = Object.entries(soundMatchData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );
  