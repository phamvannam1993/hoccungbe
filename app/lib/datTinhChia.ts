// Phép CHIA đặt cột dọc — tách riêng khỏi cộng/trừ/nhân vì cách làm khác hẳn.
//
// Cộng trừ nhân chỉ đi một lượt từ phải sang trái. Chia thì lặp bốn việc ở mỗi
// bước: ƯỚC LƯỢNG thương, NHÂN ngược lại, TRỪ, rồi HẠ chữ số tiếp theo. Trẻ
// lớp 3–5 sợ phép chia chính vì bốn việc này rối vào nhau, nên công cụ phải
// bắt bé làm từng việc một và chấm riêng từng việc.

export type MucDo = 3 | 4 | 5;

/** Một bước của phép chia: hạ một chữ số rồi chia. */
export type BuocChia = {
  /** Chỉ số chữ số của số bị chia đang xét (0 = chữ số cao nhất). */ viTri: number;
  /** Số đang đem chia ở bước này (đã gộp phần dư của bước trước). */ phanChia: number;
  /** Chữ số của thương ở bước này. */ chuSoThuong: number;
  /** Tích: chữ số thương × số chia. */ tich: number;
  /** Phần còn lại sau khi trừ. */ du: number;
};

export type PhepChia = {
  a: number;          // số bị chia
  b: number;          // số chia
  thuong: number;
  du: number;
  buoc: BuocChia[];
  /** Số chữ số của thương — bằng số bước. */ soChuSo: number;
};

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 3, ten: 'Lớp 3', moTa: 'Chia số có hai, ba chữ số cho số có một chữ số' },
  { lop: 4, ten: 'Lớp 4', moTa: 'Chia số có ba, bốn chữ số, có thể còn dư' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Chia cho số có hai chữ số' },
];

/**
 * Dựng các bước chia y như làm trên giấy.
 *
 * Chú ý chỗ dễ sai: chữ số đầu của số bị chia có thể NHỎ HƠN số chia (135 : 4),
 * khi đó phải gộp hai chữ số đầu lại và thương ít hơn một chữ số.
 */
export function dungBuoc(a: number, b: number): BuocChia[] {
  const cs = String(a).split('').map(Number);
  const ra: BuocChia[] = [];
  let con = 0;
  let daBatDau = false;
  for (let i = 0; i < cs.length; i++) {
    con = con * 10 + cs[i];
    const q = Math.floor(con / b);
    // Chưa đủ chia lần nào thì chưa ghi bước — đúng như trên giấy, thương
    // không bắt đầu bằng số 0.
    if (!daBatDau && q === 0) continue;
    daBatDau = true;
    const tich = q * b;
    const du = con - tich;
    ra.push({ viTri: i, phanChia: con, chuSoThuong: q, tich, du });
    con = du;
  }
  return ra;
}

export function raPhepChia(lop: MucDo): PhepChia {
  for (let lan = 0; lan < 200; lan++) {
    const b = lop === 5 ? nn(11, 49) : nn(2, 9);
    const soChuSoA = lop === 3 ? nn(2, 3) : lop === 4 ? nn(3, 4) : nn(3, 4);
    const a = nn(10 ** (soChuSoA - 1), 10 ** soChuSoA - 1);
    if (a < b * 2) continue;
    const thuong = Math.floor(a / b);
    const du = a % b;
    // Lớp 3 học chia hết trước, để bé quen nhịp bốn việc đã.
    if (lop === 3 && du !== 0) continue;
    const buoc = dungBuoc(a, b);
    if (!buoc.length) continue;
    if (buoc.length > 4) continue;   // dài quá thì bé nản
    return { a, b, thuong, du, buoc, soChuSo: buoc.length };
  }
  // Đề dự phòng, chắc chắn hợp lệ.
  const a = 84, b = 4;
  return { a, b, thuong: 21, du: 0, buoc: dungBuoc(a, b), soChuSo: 2 };
}

/** Lời nhắc cho đúng việc bé làm sai ở một bước. */
export function nhacBuoc(p: PhepChia, i: number, viec: 'thuong' | 'tich' | 'du'): string {
  const bu = p.buoc[i];
  const ten = ['thứ nhất', 'thứ hai', 'thứ ba', 'thứ tư'][i] ?? `thứ ${i + 1}`;
  if (viec === 'thuong') {
    return `Bước ${ten}: lấy ${bu.phanChia} chia ${p.b}. Hỏi ${p.b} nhân mấy thì gần ${bu.phanChia} nhất mà không vượt quá — đó là ${bu.chuSoThuong}, vì ${p.b} × ${bu.chuSoThuong} = ${bu.tich}${bu.tich + p.b <= bu.phanChia ? '' : ` còn ${p.b} × ${bu.chuSoThuong + 1} = ${(bu.chuSoThuong + 1) * p.b} đã vượt`}.`;
  }
  if (viec === 'tich') {
    return `Bước ${ten}: nhân ngược lại để biết đã lấy đi bao nhiêu — ${bu.chuSoThuong} × ${p.b} = ${bu.tich}.`;
  }
  return `Bước ${ten}: trừ để xem còn lại bao nhiêu — ${bu.phanChia} − ${bu.tich} = ${bu.du}. Số dư luôn phải NHỎ HƠN số chia (${p.b}); nếu lớn hơn hoặc bằng thì thương đã ước lượng thiếu.`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi số dư ≥ số chia, ghép ngược các bước
 * không ra số ban đầu, thương bắt đầu bằng 0, và mức lớp sai quy định.
 */
export function kiemChia() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const p = raPhepChia(lop);
      if (p.b === 0) loi.push(`Lớp ${lop}: số chia bằng 0`);
      if (p.thuong * p.b + p.du !== p.a) loi.push(`Lớp ${lop}: ${p.a} : ${p.b} ghép ngược không khớp`);
      if (p.du >= p.b) loi.push(`Lớp ${lop}: số dư ${p.du} không nhỏ hơn số chia ${p.b}`);
      if (lop === 3 && p.du !== 0) loi.push('Lớp 3 chỉ học chia hết');
      if (lop === 5 && p.b < 10) loi.push('Lớp 5 phải chia cho số có hai chữ số');
      if (lop <= 4 && p.b > 9) loi.push(`Lớp ${lop} chỉ chia cho số có một chữ số`);

      const ghep = Number(p.buoc.map((b) => b.chuSoThuong).join(''));
      if (ghep !== p.thuong) loi.push(`Lớp ${lop}: ghép chữ số thương ra ${ghep}, khác thương ${p.thuong}`);
      if (p.buoc[0]?.chuSoThuong === 0) loi.push(`Lớp ${lop}: thương bắt đầu bằng 0`);
      for (const [j, b] of p.buoc.entries()) {
        if (b.tich !== b.chuSoThuong * p.b) loi.push(`Lớp ${lop}: bước ${j} tính tích sai`);
        if (b.du !== b.phanChia - b.tich) loi.push(`Lớp ${lop}: bước ${j} trừ sai`);
        if (b.du >= p.b) loi.push(`Lớp ${lop}: bước ${j} còn dư ${b.du} ≥ số chia`);
        if (b.chuSoThuong < 0 || b.chuSoThuong > 9) loi.push(`Lớp ${lop}: bước ${j} chữ số thương ngoài 0–9`);
      }
      if (p.buoc[p.buoc.length - 1]?.du !== p.du) loi.push(`Lớp ${lop}: dư ở bước cuối khác dư chung`);
    }
  }
  return { loi: [...new Set(loi)] };
}
