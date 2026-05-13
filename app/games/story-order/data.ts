export type StoryOrderStep = {
  emoji: string;
  label: string;
};

export type StoryOrderQuestion = {
  id: number;
  title: string;
  hint: string;
  steps: StoryOrderStep[];
};

export type StoryOrderTheme = {
  key: string;
  label: string;
  icon: string;
  description: string;
  questions: StoryOrderQuestion[];
};

export const storyOrderThemes: StoryOrderTheme[] = [
  {
    key: 'nature',
    label: 'Thiên nhiên kỳ thú',
    icon: '🌱',
    description: 'Cây cối, hoa, động vật lớn lên thế nào?',
    questions: [
      {
        id: 1,
        title: 'Hạt giống lớn thành cây',
        hint: 'Cây cần thời gian để lớn lên.',
        steps: [
          { emoji: '🌰', label: 'Hạt giống' },
          { emoji: '🌱', label: 'Mầm cây nhỏ' },
          { emoji: '🌿', label: 'Cây non có lá' },
          { emoji: '🌳', label: 'Cây trưởng thành' },
        ],
      },
      {
        id: 2,
        title: 'Con bướm xinh đẹp',
        hint: 'Bướm trải qua nhiều giai đoạn.',
        steps: [
          { emoji: '🥚', label: 'Quả trứng' },
          { emoji: '🐛', label: 'Sâu nhỏ' },
          { emoji: '🪺', label: 'Kén' },
          { emoji: '🦋', label: 'Bướm xinh' },
        ],
      },
      {
        id: 3,
        title: 'Một bông hoa nở',
        hint: 'Hoa lớn lên từ hạt nhỏ.',
        steps: [
          { emoji: '🌰', label: 'Hạt giống' },
          { emoji: '🌱', label: 'Mầm nhú lên' },
          { emoji: '🌷', label: 'Nụ hoa' },
          { emoji: '🌻', label: 'Hoa nở rộ' },
        ],
      },
      {
        id: 4,
        title: 'Con gà con chào đời',
        hint: 'Gà mẹ ấp trứng nở ra gà con.',
        steps: [
          { emoji: '🐔', label: 'Gà mẹ' },
          { emoji: '🥚', label: 'Quả trứng' },
          { emoji: '🐣', label: 'Gà con nở' },
          { emoji: '🐥', label: 'Gà con lớn hơn' },
        ],
      },
    ],
  },
  {
    key: 'daily',
    label: 'Một ngày của bé',
    icon: '☀️',
    description: 'Các hoạt động hằng ngày của bé.',
    questions: [
      {
        id: 11,
        title: 'Một ngày trong tuần',
        hint: 'Buổi sáng đến buổi tối.',
        steps: [
          { emoji: '🌅', label: 'Buổi sáng' },
          { emoji: '☀️', label: 'Buổi trưa' },
          { emoji: '🌇', label: 'Buổi chiều' },
          { emoji: '🌙', label: 'Buổi tối' },
        ],
      },
      {
        id: 12,
        title: 'Bé đánh răng',
        hint: 'Trình tự giữ vệ sinh răng miệng.',
        steps: [
          { emoji: '🪥', label: 'Lấy bàn chải' },
          { emoji: '🧴', label: 'Bóp kem đánh răng' },
          { emoji: '😬', label: 'Đánh răng' },
          { emoji: '😁', label: 'Răng sạch bóng' },
        ],
      },
      {
        id: 13,
        title: 'Bé đi ngủ',
        hint: 'Trước khi đi ngủ bé làm gì?',
        steps: [
          { emoji: '🍽️', label: 'Ăn tối' },
          { emoji: '🛁', label: 'Tắm rửa' },
          { emoji: '📖', label: 'Đọc sách' },
          { emoji: '😴', label: 'Đi ngủ' },
        ],
      },
      {
        id: 14,
        title: 'Bé đi học',
        hint: 'Buổi sáng đi học của bé.',
        steps: [
          { emoji: '⏰', label: 'Thức dậy' },
          { emoji: '🥣', label: 'Ăn sáng' },
          { emoji: '🎒', label: 'Đeo cặp' },
          { emoji: '🏫', label: 'Đến trường' },
        ],
      },
    ],
  },
  {
    key: 'cooking',
    label: 'Bé phụ bếp',
    icon: '🍳',
    description: 'Các bước làm món ăn đơn giản.',
    questions: [
      {
        id: 21,
        title: 'Làm bánh mì sandwich',
        hint: 'Từ bánh mì đến đĩa thơm ngon.',
        steps: [
          { emoji: '🍞', label: 'Lát bánh mì' },
          { emoji: '🧈', label: 'Phết bơ' },
          { emoji: '🥬', label: 'Thêm rau' },
          { emoji: '🥪', label: 'Sandwich hoàn thành' },
        ],
      },
      {
        id: 22,
        title: 'Rán trứng',
        hint: 'Từ quả trứng đến món trứng rán.',
        steps: [
          { emoji: '🥚', label: 'Quả trứng' },
          { emoji: '🍳', label: 'Đập vào chảo' },
          { emoji: '🔥', label: 'Đun nóng' },
          { emoji: '🍽️', label: 'Bày ra đĩa' },
        ],
      },
      {
        id: 23,
        title: 'Pha một ly nước cam',
        hint: 'Từ trái cam đến ly nước.',
        steps: [
          { emoji: '🍊', label: 'Trái cam' },
          { emoji: '🔪', label: 'Cắt đôi' },
          { emoji: '🥤', label: 'Vắt nước' },
          { emoji: '🧊', label: 'Thêm đá lạnh' },
        ],
      },
      {
        id: 24,
        title: 'Bé ăn bánh',
        hint: 'Từ bột mì đến bánh thơm.',
        steps: [
          { emoji: '🌾', label: 'Bột mì' },
          { emoji: '🥣', label: 'Trộn bột' },
          { emoji: '🎂', label: 'Nướng bánh' },
          { emoji: '😋', label: 'Bé thưởng thức' },
        ],
      },
    ],
  },
  {
    key: 'feelings',
    label: 'Câu chuyện cảm xúc',
    icon: '😊',
    description: 'Các bước của một câu chuyện ngắn.',
    questions: [
      {
        id: 31,
        title: 'Bé bị ngã',
        hint: 'Bé không sao đâu nhé.',
        steps: [
          { emoji: '🏃', label: 'Bé chạy' },
          { emoji: '😵', label: 'Bị ngã' },
          { emoji: '🩹', label: 'Mẹ dán băng' },
          { emoji: '😊', label: 'Bé vui trở lại' },
        ],
      },
      {
        id: 32,
        title: 'Trời mưa',
        hint: 'Trước, trong và sau cơn mưa.',
        steps: [
          { emoji: '☀️', label: 'Trời nắng' },
          { emoji: '☁️', label: 'Mây kéo đến' },
          { emoji: '🌧️', label: 'Trời mưa' },
          { emoji: '🌈', label: 'Cầu vồng xuất hiện' },
        ],
      },
      {
        id: 33,
        title: 'Bé giúp bạn',
        hint: 'Bạn ngã, bé sẽ làm gì?',
        steps: [
          { emoji: '🚶', label: 'Bạn đi bộ' },
          { emoji: '😢', label: 'Bạn bị ngã' },
          { emoji: '🤝', label: 'Bé đến giúp' },
          { emoji: '🥰', label: 'Hai bạn vui vẻ' },
        ],
      },
      {
        id: 34,
        title: 'Cây sinh nhật',
        hint: 'Bé tổ chức sinh nhật.',
        steps: [
          { emoji: '💌', label: 'Mời bạn bè' },
          { emoji: '🎂', label: 'Bày bánh' },
          { emoji: '🕯️', label: 'Thắp nến' },
          { emoji: '🎉', label: 'Cùng vui mừng' },
        ],
      },
    ],
  },
];
