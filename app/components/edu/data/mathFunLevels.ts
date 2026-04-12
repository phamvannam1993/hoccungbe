export type MathDifficultyLevel = {
    id: string;
    title: string;
    description: string;
    operatorMode: 'add' | 'subtract' | 'mixed';
    minNumber: number;
    maxNumber: number;
    questionCount: number;
    optionsCount: 4;
  };
  
  export const mathFunLevels: MathDifficultyLevel[] = [
    {
      id: 'math-level-1',
      title: 'Cấp 1: Cộng trong phạm vi 5',
      description: 'Bé làm quen với các phép cộng đơn giản, dễ nhìn và dễ tính.',
      operatorMode: 'add',
      minNumber: 0,
      maxNumber: 5,
      questionCount: 5,
      optionsCount: 4,
    },
    {
      id: 'math-level-2',
      title: 'Cấp 2: Cộng trong phạm vi 10',
      description: 'Tăng độ khó nhẹ với các phép cộng trong phạm vi 10.',
      operatorMode: 'add',
      minNumber: 0,
      maxNumber: 10,
      questionCount: 6,
      optionsCount: 4,
    },
    {
      id: 'math-level-3',
      title: 'Cấp 3: Trừ trong phạm vi 10',
      description: 'Bé luyện phép trừ cơ bản với kết quả không âm.',
      operatorMode: 'subtract',
      minNumber: 0,
      maxNumber: 10,
      questionCount: 6,
      optionsCount: 4,
    },
    {
      id: 'math-level-4',
      title: 'Cấp 4: Cộng trừ hỗn hợp',
      description: 'Bé bắt đầu làm quen với cả cộng và trừ trong cùng một màn chơi.',
      operatorMode: 'mixed',
      minNumber: 0,
      maxNumber: 10,
      questionCount: 7,
      optionsCount: 4,
    },
    {
      id: 'math-level-5',
      title: 'Cấp 5: Thử thách phạm vi 20',
      description: 'Các phép tính nhanh hơn và rộng hơn trong phạm vi 20.',
      operatorMode: 'mixed',
      minNumber: 0,
      maxNumber: 20,
      questionCount: 8,
      optionsCount: 4,
    },
  ];