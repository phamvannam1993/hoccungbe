// Sinh phép tính ĐẶT CỘT DỌC và chấm theo TỪNG CHỮ SỐ.
//
// Vì sao không dùng trắc nghiệm: bé làm sai cột dọc hầu như luôn vì một lý do
// cụ thể — quên nhớ 1, cộng cả số nhớ vào sai hàng, trừ không mượn. Trắc
// nghiệm chỉ nói "sai"; chấm từng chữ số chỉ được đúng cột bé làm hỏng.

export type Dau = '+' | '−' | '×';
export type MucDo = 1 | 2 | 3 | 4 | 5;

export type PhepDat = {
  dau: Dau;
  a: number;
  b: number;
  kq: number;
  /** Chữ số kết quả, hàng đơn vị đứng TRƯỚC (chỉ số 0 = hàng đơn vị). */
  chuSoKq: number[];
  /** Số nhớ sang hàng kế tiếp; chỉ số 0 = nhớ từ hàng đơn vị sang hàng chục. */
  nho: number[];
  /** Số cột cần điền. */ soCot: number;
};

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 1, ten: 'Lớp 1', moTa: 'Cộng, trừ số có hai chữ số — không nhớ' },
  { lop: 2, ten: 'Lớp 2', moTa: 'Cộng, trừ có nhớ trong phạm vi 100' },
  { lop: 3, ten: 'Lớp 3', moTa: 'Số có ba chữ số, thêm phép nhân với số có một chữ số' },
  { lop: 4, ten: 'Lớp 4', moTa: 'Số có bốn chữ số, nhân với số có một chữ số' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Số lớn, nhiều lần nhớ liên tiếp' },
];

/** Chữ số của một số, hàng đơn vị đứng trước. */
export const chuSo = (n: number): number[] => String(n).split('').reverse().map(Number);

/** Số nhớ ở từng hàng, tính đúng như cách đặt tính trên giấy. */
export function tinhNho(a: number, b: number, dau: Dau): number[] {
  const x = chuSo(a);
  const y = chuSo(b);
  const n = Math.max(x.length, y.length);
  const ra: number[] = [];
  if (dau === '×') {
    // Chỉ làm nhân với số có MỘT chữ số: nhớ là phần chục của mỗi tích.
    let giu = 0;
    for (let i = 0; i < x.length; i++) {
      const t = x[i] * y[0] + giu;
      giu = Math.floor(t / 10);
      ra.push(giu);
    }
    return ra;
  }
  let giu = 0;
  for (let i = 0; i < n; i++) {
    const u = x[i] ?? 0;
    const v = y[i] ?? 0;
    if (dau === '+') {
      const t = u + v + giu;
      giu = t >= 10 ? 1 : 0;
    } else {
      const t = u - v - giu;
      giu = t < 0 ? 1 : 0;   // mượn 1 của hàng bên trái
    }
    ra.push(giu);
  }
  return ra;
}

export function raPhep(lop: MucDo, dauMuon?: Dau): PhepDat {
  const coNhan = lop >= 3;
  const dau: Dau = dauMuon ?? (coNhan && Math.random() < 0.34 ? '×' : Math.random() < 0.5 ? '+' : '−');

  if (dau === '×') {
    const hang = lop === 3 ? 2 : lop === 4 ? 3 : 4;
    const a = nn(10 ** (hang - 1), 10 ** hang - 1);
    const b = nn(2, 9);
    const kq = a * b;
    return { dau, a, b, kq, chuSoKq: chuSo(kq), nho: tinhNho(a, b, '×'), soCot: chuSo(kq).length };
  }

  const hang = lop === 1 ? 2 : lop === 2 ? 2 : lop === 3 ? 3 : lop === 4 ? 4 : 5;
  const lo = 10 ** (hang - 1);
  const hi = 10 ** hang - 1;

  if (dau === '+') {
    // Lớp 1 chưa học nhớ: ghép từng hàng sao cho tổng mỗi hàng dưới 10.
    if (lop === 1) {
      const x = [nn(1, 8), nn(1, 8)];
      const y = [nn(1, 9 - x[0]), nn(1, 9 - x[1])];
      const a = x[1] * 10 + x[0];
      const b = y[1] * 10 + y[0];
      return { dau, a, b, kq: a + b, chuSoKq: chuSo(a + b), nho: tinhNho(a, b, '+'), soCot: chuSo(a + b).length };
    }
    const a = nn(lo, hi);
    const b = nn(lo, hi);
    return { dau, a, b, kq: a + b, chuSoKq: chuSo(a + b), nho: tinhNho(a, b, '+'), soCot: chuSo(a + b).length };
  }

  // Phép trừ: số bị trừ luôn lớn hơn, kết quả không âm.
  if (lop === 1) {
    const x = [nn(1, 9), nn(2, 9)];
    const y = [nn(0, x[0]), nn(1, x[1] - 1)];
    const a = x[1] * 10 + x[0];
    const b = y[1] * 10 + y[0];
    return { dau, a, b, kq: a - b, chuSoKq: chuSo(a - b), nho: tinhNho(a, b, '−'), soCot: chuSo(a - b).length };
  }
  const a = nn(lo + 10, hi);
  const b = nn(lo, a - 1);
  return { dau, a, b, kq: a - b, chuSoKq: chuSo(a - b), nho: tinhNho(a, b, '−'), soCot: chuSo(a - b).length };
}

/** Lời nhắc khi bé điền sai một cột — nói đúng lỗi, không nói chung chung. */
export function nhacCot(p: PhepDat, cot: number, daDien: number): string {
  const ten = ['hàng đơn vị', 'hàng chục', 'hàng trăm', 'hàng nghìn', 'hàng chục nghìn'][cot] ?? `cột thứ ${cot + 1}`;
  const x = chuSo(p.a)[cot] ?? 0;
  const y = chuSo(p.b)[cot] ?? 0;
  const nhoVao = cot > 0 ? p.nho[cot - 1] : 0;
  const dung = p.chuSoKq[cot];

  if (p.dau === '+') {
    const tong = x + y + nhoVao;
    if (nhoVao && daDien === (x + y) % 10) return `Ở ${ten}: bé quên cộng thêm 1 nhớ từ hàng bên phải. ${x} + ${y} + 1 = ${tong}, viết ${dung}.`;
    if (tong >= 10 && daDien === tong) return `Ở ${ten}: ${x} + ${y}${nhoVao ? ' + 1' : ''} = ${tong}, nhưng mỗi ô chỉ viết được MỘT chữ số — viết ${dung}, nhớ ${Math.floor(tong / 10)} sang hàng bên trái.`;
    return `Ở ${ten}: ${x} + ${y}${nhoVao ? ' + 1 nhớ' : ''} = ${tong}, nên viết ${dung}.`;
  }
  if (p.dau === '−') {
    const tren = x - nhoVao;
    if (tren < y) return `Ở ${ten}: ${tren} không trừ được ${y} nên phải MƯỢN 1 của hàng bên trái: ${tren + 10} − ${y} = ${dung}.`;
    return `Ở ${ten}: ${x}${nhoVao ? ' bớt 1 vì đã cho mượn' : ''} − ${y} = ${dung}.`;
  }
  const tich = x * chuSo(p.b)[0] + nhoVao;
  return `Ở ${ten}: ${x} × ${p.b}${nhoVao ? ` + ${nhoVao} nhớ` : ''} = ${tich}, viết ${dung}${tich >= 10 ? `, nhớ ${Math.floor(tich / 10)}` : ''}.`;
}

/**
 * Soát bộ sinh: 3.000 lượt mỗi lớp. Bắt lỗi kết quả âm, số nhớ tính sai,
 * lớp 1 lại ra phép có nhớ, và chữ số kết quả không khớp phép tính.
 */
export function kiemDatTinh() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const p = raPhep(lop);
      const dung = p.dau === '+' ? p.a + p.b : p.dau === '−' ? p.a - p.b : p.a * p.b;
      if (p.kq !== dung) loi.push(`Lớp ${lop}: ${p.a} ${p.dau} ${p.b} ghi kết quả ${p.kq}, đúng là ${dung}`);
      if (p.kq < 0) loi.push(`Lớp ${lop}: kết quả âm`);
      if (p.chuSoKq.join('') !== chuSo(p.kq).join('')) loi.push(`Lớp ${lop}: chữ số kết quả lệch`);
      if (p.soCot !== p.chuSoKq.length) loi.push(`Lớp ${lop}: số cột không khớp số chữ số`);
      if (lop === 1) {
        if (p.dau === '×') loi.push('Lớp 1 chưa học phép nhân');
        if (p.nho.some((n) => n > 0)) loi.push(`Lớp 1 chưa học nhớ: ${p.a} ${p.dau} ${p.b}`);
        if (p.a > 99 || p.b > 99) loi.push(`Lớp 1: số ${Math.max(p.a, p.b)} vượt 99`);
      }
      if (lop === 2 && p.dau === '×') loi.push('Lớp 2 chưa học nhân đặt cột dọc');
      // Ghép lại từ chữ số + số nhớ phải ra đúng kết quả.
      if (p.dau === '+') {
        for (let c = 0; c < p.soCot; c++) {
          const x = chuSo(p.a)[c] ?? 0;
          const y = chuSo(p.b)[c] ?? 0;
          const vao = c > 0 ? p.nho[c - 1] : 0;
          if ((x + y + vao) % 10 !== p.chuSoKq[c]) loi.push(`Lớp ${lop}: cột ${c} của ${p.a} + ${p.b} tính sai`);
        }
      }
    }
  }
  return { loi: [...new Set(loi)] };
}
