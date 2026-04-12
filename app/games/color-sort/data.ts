export type ColorSortQuestion = {
    id: number;
    prompt: string;
    targetColor: string;
    targetLabel: string;
    options: {
      emoji: string;
      label: string;
      color: string;
    }[];
    correct: string;
  };
  
  export type ColorSortCategory = {
    label: string;
    icon: string;
    questions: ColorSortQuestion[];
  };
  
  export const colorSortData: Record<string, ColorSortCategory> = {
    fruits: {
      label: 'Trái cây',
      icon: '🍎',
      questions: [
        {
          id: 1,
          prompt: 'Hãy chọn đồ vật có màu đỏ',
          targetColor: 'Đỏ',
          targetLabel: 'đỏ',
          correct: '🍎',
          options: [
            { emoji: '🍎', label: 'Táo', color: 'đỏ' },
            { emoji: '🍌', label: 'Chuối', color: 'vàng' },
            { emoji: '🥝', label: 'Kiwi', color: 'xanh lá' },
            { emoji: '🍇', label: 'Nho', color: 'tím' },
          ],
        },
        {
          id: 2,
          prompt: 'Hãy chọn đồ vật có màu vàng',
          targetColor: 'Vàng',
          targetLabel: 'vàng',
          correct: '🍌',
          options: [
            { emoji: '🍓', label: 'Dâu', color: 'đỏ' },
            { emoji: '🍌', label: 'Chuối', color: 'vàng' },
            { emoji: '🍐', label: 'Lê', color: 'xanh lá' },
            { emoji: '🫐', label: 'Việt quất', color: 'xanh dương' },
          ],
        },
        {
          id: 3,
          prompt: 'Hãy chọn đồ vật có màu xanh lá',
          targetColor: 'Xanh lá',
          targetLabel: 'xanh lá',
          correct: '🥝',
          options: [
            { emoji: '🍊', label: 'Cam', color: 'cam' },
            { emoji: '🥝', label: 'Kiwi', color: 'xanh lá' },
            { emoji: '🍎', label: 'Táo', color: 'đỏ' },
            { emoji: '🍇', label: 'Nho', color: 'tím' },
          ],
        },
        {
          id: 4,
          prompt: 'Hãy chọn đồ vật có màu tím',
          targetColor: 'Tím',
          targetLabel: 'tím',
          correct: '🍇',
          options: [
            { emoji: '🍋', label: 'Chanh', color: 'vàng' },
            { emoji: '🍇', label: 'Nho', color: 'tím' },
            { emoji: '🍎', label: 'Táo', color: 'đỏ' },
            { emoji: '🥥', label: 'Dừa', color: 'nâu' },
          ],
        },
        {
          id: 5,
          prompt: 'Hãy chọn đồ vật có màu cam',
          targetColor: 'Cam',
          targetLabel: 'cam',
          correct: '🍊',
          options: [
            { emoji: '🍊', label: 'Cam', color: 'cam' },
            { emoji: '🍐', label: 'Lê', color: 'xanh lá' },
            { emoji: '🍎', label: 'Táo', color: 'đỏ' },
            { emoji: '🫐', label: 'Việt quất', color: 'xanh dương' },
          ],
        },
        {
          id: 6,
          prompt: 'Hãy chọn đồ vật có màu xanh dương',
          targetColor: 'Xanh dương',
          targetLabel: 'xanh dương',
          correct: '🫐',
          options: [
            { emoji: '🍋', label: 'Chanh', color: 'vàng' },
            { emoji: '🫐', label: 'Việt quất', color: 'xanh dương' },
            { emoji: '🍓', label: 'Dâu', color: 'đỏ' },
            { emoji: '🍇', label: 'Nho', color: 'tím' },
          ],
        },
      ],
    },
  
    objects: {
      label: 'Đồ vật quen thuộc',
      icon: '🎨',
      questions: [
        {
          id: 101,
          prompt: 'Hãy chọn đồ vật có màu đỏ',
          targetColor: 'Đỏ',
          targetLabel: 'đỏ',
          correct: '🎈',
          options: [
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
            { emoji: '🧢', label: 'Mũ', color: 'xanh dương' },
            { emoji: '📗', label: 'Sách', color: 'xanh lá' },
            { emoji: '⭐', label: 'Sao', color: 'vàng' },
          ],
        },
        {
          id: 102,
          prompt: 'Hãy chọn đồ vật có màu xanh dương',
          targetColor: 'Xanh dương',
          targetLabel: 'xanh dương',
          correct: '🧢',
          options: [
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
            { emoji: '🧢', label: 'Mũ', color: 'xanh dương' },
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
            { emoji: '🍀', label: 'Lá', color: 'xanh lá' },
          ],
        },
        {
          id: 103,
          prompt: 'Hãy chọn đồ vật có màu vàng',
          targetColor: 'Vàng',
          targetLabel: 'vàng',
          correct: '⭐',
          options: [
            { emoji: '⭐', label: 'Ngôi sao', color: 'vàng' },
            { emoji: '💜', label: 'Trái tim', color: 'tím' },
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
            { emoji: '🧢', label: 'Mũ', color: 'xanh dương' },
          ],
        },
        {
          id: 104,
          prompt: 'Hãy chọn đồ vật có màu xanh lá',
          targetColor: 'Xanh lá',
          targetLabel: 'xanh lá',
          correct: '🍀',
          options: [
            { emoji: '🍀', label: 'Lá', color: 'xanh lá' },
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
            { emoji: '⭐', label: 'Ngôi sao', color: 'vàng' },
            { emoji: '💜', label: 'Trái tim', color: 'tím' },
          ],
        },
        {
          id: 105,
          prompt: 'Hãy chọn đồ vật có màu tím',
          targetColor: 'Tím',
          targetLabel: 'tím',
          correct: '💜',
          options: [
            { emoji: '🧢', label: 'Mũ', color: 'xanh dương' },
            { emoji: '💜', label: 'Trái tim', color: 'tím' },
            { emoji: '⭐', label: 'Ngôi sao', color: 'vàng' },
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
          ],
        },
        {
          id: 106,
          prompt: 'Hãy chọn đồ vật có màu xanh lá',
          targetColor: 'Xanh lá',
          targetLabel: 'xanh lá',
          correct: '📗',
          options: [
            { emoji: '📗', label: 'Sách', color: 'xanh lá' },
            { emoji: '🎈', label: 'Bóng bay', color: 'đỏ' },
            { emoji: '⭐', label: 'Ngôi sao', color: 'vàng' },
            { emoji: '🧢', label: 'Mũ', color: 'xanh dương' },
          ],
        },
      ],
    },
  
    animals: {
      label: 'Con vật',
      icon: '🐠',
      questions: [
        {
          id: 201,
          prompt: 'Hãy chọn con vật có màu vàng',
          targetColor: 'Vàng',
          targetLabel: 'vàng',
          correct: '🐥',
          options: [
            { emoji: '🐥', label: 'Gà con', color: 'vàng' },
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
            { emoji: '🐞', label: 'Bọ rùa', color: 'đỏ' },
          ],
        },
        {
          id: 202,
          prompt: 'Hãy chọn con vật có màu xanh lá',
          targetColor: 'Xanh lá',
          targetLabel: 'xanh lá',
          correct: '🐸',
          options: [
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
            { emoji: '🐥', label: 'Gà con', color: 'vàng' },
            { emoji: '🐞', label: 'Bọ rùa', color: 'đỏ' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
          ],
        },
        {
          id: 203,
          prompt: 'Hãy chọn con vật có màu đỏ',
          targetColor: 'Đỏ',
          targetLabel: 'đỏ',
          correct: '🐞',
          options: [
            { emoji: '🐞', label: 'Bọ rùa', color: 'đỏ' },
            { emoji: '🐥', label: 'Gà con', color: 'vàng' },
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
          ],
        },
        {
          id: 204,
          prompt: 'Hãy chọn con vật có màu xanh dương',
          targetColor: 'Xanh dương',
          targetLabel: 'xanh dương',
          correct: '🐳',
          options: [
            { emoji: '🐥', label: 'Gà con', color: 'vàng' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
            { emoji: '🐞', label: 'Bọ rùa', color: 'đỏ' },
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
          ],
        },
        {
          id: 205,
          prompt: 'Hãy chọn con vật có màu hồng',
          targetColor: 'Hồng',
          targetLabel: 'hồng',
          correct: '🐷',
          options: [
            { emoji: '🐷', label: 'Heo', color: 'hồng' },
            { emoji: '🐥', label: 'Gà con', color: 'vàng' },
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
          ],
        },
        {
          id: 206,
          prompt: 'Hãy chọn con vật có màu cam',
          targetColor: 'Cam',
          targetLabel: 'cam',
          correct: '🦊',
          options: [
            { emoji: '🦊', label: 'Cáo', color: 'cam' },
            { emoji: '🐷', label: 'Heo', color: 'hồng' },
            { emoji: '🐸', label: 'Ếch', color: 'xanh lá' },
            { emoji: '🐳', label: 'Cá voi', color: 'xanh dương' },
          ],
        },
      ],
    },
  
    shapes: {
      label: 'Hình khối',
      icon: '🟡',
      questions: [
        {
          id: 301,
          prompt: 'Hãy chọn hình có màu vàng',
          targetColor: 'Vàng',
          targetLabel: 'vàng',
          correct: '🟡',
          options: [
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
            { emoji: '🔺', label: 'Tam giác', color: 'đỏ' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🟩', label: 'Hình chữ nhật', color: 'xanh lá' },
          ],
        },
        {
          id: 302,
          prompt: 'Hãy chọn hình có màu đỏ',
          targetColor: 'Đỏ',
          targetLabel: 'đỏ',
          correct: '🔺',
          options: [
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
            { emoji: '🔺', label: 'Tam giác', color: 'đỏ' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🟪', label: 'Hình vuông', color: 'tím' },
          ],
        },
        {
          id: 303,
          prompt: 'Hãy chọn hình có màu xanh dương',
          targetColor: 'Xanh dương',
          targetLabel: 'xanh dương',
          correct: '🟦',
          options: [
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🔺', label: 'Tam giác', color: 'đỏ' },
            { emoji: '🟩', label: 'Hình chữ nhật', color: 'xanh lá' },
          ],
        },
        {
          id: 304,
          prompt: 'Hãy chọn hình có màu xanh lá',
          targetColor: 'Xanh lá',
          targetLabel: 'xanh lá',
          correct: '🟩',
          options: [
            { emoji: '🟩', label: 'Hình chữ nhật', color: 'xanh lá' },
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🔺', label: 'Tam giác', color: 'đỏ' },
          ],
        },
        {
          id: 305,
          prompt: 'Hãy chọn hình có màu tím',
          targetColor: 'Tím',
          targetLabel: 'tím',
          correct: '🟪',
          options: [
            { emoji: '🟪', label: 'Hình vuông', color: 'tím' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🔺', label: 'Tam giác', color: 'đỏ' },
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
          ],
        },
        {
          id: 306,
          prompt: 'Hãy chọn hình có màu cam',
          targetColor: 'Cam',
          targetLabel: 'cam',
          correct: '🟧',
          options: [
            { emoji: '🟧', label: 'Hình vuông', color: 'cam' },
            { emoji: '🟩', label: 'Hình chữ nhật', color: 'xanh lá' },
            { emoji: '🟦', label: 'Hình vuông', color: 'xanh dương' },
            { emoji: '🟡', label: 'Hình tròn', color: 'vàng' },
          ],
        },
      ],
    },
  };
  
  export const colorSortCategories = Object.entries(colorSortData).map(
    ([key, value]) => ({
      key,
      label: value.label,
      icon: value.icon,
      total: value.questions.length,
    })
  );
  