export type MazeCategory =
  | 'forest'
  | 'ocean'
  | 'space'
  | 'castle'
  | 'mixed';

export type MazeLevel = 'easy' | 'medium' | 'hard';

export type MazeCell = 'S' | 'G' | 'W' | 'P';

export type MazeQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: MazeLevel;
  category: MazeCategory;
  grid: MazeCell[][];
};

export const mazeCategories = [
  { key: 'forest', label: 'Rừng xanh', icon: '🌳', total: 6 },
  { key: 'ocean', label: 'Đại dương', icon: '🌊', total: 6 },
  { key: 'space', label: 'Vũ trụ', icon: '🚀', total: 6 },
  { key: 'castle', label: 'Lâu đài', icon: '🏰', total: 6 },
  { key: 'mixed', label: 'Tổng hợp', icon: '✨', total: 6 },
] as const;

export const mazeData: Record<
  MazeCategory,
  {
    label: string;
    icon: string;
    questions: MazeQuestion[];
  }
> = {
  forest: {
    label: 'Rừng xanh',
    icon: '🌳',
    questions: [
      {
        id: 'forest-1',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Đi theo lối trống để tới ngôi sao',
        level: 'easy',
        category: 'forest',
        grid: [
          ['S', 'P', 'P', 'W'],
          ['W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'G'],
        ],
      },
      {
        id: 'forest-2',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Tránh ô chặn màu đậm',
        level: 'easy',
        category: 'forest',
        grid: [
          ['S', 'P', 'W', 'P'],
          ['W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'G'],
        ],
      },
      {
        id: 'forest-3',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Cần rẽ vài lần mới tới đích',
        level: 'medium',
        category: 'forest',
        grid: [
          ['S', 'P', 'W', 'P', 'P'],
          ['W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'W'],
          ['P', 'W', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'W', 'G'],
        ],
      },
      {
        id: 'forest-4',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Quan sát kỹ ngã rẽ ở giữa mê cung',
        level: 'medium',
        category: 'forest',
        grid: [
          ['S', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'forest-5',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Đường đi dài hơn và có nhiều chướng ngại',
        level: 'hard',
        category: 'forest',
        grid: [
          ['S', 'P', 'W', 'P', 'P', 'P'],
          ['W', 'P', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['P', 'W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'W', 'G'],
        ],
      },
      {
        id: 'forest-6',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Cần đi vòng tránh nhiều ô chặn',
        level: 'hard',
        category: 'forest',
        grid: [
          ['S', 'P', 'P', 'W', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'P', 'W'],
          ['P', 'W', 'W', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'W', 'P', 'W'],
          ['W', 'W', 'P', 'P', 'P', 'G'],
        ],
      },
    ],
  },

  ocean: {
    label: 'Đại dương',
    icon: '🌊',
    questions: [
      {
        id: 'ocean-1',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Đi theo ô nước sáng',
        level: 'easy',
        category: 'ocean',
        grid: [
          ['S', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'G'],
        ],
      },
      {
        id: 'ocean-2',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Tránh đá ngầm',
        level: 'easy',
        category: 'ocean',
        grid: [
          ['S', 'P', 'W', 'P'],
          ['P', 'P', 'W', 'P'],
          ['P', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'ocean-3',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Đi theo đường vòng',
        level: 'medium',
        category: 'ocean',
        grid: [
          ['S', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'ocean-4',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Giữa mê cung có một lối đi đúng',
        level: 'medium',
        category: 'ocean',
        grid: [
          ['S', 'P', 'W', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W'],
          ['W', 'P', 'P', 'P', 'P'],
          ['W', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'ocean-5',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Đường đi dài và cần rẽ nhiều lần',
        level: 'hard',
        category: 'ocean',
        grid: [
          ['S', 'P', 'P', 'W', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'ocean-6',
        prompt: 'Hãy đưa thuyền tới kho báu',
        hint: 'Tìm đường ngắn nhất tới đích',
        level: 'hard',
        category: 'ocean',
        grid: [
          ['S', 'P', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W', 'P'],
          ['W', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['P', 'W', 'W', 'W', 'P', 'G'],
        ],
      },
    ],
  },

  space: {
    label: 'Vũ trụ',
    icon: '🚀',
    questions: [
      {
        id: 'space-1',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Đi qua các ô sáng',
        level: 'easy',
        category: 'space',
        grid: [
          ['S', 'P', 'P', 'W'],
          ['W', 'P', 'W', 'W'],
          ['P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'G'],
        ],
      },
      {
        id: 'space-2',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Tránh thiên thạch',
        level: 'easy',
        category: 'space',
        grid: [
          ['S', 'P', 'W', 'P'],
          ['P', 'P', 'W', 'P'],
          ['P', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'space-3',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Có nhiều ngã rẽ giữa đường',
        level: 'medium',
        category: 'space',
        grid: [
          ['S', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'space-4',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Tìm lối đi ẩn giữa mê cung',
        level: 'medium',
        category: 'space',
        grid: [
          ['S', 'P', 'W', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W'],
          ['W', 'P', 'P', 'P', 'P'],
          ['W', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'space-5',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Đi đường vòng để tránh vật cản',
        level: 'hard',
        category: 'space',
        grid: [
          ['S', 'P', 'P', 'W', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'space-6',
        prompt: 'Hãy đưa tên lửa tới hành tinh',
        hint: 'Đường đi hẹp và có nhiều bẫy',
        level: 'hard',
        category: 'space',
        grid: [
          ['S', 'P', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W', 'P'],
          ['W', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['P', 'W', 'W', 'W', 'P', 'G'],
        ],
      },
    ],
  },

  castle: {
    label: 'Lâu đài',
    icon: '🏰',
    questions: [
      {
        id: 'castle-1',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Tìm lối đi trống',
        level: 'easy',
        category: 'castle',
        grid: [
          ['S', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'G'],
        ],
      },
      {
        id: 'castle-2',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Tránh tường đá',
        level: 'easy',
        category: 'castle',
        grid: [
          ['S', 'P', 'W', 'P'],
          ['P', 'P', 'W', 'P'],
          ['P', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'castle-3',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Có một lối đi vòng',
        level: 'medium',
        category: 'castle',
        grid: [
          ['S', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'castle-4',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Đi sai một bước là bị chặn',
        level: 'medium',
        category: 'castle',
        grid: [
          ['S', 'P', 'W', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W'],
          ['W', 'P', 'P', 'P', 'P'],
          ['W', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'castle-5',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Đường đi dài hơn và nhiều chướng ngại',
        level: 'hard',
        category: 'castle',
        grid: [
          ['S', 'P', 'P', 'W', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'castle-6',
        prompt: 'Hãy đưa hiệp sĩ tới lâu đài',
        hint: 'Cần nhớ hướng đi thật kỹ',
        level: 'hard',
        category: 'castle',
        grid: [
          ['S', 'P', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W', 'P'],
          ['W', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['P', 'W', 'W', 'W', 'P', 'G'],
        ],
      },
    ],
  },

  mixed: {
    label: 'Tổng hợp',
    icon: '✨',
    questions: [
      {
        id: 'mixed-1',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Quan sát thật kỹ trước khi di chuyển',
        level: 'easy',
        category: 'mixed',
        grid: [
          ['S', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P'],
          ['W', 'W', 'P', 'G'],
        ],
      },
      {
        id: 'mixed-2',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Đi vòng tránh vật cản',
        level: 'easy',
        category: 'mixed',
        grid: [
          ['S', 'P', 'W', 'P'],
          ['P', 'P', 'W', 'P'],
          ['P', 'W', 'P', 'P'],
          ['P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'mixed-3',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Mê cung có nhiều ngã rẽ',
        level: 'medium',
        category: 'mixed',
        grid: [
          ['S', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'P', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'mixed-4',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Chọn đúng đường giữa mê cung',
        level: 'medium',
        category: 'mixed',
        grid: [
          ['S', 'P', 'W', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W'],
          ['W', 'P', 'P', 'P', 'P'],
          ['W', 'W', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'mixed-5',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Mê cung dài và cần đi chính xác',
        level: 'hard',
        category: 'mixed',
        grid: [
          ['S', 'P', 'P', 'W', 'P', 'P'],
          ['W', 'W', 'P', 'W', 'P', 'W'],
          ['P', 'P', 'P', 'P', 'P', 'P'],
          ['P', 'W', 'W', 'W', 'W', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'G'],
        ],
      },
      {
        id: 'mixed-6',
        prompt: 'Hãy tìm đường tới đích',
        hint: 'Tìm lối đi tốt nhất tới ngôi sao',
        level: 'hard',
        category: 'mixed',
        grid: [
          ['S', 'P', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'W', 'P', 'W', 'P'],
          ['W', 'P', 'P', 'P', 'W', 'P'],
          ['W', 'W', 'W', 'P', 'P', 'P'],
          ['P', 'P', 'P', 'P', 'W', 'P'],
          ['P', 'W', 'W', 'W', 'P', 'G'],
        ],
      },
    ],
  },
};
