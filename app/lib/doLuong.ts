// Đo lường: đo bằng thước, cân, và quy đổi đơn vị.
//
// Đây là mảng có nhiều câu hỏi nhất trong kho (600 câu) mà lại chưa có chỗ nào
// cho bé THAO TÁC. Mà đo lường thì học bằng tay mới vào: nhìn vạch thước, thấy
// cán cân nghiêng về bên nặng, đổi 1m ra 100cm bằng cách đếm ô.

export type MucDo = 1 | 2 | 3 | 4 | 5;

export type NhomDonVi = 'dai' | 'khoi-luong' | 'dung-tich' | 'thoi-gian';

export type DonVi = {
  ma: string;
  ten: string;
  /** Quy về đơn vị gốc của nhóm (mm, g, ml, giây). */ heSo: number;
  nhom: NhomDonVi;
};

export const DON_VI: DonVi[] = [
  { ma: 'mm', ten: 'mi-li-mét', heSo: 1, nhom: 'dai' },
  { ma: 'cm', ten: 'xăng-ti-mét', heSo: 10, nhom: 'dai' },
  { ma: 'dm', ten: 'đề-xi-mét', heSo: 100, nhom: 'dai' },
  { ma: 'm', ten: 'mét', heSo: 1000, nhom: 'dai' },
  { ma: 'km', ten: 'ki-lô-mét', heSo: 1000000, nhom: 'dai' },

  { ma: 'g', ten: 'gam', heSo: 1, nhom: 'khoi-luong' },
  { ma: 'kg', ten: 'ki-lô-gam', heSo: 1000, nhom: 'khoi-luong' },
  { ma: 'tạ', ten: 'tạ', heSo: 100000, nhom: 'khoi-luong' },
  { ma: 'tấn', ten: 'tấn', heSo: 1000000, nhom: 'khoi-luong' },

  { ma: 'ml', ten: 'mi-li-lít', heSo: 1, nhom: 'dung-tich' },
  { ma: 'l', ten: 'lít', heSo: 1000, nhom: 'dung-tich' },

  { ma: 'giây', ten: 'giây', heSo: 1, nhom: 'thoi-gian' },
  { ma: 'phút', ten: 'phút', heSo: 60, nhom: 'thoi-gian' },
  { ma: 'giờ', ten: 'giờ', heSo: 3600, nhom: 'thoi-gian' },
];

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; nhom: NhomDonVi[] }[] = [
  { lop: 1, ten: 'Lớp 1', moTa: 'Đo đoạn thẳng bằng xăng-ti-mét, so sánh nặng nhẹ', nhom: ['dai'] },
  { lop: 2, ten: 'Lớp 2', moTa: 'Thêm đề-xi-mét, ki-lô-gam và lít', nhom: ['dai', 'khoi-luong', 'dung-tich'] },
  { lop: 3, ten: 'Lớp 3', moTa: 'Mi-li-mét, gam; đổi đơn vị đơn giản', nhom: ['dai', 'khoi-luong', 'dung-tich', 'thoi-gian'] },
  { lop: 4, ten: 'Lớp 4', moTa: 'Tạ, tấn, ki-lô-mét; đổi qua nhiều bậc', nhom: ['dai', 'khoi-luong', 'dung-tich', 'thoi-gian'] },
  { lop: 5, ten: 'Lớp 5', moTa: 'Số đo có phần lẻ, đổi qua lại nhiều bậc', nhom: ['dai', 'khoi-luong', 'dung-tich', 'thoi-gian'] },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];

export const donVi = (ma: string) => DON_VI.find((d) => d.ma === ma)!;

/** Viết số gọn: bỏ số 0 thừa sau dấu phẩy, dùng dấu phẩy thập phân kiểu Việt. */
export function vietSo(n: number): string {
  const s = Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));
  return s.replace('.', ',');
}

/* ─────────── 1. ĐO BẰNG THƯỚC ─────────── */

export type BaiThuoc = {
  /** Độ dài thật của đoạn thẳng, tính bằng mi-li-mét. */ mm: number;
  /** Đơn vị bé phải trả lời. */ maDonVi: 'cm' | 'mm';
  dapAn: number;
  chon: number[];
  /** Vạch bắt đầu của đoạn thẳng trên thước — không phải lúc nào cũng từ 0. */
  batDauMm: number;
};

export function raBaiThuoc(lop: MucDo): BaiThuoc {
  // Lớp 1, 2 luôn đặt đoạn thẳng từ vạch 0; từ lớp 3 mới đặt lệch để bé phải
  // TRỪ hai vạch — đây đúng là bài hay ra trong đề và trẻ hay quên trừ.
  const lech = lop >= 3 && Math.random() < 0.5;
  const maDonVi: 'cm' | 'mm' = lop >= 3 && Math.random() < 0.35 ? 'mm' : 'cm';
  const daiCm = maDonVi === 'mm' ? nn(2, 9) : nn(2, 15);
  const mm = daiCm * 10 + (maDonVi === 'mm' && lop >= 4 ? nn(0, 9) : 0);
  const batDauMm = lech ? nn(1, 5) * 10 : 0;
  const dapAn = maDonVi === 'cm' ? mm / 10 : mm;

  const nhieu = new Set<number>();
  const them = (n: number) => { if (n > 0 && n !== dapAn) nhieu.add(n); };
  // Lỗi kinh điển: đọc luôn vạch cuối mà quên trừ vạch đầu.
  if (batDauMm) them(maDonVi === 'cm' ? (mm + batDauMm) / 10 : mm + batDauMm);
  them(dapAn + 1);
  them(dapAn - 1);
  them(maDonVi === 'cm' ? dapAn * 10 : dapAn / 10);
  for (let k = 2; nhieu.size < 3 && k < 12; k++) { them(dapAn + k); them(dapAn - k); }
  const ds = [...nhieu].filter((x) => x > 0).slice(0, 3);
  return { mm, maDonVi, dapAn, batDauMm, chon: xao([dapAn, ...ds]) };
}

/* ─────────── 2. CÂN ─────────── */

export type BaiCan = {
  /** Khối lượng vật, tính bằng gam. */ gam: number;
  /** Các quả cân bé có để đặt lên đĩa bên kia. */ quaCan: number[];
  ten: string;
  emoji: string;
};

const VAT_CAN: { ten: string; emoji: string; gam: [number, number] }[] = [
  { ten: 'quả táo', emoji: '🍎', gam: [100, 300] },
  { ten: 'quyển sách', emoji: '📕', gam: [200, 800] },
  { ten: 'túi gạo', emoji: '🌾', gam: [1000, 5000] },
  { ten: 'quả dưa hấu', emoji: '🍉', gam: [2000, 6000] },
  { ten: 'con gà', emoji: '🐔', gam: [1500, 3000] },
  { ten: 'hộp bút', emoji: '✏️', gam: [100, 400] },
];

export function raBaiCan(lop: MucDo): BaiCan {
  const v = chon(VAT_CAN.filter((x) => (lop <= 2 ? x.gam[1] <= 5000 : true)));
  const buoc = lop <= 2 ? 500 : lop === 3 ? 100 : 50;
  const gam = Math.max(buoc, Math.round(nn(v.gam[0], v.gam[1]) / buoc) * buoc);
  // Bộ quả cân đủ để cân chính xác vật này bằng cách tham lam.
  const quaCan = lop <= 2 ? [500, 1000, 2000] : [50, 100, 200, 500, 1000, 2000];
  return { gam, quaCan, ten: v.ten, emoji: v.emoji };
}

/** Cách đặt quả cân ít viên nhất cho đúng khối lượng. */
export function canBang(gam: number, quaCan: number[]): number[] {
  const ds = [...quaCan].sort((a, b) => b - a);
  const ra: number[] = [];
  let con = gam;
  for (const q of ds) while (con >= q) { ra.push(q); con -= q; }
  return con === 0 ? ra : [];
}

/* ─────────── 3. QUY ĐỔI ĐƠN VỊ ─────────── */

export type BaiQuyDoi = {
  tu: number; maTu: string; maDen: string; dapAn: number; chon: number[]; nhom: NhomDonVi;
};

function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function raBaiQuyDoi(lop: MucDo): BaiQuyDoi {
  const nhomCo = MUC_DO.find((m) => m.lop === lop)!.nhom;
  for (let lan = 0; lan < 200; lan++) {
    const nhom = chon(nhomCo);
    const ds = DON_VI.filter((d) => d.nhom === nhom);
    const a = chon(ds);
    const b = chon(ds.filter((d) => d.ma !== a.ma));
    // Lớp nhỏ chỉ đổi một bậc (m → dm), lớp lớn mới đổi nhiều bậc.
    const soBac = Math.abs(ds.indexOf(a) - ds.indexOf(b));
    if (lop <= 3 && soBac > 1) continue;
    const tu = lop <= 2 ? nn(1, 9) : nn(1, 20) * (lop >= 4 && Math.random() < 0.3 ? 5 : 1);
    const ketQua = (tu * a.heSo) / b.heSo;
    if (!Number.isInteger(ketQua) || ketQua < 1 || ketQua > 1000000) continue;

    const nhieu = new Set<number>();
    const them = (n: number) => { if (n > 0 && n !== ketQua && Number.isInteger(n)) nhieu.add(n); };
    them(ketQua * 10);        // lệch một bậc — lỗi hay gặp nhất
    them(ketQua / 10);
    them(tu * (b.heSo / a.heSo)); // đổi ngược chiều
    them(ketQua + tu);
    for (let k = 2; nhieu.size < 3 && k < 20; k++) { them(ketQua * k); them(Math.round(ketQua / k)); }
    const dsNhieu = [...nhieu].slice(0, 3);
    if (dsNhieu.length < 3) continue;
    return { tu, maTu: a.ma, maDen: b.ma, dapAn: ketQua, nhom, chon: xao([ketQua, ...dsNhieu]) };
  }
  return { tu: 1, maTu: 'm', maDen: 'dm', dapAn: 10, nhom: 'dai', chon: [10, 100, 1, 1000] };
}

/** Giải thích quy đổi theo bậc, không chỉ nêu kết quả. */
export function giaiQuyDoi(b: BaiQuyDoi): string {
  const a = donVi(b.maTu);
  const c = donVi(b.maDen);
  const lan = a.heSo / c.heSo;
  const ds = DON_VI.filter((d) => d.nhom === b.nhom).map((d) => d.ma).join(' → ');
  if (lan > 1) {
    return `1 ${a.ma} = ${vietSo(lan)} ${c.ma}, nên ${vietSo(b.tu)} ${a.ma} = ${vietSo(b.tu)} × ${vietSo(lan)} = ${vietSo(b.dapAn)} ${c.ma}. Đổi từ đơn vị LỚN sang đơn vị BÉ thì nhân. Thứ tự các đơn vị: ${ds}.`;
  }
  return `${vietSo(1 / lan)} ${a.ma} = 1 ${c.ma}, nên ${vietSo(b.tu)} ${a.ma} = ${vietSo(b.tu)} : ${vietSo(1 / lan)} = ${vietSo(b.dapAn)} ${c.ma}. Đổi từ đơn vị BÉ sang đơn vị LỚN thì chia. Thứ tự các đơn vị: ${ds}.`;
}

/**
 * Soát: 2.000 lượt mỗi lớp cho cả ba dạng. Bắt lỗi đáp án âm, đáp án nhiễu
 * trùng, quy đổi ra số lẻ, quả cân không đặt được đúng khối lượng.
 */
export function kiemDoLuong() {
  const loi: string[] = [];
  for (const { lop, nhom } of MUC_DO) {
    for (let i = 0; i < 2000; i++) {
      const t = raBaiThuoc(lop);
      if (t.dapAn <= 0) loi.push(`Lớp ${lop}: độ dài ${t.dapAn} không hợp lệ`);
      if (t.chon.length !== 4) loi.push(`Lớp ${lop}: bài thước có ${t.chon.length} đáp án`);
      if (new Set(t.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án bài thước trùng nhau`);
      if (!t.chon.includes(t.dapAn)) loi.push(`Lớp ${lop}: bài thước thiếu đáp án đúng`);
      if (t.batDauMm + t.mm > 200) loi.push(`Lớp ${lop}: đoạn thẳng dài quá thước 20cm`);
      if (lop <= 2 && t.batDauMm !== 0) loi.push(`Lớp ${lop} chưa học đặt lệch vạch 0`);

      const c = raBaiCan(lop);
      if (c.gam <= 0) loi.push(`Lớp ${lop}: khối lượng không hợp lệ`);
      if (!canBang(c.gam, c.quaCan).length) loi.push(`Lớp ${lop}: ${c.gam}g không cân được bằng bộ quả cân`);

      const q = raBaiQuyDoi(lop);
      if (!nhom.includes(q.nhom)) loi.push(`Lớp ${lop} chưa học nhóm đơn vị ${q.nhom}`);
      if (!Number.isInteger(q.dapAn) || q.dapAn <= 0) loi.push(`Lớp ${lop}: kết quả đổi ${q.dapAn} không hợp lệ`);
      if (q.chon.length !== 4 || new Set(q.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án quy đổi trùng hoặc thiếu`);
      if (!q.chon.includes(q.dapAn)) loi.push(`Lớp ${lop}: quy đổi thiếu đáp án đúng`);
      const dung = (q.tu * donVi(q.maTu).heSo) / donVi(q.maDen).heSo;
      if (dung !== q.dapAn) loi.push(`Lớp ${lop}: ${q.tu}${q.maTu} → ${q.maDen} tính sai`);
    }
  }
  return { loi: [...new Set(loi)] };
}
