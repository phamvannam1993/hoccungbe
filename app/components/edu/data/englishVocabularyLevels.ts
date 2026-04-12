import type { EnglishCategory, EnglishDifficulty } from './englishVocabularyData';

export type EnglishGameMode =
  | 'look-and-choose'
  | 'listen-and-choose'
  | 'match-meaning'
  | 'quick-challenge';

export type EnglishVocabularyLevel = {
  id: string;
  title: string;
  description: string;
  category: EnglishCategory | 'mixed';
  difficulty: EnglishDifficulty;
  questionCount: number;
  optionsCount: 4;
  mode: EnglishGameMode;
};

export const englishVocabularyLevels: EnglishVocabularyLevel[] = [
  {
    id: 'eng-level-1',
    title: 'Cấp 1: Từ vựng cơ bản',
    description: 'Những từ quen thuộc, dễ nhớ, dễ nhận biết.',
    category: 'mixed',
    difficulty: 'easy',
    questionCount: 5,
    optionsCount: 4,
    mode: 'look-and-choose',
  },
  {
    id: 'eng-level-2',
    title: 'Cấp 2: Con vật',
    description: 'Bé làm quen tên tiếng Anh của các con vật quen thuộc.',
    category: 'animals',
    difficulty: 'easy',
    questionCount: 4,
    optionsCount: 4,
    mode: 'look-and-choose',
  },
  {
    id: 'eng-level-3',
    title: 'Cấp 3: Trái cây',
    description: 'Học từ vựng tiếng Anh về các loại trái cây.',
    category: 'fruits',
    difficulty: 'easy',
    questionCount: 4,
    optionsCount: 4,
    mode: 'look-and-choose',
  },
  {
    id: 'eng-level-4',
    title: 'Cấp 4: Màu sắc',
    description: 'Bé nhận biết tên tiếng Anh của các màu sắc quen thuộc.',
    category: 'colors',
    difficulty: 'easy',
    questionCount: 4,
    optionsCount: 4,
    mode: 'look-and-choose',
  },
  {
    id: 'eng-level-5',
    title: 'Cấp 5: Nghe và chọn',
    description: 'Bé nghe từ tiếng Anh rồi chọn đáp án đúng.',
    category: 'mixed',
    difficulty: 'medium',
    questionCount: 5,
    optionsCount: 4,
    mode: 'listen-and-choose',
  },
  {
    id: 'eng-level-6',
    title: 'Cấp 6: Ghép từ với nghĩa',
    description: 'Bé nhìn từ tiếng Anh và chọn nghĩa tiếng Việt đúng.',
    category: 'mixed',
    difficulty: 'medium',
    questionCount: 5,
    optionsCount: 4,
    mode: 'match-meaning',
  },
  {
    id: 'eng-level-7',
    title: 'Cấp 7: Thi nhanh 30 giây',
    description: 'Bé trả lời thật nhanh để ghi điểm cao nhất trong 30 giây.',
    category: 'mixed',
    difficulty: 'medium',
    questionCount: 999,
    optionsCount: 4,
    mode: 'quick-challenge',
  },
];