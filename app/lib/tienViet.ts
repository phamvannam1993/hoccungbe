// Dữ liệu và luật cho phần "Tiền Việt Nam".
//
// LƯU Ý VỀ HÌNH: tờ tiền trên trang được VẼ CÁCH ĐIỆU (khối màu + con số), cố
// ý không giống tiền thật. Sao chép hình tiền thật lên web là chuyện pháp lý
// phiền phức, mà mục tiêu học ở đây chỉ là nhận ra mệnh giá và cộng trừ tiền.

export type MucDo = 1 | 2 | 3 | 4 | 5;

export type ToTien = {
  gia: number;
  /** Màu chủ đạo, lấy theo tông của tờ tiền thật cho bé dễ liên hệ. */
  mau: string;
  chu: string;
  /** Tiền giấy hay tiền xu (xu gần như không còn dùng, chỉ để nhận biết). */
  loai: 'giay';
  /**
   * Ảnh chụp tờ tiền trong `public/tien-viet/`. Tờ nào CHƯA có ảnh thì trang
   * tự vẽ khối màu thay thế — nhờ vậy thiếu ảnh cũng không vỡ giao diện, và
   * thêm ảnh sau chỉ cần đặt file vào thư mục rồi ghi tên vào đây.
   */
  anh?: string;
};

export const CAC_TO: ToTien[] = [
  { gia: 1000, mau: '#8ab4a0', chu: '#1f3d32', loai: 'giay', anh: '/tien-viet/1k.jpg' },
  { gia: 2000, mau: '#c9a27e', chu: '#3d2a17', loai: 'giay', anh: '/tien-viet/2k.jpg' },
  { gia: 5000, mau: '#9ab0d4', chu: '#1e2f52', loai: 'giay', anh: '/tien-viet/5k.jpg' },
  { gia: 10000, mau: '#c8a86b', chu: '#3a2c10', loai: 'giay', anh: '/tien-viet/10k.jpg' },
  { gia: 20000, mau: '#96bfd6', chu: '#123b52', loai: 'giay', anh: '/tien-viet/20k.jpg' },
  { gia: 50000, mau: '#d9a7bb', chu: '#4a2233', loai: 'giay', anh: '/tien-viet/50k.jpg' },
  { gia: 100000, mau: '#9fc7a8', chu: '#1d3a26', loai: 'giay', anh: '/tien-viet/100k.jpg' },
  { gia: 200000, mau: '#c2a6d4', chu: '#331f45', loai: 'giay', anh: '/tien-viet/200k.jpg' },
  { gia: 500000, mau: '#a9c3e0', chu: '#16304f', loai: 'giay', anh: '/tien-viet/500k.jpg' },
];

/** Các tờ CHƯA có ảnh — dùng để nhắc khi cần bổ sung file vào public/tien-viet. */
export const TO_THIEU_ANH = CAC_TO.filter((t) => !t.anh).map((t) => t.gia);

export const MUC_DO: { lop: MucDo; ten: string; moTa: string; toiDa: number }[] = [
  { lop: 1, ten: 'Lớp 1', moTa: 'Nhận biết tờ 1.000 đến 10.000 đồng', toiDa: 10000 },
  { lop: 2, ten: 'Lớp 2', moTa: 'Tiền tới 20.000 đồng, tập trả tiền đủ', toiDa: 20000 },
  { lop: 3, ten: 'Lớp 3', moTa: 'Tiền tới 100.000 đồng, tính tiền thừa', toiDa: 100000 },
  { lop: 4, ten: 'Lớp 4', moTa: 'Tiền tới 200.000 đồng, mua nhiều món', toiDa: 200000 },
  { lop: 5, ten: 'Lớp 5', moTa: 'Tiền tới 500.000 đồng', toiDa: 500000 },
];

export const MON_HANG: { ten: string; emoji: string; gia: number }[] = [
  { ten: 'cái bút chì', emoji: '✏️', gia: 3000 },
  { ten: 'quyển vở', emoji: '📓', gia: 7000 },
  { ten: 'cục tẩy', emoji: '🧽', gia: 2000 },
  { ten: 'hộp sữa', emoji: '🥛', gia: 8000 },
  { ten: 'ổ bánh mì', emoji: '🥖', gia: 15000 },
  { ten: 'quả táo', emoji: '🍎', gia: 6000 },
  { ten: 'cây kem', emoji: '🍦', gia: 12000 },
  { ten: 'quyển truyện', emoji: '📚', gia: 25000 },
  { ten: 'hộp bút màu', emoji: '🖍️', gia: 35000 },
  { ten: 'cái cặp sách', emoji: '🎒', gia: 120000 },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];

/** Viết số tiền có dấu chấm ngăn nghìn: 15.000 đồng. */
export const vietTien = (n: number) => `${n.toLocaleString('vi-VN')} đồng`;

/** Đọc thành lời cho máy phát âm — tránh máy đọc "15.000" thành "mười lăm chấm không". */
export function docTien(n: number): string {
  if (n >= 1000 && n % 1000 === 0) return `${(n / 1000).toLocaleString('vi-VN')} nghìn đồng`;
  return `${n.toLocaleString('vi-VN')} đồng`;
}

export const toTheoLop = (lop: MucDo) => CAC_TO.filter((t) => t.gia <= MUC_DO.find((m) => m.lop === lop)!.toiDa);

/**
 * Tách một số tiền thành ít tờ nhất (thuật toán tham lam — với bộ mệnh giá
 * Việt Nam thì tham lam luôn cho kết quả ít tờ nhất).
 */
export function traTien(soTien: number, lop: MucDo): number[] {
  const ds = toTheoLop(lop).map((t) => t.gia).sort((a, b) => b - a);
  const ra: number[] = [];
  let con = soTien;
  for (const g of ds) {
    while (con >= g) { ra.push(g); con -= g; }
  }
  return con === 0 ? ra : [];
}

/** Số tiền đẹp, trả được bằng các tờ của lớp đó. */
export function raSoTien(lop: MucDo): number {
  const { toiDa } = MUC_DO.find((m) => m.lop === lop)!;
  const buoc = lop <= 2 ? 1000 : 1000;
  for (let i = 0; i < 60; i++) {
    const n = nn(1, Math.floor(toiDa / buoc)) * buoc;
    const to = traTien(n, lop);
    // Không lấy số cần quá nhiều tờ: bé lớp 1, 2 đếm 9 tờ là nản.
    if (to.length && to.length <= (lop <= 2 ? 4 : 6)) return n;
  }
  return buoc;
}

export type BaiMua = {
  mon: { ten: string; emoji: string; gia: number }[];
  phaiTra: number;
  dua: number;
  thoi: number;
};

/** Bài mua hàng: mua 1–2 món, đưa một tờ chẵn, tính tiền thối. */
export function raBaiMua(lop: MucDo): BaiMua {
  const { toiDa } = MUC_DO.find((m) => m.lop === lop)!;
  const soMon = lop >= 4 ? nn(1, 2) : 1;
  const mon = Array.from({ length: soMon }, () => chon(MON_HANG.filter((m) => m.gia <= toiDa / 2)));
  const phaiTra = mon.reduce((s, m) => s + m.gia, 0);
  // Đưa một tờ (hoặc vài tờ) đủ lớn, chọn sao cho tiền thối vẫn trả được.
  const ds = toTheoLop(lop).map((t) => t.gia).filter((g) => g > phaiTra);
  const dua = ds.length ? ds[0] : Math.ceil(phaiTra / 10000) * 10000;
  return { mon, phaiTra, dua, thoi: dua - phaiTra };
}

/**
 * Đáp án nhiễu cho bài tính tiền: lỗi hay gặp nhất là lệch một hàng số 0
 * (nhầm 5.000 với 50.000), nên đó là đáp án sai đầu tiên được dựng ra.
 */
export function nhieuSoTien(dung: number): number[] {
  const ra: number[] = [];
  const them = (n: number) => {
    if (n > 0 && n !== dung && Number.isInteger(n) && !ra.includes(n)) ra.push(n);
  };
  them(dung * 10);        // thừa một số 0
  them(dung / 10);        // thiếu một số 0
  them(dung + 1000);
  them(dung - 1000);
  them(dung + 10000);
  for (let k = 2; ra.length < 3 && k <= 9; k++) {
    them(dung + k * 1000);
    them(dung - k * 1000);
  }
  return ra.slice(0, 3);
}

/**
 * Soát: 2.000 lượt mỗi lớp. Bắt các lỗi tiền âm, số tiền không trả được bằng
 * bộ tờ của lớp đó, tiền thối âm, mệnh giá vượt mức của lớp.
 */
export function kiemTien() {
  const loi: string[] = [];
  for (const { lop, toiDa } of MUC_DO) {
    for (let i = 0; i < 2000; i++) {
      const n = raSoTien(lop);
      if (n <= 0 || n > toiDa) loi.push(`Lớp ${lop}: số tiền ${n} nằm ngoài 0–${toiDa}`);
      const to = traTien(n, lop);
      if (!to.length) loi.push(`Lớp ${lop}: ${n} không trả được bằng các tờ đang có`);
      if (to.reduce((s, x) => s + x, 0) !== n) loi.push(`Lớp ${lop}: tách tờ sai cho ${n}`);
      if (to.some((g) => g > toiDa)) loi.push(`Lớp ${lop}: dùng tờ vượt mức`);

      const b = raBaiMua(lop);
      if (b.thoi < 0) loi.push(`Lớp ${lop}: tiền thối âm (${b.dua} − ${b.phaiTra})`);
      if (b.dua <= b.phaiTra) loi.push(`Lớp ${lop}: đưa ${b.dua} không đủ trả ${b.phaiTra}`);
      if (!b.mon.length) loi.push(`Lớp ${lop}: bài mua hàng không có món nào`);

      const nhieu = nhieuSoTien(b.thoi || 1000);
      if (nhieu.length < 3) loi.push(`Lớp ${lop}: chỉ tạo được ${nhieu.length} đáp án nhiễu`);
    }
  }
  return { loi: [...new Set(loi)] };
}
