// Biểu đồ tranh, biểu đồ cột và bảng số liệu.
//
// 480 câu thống kê trong kho đang phải mô tả biểu đồ BẰNG LỜI — mà đọc biểu đồ
// thì phải nhìn. Ở đây bé vừa đọc được biểu đồ thật, vừa tự VẼ biểu đồ từ bảng
// số liệu (kéo chiều cao cột), tức là đi cả hai chiều.

export type MucDo = 2 | 3 | 4 | 5;

export type Cot = { nhan: string; emoji: string; gia: number };

export type BoSoLieu = {
  tieuDe: string;
  donVi: string;
  cot: Cot[];
  /** Biểu đồ tranh: một hình đại diện cho mấy đơn vị. */ heSo: number;
};

const CHU_DE: { tieuDe: string; donVi: string; muc: { nhan: string; emoji: string }[] }[] = [
  {
    tieuDe: 'Số con vật trong trang trại', donVi: 'con',
    muc: [
      { nhan: 'Gà', emoji: '🐔' }, { nhan: 'Vịt', emoji: '🦆' },
      { nhan: 'Lợn', emoji: '🐷' }, { nhan: 'Bò', emoji: '🐄' },
    ],
  },
  {
    tieuDe: 'Số quả bán được trong ngày', donVi: 'quả',
    muc: [
      { nhan: 'Táo', emoji: '🍎' }, { nhan: 'Cam', emoji: '🍊' },
      { nhan: 'Chuối', emoji: '🍌' }, { nhan: 'Xoài', emoji: '🥭' },
    ],
  },
  {
    tieuDe: 'Số bạn thích mỗi môn thể thao', donVi: 'bạn',
    muc: [
      { nhan: 'Bóng đá', emoji: '⚽' }, { nhan: 'Cầu lông', emoji: '🏸' },
      { nhan: 'Bơi', emoji: '🏊' }, { nhan: 'Cờ vua', emoji: '♟️' },
    ],
  },
  {
    tieuDe: 'Số quyển sách đọc trong tuần', donVi: 'quyển',
    muc: [
      { nhan: 'Thứ Hai', emoji: '📕' }, { nhan: 'Thứ Ba', emoji: '📗' },
      { nhan: 'Thứ Tư', emoji: '📘' }, { nhan: 'Thứ Năm', emoji: '📙' },
    ],
  },
];

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 2, ten: 'Lớp 2', moTa: 'Biểu đồ tranh, mỗi hình là 1 đơn vị' },
  { lop: 3, ten: 'Lớp 3', moTa: 'Biểu đồ tranh có hệ số, bắt đầu đọc biểu đồ cột' },
  { lop: 4, ten: 'Lớp 4', moTa: 'Biểu đồ cột, so sánh và tính tổng' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Số liệu lớn hơn, thêm câu hỏi trung bình cộng' },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function raBoSoLieu(lop: MucDo, tranh: boolean): BoSoLieu {
  const cd = chon(CHU_DE);
  // Biểu đồ tranh phải chia hết cho hệ số, nếu không thì vẽ ra nửa hình.
  const heSo = !tranh ? 1 : lop <= 2 ? 1 : lop === 3 ? chon([2, 5]) : chon([5, 10]);
  const toiDa = lop <= 2 ? 8 : lop === 3 ? 10 : lop === 4 ? 12 : 20;

  // Bốc các giá trị KHÁC NHAU ngay từ đầu thay vì sinh bừa rồi sửa. Cách sửa
  // sau khi sinh đã hỏng một lần: chỉnh cột cao nhất cho khỏi trùng thì lại
  // làm nảy ra hai cột cùng thấp nhất — bộ soát bắt được.
  const kho: number[] = [];
  for (let v = 1; v <= toiDa; v++) kho.push(v);
  const boc = xao(kho).slice(0, cd.muc.length).map((v) => v * heSo);
  const cot = cd.muc.map((m, i) => ({ ...m, gia: boc[i] }));

  return { tieuDe: cd.tieuDe, donVi: cd.donVi, cot, heSo };
}

export type KieuHoi = 'nhieu-nhat' | 'it-nhat' | 'hieu' | 'tong' | 'cua-muc' | 'trung-binh';

export type BaiDoc = {
  bo: BoSoLieu;
  tranh: boolean;
  kieu: KieuHoi;
  cauHoi: string;
  dapAn: string;
  chon: string[];
};

export function raBaiDoc(lop: MucDo): BaiDoc {
  const tranh = lop <= 3 ? true : Math.random() < 0.35;
  const bo = raBoSoLieu(lop, tranh);
  const ds = bo.cot;
  const kieuCo: KieuHoi[] = lop <= 2
    ? ['nhieu-nhat', 'it-nhat', 'cua-muc']
    : lop === 3
      ? ['nhieu-nhat', 'it-nhat', 'cua-muc', 'hieu']
      : lop === 4
        ? ['nhieu-nhat', 'it-nhat', 'hieu', 'tong', 'cua-muc']
        : ['hieu', 'tong', 'cua-muc', 'trung-binh'];
  const kieu = chon(kieuCo);

  const max = ds.reduce((a, b) => (b.gia > a.gia ? b : a));
  const min = ds.reduce((a, b) => (b.gia < a.gia ? b : a));
  const tong = ds.reduce((s, c) => s + c.gia, 0);

  if (kieu === 'nhieu-nhat' || kieu === 'it-nhat') {
    const dung = kieu === 'nhieu-nhat' ? max.nhan : min.nhan;
    return {
      bo, tranh, kieu,
      cauHoi: kieu === 'nhieu-nhat' ? 'Loại nào NHIỀU NHẤT?' : 'Loại nào ÍT NHẤT?',
      dapAn: dung,
      chon: xao(ds.map((c) => c.nhan)),
    };
  }

  let dapAn: number;
  let cauHoi: string;
  if (kieu === 'hieu') {
    dapAn = max.gia - min.gia;
    cauHoi = `${max.nhan} nhiều hơn ${min.nhan} bao nhiêu ${bo.donVi}?`;
  } else if (kieu === 'tong') {
    dapAn = tong;
    cauHoi = `Tất cả có bao nhiêu ${bo.donVi}?`;
  } else if (kieu === 'trung-binh') {
    // Chỉ hỏi trung bình khi chia hết — tiểu học chưa học số lẻ ở dạng này.
    dapAn = Math.round(tong / ds.length);
    cauHoi = `Trung bình mỗi loại có bao nhiêu ${bo.donVi}?`;
    if (tong % ds.length !== 0) {
      const m = chon(ds);
      return baiCuaMuc(bo, tranh, m);
    }
  } else {
    return baiCuaMuc(bo, tranh, chon(ds));
  }

  const nhieu = new Set<number>();
  const them = (n: number) => { if (n > 0 && n !== dapAn && Number.isInteger(n)) nhieu.add(n); };
  them(dapAn + bo.heSo);
  them(dapAn - bo.heSo);
  them(max.gia);
  them(min.gia);
  them(tong);
  for (let k = 1; nhieu.size < 3 && k < 20; k++) { them(dapAn + k); them(dapAn - k); }
  return {
    bo, tranh, kieu, cauHoi, dapAn: String(dapAn),
    chon: xao([String(dapAn), ...[...nhieu].slice(0, 3).map(String)]),
  };
}

function baiCuaMuc(bo: BoSoLieu, tranh: boolean, m: Cot): BaiDoc {
  const dapAn = m.gia;
  const nhieu = new Set<number>();
  const them = (n: number) => { if (n > 0 && n !== dapAn && Number.isInteger(n)) nhieu.add(n); };
  // Lỗi kinh điển ở biểu đồ tranh: ĐẾM SỐ HÌNH mà quên nhân hệ số.
  if (bo.heSo > 1) them(dapAn / bo.heSo);
  bo.cot.forEach((c) => them(c.gia));
  them(dapAn + bo.heSo);
  them(dapAn - bo.heSo);
  for (let k = 1; nhieu.size < 3 && k < 20; k++) { them(dapAn + k); them(dapAn - k); }
  return {
    bo, tranh, kieu: 'cua-muc',
    cauHoi: `${m.nhan} có bao nhiêu ${bo.donVi}?`,
    dapAn: String(dapAn),
    chon: xao([String(dapAn), ...[...nhieu].slice(0, 3).map(String)]),
  };
}

/** Bài VẼ: cho bảng số liệu, bé kéo chiều cao từng cột cho khớp. */
export type BaiVe = { bo: BoSoLieu; toiDa: number };

export function raBaiVe(lop: MucDo): BaiVe {
  const bo = raBoSoLieu(lop, false);
  const toiDa = Math.max(...bo.cot.map((c) => c.gia)) + 2;
  return { bo, toiDa };
}

export function giaiThich(b: BaiDoc): string {
  const { bo, kieu, tranh } = b;
  const nen = tranh && bo.heSo > 1
    ? `Ở biểu đồ tranh, mỗi hình đại diện cho ${bo.heSo} ${bo.donVi} — phải ĐẾM SỐ HÌNH RỒI NHÂN ${bo.heSo}, đừng lấy luôn số hình.`
    : '';
  const bang = bo.cot.map((c) => `${c.nhan} ${c.gia}`).join(', ');
  if (kieu === 'nhieu-nhat') return `So các cột: ${bang}. Cột cao nhất là đáp án. ${nen}`;
  if (kieu === 'it-nhat') return `So các cột: ${bang}. Cột thấp nhất là đáp án. ${nen}`;
  if (kieu === 'hieu') return `Lấy cột cao nhất trừ cột thấp nhất: ${bang}. ${nen}`;
  if (kieu === 'tong') return `Cộng tất cả các cột: ${bo.cot.map((c) => c.gia).join(' + ')} = ${bo.cot.reduce((s, c) => s + c.gia, 0)}. ${nen}`;
  if (kieu === 'trung-binh') return `Trung bình cộng = tổng chia cho số loại: (${bo.cot.map((c) => c.gia).join(' + ')}) : ${bo.cot.length}. ${nen}`;
  return `Đọc đúng cột được hỏi: ${bang}. ${nen}`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi có hai cột cùng cao nhất (câu "nhiều nhất"
 * thành hai đáp án), số liệu không chia hết cho hệ số biểu đồ tranh, đáp án
 * nhiễu trùng, và lớp nhỏ gặp dạng chưa học.
 */
export function kiemBieuDo() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const b = raBaiDoc(lop);
      const gia = b.bo.cot.map((c) => c.gia);
      if (gia.some((g) => g <= 0)) loi.push(`Lớp ${lop}: có cột số liệu bằng 0 hoặc âm`);
      if (b.tranh && gia.some((g) => g % b.bo.heSo !== 0)) loi.push(`Lớp ${lop}: số liệu không chia hết cho hệ số ${b.bo.heSo}`);
      const max = Math.max(...gia);
      const min = Math.min(...gia);
      if (b.kieu === 'nhieu-nhat' && gia.filter((g) => g === max).length > 1) loi.push(`Lớp ${lop}: hai cột cùng cao nhất`);
      if (b.kieu === 'it-nhat' && gia.filter((g) => g === min).length > 1) loi.push(`Lớp ${lop}: hai cột cùng thấp nhất`);
      if (b.chon.length !== 4 || new Set(b.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án trùng hoặc thiếu (${b.kieu})`);
      if (!b.chon.includes(b.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng (${b.kieu})`);
      if (lop <= 3 && (b.kieu === 'tong' || b.kieu === 'trung-binh')) loi.push(`Lớp ${lop} chưa học dạng ${b.kieu}`);
      if (lop <= 2 && b.bo.heSo !== 1) loi.push('Lớp 2 chỉ dùng biểu đồ tranh hệ số 1');

      const v = raBaiVe(lop);
      if (v.toiDa < Math.max(...v.bo.cot.map((c) => c.gia))) loi.push(`Lớp ${lop}: lưới vẽ thấp hơn cột cao nhất`);
    }
  }
  return { loi: [...new Set(loi)] };
}
