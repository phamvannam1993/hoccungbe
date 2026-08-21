// Mẫu câu giao tiếp tiếng Anh cho bé — dùng TỪ VỰNG đã học để NÓI THÀNH CÂU.
// Mỗi câu là câu HOÀN CHỈNH, đúng ngữ pháp (tránh lỗi a/an, số nhiều), có nghĩa tiếng Việt.
// Phát âm cả câu bằng Web Speech (giọng bản ngữ) rồi đọc nghĩa tiếng Việt.

export type Sentence = { en: string; vi: string; emoji?: string };

export type SentencePattern = {
  slug: string;
  emoji: string;
  pattern: string; // mẫu câu, vd "I like ___."
  desc: string;
  sentences: Sentence[];
};

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    slug: 'chao-hoi', emoji: '👋', pattern: 'Chào hỏi', desc: 'Câu chào và làm quen hằng ngày.',
    sentences: [
      { en: 'Hello!', vi: 'Xin chào!', emoji: '👋' },
      { en: 'Good morning.', vi: 'Chào buổi sáng.', emoji: '🌅' },
      { en: 'How are you?', vi: 'Bạn khỏe không?', emoji: '🙂' },
      { en: "I'm fine, thank you.", vi: 'Mình khỏe, cảm ơn bạn.', emoji: '😊' },
      { en: 'What is your name?', vi: 'Bạn tên là gì?', emoji: '❓' },
      { en: 'My name is Bo.', vi: 'Mình tên là Bo.', emoji: '🧒' },
      { en: 'Goodbye! See you.', vi: 'Tạm biệt! Hẹn gặp lại.', emoji: '👋' },
    ],
  },
  {
    slug: 'day-la', emoji: '🔎', pattern: 'This is a ___.', desc: 'Giới thiệu đồ vật, con vật.',
    sentences: [
      { en: 'This is a cat.', vi: 'Đây là một con mèo.', emoji: '🐱' },
      { en: 'This is a dog.', vi: 'Đây là một con chó.', emoji: '🐶' },
      { en: 'This is a ball.', vi: 'Đây là một quả bóng.', emoji: '⚽' },
      { en: 'This is a book.', vi: 'Đây là một quyển sách.', emoji: '📖' },
      { en: 'This is an apple.', vi: 'Đây là một quả táo.', emoji: '🍎' },
      { en: 'This is an egg.', vi: 'Đây là một quả trứng.', emoji: '🥚' },
    ],
  },
  {
    slug: 'toi-thich', emoji: '❤️', pattern: 'I like ___.', desc: 'Nói về sở thích.',
    sentences: [
      { en: 'I like apples.', vi: 'Mình thích táo.', emoji: '🍎' },
      { en: 'I like bananas.', vi: 'Mình thích chuối.', emoji: '🍌' },
      { en: 'I like cats.', vi: 'Mình thích mèo.', emoji: '🐱' },
      { en: 'I like milk.', vi: 'Mình thích sữa.', emoji: '🥛' },
      { en: 'I like ice cream.', vi: 'Mình thích kem.', emoji: '🍦' },
      { en: "I don't like spiders.", vi: 'Mình không thích nhện.', emoji: '🕷️' },
    ],
  },
  {
    slug: 'mau-sac', emoji: '🎨', pattern: "It's ___.", desc: 'Nói màu sắc và đặc điểm.',
    sentences: [
      { en: "It's red.", vi: 'Nó màu đỏ.', emoji: '🔴' },
      { en: "It's blue.", vi: 'Nó màu xanh dương.', emoji: '🔵' },
      { en: "It's yellow.", vi: 'Nó màu vàng.', emoji: '🟡' },
      { en: "It's big.", vi: 'Nó to.', emoji: '🐘' },
      { en: "It's small.", vi: 'Nó nhỏ.', emoji: '🐜' },
      { en: "It's hot.", vi: 'Nó nóng.', emoji: '🔥' },
    ],
  },
  {
    slug: 'toi-co', emoji: '🎒', pattern: 'I have a ___.', desc: 'Nói về đồ mình có.',
    sentences: [
      { en: 'I have a pen.', vi: 'Mình có một cái bút.', emoji: '🖊️' },
      { en: 'I have a book.', vi: 'Mình có một quyển sách.', emoji: '📖' },
      { en: 'I have a bag.', vi: 'Mình có một cái cặp.', emoji: '🎒' },
      { en: 'I have a hat.', vi: 'Mình có một cái mũ.', emoji: '🎩' },
      { en: 'I have a dog.', vi: 'Mình có một con chó.', emoji: '🐶' },
      { en: 'I have two hands.', vi: 'Mình có hai bàn tay.', emoji: '✋' },
    ],
  },
  {
    slug: 'toi-co-the', emoji: '⭐', pattern: 'I can ___.', desc: 'Nói việc mình làm được.',
    sentences: [
      { en: 'I can run.', vi: 'Mình có thể chạy.', emoji: '🏃' },
      { en: 'I can jump.', vi: 'Mình có thể nhảy.', emoji: '🤸' },
      { en: 'I can swim.', vi: 'Mình có thể bơi.', emoji: '🏊' },
      { en: 'I can sing.', vi: 'Mình có thể hát.', emoji: '🎤' },
      { en: 'I can read.', vi: 'Mình có thể đọc.', emoji: '📖' },
      { en: 'I can count to ten.', vi: 'Mình có thể đếm đến mười.', emoji: '🔢' },
    ],
  },
  {
    slug: 'gia-dinh', emoji: '👨‍👩‍👧', pattern: 'This is my ___.', desc: 'Giới thiệu gia đình.',
    sentences: [
      { en: 'This is my mom.', vi: 'Đây là mẹ mình.', emoji: '👩' },
      { en: 'This is my dad.', vi: 'Đây là bố mình.', emoji: '👨' },
      { en: 'This is my sister.', vi: 'Đây là chị/em gái mình.', emoji: '👧' },
      { en: 'This is my brother.', vi: 'Đây là anh/em trai mình.', emoji: '👦' },
      { en: 'I love my family.', vi: 'Mình yêu gia đình mình.', emoji: '❤️' },
    ],
  },
  {
    slug: 'cam-xuc', emoji: '😊', pattern: "I'm ___.", desc: 'Nói về cảm xúc.',
    sentences: [
      { en: "I'm happy.", vi: 'Mình vui.', emoji: '😄' },
      { en: "I'm sad.", vi: 'Mình buồn.', emoji: '😢' },
      { en: "I'm hungry.", vi: 'Mình đói.', emoji: '🍽️' },
      { en: "I'm tired.", vi: 'Mình mệt.', emoji: '😴' },
      { en: "I'm ok.", vi: 'Mình ổn.', emoji: '🙂' },
    ],
  },
];

export const totalSentences = () => SENTENCE_PATTERNS.reduce((n, p) => n + p.sentences.length, 0);
