export type SequenceCategory =
  | 'size'
  | 'length'
  | 'quantity'
  | 'brightness'
  | 'height';

export type SequenceLevel = 'easy' | 'medium' | 'hard';

export type SequenceItem = {
  id: string;
  label: string;
  value: number;
  emoji: string;
};

export type SequenceQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: SequenceLevel;
  category: SequenceCategory;
  direction: 'asc' | 'desc';
  items: SequenceItem[];
};

export const sequenceCategories = [
  { key: 'size', label: 'Kích thước', icon: '📦', total: 6 },
  { key: 'length', label: 'Chiều dài', icon: '📏', total: 6 },
  { key: 'quantity', label: 'Số lượng', icon: '🔢', total: 6 },
  { key: 'brightness', label: 'Độ sáng', icon: '💡', total: 6 },
  { key: 'height', label: 'Chiều cao', icon: '🏢', total: 6 },
] as const;

export const sequenceData: Record<
  SequenceCategory,
  {
    label: string;
    icon: string;
    questions: SequenceQuestion[];
  }
> = {
  size: {
    label: 'Kích thước',
    icon: '📦',
    questions: [
      {
        id: 'size-1',
        prompt: 'Hãy sắp xếp từ nhỏ đến lớn',
        hint: 'Nhìn kích thước từ bé tới to',
        level: 'easy',
        category: 'size',
        direction: 'asc',
        items: [
          { id: 's1', label: 'Nhỏ', value: 1, emoji: '⚪' },
          { id: 's2', label: 'Vừa', value: 2, emoji: '🟠' },
          { id: 's3', label: 'Lớn', value: 3, emoji: '🔴' },
        ],
      },
      {
        id: 'size-2',
        prompt: 'Hãy sắp xếp từ lớn đến nhỏ',
        hint: 'Đi từ to nhất đến nhỏ nhất',
        level: 'easy',
        category: 'size',
        direction: 'desc',
        items: [
          { id: 's4', label: 'Nhỏ', value: 1, emoji: '🫐' },
          { id: 's5', label: 'Vừa', value: 2, emoji: '🍊' },
          { id: 's6', label: 'Lớn', value: 3, emoji: '🍉' },
        ],
      },
      {
        id: 'size-3',
        prompt: 'Hãy sắp xếp từ nhỏ đến lớn',
        hint: 'So sánh kích thước đồ vật',
        level: 'medium',
        category: 'size',
        direction: 'asc',
        items: [
          { id: 's7', label: 'Cúc áo', value: 1, emoji: '🔘' },
          { id: 's8', label: 'Quả bóng', value: 2, emoji: '⚽' },
          { id: 's9', label: 'Xe hơi', value: 3, emoji: '🚗' },
          { id: 's10', label: 'Xe buýt', value: 4, emoji: '🚌' },
        ],
      },
      {
        id: 'size-4',
        prompt: 'Hãy sắp xếp từ lớn đến nhỏ',
        hint: 'Bắt đầu từ vật to hơn',
        level: 'medium',
        category: 'size',
        direction: 'desc',
        items: [
          { id: 's11', label: 'Con voi', value: 4, emoji: '🐘' },
          { id: 's12', label: 'Con chó', value: 3, emoji: '🐕' },
          { id: 's13', label: 'Con mèo', value: 2, emoji: '🐈' },
          { id: 's14', label: 'Con kiến', value: 1, emoji: '🐜' },
        ],
      },
      {
        id: 'size-5',
        prompt: 'Hãy sắp xếp từ nhỏ đến lớn',
        hint: 'Có 5 mức kích thước',
        level: 'hard',
        category: 'size',
        direction: 'asc',
        items: [
          { id: 's15', label: 'Hạt', value: 1, emoji: '🌰' },
          { id: 's16', label: 'Táo', value: 2, emoji: '🍎' },
          { id: 's17', label: 'Mũ', value: 3, emoji: '🧢' },
          { id: 's18', label: 'Ghế', value: 4, emoji: '🪑' },
          { id: 's19', label: 'Tủ', value: 5, emoji: '🗄️' },
        ],
      },
      {
        id: 'size-6',
        prompt: 'Hãy sắp xếp từ lớn đến nhỏ',
        hint: 'Nhìn thứ tự kích thước giảm dần',
        level: 'hard',
        category: 'size',
        direction: 'desc',
        items: [
          { id: 's20', label: 'Máy bay', value: 5, emoji: '✈️' },
          { id: 's21', label: 'Ô tô', value: 4, emoji: '🚗' },
          { id: 's22', label: 'Bánh xe', value: 3, emoji: '🛞' },
          { id: 's23', label: 'Quả bóng', value: 2, emoji: '🏀' },
          { id: 's24', label: 'Viên bi', value: 1, emoji: '⚫' },
        ],
      },
    ],
  },

  length: {
    label: 'Chiều dài',
    icon: '📏',
    questions: [
      {
        id: 'length-1',
        prompt: 'Hãy sắp xếp từ ngắn đến dài',
        hint: 'Nhìn độ dài của các vạch',
        level: 'easy',
        category: 'length',
        direction: 'asc',
        items: [
          { id: 'l1', label: 'Ngắn', value: 1, emoji: '🟦' },
          { id: 'l2', label: 'Vừa', value: 2, emoji: '🟦🟦' },
          { id: 'l3', label: 'Dài', value: 3, emoji: '🟦🟦🟦' },
        ],
      },
      {
        id: 'length-2',
        prompt: 'Hãy sắp xếp từ dài đến ngắn',
        hint: 'Bắt đầu từ vật dài nhất',
        level: 'easy',
        category: 'length',
        direction: 'desc',
        items: [
          { id: 'l4', label: 'Dây dài', value: 3, emoji: '〰️〰️〰️' },
          { id: 'l5', label: 'Dây vừa', value: 2, emoji: '〰️〰️' },
          { id: 'l6', label: 'Dây ngắn', value: 1, emoji: '〰️' },
        ],
      },
      {
        id: 'length-3',
        prompt: 'Hãy sắp xếp từ ngắn đến dài',
        hint: 'So sánh chiều dài đồ vật',
        level: 'medium',
        category: 'length',
        direction: 'asc',
        items: [
          { id: 'l7', label: 'Bút chì', value: 1, emoji: '✏️' },
          { id: 'l8', label: 'Thước', value: 2, emoji: '📏' },
          { id: 'l9', label: 'Cây gậy', value: 3, emoji: '🪄' },
          { id: 'l10', label: 'Sợi dây', value: 4, emoji: '🪢' },
        ],
      },
      {
        id: 'length-4',
        prompt: 'Hãy sắp xếp từ dài đến ngắn',
        hint: 'Nhìn chiều dài giảm dần',
        level: 'hard',
        category: 'length',
        direction: 'desc',
        items: [
          { id: 'l11', label: 'Con đường', value: 5, emoji: '🛣️' },
          { id: 'l12', label: 'Cây cầu', value: 4, emoji: '🌉' },
          { id: 'l13', label: 'Cành cây', value: 3, emoji: '🌿' },
          { id: 'l14', label: 'Bút', value: 2, emoji: '🖊️' },
          { id: 'l15', label: 'Viên phấn', value: 1, emoji: '▫️' },
        ],
      },
      {
        id: 'length-5',
        prompt: 'Hãy sắp xếp từ ngắn đến dài',
        hint: 'Có 4 vật cần xếp',
        level: 'medium',
        category: 'length',
        direction: 'asc',
        items: [
          { id: 'l16', label: 'Que tăm', value: 1, emoji: '🪵' },
          { id: 'l17', label: 'Muỗng', value: 2, emoji: '🥄' },
          { id: 'l18', label: 'Ô', value: 3, emoji: '☂️' },
          { id: 'l19', label: 'Cột đèn', value: 4, emoji: '💡' },
        ],
      },
      {
        id: 'length-6',
        prompt: 'Hãy sắp xếp từ dài đến ngắn',
        hint: 'So sánh các vật thật kỹ',
        level: 'hard',
        category: 'length',
        direction: 'desc',
        items: [
          { id: 'l20', label: 'Tàu hỏa', value: 5, emoji: '🚂' },
          { id: 'l21', label: 'Xe buýt', value: 4, emoji: '🚌' },
          { id: 'l22', label: 'Xe đạp', value: 3, emoji: '🚲' },
          { id: 'l23', label: 'Giày', value: 2, emoji: '👟' },
          { id: 'l24', label: 'Bút màu', value: 1, emoji: '🖍️' },
        ],
      },
    ],
  },

  quantity: {
    label: 'Số lượng',
    icon: '🔢',
    questions: [
      {
        id: 'quantity-1',
        prompt: 'Hãy sắp xếp từ ít đến nhiều',
        hint: 'Nhìn số lượng hình tròn',
        level: 'easy',
        category: 'quantity',
        direction: 'asc',
        items: [
          { id: 'q1', label: '1 quả', value: 1, emoji: '🍎' },
          { id: 'q2', label: '2 quả', value: 2, emoji: '🍎🍎' },
          { id: 'q3', label: '3 quả', value: 3, emoji: '🍎🍎🍎' },
        ],
      },
      {
        id: 'quantity-2',
        prompt: 'Hãy sắp xếp từ nhiều đến ít',
        hint: 'Bắt đầu từ nhóm đông hơn',
        level: 'easy',
        category: 'quantity',
        direction: 'desc',
        items: [
          { id: 'q4', label: '4 ngôi sao', value: 4, emoji: '⭐️⭐️⭐️⭐️' },
          { id: 'q5', label: '3 ngôi sao', value: 3, emoji: '⭐️⭐️⭐️' },
          { id: 'q6', label: '2 ngôi sao', value: 2, emoji: '⭐️⭐️' },
        ],
      },
      {
        id: 'quantity-3',
        prompt: 'Hãy sắp xếp từ ít đến nhiều',
        hint: 'Nhìn số lượng con vật',
        level: 'medium',
        category: 'quantity',
        direction: 'asc',
        items: [
          { id: 'q7', label: '1 con cá', value: 1, emoji: '🐟' },
          { id: 'q8', label: '2 con cá', value: 2, emoji: '🐟🐟' },
          { id: 'q9', label: '3 con cá', value: 3, emoji: '🐟🐟🐟' },
          { id: 'q10', label: '4 con cá', value: 4, emoji: '🐟🐟🐟🐟' },
        ],
      },
      {
        id: 'quantity-4',
        prompt: 'Hãy sắp xếp từ nhiều đến ít',
        hint: 'Quan sát thật kỹ số lượng',
        level: 'medium',
        category: 'quantity',
        direction: 'desc',
        items: [
          { id: 'q11', label: '5 bông hoa', value: 5, emoji: '🌸🌸🌸🌸🌸' },
          { id: 'q12', label: '4 bông hoa', value: 4, emoji: '🌸🌸🌸🌸' },
          { id: 'q13', label: '3 bông hoa', value: 3, emoji: '🌸🌸🌸' },
          { id: 'q14', label: '2 bông hoa', value: 2, emoji: '🌸🌸' },
        ],
      },
      {
        id: 'quantity-5',
        prompt: 'Hãy sắp xếp từ ít đến nhiều',
        hint: 'Có 5 nhóm số lượng',
        level: 'hard',
        category: 'quantity',
        direction: 'asc',
        items: [
          { id: 'q15', label: '1 bóng', value: 1, emoji: '🎈' },
          { id: 'q16', label: '2 bóng', value: 2, emoji: '🎈🎈' },
          { id: 'q17', label: '3 bóng', value: 3, emoji: '🎈🎈🎈' },
          { id: 'q18', label: '4 bóng', value: 4, emoji: '🎈🎈🎈🎈' },
          { id: 'q19', label: '5 bóng', value: 5, emoji: '🎈🎈🎈🎈🎈' },
        ],
      },
      {
        id: 'quantity-6',
        prompt: 'Hãy sắp xếp từ nhiều đến ít',
        hint: 'Nhìn từ nhóm đông nhất xuống ít nhất',
        level: 'hard',
        category: 'quantity',
        direction: 'desc',
        items: [
          { id: 'q20', label: '6 khối', value: 6, emoji: '🟦🟦🟦🟦🟦🟦' },
          { id: 'q21', label: '5 khối', value: 5, emoji: '🟦🟦🟦🟦🟦' },
          { id: 'q22', label: '4 khối', value: 4, emoji: '🟦🟦🟦🟦' },
          { id: 'q23', label: '3 khối', value: 3, emoji: '🟦🟦🟦' },
          { id: 'q24', label: '2 khối', value: 2, emoji: '🟦🟦' },
        ],
      },
    ],
  },

  brightness: {
    label: 'Độ sáng',
    icon: '💡',
    questions: [
      {
        id: 'bright-1',
        prompt: 'Hãy sắp xếp từ tối đến sáng',
        hint: 'Nhìn độ sáng tăng dần',
        level: 'easy',
        category: 'brightness',
        direction: 'asc',
        items: [
          { id: 'b1', label: 'Tối', value: 1, emoji: '🌑' },
          { id: 'b2', label: 'Vừa', value: 2, emoji: '🌓' },
          { id: 'b3', label: 'Sáng', value: 3, emoji: '🌕' },
        ],
      },
      {
        id: 'bright-2',
        prompt: 'Hãy sắp xếp từ sáng đến tối',
        hint: 'Bắt đầu từ sáng nhất',
        level: 'easy',
        category: 'brightness',
        direction: 'desc',
        items: [
          { id: 'b4', label: 'Rất sáng', value: 3, emoji: '💡' },
          { id: 'b5', label: 'Sáng vừa', value: 2, emoji: '🕯️' },
          { id: 'b6', label: 'Tối', value: 1, emoji: '⚫' },
        ],
      },
      {
        id: 'bright-3',
        prompt: 'Hãy sắp xếp từ tối đến sáng',
        hint: 'Quan sát bầu trời',
        level: 'medium',
        category: 'brightness',
        direction: 'asc',
        items: [
          { id: 'b7', label: 'Đêm', value: 1, emoji: '🌌' },
          { id: 'b8', label: 'Bình minh', value: 2, emoji: '🌅' },
          { id: 'b9', label: 'Ban ngày', value: 3, emoji: '☀️' },
          { id: 'b10', label: 'Nắng gắt', value: 4, emoji: '🌞' },
        ],
      },
      {
        id: 'bright-4',
        prompt: 'Hãy sắp xếp từ sáng đến tối',
        hint: 'Độ sáng giảm dần',
        level: 'hard',
        category: 'brightness',
        direction: 'desc',
        items: [
          { id: 'b11', label: 'Mặt trời', value: 5, emoji: '☀️' },
          { id: 'b12', label: 'Đèn điện', value: 4, emoji: '💡' },
          { id: 'b13', label: 'Nến', value: 3, emoji: '🕯️' },
          { id: 'b14', label: 'Hoàng hôn', value: 2, emoji: '🌇' },
          { id: 'b15', label: 'Đêm tối', value: 1, emoji: '🌑' },
        ],
      },
      {
        id: 'bright-5',
        prompt: 'Hãy sắp xếp từ tối đến sáng',
        hint: 'Có 4 mức độ sáng',
        level: 'medium',
        category: 'brightness',
        direction: 'asc',
        items: [
          { id: 'b16', label: 'Rất tối', value: 1, emoji: '⚫' },
          { id: 'b17', label: 'Tối vừa', value: 2, emoji: '🌘' },
          { id: 'b18', label: 'Hơi sáng', value: 3, emoji: '🌔' },
          { id: 'b19', label: 'Rất sáng', value: 4, emoji: '🌕' },
        ],
      },
      {
        id: 'bright-6',
        prompt: 'Hãy sắp xếp từ sáng đến tối',
        hint: 'So sánh cường độ ánh sáng',
        level: 'hard',
        category: 'brightness',
        direction: 'desc',
        items: [
          { id: 'b20', label: 'Ánh đèn sân khấu', value: 5, emoji: '🔦' },
          { id: 'b21', label: 'Đèn học', value: 4, emoji: '💡' },
          { id: 'b22', label: 'Đèn ngủ', value: 3, emoji: '🛋️' },
          { id: 'b23', label: 'Trăng mờ', value: 2, emoji: '🌙' },
          { id: 'b24', label: 'Bóng tối', value: 1, emoji: '⬛' },
        ],
      },
    ],
  },

  height: {
    label: 'Chiều cao',
    icon: '🏢',
    questions: [
      {
        id: 'height-1',
        prompt: 'Hãy sắp xếp từ thấp đến cao',
        hint: 'Nhìn chiều cao tăng dần',
        level: 'easy',
        category: 'height',
        direction: 'asc',
        items: [
          { id: 'h1', label: 'Thấp', value: 1, emoji: '🪵' },
          { id: 'h2', label: 'Vừa', value: 2, emoji: '🪑' },
          { id: 'h3', label: 'Cao', value: 3, emoji: '🧍' },
        ],
      },
      {
        id: 'height-2',
        prompt: 'Hãy sắp xếp từ cao đến thấp',
        hint: 'Bắt đầu từ vật cao nhất',
        level: 'easy',
        category: 'height',
        direction: 'desc',
        items: [
          { id: 'h4', label: 'Hươu cao cổ', value: 3, emoji: '🦒' },
          { id: 'h5', label: 'Con chó', value: 2, emoji: '🐕' },
          { id: 'h6', label: 'Con nhím', value: 1, emoji: '🦔' },
        ],
      },
      {
        id: 'height-3',
        prompt: 'Hãy sắp xếp từ thấp đến cao',
        hint: 'So sánh chiều cao các vật',
        level: 'medium',
        category: 'height',
        direction: 'asc',
        items: [
          { id: 'h7', label: 'Hòn đá', value: 1, emoji: '🪨' },
          { id: 'h8', label: 'Bàn', value: 2, emoji: '🪑' },
          { id: 'h9', label: 'Người', value: 3, emoji: '🧍' },
          { id: 'h10', label: 'Cây', value: 4, emoji: '🌳' },
        ],
      },
      {
        id: 'height-4',
        prompt: 'Hãy sắp xếp từ cao đến thấp',
        hint: 'Chiều cao giảm dần',
        level: 'medium',
        category: 'height',
        direction: 'desc',
        items: [
          { id: 'h11', label: 'Tòa nhà', value: 4, emoji: '🏢' },
          { id: 'h12', label: 'Cột điện', value: 3, emoji: '🪧' },
          { id: 'h13', label: 'Người', value: 2, emoji: '🧍' },
          { id: 'h14', label: 'Quả bóng', value: 1, emoji: '⚽' },
        ],
      },
      {
        id: 'height-5',
        prompt: 'Hãy sắp xếp từ thấp đến cao',
        hint: 'Có 5 mức chiều cao',
        level: 'hard',
        category: 'height',
        direction: 'asc',
        items: [
          { id: 'h15', label: 'Nấm', value: 1, emoji: '🍄' },
          { id: 'h16', label: 'Mèo', value: 2, emoji: '🐈' },
          { id: 'h17', label: 'Bé', value: 3, emoji: '🧒' },
          { id: 'h18', label: 'Người lớn', value: 4, emoji: '🧑' },
          { id: 'h19', label: 'Hươu cao cổ', value: 5, emoji: '🦒' },
        ],
      },
      {
        id: 'height-6',
        prompt: 'Hãy sắp xếp từ cao đến thấp',
        hint: 'Bắt đầu từ vật cao nhất',
        level: 'hard',
        category: 'height',
        direction: 'desc',
        items: [
          { id: 'h20', label: 'Núi', value: 5, emoji: '⛰️' },
          { id: 'h21', label: 'Cây dừa', value: 4, emoji: '🌴' },
          { id: 'h22', label: 'Người', value: 3, emoji: '🧍' },
          { id: 'h23', label: 'Ghế', value: 2, emoji: '🪑' },
          { id: 'h24', label: 'Giày', value: 1, emoji: '👟' },
        ],
      },
    ],
  },
};
