// Dữ liệu và luật cho phần "Xem đồng hồ".
//
// Mức độ bám đúng thứ tự sách giáo khoa tiểu học: lớp 1 chỉ giờ đúng, lớp 2
// thêm giờ rưỡi và 15 phút, lớp 3 bước 5 phút, lớp 4–5 phút lẻ và giờ 24 giờ.
// Nhờ vậy bé lớp 1 không gặp "6 giờ 37 phút" ngay bài đầu.

export type MucDo = 1 | 2 | 3 | 4 | 5;

export type Gio = { gio: number; phut: number };

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; buoc: number }[] = [
  { lop: 1, ten: 'Lớp 1', moTa: 'Giờ đúng — kim phút luôn chỉ số 12', buoc: 60 },
  { lop: 2, ten: 'Lớp 2', moTa: 'Thêm giờ rưỡi và 15 phút', buoc: 15 },
  { lop: 3, ten: 'Lớp 3', moTa: 'Bước 5 phút — đọc theo từng vạch số', buoc: 5 },
  { lop: 4, ten: 'Lớp 4', moTa: 'Phút lẻ bất kỳ', buoc: 1 },
  { lop: 5, ten: 'Lớp 5', moTa: 'Phút lẻ và cách nói giờ 24 giờ', buoc: 1 },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Sinh một mốc giờ hợp với mức độ. */
export function raGio(lop: MucDo): Gio {
  const buoc = MUC_DO.find((m) => m.lop === lop)!.buoc;
  const gio = nn(1, 12);
  if (buoc === 60) return { gio, phut: 0 };
  // Lớp 2 học giờ đúng / rưỡi / 15 phút, chưa học các mốc 5 phút khác.
  if (buoc === 15) return { gio, phut: [0, 15, 30, 45][nn(0, 3)] };
  // Math.floor cho cận trên: 59/5 = 11,8 mà nn nhận cận trên lẻ thì có lần ra
  // 12 → 60 phút, tức là "7 giờ 60 phút". Lỗi này đã bị bộ soát bắt.
  return { gio, phut: nn(0, Math.floor(59 / buoc)) * buoc };
}

/** "8 giờ 5 phút", "3 giờ rưỡi", "9 giờ kém 10". */
export function docGio(g: Gio, kieu: 'day-du' | 'dan-da' = 'day-du'): string {
  const { gio, phut } = g;
  if (phut === 0) return `${gio} giờ đúng`;
  if (kieu === 'dan-da') {
    if (phut === 30) return `${gio} giờ rưỡi`;
    if (phut > 30) return `${gio === 12 ? 1 : gio + 1} giờ kém ${60 - phut}`;
  }
  return `${gio} giờ ${phut} phút`;
}

/** Cách nói 24 giờ: "14 giờ 30" — lớp 5 mới học. */
export function doc24(g: Gio, chieu: boolean): string {
  const gio = chieu ? (g.gio === 12 ? 12 : g.gio + 12) : g.gio === 12 ? 0 : g.gio;
  return `${gio} giờ${g.phut ? ` ${g.phut} phút` : ''}`;
}

/** Góc của kim, tính từ vạch 12 theo chiều kim đồng hồ. */
export const gocKimPhut = (g: Gio) => g.phut * 6;
export const gocKimGio = (g: Gio) => (g.gio % 12) * 30 + g.phut * 0.5;

/** Từ góc kim ngược về số giờ / số phút, làm tròn theo bước của mức độ. */
export function phutTuGoc(goc: number, buoc: number): number {
  const p = Math.round((((goc % 360) + 360) % 360) / 6);
  const b = Math.max(1, Math.min(buoc, 60));
  return (Math.round(p / b) * b) % 60;
}
export function gioTuGoc(goc: number): number {
  const h = Math.round((((goc % 360) + 360) % 360) / 30) % 12;
  return h === 0 ? 12 : h;
}

/** Hai mốc giờ có trùng nhau không (dùng để chấm bài). */
export const bang = (a: Gio, b: Gio) => a.gio % 12 === b.gio % 12 && a.phut === b.phut;

/** Cộng thêm phút, trả về mốc giờ mới — dùng cho dạng "còn bao lâu nữa". */
export function cong(g: Gio, phut: number): Gio {
  const tong = ((g.gio % 12) * 60 + g.phut + phut + 720 * 10) % 720;
  const gio = Math.floor(tong / 60) || 12;
  return { gio, phut: tong % 60 };
}

/** Khoảng cách từ a đến b theo chiều kim đồng hồ, tính bằng phút. */
export function khoangCach(a: Gio, b: Gio): number {
  const pa = (a.gio % 12) * 60 + a.phut;
  const pb = (b.gio % 12) * 60 + b.phut;
  return ((pb - pa) + 720) % 720;
}

/** Đáp án nhiễu: lệch đúng những chỗ trẻ hay nhầm, không bốc ngẫu nhiên. */
export function dapAnNhieu(dung: Gio, lop: MucDo): Gio[] {
  const buoc = MUC_DO.find((m) => m.lop === lop)!.buoc;
  const ra: Gio[] = [];
  const them = (g: Gio) => {
    if (!bang(g, dung) && !ra.some((x) => bang(x, g))) ra.push(g);
  };
  // 1. Đọc nhầm kim giờ sang giờ kế tiếp — lỗi phổ biến nhất khi kim giờ đã
  //    đi quá nửa vạch.
  them({ gio: (dung.gio % 12) + 1, phut: dung.phut });
  // 2. Đổi chỗ kim giờ và kim phút.
  if (dung.phut % 5 === 0) them({ gio: (dung.phut / 5 || 12), phut: (dung.gio % 12) * 5 });
  // 3. Lệch một vạch.
  // 3. Lệch quanh đáp án đúng. Nới dần khoảng lệch cho tới khi đủ ba đáp án:
  //    giờ đúng ở lớp 1 chỉ có mỗi kim giờ để lệch, nên hai luật trên không
  //    đủ — bộ soát đã bắt được đúng trường hợp "12 giờ đúng".
  const donVi = buoc === 60 ? 60 : Math.max(buoc, 5);
  for (let k = 1; ra.length < 3 && k <= 6; k++) {
    them(cong(dung, donVi * k));
    them(cong(dung, -donVi * k));
  }
  return ra.slice(0, 3);
}

/**
 * Soát luật sinh giờ: mỗi mức độ chỉ được ra những mốc phút mà lớp đó đã học.
 * Chạy 2.000 lần cho mỗi lớp — sai luật là lộ ra ngay, không phải ngồi thử tay.
 */
export function kiemDongHo() {
  const loi: string[] = [];
  const chophep: Record<MucDo, (p: number) => boolean> = {
    1: (p) => p === 0,
    2: (p) => [0, 15, 30, 45].includes(p),
    3: (p) => p % 5 === 0,
    4: () => true,
    5: () => true,
  };
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 2000; i++) {
      const g = raGio(lop);
      if (g.gio < 1 || g.gio > 12) loi.push(`Lớp ${lop}: giờ ${g.gio} nằm ngoài 1–12`);
      if (g.phut < 0 || g.phut > 59) loi.push(`Lớp ${lop}: phút ${g.phut} nằm ngoài 0–59`);
      if (!chophep[lop](g.phut)) loi.push(`Lớp ${lop}: chưa học mốc ${g.phut} phút`);
      const nhieu = dapAnNhieu(g, lop);
      if (nhieu.length < 3) loi.push(`Lớp ${lop}: ${docGio(g)} chỉ tạo được ${nhieu.length} đáp án nhiễu`);
      if (nhieu.some((x) => bang(x, g))) loi.push(`Lớp ${lop}: đáp án nhiễu trùng đáp án đúng`);
    }
  }
  return { loi: [...new Set(loi)] };
}
