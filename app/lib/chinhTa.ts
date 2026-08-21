// Chính tả phân biệt tiếng Việt cho bé — các lỗi phổ biến: s/x, ch/tr, l/n, d/gi/r, hỏi/ngã.
// Game chọn đáp án đúng; đọc từ đúng bằng giọng Việt, đúng có âm thanh + confetti.

export type ChinhTaQuestion = {
  text: string; // gợi ý (có chỗ trống ___ hoặc nghĩa), kèm emoji
  options: string[]; // lựa chọn (chữ s/x… hoặc cả từ với dấu)
  correct: number;
  word: string; // từ đúng hoàn chỉnh (để đọc)
  explain: string;
};

export type ChinhTaTopic = {
  slug: string;
  emoji: string;
  title: string;
  rule: string;
  questions: ChinhTaQuestion[];
};

export const CHINH_TA_TOPICS: ChinhTaTopic[] = [
  {
    slug: 's-x', emoji: '🔤', title: 'Phân biệt s / x',
    rule: 'Nhiều từ dễ nhầm giữa "s" và "x". Hãy nhớ mặt chữ của từng từ quen thuộc.',
    questions: [
      { text: 'con ___ố (đếm 1, 2, 3) 🔢', options: ['s', 'x'], correct: 0, word: 'số', explain: '"số" viết bằng s.' },
      { text: 'màu ___anh 🟢', options: ['s', 'x'], correct: 1, word: 'xanh', explain: '"xanh" viết bằng x.' },
      { text: 'dòng ___ông 🌊', options: ['s', 'x'], correct: 0, word: 'sông', explain: '"sông" viết bằng s.' },
      { text: '___e đạp 🚲', options: ['s', 'x'], correct: 1, word: 'xe', explain: '"xe" viết bằng x.' },
      { text: 'ngôi ___ao ⭐', options: ['s', 'x'], correct: 0, word: 'sao', explain: '"sao" viết bằng s.' },
      { text: 'quả ___oài 🥭', options: ['s', 'x'], correct: 1, word: 'xoài', explain: '"xoài" viết bằng x.' },
      { text: '___ạch sẽ 🧼', options: ['s', 'x'], correct: 0, word: 'sạch', explain: '"sạch" viết bằng s.' },
    ],
  },
  {
    slug: 'ch-tr', emoji: '🐃', title: 'Phân biệt ch / tr',
    rule: 'Từ bắt đầu bằng "ch" hay "tr"? Ghi nhớ theo từng từ quen thuộc.',
    questions: [
      { text: 'con ___âu (kéo cày) 🐃', options: ['ch', 'tr'], correct: 1, word: 'trâu', explain: '"trâu" viết bằng tr.' },
      { text: '___ường học 🏫', options: ['ch', 'tr'], correct: 1, word: 'trường', explain: '"trường" viết bằng tr.' },
      { text: 'con ___ó 🐶', options: ['ch', 'tr'], correct: 0, word: 'chó', explain: '"chó" viết bằng ch.' },
      { text: 'quả ___anh 🍋', options: ['ch', 'tr'], correct: 0, word: 'chanh', explain: '"chanh" viết bằng ch.' },
      { text: 'ông ___ăng 🌙', options: ['ch', 'tr'], correct: 1, word: 'trăng', explain: '"trăng" viết bằng tr.' },
      { text: 'cái ___én 🥣', options: ['ch', 'tr'], correct: 0, word: 'chén', explain: '"chén" viết bằng ch.' },
      { text: 'cây ___e 🎋', options: ['ch', 'tr'], correct: 1, word: 'tre', explain: '"tre" viết bằng tr.' },
    ],
  },
  {
    slug: 'l-n', emoji: '🍃', title: 'Phân biệt l / n',
    rule: 'Đầu lưỡi cong lên là "l", đầu lưỡi thẳng là "n". Nhớ mặt chữ từng từ.',
    questions: [
      { text: '___àm việc 🛠️', options: ['l', 'n'], correct: 0, word: 'làm', explain: '"làm" viết bằng l.' },
      { text: 'quả ___a 🍈', options: ['l', 'n'], correct: 1, word: 'na', explain: '"na" viết bằng n.' },
      { text: 'ngọn ___ửa 🔥', options: ['l', 'n'], correct: 0, word: 'lửa', explain: '"lửa" viết bằng l.' },
      { text: '___ước uống 💧', options: ['l', 'n'], correct: 1, word: 'nước', explain: '"nước" viết bằng n.' },
      { text: '___á cây 🍃', options: ['l', 'n'], correct: 0, word: 'lá', explain: '"lá" viết bằng l.' },
      { text: 'cái ___ón 👒', options: ['l', 'n'], correct: 1, word: 'nón', explain: '"nón" viết bằng n.' },
    ],
  },
  {
    slug: 'd-gi-r', emoji: '👟', title: 'Phân biệt d / gi / r',
    rule: '"d", "gi", "r" đọc gần giống nhau nhưng viết khác. Nhớ theo từng từ quen thuộc.',
    questions: [
      { text: 'làn ___a (bên ngoài cơ thể) 🧴', options: ['d', 'gi', 'r'], correct: 0, word: 'da', explain: '"da" viết bằng d.' },
      { text: 'đôi ___ày 👟', options: ['d', 'gi', 'r'], correct: 1, word: 'giày', explain: '"giày" viết bằng gi.' },
      { text: 'con ___ùa 🐢', options: ['d', 'gi', 'r'], correct: 2, word: 'rùa', explain: '"rùa" viết bằng r.' },
      { text: 'cơn ___ó 🌬️', options: ['d', 'gi', 'r'], correct: 1, word: 'gió', explain: '"gió" viết bằng gi.' },
      { text: 'cái ___ổ 🧺', options: ['d', 'gi', 'r'], correct: 2, word: 'rổ', explain: '"rổ" viết bằng r.' },
      { text: 'con ___ao (để cắt) 🔪', options: ['d', 'gi', 'r'], correct: 0, word: 'dao', explain: '"dao" viết bằng d.' },
    ],
  },
  {
    slug: 'hoi-nga', emoji: '❓', title: 'Dấu hỏi / ngã',
    rule: 'Nhiều tiếng dễ nhầm dấu hỏi ( ? ) và dấu ngã ( ~ ). Chọn từ đúng theo nghĩa.',
    questions: [
      { text: '___ hè (không phải đi học) 🏖️', options: ['nghỉ', 'nghĩ'], correct: 0, word: 'nghỉ', explain: '"nghỉ" (nghỉ ngơi) — dấu hỏi.' },
      { text: 'suy ___ (dùng đầu óc) 🤔', options: ['nghỉ', 'nghĩ'], correct: 1, word: 'nghĩ', explain: '"nghĩ" (suy nghĩ) — dấu ngã.' },
      { text: '___ xe (chữa cho tốt lại) 🔧', options: ['sửa', 'sữa'], correct: 0, word: 'sửa', explain: '"sửa" (sửa chữa) — dấu hỏi.' },
      { text: 'uống ___ 🥛', options: ['sửa', 'sữa'], correct: 1, word: 'sữa', explain: '"sữa" (uống) — dấu ngã.' },
      { text: '___ vệ (che chở) 🛡️', options: ['bảo', 'bão'], correct: 0, word: 'bảo', explain: '"bảo" (bảo vệ) — dấu hỏi.' },
      { text: 'cơn ___ (mưa to gió lớn) 🌀', options: ['bảo', 'bão'], correct: 1, word: 'bão', explain: '"bão" (cơn bão) — dấu ngã.' },
      { text: 'cái ___ (để ra vào nhà) 🚪', options: ['cửa', 'cữa'], correct: 0, word: 'cửa', explain: '"cửa" — dấu hỏi.' },
    ],
  },
];

export const totalChinhTaQuestions = () => CHINH_TA_TOPICS.reduce((n, t) => n + t.questions.length, 0);
