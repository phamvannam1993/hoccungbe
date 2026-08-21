// Hội thoại tiếng Anh ngắn cho bé — các tình huống hằng ngày.
// Mỗi hội thoại 4–8 lượt, câu đơn giản, có nghĩa tiếng Việt. Phát nối tiếp bằng speakSequence.

export type DialogueLine = { who: 'A' | 'B'; en: string; vi: string };

export type Dialogue = {
  slug: string;
  emoji: string;
  title: string;
  scene: string; // bối cảnh
  a: string; // tên/nhãn người A
  b: string; // tên/nhãn người B
  lines: DialogueLine[];
};

export const DIALOGUES: Dialogue[] = [
  {
    slug: 'lam-quen', emoji: '🤝', title: 'Làm quen', scene: 'Hai bạn gặp nhau lần đầu.',
    a: 'Anna', b: 'Ben',
    lines: [
      { who: 'A', en: 'Hello! What is your name?', vi: 'Xin chào! Bạn tên là gì?' },
      { who: 'B', en: 'Hi! My name is Ben.', vi: 'Chào! Mình tên là Ben.' },
      { who: 'A', en: 'Nice to meet you, Ben.', vi: 'Rất vui được gặp bạn, Ben.' },
      { who: 'B', en: 'Nice to meet you too!', vi: 'Mình cũng rất vui được gặp bạn!' },
      { who: 'A', en: 'How old are you?', vi: 'Bạn bao nhiêu tuổi?' },
      { who: 'B', en: 'I am seven years old.', vi: 'Mình bảy tuổi.' },
    ],
  },
  {
    slug: 'o-lop', emoji: '🏫', title: 'Ở lớp học', scene: 'Bạn nhỏ và cô giáo.',
    a: 'Cô giáo', b: 'Bé',
    lines: [
      { who: 'A', en: 'Good morning, class!', vi: 'Chào buổi sáng, cả lớp!' },
      { who: 'B', en: 'Good morning, teacher!', vi: 'Chào buổi sáng, cô ạ!' },
      { who: 'A', en: 'Please sit down.', vi: 'Các em ngồi xuống nào.' },
      { who: 'B', en: 'May I go to the toilet?', vi: 'Em xin phép đi vệ sinh ạ?' },
      { who: 'A', en: 'Yes, you may.', vi: 'Được, em đi đi.' },
      { who: 'B', en: 'Thank you, teacher.', vi: 'Em cảm ơn cô ạ.' },
    ],
  },
  {
    slug: 'so-thich', emoji: '❤️', title: 'Nói về sở thích', scene: 'Hai bạn nói chuyện.',
    a: 'Mai', b: 'Tom',
    lines: [
      { who: 'A', en: 'Do you like apples?', vi: 'Bạn có thích táo không?' },
      { who: 'B', en: 'Yes, I do. I like apples.', vi: 'Có chứ. Mình thích táo.' },
      { who: 'A', en: 'What is your favorite color?', vi: 'Màu bạn thích nhất là gì?' },
      { who: 'B', en: 'My favorite color is blue.', vi: 'Màu mình thích nhất là xanh dương.' },
      { who: 'A', en: 'Me too!', vi: 'Mình cũng vậy!' },
    ],
  },
  {
    slug: 'o-nha', emoji: '🏠', title: 'Ở nhà', scene: 'Mẹ và bé.',
    a: 'Mẹ', b: 'Bé',
    lines: [
      { who: 'A', en: 'Are you hungry?', vi: 'Con có đói không?' },
      { who: 'B', en: 'Yes, I am hungry.', vi: 'Dạ có, con đói ạ.' },
      { who: 'A', en: 'Do you want some rice?', vi: 'Con có muốn ăn cơm không?' },
      { who: 'B', en: 'Yes, please. Thank you, Mom.', vi: 'Dạ có ạ. Con cảm ơn mẹ.' },
      { who: 'A', en: "You're welcome, sweetie.", vi: 'Không có gì, con yêu.' },
    ],
  },
  {
    slug: 'mua-do', emoji: '🛒', title: 'Đi mua đồ', scene: 'Bé và người bán hàng.',
    a: 'Người bán', b: 'Bé',
    lines: [
      { who: 'A', en: 'Hello! Can I help you?', vi: 'Xin chào! Cháu cần gì không?' },
      { who: 'B', en: 'I want a red pen, please.', vi: 'Cháu muốn mua một cây bút đỏ ạ.' },
      { who: 'A', en: 'Here you are.', vi: 'Của cháu đây.' },
      { who: 'B', en: 'How much is it?', vi: 'Bao nhiêu tiền ạ?' },
      { who: 'A', en: 'It is five thousand dong.', vi: 'Năm nghìn đồng.' },
      { who: 'B', en: 'Thank you very much.', vi: 'Cháu cảm ơn nhiều ạ.' },
    ],
  },
];

export const totalDialogueLines = () => DIALOGUES.reduce((n, d) => n + d.lines.length, 0);
