export type EnglishCategory = 'animals' | 'fruits' | 'colors' | 'vehicles' | 'school';

export type EnglishDifficulty = 'easy' | 'medium' | 'hard';

export type EnglishWordItem = {
  id: string;
  word: string;
  meaning: string;
  image: string;
  category: EnglishCategory;
  difficulty: EnglishDifficulty;
  distractors: string[];
};

export const englishCategoryLabels: Record<EnglishCategory, string> = {
  animals: 'Con vật',
  fruits: 'Trái cây',
  colors: 'Màu sắc',
  vehicles: 'Phương tiện',
  school: 'Đồ dùng học tập',
};

export const englishVocabularyData: EnglishWordItem[] = [
  {
    id: 'animal-cat',
    word: 'Cat',
    meaning: 'Con mèo',
    image: '🐱',
    category: 'animals',
    difficulty: 'easy',
    distractors: ['Dog', 'Fish', 'Bird'],
  },
  {
    id: 'animal-dog',
    word: 'Dog',
    meaning: 'Con chó',
    image: '🐶',
    category: 'animals',
    difficulty: 'easy',
    distractors: ['Cat', 'Duck', 'Cow'],
  },
  {
    id: 'animal-bird',
    word: 'Bird',
    meaning: 'Con chim',
    image: '🐦',
    category: 'animals',
    difficulty: 'easy',
    distractors: ['Fish', 'Chicken', 'Rabbit'],
  },
  {
    id: 'animal-fish',
    word: 'Fish',
    meaning: 'Con cá',
    image: '🐟',
    category: 'animals',
    difficulty: 'easy',
    distractors: ['Bird', 'Cat', 'Dog'],
  },

  {
    id: 'fruit-apple',
    word: 'Apple',
    meaning: 'Quả táo',
    image: '🍎',
    category: 'fruits',
    difficulty: 'easy',
    distractors: ['Orange', 'Banana', 'Grape'],
  },
  {
    id: 'fruit-banana',
    word: 'Banana',
    meaning: 'Quả chuối',
    image: '🍌',
    category: 'fruits',
    difficulty: 'easy',
    distractors: ['Apple', 'Orange', 'Mango'],
  },
  {
    id: 'fruit-orange',
    word: 'Orange',
    meaning: 'Quả cam',
    image: '🍊',
    category: 'fruits',
    difficulty: 'easy',
    distractors: ['Apple', 'Banana', 'Grape'],
  },
  {
    id: 'fruit-grape',
    word: 'Grape',
    meaning: 'Quả nho',
    image: '🍇',
    category: 'fruits',
    difficulty: 'medium',
    distractors: ['Orange', 'Apple', 'Mango'],
  },

  {
    id: 'color-red',
    word: 'Red',
    meaning: 'Màu đỏ',
    image: '🟥',
    category: 'colors',
    difficulty: 'easy',
    distractors: ['Blue', 'Yellow', 'Green'],
  },
  {
    id: 'color-blue',
    word: 'Blue',
    meaning: 'Màu xanh dương',
    image: '🟦',
    category: 'colors',
    difficulty: 'easy',
    distractors: ['Red', 'Green', 'Yellow'],
  },
  {
    id: 'color-yellow',
    word: 'Yellow',
    meaning: 'Màu vàng',
    image: '🟨',
    category: 'colors',
    difficulty: 'easy',
    distractors: ['Red', 'Blue', 'Pink'],
  },
  {
    id: 'color-green',
    word: 'Green',
    meaning: 'Màu xanh lá',
    image: '🟩',
    category: 'colors',
    difficulty: 'easy',
    distractors: ['Blue', 'Red', 'Orange'],
  },

  {
    id: 'vehicle-car',
    word: 'Car',
    meaning: 'Ô tô',
    image: '🚗',
    category: 'vehicles',
    difficulty: 'easy',
    distractors: ['Bus', 'Bike', 'Train'],
  },
  {
    id: 'vehicle-bus',
    word: 'Bus',
    meaning: 'Xe buýt',
    image: '🚌',
    category: 'vehicles',
    difficulty: 'easy',
    distractors: ['Car', 'Train', 'Bike'],
  },
  {
    id: 'vehicle-bike',
    word: 'Bike',
    meaning: 'Xe đạp',
    image: '🚲',
    category: 'vehicles',
    difficulty: 'easy',
    distractors: ['Bus', 'Car', 'Plane'],
  },
  {
    id: 'vehicle-plane',
    word: 'Plane',
    meaning: 'Máy bay',
    image: '✈️',
    category: 'vehicles',
    difficulty: 'medium',
    distractors: ['Car', 'Bus', 'Train'],
  },

  {
    id: 'school-book',
    word: 'Book',
    meaning: 'Quyển sách',
    image: '📘',
    category: 'school',
    difficulty: 'easy',
    distractors: ['Pen', 'Bag', 'Ruler'],
  },
  {
    id: 'school-pen',
    word: 'Pen',
    meaning: 'Cây bút',
    image: '🖊️',
    category: 'school',
    difficulty: 'easy',
    distractors: ['Book', 'Bag', 'Pencil'],
  },
  {
    id: 'school-pencil',
    word: 'Pencil',
    meaning: 'Bút chì',
    image: '✏️',
    category: 'school',
    difficulty: 'easy',
    distractors: ['Pen', 'Book', 'Ruler'],
  },
  {
    id: 'school-bag',
    word: 'Bag',
    meaning: 'Cặp sách',
    image: '🎒',
    category: 'school',
    difficulty: 'easy',
    distractors: ['Book', 'Pen', 'Chair'],
  },
];