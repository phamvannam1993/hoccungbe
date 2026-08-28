// Hội thoại ngắn cho bé (dạng "Hoàn thành hội thoại"): 2 nhân vật trò chuyện,
// một câu bị trống → bé chọn câu trả lời đúng. Câu ngắn, đúng ngữ pháp, hợp trẻ tiểu học.

export type DialogueLine = { who: 'a' | 'b'; en: string; vi: string };
export type Dialogue = {
  lines: DialogueLine[];
  blank: number; // chỉ số câu bị ẩn (đáp án)
  distractors: string[]; // câu tiếng Anh sai để làm nhiễu
};

export const DIALOGUES: Dialogue[] = [
  {
    lines: [
      { who: 'a', en: 'Hello!', vi: 'Xin chào!' },
      { who: 'b', en: 'Hi! Nice to meet you.', vi: 'Chào! Rất vui được gặp bạn.' },
    ],
    blank: 1,
    distractors: ['Goodbye!', 'Thank you!'],
  },
  {
    lines: [
      { who: 'a', en: 'How are you?', vi: 'Bạn khỏe không?' },
      { who: 'b', en: "I'm fine, thank you.", vi: 'Mình khỏe, cảm ơn.' },
    ],
    blank: 1,
    distractors: ['My name is Nam.', 'See you later.'],
  },
  {
    lines: [
      { who: 'a', en: "What's your name?", vi: 'Bạn tên là gì?' },
      { who: 'b', en: 'My name is Lan.', vi: 'Mình tên là Lan.' },
    ],
    blank: 1,
    distractors: ["I'm nine years old.", "I'm fine."],
  },
  {
    lines: [
      { who: 'a', en: 'How old are you?', vi: 'Bạn mấy tuổi?' },
      { who: 'b', en: "I'm eight years old.", vi: 'Mình tám tuổi.' },
    ],
    blank: 1,
    distractors: ['I like cats.', 'Nice to meet you.'],
  },
  {
    lines: [
      { who: 'a', en: 'Do you like ice cream?', vi: 'Bạn thích kem không?' },
      { who: 'b', en: 'Yes, I do!', vi: 'Có, mình thích!' },
    ],
    blank: 1,
    distractors: ['No problem.', "You're welcome."],
  },
  {
    lines: [
      { who: 'a', en: 'What color is it?', vi: 'Nó màu gì?' },
      { who: 'b', en: "It's red.", vi: 'Nó màu đỏ.' },
    ],
    blank: 1,
    distractors: ["It's a cat.", "I'm five."],
  },
  {
    lines: [
      { who: 'a', en: 'Thank you!', vi: 'Cảm ơn bạn!' },
      { who: 'b', en: "You're welcome.", vi: 'Không có gì.' },
    ],
    blank: 1,
    distractors: ['Good night.', 'How are you?'],
  },
  {
    lines: [
      { who: 'a', en: 'Good morning!', vi: 'Chào buổi sáng!' },
      { who: 'b', en: 'Good morning, teacher.', vi: 'Chào buổi sáng cô ạ.' },
    ],
    blank: 1,
    distractors: ['Good night.', "I'm sorry."],
  },
  {
    lines: [
      { who: 'a', en: 'What is this?', vi: 'Đây là cái gì?' },
      { who: 'b', en: "It's a dog.", vi: 'Đó là con chó.' },
    ],
    blank: 1,
    distractors: ["I'm happy.", 'Yes, please.'],
  },
  {
    lines: [
      { who: 'a', en: 'Can I have some water?', vi: 'Cho mình xin ít nước nhé?' },
      { who: 'b', en: 'Sure, here you are.', vi: 'Được chứ, của bạn đây.' },
    ],
    blank: 1,
    distractors: ['See you.', "I'm fine."],
  },
  {
    lines: [
      { who: 'a', en: 'Where is the cat?', vi: 'Con mèo ở đâu?' },
      { who: 'b', en: "It's on the table.", vi: 'Nó ở trên bàn.' },
    ],
    blank: 1,
    distractors: ["It's red.", 'Thank you.'],
  },
  {
    lines: [
      { who: 'a', en: "Let's play!", vi: 'Cùng chơi nào!' },
      { who: 'b', en: 'OK, great!', vi: 'Được, tuyệt!' },
    ],
    blank: 1,
    distractors: ['Good night.', 'No, thanks.'],
  },
];
