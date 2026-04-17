import { InteractiveLessonData } from './InteractiveLesson';

export const interactiveLessonDataMap: Record<string, InteractiveLessonData> = {
  'lam-quen-mat-chu:lqmc-01': {
    lessonKey: 'lam-quen-mat-chu:lqmc-01',
    lessonNumber: 'Bài 1',
    title: 'Làm quen chữ A - a',
    description:
      'Bé làm quen với chữ A viết hoa và a viết thường, tập nghe, đọc và chọn hình bắt đầu bằng âm a.',
    focusLetterUpper: 'A',
    focusLetterLower: 'a',
    pronounceUpper: 'A',
    pronounceLower: 'a',
    buddy: {
      name: 'Thỏ Mơ',
      emoji: '🐰',
      message: 'Chào bé, hôm nay mình cùng khám phá chữ A và tìm quà thật xinh nhé!',
    },
    matchPairs: [
      { id: 'ao', leftLabel: 'Áo', rightLabel: 'Áo', rightEmoji: '👕' },
      { id: 'an', leftLabel: 'Ăn', rightLabel: 'Ăn', rightEmoji: '🍚' },
      { id: 'anh', leftLabel: 'Anh', rightLabel: 'Anh', rightEmoji: '👦' },
    ],
    examples: [
      { letter: 'A', word: 'Áo', emoji: '👕' },
      { letter: 'A', word: 'Ăn', emoji: '🍚' },
      { letter: 'A', word: 'Anh', emoji: '👦' },
    ],
    quizQuestion: 'Hình nào có từ bắt đầu bằng chữ A?',
    quizOptions: [
      { id: 'ao', label: 'Áo', emoji: '👕', correct: true },
      { id: 'meo', label: 'Mèo', emoji: '🐱', correct: false },
      { id: 'xe', label: 'Xe', emoji: '🚗', correct: false },
    ],
    correctMessage: 'Chính xác rồi. Áo bắt đầu bằng chữ A.',
    wrongMessage: 'Mình thử lại nhé. Bé bấm nghe chữ A thêm một lần rồi chọn lại.',
    rewardSticker: {
      id: 'sticker-apple-a',
      name: 'Quả táo chữ A',
      emoji: '🍎',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-02',
    tips: [
      'Cho bé học trong 5 đến 10 phút để giữ sự tập trung và hứng thú.',
      'Khen bé ngay khi bé đọc đúng hoặc chọn đúng để tạo động lực tích cực.',
      'Sau bài học, có thể cho bé tìm thêm đồ vật ngoài đời bắt đầu bằng âm a.',
    ],
  },

  'lam-quen-mat-chu:lqmc-02': {
    lessonKey: 'lam-quen-mat-chu:lqmc-02',
    lessonNumber: 'Bài 2',
    title: 'Làm quen chữ Ă - ă',
    description:
      'Bé làm quen với chữ Ă viết hoa và ă viết thường, đồng thời tập phân biệt với chữ A đã học.',
    focusLetterUpper: 'Ă',
    focusLetterLower: 'ă',
    pronounceUpper: 'Ă',
    pronounceLower: 'ă',
    examples: [
      { letter: 'Ă', word: 'Ấm', emoji: '🫖' },
      { letter: 'Ă', word: 'Khăn', emoji: '🧣' },
      { letter: 'Ă', word: 'Mặt trăng', emoji: '🌙' },
    ],
    quizQuestion: 'Hình nào phù hợp nhất để bé nhớ chữ Ă?',
    quizOptions: [
      { id: 'am', label: 'Ấm', emoji: '🫖', correct: true },
      { id: 'xe', label: 'Xe', emoji: '🚗', correct: false },
      { id: 'meo', label: 'Mèo', emoji: '🐱', correct: false },
    ],
    correctMessage: 'Đúng rồi. Bé có thể nhớ chữ Ă qua hình cái ấm.',
    wrongMessage: 'Mình nghe lại và chọn thêm lần nữa nhé.',
    rewardSticker: {
      id: 'sticker-am-a',
      name: 'Cái ấm chữ Ă',
      emoji: '🫖',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-03',
    tips: [
      'Nhấn mạnh dấu trên chữ Ă để bé phân biệt với A.',
      'Không cần học quá lâu, chỉ cần lặp lại ngắn nhiều lần.',
      'Có thể ôn xen kẽ A và Ă để bé nhớ tốt hơn.',
    ],
  },

  'lam-quen-mat-chu:lqmc-03': {
    lessonKey: 'lam-quen-mat-chu:lqmc-03',
    lessonNumber: 'Bài 3',
    title: 'Làm quen chữ Â - â',
    description:
      'Bé làm quen với chữ Â viết hoa và â viết thường, tập nhìn, nghe và nhận diện qua ví dụ quen thuộc.',
    focusLetterUpper: 'Â',
    focusLetterLower: 'â',
    pronounceUpper: 'Â',
    pronounceLower: 'â',
    examples: [
      { letter: 'Â', word: 'Ấm', emoji: '🫖' },
      { letter: 'Â', word: 'Cân', emoji: '⚖️' },
      { letter: 'Â', word: 'Ân cần', emoji: '💛' },
    ],
    quizQuestion: 'Hình nào giúp bé nhớ chữ Â?',
    quizOptions: [
      { id: 'can', label: 'Cân', emoji: '⚖️', correct: true },
      { id: 'xe', label: 'Xe', emoji: '🚗', correct: false },
      { id: 'but', label: 'Bút', emoji: '✏️', correct: false },
    ],
    correctMessage: 'Giỏi lắm. Cân là ví dụ dễ nhớ cho chữ Â.',
    wrongMessage: 'Không sao đâu, mình chọn lại nhé.',
    rewardSticker: {
      id: 'sticker-can-a-mu',
      name: 'Cái cân chữ Â',
      emoji: '⚖️',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-04',
    tips: [
      'Cho bé nhìn kỹ dấu mũ của chữ Â.',
      'Ôn cùng A, Ă, Â để bé phân biệt theo nhóm.',
      'Khen bé ngay khi bé nhận ra khác biệt giữa ba chữ.',
    ],
  },

  'lam-quen-mat-chu:lqmc-04': {
    lessonKey: 'lam-quen-mat-chu:lqmc-04',
    lessonNumber: 'Bài 4',
    title: 'Làm quen chữ E - e',
    description:
      'Bé làm quen với chữ E viết hoa và e viết thường, tập nghe phát âm và nhận diện qua hình ảnh gần gũi.',
    focusLetterUpper: 'E',
    focusLetterLower: 'e',
    pronounceUpper: 'E',
    pronounceLower: 'e',
    examples: [
      { letter: 'E', word: 'Em', emoji: '🧒' },
      { letter: 'E', word: 'Kem', emoji: '🍦' },
      { letter: 'E', word: 'Xe', emoji: '🚗' },
    ],
    quizQuestion: 'Hình nào có từ giúp bé nhớ chữ E?',
    quizOptions: [
      { id: 'kem', label: 'Kem', emoji: '🍦', correct: true },
      { id: 'ca', label: 'Cá', emoji: '🐟', correct: false },
      { id: 'but', label: 'Bút', emoji: '✏️', correct: false },
    ],
    correctMessage: 'Đúng rồi. Kem là ví dụ dễ nhớ cho chữ E.',
    wrongMessage: 'Mình nghe lại chữ E rồi chọn thêm một lần nhé.',
    rewardSticker: {
      id: 'sticker-kem-e',
      name: 'Que kem chữ E',
      emoji: '🍦',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-05',
    tips: [
      'Cho bé đọc chậm chữ E rồi lặp lại nhiều lần.',
      'Kết hợp hình ảnh có thật để bé ghi nhớ tốt hơn.',
      'Ôn xen kẽ A, Ă, Â, E để bé không quên bài cũ.',
    ],
  },

  'lam-quen-mat-chu:lqmc-05': {
    lessonKey: 'lam-quen-mat-chu:lqmc-05',
    lessonNumber: 'Bài 5',
    title: 'Làm quen chữ Ê - ê',
    description:
      'Bé làm quen với chữ Ê viết hoa và ê viết thường, đồng thời học cách phân biệt với chữ E.',
    focusLetterUpper: 'Ê',
    focusLetterLower: 'ê',
    pronounceUpper: 'Ê',
    pronounceLower: 'ê',
    examples: [
      { letter: 'Ê', word: 'Ghế', emoji: '🪑' },
      { letter: 'Ê', word: 'Bê', emoji: '🐑' },
      { letter: 'Ê', word: 'Đếm', emoji: '🔢' },
    ],
    quizQuestion: 'Hình nào phù hợp nhất để nhớ chữ Ê?',
    quizOptions: [
      { id: 'ghe', label: 'Ghế', emoji: '🪑', correct: true },
      { id: 'xe', label: 'Xe', emoji: '🚗', correct: false },
      { id: 'meo', label: 'Mèo', emoji: '🐱', correct: false },
    ],
    correctMessage: 'Giỏi quá. Ghế là ví dụ quen thuộc cho chữ Ê.',
    wrongMessage: 'Không sao, mình nghe lại chữ Ê và thử tiếp nhé.',
    rewardSticker: {
      id: 'sticker-ghe-e-mu',
      name: 'Cái ghế chữ Ê',
      emoji: '🪑',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-06',
    tips: [
      'Nhấn mạnh dấu mũ trên chữ Ê để bé nhìn ra điểm khác với E.',
      'Cho bé so sánh trực tiếp E và Ê trên màn hình.',
      'Mỗi lần học chỉ cần ngắn nhưng lặp lại nhiều lượt.',
    ],
  },

  'lam-quen-mat-chu:lqmc-06': {
    lessonKey: 'lam-quen-mat-chu:lqmc-06',
    lessonNumber: 'Bài 6',
    title: 'Làm quen chữ I - i',
    description:
      'Bé làm quen với chữ I viết hoa và i viết thường, tập nghe, đọc và nhận diện trong các từ ngắn.',
    focusLetterUpper: 'I',
    focusLetterLower: 'i',
    pronounceUpper: 'I',
    pronounceLower: 'i',
    examples: [
      { letter: 'I', word: 'Kim', emoji: '🪡' },
      { letter: 'I', word: 'Đi', emoji: '🚶' },
      { letter: 'I', word: 'In', emoji: '🖨️' },
    ],
    quizQuestion: 'Hình nào là ví dụ giúp bé nhớ chữ I?',
    quizOptions: [
      { id: 'kim', label: 'Kim', emoji: '🪡', correct: true },
      { id: 'ao', label: 'Áo', emoji: '👕', correct: false },
      { id: 'can', label: 'Cân', emoji: '⚖️', correct: false },
    ],
    correctMessage: 'Đúng rồi. Kim là ví dụ rất dễ nhớ cho chữ I.',
    wrongMessage: 'Mình nghe lại chữ I rồi chọn lại nhé.',
    rewardSticker: {
      id: 'sticker-kim-i',
      name: 'Cây kim chữ I',
      emoji: '🪡',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-07',
    tips: [
      'Cho bé nhận ra chữ i thường có chấm phía trên.',
      'Có thể cho bé tìm chữ i trong các từ rất ngắn.',
      'Sau bài này nên ôn lại cả nhóm A, E, I để tăng ghi nhớ.',
    ],
  },

  'lam-quen-mat-chu:lqmc-07': {
    lessonKey: 'lam-quen-mat-chu:lqmc-07',
    lessonNumber: 'Bài 7',
    title: 'Làm quen chữ O - o',
    description:
      'Bé làm quen với chữ O viết hoa và o viết thường, tập nhận diện hình tròn quen thuộc của chữ O.',
    focusLetterUpper: 'O',
    focusLetterLower: 'o',
    pronounceUpper: 'O',
    pronounceLower: 'o',
    examples: [
      { letter: 'O', word: 'Ông', emoji: '👴' },
      { letter: 'O', word: 'Ổ', emoji: '🪺' },
      { letter: 'O', word: 'Bò', emoji: '🐄' },
    ],
    quizQuestion: 'Hình nào giúp bé nhớ chữ O?',
    quizOptions: [
      { id: 'ong', label: 'Ông', emoji: '👴', correct: true },
      { id: 'kim', label: 'Kim', emoji: '🪡', correct: false },
      { id: 'ghe', label: 'Ghế', emoji: '🪑', correct: false },
    ],
    correctMessage: 'Chính xác. Ông là ví dụ quen thuộc với chữ O.',
    wrongMessage: 'Mình thử lại nhé. Bé nghe lại chữ O rồi chọn tiếp.',
    rewardSticker: {
      id: 'sticker-ong-o',
      name: 'Ông chữ O',
      emoji: '👴',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-08',
    tips: [
      'Cho bé nhìn chữ O như một hình tròn để dễ nhớ.',
      'Kết hợp cho bé dùng tay vẽ vòng tròn trong không khí.',
      'Nhắc bé đọc rõ âm o, không cần quá nhanh.',
    ],
  },

  'lam-quen-mat-chu:lqmc-08': {
    lessonKey: 'lam-quen-mat-chu:lqmc-08',
    lessonNumber: 'Bài 8',
    title: 'Làm quen chữ Ô - ô',
    description:
      'Bé làm quen với chữ Ô viết hoa và ô viết thường, đồng thời phân biệt với chữ O đã học trước đó.',
    focusLetterUpper: 'Ô',
    focusLetterLower: 'ô',
    pronounceUpper: 'Ô',
    pronounceLower: 'ô',
    examples: [
      { letter: 'Ô', word: 'Ô tô', emoji: '🚗' },
      { letter: 'Ô', word: 'Cô', emoji: '👩' },
      { letter: 'Ô', word: 'Bố', emoji: '👨' },
    ],
    quizQuestion: 'Hình nào phù hợp để bé nhớ chữ Ô?',
    quizOptions: [
      { id: 'oto', label: 'Ô tô', emoji: '🚗', correct: true },
      { id: 'ao', label: 'Áo', emoji: '👕', correct: false },
      { id: 'ca', label: 'Cá', emoji: '🐟', correct: false },
    ],
    correctMessage: 'Giỏi quá. Ô tô là ví dụ rất dễ nhớ cho chữ Ô.',
    wrongMessage: 'Không sao, mình nghe lại chữ Ô rồi chọn lại nhé.',
    rewardSticker: {
      id: 'sticker-oto-o-mu',
      name: 'Ô tô chữ Ô',
      emoji: '🚗',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-09',
    tips: [
      'Cho bé chú ý dấu mũ trên chữ Ô để phân biệt với O.',
      'Đặt O và Ô cạnh nhau để bé so sánh trực tiếp.',
      'Bé chỉ cần nhớ bằng hình ảnh trước, chưa cần ép giải thích nhiều.',
    ],
  },

  'lam-quen-mat-chu:lqmc-09': {
    lessonKey: 'lam-quen-mat-chu:lqmc-09',
    lessonNumber: 'Bài 9',
    title: 'Làm quen chữ Ơ - ơ',
    description:
      'Bé làm quen với chữ Ơ viết hoa và ơ viết thường, học cách nhận ra nét khác biệt so với O và Ô.',
    focusLetterUpper: 'Ơ',
    focusLetterLower: 'ơ',
    pronounceUpper: 'Ơ',
    pronounceLower: 'ơ',
    examples: [
      { letter: 'Ơ', word: 'Mơ', emoji: '💭' },
      { letter: 'Ơ', word: 'Cờ', emoji: '🚩' },
      { letter: 'Ơ', word: 'Rơm', emoji: '🌾' },
    ],
    quizQuestion: 'Hình nào giúp bé nhớ chữ Ơ?',
    quizOptions: [
      { id: 'co', label: 'Cờ', emoji: '🚩', correct: true },
      { id: 'oto', label: 'Ô tô', emoji: '🚗', correct: false },
      { id: 'kim', label: 'Kim', emoji: '🪡', correct: false },
    ],
    correctMessage: 'Đúng rồi. Cờ là ví dụ dễ nhớ cho chữ Ơ.',
    wrongMessage: 'Mình thử lại nhé. Bé nhìn kỹ chữ Ơ rồi chọn tiếp.',
    rewardSticker: {
      id: 'sticker-co-o-moc',
      name: 'Lá cờ chữ Ơ',
      emoji: '🚩',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-10',
    tips: [
      'Cho bé so sánh ba chữ O, Ô, Ơ thành một nhóm.',
      'Bé chỉ cần nhìn ra dấu khác nhau trước là đã rất tốt.',
      'Có thể ôn bằng trò chơi chọn đúng chữ khi nghe đọc.',
    ],
  },

  'lam-quen-mat-chu:lqmc-10': {
    lessonKey: 'lam-quen-mat-chu:lqmc-10',
    lessonNumber: 'Bài 10',
    title: 'Làm quen chữ U - u',
    description:
      'Bé làm quen với chữ U viết hoa và u viết thường, tập nhận diện và nghe phát âm trong các từ đơn giản.',
    focusLetterUpper: 'U',
    focusLetterLower: 'u',
    pronounceUpper: 'U',
    pronounceLower: 'u',
    examples: [
      { letter: 'U', word: 'Ủng', emoji: '🥾' },
      { letter: 'U', word: 'Bụng', emoji: '🙂' },
      { letter: 'U', word: 'Tu hú', emoji: '🐦' },
    ],
    quizQuestion: 'Hình nào phù hợp nhất để nhớ chữ U?',
    quizOptions: [
      { id: 'ung', label: 'Ủng', emoji: '🥾', correct: true },
      { id: 'ghe', label: 'Ghế', emoji: '🪑', correct: false },
      { id: 'meo', label: 'Mèo', emoji: '🐱', correct: false },
    ],
    correctMessage: 'Giỏi lắm. Ủng là ví dụ dễ nhớ cho chữ U.',
    wrongMessage: 'Mình nghe lại chữ U rồi chọn thêm một lần nhé.',
    rewardSticker: {
      id: 'sticker-ung-u',
      name: 'Đôi ủng chữ U',
      emoji: '🥾',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-11',
    tips: [
      'Đọc âm u ngắn, rõ để bé dễ bắt chước.',
      'Cho bé nhìn mặt chữ và nói to cùng lúc.',
      'Ôn lại nhóm O, Ô, Ơ, U để chuyển nhóm tự nhiên.',
    ],
  },

  'lam-quen-mat-chu:lqmc-11': {
    lessonKey: 'lam-quen-mat-chu:lqmc-11',
    lessonNumber: 'Bài 11',
    title: 'Làm quen chữ Ư - ư',
    description:
      'Bé làm quen với chữ Ư viết hoa và ư viết thường, đồng thời phân biệt với chữ U.',
    focusLetterUpper: 'Ư',
    focusLetterLower: 'ư',
    pronounceUpper: 'Ư',
    pronounceLower: 'ư',
    examples: [
      { letter: 'Ư', word: 'Sư tử', emoji: '🦁' },
      { letter: 'Ư', word: 'Cừu', emoji: '🐑' },
      { letter: 'Ư', word: 'Thư', emoji: '✉️' },
    ],
    quizQuestion: 'Hình nào giúp bé nhớ chữ Ư?',
    quizOptions: [
      { id: 'thu', label: 'Thư', emoji: '✉️', correct: true },
      { id: 'oto', label: 'Ô tô', emoji: '🚗', correct: false },
      { id: 'but', label: 'Bút', emoji: '✏️', correct: false },
    ],
    correctMessage: 'Đúng rồi. Thư là ví dụ rất dễ nhớ cho chữ Ư.',
    wrongMessage: 'Mình thử lại nhé. Bé nghe chữ Ư thêm lần nữa nào.',
    rewardSticker: {
      id: 'sticker-thu-u-ria',
      name: 'Lá thư chữ Ư',
      emoji: '✉️',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-12',
    tips: [
      'Cho bé nhìn sự khác nhau giữa U và Ư.',
      'Không cần ép bé nhớ quá nhanh, chỉ cần nhận diện dần dần.',
      'Kết hợp nghe và nhìn sẽ giúp bé nhớ chữ Ư tốt hơn.',
    ],
  },

  'lam-quen-mat-chu:lqmc-12': {
    lessonKey: 'lam-quen-mat-chu:lqmc-12',
    lessonNumber: 'Bài 12',
    title: 'Làm quen chữ Y - y',
    description:
      'Bé làm quen với chữ Y viết hoa và y viết thường, hoàn thành nhóm nguyên âm cơ bản đầu tiên.',
    focusLetterUpper: 'Y',
    focusLetterLower: 'y',
    pronounceUpper: 'Y',
    pronounceLower: 'y',
    examples: [
      { letter: 'Y', word: 'Y tá', emoji: '🧑‍⚕️' },
      { letter: 'Y', word: 'Yên ngựa', emoji: '🐎' },
      { letter: 'Y', word: 'Bay', emoji: '✈️' },
    ],
    quizQuestion: 'Hình nào phù hợp nhất để bé nhớ chữ Y?',
    quizOptions: [
      { id: 'yta', label: 'Y tá', emoji: '🧑‍⚕️', correct: true },
      { id: 'ao', label: 'Áo', emoji: '👕', correct: false },
      { id: 'ca', label: 'Cá', emoji: '🐟', correct: false },
    ],
    correctMessage: 'Chính xác rồi. Y tá là ví dụ quen thuộc cho chữ Y.',
    wrongMessage: 'Không sao đâu, mình nghe lại chữ Y rồi chọn tiếp nhé.',
    rewardSticker: {
      id: 'sticker-yta-y',
      name: 'Y tá chữ Y',
      emoji: '🧑‍⚕️',
    },
    nextLessonHref: '/courses/lam-quen-mat-chu/lessons/lqmc-13',
    tips: [
      'Đây là bài chốt nhóm nguyên âm, nên ôn lại toàn bộ sau khi học xong.',
      'Có thể cho bé chơi trò gọi tên các chữ nguyên âm đã học.',
      'Khen bé vì đã hoàn thành một chặng đầu rất quan trọng.',
    ],
  },
};
