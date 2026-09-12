// Chu vi và diện tích.
//
// Hai thứ này trẻ học thuộc công thức rất nhanh mà vẫn lẫn, vì không thấy được
// chúng đo cái gì: chu vi là ĐI QUANH MÉP, diện tích là PHỦ KÍN BÊN TRONG.
// Nên công cụ cho bé KÉO CẠNH hình trên lưới ô vuông và nhìn hai số đổi theo
// — kéo dài ra thì cả hai cùng tăng, nhưng cùng một chu vi lại có nhiều diện
// tích khác nhau, đó mới là chỗ vỡ lẽ.

export type MucDo = 3 | 4 | 5;

export type LoaiHinh = 'chu-nhat' | 'vuong' | 'tam-giac' | 'binh-hanh' | 'thang';

export const TEN_HINH: Record<LoaiHinh, string> = {
  'chu-nhat': 'hình chữ nhật',
  'vuong': 'hình vuông',
  'tam-giac': 'hình tam giác',
  'binh-hanh': 'hình bình hành',
  'thang': 'hình thang',
};

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; hinh: LoaiHinh[] }[] = [
  { lop: 3, ten: 'Lớp 3', moTa: 'Chu vi và diện tích hình chữ nhật, hình vuông', hinh: ['chu-nhat', 'vuong'] },
  { lop: 4, ten: 'Lớp 4', moTa: 'Thêm hình bình hành và hình thoi', hinh: ['chu-nhat', 'vuong', 'binh-hanh'] },
  { lop: 5, ten: 'Lớp 5', moTa: 'Thêm tam giác và hình thang', hinh: ['chu-nhat', 'vuong', 'tam-giac', 'binh-hanh', 'thang'] },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Kích thước một hình: tuỳ loại mà dùng những trường nào. */
export type KichThuoc = { dai: number; rong: number; day2?: number };

export const chuVi = (loai: LoaiHinh, k: KichThuoc): number | null => {
  if (loai === 'chu-nhat') return (k.dai + k.rong) * 2;
  if (loai === 'vuong') return k.dai * 4;
  // Chu vi tam giác, bình hành, hình thang cần độ dài cạnh xiên — không suy ra
  // được từ đáy và chiều cao, nên phần này chỉ hỏi diện tích.
  return null;
};

export const dienTich = (loai: LoaiHinh, k: KichThuoc): number => {
  if (loai === 'vuong') return k.dai * k.dai;
  if (loai === 'chu-nhat' || loai === 'binh-hanh') return k.dai * k.rong;
  if (loai === 'tam-giac') return (k.dai * k.rong) / 2;
  return ((k.dai + (k.day2 ?? k.dai)) * k.rong) / 2;   // hình thang
};

export const congThuc: Record<LoaiHinh, { dt: string; cv?: string }> = {
  'chu-nhat': { dt: 'dài × rộng', cv: '(dài + rộng) × 2' },
  'vuong': { dt: 'cạnh × cạnh', cv: 'cạnh × 4' },
  'tam-giac': { dt: 'đáy × chiều cao : 2' },
  'binh-hanh': { dt: 'đáy × chiều cao' },
  'thang': { dt: '(đáy lớn + đáy bé) × chiều cao : 2' },
};

export type BaiTinh = {
  loai: LoaiHinh;
  kt: KichThuoc;
  hoi: 'chu-vi' | 'dien-tich';
  dapAn: number;
  chon: number[];
};

export function raBaiTinh(lop: MucDo): BaiTinh {
  const dsHinh = MUC_DO.find((m) => m.lop === lop)!.hinh;
  for (let lan = 0; lan < 200; lan++) {
    const loai = chon(dsHinh);
    const dai = nn(3, lop === 3 ? 12 : 20);
    const rong = loai === 'vuong' ? dai : nn(2, Math.max(2, dai - 1));
    const day2 = loai === 'thang' ? nn(2, dai - 1) : undefined;
    const kt: KichThuoc = { dai, rong, day2 };
    const cv = chuVi(loai, kt);
    const hoi: 'chu-vi' | 'dien-tich' = cv !== null && Math.random() < 0.5 ? 'chu-vi' : 'dien-tich';
    const dapAn = hoi === 'chu-vi' ? cv! : dienTich(loai, kt);
    if (!Number.isInteger(dapAn) || dapAn <= 0) continue;

    const nhieu = new Set<number>();
    const them = (n: number) => { if (n > 0 && n !== dapAn && Number.isInteger(n)) nhieu.add(n); };
    // Lỗi hay gặp: lẫn hai công thức với nhau.
    if (hoi === 'chu-vi') them(dienTich(loai, kt));
    else if (cv !== null) them(cv);
    // Quên nhân 2 / quên chia 2 — lỗi kinh điển của chu vi và tam giác.
    them(dapAn * 2);
    them(dapAn / 2);
    // Cộng thay vì nhân.
    them(dai + rong);
    them(dai * 2);
    for (let k = 2; nhieu.size < 3 && k < 12; k++) { them(dapAn + k); them(dapAn - k); }
    const ds = [...nhieu].slice(0, 3);
    if (ds.length < 3) continue;
    return { loai, kt, hoi, dapAn, chon: xao([dapAn, ...ds]) };
  }
  const kt = { dai: 5, rong: 3 };
  return { loai: 'chu-nhat', kt, hoi: 'dien-tich', dapAn: 15, chon: [15, 16, 8, 30] };
}

/** Bài kéo: bé kéo cạnh hình chữ nhật cho đạt đúng yêu cầu. */
export type BaiKeo = {
  /** Yêu cầu theo chu vi hay diện tích. */ theo: 'chu-vi' | 'dien-tich';
  muc: number;
  /** Kích thước tối đa của lưới. */ toiDa: number;
};

export function raBaiKeo(lop: MucDo): BaiKeo {
  const toiDa = lop === 3 ? 10 : 12;
  const theo: 'chu-vi' | 'dien-tich' = Math.random() < 0.5 ? 'chu-vi' : 'dien-tich';
  for (let lan = 0; lan < 100; lan++) {
    const d = nn(2, toiDa);
    const r = nn(2, toiDa);
    const muc = theo === 'chu-vi' ? (d + r) * 2 : d * r;
    // Chỉ nhận mức mà bé dựng được bằng hình chữ nhật trong lưới.
    if (muc >= 6 && muc <= (theo === 'chu-vi' ? toiDa * 4 : toiDa * toiDa)) {
      return { theo, muc, toiDa };
    }
  }
  return { theo: 'dien-tich', muc: 12, toiDa };
}

/** Có dựng được hình chữ nhật đúng yêu cầu trong lưới không. */
export function coCach(b: BaiKeo): boolean {
  for (let d = 1; d <= b.toiDa; d++) {
    for (let r = 1; r <= b.toiDa; r++) {
      if ((b.theo === 'chu-vi' ? (d + r) * 2 : d * r) === b.muc) return true;
    }
  }
  return false;
}

/** Giải thích bám vào ý nghĩa, không chỉ thay số vào công thức. */
export function giaiThich(b: BaiTinh): string {
  const { loai, kt, hoi, dapAn } = b;
  const ten = TEN_HINH[loai];
  if (hoi === 'chu-vi') {
    const ct = congThuc[loai].cv!;
    const so = loai === 'vuong' ? `${kt.dai} × 4` : `(${kt.dai} + ${kt.rong}) × 2`;
    return `Chu vi là ĐỘ DÀI ĐI QUANH MÉP ${ten}: ${ct} = ${so} = ${dapAn} cm. Đi hết một vòng nên phải tính cả bốn cạnh.`;
  }
  const ct = congThuc[loai].dt;
  let so = `${kt.dai} × ${kt.rong}`;
  if (loai === 'vuong') so = `${kt.dai} × ${kt.dai}`;
  if (loai === 'tam-giac') so = `${kt.dai} × ${kt.rong} : 2`;
  if (loai === 'thang') so = `(${kt.dai} + ${kt.day2}) × ${kt.rong} : 2`;
  const them = loai === 'tam-giac'
    ? ' Nhớ CHIA 2: tam giác chỉ bằng một nửa hình chữ nhật cùng đáy và cùng chiều cao.'
    : loai === 'thang'
      ? ' Chia 2 vì hai hình thang ghép lại thành một hình bình hành.'
      : ' Diện tích là số ô vuông PHỦ KÍN bên trong hình.';
  return `Diện tích ${ten}: ${ct} = ${so} = ${dapAn} cm².${them}`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi hình chưa học, đáp án không nguyên, hỏi
 * chu vi của hình chưa đủ dữ kiện, và bài kéo không có cách dựng.
 */
export function kiemChuViDienTich() {
  const loi: string[] = [];
  for (const { lop, hinh } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const b = raBaiTinh(lop);
      if (!hinh.includes(b.loai)) loi.push(`Lớp ${lop}: ra ${TEN_HINH[b.loai]} chưa học`);
      if (!Number.isInteger(b.dapAn) || b.dapAn <= 0) loi.push(`Lớp ${lop}: đáp án ${b.dapAn} không hợp lệ`);
      if (b.chon.length !== 4 || new Set(b.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án trùng hoặc thiếu`);
      if (!b.chon.includes(b.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng`);
      if (b.hoi === 'chu-vi' && chuVi(b.loai, b.kt) === null) loi.push(`Lớp ${lop}: hỏi chu vi ${TEN_HINH[b.loai]} khi chưa đủ dữ kiện`);
      const dung = b.hoi === 'chu-vi' ? chuVi(b.loai, b.kt) : dienTich(b.loai, b.kt);
      if (dung !== b.dapAn) loi.push(`Lớp ${lop}: ${TEN_HINH[b.loai]} tính sai`);
      if (b.loai === 'vuong' && b.kt.dai !== b.kt.rong) loi.push(`Lớp ${lop}: hình vuông có hai cạnh khác nhau`);

      const k = raBaiKeo(lop);
      if (!coCach(k)) loi.push(`Lớp ${lop}: bài kéo ${k.theo} = ${k.muc} không dựng được trong lưới ${k.toiDa}`);
      if (k.theo === 'chu-vi' && k.muc % 2 !== 0) loi.push(`Lớp ${lop}: chu vi hình chữ nhật luôn là số chẵn, gặp ${k.muc}`);
    }
  }
  return { loi: [...new Set(loi)] };
}
