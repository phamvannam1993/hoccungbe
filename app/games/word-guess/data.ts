// Dữ liệu "Nhìn hình đoán chữ".
//
// CHỈ dùng ảnh đã có sẵn trong public/ — mỗi đường dẫn dưới đây đã được kiểm tra
// tồn tại VÀ đã mở ra nhìn để chắc hình đúng là vật đó (không lấy tranh cảnh, ảnh
// nhiều vật hay hình dễ gây hiểu nhầm). Thêm từ mới thì làm y như vậy.
//
// Mỗi ô chữ là MỘT chữ cái tiếng Việt kèm dấu (NFC): "MÈO" → M · È · O. Đáp án tối đa
// 2 tiếng để vừa sức bé 6–9 tuổi; ranh giới tiếng được hiển thị bằng khoảng cách ô.

export type WordGuessLevel = 'de' | 'vua' | 'kho';

export type WordGuessItem = {
  /** Đáp án viết thường, các tiếng cách nhau bởi dấu cách. */
  word: string;
  image: string;
  topic: 'Con vật' | 'Trái cây & rau củ' | 'Đồ vật' | 'Thiên nhiên';
};

const T1 = '/thi-lop-1';
const TV = '/thi-lop-1/tv';
const IC = '/assets/icons';

export const WORD_GUESS_ITEMS: WordGuessItem[] = [
  // ── Con vật ──
  { word: 'mèo', image: `${IC}/meo_con.jpg`, topic: 'Con vật' },
  { word: 'cáo', image: `${IC}/cao_nho.jpg`, topic: 'Con vật' },
  { word: 'chó', image: `${T1}/ct2-cho.webp`, topic: 'Con vật' },
  { word: 'gấu trúc', image: `${IC}/gau_truc.jpg`, topic: 'Con vật' },
  { word: 'khủng long', image: `${IC}/khung_long.jpg`, topic: 'Con vật' },
  { word: 'rồng', image: `${IC}/rong_nho.jpg`, topic: 'Con vật' },
  { word: 'sư tử', image: `${IC}/su_tu_con.jpg`, topic: 'Con vật' },
  { word: 'thỏ', image: `${IC}/tho_trang.jpg`, topic: 'Con vật' },
  { word: 'cánh cụt', image: `${IC}/chim_canh_cut.jpg`, topic: 'Con vật' },
  { word: 'cua', image: `${T1}/tv-cua.webp`, topic: 'Con vật' },
  { word: 'gà', image: `${T1}/tv-gamai.webp`, topic: 'Con vật' },
  { word: 'vịt', image: `${TV}/d11-vit.webp`, topic: 'Con vật' },
  { word: 'bò', image: `${TV}/d13-bo.webp`, topic: 'Con vật' },
  { word: 'cá', image: `${TV}/d13-ca.webp`, topic: 'Con vật' },
  { word: 'ếch', image: `${TV}/d13-ech.webp`, topic: 'Con vật' },
  { word: 'khỉ', image: `${TV}/d13-khi.webp`, topic: 'Con vật' },
  { word: 'lợn', image: `${TV}/tv5-lon.webp`, topic: 'Con vật' },
  { word: 'voi', image: `${TV}/d17-voi.webp`, topic: 'Con vật' },
  { word: 'ong', image: `${TV}/d18-ong.webp`, topic: 'Con vật' },
  { word: 'hươu', image: `${TV}/d20-huou.webp`, topic: 'Con vật' },
  { word: 'ngựa vằn', image: `${TV}/d20-nguavan.webp`, topic: 'Con vật' },
  { word: 'tôm', image: `${TV}/d22-tom.webp`, topic: 'Con vật' },
  { word: 'ngựa', image: `${TV}/tv10-bom.webp`, topic: 'Con vật' },
  { word: 'đom đóm', image: `${TV}/tv10-dom.webp`, topic: 'Con vật' },
  { word: 'chim sẻ', image: `${TV}/tv4-chimse.webp`, topic: 'Con vật' },
  { word: 'chuột', image: `${TV}/tv5-chuot.webp`, topic: 'Con vật' },
  { word: 'lươn', image: `${TV}/d12-luon.webp`, topic: 'Con vật' },

  // ── Trái cây & rau củ ──
  { word: 'na', image: `${TV}/d15-na.webp`, topic: 'Trái cây & rau củ' },
  { word: 'chuối', image: `${T1}/i-chuoi.webp`, topic: 'Trái cây & rau củ' },
  { word: 'dâu', image: `${T1}/i-dau.webp`, topic: 'Trái cây & rau củ' },
  { word: 'lê', image: `${TV}/d12-le.webp`, topic: 'Trái cây & rau củ' },
  { word: 'cà tím', image: `${T1}/i-catim.webp`, topic: 'Trái cây & rau củ' },
  { word: 'cà chua', image: `${TV}/d11-cachua.webp`, topic: 'Trái cây & rau củ' },
  { word: 'chôm chôm', image: `${TV}/d14-chomchom.webp`, topic: 'Trái cây & rau củ' },
  { word: 'thanh long', image: `${TV}/d22-thanhlong.webp`, topic: 'Trái cây & rau củ' },
  { word: 'cam', image: `${TV}/tv2-cam.webp`, topic: 'Trái cây & rau củ' },
  { word: 'mít', image: `${TV}/tv8-mit.webp`, topic: 'Trái cây & rau củ' },
  { word: 'ngô', image: `${TV}/d19-ngo.webp`, topic: 'Trái cây & rau củ' },
  { word: 'bí', image: `${T1}/ct2-bi.webp`, topic: 'Trái cây & rau củ' },
  { word: 'ớt', image: `${TV}/tv5-ot.webp`, topic: 'Trái cây & rau củ' },
  { word: 'nấm', image: `${T1}/tv-nam.webp`, topic: 'Trái cây & rau củ' },
  { word: 'su su', image: `${T1}/ct1-susu.webp`, topic: 'Trái cây & rau củ' },
  { word: 'mướp', image: `${TV}/tv9-muop.webp`, topic: 'Trái cây & rau củ' },

  // ── Đồ vật ──
  { word: 'bát', image: `${T1}/tv-bat.webp`, topic: 'Đồ vật' },
  { word: 'ghế', image: `${T1}/tv-ghe.webp`, topic: 'Đồ vật' },
  { word: 'lều', image: `${T1}/tv-leu.webp`, topic: 'Đồ vật' },
  { word: 'bàn', image: `${TV}/d11-ban.webp`, topic: 'Đồ vật' },
  { word: 'búp bê', image: `${TV}/d12-bupbe.webp`, topic: 'Đồ vật' },
  { word: 'xúc xắc', image: `${TV}/d14-xucxac.webp`, topic: 'Đồ vật' },
  { word: 'cờ', image: `${TV}/d15-co.webp`, topic: 'Đồ vật' },
  { word: 'cốc', image: `${TV}/d18-coc.webp`, topic: 'Đồ vật' },
  { word: 'đồng hồ', image: `${TV}/d20-dongho.webp`, topic: 'Đồ vật' },
  { word: 'quần', image: `${TV}/d20-quan.webp`, topic: 'Đồ vật' },
  { word: 'lọ hoa', image: `${TV}/d22-lohoa.webp`, topic: 'Đồ vật' },
  { word: 'bóng', image: `${TV}/tv1-bong.webp`, topic: 'Đồ vật' },
  { word: 'hộp bút', image: `${TV}/tv1-hopbut.webp`, topic: 'Đồ vật' },
  { word: 'khăn', image: `${TV}/tv1-khan.webp`, topic: 'Đồ vật' },
  { word: 'lược', image: `${TV}/tv1-luoc.webp`, topic: 'Đồ vật' },
  { word: 'bút chì', image: `${TV}/tv5-but.webp`, topic: 'Đồ vật' },
  { word: 'len', image: `${TV}/tv5-len.webp`, topic: 'Đồ vật' },
  { word: 'xô', image: `${T1}/ct1-xo.webp`, topic: 'Đồ vật' },
  { word: 'cưa', image: `${T1}/ct2-cua.webp`, topic: 'Đồ vật' },
  { word: 'tủ', image: `${T1}/ct1-tu.webp`, topic: 'Đồ vật' },
  { word: 'thư', image: `${T1}/ct1-thu.webp`, topic: 'Đồ vật' },

  // ── Thiên nhiên ──
  { word: 'mặt trời', image: `${TV}/d19-mattroi.webp`, topic: 'Thiên nhiên' },
  { word: 'lửa', image: `${T1}/ct2-lua1.webp`, topic: 'Thiên nhiên' },
  { word: 'lúa', image: `${T1}/ct2-lua2.webp`, topic: 'Thiên nhiên' },
  { word: 'hoa sen', image: `${TV}/d15-sen.webp`, topic: 'Thiên nhiên' },
  { word: 'hoa hồng', image: `${TV}/tv3-hong.webp`, topic: 'Thiên nhiên' },
  { word: 'hoa', image: `${T1}/i-hoa.webp`, topic: 'Thiên nhiên' },
  { word: 'tia chớp', image: `${TV}/tv10-chop.webp`, topic: 'Thiên nhiên' },
];

/** Tách một tiếng thành các chữ cái (đã NFC nên "È" là một ký tự). */
export function lettersOf(syllable: string): string[] {
  return Array.from(syllable.normalize('NFC').toUpperCase());
}

/** "cà chua" → [["C","À"],["C","H","U","A"]]. */
export function syllablesOf(word: string): string[][] {
  return word.trim().split(/\s+/).map(lettersOf);
}

export function letterCount(word: string): number {
  return syllablesOf(word).reduce((n, s) => n + s.length, 0);
}

/** Phân cấp theo độ dài: Dễ = 1 tiếng ≤ 3 chữ; Khó = 2 tiếng ≥ 6 chữ; còn lại là Vừa. */
export function levelOf(word: string): WordGuessLevel {
  const syl = syllablesOf(word).length;
  const n = letterCount(word);
  if (syl === 1 && n <= 3) return 'de';
  if (syl >= 2 && n >= 6) return 'kho';
  return 'vua';
}

export const LEVELS: { key: WordGuessLevel; label: string; hint: string; decoys: number; color: string; shadow: string }[] = [
  { key: 'de', label: 'Dễ', hint: 'Từ 1 tiếng, 2–3 chữ cái', decoys: 3, color: '#6BCB77', shadow: '#3f9a4b' },
  { key: 'vua', label: 'Vừa', hint: 'Từ 4–5 chữ cái', decoys: 4, color: '#FF9F45', shadow: '#c46f1f' },
  { key: 'kho', label: 'Khó', hint: 'Từ 2 tiếng dài', decoys: 5, color: '#A06CD5', shadow: '#7442a8' },
];

export const WORDS_PER_ROUND = 10;

// ── RNG có hạt giống (mulberry32) để xáo trộn ổn định trong một lượt ──
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

export function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Họ chữ cùng gốc nhưng khác dấu — dùng làm chữ nhiễu "gần giống" cho công bằng mà vẫn cần nhìn kỹ. */
const FAMILIES = ['AÀÁẢÃẠ', 'ĂẰẮẲẴẶ', 'ÂẦẤẨẪẬ', 'EÈÉẺẼẸ', 'ÊỀẾỂỄỆ', 'IÌÍỈĨỊ', 'OÒÓỎÕỌ', 'ÔỒỐỔỖỘ', 'ƠỜỚỞỠỢ', 'UÙÚỦŨỤ', 'ƯỪỨỬỮỰ', 'YỲÝỶỸỴ'];
const COMMON = ['A', 'B', 'C', 'D', 'Đ', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y', 'Â', 'Ă', 'Ê'];

export function decoyLetters(answer: string[], count: number, rnd: () => number): string[] {
  const out: string[] = [];
  // 1 chữ nhiễu cùng họ dấu với một nguyên âm trong đáp án (vd È → É) — dạy bé để ý dấu thanh.
  const vowels = answer.filter((c) => FAMILIES.some((f) => f.includes(c)));
  if (vowels.length) {
    const v = vowels[Math.floor(rnd() * vowels.length)];
    const fam = FAMILIES.find((f) => f.includes(v))!;
    const options = Array.from(fam).filter((c) => !answer.includes(c));
    out.push(options[Math.floor(rnd() * options.length)]);
  }
  let guard = 0;
  while (out.length < count && guard++ < 200) {
    const c = COMMON[Math.floor(rnd() * COMMON.length)];
    if (!answer.includes(c) && !out.includes(c)) out.push(c);
  }
  return out;
}

export type WordGuessQuestion = {
  item: WordGuessItem;
  syllables: string[][];
  /** Ô chữ đã xáo (đáp án + chữ nhiễu), mỗi ô có id riêng vì chữ có thể lặp (CHÔM CHÔM). */
  tiles: { id: number; ch: string }[];
};

export function buildRound(level: WordGuessLevel, seed: number): WordGuessQuestion[] {
  const rnd = makeRng(seed);
  const pool = WORD_GUESS_ITEMS.filter((w) => levelOf(w.word) === level);
  const picked = shuffle(pool, rnd).slice(0, WORDS_PER_ROUND);
  const decoys = LEVELS.find((l) => l.key === level)!.decoys;
  return picked.map((item) => {
    const syllables = syllablesOf(item.word);
    const flat = syllables.flat();
    const all = [...flat, ...decoyLetters(flat, decoys, rnd)];
    const tiles = shuffle(all, rnd).map((ch, id) => ({ id, ch }));
    return { item, syllables, tiles };
  });
}
