// Tìm thành phần chưa biết (tìm x) — minh hoạ bằng CÂN THĂNG BẰNG.
//
// Trẻ học quy tắc "muốn tìm số hạng chưa biết thì lấy tổng trừ số hạng kia"
// rất nhanh, nhưng đến phép trừ và phép chia là lẫn ngay, vì quy tắc thuộc
// lòng không nói vì sao. Cân thăng bằng nói được: hai đĩa luôn bằng nhau, bớt
// bên này thì phải bớt bên kia đúng bấy nhiêu.

export type MucDo = 2 | 3 | 4 | 5;

/** Dạng phương trình. `x` luôn là ẩn. */
export type Dang =
  | 'cong'      // x + a = b
  | 'cong-dao'  // a + x = b
  | 'tru'       // x − a = b
  | 'tru-dao'   // a − x = b
  | 'nhan'      // x × a = b
  | 'chia'      // x : a = b
  | 'chia-dao'; // a : x = b

export type BaiTimX = {
  dang: Dang;
  a: number;
  b: number;
  x: number;
  /** Đề viết ra, ví dụ "x + 7 = 12". */ de: string;
  /** Phép tính để tìm x, ví dụ "12 − 7". */ cach: string;
  chon: number[];
};

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; dang: Dang[] }[] = [
  { lop: 2, ten: 'Lớp 2', moTa: 'Tìm số hạng, số bị trừ, số trừ trong phạm vi 100', dang: ['cong', 'cong-dao', 'tru', 'tru-dao'] },
  { lop: 3, ten: 'Lớp 3', moTa: 'Thêm tìm thừa số và số bị chia', dang: ['cong', 'cong-dao', 'tru', 'tru-dao', 'nhan', 'chia'] },
  { lop: 4, ten: 'Lớp 4', moTa: 'Số lớn hơn, thêm tìm số chia', dang: ['cong', 'tru', 'tru-dao', 'nhan', 'chia', 'chia-dao'] },
  { lop: 5, ten: 'Lớp 5', moTa: 'Số lớn, đủ các dạng', dang: ['cong', 'tru', 'tru-dao', 'nhan', 'chia', 'chia-dao'] },
];

/** Tên gọi thành phần đang phải tìm — đúng thuật ngữ sách giáo khoa. */
export const TEN_THANH_PHAN: Record<Dang, string> = {
  'cong': 'số hạng chưa biết',
  'cong-dao': 'số hạng chưa biết',
  'tru': 'số bị trừ',
  'tru-dao': 'số trừ',
  'nhan': 'thừa số chưa biết',
  'chia': 'số bị chia',
  'chia-dao': 'số chia',
};

export const QUY_TAC: Record<Dang, string> = {
  'cong': 'Muốn tìm số hạng chưa biết, lấy TỔNG trừ số hạng kia.',
  'cong-dao': 'Muốn tìm số hạng chưa biết, lấy TỔNG trừ số hạng kia.',
  'tru': 'Muốn tìm số bị trừ, lấy HIỆU cộng số trừ.',
  'tru-dao': 'Muốn tìm số trừ, lấy SỐ BỊ TRỪ trừ hiệu.',
  'nhan': 'Muốn tìm thừa số chưa biết, lấy TÍCH chia thừa số kia.',
  'chia': 'Muốn tìm số bị chia, lấy THƯƠNG nhân số chia.',
  'chia-dao': 'Muốn tìm số chia, lấy SỐ BỊ CHIA chia cho thương.',
};

export function raBaiTimX(lop: MucDo): BaiTimX {
  const dsDang = MUC_DO.find((m) => m.lop === lop)!.dang;
  const dang = chon(dsDang);
  const lon = lop <= 2 ? 20 : lop === 3 ? 50 : lop === 4 ? 200 : 1000;

  let a: number, b: number, x: number, de: string, cach: string;
  if (dang === 'cong' || dang === 'cong-dao') {
    x = nn(1, lon);
    a = nn(1, lon);
    b = x + a;
    de = dang === 'cong' ? `x + ${a} = ${b}` : `${a} + x = ${b}`;
    cach = `${b} − ${a}`;
  } else if (dang === 'tru') {
    a = nn(1, lon);
    x = a + nn(1, lon);
    b = x - a;
    de = `x − ${a} = ${b}`;
    cach = `${b} + ${a}`;
  } else if (dang === 'tru-dao') {
    a = nn(2, lon);
    x = nn(1, a - 1);
    b = a - x;
    de = `${a} − x = ${b}`;
    cach = `${a} − ${b}`;
  } else if (dang === 'nhan') {
    a = nn(2, lop <= 3 ? 9 : 12);
    x = nn(2, Math.max(3, Math.floor(lon / a)));
    b = x * a;
    de = `x × ${a} = ${b}`;
    cach = `${b} : ${a}`;
  } else if (dang === 'chia') {
    a = nn(2, lop <= 3 ? 9 : 12);
    b = nn(2, Math.max(3, Math.floor(lon / a)));
    x = a * b;
    de = `x : ${a} = ${b}`;
    cach = `${b} × ${a}`;
  } else {
    // a : x = b
    x = nn(2, lop <= 3 ? 9 : 12);
    b = nn(2, Math.max(3, Math.floor(lon / x)));
    a = x * b;
    de = `${a} : x = ${b}`;
    cach = `${a} : ${b}`;
  }

  const nhieu = new Set<number>();
  const them = (n: number) => { if (n > 0 && n !== x && Number.isInteger(n)) nhieu.add(n); };
  // Lỗi kinh điển: làm ngược phép tính (cộng thay vì trừ, nhân thay vì chia).
  if (dang.startsWith('cong')) them(b + a);
  if (dang === 'tru') them(b - a);
  if (dang === 'tru-dao') them(a + b);
  if (dang === 'nhan') them(b * a);
  if (dang === 'chia') them(b / a);
  if (dang === 'chia-dao') them(a * b);
  them(a);
  them(b);
  them(x + 1);
  them(x - 1);
  for (let k = 2; nhieu.size < 3 && k < 30; k++) { them(x + k); them(x - k); }
  return { dang, a, b, x, de, cach, chon: xao([x, ...[...nhieu].slice(0, 3)]) };
}

/**
 * Cân thăng bằng minh hoạ được cho các dạng CỘNG và NHÂN (đĩa trái có x).
 * Các dạng còn lại vẽ cân sẽ rối hơn là giúp, nên chỉ vẽ khi hợp.
 */
export const veDuocCan = (d: Dang) => d === 'cong' || d === 'cong-dao' || d === 'nhan';

export function giaiThich(b: BaiTimX): string {
  const q = QUY_TAC[b.dang];
  const canBang = veDuocCan(b.dang)
    ? ' Nhìn cân: hai đĩa luôn bằng nhau, nên bớt (hoặc chia) ở đĩa này bao nhiêu thì phải làm y hệt ở đĩa kia.'
    : '';
  return `${b.de} → x = ${b.cach} = ${b.x}. ${q}${canBang} Thử lại bằng cách thay x = ${b.x} vào đề.`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi x âm hoặc bằng 0, phép tính "cach" không
 * ra đúng x, đề chưa học ở lớp đó, và đáp án nhiễu trùng.
 */
export function kiemTimX() {
  const loi: string[] = [];
  for (const { lop, dang: dsDang } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const b = raBaiTimX(lop);
      if (!dsDang.includes(b.dang)) loi.push(`Lớp ${lop}: ra dạng ${b.dang} chưa học`);
      if (!Number.isInteger(b.x) || b.x <= 0) loi.push(`Lớp ${lop}: x = ${b.x} không hợp lệ`);
      if (b.chon.length !== 4 || new Set(b.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án trùng hoặc thiếu (${b.dang})`);
      if (!b.chon.includes(b.x)) loi.push(`Lớp ${lop}: thiếu đáp án đúng`);

      // Thay x vào đề phải đúng.
      const kt: Record<Dang, boolean> = {
        'cong': b.x + b.a === b.b,
        'cong-dao': b.a + b.x === b.b,
        'tru': b.x - b.a === b.b,
        'tru-dao': b.a - b.x === b.b,
        'nhan': b.x * b.a === b.b,
        'chia': b.x / b.a === b.b,
        'chia-dao': b.a / b.x === b.b,
      };
      if (!kt[b.dang]) loi.push(`Lớp ${lop}: thay x vào "${b.de}" không đúng`);
      // Phép tính gợi ý phải ra đúng x.
      const [p, dau, q] = b.cach.split(' ');
      const ra = dau === '−' ? Number(p) - Number(q)
        : dau === '+' ? Number(p) + Number(q)
        : dau === '×' ? Number(p) * Number(q)
        : Number(p) / Number(q);
      if (ra !== b.x) loi.push(`Lớp ${lop}: cách tìm "${b.cach}" ra ${ra}, khác x = ${b.x}`);
      if (b.dang === 'tru-dao' && b.b <= 0) loi.push(`Lớp ${lop}: hiệu bằng 0 hoặc âm`);
    }
  }
  return { loi: [...new Set(loi)] };
}
