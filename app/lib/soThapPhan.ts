// Số thập phân — nhìn bằng thanh chia 10 và lưới 100 ô.
//
// Hai chỗ trẻ lớp 5 sai nhiều nhất, cả hai đều vì không hình dung được:
//   1. Tưởng 0,45 lớn hơn 0,5 — "nhiều chữ số hơn thì lớn hơn", đem thói quen
//      so sánh số tự nhiên sang.
//   2. Tưởng 0,3 khác 0,30.
// Tô ô rồi đặt hai thanh cạnh nhau là hết cả hai, không cần giảng.

export type MucDo = 4 | 5;

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 4, ten: 'Lớp 4', moTa: 'Phân số thập phân, số thập phân một chữ số sau dấu phẩy' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Hai chữ số sau dấu phẩy, so sánh và đổi qua phân số' },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Viết kiểu Việt Nam: dấu phẩy thập phân. */
export const viet = (n: number, soLe: number) => n.toFixed(soLe).replace('.', ',');

/** Đọc thành lời cho máy phát âm: "không phẩy hai lăm". */
export function docSo(n: number, soLe: number): string {
  const s = n.toFixed(soLe);
  const [nguyen, le] = s.split('.');
  const CHU = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const docPhan = (p: string) => p.split('').map((c) => CHU[Number(c)]).join(' ');
  return le ? `${docPhan(nguyen)} phẩy ${docPhan(le)}` : docPhan(nguyen);
}

/* ─────────── 1. ĐỌC SỐ TỪ HÌNH ─────────── */

export type BaiDoc = {
  /** Số ô được tô. */ o: number;
  /** Tổng số ô: 10 hoặc 100. */ tong: 10 | 100;
  gia: number;
  soLe: number;
  chon: string[];
  dapAn: string;
};

export function raBaiDoc(lop: MucDo): BaiDoc {
  const tong: 10 | 100 = lop === 4 ? 10 : (Math.random() < 0.5 ? 10 : 100);
  const soLe = tong === 10 ? 1 : 2;
  const o = nn(1, tong - 1);
  const gia = o / tong;
  const dapAn = viet(gia, soLe);

  const nhieu = new Set<string>();
  const them = (n: number, le = soLe) => {
    const s = viet(n, le);
    if (n > 0 && s !== dapAn) nhieu.add(s);
  };
  // Lỗi hay gặp: ghi luôn SỐ Ô mà quên phần thập phân (35 thay vì 0,35), hoặc
  // nhầm bậc (0,035 / 3,5).
  them(o, 0);
  them(gia * 10);
  them(gia / 10, soLe + 1);
  them(gia + 0.1);
  them(gia - 0.1);
  for (let k = 2; nhieu.size < 3 && k < 20; k++) { them(gia + k / tong); them(gia - k / tong); }
  return { o, tong, gia, soLe, dapAn, chon: xao([dapAn, ...[...nhieu].slice(0, 3)]) };
}

/* ─────────── 2. SO SÁNH ─────────── */

export type BaiSoSanh = { a: number; b: number; soLe: number; dapAn: '>' | '<' | '=' };

export function raBaiSoSanh(lop: MucDo): BaiSoSanh {
  const soLe = lop === 4 ? 1 : 2;
  for (let lan = 0; lan < 200; lan++) {
    // Cố ý hay ra cặp kiểu 0,5 với 0,45 — nơi "nhiều chữ số hơn" đánh lừa.
    const bay = lop === 5 && Math.random() < 0.5;
    const a = bay ? nn(1, 9) / 10 : nn(1, 10 ** soLe - 1) / 10 ** soLe;
    const b = bay ? nn(11, 99) / 100 : nn(1, 10 ** soLe - 1) / 10 ** soLe;
    const ta = Number(a.toFixed(2));
    const tb = Number(b.toFixed(2));
    if (ta === tb) continue;
    return { a: ta, b: tb, soLe, dapAn: ta > tb ? '>' : '<' };
  }
  return { a: 0.5, b: 0.45, soLe: 2, dapAn: '>' };
}

/* ─────────── 3. ĐỔI PHÂN SỐ ↔ SỐ THẬP PHÂN ─────────── */

export type BaiDoi = { tu: number; mau: 10 | 100; dapAn: string; chon: string[] };

export function raBaiDoi(lop: MucDo): BaiDoi {
  const mau: 10 | 100 = lop === 4 ? 10 : (Math.random() < 0.5 ? 10 : 100);
  const tu = nn(1, mau - 1);
  const soLe = mau === 10 ? 1 : 2;
  const dapAn = viet(tu / mau, soLe);
  const nhieu = new Set<string>();
  const them = (s: string) => { if (s !== dapAn) nhieu.add(s); };
  them(viet(tu, 0));                    // quên phần thập phân
  them(viet(tu / 10, 1));
  them(viet(tu / 100, 2));
  them(viet((tu + 1) / mau, soLe));
  them(viet(Math.max(1, tu - 1) / mau, soLe));
  return { tu, mau, dapAn, chon: xao([dapAn, ...[...nhieu].slice(0, 3)]) };
}

export function giaiDoc(b: BaiDoc): string {
  const phan = b.tong === 10 ? 'một phần mười' : 'một phần trăm';
  return `Hình chia thành ${b.tong} phần bằng nhau, tô ${b.o} phần, nên là ${b.o}/${b.tong} = ${b.dapAn}. Mỗi ô là ${phan}, tức chữ số ${b.tong === 10 ? 'đầu tiên' : 'thứ hai'} sau dấu phẩy.`;
}

export function giaiSoSanh(b: BaiSoSanh): string {
  const a2 = b.a.toFixed(2);
  const b2 = b.b.toFixed(2);
  return `So sánh số thập phân thì so TỪNG HÀNG, không phải đếm xem số nào nhiều chữ số hơn. Viết đủ hai chữ số cho dễ nhìn: ${a2.replace('.', ',')} và ${b2.replace('.', ',')} — so hàng phần mười trước, bằng nhau mới xuống hàng phần trăm. Thêm số 0 vào cuối KHÔNG làm số to hơn: 0,5 = 0,50.`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi đáp án nhiễu trùng, số ô vượt lưới, lớp 4
 * gặp hai chữ số thập phân, và so sánh ra hai số bằng nhau.
 */
export function kiemSoThapPhan() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const d = raBaiDoc(lop);
      if (d.o < 1 || d.o >= d.tong) loi.push(`Lớp ${lop}: số ô tô ${d.o} ngoài khoảng`);
      if (lop === 4 && d.tong !== 10) loi.push('Lớp 4 chỉ dùng thanh 10 phần');
      if (d.chon.length !== 4 || new Set(d.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án đọc số trùng hoặc thiếu`);
      if (!d.chon.includes(d.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng khi đọc số`);
      if (viet(d.o / d.tong, d.soLe) !== d.dapAn) loi.push(`Lớp ${lop}: đáp án đọc số tính sai`);

      const s = raBaiSoSanh(lop);
      if (s.a === s.b) loi.push(`Lớp ${lop}: hai số so sánh bằng nhau`);
      const dung = s.a > s.b ? '>' : '<';
      if (s.dapAn !== dung) loi.push(`Lớp ${lop}: đáp án so sánh sai`);
      if (lop === 4 && (s.a * 10) % 1 !== 0) loi.push('Lớp 4 chỉ dùng một chữ số thập phân');

      const o = raBaiDoi(lop);
      if (o.tu < 1 || o.tu >= o.mau) loi.push(`Lớp ${lop}: tử số ${o.tu} ngoài khoảng`);
      if (o.chon.length !== 4 || new Set(o.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án đổi trùng hoặc thiếu`);
      if (!o.chon.includes(o.dapAn)) loi.push(`Lớp ${lop}: thiếu đáp án đúng khi đổi`);
      if (lop === 4 && o.mau !== 10) loi.push('Lớp 4 chỉ đổi phân số có mẫu 10');
    }
  }
  return { loi: [...new Set(loi)] };
}
