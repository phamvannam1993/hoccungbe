// Tách một TIẾNG tiếng Việt thành âm đầu – vần – thanh, để sinh ra các bước
// đánh vần theo đúng cách dạy lớp 1: "bờ – ong – bong – sắc – bóng".
//
// Vì sao tách bằng máy thay vì viết tay: mỗi âm cần khoảng 10 từ, tổng gần 300
// tiếng. Gõ tay từng bước đánh vần vừa lâu vừa dễ sai lệch giữa các mục, mà sai
// ở đây là dạy sai. Tách bằng luật thì một chỗ đúng là tất cả cùng đúng, và
// kiểm lại được bằng test.

/** Âm đầu, xếp DÀI TRƯỚC để "ngh" không bị cắt nhầm thành "ng" rồi "h". */
const AM_DAU = [
  'ngh', 'ngh',
  'ch', 'gh', 'gi', 'kh', 'ng', 'nh', 'ph', 'qu', 'th', 'tr',
  'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x',
];

/** Cách ĐỌC âm đầu khi đánh vần (khác tên chữ: "b" đọc là "bờ", không phải "bê"). */
export const AM_DOC: Record<string, string> = {
  // c, k, q cùng ghi âm /k/. Khi ĐÁNH VẦN đều đọc là "cờ"; "ca"/"quy" chỉ là
  // TÊN chữ dùng khi đọc bảng chữ cái, không dùng trong bước đánh vần.
  b: 'bờ', c: 'cờ', d: 'dờ', 'đ': 'đờ', g: 'gờ', h: 'hờ', k: 'cờ', l: 'lờ',
  m: 'mờ', n: 'nờ', p: 'pờ', r: 'rờ', s: 'sờ', t: 'tờ', v: 'vờ', x: 'xờ',
  ch: 'chờ', gh: 'gờ', gi: 'giờ', kh: 'khờ', ng: 'ngờ', ngh: 'ngờ',
  nh: 'nhờ', ph: 'phờ', qu: 'quờ', th: 'thờ', tr: 'trờ',
};

/** Dấu thanh: ký tự tổ hợp Unicode → tên gọi. */
const THANH_MARK: Record<string, string> = {
  '̀': 'huyền',
  '́': 'sắc',
  '̃': 'ngã',
  '̉': 'hỏi',
  '̣': 'nặng',
};

/** Bỏ dấu thanh, giữ nguyên các chữ có dấu phụ (ă, â, ê, ô, ơ, ư, đ). */
export function boThanh(tieng: string): { base: string; thanh: string } {
  const nfd = tieng.normalize('NFD');
  let thanh = '';
  const base = nfd
    .split('')
    .filter((c) => {
      if (THANH_MARK[c]) { thanh = THANH_MARK[c]; return false; }
      return true;
    })
    .join('')
    .normalize('NFC');
  return { base, thanh: thanh || 'ngang' };
}

export type TachTieng = {
  tieng: string;
  /** Âm đầu dạng chữ viết, vd "ph". Rỗng nếu tiếng không có âm đầu ("ăn", "ong"). */
  amDau: string;
  /** Cách đọc âm đầu, vd "phờ". */
  amDoc: string;
  /** Phần vần, vd "ong". */
  van: string;
  /** Tiếng khi chưa có dấu, vd "bong". */
  tiengKhongDau: string;
  /** Tên dấu thanh: ngang | huyền | sắc | hỏi | ngã | nặng. */
  thanh: string;
};

/** Tách một tiếng (một âm tiết, không khoảng trắng). */
export function tachTieng(tieng: string): TachTieng {
  const raw = tieng.trim().toLowerCase();
  const { base, thanh } = boThanh(raw);

  // "gi" và "qu" là âm đầu, nhưng "gì" chỉ còn "gi" thì phần vần rỗng — khi đó
  // phải coi "g" là âm đầu và "i" là vần, nếu không bước đánh vần sẽ trống.
  let amDau = AM_DAU.find((a) => base.startsWith(a)) ?? '';
  if (amDau && base.length === amDau.length && amDau.length > 1) {
    amDau = amDau.slice(0, amDau.length - 1);
  }

  return {
    tieng: raw,
    amDau,
    amDoc: AM_DOC[amDau] ?? amDau,
    van: base.slice(amDau.length),
    tiengKhongDau: base,
    thanh,
  };
}

/**
 * Âm tiết KHÉP: kết thúc bằng p, t, c, ch.
 * Những tiếng này chỉ mang được thanh SẮC hoặc NẶNG — dùng để KIỂM TRA dữ liệu
 * (xem `scripts/kiem-danh-van.ts`), không dùng để đổi cách đánh vần.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function laAmTietKhep(tiengKhongDau: string): boolean {
  return /(p|t|c|ch)$/.test(tiengKhongDau);
}

/**
 * Âm CUỐI của vần và cách đọc nó. Chỉ dùng cho tiếng KHÔNG có âm đầu.
 * Xếp dài trước để "ch"/"ng"/"nh" không bị cắt nhầm thành một chữ.
 */
const AM_CUOI: [string, string][] = [
  ['ngh', 'ngờ'], ['ng', 'ngờ'], ['nh', 'nhờ'], ['ch', 'chờ'],
  ['m', 'mờ'], ['n', 'nờ'], ['p', 'pờ'], ['t', 'tờ'], ['c', 'cờ'],
];

/**
 * Tiếng không có âm đầu ("ăn", "ong", "ốc") thì đánh vần theo ÂM CHÍNH + ÂM CUỐI:
 * "ă – nờ – ăn". Nếu chỉ đọc trọn tiếng một bước thì bé không thấy tiếng được
 * ghép từ đâu — mà đó chính là điều đang dạy.
 * Trả về null khi vần không kết thúc bằng phụ âm ("ao", "ô", "yêu") — lúc đó
 * tách ra chỉ thành đọc lặp, không giúp gì.
 */
function tachVanKhongAmDau(vanKhongDau: string): { chinh: string; cuoiDoc: string } | null {
  for (const [cuoi, doc] of AM_CUOI) {
    if (vanKhongDau.endsWith(cuoi) && vanKhongDau.length > cuoi.length) {
      return { chinh: vanKhongDau.slice(0, -cuoi.length), cuoiDoc: doc };
    }
  }
  return null;
}

/** Phần vần KHÔNG dấu thanh, vd "bắp" → "ăp". */
function vanKhongDau(tiengKhongDau: string, amDau: string): string {
  return tiengKhongDau.slice(amDau.length);
}

/**
 * Các bước đánh vần của một TIẾNG, theo cách đọc ở lớp 1:
 *
 *     âm đầu – vần – tiếng chưa dấu – tên dấu – tiếng
 *     bờ  –  ong –  bong –  sắc  –  bóng
 *
 * Tiếng thanh ngang dừng ở bước thứ ba ("bờ – ong – bong").
 * Tiếng không có âm đầu thì hai bước đầu là ÂM CHÍNH + ÂM CUỐI ("ă – nờ – ăn").
 *
 * RIÊNG TIẾNG ĐÓNG (kết thúc p, t, c, ch) BỎ BƯỚC "tiếng chưa dấu":
 *
 *     bờ  –  ut  –  sắc  –  bút        (B + UT + SẮC = BÚT)
 *     cờ  –  ôt  –  nặng –  cột
 *     ô   –  cờ  –  sắc  –  ốc
 *
 * Vì tiếng đóng chỉ mang được thanh sắc hoặc nặng, nên "but", "côt", "băp" là
 * những tiếng KHÔNG TỒN TẠI. Đã thử cả hai cách khác và bỏ cả hai:
 *   • đọc đúng chữ chưa dấu → giọng đọc tự gán thanh, "but" phát ra thành "bắt";
 *   • đọc thay bằng dạng có dấu ("côt" phát ra "cột") → bé nghe trọn tiếng
 *     trước khi gọi tên dấu, mất luôn cái đang được dạy.
 * Bỏ hẳn bước đó thì mọi mẩu phát ra đều đọc được: phần vần trần ("ut", "ôt")
 * là VẦN chứ không phải tiếng, nên không vướng luật thanh — và đây vốn là thứ
 * vẫn được đọc rời khi ghép vần.
 *
 * KHÔNG tách "chữ để nhìn" khỏi "chữ để đọc": đã làm và đã gỡ, vì nghe một đằng
 * nhìn một nẻo còn khó hiểu hơn.
 */
export function buocDanhVan(tieng: string): string[] {
  const t = tachTieng(tieng);
  const buoc: string[] = [];
  const dong = laAmTietKhep(t.tiengKhongDau) && t.thanh !== 'ngang';

  if (t.amDau) {
    buoc.push(t.amDoc);
    buoc.push(vanKhongDau(t.tiengKhongDau, t.amDau));
  } else {
    // "ăn", "ong", "ốc": không có âm đầu thì ghép âm chính với âm cuối.
    const tach = tachVanKhongAmDau(t.tiengKhongDau);
    if (tach) { buoc.push(tach.chinh); buoc.push(tach.cuoiDoc); }
  }

  // Bước đọc trọn tiếng chưa dấu. Bỏ khi tiếng đóng (dạng đó không tồn tại), và
  // khi trùng y nguyên bước ngay trước ("ao", "ô", "yêu" — vần không phụ âm cuối).
  if (!dong && buoc[buoc.length - 1] !== t.tiengKhongDau) buoc.push(t.tiengKhongDau);

  if (t.thanh !== 'ngang') { buoc.push(t.thanh); buoc.push(t.tieng); }
  return buoc;
}

/** Chuỗi hiển thị: "bờ - ong - bong - sắc - bóng". */
export function chuoiDanhVan(tieng: string): string {
  return buocDanhVan(tieng).join(' - ');
}

/** Đánh vần một TỪ nhiều tiếng: trả về từng tiếng kèm các bước của nó. */
export function danhVanTu(tu: string): { tieng: string; buoc: string[] }[] {
  return tu
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ({ tieng: t, buoc: buocDanhVan(t) }));
}
