// Phonics — ghép vần đọc tiếng Anh cho bé, theo nhóm NGUYÊN ÂM NGẮN (CVC words).
// CVC = phụ âm + nguyên âm + phụ âm (cat, dog, sun) — dạng từ đầu tiên trẻ tập đọc.
//
// Phát âm dùng Web Speech (giọng bản ngữ). "Đánh vần" = đọc chậm rồi đọc thường để bé
// nghe cách nối âm. hint = gợi ý âm kiểu Việt cho phụ huynh (cờ–a–tờ).

export type PhonicsWord = {
  word: string; // từ CVC
  letters: [string, string, string]; // 3 chữ
  hint: string; // gợi ý đánh vần kiểu Việt
  vi: string;
  emoji: string;
};

export type PhonicsGroup = {
  slug: string;
  vowel: string; // chữ nguyên âm
  sound: string; // âm IPA
  label: string; // vd "Nguyên âm ngắn A"
  emoji: string;
  words: PhonicsWord[];
};

export const PHONICS_GROUPS: PhonicsGroup[] = [
  {
    slug: 'a', vowel: 'a', sound: '/æ/', label: 'Nguyên âm ngắn A', emoji: '🅰️',
    words: [
      { word: 'cat', letters: ['c', 'a', 't'], hint: 'cờ–a–tờ', vi: 'con mèo', emoji: '🐱' },
      { word: 'bat', letters: ['b', 'a', 't'], hint: 'bờ–a–tờ', vi: 'con dơi', emoji: '🦇' },
      { word: 'hat', letters: ['h', 'a', 't'], hint: 'hờ–a–tờ', vi: 'cái mũ', emoji: '🎩' },
      { word: 'map', letters: ['m', 'a', 'p'], hint: 'mờ–a–pờ', vi: 'bản đồ', emoji: '🗺️' },
      { word: 'bag', letters: ['b', 'a', 'g'], hint: 'bờ–a–gờ', vi: 'cái túi', emoji: '🎒' },
      { word: 'man', letters: ['m', 'a', 'n'], hint: 'mờ–a–nờ', vi: 'người đàn ông', emoji: '👨' },
      { word: 'cap', letters: ['c', 'a', 'p'], hint: 'cờ–a–pờ', vi: 'mũ lưỡi trai', emoji: '🧢' },
      { word: 'van', letters: ['v', 'a', 'n'], hint: 'vờ–a–nờ', vi: 'xe tải nhỏ', emoji: '🚐' },
    ],
  },
  {
    slug: 'e', vowel: 'e', sound: '/e/', label: 'Nguyên âm ngắn E', emoji: '🅴',
    words: [
      { word: 'bed', letters: ['b', 'e', 'd'], hint: 'bờ–e–đờ', vi: 'cái giường', emoji: '🛏️' },
      { word: 'hen', letters: ['h', 'e', 'n'], hint: 'hờ–e–nờ', vi: 'gà mái', emoji: '🐔' },
      { word: 'pen', letters: ['p', 'e', 'n'], hint: 'pờ–e–nờ', vi: 'cái bút', emoji: '🖊️' },
      { word: 'net', letters: ['n', 'e', 't'], hint: 'nờ–e–tờ', vi: 'cái lưới', emoji: '🥅' },
      { word: 'ten', letters: ['t', 'e', 'n'], hint: 'tờ–e–nờ', vi: 'số mười', emoji: '🔟' },
      { word: 'red', letters: ['r', 'e', 'd'], hint: 'rờ–e–đờ', vi: 'màu đỏ', emoji: '🔴' },
      { word: 'jet', letters: ['j', 'e', 't'], hint: 'giờ–e–tờ', vi: 'máy bay phản lực', emoji: '✈️' },
      { word: 'web', letters: ['w', 'e', 'b'], hint: 'guờ–e–bờ', vi: 'mạng nhện', emoji: '🕸️' },
    ],
  },
  {
    slug: 'i', vowel: 'i', sound: '/ɪ/', label: 'Nguyên âm ngắn I', emoji: '🇮',
    words: [
      { word: 'pig', letters: ['p', 'i', 'g'], hint: 'pờ–i–gờ', vi: 'con lợn', emoji: '🐷' },
      { word: 'six', letters: ['s', 'i', 'x'], hint: 'sờ–i–xờ', vi: 'số sáu', emoji: '6️⃣' },
      { word: 'sit', letters: ['s', 'i', 't'], hint: 'sờ–i–tờ', vi: 'ngồi', emoji: '🪑' },
      { word: 'big', letters: ['b', 'i', 'g'], hint: 'bờ–i–gờ', vi: 'to lớn', emoji: '🐘' },
      { word: 'lip', letters: ['l', 'i', 'p'], hint: 'lờ–i–pờ', vi: 'cái môi', emoji: '👄' },
      { word: 'pin', letters: ['p', 'i', 'n'], hint: 'pờ–i–nờ', vi: 'ghim', emoji: '📌' },
      { word: 'kid', letters: ['k', 'i', 'd'], hint: 'kờ–i–đờ', vi: 'đứa trẻ', emoji: '🧒' },
      { word: 'fin', letters: ['f', 'i', 'n'], hint: 'phờ–i–nờ', vi: 'vây cá', emoji: '🐟' },
    ],
  },
  {
    slug: 'o', vowel: 'o', sound: '/ɒ/', label: 'Nguyên âm ngắn O', emoji: '🅾️',
    words: [
      { word: 'dog', letters: ['d', 'o', 'g'], hint: 'đờ–o–gờ', vi: 'con chó', emoji: '🐶' },
      { word: 'box', letters: ['b', 'o', 'x'], hint: 'bờ–o–xờ', vi: 'cái hộp', emoji: '📦' },
      { word: 'fox', letters: ['f', 'o', 'x'], hint: 'phờ–o–xờ', vi: 'con cáo', emoji: '🦊' },
      { word: 'pot', letters: ['p', 'o', 't'], hint: 'pờ–o–tờ', vi: 'cái nồi', emoji: '🍲' },
      { word: 'hot', letters: ['h', 'o', 't'], hint: 'hờ–o–tờ', vi: 'nóng', emoji: '🔥' },
      { word: 'top', letters: ['t', 'o', 'p'], hint: 'tờ–o–pờ', vi: 'con quay', emoji: '🔝' },
      { word: 'mop', letters: ['m', 'o', 'p'], hint: 'mờ–o–pờ', vi: 'cây lau nhà', emoji: '🧹' },
      { word: 'log', letters: ['l', 'o', 'g'], hint: 'lờ–o–gờ', vi: 'khúc gỗ', emoji: '🪵' },
    ],
  },
  {
    slug: 'u', vowel: 'u', sound: '/ʌ/', label: 'Nguyên âm ngắn U', emoji: '🆄',
    words: [
      { word: 'sun', letters: ['s', 'u', 'n'], hint: 'sờ–â–nờ', vi: 'mặt trời', emoji: '☀️' },
      { word: 'bus', letters: ['b', 'u', 's'], hint: 'bờ–â–sờ', vi: 'xe buýt', emoji: '🚌' },
      { word: 'cup', letters: ['c', 'u', 'p'], hint: 'cờ–â–pờ', vi: 'cái cốc', emoji: '☕' },
      { word: 'bug', letters: ['b', 'u', 'g'], hint: 'bờ–â–gờ', vi: 'con bọ', emoji: '🐛' },
      { word: 'nut', letters: ['n', 'u', 't'], hint: 'nờ–â–tờ', vi: 'hạt', emoji: '🥜' },
      { word: 'mug', letters: ['m', 'u', 'g'], hint: 'mờ–â–gờ', vi: 'cốc quai', emoji: '☕' },
      { word: 'run', letters: ['r', 'u', 'n'], hint: 'rờ–â–nờ', vi: 'chạy', emoji: '🏃' },
      { word: 'jug', letters: ['j', 'u', 'g'], hint: 'giờ–â–gờ', vi: 'bình rót', emoji: '🫗' },
    ],
  },
];

export const totalPhonicsWords = () => PHONICS_GROUPS.reduce((n, g) => n + g.words.length, 0);
