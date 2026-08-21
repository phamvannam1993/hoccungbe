// Ngữ pháp tiếng Anh cơ bản cho bé — học qua trò chơi chọn đáp án.
// Mỗi chủ điểm: quy tắc ngắn + ví dụ (nghe được) + mini-quiz có giải thích.
// Phát âm qua proxy tl=en; đúng/sai có âm thanh + confetti (celebrate).

export type GrammarQuestion = {
  text: string; // câu có chỗ trống ___ (kèm emoji gợi ý)
  options: string[];
  correct: number;
  en: string; // câu hoàn chỉnh để đọc
  vi: string;
  explain: string;
};

export type GrammarTopic = {
  slug: string;
  emoji: string;
  title: string;
  rule: string; // quy tắc ngắn gọn
  examples: { en: string; vi: string }[];
  questions: GrammarQuestion[];
};

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    slug: 'a-an', emoji: '🍎', title: 'a / an',
    rule: 'Dùng "an" trước từ bắt đầu bằng nguyên âm (a, e, i, o, u); dùng "a" trước các từ còn lại.',
    examples: [
      { en: 'a dog', vi: 'một con chó' },
      { en: 'an apple', vi: 'một quả táo' },
      { en: 'an egg', vi: 'một quả trứng' },
    ],
    questions: [
      { text: '___ apple 🍎', options: ['a', 'an'], correct: 1, en: 'an apple', vi: 'một quả táo', explain: '"apple" bắt đầu bằng nguyên âm a → dùng "an".' },
      { text: '___ dog 🐶', options: ['a', 'an'], correct: 0, en: 'a dog', vi: 'một con chó', explain: '"dog" bắt đầu bằng phụ âm d → dùng "a".' },
      { text: '___ egg 🥚', options: ['a', 'an'], correct: 1, en: 'an egg', vi: 'một quả trứng', explain: '"egg" bắt đầu bằng nguyên âm e → dùng "an".' },
      { text: '___ cat 🐱', options: ['a', 'an'], correct: 0, en: 'a cat', vi: 'một con mèo', explain: '"cat" bắt đầu bằng phụ âm c → dùng "a".' },
      { text: '___ orange 🍊', options: ['a', 'an'], correct: 1, en: 'an orange', vi: 'một quả cam', explain: '"orange" bắt đầu bằng nguyên âm o → dùng "an".' },
      { text: '___ ball ⚽', options: ['a', 'an'], correct: 0, en: 'a ball', vi: 'một quả bóng', explain: '"ball" bắt đầu bằng phụ âm b → dùng "a".' },
      { text: '___ umbrella ☂️', options: ['a', 'an'], correct: 1, en: 'an umbrella', vi: 'một cái ô', explain: '"umbrella" bắt đầu bằng nguyên âm u → dùng "an".' },
    ],
  },
  {
    slug: 'plural', emoji: '🔢', title: 'Số nhiều (-s / -es)',
    rule: 'Nhiều hơn một thì thêm -s vào cuối danh từ. Với từ tận cùng bằng s, x, ch, sh, o thì thêm -es.',
    examples: [
      { en: 'one cat, two cats', vi: 'một con mèo, hai con mèo' },
      { en: 'one box, two boxes', vi: 'một cái hộp, hai cái hộp' },
    ],
    questions: [
      { text: 'one cat 🐱 → two ___', options: ['cats', 'cates', 'cat'], correct: 0, en: 'two cats', vi: 'hai con mèo', explain: 'Thêm -s: cat → cats.' },
      { text: 'one dog 🐶 → two ___', options: ['doges', 'dogs', 'dog'], correct: 1, en: 'two dogs', vi: 'hai con chó', explain: 'Thêm -s: dog → dogs.' },
      { text: 'one box 📦 → two ___', options: ['boxs', 'boxes', 'box'], correct: 1, en: 'two boxes', vi: 'hai cái hộp', explain: 'Tận cùng bằng x → thêm -es: box → boxes.' },
      { text: 'one bus 🚌 → two ___', options: ['buses', 'buss', 'bus'], correct: 0, en: 'two buses', vi: 'hai xe buýt', explain: 'Tận cùng bằng s → thêm -es: bus → buses.' },
      { text: 'one apple 🍎 → two ___', options: ['applees', 'apples', 'apple'], correct: 1, en: 'two apples', vi: 'hai quả táo', explain: 'Thêm -s: apple → apples.' },
      { text: 'one book 📖 → three ___', options: ['books', 'bookes', 'book'], correct: 0, en: 'three books', vi: 'ba quyển sách', explain: 'Thêm -s: book → books.' },
    ],
  },
  {
    slug: 'this-that', emoji: '👉', title: 'this / that',
    rule: '"This" (cái này) chỉ vật ở GẦN; "That" (cái kia) chỉ vật ở XA.',
    examples: [
      { en: 'This is my hand.', vi: 'Đây là bàn tay của mình. (gần)' },
      { en: 'That is the moon.', vi: 'Kia là mặt trăng. (xa)' },
    ],
    questions: [
      { text: '___ is my nose 👃 (gần)', options: ['This', 'That'], correct: 0, en: 'This is my nose.', vi: 'Đây là mũi của mình.', explain: 'Vật ở gần (mũi của mình) → "This".' },
      { text: '___ is the sun ☀️ (xa)', options: ['This', 'That'], correct: 1, en: 'That is the sun.', vi: 'Kia là mặt trời.', explain: 'Vật ở xa (mặt trời) → "That".' },
      { text: '___ is a pen ✏️ (trong tay)', options: ['This', 'That'], correct: 0, en: 'This is a pen.', vi: 'Đây là cái bút.', explain: 'Vật ở gần (trong tay) → "This".' },
      { text: '___ is a bird 🐦 (trên trời)', options: ['This', 'That'], correct: 1, en: 'That is a bird.', vi: 'Kia là con chim.', explain: 'Vật ở xa (trên trời) → "That".' },
      { text: '___ is my book 📖 (trên bàn trước mặt)', options: ['This', 'That'], correct: 0, en: 'This is my book.', vi: 'Đây là quyển sách của mình.', explain: 'Vật ở gần → "This".' },
    ],
  },
  {
    slug: 'to-be', emoji: '🧩', title: 'to be (am / is / are)',
    rule: 'I → am; he/she/it (một người/vật) → is; you/we/they (nhiều) → are.',
    examples: [
      { en: 'I am happy.', vi: 'Mình vui.' },
      { en: 'She is a teacher.', vi: 'Cô ấy là giáo viên.' },
      { en: 'They are friends.', vi: 'Họ là bạn bè.' },
    ],
    questions: [
      { text: 'I ___ happy 😊', options: ['am', 'is', 'are'], correct: 0, en: 'I am happy.', vi: 'Mình vui.', explain: 'Với "I" luôn dùng "am".' },
      { text: 'She ___ a teacher 👩‍🏫', options: ['am', 'is', 'are'], correct: 1, en: 'She is a teacher.', vi: 'Cô ấy là giáo viên.', explain: 'Với "she" (một người) dùng "is".' },
      { text: 'They ___ friends 👫', options: ['am', 'is', 'are'], correct: 2, en: 'They are friends.', vi: 'Họ là bạn bè.', explain: 'Với "they" (nhiều người) dùng "are".' },
      { text: 'He ___ tall 🧍', options: ['am', 'is', 'are'], correct: 1, en: 'He is tall.', vi: 'Cậu ấy cao.', explain: 'Với "he" (một người) dùng "is".' },
      { text: 'We ___ students 🎒', options: ['am', 'is', 'are'], correct: 2, en: 'We are students.', vi: 'Chúng mình là học sinh.', explain: 'Với "we" (nhiều người) dùng "are".' },
      { text: 'It ___ a cat 🐱', options: ['am', 'is', 'are'], correct: 1, en: 'It is a cat.', vi: 'Nó là một con mèo.', explain: 'Với "it" (một vật) dùng "is".' },
      { text: 'You ___ nice 🙂', options: ['am', 'is', 'are'], correct: 2, en: 'You are nice.', vi: 'Bạn thật tốt bụng.', explain: 'Với "you" dùng "are".' },
    ],
  },
  {
    slug: 'can', emoji: '⭐', title: 'can / can’t',
    rule: '"can" = có thể làm được; "can’t" = không thể làm được.',
    examples: [
      { en: 'A bird can fly.', vi: 'Con chim có thể bay.' },
      { en: 'A fish can’t walk.', vi: 'Con cá không thể đi bộ.' },
    ],
    questions: [
      { text: 'A fish 🐟 ___ swim', options: ['can', 'can’t'], correct: 0, en: 'A fish can swim.', vi: 'Con cá có thể bơi.', explain: 'Cá bơi được → "can".' },
      { text: 'A cat 🐱 ___ fly', options: ['can', 'can’t'], correct: 1, en: 'A cat can’t fly.', vi: 'Con mèo không thể bay.', explain: 'Mèo không bay được → "can’t".' },
      { text: 'Birds 🐦 ___ fly', options: ['can', 'can’t'], correct: 0, en: 'Birds can fly.', vi: 'Chim có thể bay.', explain: 'Chim bay được → "can".' },
      { text: 'A baby 👶 ___ drive a car', options: ['can', 'can’t'], correct: 1, en: 'A baby can’t drive a car.', vi: 'Em bé không thể lái xe.', explain: 'Em bé không lái xe được → "can’t".' },
      { text: 'I ___ count to ten 🔢', options: ['can', 'can’t'], correct: 0, en: 'I can count to ten.', vi: 'Mình có thể đếm đến mười.', explain: 'Đếm được → "can".' },
    ],
  },
];

export const totalGrammarQuestions = () => GRAMMAR_TOPICS.reduce((n, t) => n + t.questions.length, 0);
