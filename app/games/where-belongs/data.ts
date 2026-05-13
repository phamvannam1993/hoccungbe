export type WhereBelongsPlaceKey =
  | 'kitchen'
  | 'school'
  | 'beach'
  | 'zoo'
  | 'park'
  | 'bathroom';

export type WhereBelongsPlace = {
  key: WhereBelongsPlaceKey;
  label: string;
  icon: string;
  colorClass: string;
  description: string;
};

export type WhereBelongsQuestion = {
  id: number;
  item: string;
  itemLabel: string;
  correctPlace: WhereBelongsPlaceKey;
};

export type WhereBelongsTheme = {
  key: string;
  label: string;
  icon: string;
  description: string;
  places: WhereBelongsPlaceKey[];
  questions: WhereBelongsQuestion[];
};

export const whereBelongsPlaces: Record<WhereBelongsPlaceKey, WhereBelongsPlace> = {
  kitchen: {
    key: 'kitchen',
    label: 'Nhà bếp',
    icon: '🍳',
    colorClass: 'from-orange-300 to-rose-400',
    description: 'Nơi nấu ăn của cả nhà.',
  },
  school: {
    key: 'school',
    label: 'Trường học',
    icon: '🏫',
    colorClass: 'from-sky-300 to-indigo-400',
    description: 'Nơi bé đi học mỗi ngày.',
  },
  beach: {
    key: 'beach',
    label: 'Bãi biển',
    icon: '🏖️',
    colorClass: 'from-cyan-300 to-blue-400',
    description: 'Nơi có cát, sóng và nắng.',
  },
  zoo: {
    key: 'zoo',
    label: 'Sở thú',
    icon: '🦁',
    colorClass: 'from-amber-300 to-orange-400',
    description: 'Nơi có nhiều con vật.',
  },
  park: {
    key: 'park',
    label: 'Công viên',
    icon: '🌳',
    colorClass: 'from-emerald-300 to-teal-400',
    description: 'Nơi vui chơi ngoài trời.',
  },
  bathroom: {
    key: 'bathroom',
    label: 'Phòng tắm',
    icon: '🛁',
    colorClass: 'from-violet-300 to-pink-400',
    description: 'Nơi bé tắm rửa và giữ vệ sinh.',
  },
};

export const whereBelongsThemes: WhereBelongsTheme[] = [
  {
    key: 'home',
    label: 'Quanh nhà của bé',
    icon: '🏡',
    description: 'Phân loại đồ vật trong nhà bếp và phòng tắm.',
    places: ['kitchen', 'bathroom'],
    questions: [
      { id: 1, item: '🍳', itemLabel: 'cái chảo', correctPlace: 'kitchen' },
      { id: 2, item: '🪥', itemLabel: 'bàn chải đánh răng', correctPlace: 'bathroom' },
      { id: 3, item: '🥄', itemLabel: 'cái thìa', correctPlace: 'kitchen' },
      { id: 4, item: '🧼', itemLabel: 'bánh xà phòng', correctPlace: 'bathroom' },
      { id: 5, item: '🫖', itemLabel: 'ấm trà', correctPlace: 'kitchen' },
      { id: 6, item: '🚿', itemLabel: 'vòi hoa sen', correctPlace: 'bathroom' },
      { id: 7, item: '🍽️', itemLabel: 'cái đĩa', correctPlace: 'kitchen' },
      { id: 8, item: '🧴', itemLabel: 'chai dầu gội', correctPlace: 'bathroom' },
    ],
  },
  {
    key: 'learn-play',
    label: 'Học và chơi',
    icon: '🎒',
    description: 'Phân loại đồ vật ở trường học và công viên.',
    places: ['school', 'park'],
    questions: [
      { id: 11, item: '✏️', itemLabel: 'bút chì', correctPlace: 'school' },
      { id: 12, item: '🛝', itemLabel: 'cầu trượt', correctPlace: 'park' },
      { id: 13, item: '📚', itemLabel: 'sách', correctPlace: 'school' },
      { id: 14, item: '🌳', itemLabel: 'cây xanh', correctPlace: 'park' },
      { id: 15, item: '📐', itemLabel: 'thước kẻ', correctPlace: 'school' },
      { id: 16, item: '🎠', itemLabel: 'ngựa quay', correctPlace: 'park' },
      { id: 17, item: '🖍️', itemLabel: 'bút sáp', correctPlace: 'school' },
      { id: 18, item: '🌷', itemLabel: 'bông hoa', correctPlace: 'park' },
    ],
  },
  {
    key: 'outside',
    label: 'Đi chơi xa',
    icon: '🚌',
    description: 'Phân loại đồ vật ở bãi biển và sở thú.',
    places: ['beach', 'zoo'],
    questions: [
      { id: 21, item: '🐚', itemLabel: 'vỏ sò', correctPlace: 'beach' },
      { id: 22, item: '🦒', itemLabel: 'hươu cao cổ', correctPlace: 'zoo' },
      { id: 23, item: '🏖️', itemLabel: 'cát biển', correctPlace: 'beach' },
      { id: 24, item: '🐘', itemLabel: 'con voi', correctPlace: 'zoo' },
      { id: 25, item: '🌊', itemLabel: 'sóng biển', correctPlace: 'beach' },
      { id: 26, item: '🦁', itemLabel: 'sư tử', correctPlace: 'zoo' },
      { id: 27, item: '⛱️', itemLabel: 'dù che nắng', correctPlace: 'beach' },
      { id: 28, item: '🐒', itemLabel: 'chú khỉ', correctPlace: 'zoo' },
    ],
  },
  {
    key: 'mixed',
    label: 'Thử thách trộn lẫn',
    icon: '🌈',
    description: 'Mọi địa điểm cùng xuất hiện — bé phân loại nhanh!',
    places: ['kitchen', 'school', 'beach', 'park'],
    questions: [
      { id: 31, item: '🍕', itemLabel: 'miếng pizza', correctPlace: 'kitchen' },
      { id: 32, item: '🎒', itemLabel: 'cặp sách', correctPlace: 'school' },
      { id: 33, item: '🏐', itemLabel: 'bóng chuyền', correctPlace: 'beach' },
      { id: 34, item: '🌻', itemLabel: 'hoa hướng dương', correctPlace: 'park' },
      { id: 35, item: '🔪', itemLabel: 'con dao', correctPlace: 'kitchen' },
      { id: 36, item: '📓', itemLabel: 'cuốn vở', correctPlace: 'school' },
      { id: 37, item: '🩴', itemLabel: 'dép xỏ ngón', correctPlace: 'beach' },
      { id: 38, item: '🦆', itemLabel: 'con vịt', correctPlace: 'park' },
    ],
  },
];
