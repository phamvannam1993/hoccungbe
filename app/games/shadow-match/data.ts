export type ShadowMatchQuestion = {
    id: number;
    prompt: string;
    shadow: string;
    correct: string;
    options: string[];
  };
  
  export type ShadowMatchCategory = {
    label: string;
    icon: string;
    questions: ShadowMatchQuestion[];
  };
  
  export const shadowMatchData: Record<string, ShadowMatchCategory> = {
    toys: {
      label: 'Đồ chơi',
      icon: '🧸',
      questions: [
        {
          id: 1,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🧸',
          correct: '🧸',
          options: ['🧸', '⚽', '🎈', '🪁'],
        },
        {
          id: 2,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '⚽',
          correct: '⚽',
          options: ['🎾', '🏀', '⚽', '🎈'],
        },
        {
          id: 3,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🎈',
          correct: '🎈',
          options: ['🪁', '🎈', '⚽', '🎁'],
        },
        {
          id: 4,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🪁',
          correct: '🪁',
          options: ['🎣', '🪁', '🎈', '🧸'],
        },
        {
          id: 5,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🎁',
          correct: '🎁',
          options: ['🎁', '📦', '🧸', '🎒'],
        },
        {
          id: 6,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🎲',
          correct: '🎲',
          options: ['🎲', '🧩', '📘', '🎀'],
        },
      ],
    },
  
    school: {
      label: 'Đồ dùng học tập',
      icon: '✏️',
      questions: [
        {
          id: 101,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '✏️',
          correct: '✏️',
          options: ['✏️', '📏', '📘', '🖍️'],
        },
        {
          id: 102,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '📘',
          correct: '📘',
          options: ['📘', '📒', '🎒', '🪑'],
        },
        {
          id: 103,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '📏',
          correct: '📏',
          options: ['📐', '📏', '✂️', '✏️'],
        },
        {
          id: 104,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🎒',
          correct: '🎒',
          options: ['🎒', '🧢', '📘', '👟'],
        },
        {
          id: 105,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🖍️',
          correct: '🖍️',
          options: ['✏️', '🖍️', '📏', '📎'],
        },
        {
          id: 106,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '✂️',
          correct: '✂️',
          options: ['📌', '✂️', '📎', '📐'],
        },
      ],
    },
  
    home: {
      label: 'Đồ vật trong nhà',
      icon: '🏠',
      questions: [
        {
          id: 201,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '💡',
          correct: '💡',
          options: ['💡', '🔔', '📱', '🪥'],
        },
        {
          id: 202,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '⏰',
          correct: '⏰',
          options: ['⏰', '📻', '📺', '🔦'],
        },
        {
          id: 203,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🪥',
          correct: '🪥',
          options: ['🪥', '🧴', '🪮', '🧽'],
        },
        {
          id: 204,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🔑',
          correct: '🔑',
          options: ['🔑', '🪙', '📎', '🔔'],
        },
        {
          id: 205,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🪑',
          correct: '🪑',
          options: ['🪑', '🚪', '🛏️', '🪟'],
        },
        {
          id: 206,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🛏️',
          correct: '🛏️',
          options: ['🛏️', '🪑', '🚪', '🧸'],
        },
      ],
    },
  
    kitchen: {
      label: 'Đồ dùng nhà bếp',
      icon: '🍽️',
      questions: [
        {
          id: 301,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🥄',
          correct: '🥄',
          options: ['🥄', '🍴', '🫖', '🥣'],
        },
        {
          id: 302,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🍴',
          correct: '🍴',
          options: ['🥄', '🍴', '🫗', '🥢'],
        },
        {
          id: 303,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🥣',
          correct: '🥣',
          options: ['🍽️', '🥣', '☕', '🫙'],
        },
        {
          id: 304,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '☕',
          correct: '☕',
          options: ['☕', '🫖', '🥤', '🍶'],
        },
        {
          id: 305,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🫖',
          correct: '🫖',
          options: ['🫖', '☕', '🥣', '🫙'],
        },
        {
          id: 306,
          prompt: 'Hãy chọn đúng đồ vật khớp với hình bóng',
          shadow: '🍽️',
          correct: '🍽️',
          options: ['🍽️', '🥣', '🍴', '🥄'],
        },
      ],
    },
  };
  
  export const shadowMatchCategories = Object.entries(shadowMatchData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );
  