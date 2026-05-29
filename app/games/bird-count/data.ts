export type BirdCountQuestion = {
  id: number;
  birdCount: number;
  question: string;
  options: number[];
};

export const birdCountQuestions: BirdCountQuestion[] = [
  {
    id: 1,
    birdCount: 3,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 2,
    birdCount: 5,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 3,
    birdCount: 4,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 4,
    birdCount: 7,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 5,
    birdCount: 6,
    question: "Bạn đã thấy bao nhiêu chú chim?",
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
];
