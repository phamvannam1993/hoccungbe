// Luyện từ và câu tiếng Việt cho bé (lớp 2–3) — từ loại, dấu câu, từ trái nghĩa.
// Game chọn đáp án; đúng có âm thanh + confetti, đọc đáp án/ví dụ bằng giọng Việt.

export type LtcQuestion = {
  text: string; // câu hỏi (kèm emoji)
  options: string[];
  correct: number;
  say?: string; // đọc khi trả lời đúng (từ/câu ví dụ)
  explain: string;
};

export type LtcTopic = {
  slug: string;
  emoji: string;
  title: string;
  rule: string;
  questions: LtcQuestion[];
};

export const LTC_TOPICS: LtcTopic[] = [
  {
    slug: 'su-vat', emoji: '📦', title: 'Từ chỉ sự vật',
    rule: 'Từ chỉ sự vật gọi tên người, con vật, đồ vật, cây cối… (còn gọi là danh từ).',
    questions: [
      { text: 'Từ nào chỉ sự vật? 🤔', options: ['chạy', 'quyển sách', 'đỏ'], correct: 1, say: 'quyển sách', explain: '"quyển sách" là đồ vật → từ chỉ sự vật.' },
      { text: 'Từ nào chỉ sự vật?', options: ['con mèo', 'nhảy', 'cao'], correct: 0, say: 'con mèo', explain: '"con mèo" là con vật → từ chỉ sự vật.' },
      { text: 'Từ nào chỉ sự vật?', options: ['đẹp', 'ngôi nhà', 'ăn'], correct: 1, say: 'ngôi nhà', explain: '"ngôi nhà" là đồ vật → từ chỉ sự vật.' },
      { text: 'Từ nào chỉ sự vật?', options: ['bơi', 'cây tre', 'vui'], correct: 1, say: 'cây tre', explain: '"cây tre" là cây cối → từ chỉ sự vật.' },
      { text: 'Từ nào chỉ sự vật?', options: ['học sinh', 'viết', 'nhanh'], correct: 0, say: 'học sinh', explain: '"học sinh" là người → từ chỉ sự vật.' },
    ],
  },
  {
    slug: 'hoat-dong', emoji: '🏃', title: 'Từ chỉ hoạt động',
    rule: 'Từ chỉ hoạt động nói về việc làm, động tác (còn gọi là động từ).',
    questions: [
      { text: 'Từ nào chỉ hoạt động? 🏃', options: ['cái bàn', 'chạy', 'đỏ'], correct: 1, say: 'chạy', explain: '"chạy" là một hoạt động.' },
      { text: 'Từ nào chỉ hoạt động?', options: ['con chó', 'đẹp', 'nhảy'], correct: 2, say: 'nhảy', explain: '"nhảy" là một hoạt động.' },
      { text: 'Từ nào chỉ hoạt động?', options: ['ngôi nhà', 'hát', 'cao'], correct: 1, say: 'hát', explain: '"hát" là một hoạt động.' },
      { text: 'Từ nào chỉ hoạt động?', options: ['học sinh', 'tròn', 'đọc'], correct: 2, say: 'đọc', explain: '"đọc" là một hoạt động.' },
      { text: 'Từ nào chỉ hoạt động?', options: ['bông hoa', 'ăn', 'vui'], correct: 1, say: 'ăn', explain: '"ăn" là một hoạt động.' },
    ],
  },
  {
    slug: 'dac-diem', emoji: '🎨', title: 'Từ chỉ đặc điểm',
    rule: 'Từ chỉ đặc điểm nói về màu sắc, hình dáng, tính chất… (còn gọi là tính từ).',
    questions: [
      { text: 'Từ nào chỉ đặc điểm? 🎨', options: ['chạy', 'cái bàn', 'đỏ'], correct: 2, say: 'đỏ', explain: '"đỏ" chỉ màu sắc → từ chỉ đặc điểm.' },
      { text: 'Từ nào chỉ đặc điểm?', options: ['con mèo', 'cao', 'hát'], correct: 1, say: 'cao', explain: '"cao" chỉ hình dáng → từ chỉ đặc điểm.' },
      { text: 'Từ nào chỉ đặc điểm?', options: ['đọc', 'tròn', 'ngôi nhà'], correct: 1, say: 'tròn', explain: '"tròn" chỉ hình dáng → từ chỉ đặc điểm.' },
      { text: 'Từ nào chỉ đặc điểm?', options: ['xanh', 'ăn', 'học sinh'], correct: 0, say: 'xanh', explain: '"xanh" chỉ màu sắc → từ chỉ đặc điểm.' },
      { text: 'Từ nào chỉ đặc điểm?', options: ['nhanh', 'bơi', 'cây'], correct: 0, say: 'nhanh', explain: '"nhanh" chỉ tính chất → từ chỉ đặc điểm.' },
    ],
  },
  {
    slug: 'dau-cau', emoji: '❓', title: 'Dấu câu',
    rule: 'Cuối câu kể dùng dấu chấm (.), cuối câu hỏi dùng dấu chấm hỏi (?), cuối câu cảm dùng dấu chấm than (!).',
    questions: [
      { text: 'Đặt dấu gì cuối câu: “Em đi học”? 🏫', options: ['dấu chấm (.)', 'dấu hỏi (?)', 'dấu chấm than (!)'], correct: 0, say: 'Em đi học.', explain: 'Đây là câu kể → dùng dấu chấm.' },
      { text: 'Đặt dấu gì cuối câu: “Bạn tên là gì”?', options: ['dấu chấm (.)', 'dấu hỏi (?)', 'dấu chấm than (!)'], correct: 1, say: 'Bạn tên là gì?', explain: 'Đây là câu hỏi → dùng dấu chấm hỏi.' },
      { text: 'Đặt dấu gì cuối câu: “Ôi, đẹp quá”?', options: ['dấu chấm (.)', 'dấu hỏi (?)', 'dấu chấm than (!)'], correct: 2, say: 'Ôi, đẹp quá!', explain: 'Đây là câu cảm → dùng dấu chấm than.' },
      { text: 'Đặt dấu gì cuối câu: “Trời hôm nay nắng”?', options: ['dấu chấm (.)', 'dấu hỏi (?)', 'dấu chấm than (!)'], correct: 0, say: 'Trời hôm nay nắng.', explain: 'Đây là câu kể → dùng dấu chấm.' },
      { text: 'Đặt dấu gì cuối câu: “Bé có thích kẹo không”?', options: ['dấu chấm (.)', 'dấu hỏi (?)', 'dấu chấm than (!)'], correct: 1, say: 'Bé có thích kẹo không?', explain: 'Đây là câu hỏi → dùng dấu chấm hỏi.' },
    ],
  },
  {
    slug: 'trai-nghia', emoji: '↔️', title: 'Từ trái nghĩa',
    rule: 'Từ trái nghĩa là hai từ có nghĩa ngược nhau, ví dụ: cao – thấp.',
    questions: [
      { text: 'Trái nghĩa với “cao” là? ⬆️', options: ['thấp', 'to', 'đẹp'], correct: 0, say: 'cao – thấp', explain: 'Cao ngược với thấp.' },
      { text: 'Trái nghĩa với “nóng” là? 🔥', options: ['lạnh', 'ướt', 'nhanh'], correct: 0, say: 'nóng – lạnh', explain: 'Nóng ngược với lạnh.' },
      { text: 'Trái nghĩa với “to” là?', options: ['nhỏ', 'dài', 'vui'], correct: 0, say: 'to – nhỏ', explain: 'To ngược với nhỏ.' },
      { text: 'Trái nghĩa với “nhanh” là?', options: ['chậm', 'cao', 'xanh'], correct: 0, say: 'nhanh – chậm', explain: 'Nhanh ngược với chậm.' },
      { text: 'Trái nghĩa với “ngày” là? 🌙', options: ['đêm', 'sáng', 'mưa'], correct: 0, say: 'ngày – đêm', explain: 'Ngày ngược với đêm.' },
      { text: 'Trái nghĩa với “vui” là?', options: ['buồn', 'đỏ', 'chạy'], correct: 0, say: 'vui – buồn', explain: 'Vui ngược với buồn.' },
    ],
  },
];

export const totalLtcQuestions = () => LTC_TOPICS.reduce((n, t) => n + t.questions.length, 0);
