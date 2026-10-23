// Phonics — ghép vần đọc tiếng Anh cho bé, theo nhóm NGUYÊN ÂM NGẮN (CVC words).
// CVC = phụ âm + nguyên âm + phụ âm (cat, dog, sun) — dạng từ đầu tiên trẻ tập đọc.
// Chỉ nhận CVC THUẦN: 3 chữ = 3 âm. Từ có x (box, fox, six: x = /ks/ là 2 âm) không đưa vào đây —
// fox/box/ox nằm ở Họ từ -ox. CCVC (frog, stop) và CVCC (milk, jump) để thành bài riêng sau.
//
// CHUẨN PHÁT ÂM: Anh-Mỹ (General American) — khớp giọng đọc của site (/api/tts giọng Mỹ).
// Vì vậy o ngắn là /ɑ/ (hot, dog), e ngắn là /ɛ/. IPA từng âm sinh tự động từ 3 chữ (phonemes()).
// "Đánh vần" = tách /s/ – /ʌ/ – /n/ rồi ghép /sʌn/. hint (sờ–â–nờ) CHỈ là gợi ý cho phụ huynh,
// không phải phiên âm: đọc kiểu Việt dễ thêm âm "ờ" không có trong tiếng Anh.
//
// adv = mức NÂNG CAO: từ khó vẽ thành hình rõ nghĩa (fed, got, but…) → hiện ở mục riêng và không
// dùng trong mini quiz (câu "chọn hình đúng" cần hình không thể nhầm).

export type PhonicsWord = {
  word: string; // từ CVC
  letters: [string, string, string]; // 3 chữ
  hint: string; // gợi ý đánh vần kiểu Việt cho phụ huynh (sinh tự động)
  vi: string;
  emoji: string;
  adv?: boolean; // nâng cao — khó minh họa
};

export type PhonicsGroup = {
  slug: string;
  vowel: string; // chữ nguyên âm
  sound: string; // âm IPA (Anh-Mỹ)
  label: string; // vd "Nguyên âm ngắn A"
  emoji: string;
  words: PhonicsWord[];
};

// Gợi ý âm kiểu Việt cho phụ huynh (u ngắn /ʌ/ gần "â").
const VI_CONSONANT: Record<string, string> = {
  b: 'bờ', c: 'cờ', d: 'đờ', f: 'phờ', g: 'gờ', h: 'hờ', j: 'giờ', k: 'kờ', l: 'lờ', m: 'mờ', n: 'nờ',
  p: 'pờ', r: 'rờ', s: 'sờ', t: 'tờ', v: 'vờ', w: 'guờ', y: 'dờ', z: 'dờ',
};
const VI_VOWEL: Record<string, string> = { a: 'a', e: 'e', i: 'i', o: 'o', u: 'â' };

function w(word: string, vi: string, emoji: string, adv = false): PhonicsWord {
  const letters = word.split('') as [string, string, string];
  const hint = letters.map((ch, i) => (i === 1 ? VI_VOWEL[ch] : VI_CONSONANT[ch]) ?? ch).join('–');
  return { word, letters, hint, vi, emoji, ...(adv ? { adv: true } : {}) };
}

export const PHONICS_GROUPS: PhonicsGroup[] = [
  {
    slug: 'a', vowel: 'a', sound: '/æ/', label: 'Nguyên âm ngắn A', emoji: '🅰️',
    words: [
      w('cat', 'con mèo', '🐱'), w('bat', 'con dơi', '🦇'), w('hat', 'cái mũ', '🎩'), w('rat', 'con chuột', '🐀'),
      w('bag', 'cái túi', '🎒'), w('tag', 'nhãn mác', '🏷️'), w('jam', 'mứt', '🫙'), w('ham', 'thịt giăm bông', '🍖'),
      w('ram', 'cừu đực', '🐏'), w('fan', 'cái quạt', '🪭'), w('man', 'người đàn ông', '👨'), w('pan', 'cái chảo', '🍳'),
      w('can', 'cái lon', '🥫'), w('van', 'xe tải nhỏ', '🚐'), w('map', 'bản đồ', '🗺️'), w('cap', 'mũ lưỡi trai', '🧢'),
      w('tap', 'vòi nước', '🚰'), w('nap', 'giấc ngủ ngắn', '😴'), w('dad', 'bố', '👨‍👧'), w('sad', 'buồn', '😢'),
      w('mat', 'tấm thảm', '🧘', true), w('sat', 'đã ngồi', '🪑', true), w('fat', 'béo', '🐷', true),
      w('pat', 'vỗ nhẹ', '🫳', true), w('wag', 'vẫy đuôi', '🐕', true),
    ],
  },
  {
    slug: 'e', vowel: 'e', sound: '/ɛ/', label: 'Nguyên âm ngắn E', emoji: '🅴',
    words: [
      w('bed', 'cái giường', '🛏️'), w('red', 'màu đỏ', '🔴'), w('pen', 'cái bút', '🖊️'), w('hen', 'gà mái', '🐔'),
      w('ten', 'số mười', '🔟'), w('men', 'những người đàn ông', '👬'), w('pet', 'thú cưng', '🐶'), w('wet', 'ướt', '💦'),
      w('net', 'cái lưới', '🥅'), w('jet', 'máy bay phản lực', '✈️'), w('vet', 'bác sĩ thú y', '🩺'), w('leg', 'cái chân', '🦵'),
      w('web', 'mạng nhện', '🕸️'), w('yes', 'vâng, có', '✅'),
      w('fed', 'đã cho ăn', '🍼', true), w('led', 'đã dẫn đường', '🧭', true), w('den', 'hang thú', '🐻', true),
      w('set', 'bộ (đồ)', '🧩', true), w('beg', 'năn nỉ', '🙏', true), w('peg', 'cái kẹp', '🧷', true),
      w('get', 'nhận được', '🎁', true),
    ],
  },
  {
    slug: 'i', vowel: 'i', sound: '/ɪ/', label: 'Nguyên âm ngắn I', emoji: '🇮',
    words: [
      w('pig', 'con lợn', '🐷'), w('big', 'to lớn', '🐘'), w('dig', 'đào', '⛏️'), w('pin', 'cái ghim', '📌'),
      w('bin', 'thùng rác', '🗑️'), w('fin', 'vây cá', '🐟'), w('win', 'chiến thắng', '🏆'), w('tin', 'hộp thiếc', '🥫'),
      w('sit', 'ngồi', '🪑'), w('hit', 'đánh', '🏏'), w('kit', 'bộ dụng cụ', '🧰'), w('lip', 'đôi môi', '👄'),
      w('zip', 'khóa kéo', '🤐'), w('lid', 'cái nắp', '🫙'), w('kid', 'đứa trẻ', '🧒'),
      w('wig', 'bộ tóc giả', '💇', true), w('fit', 'khỏe mạnh', '💪', true), w('bit', 'một chút', '🤏', true),
      w('dip', 'chấm (nước sốt)', '🥣', true), w('hip', 'cái hông', '💃', true), w('rib', 'xương sườn', '🍖', true),
    ],
  },
  {
    slug: 'o', vowel: 'o', sound: '/ɑ/', label: 'Nguyên âm ngắn O', emoji: '🅾️',
    words: [
      w('dog', 'con chó', '🐶'), w('log', 'khúc gỗ', '🪵'), w('fog', 'sương mù', '🌫️'), w('hog', 'con lợn rừng', '🐗'),
      w('jog', 'chạy bộ', '🏃'), w('hot', 'nóng', '🔥'), w('pot', 'cái nồi', '🍲'), w('dot', 'dấu chấm', '⚫'),
      w('hop', 'nhảy lò cò', '🐇'), w('mop', 'cây lau nhà', '🧹'), w('pop', 'nổ bụp', '🎈'), w('cop', 'cảnh sát', '👮'),
      w('rod', 'cần câu', '🎣'), w('job', 'công việc', '💼'), w('top', 'trên đỉnh', '🔝'),
      w('cot', 'giường cũi', '👶', true), w('lot', 'nhiều', '🔢', true), w('got', 'đã có được', '🎁', true),
      w('nod', 'gật đầu', '🙂‍↕️', true), w('sob', 'khóc nức nở', '😭', true),
    ],
  },
  {
    slug: 'u', vowel: 'u', sound: '/ʌ/', label: 'Nguyên âm ngắn U', emoji: '🆄',
    words: [
      w('sun', 'mặt trời', '☀️'), w('run', 'chạy', '🏃'), w('fun', 'vui vẻ', '🎉'), w('bun', 'bánh mì tròn', '🥯'),
      w('bus', 'xe buýt', '🚌'), w('cup', 'cái cốc', '🥤'), w('pup', 'chó con', '🐕'), w('bug', 'con bọ', '🐛'),
      w('hug', 'ôm', '🤗'), w('mug', 'cốc có quai', '☕'), w('jug', 'bình rót', '🫗'), w('bud', 'nụ hoa', '🌷'),
      w('cut', 'cắt', '✂️'), w('hut', 'túp lều', '🛖'), w('nut', 'hạt', '🥜'), w('tub', 'bồn tắm', '🛁'),
      w('cub', 'gấu con', '🐻'), w('sub', 'bánh mì kẹp', '🥪'),
      w('rug', 'tấm thảm', '🧶', true), w('dug', 'đã đào', '⛏️', true), w('mud', 'bùn', '🟤', true),
      w('but', 'nhưng', '🔀', true), w('rub', 'xoa, thoa', '🧴', true),
    ],
  },
];

// Phụ âm → âm IPA (Anh-Mỹ). c/k cùng /k/, j = /dʒ/, y = /j/.
const CONSONANT: Record<string, string> = {
  b: 'b', c: 'k', d: 'd', f: 'f', g: 'g', h: 'h', j: 'dʒ', k: 'k', l: 'l', m: 'm', n: 'n',
  p: 'p', r: 'r', s: 's', t: 't', v: 'v', w: 'w', y: 'j', z: 'z',
};
const SHORT_VOWEL: Record<string, string> = { a: 'æ', e: 'ɛ', i: 'ɪ', o: 'ɑ', u: 'ʌ' };

/** Ba âm của từ CVC, vd sun → ['s', 'ʌ', 'n']. */
export const phonemes = (w: PhonicsWord) => w.letters.map((ch, i) => (i === 1 ? SHORT_VOWEL[ch] : CONSONANT[ch]) ?? ch);

/** Phiên âm cả từ, vd /sʌn/. */
export const wordIpa = (w: PhonicsWord) => `/${phonemes(w).join('')}/`;

export const totalPhonicsWords = () => PHONICS_GROUPS.reduce((n, g) => n + g.words.length, 0);
