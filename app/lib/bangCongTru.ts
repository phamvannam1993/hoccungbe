// Bảng cộng, bảng trừ trong phạm vi 10 và 20.
//
// Vì sao cần: bé lớp 1 phải THUỘC các phép trong 10 (và sau đó là 20) như
// thuộc bảng cửu chương, nếu không thì lên lớp 2 làm phép có nhớ rất chậm.
// Bảng cửu chương đã có sẵn trên trang; phần cộng trừ mới là thứ lớp 1 cần
// trước cả phép nhân.
//
// Điểm khác bảng thường in trong vở: bảng ở đây HIỆN ĐƯỢC QUY LUẬT — chọn một
// tổng thì cả đường chéo sáng lên, bé thấy ngay 3+4, 4+3, 5+2 cùng ra 7.

export type Pham = 10 | 20;
export type Phep = 'cong' | 'tru';

export type O = { a: number; b: number; kq: number };

/** Mọi phép cộng có tổng ≤ phạm vi, sắp theo bảng vuông. */
export function bangCong(pham: Pham): O[][] {
  const n = pham === 10 ? 10 : 10;   // hai số hạng đều 0…10
  return Array.from({ length: n + 1 }, (_, a) =>
    Array.from({ length: n + 1 }, (_, b) => ({ a, b, kq: a + b })),
  );
}

/** Bảng trừ: số bị trừ 0…pham, số trừ 0…10, chỉ giữ hiệu không âm. */
export function bangTru(pham: Pham): O[][] {
  return Array.from({ length: pham + 1 }, (_, a) =>
    Array.from({ length: 11 }, (_, b) => ({ a, b, kq: a - b })),
  );
}

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Sinh một phép để đố. Ẩn số có thể là KẾT QUẢ hoặc MỘT SỐ HẠNG. */
export type CauDo = {
  a: number; b: number; kq: number; phep: Phep;
  /** Chỗ bị ẩn: 'kq' → 3 + 4 = ?; 'b' → 3 + ? = 7. */
  an: 'kq' | 'b';
  dapAn: number;
  chon: number[];
};

const xao = <T,>(ds: T[]) => {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export function raCauDo(pham: Pham, phep: Phep | 'ca-hai', anSoHang = false): CauDo {
  const p: Phep = phep === 'ca-hai' ? (Math.random() < 0.5 ? 'cong' : 'tru') : phep;
  let a: number, b: number, kq: number;
  if (p === 'cong') {
    a = nn(0, pham === 10 ? 10 : 10);
    b = nn(0, Math.min(10, pham - a));
    kq = a + b;
  } else {
    a = nn(1, pham);
    b = nn(0, Math.min(10, a));
    kq = a - b;
  }
  // Ẩn số hạng khó hơn hẳn ẩn kết quả — chỉ bật khi bé chọn chế độ đó.
  const an: 'kq' | 'b' = anSoHang && Math.random() < 0.5 ? 'b' : 'kq';
  const dapAn = an === 'kq' ? kq : b;

  const nhieu = new Set<number>();
  const them = (n: number) => { if (n >= 0 && n <= pham && n !== dapAn) nhieu.add(n); };
  them(dapAn + 1); them(dapAn - 1); them(dapAn + 2); them(dapAn - 2);
  // Lỗi hay gặp: cộng thành trừ và ngược lại.
  them(p === 'cong' ? Math.abs(a - b) : a + b);
  them(dapAn + 10);
  // Nới dần cho đủ 3 đáp án nhiễu: ở phạm vi 10, đáp án 0 hoặc 10 rất nghèo
  // biến thể nên các luật trên có lúc chỉ ra được hai số. Bộ soát đã bắt.
  for (let k = 3; nhieu.size < 3 && k <= pham; k++) { them(dapAn + k); them(dapAn - k); }
  const chon = xao([dapAn, ...xao([...nhieu]).slice(0, 3)]);
  return { a, b, kq, phep: p, an, dapAn, chon };
}

/** Lời giải bám vào mẹo tính, không chỉ nhắc lại đáp án. */
export function meoTinh(c: CauDo): string {
  const { a, b, kq, phep } = c;
  if (phep === 'cong') {
    if (a === b) return `${a} + ${b} là phép ĐÔI: ${a} gấp đôi thành ${kq}. Các phép đôi nên thuộc lòng.`;
    if (a + b === 10) return `${a} + ${b} = 10 — đây là một CẶP BẠN CỦA 10. Thuộc hết 5 cặp bạn của 10 thì cộng trừ nhanh hẳn: 1+9, 2+8, 3+7, 4+6, 5+5.`;
    if (b === 1 || a === 1) return `Cộng thêm 1 chính là đếm tiếp một số: sau ${Math.max(a, b)} là ${kq}.`;
    if (a + b > 10) {
      const bu = 10 - Math.max(a, b);
      return `${a} + ${b} vượt quá 10 nên tách ra cho tròn chục: ${Math.max(a, b)} + ${bu} = 10, còn thừa ${Math.min(a, b) - bu}, vậy 10 + ${Math.min(a, b) - bu} = ${kq}.`;
    }
    return `${a} + ${b} = ${kq}. Bé đếm tiếp từ ${Math.max(a, b)} thêm ${Math.min(a, b)} bước.`;
  }
  if (b === 0) return `Trừ 0 thì giữ nguyên: ${a} − 0 = ${a}.`;
  if (a === b) return `Trừ hết thì còn 0: ${a} − ${b} = 0.`;
  if (a > 10 && b > a - 10) {
    const buoc = a - 10;
    return `${a} − ${b} phải qua mốc 10: bớt ${buoc} cho tròn 10 trước, còn phải bớt tiếp ${b - buoc}, được ${kq}.`;
  }
  return `${a} − ${b} = ${kq}. Nhớ phép cộng ngược lại: ${kq} + ${b} = ${a}.`;
}

/** Năm cặp số cộng lại bằng 10 — thứ bé cần thuộc trước tiên. */
export const CAP_BAN_CUA_10: [number, number][] = [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5]];

/**
 * Soát: 3.000 lượt mỗi phạm vi. Bắt lỗi kết quả âm, vượt phạm vi, đáp án nhiễu
 * trùng đáp án đúng, và ô trong bảng tính sai.
 */
export function kiemBangCongTru() {
  const loi: string[] = [];
  for (const pham of [10, 20] as Pham[]) {
    for (const b of bangCong(pham).flat()) {
      if (b.kq !== b.a + b.b) loi.push(`Bảng cộng ${pham}: ô ${b.a}+${b.b} sai`);
    }
    for (const b of bangTru(pham).flat()) {
      if (b.kq !== b.a - b.b) loi.push(`Bảng trừ ${pham}: ô ${b.a}−${b.b} sai`);
    }
    for (let i = 0; i < 3000; i++) {
      const c = raCauDo(pham, 'ca-hai', true);
      if (c.kq < 0) loi.push(`Phạm vi ${pham}: kết quả âm ${c.a} ${c.phep === 'cong' ? '+' : '−'} ${c.b}`);
      if (c.kq > pham) loi.push(`Phạm vi ${pham}: kết quả ${c.kq} vượt phạm vi`);
      if (c.chon.length !== 4) loi.push(`Phạm vi ${pham}: có ${c.chon.length} đáp án thay vì 4`);
      if (new Set(c.chon).size !== 4) loi.push(`Phạm vi ${pham}: đáp án bị trùng nhau`);
      if (!c.chon.includes(c.dapAn)) loi.push(`Phạm vi ${pham}: thiếu đáp án đúng`);
      const kiemTra = c.phep === 'cong' ? c.a + c.b : c.a - c.b;
      if (kiemTra !== c.kq) loi.push(`Phạm vi ${pham}: phép tính sai kết quả`);
      if (c.an === 'b' && c.dapAn !== c.b) loi.push(`Phạm vi ${pham}: ẩn số hạng nhưng đáp án không phải số hạng`);
    }
  }
  return { loi: [...new Set(loi)] };
}
