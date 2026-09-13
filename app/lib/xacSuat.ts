// Xác suất ở mức tiểu học: chắc chắn – có thể – không thể, và khả năng nhiều/ít.
//
// Chương trình mới có phần này từ lớp 2, nhưng dạy bằng lời thì rất dễ thành
// học vẹt ("trong hộp không có bóng vàng nên không thể"). Cách hiểu thật là
// RÚT THỬ NHIỀU LẦN rồi nhìn kết quả: màu nào nhiều bóng thì hay ra hơn, màu
// không có thì không bao giờ ra. Vì vậy công cụ cho bé bấm rút thật.

export type MucDo = 2 | 3 | 4 | 5;

export type Bong = { ma: string; ten: string; mau: string; so: number };

// Bốn màu cố ý chọn KHÁC HẲN NHAU về tên gọi lẫn sắc độ.
//
// Trước đây dùng "xanh" và "lục" — tiếng Việt gọi cả hai là xanh, bé nghe câu
// hỏi "lấy được quả xanh" là không biết hỏi màu nào. Đổi lục thành TÍM thì
// bốn tên đỏ – xanh – vàng – tím không còn chỗ nào lẫn được.
export const MAU_BONG: { ma: string; ten: string; mau: string }[] = [
  { ma: 'do', ten: 'đỏ', mau: '#ef4444' },
  { ma: 'xanh', ten: 'xanh', mau: '#3b82f6' },
  { ma: 'vang', ten: 'vàng', mau: '#eab308' },
  { ma: 'tim', ten: 'tím', mau: '#a855f7' },
];

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 2, ten: 'Lớp 2', moTa: 'Chắc chắn – có thể – không thể, hộp ít bóng' },
  { lop: 3, ten: 'Lớp 3', moTa: 'Thêm so sánh khả năng nhiều hơn, ít hơn' },
  { lop: 4, ten: 'Lớp 4', moTa: 'Hộp nhiều màu, rút thử để kiểm chứng' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Nhiều bóng hơn, kết luận từ kết quả rút thử' },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export type KetLuan = 'chac-chan' | 'co-the' | 'khong-the';

export const TEN_KET_LUAN: Record<KetLuan, string> = {
  'chac-chan': 'Chắc chắn',
  'co-the': 'Có thể',
  'khong-the': 'Không thể',
};

/** Hộp bóng: tổng số bóng và số bóng mỗi màu. */
export type Hop = { bong: Bong[]; tong: number };

export function raHop(lop: MucDo, soMau?: number): Hop {
  const n = soMau ?? (lop <= 2 ? nn(1, 2) : lop === 3 ? nn(2, 3) : nn(2, 4));
  const mau = xao(MAU_BONG).slice(0, n);
  const toiDa = lop <= 2 ? 4 : lop === 3 ? 5 : 6;
  const bong = mau.map((m) => ({ ...m, so: nn(1, toiDa) }));
  return { bong, tong: bong.reduce((s, b) => s + b.so, 0) };
}

/** Kết luận đúng cho mệnh đề "lấy được bóng màu X". */
export function ketLuanCho(hop: Hop, maMau: string): KetLuan {
  const co = hop.bong.find((b) => b.ma === maMau);
  if (!co || co.so === 0) return 'khong-the';
  return co.so === hop.tong ? 'chac-chan' : 'co-the';
}

export type BaiKhaNang = { hop: Hop; maMau: string; tenMau: string; dapAn: KetLuan };

export function raBaiKhaNang(lop: MucDo): BaiKhaNang {
  for (let lan = 0; lan < 100; lan++) {
    // Một phần ba số bài dùng hộp CHỈ MỘT MÀU, để dạng "chắc chắn" và "không
    // thể" xuất hiện đủ nhiều — hộp nhiều màu thì hầu như lúc nào cũng ra "có
    // thể", bé trả lời máy móc là trúng.
    const hop = raHop(lop, Math.random() < 0.34 ? 1 : undefined);
    const hoi = chon(MAU_BONG).ma;
    const dapAn = ketLuanCho(hop, hoi);
    // Bỏ hộp một màu mà lại hỏi đúng màu đó ở lớp 2 thì quá dễ; vẫn giữ một ít.
    if (lop >= 3 && hop.bong.length === 1 && dapAn === 'chac-chan' && Math.random() < 0.5) continue;
    return { hop, maMau: hoi, tenMau: MAU_BONG.find((m) => m.ma === hoi)!.ten, dapAn };
  }
  const hop = raHop(lop, 2);
  return { hop, maMau: hop.bong[0].ma, tenMau: hop.bong[0].ten, dapAn: 'co-the' };
}

export type BaiSoSanh = { hop: Hop; dapAn: string; chon: string[] };

/** So sánh khả năng: màu nào dễ lấy được nhất. */
export function raBaiSoSanh(lop: MucDo): BaiSoSanh {
  for (let lan = 0; lan < 100; lan++) {
    const hop = raHop(lop, lop <= 3 ? 2 : nn(2, 3));
    const max = Math.max(...hop.bong.map((b) => b.so));
    // Hai màu bằng nhau thì câu hỏi có hai đáp án đúng — bỏ.
    if (hop.bong.filter((b) => b.so === max).length > 1) continue;
    const dung = hop.bong.find((b) => b.so === max)!;
    return { hop, dapAn: dung.ten, chon: xao(hop.bong.map((b) => b.ten)) };
  }
  const hop: Hop = { bong: [{ ...MAU_BONG[0], so: 3 }, { ...MAU_BONG[1], so: 1 }], tong: 4 };
  return { hop, dapAn: 'đỏ', chon: ['đỏ', 'xanh'] };
}

/** Rút ngẫu nhiên một quả — dùng cho phần thử nghiệm. */
export function rutMot(hop: Hop): Bong {
  let k = nn(1, hop.tong);
  for (const b of hop.bong) {
    k -= b.so;
    if (k <= 0) return b;
  }
  return hop.bong[hop.bong.length - 1];
}

export function giaiThich(hop: Hop, tenMau: string, kl: KetLuan): string {
  const co = hop.bong.find((b) => b.ten === tenMau);
  const dem = hop.bong.map((b) => `${b.so} quả ${b.ten}`).join(', ');
  if (kl === 'khong-the') {
    return `Trong hộp có ${dem} — KHÔNG có quả ${tenMau} nào, nên lấy được quả ${tenMau} là chuyện không thể xảy ra.`;
  }
  if (kl === 'chac-chan') {
    return `Cả ${hop.tong} quả trong hộp đều màu ${tenMau}, lấy quả nào cũng là ${tenMau} — nên chắc chắn xảy ra.`;
  }
  return `Trong hộp có ${dem}. Có ${co?.so} quả ${tenMau} trên tổng ${hop.tong} quả, nên lấy được quả ${tenMau} là CÓ THỂ — không chắc chắn vì còn màu khác, cũng không phải không thể vì màu này có trong hộp.`;
}

/**
 * Soát: 3.000 lượt mỗi lớp. Bắt lỗi hộp rỗng, kết luận sai so với số bóng
 * thật, câu so sánh có hai đáp án đúng, và rút thử ra màu không có trong hộp.
 */
export function kiemXacSuat() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 3000; i++) {
      const k = raBaiKhaNang(lop);
      if (k.hop.tong <= 0) loi.push(`Lớp ${lop}: hộp không có quả nào`);
      if (k.hop.bong.some((b) => b.so <= 0)) loi.push(`Lớp ${lop}: có màu ghi 0 quả`);
      if (k.hop.tong !== k.hop.bong.reduce((s, b) => s + b.so, 0)) loi.push(`Lớp ${lop}: tổng số quả không khớp`);
      const dung = ketLuanCho(k.hop, k.maMau);
      if (dung !== k.dapAn) loi.push(`Lớp ${lop}: kết luận ghi ${k.dapAn}, đúng phải là ${dung}`);
      // "Chắc chắn" chỉ đúng khi hộp chỉ có duy nhất màu đó.
      if (k.dapAn === 'chac-chan' && k.hop.bong.length !== 1) loi.push(`Lớp ${lop}: nói chắc chắn dù hộp có nhiều màu`);
      if (k.dapAn === 'khong-the' && k.hop.bong.some((b) => b.ma === k.maMau)) loi.push(`Lớp ${lop}: nói không thể dù hộp có màu đó`);

      const s = raBaiSoSanh(lop);
      const max = Math.max(...s.hop.bong.map((b) => b.so));
      if (s.hop.bong.filter((b) => b.so === max).length > 1) loi.push(`Lớp ${lop}: hai màu cùng nhiều nhất`);
      if (s.dapAn !== s.hop.bong.find((b) => b.so === max)!.ten) loi.push(`Lớp ${lop}: đáp án so sánh sai`);
      if (new Set(s.chon).size !== s.chon.length) loi.push(`Lớp ${lop}: đáp án so sánh trùng nhau`);

      const r = rutMot(k.hop);
      if (!k.hop.bong.some((b) => b.ma === r.ma)) loi.push(`Lớp ${lop}: rút ra màu không có trong hộp`);
    }
  }
  return { loi: [...new Set(loi)] };
}
