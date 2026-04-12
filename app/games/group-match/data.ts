export type GroupMatchOption = {
    emoji: string;
    label: string;
   group: string;
  };
  
  export type GroupMatchQuestion = {
    id: number;
    prompt: string;
    groupLabel: string;
    groupEmoji: string;
    options: GroupMatchOption[];
    correctGroup: string;
    requiredCount: number;
  };
  
  export type GroupMatchCategory = {
    label: string;
    icon: string;
    questions: GroupMatchQuestion[];
  };
  
  export const groupMatchData: Record<string, GroupMatchCategory> = {
    animals: {
      label: 'Con vật',
      icon: '🐻',
      questions: [
        {
          id: 1,
          prompt: 'Hãy chọn 3 hình thuộc nhóm con vật',
          groupLabel: 'con vật',
          groupEmoji: '🐾',
          correctGroup: 'animals',
          requiredCount: 3,
          options: [
            { emoji: '🐶', label: 'Chó', group: 'animals' },
            { emoji: '🐱', label: 'Mèo', group: 'animals' },
            { emoji: '🐰', label: 'Thỏ', group: 'animals' },
            { emoji: '🚗', label: 'Ô tô', group: 'vehicles' },
            { emoji: '🍎', label: 'Táo', group: 'fruits' },
            { emoji: '📘', label: 'Sách', group: 'school' },
          ],
        },
        {
          id: 2,
          prompt: 'Hãy chọn 3 hình thuộc nhóm con vật',
          groupLabel: 'con vật',
          groupEmoji: '🐾',
          correctGroup: 'animals',
          requiredCount: 3,
          options: [
            { emoji: '🦁', label: 'Sư tử', group: 'animals' },
            { emoji: '🐘', label: 'Voi', group: 'animals' },
            { emoji: '🐒', label: 'Khỉ', group: 'animals' },
            { emoji: '✏️', label: 'Bút chì', group: 'school' },
            { emoji: '🍌', label: 'Chuối', group: 'fruits' },
            { emoji: '🚲', label: 'Xe đạp', group: 'vehicles' },
          ],
        },
      ],
    },
  
    fruits: {
      label: 'Trái cây',
      icon: '🍎',
      questions: [
        {
          id: 101,
          prompt: 'Hãy chọn 3 hình thuộc nhóm trái cây',
          groupLabel: 'trái cây',
          groupEmoji: '🍓',
          correctGroup: 'fruits',
          requiredCount: 3,
          options: [
            { emoji: '🍎', label: 'Táo', group: 'fruits' },
            { emoji: '🍌', label: 'Chuối', group: 'fruits' },
            { emoji: '🍇', label: 'Nho', group: 'fruits' },
            { emoji: '🐶', label: 'Chó', group: 'animals' },
            { emoji: '📘', label: 'Sách', group: 'school' },
            { emoji: '🚗', label: 'Ô tô', group: 'vehicles' },
          ],
        },
        {
          id: 102,
          prompt: 'Hãy chọn 3 hình thuộc nhóm trái cây',
          groupLabel: 'trái cây',
          groupEmoji: '🍓',
          correctGroup: 'fruits',
          requiredCount: 3,
          options: [
            { emoji: '🍊', label: 'Cam', group: 'fruits' },
            { emoji: '🍍', label: 'Dứa', group: 'fruits' },
            { emoji: '🍐', label: 'Lê', group: 'fruits' },
            { emoji: '✂️', label: 'Kéo', group: 'school' },
            { emoji: '🐱', label: 'Mèo', group: 'animals' },
            { emoji: '🚌', label: 'Xe buýt', group: 'vehicles' },
          ],
        },
      ],
    },
  
    school: {
      label: 'Đồ dùng học tập',
      icon: '✏️',
      questions: [
        {
          id: 201,
          prompt: 'Hãy chọn 3 hình thuộc nhóm đồ dùng học tập',
          groupLabel: 'đồ dùng học tập',
          groupEmoji: '📚',
          correctGroup: 'school',
          requiredCount: 3,
          options: [
            { emoji: '✏️', label: 'Bút chì', group: 'school' },
            { emoji: '📘', label: 'Sách', group: 'school' },
            { emoji: '🎒', label: 'Ba lô', group: 'school' },
            { emoji: '🍎', label: 'Táo', group: 'fruits' },
            { emoji: '🐶', label: 'Chó', group: 'animals' },
            { emoji: '🚗', label: 'Ô tô', group: 'vehicles' },
          ],
        },
        {
          id: 202,
          prompt: 'Hãy chọn 3 hình thuộc nhóm đồ dùng học tập',
          groupLabel: 'đồ dùng học tập',
          groupEmoji: '📚',
          correctGroup: 'school',
          requiredCount: 3,
          options: [
            { emoji: '📏', label: 'Thước', group: 'school' },
            { emoji: '✂️', label: 'Kéo', group: 'school' },
            { emoji: '🖍️', label: 'Bút màu', group: 'school' },
            { emoji: '🍌', label: 'Chuối', group: 'fruits' },
            { emoji: '🐰', label: 'Thỏ', group: 'animals' },
            { emoji: '🚲', label: 'Xe đạp', group: 'vehicles' },
          ],
        },
      ],
    },
  
    vehicles: {
      label: 'Phương tiện',
      icon: '🚗',
      questions: [
        {
          id: 301,
          prompt: 'Hãy chọn 3 hình thuộc nhóm phương tiện',
          groupLabel: 'phương tiện',
          groupEmoji: '🚦',
          correctGroup: 'vehicles',
          requiredCount: 3,
          options: [
            { emoji: '🚗', label: 'Ô tô', group: 'vehicles' },
            { emoji: '🚲', label: 'Xe đạp', group: 'vehicles' },
            { emoji: '🚌', label: 'Xe buýt', group: 'vehicles' },
            { emoji: '🐱', label: 'Mèo', group: 'animals' },
            { emoji: '🍎', label: 'Táo', group: 'fruits' },
            { emoji: '📘', label: 'Sách', group: 'school' },
          ],
        },
        {
          id: 302,
          prompt: 'Hãy chọn 3 hình thuộc nhóm phương tiện',
          groupLabel: 'phương tiện',
          groupEmoji: '🚦',
          correctGroup: 'vehicles',
          requiredCount: 3,
          options: [
            { emoji: '✈️', label: 'Máy bay', group: 'vehicles' },
            { emoji: '🚂', label: 'Tàu hỏa', group: 'vehicles' },
            { emoji: '⛵', label: 'Thuyền', group: 'vehicles' },
            { emoji: '🐶', label: 'Chó', group: 'animals' },
            { emoji: '🍌', label: 'Chuối', group: 'fruits' },
            { emoji: '✏️', label: 'Bút chì', group: 'school' },
          ],
        },
      ],
    },
  };
  
  export const groupMatchCategories = Object.entries(groupMatchData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );