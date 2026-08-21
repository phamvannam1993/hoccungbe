// Sight words — từ THÔNG DỤNG (high-frequency) tiếng Anh cho bé.
// Đây là những từ xuất hiện nhiều nhất trong sách thiếu nhi; bé cần NHẬN MẶT NHANH
// (nhiều từ không đọc theo phonics: the, of, was…). Dựa theo danh sách Dolch.
// Phát âm qua Web Speech / proxy tl=en.

export type SightWord = { en: string; vi: string };

export type SightWordGroup = {
  slug: string;
  level: string;
  emoji: string;
  note: string;
  words: SightWord[];
};

export const SIGHT_WORD_GROUPS: SightWordGroup[] = [
  {
    slug: 'pre-primer', level: 'Cấp 1 – Vỡ lòng', emoji: '🌱',
    note: 'Những từ đầu tiên bé cần thuộc mặt.',
    words: [
      { en: 'a', vi: 'một' }, { en: 'and', vi: 'và' }, { en: 'the', vi: '(mạo từ) cái/con đó' },
      { en: 'I', vi: 'tôi/mình' }, { en: 'you', vi: 'bạn' }, { en: 'is', vi: 'thì/là' },
      { en: 'it', vi: 'nó' }, { en: 'to', vi: 'đến/tới' }, { en: 'in', vi: 'ở trong' },
      { en: 'go', vi: 'đi' }, { en: 'me', vi: 'tôi (tân ngữ)' }, { en: 'my', vi: 'của tôi' },
      { en: 'we', vi: 'chúng tôi' }, { en: 'see', vi: 'nhìn thấy' }, { en: 'can', vi: 'có thể' },
      { en: 'am', vi: 'thì/là (với I)' }, { en: 'up', vi: 'lên/phía trên' }, { en: 'big', vi: 'to' },
      { en: 'little', vi: 'nhỏ' }, { en: 'yes', vi: 'vâng/có' }, { en: 'no', vi: 'không' },
    ],
  },
  {
    slug: 'primer', level: 'Cấp 2 – Cơ bản', emoji: '🌿',
    note: 'Từ hay gặp khi bắt đầu đọc câu.',
    words: [
      { en: 'he', vi: 'anh ấy' }, { en: 'she', vi: 'cô ấy' }, { en: 'they', vi: 'họ' },
      { en: 'are', vi: 'thì/là (số nhiều)' }, { en: 'was', vi: 'đã là' }, { en: 'have', vi: 'có' },
      { en: 'like', vi: 'thích' }, { en: 'this', vi: 'cái này' }, { en: 'that', vi: 'cái kia' },
      { en: 'here', vi: 'ở đây' }, { en: 'there', vi: 'ở đó' }, { en: 'do', vi: 'làm' },
      { en: 'good', vi: 'tốt' }, { en: 'play', vi: 'chơi' }, { en: 'run', vi: 'chạy' },
      { en: 'come', vi: 'đến' }, { en: 'said', vi: 'đã nói' }, { en: 'look', vi: 'nhìn' },
      { en: 'want', vi: 'muốn' }, { en: 'get', vi: 'lấy/nhận' }, { en: 'for', vi: 'cho/dành cho' },
    ],
  },
  {
    slug: 'grade-1', level: 'Cấp 3 – Lớp 1', emoji: '🌳',
    note: 'Từ dùng nhiều trong đoạn văn.',
    words: [
      { en: 'of', vi: 'của' }, { en: 'his', vi: 'của anh ấy' }, { en: 'her', vi: 'của cô ấy' },
      { en: 'him', vi: 'anh ấy (tân ngữ)' }, { en: 'has', vi: 'có (số ít)' }, { en: 'had', vi: 'đã có' },
      { en: 'but', vi: 'nhưng' }, { en: 'when', vi: 'khi nào' }, { en: 'then', vi: 'sau đó' },
      { en: 'them', vi: 'họ (tân ngữ)' }, { en: 'some', vi: 'một vài' }, { en: 'from', vi: 'từ' },
      { en: 'with', vi: 'với' }, { en: 'were', vi: 'đã là (số nhiều)' }, { en: 'what', vi: 'cái gì' },
      { en: 'how', vi: 'như thế nào' }, { en: 'know', vi: 'biết' }, { en: 'make', vi: 'làm/tạo' },
      { en: 'give', vi: 'cho/đưa' }, { en: 'put', vi: 'đặt/để' }, { en: 'now', vi: 'bây giờ' },
    ],
  },
];

export const totalSightWords = () => SIGHT_WORD_GROUPS.reduce((n, g) => n + g.words.length, 0);
