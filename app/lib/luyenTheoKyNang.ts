// Nối KỸ NĂNG YẾU với CHỖ LUYỆN tương ứng.
//
// Báo cáo tuần trước đây chỉ nêu tên kỹ năng yếu rồi thôi — ba mẹ đọc xong
// không biết cho con luyện ở đâu. Bảng này trả lời đúng câu hỏi đó: "sai chỗ
// này thì vào trang nào?".
//
// Khớp theo TỪ KHOÁ trong tên kỹ năng chứ không khớp cứng cả chuỗi: tên kỹ
// năng trong cơ sở dữ liệu có thể đổi cách viết ("Thời gian & xem giờ" thành
// "Thời gian và xem giờ") mà vẫn phải tìm ra đúng chỗ luyện.

export type ChoLuyen = { href: string; ten: string; emoji: string };

type Luat = { tuKhoa: string[]; cho: ChoLuyen };

const LUAT: Luat[] = [
  { tuKhoa: ['xem giờ', 'thời gian', 'đồng hồ'], cho: { href: '/xem-dong-ho', ten: 'Xem đồng hồ', emoji: '🕐' } },
  { tuKhoa: ['phân số', 'tỉ số', 'phần trăm'], cho: { href: '/phan-so', ten: 'Phân số trực quan', emoji: '🍕' } },
  { tuKhoa: ['thập phân'], cho: { href: '/so-thap-phan', ten: 'Số thập phân', emoji: '🔟' } },
  { tuKhoa: ['lời văn', 'giải toán', 'chuyển động'], cho: { href: '/so-do-doan-thang', ten: 'Sơ đồ đoạn thẳng', emoji: '📏' } },
  { tuKhoa: ['đo lường', 'đơn vị'], cho: { href: '/do-luong', ten: 'Đo lường', emoji: '📐' } },
  { tuKhoa: ['chu vi', 'diện tích', 'thể tích'], cho: { href: '/chu-vi-dien-tich', ten: 'Chu vi & diện tích', emoji: '📏' } },
  { tuKhoa: ['thống kê', 'biểu đồ'], cho: { href: '/bieu-do', ten: 'Biểu đồ', emoji: '📊' } },
  { tuKhoa: ['hình học', 'hình'], cho: { href: '/hinh-hoc', ten: 'Hình học', emoji: '🔷' } },
  { tuKhoa: ['tiền'], cho: { href: '/tien-viet-nam', ten: 'Tiền Việt Nam', emoji: '💵' } },
  { tuKhoa: ['chưa biết', 'tìm x', 'thành phần'], cho: { href: '/tim-x', ten: 'Tìm x', emoji: '⚖️' } },
  { tuKhoa: ['nhân'], cho: { href: '/bang-cuu-chuong', ten: 'Bảng cửu chương', emoji: '✖️' } },
  { tuKhoa: ['chia'], cho: { href: '/dat-tinh', ten: 'Đặt tính rồi tính', emoji: '🧮' } },
  { tuKhoa: ['cộng', 'trừ'], cho: { href: '/bang-cong-tru', ten: 'Bảng cộng trừ', emoji: '➕' } },
  { tuKhoa: ['đếm', 'so sánh', 'thứ tự số'], cho: { href: '/tro-choi/dem-so', ten: 'Tập đếm số', emoji: '🔢' } },
  { tuKhoa: ['tư duy'], cho: { href: '/toan-tu-duy', ten: 'Toán tư duy', emoji: '🧠' } },

  // Tiếng Việt
  { tuKhoa: ['chính tả'], cho: { href: '/chinh-ta-tieng-viet', ten: 'Chính tả', emoji: '✍️' } },
  { tuKhoa: ['đọc hiểu', 'tập đọc'], cho: { href: '/tap-doc-tieng-viet', ten: 'Tập đọc', emoji: '📖' } },
  { tuKhoa: ['từ và câu', 'luyện từ', 'ngữ pháp'], cho: { href: '/luyen-tu-va-cau', ten: 'Luyện từ và câu', emoji: '🔤' } },
  { tuKhoa: ['vần', 'âm'], cho: { href: '/vong-tron-am', ten: 'Vòng tròn âm vần', emoji: '🎡' } },
  { tuKhoa: ['viết', 'tập làm văn'], cho: { href: '/tap-lam-van', ten: 'Tập làm văn', emoji: '📝' } },

  // Tiếng Anh
  { tuKhoa: ['từ vựng'], cho: { href: '/vong-tu-vung', ten: 'Vòng tròn từ vựng', emoji: '🎡' } },
  { tuKhoa: ['phát âm', 'ipa'], cho: { href: '/bang-phien-am-ipa', ten: 'Bảng phiên âm IPA', emoji: '🔤' } },
  { tuKhoa: ['nghe'], cho: { href: '/nghe-chon-hinh', ten: 'Nghe chọn hình', emoji: '🎧' } },
];

/** Chỗ luyện theo môn, dùng khi không khớp từ khoá nào. */
const DU_PHONG: Record<string, ChoLuyen> = {
  math: { href: '/hoc-toan', ten: 'Bộ công cụ Toán', emoji: '🔢' },
  language: { href: '/luyen-tu-va-cau', ten: 'Luyện từ và câu', emoji: '🔤' },
  english: { href: '/tu-vung-tieng-anh', ten: 'Từ vựng tiếng Anh', emoji: '📚' },
};

const bo = (s: string) => s.toLowerCase().normalize('NFC').trim();

export function choLuyen(tenKyNang: string, mon?: string): ChoLuyen {
  const t = bo(tenKyNang);
  for (const l of LUAT) {
    if (l.tuKhoa.some((k) => t.includes(k))) return l.cho;
  }
  return DU_PHONG[mon ?? ''] ?? DU_PHONG.math;
}

/** Lời khuyên ngắn cho ba mẹ, bám vào mức đúng hiện tại. */
export function loiKhuyen(phanTram: number, soCau: number): string {
  if (soCau < 5) return 'Bé mới làm vài câu ở phần này nên chưa đủ để kết luận — cho bé làm thêm rồi xem lại.';
  if (phanTram < 40) return 'Phần này bé chưa nắm được, nên học lại từ đầu bằng công cụ trực quan chứ đừng làm thêm bài tập.';
  if (phanTram < 60) return 'Bé hiểu lõm bõm — làm cùng bé vài bài đầu, hỏi bé giải thích cách làm.';
  if (phanTram < 80) return 'Bé làm được nhưng còn sai vặt, luyện thêm cho quen tay là ổn.';
  return 'Phần này bé khá vững rồi.';
}
