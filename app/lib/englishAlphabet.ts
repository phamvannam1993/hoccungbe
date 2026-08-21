// Bảng chữ cái tiếng Anh A–Z cho bé — nền tảng để tập đọc (phonics).
// Dữ liệu tĩnh, phát âm dùng Web Speech API (giọng Google trình duyệt) — xem client.
//
// Mỗi chữ:
//   • name: cách ĐỌC TÊN chữ (a=ây, b=bi…) — gợi ý bằng tiếng Việt cho phụ huynh.
//   • sound: ÂM của chữ khi ghép vần (phonics), gợi ý ngắn (a → /æ/ "ờ-a").
//   • word/vi/emoji: từ mẫu bắt đầu bằng chữ đó.

export type AlphabetLetter = {
  upper: string;
  lower: string;
  name: string; // tên chữ đọc kiểu Việt (tham khảo)
  sound: string; // âm phonics (IPA ngắn)
  word: string; // từ mẫu tiếng Anh
  vi: string; // nghĩa
  emoji: string;
};

export const ENGLISH_ALPHABET: AlphabetLetter[] = [
  { upper: 'A', lower: 'a', name: 'ây', sound: '/æ/', word: 'apple', vi: 'quả táo', emoji: '🍎' },
  { upper: 'B', lower: 'b', name: 'bi', sound: '/b/', word: 'ball', vi: 'quả bóng', emoji: '⚽' },
  { upper: 'C', lower: 'c', name: 'xi', sound: '/k/', word: 'cat', vi: 'con mèo', emoji: '🐱' },
  { upper: 'D', lower: 'd', name: 'đi', sound: '/d/', word: 'dog', vi: 'con chó', emoji: '🐶' },
  { upper: 'E', lower: 'e', name: 'i', sound: '/e/', word: 'egg', vi: 'quả trứng', emoji: '🥚' },
  { upper: 'F', lower: 'f', name: 'ép', sound: '/f/', word: 'fish', vi: 'con cá', emoji: '🐟' },
  { upper: 'G', lower: 'g', name: 'gii', sound: '/g/', word: 'goat', vi: 'con dê', emoji: '🐐' },
  { upper: 'H', lower: 'h', name: 'ếch', sound: '/h/', word: 'hat', vi: 'cái mũ', emoji: '🎩' },
  { upper: 'I', lower: 'i', name: 'ai', sound: '/ɪ/', word: 'igloo', vi: 'nhà tuyết', emoji: '🏠' },
  { upper: 'J', lower: 'j', name: 'giây', sound: '/dʒ/', word: 'juice', vi: 'nước ép', emoji: '🧃' },
  { upper: 'K', lower: 'k', name: 'kây', sound: '/k/', word: 'kite', vi: 'con diều', emoji: '🪁' },
  { upper: 'L', lower: 'l', name: 'eo', sound: '/l/', word: 'lion', vi: 'sư tử', emoji: '🦁' },
  { upper: 'M', lower: 'm', name: 'em', sound: '/m/', word: 'monkey', vi: 'con khỉ', emoji: '🐵' },
  { upper: 'N', lower: 'n', name: 'en', sound: '/n/', word: 'nose', vi: 'cái mũi', emoji: '👃' },
  { upper: 'O', lower: 'o', name: 'âu', sound: '/ɒ/', word: 'orange', vi: 'quả cam', emoji: '🍊' },
  { upper: 'P', lower: 'p', name: 'pi', sound: '/p/', word: 'pig', vi: 'con lợn', emoji: '🐷' },
  { upper: 'Q', lower: 'q', name: 'kiu', sound: '/kw/', word: 'queen', vi: 'nữ hoàng', emoji: '👑' },
  { upper: 'R', lower: 'r', name: 'a', sound: '/r/', word: 'rabbit', vi: 'con thỏ', emoji: '🐰' },
  { upper: 'S', lower: 's', name: 'ét', sound: '/s/', word: 'sun', vi: 'mặt trời', emoji: '☀️' },
  { upper: 'T', lower: 't', name: 'ti', sound: '/t/', word: 'tiger', vi: 'con hổ', emoji: '🐯' },
  { upper: 'U', lower: 'u', name: 'diu', sound: '/ʌ/', word: 'umbrella', vi: 'cái ô', emoji: '☂️' },
  { upper: 'V', lower: 'v', name: 'vi', sound: '/v/', word: 'van', vi: 'xe tải nhỏ', emoji: '🚐' },
  { upper: 'W', lower: 'w', name: 'đắp-liu', sound: '/w/', word: 'whale', vi: 'cá voi', emoji: '🐳' },
  { upper: 'X', lower: 'x', name: 'ích', sound: '/ks/', word: 'fox', vi: 'con cáo', emoji: '🦊' },
  { upper: 'Y', lower: 'y', name: 'oai', sound: '/j/', word: 'yo-yo', vi: 'con quay', emoji: '🪀' },
  { upper: 'Z', lower: 'z', name: 'dét', sound: '/z/', word: 'zebra', vi: 'ngựa vằn', emoji: '🦓' },
];
