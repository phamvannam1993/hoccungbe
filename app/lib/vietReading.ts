// Học đọc tiếng Việt cho bé (lớp 1) — bảng chữ cái, đánh vần & dấu thanh, bảng vần.
// Phát âm bằng giọng đọc tiếng Việt qua proxy /api/tts (tl=vi). Đánh vần đọc nối tiếp từng
// mẩu bằng speakSequence.

export type VnLetter = {
  char: string; // chữ (thường)
  ten: string; // TÊN chữ (đọc kiểu abc)
  am: string; // ÂM khi đánh vần
  word: string; // từ mẫu
  emoji: string;
};

// 29 chữ cái tiếng Việt.
export const VN_LETTERS: VnLetter[] = [
  { char: 'a', ten: 'a', am: 'a', word: 'áo', emoji: '👕' },
  { char: 'ă', ten: 'á', am: 'á', word: 'ăn', emoji: '🍚' },
  { char: 'â', ten: 'ớ', am: 'ớ', word: 'ấm', emoji: '🫖' },
  { char: 'b', ten: 'bê', am: 'bờ', word: 'bò', emoji: '🐄' },
  { char: 'c', ten: 'xê', am: 'cờ', word: 'cá', emoji: '🐟' },
  { char: 'd', ten: 'dê', am: 'dờ', word: 'dê', emoji: '🐐' },
  { char: 'đ', ten: 'đê', am: 'đờ', word: 'đèn', emoji: '💡' },
  { char: 'e', ten: 'e', am: 'e', word: 'em', emoji: '👧' },
  { char: 'ê', ten: 'ê', am: 'ê', word: 'ếch', emoji: '🐸' },
  { char: 'g', ten: 'giê', am: 'gờ', word: 'gà', emoji: '🐔' },
  { char: 'h', ten: 'hát', am: 'hờ', word: 'hoa', emoji: '🌸' },
  { char: 'i', ten: 'i', am: 'i', word: 'in', emoji: '🖨️' },
  { char: 'k', ten: 'ca', am: 'cờ', word: 'kem', emoji: '🍦' },
  { char: 'l', ten: 'e-lờ', am: 'lờ', word: 'lá', emoji: '🍃' },
  { char: 'm', ten: 'em-mờ', am: 'mờ', word: 'mèo', emoji: '🐱' },
  { char: 'n', ten: 'en-nờ', am: 'nờ', word: 'nón', emoji: '👒' },
  { char: 'o', ten: 'o', am: 'o', word: 'ong', emoji: '🐝' },
  { char: 'ô', ten: 'ô', am: 'ô', word: 'ô', emoji: '☂️' },
  { char: 'ơ', ten: 'ơ', am: 'ơ', word: 'ớt', emoji: '🌶️' },
  { char: 'p', ten: 'pê', am: 'pờ', word: 'pin', emoji: '🔋' },
  { char: 'q', ten: 'quy', am: 'quờ', word: 'quả', emoji: '🍎' },
  { char: 'r', ten: 'e-rờ', am: 'rờ', word: 'rùa', emoji: '🐢' },
  { char: 's', ten: 'ét-sì', am: 'sờ', word: 'sao', emoji: '⭐' },
  { char: 't', ten: 'tê', am: 'tờ', word: 'tôm', emoji: '🦐' },
  { char: 'u', ten: 'u', am: 'u', word: 'uống', emoji: '🥤' },
  { char: 'ư', ten: 'ư', am: 'ư', word: 'ước', emoji: '🌠' },
  { char: 'v', ten: 'vê', am: 'vờ', word: 'vịt', emoji: '🦆' },
  { char: 'x', ten: 'ích-xì', am: 'xờ', word: 'xe', emoji: '🚗' },
  { char: 'y', ten: 'i dài', am: 'i', word: 'y tá', emoji: '👩‍⚕️' },
];

// 6 dấu thanh.
export const THANH = [
  { key: 'ngang', label: 'Ngang (không dấu)', sample: 'ma' },
  { key: 'huyen', label: 'Huyền ( ` )', sample: 'mà' },
  { key: 'sac', label: 'Sắc ( ´ )', sample: 'má' },
  { key: 'hoi', label: 'Hỏi ( ? )', sample: 'mả' },
  { key: 'nga', label: 'Ngã ( ~ )', sample: 'mã' },
  { key: 'nang', label: 'Nặng ( . )', sample: 'mạ' },
];

// Bộ ví dụ 6 thanh trên cùng một tiếng gốc (dạy phân biệt thanh).
export type ThanhDemo = { base: string; items: { tieng: string; vi: string }[] };
export const THANH_DEMOS: ThanhDemo[] = [
  {
    base: 'ma',
    items: [
      { tieng: 'ma', vi: 'con ma 👻' },
      { tieng: 'mà', vi: 'từ nối "mà"' },
      { tieng: 'má', vi: 'mẹ / má' },
      { tieng: 'mả', vi: 'ngôi mả' },
      { tieng: 'mã', vi: 'con mã (ngựa)' },
      { tieng: 'mạ', vi: 'cây mạ (lúa non)' },
    ],
  },
  {
    base: 'ba',
    items: [
      { tieng: 'ba', vi: 'số ba / bố' },
      { tieng: 'bà', vi: 'người bà 👵' },
      { tieng: 'bá', vi: 'bác (bá)' },
      { tieng: 'bả', vi: 'bà ấy' },
      { tieng: 'bã', vi: 'bã (cặn)' },
      { tieng: 'bạ', vi: 'sổ bạ' },
    ],
  },
];

// Đánh vần các TIẾNG đơn giản: pieces đọc nối tiếp "âm đầu → vần → ghép → thanh → tiếng".
export type DanhVanWord = { tieng: string; pieces: string[]; vi: string; emoji: string };
export const DANH_VAN: DanhVanWord[] = [
  { tieng: 'bà', pieces: ['bờ', 'a', 'ba', 'huyền', 'bà'], vi: 'người bà', emoji: '👵' },
  { tieng: 'bé', pieces: ['bờ', 'e', 'be', 'sắc', 'bé'], vi: 'em bé', emoji: '👶' },
  { tieng: 'cá', pieces: ['cờ', 'a', 'ca', 'sắc', 'cá'], vi: 'con cá', emoji: '🐟' },
  { tieng: 'cò', pieces: ['cờ', 'o', 'co', 'huyền', 'cò'], vi: 'con cò', emoji: '🐦' },
  { tieng: 'mẹ', pieces: ['mờ', 'e', 'me', 'nặng', 'mẹ'], vi: 'mẹ', emoji: '👩' },
  { tieng: 'bố', pieces: ['bờ', 'ô', 'bô', 'sắc', 'bố'], vi: 'bố', emoji: '👨' },
  { tieng: 'gà', pieces: ['gờ', 'a', 'ga', 'huyền', 'gà'], vi: 'con gà', emoji: '🐔' },
  { tieng: 'dê', pieces: ['dờ', 'ê', 'dê'], vi: 'con dê', emoji: '🐐' },
  { tieng: 'na', pieces: ['nờ', 'a', 'na'], vi: 'quả na', emoji: '🍈' },
  { tieng: 'lá', pieces: ['lờ', 'a', 'la', 'sắc', 'lá'], vi: 'lá cây', emoji: '🍃' },
  { tieng: 'bàn', pieces: ['bờ', 'an', 'ban', 'huyền', 'bàn'], vi: 'cái bàn', emoji: '🪑' },
  { tieng: 'cây', pieces: ['cờ', 'ây', 'cây'], vi: 'cái cây', emoji: '🌳' },
];

// Bảng vần ĐẦY ĐỦ (lớp 1), nhóm theo ÂM CUỐI, kèm từ mẫu (emoji nếu có).
export type VanItem = { van: string; word: string; emoji?: string };
export type VanGroup = { label: string; items: VanItem[] };
export const VAN_GROUPS: VanGroup[] = [
  {
    label: 'Nguyên âm đôi: ia – ua – ưa',
    items: [
      { van: 'ia', word: 'mía', emoji: '🎋' },
      { van: 'ua', word: 'cua', emoji: '🦀' },
      { van: 'ưa', word: 'mưa', emoji: '🌧️' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -n',
    items: [
      { van: 'an', word: 'bàn', emoji: '🪑' },
      { van: 'ăn', word: 'chăn', emoji: '🛏️' },
      { van: 'ân', word: 'cân', emoji: '⚖️' },
      { van: 'en', word: 'kèn', emoji: '🎺' },
      { van: 'ên', word: 'sên', emoji: '🐌' },
      { van: 'in', word: 'xin', emoji: '🙏' },
      { van: 'on', word: 'con', emoji: '🐛' },
      { van: 'ôn', word: 'chồn', emoji: '🦡' },
      { van: 'ơn', word: 'sơn', emoji: '🎨' },
      { van: 'un', word: 'bún', emoji: '🍜' },
      { van: 'iên', word: 'biển', emoji: '🌊' },
      { van: 'uôn', word: 'muốn', emoji: '🙂' },
      { van: 'ươn', word: 'vườn', emoji: '🌳' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -m',
    items: [
      { van: 'am', word: 'cam', emoji: '🍊' },
      { van: 'ăm', word: 'nằm', emoji: '🛌' },
      { van: 'âm', word: 'nấm', emoji: '🍄' },
      { van: 'em', word: 'kem', emoji: '🍦' },
      { van: 'êm', word: 'đêm', emoji: '🌙' },
      { van: 'im', word: 'chim', emoji: '🐦' },
      { van: 'om', word: 'gom', emoji: '🧹' },
      { van: 'ôm', word: 'ôm', emoji: '🤗' },
      { van: 'ơm', word: 'cơm', emoji: '🍚' },
      { van: 'um', word: 'chum', emoji: '🏺' },
      { van: 'iêm', word: 'kiếm', emoji: '⚔️' },
      { van: 'ươm', word: 'bướm', emoji: '🦋' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -ng',
    items: [
      { van: 'ang', word: 'bàng', emoji: '🌳' },
      { van: 'ăng', word: 'măng', emoji: '🎋' },
      { van: 'âng', word: 'tầng', emoji: '🏢' },
      { van: 'ong', word: 'bóng', emoji: '⚽' },
      { van: 'ông', word: 'sông', emoji: '🌊' },
      { van: 'ung', word: 'súng', emoji: '🔫' },
      { van: 'ưng', word: 'sừng', emoji: '🦬' },
      { van: 'iêng', word: 'chiêng', emoji: '🥁' },
      { van: 'uông', word: 'chuông', emoji: '🔔' },
      { van: 'ương', word: 'gương', emoji: '🪞' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -nh',
    items: [
      { van: 'anh', word: 'bánh', emoji: '🥖' },
      { van: 'ênh', word: 'kênh', emoji: '🛶' },
      { van: 'inh', word: 'kính', emoji: '👓' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -c',
    items: [
      { van: 'ac', word: 'các', emoji: '📇' },
      { van: 'ăc', word: 'mặc', emoji: '👕' },
      { van: 'âc', word: 'nhấc', emoji: '💪' },
      { van: 'oc', word: 'sóc', emoji: '🐿️' },
      { van: 'ôc', word: 'cốc', emoji: '🥛' },
      { van: 'uc', word: 'cúc', emoji: '🌼' },
      { van: 'ưc', word: 'mực', emoji: '🦑' },
      { van: 'iêc', word: 'xiếc', emoji: '🎪' },
      { van: 'uôc', word: 'cuốc', emoji: '⛏️' },
      { van: 'ươc', word: 'bước', emoji: '👣' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -ch',
    items: [
      { van: 'ach', word: 'sách', emoji: '📖' },
      { van: 'êch', word: 'ếch', emoji: '🐸' },
      { van: 'ich', word: 'lịch', emoji: '📅' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -t',
    items: [
      { van: 'at', word: 'hát', emoji: '🎤' },
      { van: 'ăt', word: 'mắt', emoji: '👁️' },
      { van: 'ât', word: 'vất', emoji: '💦' },
      { van: 'et', word: 'kẹt', emoji: '🚪' },
      { van: 'êt', word: 'tết', emoji: '🎊' },
      { van: 'it', word: 'mít', emoji: '🥭' },
      { van: 'ot', word: 'hót', emoji: '🐦' },
      { van: 'ôt', word: 'một', emoji: '1️⃣' },
      { van: 'ơt', word: 'ớt', emoji: '🌶️' },
      { van: 'ut', word: 'bút', emoji: '🖊️' },
      { van: 'iêt', word: 'viết', emoji: '✍️' },
      { van: 'uôt', word: 'chuột', emoji: '🐭' },
      { van: 'ươt', word: 'lướt', emoji: '🏄' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -p',
    items: [
      { van: 'ap', word: 'cặp', emoji: '🎒' },
      { van: 'ăp', word: 'gặp', emoji: '🤝' },
      { van: 'âp', word: 'tập', emoji: '📓' },
      { van: 'ep', word: 'dép', emoji: '🩴' },
      { van: 'êp', word: 'nếp', emoji: '🍙' },
      { van: 'ip', word: 'dịp', emoji: '📆' },
      { van: 'op', word: 'họp', emoji: '👥' },
      { van: 'ôp', word: 'hộp', emoji: '📦' },
      { van: 'up', word: 'búp', emoji: '🌷' },
      { van: 'iêp', word: 'thiếp', emoji: '💌' },
      { van: 'ươp', word: 'mướp', emoji: '🥒' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -i / -y',
    items: [
      { van: 'ai', word: 'tai', emoji: '👂' },
      { van: 'ay', word: 'bay', emoji: '✈️' },
      { van: 'ây', word: 'cây', emoji: '🌳' },
      { van: 'oi', word: 'voi', emoji: '🐘' },
      { van: 'ôi', word: 'xôi', emoji: '🍚' },
      { van: 'ơi', word: 'bơi', emoji: '🏊' },
      { van: 'ui', word: 'núi', emoji: '⛰️' },
      { van: 'ưi', word: 'gửi', emoji: '📮' },
      { van: 'uôi', word: 'chuối', emoji: '🍌' },
      { van: 'ươi', word: 'cười', emoji: '😄' },
      { van: 'oai', word: 'khoai', emoji: '🍠' },
    ],
  },
  {
    label: 'Vần kết thúc bằng -o / -u',
    items: [
      { van: 'ao', word: 'sao', emoji: '⭐' },
      { van: 'eo', word: 'mèo', emoji: '🐱' },
      { van: 'au', word: 'rau', emoji: '🥬' },
      { van: 'âu', word: 'cầu', emoji: '🌉' },
      { van: 'êu', word: 'nêu', emoji: '🎍' },
      { van: 'iu', word: 'rìu', emoji: '🪓' },
      { van: 'ưu', word: 'lựu', emoji: '🍎' },
      { van: 'iêu', word: 'diều', emoji: '🪁' },
      { van: 'yêu', word: 'yêu', emoji: '❤️' },
      { van: 'ươu', word: 'hươu', emoji: '🦌' },
    ],
  },
  {
    label: 'Vần có âm đệm: oa – oe – uê – uy',
    items: [
      { van: 'oa', word: 'hoa', emoji: '🌸' },
      { van: 'oe', word: 'khoe', emoji: '💪' },
      { van: 'uê', word: 'huệ', emoji: '🌼' },
      { van: 'uy', word: 'suy', emoji: '🤔' },
      { van: 'oai', word: 'xoài', emoji: '🥭' },
      { van: 'oay', word: 'xoay', emoji: '🔄' },
    ],
  },
];

export const totalVan = () => VAN_GROUPS.reduce((n, g) => n + g.items.length, 0);
