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

/**
 * Nguyên âm đôi/ba viết bằng nhiều con chữ. Tiếng KHÔNG có âm đầu thì bé phải
 * đọc ngay từ con chữ đầu tiên, nên phải đánh vần cả phần này: "y – ê – yê".
 * Tiếng có âm đầu thì không cần, vì bé đã bám vào âm đầu để vào vần rồi.
 */
const AM_CHINH_GHEP = ['yê', 'iê', 'uô', 'ươ', 'ya', 'ia', 'ua', 'ưa'];

/** Phần vần KHÔNG dấu thanh, vd "bóng" → "ong". */
function vanKhongDau(tiengKhongDau: string, amDau: string): string {
  return tiengKhongDau.slice(amDau.length);
}

/** Phần vần CÓ dấu thanh, cắt thẳng từ tiếng gốc: "ngọt" → "ọt". */
function vanCoDau(tieng: string, amDau: string): string {
  return tieng.slice(amDau.length);
}

/**
 * Các bước đánh vần của một TIẾNG, theo cách đọc ở lớp 1.
 *
 * CÓ ÂM ĐẦU — âm đầu, vần, tiếng chưa dấu, tên dấu, tiếng:
 *     bờ  – ong – bong – sắc – bóng
 * Tiếng thanh ngang dừng ở bước thứ ba ("bờ – ong – bong").
 *
 * KHÔNG CÓ ÂM ĐẦU — đánh vần từ trong ra ngoài: âm chính, âm cuối, vần, dấu, tiếng.
 *     ă  – nờ  – ăn
 * Âm chính nhiều con chữ thì đọc rời từng chữ trước khi ghép:
 *     y  – ê   – yê  – nờ – yên – sắc – yến
 *     a  – o   – ao
 *     a  – o   – ao  – sắc – áo
 *
 * TIẾNG ĐÓNG (kết thúc p, t, c, ch) — DẤU NẰM SẴN Ở VẦN, và bỏ bước đọc trọn
 * tiếng chưa dấu:
 *     ngờ – ọt  – nặng – ngọt
 *     bờ  – út  – sắc  – bút
 *     ê   – chờ – ếch  – sắc – ếch
 *
 * Vì tiếng đóng chỉ mang được thanh sắc hoặc nặng, nên "ot", "ut", "ngot",
 * "but" đều là những chữ KHÔNG TỒN TẠI trong tiếng Việt. Giọng đọc gặp chữ
 * không có thật thì tự gán bừa một thanh — "ut" từng phát ra thành "bắt",
 * "ot" thành một âm khác hẳn. Đặt sẵn dấu vào vần thì mọi mẩu đều đọc được,
 * mà bước gọi tên dấu vẫn còn để bé biết đó là dấu gì.
 */
export function buocDanhVan(tieng: string): string[] {
  const t = tachTieng(tieng);
  const buoc: string[] = [];
  // Tiếng đóng mang dấu: vần phải giữ dấu, và không có dạng tiếng chưa dấu.
  const dong = laAmTietKhep(t.tiengKhongDau) && t.thanh !== 'ngang';

  if (t.amDau) {
    buoc.push(t.amDoc);
    buoc.push(dong ? vanCoDau(t.tieng, t.amDau) : vanKhongDau(t.tiengKhongDau, t.amDau));
    if (!dong) buoc.push(t.tiengKhongDau);
  } else {
    const tach = tachVanKhongAmDau(t.tiengKhongDau);
    if (tach) {
      // "yê" → đọc "y", "ê" rồi mới tới "yê".
      const ghep = AM_CHINH_GHEP.find((x) => x === tach.chinh);
      if (ghep) for (const chu of ghep) buoc.push(chu);
      buoc.push(tach.chinh);
      buoc.push(tach.cuoiDoc);
      // Không có âm đầu thì "vần" chính là cả tiếng. Với tiếng đóng, vần đã mang
      // sẵn dấu nên bước này trùng y hệt bước cuối ("ếch … ếch") — bỏ đi cho khỏi
      // đọc lặp; bước gọi tên dấu vẫn còn.
      if (!dong) buoc.push(t.tiengKhongDau);
    } else {
      // "ao", "ô", "yêu": vần không có phụ âm cuối. Vẫn đánh vần được nếu viết
      // bằng nhiều con chữ — đọc rời từng chữ rồi ghép: "a – o – ao".
      // Tiếng một con chữ ("ô", "y") thì không có gì để ghép, chỉ đọc chính nó.
      if (t.tiengKhongDau.length > 1) for (const chu of t.tiengKhongDau) buoc.push(chu);
      buoc.push(t.tiengKhongDau);
    }
  }

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
