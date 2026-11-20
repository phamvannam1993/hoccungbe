// Dữ liệu + bộ sinh bảng cho trò "Tìm từ".
//
// Tiếng Việt: MỖI Ô LÀ MỘT CHỮ CÁI CÓ DẤU (NFC), viết hoa — "MÈO" chiếm 3 ô M · È · O.
// Từ nhiều tiếng được ghép liền trong bảng ("SƯ TỬ" → SƯTỬ) nhưng danh sách bên cạnh
// vẫn hiện dạng đọc được có dấu cách. Bỏ dấu sẽ sai chính tả nên không bao giờ bỏ.

export type WsLang = 'vi' | 'en';

export type WsWord = {
  /** Dạng hiển thị trong danh sách, vd "sư tử" hoặc "cat". */
  text: string;
  /** Nghĩa tiếng Việt (chỉ cho chủ đề tiếng Anh). */
  meaning?: string;
};

export type WsTopic = {
  key: string;
  label: string;
  emoji: string;
  lang: WsLang;
  words: WsWord[];
};

const vi = (...ws: string[]): WsWord[] => ws.map((text) => ({ text }));
const en = (pairs: [string, string][]): WsWord[] => pairs.map(([text, meaning]) => ({ text, meaning }));

export const WS_TOPICS: WsTopic[] = [
  {
    key: 'con-vat', label: 'Con vật', emoji: '🐾', lang: 'vi',
    words: vi('cá', 'mèo', 'gà', 'vịt', 'chó', 'thỏ', 'voi', 'khỉ', 'ngựa', 'chuột', 'hổ', 'gấu', 'ong', 'rùa', 'ếch', 'chim', 'sư tử', 'cá voi', 'hươu', 'cua'),
  },
  {
    key: 'trai-cay', label: 'Trái cây', emoji: '🍉', lang: 'vi',
    words: vi('cam', 'chuối', 'xoài', 'dưa hấu', 'na', 'lê', 'táo', 'nho', 'ổi', 'mít', 'dứa', 'bưởi', 'đu đủ', 'chôm chôm', 'măng cụt', 'thanh long', 'vải', 'mận'),
  },
  {
    key: 'mau-sac', label: 'Màu sắc', emoji: '🎨', lang: 'vi',
    words: vi('đỏ', 'xanh', 'vàng', 'tím', 'hồng', 'trắng', 'đen', 'nâu', 'cam', 'xám', 'xanh lá', 'tím than', 'vàng chanh', 'hồng phấn'),
  },
  {
    key: 'gia-dinh', label: 'Gia đình', emoji: '👨‍👩‍👧', lang: 'vi',
    words: vi('bố', 'mẹ', 'ông', 'bà', 'anh', 'chị', 'em', 'cô', 'chú', 'dì', 'cậu', 'bác', 'ông bà', 'cha mẹ', 'anh em', 'cháu', 'con'),
  },
  {
    key: 'truong-hoc', label: 'Trường học', emoji: '🏫', lang: 'vi',
    words: vi('bút', 'vở', 'sách', 'thước', 'bảng', 'cặp', 'phấn', 'lớp', 'tẩy', 'cô giáo', 'bàn ghế', 'bút chì', 'sân trường', 'bạn bè', 'thầy'),
  },
  {
    key: 'co-the', label: 'Cơ thể', emoji: '🙂', lang: 'vi',
    words: vi('mắt', 'mũi', 'tai', 'miệng', 'tay', 'chân', 'tóc', 'răng', 'đầu', 'lưng', 'bụng', 'má', 'cổ', 'vai', 'môi'),
  },
  {
    key: 'animals', label: 'Animals', emoji: '🦁', lang: 'en',
    words: en([['cat', 'con mèo'], ['dog', 'con chó'], ['fish', 'con cá'], ['bird', 'con chim'], ['lion', 'sư tử'], ['tiger', 'con hổ'], ['horse', 'con ngựa'], ['zebra', 'ngựa vằn'], ['monkey', 'con khỉ'], ['rabbit', 'con thỏ'], ['duck', 'con vịt'], ['frog', 'con ếch'], ['bear', 'con gấu'], ['cow', 'con bò'], ['pig', 'con lợn'], ['elephant', 'con voi']]),
  },
  {
    key: 'colours', label: 'Colours', emoji: '🌈', lang: 'en',
    words: en([['red', 'màu đỏ'], ['blue', 'xanh dương'], ['green', 'xanh lá'], ['yellow', 'màu vàng'], ['pink', 'màu hồng'], ['black', 'màu đen'], ['white', 'màu trắng'], ['brown', 'màu nâu'], ['orange', 'màu cam'], ['purple', 'màu tím'], ['grey', 'màu xám'], ['gold', 'màu vàng kim']]),
  },
  {
    key: 'numbers', label: 'Numbers', emoji: '🔢', lang: 'en',
    words: en([['one', 'số 1'], ['two', 'số 2'], ['three', 'số 3'], ['four', 'số 4'], ['five', 'số 5'], ['six', 'số 6'], ['seven', 'số 7'], ['eight', 'số 8'], ['nine', 'số 9'], ['ten', 'số 10'], ['eleven', 'số 11'], ['twelve', 'số 12'], ['twenty', 'số 20']]),
  },
];

export type WsLevel = 'de' | 'kho';

export const WS_LEVELS: { key: WsLevel; label: string; size: number; words: number; hint: string; color: string; shadow: string }[] = [
  { key: 'de', label: 'Dễ', size: 8, words: 6, hint: 'Bảng 8×8 · ngang & dọc', color: '#6BCB77', shadow: '#3f9a4b' },
  { key: 'kho', label: 'Khó', size: 10, words: 8, hint: 'Bảng 10×10 · thêm đường chéo', color: '#A06CD5', shadow: '#7442a8' },
];

/** Hướng đặt từ: [dòng, cột]. Chỉ xuôi chiều đọc cho bé (trái→phải, trên→dưới). */
export const DIRS_EASY: [number, number][] = [[0, 1], [1, 0]];
export const DIRS_HARD: [number, number][] = [[0, 1], [1, 0], [1, 1], [-1, 1]];

/** Tách chữ: "Sư tử" → ["S","Ư","T","Ử"]. */
export function cellsOf(text: string): string[] {
  return Array.from(text.normalize('NFC').toUpperCase().replace(/[\s-]+/g, ''));
}

// mulberry32 — cùng hạt giống thì cùng bảng.
export function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Placed = {
  word: WsWord;
  cells: string[];
  r: number;
  c: number;
  dr: number;
  dc: number;
};

export type WsGrid = {
  size: number;
  grid: string[][];
  placed: Placed[];
  dirs: [number, number][];
};

const EN_FILL = 'ABCDEFGHIJKLMNOPRSTUVWY';

/**
 * Sinh bảng tất định theo (chủ đề, cấp, hạt giống). Đặt từ dài trước; được chồng chữ nếu
 * trùng ký tự. Ô trống lấp bằng chữ lấy từ chính các từ của chủ đề (để chữ nhiễu trông
 * "giống thật": có dấu với tiếng Việt, A–Z với tiếng Anh).
 */
export function buildGrid(topic: WsTopic, level: WsLevel, seed: number): WsGrid {
  const cfg = WS_LEVELS.find((l) => l.key === level)!;
  const size = cfg.size;
  const dirs = level === 'kho' ? DIRS_HARD : DIRS_EASY;
  const candidates = topic.words.filter((w) => {
    const n = cellsOf(w.text).length;
    return n >= 2 && n <= size;
  });

  for (let attempt = 0; attempt < 40; attempt++) {
    const rnd = makeRng(seed * 31 + attempt);
    const chosen = shuffle(candidates, rnd).slice(0, cfg.words);
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    const placed: Placed[] = [];
    const order = [...chosen].sort((a, b) => cellsOf(b.text).length - cellsOf(a.text).length);
    let ok = true;
    for (const word of order) {
      const cells = cellsOf(word.text);
      let done = false;
      for (let tries = 0; tries < 300 && !done; tries++) {
        const [dr, dc] = dirs[Math.floor(rnd() * dirs.length)];
        const len = cells.length;
        const rMin = dr < 0 ? len - 1 : 0;
        const rMax = dr > 0 ? size - len : size - 1;
        const cMax = dc > 0 ? size - len : size - 1;
        if (rMax < rMin || cMax < 0) continue;
        const r = rMin + Math.floor(rnd() * (rMax - rMin + 1));
        const c = Math.floor(rnd() * (cMax + 1));
        let fits = true;
        for (let k = 0; k < len; k++) {
          const cur = grid[r + dr * k][c + dc * k];
          if (cur && cur !== cells[k]) { fits = false; break; }
        }
        if (!fits) continue;
        for (let k = 0; k < len; k++) grid[r + dr * k][c + dc * k] = cells[k];
        placed.push({ word, cells, r, c, dr, dc });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok) continue;

    const pool = topic.lang === 'en' ? Array.from(EN_FILL) : topic.words.flatMap((w) => cellsOf(w.text));
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = pool[Math.floor(rnd() * pool.length)];
    }
    // Giữ thứ tự danh sách theo thứ tự xáo ban đầu (không lộ từ dài nằm đâu).
    placed.sort((a, b) => chosen.indexOf(a.word) - chosen.indexOf(b.word));
    return { size, grid, placed, dirs };
  }
  throw new Error(`Không sinh được bảng cho chủ đề ${topic.key}`);
}
