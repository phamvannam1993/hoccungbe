export type InitialSoundCategory =
  | 'b'
  | 'c'
  | 'd'
  | 'dd'
  | 'g'
  | 'h'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'v'
  | 'x'
  | 'ch'
  | 'gh'
  | 'gi'
  | 'kh'
  | 'ng'
  | 'nh'
  | 'ph'
  | 'th'
  | 'tr';

export type InitialSoundLevel = 'easy' | 'medium' | 'hard';

export type InitialSoundQuestion = {
  id: string;
  prompt: string;
  hint: string;
  level: InitialSoundLevel;
  category: InitialSoundCategory;
  sound: string;
  correct: string;
  items: {
    id: string;
    label: string;
    emoji: string;
  }[];
};

type SoundWord = {
  label: string;
  emoji: string;
};

type SoundConfig = {
  key: InitialSoundCategory;
  label: string;
  icon: string;
  sound: string;
  words: SoundWord[];
};

const soundConfigs: SoundConfig[] = [
  {
    key: 'b',
    label: 'Âm bờ',
    icon: '🅱️',
    sound: 'bờ',
    words: [
      { label: 'Bóng', emoji: '⚽' },
      { label: 'Bàn', emoji: '🪑' },
      { label: 'Bút', emoji: '🖊️' },
      { label: 'Bắp', emoji: '🌽' },
      { label: 'Bé', emoji: '🧒' },
      { label: 'Bánh', emoji: '🍞' },
    ],
  },
  {
    key: 'c',
    label: 'Âm cờ',
    icon: '©️',
    sound: 'cờ',
    words: [
      { label: 'Cá', emoji: '🐟' },
      { label: 'Cam', emoji: '🍊' },
      { label: 'Cốc', emoji: '🥤' },
      { label: 'Cua', emoji: '🦀' },
      { label: 'Cầu', emoji: '🌉' },
      { label: 'Cửa', emoji: '🚪' },
    ],
  },
  {
    key: 'd',
    label: 'Âm dờ',
    icon: '🔤',
    sound: 'dờ',
    words: [
      { label: 'Dê', emoji: '🐐' },
      { label: 'Dưa', emoji: '🍉' },
      { label: 'Dép', emoji: '🩴' },
      { label: 'Dao', emoji: '🔪' },
      { label: 'Diều', emoji: '🪁' },
      { label: 'Dừa', emoji: '🥥' },
    ],
  },
  {
    key: 'dd',
    label: 'Âm đờ',
    icon: '🔡',
    sound: 'đờ',
    words: [
      { label: 'Đèn', emoji: '💡' },
      { label: 'Đồng hồ', emoji: '⏰' },
      { label: 'Đũa', emoji: '🥢' },
      { label: 'Đào', emoji: '🍑' },
      { label: 'Đầu', emoji: '👦' },
      { label: 'Đá', emoji: '🪨' },
    ],
  },
  {
    key: 'g',
    label: 'Âm gờ',
    icon: '🌀',
    sound: 'gờ',
    words: [
      { label: 'Gấu', emoji: '🐻' },
      { label: 'Gà', emoji: '🐔' },
      { label: 'Ghế', emoji: '🪑' },
      { label: 'Gối', emoji: '🛏️' },
      { label: 'Gương', emoji: '🪞' },
      { label: 'Giày', emoji: '👟' },
    ],
  },
  {
    key: 'h',
    label: 'Âm hờ',
    icon: '♓',
    sound: 'hờ',
    words: [
      { label: 'Hoa', emoji: '🌸' },
      { label: 'Hổ', emoji: '🐯' },
      { label: 'Hươu', emoji: '🦌' },
      { label: 'Hũ', emoji: '🫙' },
      { label: 'Hè', emoji: '🏖️' },
      { label: 'Hạt', emoji: '🌰' },
    ],
  },
  {
    key: 'k',
    label: 'Âm kờ',
    icon: '🎋',
    sound: 'kờ',
    words: [
      { label: 'Kem', emoji: '🍦' },
      { label: 'Kẹo', emoji: '🍬' },
      { label: 'Kéo', emoji: '✂️' },
      { label: 'Kim', emoji: '🪡' },
      { label: 'Kính', emoji: '🕶️' },
      { label: 'Kèn', emoji: '🎺' },
    ],
  },
  {
    key: 'l',
    label: 'Âm lờ',
    icon: '📏',
    sound: 'lờ',
    words: [
      { label: 'Lá', emoji: '🍃' },
      { label: 'Ly', emoji: '🥛' },
      { label: 'Lê', emoji: '🍐' },
      { label: 'Lược', emoji: '🪮' },
      { label: 'Lồng đèn', emoji: '🏮' },
      { label: 'Lợn', emoji: '🐷' },
    ],
  },
  {
    key: 'm',
    label: 'Âm mờ',
    icon: 'Ⓜ️',
    sound: 'mờ',
    words: [
      { label: 'Mèo', emoji: '🐱' },
      { label: 'Mũ', emoji: '🧢' },
      { label: 'Mưa', emoji: '🌧️' },
      { label: 'Mực', emoji: '🦑' },
      { label: 'Mâm', emoji: '🍽️' },
      { label: 'Miệng', emoji: '👄' },
    ],
  },
  {
    key: 'n',
    label: 'Âm nờ',
    icon: '🎶',
    sound: 'nờ',
    words: [
      { label: 'Nho', emoji: '🍇' },
      { label: 'Nấm', emoji: '🍄' },
      { label: 'Nón', emoji: '👒' },
      { label: 'Nai', emoji: '🦌' },
      { label: 'Nến', emoji: '🕯️' },
      { label: 'Nơ', emoji: '🎀' },
    ],
  },
  {
    key: 'p',
    label: 'Âm pờ',
    icon: '🅿️',
    sound: 'pờ',
    words: [
      { label: 'Pin', emoji: '🔋' },
      { label: 'Phao', emoji: '🛟' },
      { label: 'Piano', emoji: '🎹' },
      { label: 'Phích', emoji: '🫖' },
      { label: 'Pa tê', emoji: '🥪' },
      { label: 'Pô tô', emoji: '📸' },
    ],
  },
  {
    key: 'q',
    label: 'Âm quờ',
    icon: '👑',
    sound: 'quờ',
    words: [
      { label: 'Quả', emoji: '🍊' },
      { label: 'Quần', emoji: '👖' },
      { label: 'Quạt', emoji: '🪭' },
      { label: 'Quạ', emoji: '🐦' },
      { label: 'Quýt', emoji: '🍊' },
      { label: 'Quyển sách', emoji: '📘' },
    ],
  },
  {
    key: 'r',
    label: 'Âm rờ',
    icon: '🌈',
    sound: 'rờ',
    words: [
      { label: 'Rổ', emoji: '🧺' },
      { label: 'Rùa', emoji: '🐢' },
      { label: 'Răng', emoji: '🦷' },
      { label: 'Rừng', emoji: '🌳' },
      { label: 'Rau', emoji: '🥬' },
      { label: 'Rèm', emoji: '🪟' },
    ],
  },
  {
    key: 's',
    label: 'Âm sờ',
    icon: '⭐',
    sound: 'sờ',
    words: [
      { label: 'Sách', emoji: '📚' },
      { label: 'Sư tử', emoji: '🦁' },
      { label: 'Sen', emoji: '🪷' },
      { label: 'Sữa', emoji: '🥛' },
      { label: 'Sò', emoji: '🐚' },
      { label: 'Sao', emoji: '⭐' },
    ],
  },
  {
    key: 't',
    label: 'Âm tờ',
    icon: '✝️',
    sound: 'tờ',
    words: [
      { label: 'Táo', emoji: '🍎' },
      { label: 'Tủ', emoji: '🗄️' },
      { label: 'Tàu', emoji: '🚂' },
      { label: 'Tay', emoji: '✋' },
      { label: 'Thỏ', emoji: '🐰' },
      { label: 'Trăng', emoji: '🌙' },
    ],
  },
  {
    key: 'v',
    label: 'Âm vờ',
    icon: '✅',
    sound: 'vờ',
    words: [
      { label: 'Voi', emoji: '🐘' },
      { label: 'Vở', emoji: '📓' },
      { label: 'Váy', emoji: '👗' },
      { label: 'Vịt', emoji: '🦆' },
      { label: 'Vợt', emoji: '🏸' },
      { label: 'Vườn', emoji: '🌱' },
    ],
  },
  {
    key: 'x',
    label: 'Âm xờ',
    icon: '❎',
    sound: 'xờ',
    words: [
      { label: 'Xe', emoji: '🚗' },
      { label: 'Xà lách', emoji: '🥬' },
      { label: 'Xôi', emoji: '🍚' },
      { label: 'Xương', emoji: '🦴' },
      { label: 'Xích đu', emoji: '🛝' },
      { label: 'Xẻng', emoji: '🪏' },
    ],
  },
  {
    key: 'ch',
    label: 'Âm chờ',
    icon: '🧒',
    sound: 'chờ',
    words: [
      { label: 'Chó', emoji: '🐶' },
      { label: 'Chanh', emoji: '🍋' },
      { label: 'Chén', emoji: '🍚' },
      { label: 'Chim', emoji: '🐦' },
      { label: 'Chuối', emoji: '🍌' },
      { label: 'Chổi', emoji: '🧹' },
    ],
  },
  {
    key: 'gh',
    label: 'Âm gờ ghép',
    icon: '🪑',
    sound: 'gờ ghép',
    words: [
      { label: 'Ghế', emoji: '🪑' },
      { label: 'Ghi', emoji: '🎼' },
      { label: 'Ghim', emoji: '📌' },
      { label: 'Ghẹ', emoji: '🦀' },
      { label: 'Ghép hình', emoji: '🧩' },
      { label: 'Ghế đẩu', emoji: '🪑' },
    ],
  },
  {
    key: 'gi',
    label: 'Âm gi',
    icon: '👟',
    sound: 'gi',
    words: [
      { label: 'Giày', emoji: '👟' },
      { label: 'Giỏ', emoji: '🧺' },
      { label: 'Giường', emoji: '🛏️' },
      { label: 'Giấy', emoji: '📄' },
      { label: 'Giun', emoji: '🪱' },
      { label: 'Gió', emoji: '🌬️' },
    ],
  },
  {
    key: 'kh',
    label: 'Âm khờ',
    icon: '😄',
    sound: 'khờ',
    words: [
      { label: 'Khỉ', emoji: '🐵' },
      { label: 'Khăn', emoji: '🧣' },
      { label: 'Khế', emoji: '🍈' },
      { label: 'Khóa', emoji: '🔒' },
      { label: 'Khay', emoji: '🍽️' },
      { label: 'Khoai', emoji: '🥔' },
    ],
  },
  {
    key: 'ng',
    label: 'Âm ngờ',
    icon: '🐴',
    sound: 'ngờ',
    words: [
      { label: 'Ngựa', emoji: '🐴' },
      { label: 'Ngô', emoji: '🌽' },
      { label: 'Ngón tay', emoji: '☝️' },
      { label: 'Ngọc', emoji: '💎' },
      { label: 'Ngủ', emoji: '😴' },
      { label: 'Ngụy trang', emoji: '🪖' },
    ],
  },
  {
    key: 'nh',
    label: 'Âm nhờ',
    icon: '🏠',
    sound: 'nhờ',
    words: [
      { label: 'Nhà', emoji: '🏠' },
      { label: 'Nhím', emoji: '🦔' },
      { label: 'Nhãn', emoji: '🍈' },
      { label: 'Nhẫn', emoji: '💍' },
      { label: 'Nhạc', emoji: '🎵' },
      { label: 'Nhện', emoji: '🕷️' },
    ],
  },
  {
    key: 'ph',
    label: 'Âm phờ',
    icon: '📘',
    sound: 'phờ',
    words: [
      { label: 'Phở', emoji: '🍜' },
      { label: 'Phấn', emoji: '🖍️' },
      { label: 'Phích', emoji: '🫖' },
      { label: 'Phượng', emoji: '🌺' },
      { label: 'Phi tiêu', emoji: '🎯' },
      { label: 'Phao', emoji: '🛟' },
    ],
  },
  {
    key: 'th',
    label: 'Âm thờ',
    icon: '🐰',
    sound: 'thờ',
    words: [
      { label: 'Thỏ', emoji: '🐰' },
      { label: 'Thìa', emoji: '🥄' },
      { label: 'Thuyền', emoji: '⛵' },
      { label: 'Thước', emoji: '📏' },
      { label: 'Thùng', emoji: '🪣' },
      { label: 'Tháp', emoji: '🗼' },
    ],
  },
  {
    key: 'tr',
    label: 'Âm trờ',
    icon: '🌙',
    sound: 'trờ',
    words: [
      { label: 'Trăng', emoji: '🌙' },
      { label: 'Trâu', emoji: '🐃' },
      { label: 'Trống', emoji: '🥁' },
      { label: 'Trái', emoji: '🍎' },
      { label: 'Trà', emoji: '🍵' },
      { label: 'Trứng', emoji: '🥚' },
    ],
  },
];

export const initialSoundCategories = soundConfigs.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    total: item.words.length,
  }));

const allWords = soundConfigs.flatMap((item) =>
  item.words.map((word) => ({
    ...word,
    category: item.key,
  }))
);

function getLevelByIndex(index: number): InitialSoundLevel {
  if (index < 2) return 'easy';
  if (index < 4) return 'medium';
  return 'hard';
}

function buildQuestions(config: SoundConfig): InitialSoundQuestion[] {
  return config.words.map((word, index) => {
    const distractors = allWords
      .filter((item) => item.category !== config.key && item.label !== word.label)
      .slice(index * 3, index * 3 + 3);

    return {
      id: `${config.key}-${index + 1}`,
      prompt: 'Nghe âm đầu rồi chọn hình đúng',
      hint: `Chọn từ bắt đầu bằng âm ${config.sound}`,
      level: getLevelByIndex(index),
      category: config.key,
      sound: config.sound,
      correct: word.label,
      items: [
        { id: `${config.key}-${index + 1}-correct`, label: word.label, emoji: word.emoji },
        ...distractors.map((item, distractorIndex) => ({
          id: `${config.key}-${index + 1}-distractor-${distractorIndex + 1}`,
          label: item.label,
          emoji: item.emoji,
        })),
      ],
    };
  });
}

export const initialSoundData: Record<
  InitialSoundCategory,
  {
    label: string;
    icon: string;
    questions: InitialSoundQuestion[];
  }
> = Object.fromEntries(
  soundConfigs.map((config) => [
    config.key,
    {
      label: config.label,
      icon: config.icon,
      questions: buildQuestions(config),
    },
  ])
) as Record<
  InitialSoundCategory,
  {
    label: string;
    icon: string;
    questions: InitialSoundQuestion[];
  }
>;