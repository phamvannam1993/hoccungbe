// Cấu tạo số: hàng và lớp, phân tích số, và biểu thức chứa chữ.
//
// Hai chủ đề này có 215 câu trong kho mà chưa có chỗ nào cho bé thao tác.
// Chúng đi cùng nhau vì cùng một ý: CON SỐ ĐỨNG Ở ĐÂU THÌ ĐÁNG BAO NHIÊU.
// Chữ số 5 trong 50 302 đáng 50 000, còn chữ số 2 chỉ đáng 2 — đọc bằng chữ
// thì bé gật gù, nhưng nhìn thẻ số nằm trong bảng hàng mới thật sự hiểu.

export type MucDo = 3 | 4 | 5;

export type Hang = { ma: string; ten: string; gia: number; lop: string };

/** Thứ tự từ hàng NHỎ tới hàng LỚN — đúng chiều đọc số từ phải sang trái. */
export const HANG: Hang[] = [
  { ma: 'dv', ten: 'đơn vị', gia: 1, lop: 'Lớp đơn vị' },
  { ma: 'chuc', ten: 'chục', gia: 10, lop: 'Lớp đơn vị' },
  { ma: 'tram', ten: 'trăm', gia: 100, lop: 'Lớp đơn vị' },
  { ma: 'nghin', ten: 'nghìn', gia: 1000, lop: 'Lớp nghìn' },
  { ma: 'chuc-nghin', ten: 'chục nghìn', gia: 10000, lop: 'Lớp nghìn' },
  { ma: 'tram-nghin', ten: 'trăm nghìn', gia: 100000, lop: 'Lớp nghìn' },
  { ma: 'trieu', ten: 'triệu', gia: 1000000, lop: 'Lớp triệu' },
  { ma: 'chuc-trieu', ten: 'chục triệu', gia: 10000000, lop: 'Lớp triệu' },
  { ma: 'tram-trieu', ten: 'trăm triệu', gia: 100000000, lop: 'Lớp triệu' },
];

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; soChuSo: number }[] = [
  { lop: 3, ten: 'Lớp 3', moTa: 'Số đến 10 000 — hàng đơn vị, chục, trăm, nghìn', soChuSo: 4 },
  { lop: 4, ten: 'Lớp 4', moTa: 'Số đến 1 000 000 và biểu thức chứa chữ', soChuSo: 6 },
  { lop: 5, ten: 'Lớp 5', moTa: 'Số lớn hơn, biểu thức có hai chữ', soChuSo: 7 },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Viết số có khoảng trắng ngăn lớp, đúng cách sách giáo khoa: 50 302. */
export const vietSo = (n: number) => n.toLocaleString('vi-VN').replace(/\./g, ' ');

/* ─────────── ĐỌC SỐ THÀNH LỜI ─────────── */

const CHU = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

/** Đọc một nhóm ba chữ số. `daura` = có nhóm lớn hơn đứng trước hay không. */
function docBa(n: number, daRa: boolean): string {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const dv = n % 10;
  const ra: string[] = [];
  if (tram > 0 || daRa) ra.push(`${CHU[tram]} trăm`);
  if (chuc === 0) {
    // "linh" chỉ xuất hiện khi có hàng trăm đứng trước: 305 → ba trăm linh năm.
    if (dv > 0 && (tram > 0 || daRa)) ra.push('linh', CHU[dv]);
    else if (dv > 0) ra.push(CHU[dv]);
  } else if (chuc === 1) {
    ra.push('mười');
    if (dv === 5) ra.push('lăm');
    else if (dv > 0) ra.push(CHU[dv]);
  } else {
    ra.push(`${CHU[chuc]} mươi`);
    if (dv === 1) ra.push('mốt');          // 21 → hai mươi mốt
    else if (dv === 5) ra.push('lăm');     // 25 → hai mươi lăm
    else if (dv > 0) ra.push(CHU[dv]);
  }
  return ra.join(' ');
}

/** Đọc số tiếng Việt, tới hàng tỉ. */
export function docSo(n: number): string {
  if (n === 0) return 'không';
  const nhom: number[] = [];
  let x = n;
  while (x > 0) { nhom.push(x % 1000); x = Math.floor(x / 1000); }
  const ten = ['', 'nghìn', 'triệu', 'tỉ'];
  const phan: string[] = [];
  for (let i = nhom.length - 1; i >= 0; i--) {
    if (nhom[i] === 0) continue;
    // Nhóm đứng sau nhóm khác thì phải đọc đủ ba chữ số: 1 005 → một nghìn không trăm linh năm.
    const daRa = i < nhom.length - 1;
    phan.push(`${docBa(nhom[i], daRa)}${ten[i] ? ` ${ten[i]}` : ''}`);
  }
  return phan.join(' ').replace(/\s+/g, ' ').trim();
}

/* ─────────── 1. HỎI HÀNG ─────────── */

export type BaiHang = {
  so: number;
  /** Vị trí chữ số được hỏi, tính từ phải: 0 = hàng đơn vị. */ viTri: number;
  chuSo: number;
  hoi: 'ten-hang' | 'gia-tri';
  dapAn: string;
  chon: string[];
};

export function raBaiHang(lop: MucDo): BaiHang {
  const soChuSo = MUC_DO.find((m) => m.lop === lop)!.soChuSo;
  const n = nn(10 ** (soChuSo - 1), 10 ** soChuSo - 1);
  const cs = String(n).split('').reverse().map(Number);
  // Không hỏi chữ số 0: "giá trị của chữ số 0" là bài mẹo, không phải mục tiêu.
  const viTriCo = cs.map((c, i) => (c > 0 ? i : -1)).filter((i) => i >= 0);
  const viTri = chon(viTriCo);
  const chuSo = cs[viTri];
  const hoi: 'ten-hang' | 'gia-tri' = Math.random() < 0.5 ? 'ten-hang' : 'gia-tri';

  if (hoi === 'ten-hang') {
    const dapAn = HANG[viTri].ten;
    const nhieu = xao(HANG.filter((h) => h.ten !== dapAn).slice(0, soChuSo + 1)).slice(0, 3).map((h) => h.ten);
    return { so: n, viTri, chuSo, hoi, dapAn, chon: xao([dapAn, ...nhieu]) };
  }
  const gia = chuSo * HANG[viTri].gia;
  const nhieu = new Set<string>();
  const themGia = (x: number) => { if (x > 0 && x !== gia) nhieu.add(vietSo(x)); };
  // Lỗi kinh điển: trả lời luôn CHỮ SỐ thay vì giá trị của nó.
  themGia(chuSo);
  themGia(gia * 10);
  if (gia >= 10) themGia(gia / 10);
  themGia(HANG[viTri].gia);
  // Nới dần: chữ số 1 ở hàng đơn vị rất nghèo biến thể (giá trị 1, mà "chữ số"
  // cũng là 1), các luật trên chỉ ra được một đáp án. Bộ soát đã bắt.
  for (let k = 1; nhieu.size < 3 && k <= 9; k++) {
    themGia((chuSo + k) * HANG[viTri].gia);
    if (chuSo - k > 0) themGia((chuSo - k) * HANG[viTri].gia);
  }
  const ds = [...nhieu].slice(0, 3);
  return { so: n, viTri, chuSo, hoi, dapAn: vietSo(gia), chon: xao([vietSo(gia), ...ds]) };
}

/* ─────────── 2. PHÂN TÍCH SỐ ─────────── */

export type BaiPhanTich = { so: number; dapAn: string; chon: string[] };

/** Viết số thành tổng các hàng: 50 302 = 50 000 + 300 + 2. */
export function phanTich(n: number): string {
  const cs = String(n).split('').reverse().map(Number);
  const phan: string[] = [];
  for (let i = cs.length - 1; i >= 0; i--) {
    // Chặn tràn bảng hàng: số vượt quá hàng trăm triệu thì không dựng được
    // phép phân tích, trả về chuỗi rỗng để bên gọi bỏ qua và sinh lại.
    if (!HANG[i]) return '';
    if (cs[i] > 0) phan.push(vietSo(cs[i] * HANG[i].gia));
  }
  return phan.join(' + ');
}

export function raBaiPhanTich(lop: MucDo): BaiPhanTich {
  const soChuSo = MUC_DO.find((m) => m.lop === lop)!.soChuSo;
  const n = nn(10 ** (soChuSo - 1), 10 ** soChuSo - 1);
  const dung = phanTich(n);
  const nhieu = new Set<string>();
  // Các cách viết sai hay gặp: bỏ sót một hàng, hoặc ghi chữ số thay vì giá trị.
  nhieu.add(String(n).split('').filter((c) => c !== '0').join(' + '));
  // Giữ số nhiễu trong CÙNG SỐ CHỮ SỐ với số gốc: cộng thêm mà tràn sang hàng
  // mới thì phân tích ra chuỗi rỗng, và đáp án nhiễu cũng lộ liễu vì dài hơn hẳn.
  for (const lech of [10 ** nn(0, soChuSo - 2), -(10 ** nn(0, soChuSo - 2))]) {
    const x = n + lech;
    if (String(x).length === String(n).length && x > 0) {
      const p = phanTich(x);
      if (p) nhieu.add(p);
    }
  }
  // Nới dần: đổi từng chữ số cho tới khi đủ ba cách viết sai khác nhau.
  const cs = String(n).split('');
  for (let i = 0; i < cs.length && nhieu.size < 4; i++) {
    for (const d of ['1', '2', '9']) {
      if (nhieu.size >= 4) break;
      if (cs[i] === d) continue;
      const moi = [...cs]; moi[i] = d;
      if (moi[0] === '0') continue;
      const p = phanTich(Number(moi.join('')));
      if (p && p !== dung) nhieu.add(p);
    }
  }
  const ds = [...nhieu].filter((x) => x && x !== dung).slice(0, 3);
  return { so: n, dapAn: dung, chon: xao([dung, ...ds]) };
}

/* ─────────── 3. BIỂU THỨC CHỨA CHỮ ─────────── */

export type BaiBieuThuc = {
  /** Biểu thức viết bằng chữ, ví dụ "a + b × 2". */ bieuThuc: string;
  gia: { chu: string; gia: number }[];
  dapAn: number;
  chon: number[];
};

export function raBaiBieuThuc(lop: MucDo): BaiBieuThuc {
  const a = nn(2, lop === 4 ? 20 : 50);
  const b = nn(2, lop === 4 ? 12 : 30);
  const mau: { bt: string; tinh: () => number }[] = [
    { bt: 'a + b', tinh: () => a + b },
    { bt: 'a − b', tinh: () => a - b },
    { bt: 'a × 3', tinh: () => a * 3 },
    { bt: 'a + b × 2', tinh: () => a + b * 2 },
    { bt: '(a + b) × 2', tinh: () => (a + b) * 2 },
    { bt: 'a × b', tinh: () => a * b },
  ];
  const co = lop === 4 ? mau.slice(0, 4) : mau;
  for (let lan = 0; lan < 60; lan++) {
    const m = chon(co);
    const kq = m.tinh();
    if (kq <= 0) continue;
    const dungChuB = m.bt.includes('b');
    const gia = dungChuB ? [{ chu: 'a', gia: a }, { chu: 'b', gia: b }] : [{ chu: 'a', gia: a }];

    const nhieu = new Set<number>();
    const them = (n: number) => { if (n > 0 && n !== kq && Number.isInteger(n)) nhieu.add(n); };
    // Lỗi kinh điển: làm từ trái sang phải, quên nhân trước cộng sau.
    if (m.bt === 'a + b × 2') them((a + b) * 2);
    if (m.bt === '(a + b) × 2') them(a + b * 2);
    them(a + b); them(Math.abs(a - b)); them(a * b);
    them(kq + 1); them(kq - 1); them(kq + 10);
    const ds = [...nhieu].slice(0, 3);
    if (ds.length < 3) continue;
    return { bieuThuc: m.bt, gia, dapAn: kq, chon: xao([kq, ...ds]) };
  }
  return { bieuThuc: 'a + b', gia: [{ chu: 'a', gia: 3 }, { chu: 'b', gia: 5 }], dapAn: 8, chon: [8, 15, 2, 9] };
}

export function giaiBieuThuc(b: BaiBieuThuc): string {
  const thay = b.gia.map((g) => `${g.chu} = ${g.gia}`).join(', ');
  const co = b.bieuThuc.includes('×') && b.bieuThuc.includes('+') && !b.bieuThuc.startsWith('(')
    ? ' Nhớ thứ tự: NHÂN CHIA trước, CỘNG TRỪ sau. Có ngoặc thì làm trong ngoặc trước.'
    : '';
  return `Thay ${thay} vào ${b.bieuThuc} rồi tính, được ${b.dapAn}.${co}`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi phân tích cộng lại không ra số gốc, giá
 * trị hàng tính sai, biểu thức ra số âm, và đọc số sai quy tắc.
 */
export function kiemCauTaoSo() {
  const loi: string[] = [];

  // Đọc số: kiểm bằng các mốc đã biết chắc, vì đây là chỗ dễ sai nhất.
  const mau: [number, string][] = [
    [5, 'năm'], [10, 'mười'], [15, 'mười lăm'], [21, 'hai mươi mốt'], [25, 'hai mươi lăm'],
    [100, 'một trăm'], [105, 'một trăm linh năm'], [110, 'một trăm mười'],
    [1000, 'một nghìn'], [1005, 'một nghìn không trăm linh năm'],
    [50302, 'năm mươi nghìn ba trăm linh hai'],
    [1000000, 'một triệu'], [2050, 'hai nghìn không trăm năm mươi'],
  ];
  for (const [n, doc] of mau) {
    if (docSo(n) !== doc) loi.push(`Đọc số ${n} ra "${docSo(n)}", đúng phải là "${doc}"`);
  }

  for (const { lop, soChuSo } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const h = raBaiHang(lop);
      if (String(h.so).length !== soChuSo) loi.push(`Lớp ${lop}: số ${h.so} không đủ ${soChuSo} chữ số`);
      if (h.chuSo === 0) loi.push(`Lớp ${lop}: hỏi chữ số 0`);
      if (h.chon.length !== 4 || new Set(h.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án hàng trùng hoặc thiếu`);
      if (!h.chon.includes(h.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng (hàng)`);
      if (h.hoi === 'gia-tri' && h.dapAn !== vietSo(h.chuSo * HANG[h.viTri].gia)) loi.push(`Lớp ${lop}: giá trị hàng tính sai`);

      const p = raBaiPhanTich(lop);
      const tong = p.dapAn.split(' + ').reduce((s, x) => s + Number(x.replace(/\s/g, '')), 0);
      if (tong !== p.so) loi.push(`Lớp ${lop}: phân tích ${p.so} cộng lại ra ${tong}`);
      if (p.chon.length !== 4 || new Set(p.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án phân tích trùng hoặc thiếu`);
      if (!p.chon.includes(p.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng (phân tích)`);

      if (lop >= 4) {
        const b = raBaiBieuThuc(lop);
        if (b.dapAn <= 0) loi.push(`Lớp ${lop}: biểu thức ra ${b.dapAn}`);
        if (b.chon.length !== 4 || new Set(b.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án biểu thức trùng hoặc thiếu`);
        if (!b.chon.includes(b.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng (biểu thức)`);
        if (b.bieuThuc.includes('b') && b.gia.length !== 2) loi.push(`Lớp ${lop}: biểu thức có chữ b nhưng không cho giá trị b`);
      }
    }
  }
  return { loi: [...new Set(loi)] };
}
