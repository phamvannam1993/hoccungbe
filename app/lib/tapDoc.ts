// Tập đọc tiếng Việt cho bé (lớp 1–2) — bài đọc ngắn có nghe đọc mẫu + câu hỏi đọc hiểu.
// Đọc từng câu / đọc cả bài bằng giọng Việt (proxy tl=vi, speakSequence).

export type ReadQuestion = { q: string; options: string[]; correct: number; explain: string };

export type TapDocBai = {
  slug: string;
  emoji: string;
  title: string;
  level: string; // cấp độ
  sentences: string[]; // các câu trong bài
  question: ReadQuestion; // 1 câu hỏi đọc hiểu
};

export const TAP_DOC: TapDocBai[] = [
  {
    slug: 'gia-dinh-em', emoji: '👨‍👩‍👧', title: 'Gia đình em', level: 'Câu ngắn',
    sentences: ['Nhà em có bốn người.', 'Đó là bố, mẹ, em và bé Na.', 'Cả nhà rất yêu thương nhau.'],
    question: { q: 'Nhà bạn nhỏ có mấy người?', options: ['Ba người', 'Bốn người', 'Năm người'], correct: 1, explain: 'Bài đọc: "Nhà em có bốn người".' },
  },
  {
    slug: 'con-meo', emoji: '🐱', title: 'Con mèo', level: 'Câu ngắn',
    sentences: ['Nhà em nuôi một con mèo.', 'Con mèo có bộ lông màu vàng.', 'Nó rất thích bắt chuột.'],
    question: { q: 'Con mèo thích làm gì?', options: ['Bắt chuột', 'Bơi lội', 'Leo cây'], correct: 0, explain: 'Bài đọc: "Nó rất thích bắt chuột".' },
  },
  {
    slug: 'buoi-sang', emoji: '🌅', title: 'Buổi sáng của em', level: 'Câu ngắn',
    sentences: ['Sáng nay trời nắng đẹp.', 'Em dậy sớm, đánh răng và rửa mặt.', 'Sau đó, em ăn sáng rồi đi học.'],
    question: { q: 'Buổi sáng em làm gì trước khi đi học?', options: ['Xem ti vi', 'Đánh răng, rửa mặt', 'Đi ngủ'], correct: 1, explain: 'Bài đọc: "Em dậy sớm, đánh răng và rửa mặt".' },
  },
  {
    slug: 'cay-bang', emoji: '🌳', title: 'Cây bàng', level: 'Đoạn ngắn',
    sentences: [
      'Trước sân trường có một cây bàng to.',
      'Mùa hè, lá bàng xanh mát rượi.',
      'Mùa thu, lá bàng chuyển sang màu đỏ.',
      'Chúng em thường chơi dưới gốc cây.',
    ],
    question: { q: 'Mùa thu, lá bàng có màu gì?', options: ['Màu xanh', 'Màu đỏ', 'Màu vàng'], correct: 1, explain: 'Bài đọc: "Mùa thu, lá bàng chuyển sang màu đỏ".' },
  },
  {
    slug: 'ga-trong', emoji: '🐓', title: 'Chú gà trống', level: 'Đoạn ngắn',
    sentences: [
      'Chú gà trống có bộ lông sặc sỡ.',
      'Mỗi buổi sáng, chú gáy vang: Ò ó o!',
      'Tiếng gáy gọi mọi người thức dậy.',
      'Chú gà trống thật chăm chỉ.',
    ],
    question: { q: 'Chú gà trống làm gì mỗi buổi sáng?', options: ['Đi ngủ', 'Gáy vang', 'Bơi lội'], correct: 1, explain: 'Bài đọc: "Mỗi buổi sáng, chú gáy vang".' },
  },
  {
    slug: 'ban-lan', emoji: '👧', title: 'Bạn Lan', level: 'Đoạn ngắn',
    sentences: [
      'Lan là bạn thân của em.',
      'Bạn ấy học giỏi và rất tốt bụng.',
      'Chúng em thường học bài cùng nhau.',
      'Em rất quý bạn Lan.',
    ],
    question: { q: 'Bạn Lan là người như thế nào?', options: ['Học giỏi và tốt bụng', 'Lười học', 'Hay giận dỗi'], correct: 0, explain: 'Bài đọc: "Bạn ấy học giỏi và rất tốt bụng".' },
  },
];
