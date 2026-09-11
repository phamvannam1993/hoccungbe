// Dữ liệu và luật cho phần "Phân số trực quan".
//
// Bám thứ tự sách giáo khoa: lớp 2 nhận biết 1/2, 1/3, 1/4; lớp 3 phân số có
// tử lớn hơn 1 và so sánh cùng mẫu; lớp 4 rút gọn, so sánh khác mẫu; lớp 5
// cộng trừ phân số. Nhờ vậy bé lớp 2 không gặp 7/12 ngay bài đầu.

export type MucDo = 2 | 3 | 4 | 5;
export type PhanSo = { tu: number; mau: number };

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; mauSo: number[] }[] = [
  { lop: 2, ten: 'Lớp 2', moTa: 'Nhận biết một phần hai, một phần ba, một phần tư', mauSo: [2, 3, 4] },
  { lop: 3, ten: 'Lớp 3', moTa: 'Phân số nhiều phần, so sánh cùng mẫu số', mauSo: [2, 3, 4, 5, 6, 8] },
  { lop: 4, ten: 'Lớp 4', moTa: 'Rút gọn và so sánh phân số khác mẫu', mauSo: [2, 3, 4, 5, 6, 8, 9, 10, 12] },
  { lop: 5, ten: 'Lớp 5', moTa: 'Cộng, trừ phân số', mauSo: [2, 3, 4, 5, 6, 8, 9, 10, 12] },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];

export const ucln = (a: number, b: number): number => (b === 0 ? a : ucln(b, a % b));
export const bcnn = (a: number, b: number) => (a * b) / ucln(a, b);

/** Rút gọn về tối giản. */
export function rutGon(p: PhanSo): PhanSo {
  const u = ucln(p.tu, p.mau) || 1;
  return { tu: p.tu / u, mau: p.mau / u };
}

export const toiGian = (p: PhanSo) => ucln(p.tu, p.mau) === 1;
export const giaTri = (p: PhanSo) => p.tu / p.mau;
export const bangNhau = (a: PhanSo, b: PhanSo) => a.tu * b.mau === b.tu * a.mau;

/** Đọc thành chữ để máy phát âm: "hai phần ba". */
const CHU = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười',
  'mười một', 'mười hai'];
export function docPhanSo(p: PhanSo): string {
  const tu = CHU[p.tu] ?? String(p.tu);
  const mau = CHU[p.mau] ?? String(p.mau);
  if (p.mau === 2 && p.tu === 1) return 'một nửa';
  return `${tu} phần ${mau}`;
}

/** Sinh một phân số hợp mức độ: tử luôn nhỏ hơn mẫu (phân số bé hơn 1). */
export function raPhanSo(lop: MucDo): PhanSo {
  const mau = chon(MUC_DO.find((m) => m.lop === lop)!.mauSo);
  // Lớp 2 chỉ học "một phần mấy" — tử số luôn bằng 1.
  const tu = lop === 2 ? 1 : nn(1, mau - 1);
  return { tu, mau };
}

/** Cặp phân số để so sánh. Lớp 3 cùng mẫu, lớp 4–5 khác mẫu. */
export function raCapSoSanh(lop: MucDo): [PhanSo, PhanSo] {
  if (lop <= 3) {
    const mau = chon(MUC_DO.find((m) => m.lop === lop)!.mauSo.filter((x) => x >= 3));
    let a = nn(1, mau - 1);
    let b = nn(1, mau - 1);
    if (a === b) b = b === mau - 1 ? b - 1 : b + 1;
    return [{ tu: a, mau }, { tu: b, mau }];
  }
  const ds = MUC_DO.find((m) => m.lop === lop)!.mauSo;
  let p = raPhanSo(lop);
  let q = { tu: 0, mau: 0 };
  // Tránh hai phân số bằng nhau về giá trị nhưng khác mẫu (2/4 với 1/2) ở dạng
  // so sánh lớn bé — dạng đó để riêng cho bài rút gọn.
  for (let i = 0; i < 40; i++) {
    const mau = chon(ds.filter((x) => x !== p.mau));
    q = { tu: nn(1, mau - 1), mau };
    if (!bangNhau(p, q)) break;
  }
  if (bangNhau(p, q)) { p = { tu: 1, mau: 2 }; q = { tu: 2, mau: 3 }; }
  return [p, q];
}

/** Phép cộng/trừ hai phân số CÙNG MẪU — dạng lớp 5 học trước tiên. */
export function raPhepTinh(lop: MucDo): { a: PhanSo; b: PhanSo; dau: '+' | '−'; kq: PhanSo } {
  const mau = chon(MUC_DO.find((m) => m.lop === lop)!.mauSo.filter((x) => x >= 4));
  const dau = Math.random() < 0.6 ? '+' : '−';
  if (dau === '+') {
    const a = nn(1, mau - 2);
    const b = nn(1, mau - 1 - a);
    return { a: { tu: a, mau }, b: { tu: b, mau }, dau, kq: { tu: a + b, mau } };
  }
  const a = nn(2, mau - 1);
  const b = nn(1, a - 1);
  return { a: { tu: a, mau }, b: { tu: b, mau }, dau, kq: { tu: a - b, mau } };
}

/** Đáp án nhiễu bám đúng lỗi trẻ hay mắc, không bốc ngẫu nhiên. */
export function dapAnNhieu(dung: PhanSo, lop: MucDo): PhanSo[] {
  const ra: PhanSo[] = [];
  const them = (p: PhanSo) => {
    if (p.tu > 0 && p.mau > 1 && p.tu <= p.mau && !bangNhau(p, dung) && !ra.some((x) => x.tu === p.tu && x.mau === p.mau)) ra.push(p);
  };
  // 1. Đảo tử và mẫu — lỗi hay gặp nhất khi mới học.
  them({ tu: dung.mau, mau: dung.tu });
  // 2. Đếm nhầm phần CHƯA tô thay vì phần đã tô.
  them({ tu: dung.mau - dung.tu, mau: dung.mau });
  // 3. Lệch một phần.
  them({ tu: dung.tu + 1, mau: dung.mau });
  them({ tu: dung.tu - 1, mau: dung.mau });
  // 4. Nhầm mẫu số sang số phần còn lại.
  them({ tu: dung.tu, mau: dung.mau + 1 });
  them({ tu: dung.tu, mau: dung.mau - 1 });
  // 5. Nới dần cho đủ ba đáp án. Cần vì 1/2 rất nghèo biến thể: đảo tử–mẫu ra
  //    2/1 (bị loại vì lớn hơn 1), phần chưa tô cũng ra đúng 1/2. Bộ soát đã
  //    bắt được đúng trường hợp này ở cả bốn lớp.
  const mauDs = MUC_DO.find((m) => m.lop === lop)!.mauSo;
  for (const mau of mauDs) {
    for (let tu = 1; tu < mau && ra.length < 3; tu++) them({ tu, mau });
    if (ra.length >= 3) break;
  }
  return ra.slice(0, 3);
}

/**
 * Soát luật sinh: chạy 2.000 lượt mỗi lớp. Bắt các lỗi kiểu "tử lớn hơn mẫu",
 * "mẫu bằng 0", "đáp án nhiễu trùng đáp án đúng" — những thứ ngồi thử tay
 * không bao giờ gặp hết.
 */
export function kiemPhanSo() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 2000; i++) {
      const p = raPhanSo(lop);
      if (p.mau < 2) loi.push(`Lớp ${lop}: mẫu số ${p.mau} không hợp lệ`);
      if (p.tu < 1 || p.tu >= p.mau) loi.push(`Lớp ${lop}: tử ${p.tu} phải nhỏ hơn mẫu ${p.mau}`);
      if (lop === 2 && p.tu !== 1) loi.push(`Lớp 2 chỉ học "một phần mấy", gặp ${p.tu}/${p.mau}`);

      const nhieu = dapAnNhieu(p, lop);
      if (nhieu.length < 3) loi.push(`Lớp ${lop}: ${p.tu}/${p.mau} chỉ tạo được ${nhieu.length} đáp án nhiễu`);
      if (nhieu.some((x) => bangNhau(x, p))) loi.push(`Lớp ${lop}: đáp án nhiễu trùng đáp án đúng`);

      const [a, b] = raCapSoSanh(lop);
      if (bangNhau(a, b)) loi.push(`Lớp ${lop}: cặp so sánh ${a.tu}/${a.mau} và ${b.tu}/${b.mau} bằng nhau`);
      if (lop <= 3 && a.mau !== b.mau) loi.push(`Lớp ${lop}: chưa học so sánh khác mẫu (${a.mau} với ${b.mau})`);

      if (lop === 5) {
        const t = raPhepTinh(lop);
        if (t.kq.tu < 1 || t.kq.tu > t.kq.mau) loi.push(`Lớp 5: kết quả ${t.kq.tu}/${t.kq.mau} nằm ngoài 0–1`);
        const dung = t.dau === '+' ? t.a.tu + t.b.tu : t.a.tu - t.b.tu;
        if (t.kq.tu !== dung) loi.push(`Lớp 5: phép tính sai kết quả`);
      }
    }
  }
  return { loi: [...new Set(loi)] };
}
