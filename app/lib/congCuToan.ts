// Danh sách CÔNG CỤ TOÁN — một chỗ duy nhất.
//
// Đặt riêng ra đây vì cùng danh sách này xuất hiện ở nhiều nơi: trang tổng
// /hoc-toan, menu đầu trang, trang chủ, sơ đồ trang, khối "học tiếp" cuối mỗi
// công cụ. Trước đây mỗi chỗ chép một bản, thêm một công cụ là phải nhớ sửa
// năm chỗ — kiểu gì cũng sót.

export type CongCuToan = {
  href: string;
  ten: string;
  emoji: string;
  /** Một câu nói rõ bé LÀM GÌ ở đó, không phải khẩu hiệu. */ moTa: string;
  /** Các lớp phù hợp, dùng để lọc theo lứa tuổi. */ lop: number[];
  /** Tông màu để các nơi hiển thị đồng bộ. */ mau: string;
  /** Công cụ mới làm — để gắn nhãn "Mới". */ moi?: boolean;
};

export const CONG_CU_TOAN: CongCuToan[] = [
  {
    href: '/bang-cong-tru', ten: 'Bảng cộng trừ', emoji: '➕', lop: [1, 2], mau: '#f43f5e', moi: true,
    moTa: 'Bảng trong phạm vi 10 và 20, bấm một ô là mọi phép cho cùng kết quả sáng lên.',
  },
  {
    href: '/bang-cuu-chuong', ten: 'Bảng cửu chương', emoji: '✖️', lop: [2, 3, 4, 5], mau: '#f59e0b',
    moTa: 'Học và đố bảng nhân 2 đến 9, có đọc thành tiếng.',
  },
  {
    href: '/dat-tinh', ten: 'Đặt tính rồi tính', emoji: '🧮', lop: [1, 2, 3, 4, 5], mau: '#8b5cf6', moi: true,
    moTa: 'Điền từng chữ số vào cột dọc, có ô ghi số nhớ; máy chấm từng cột và chỉ đúng chỗ sai.',
  },
  {
    href: '/xem-dong-ho', ten: 'Xem đồng hồ', emoji: '🕐', lop: [1, 2, 3, 4, 5], mau: '#2563eb', moi: true,
    moTa: 'Kéo kim đồng hồ để đọc giờ, chỉnh giờ theo đề và tính “mấy phút nữa là mấy giờ”.',
  },
  {
    href: '/phan-so', ten: 'Phân số trực quan', emoji: '🍕', lop: [2, 3, 4, 5], mau: '#f97316', moi: true,
    moTa: 'Tô bánh và thanh dài để hiểu phân số, so sánh và cộng trừ cùng mẫu.',
  },
  {
    href: '/so-do-doan-thang', ten: 'Sơ đồ đoạn thẳng', emoji: '📏', lop: [1, 2, 3, 4, 5], mau: '#16a34a', moi: true,
    moTa: 'Giải toán có lời văn theo hai bước: nhìn sơ đồ chọn phép tính rồi mới tính.',
  },
  {
    href: '/tien-viet-nam', ten: 'Tiền Việt Nam', emoji: '💵', lop: [1, 2, 3, 4, 5], mau: '#0d9488', moi: true,
    moTa: 'Nhận mặt tờ tiền thật, chọn tờ trả đủ và tính tiền được trả lại.',
  },
  {
    href: '/luyen-tinh-nham', ten: 'Luyện tính nhẩm', emoji: '⚡', lop: [1, 2, 3, 4, 5], mau: '#0ea5e9',
    moTa: 'Cộng trừ nhân chia theo mức, có bàn phím số và chế độ tính nhanh 60 giây.',
  },
  {
    href: '/toan-tu-duy', ten: 'Toán tư duy', emoji: '🧠', lop: [1, 2, 3, 4, 5], mau: '#a855f7',
    moTa: 'Câu đố suy luận theo từng lớp: quy luật, tổng – hiệu, giả thiết tạm, tính ngược.',
  },
  {
    href: '/trieu-phu-nhi', ten: 'Triệu Phú Nhí', emoji: '💎', lop: [1, 2, 3, 4, 5], mau: '#eab308',
    moTa: 'Chơi game trả lời câu hỏi Toán leo bậc thang thưởng.',
  },
];

/** Công cụ hợp với một lớp. */
export const congCuTheoLop = (lop: number) => CONG_CU_TOAN.filter((c) => c.lop.includes(lop));

/**
 * Công cụ nên giới thiệu ĐẦU TIÊN cho từng lớp — dùng ở màn chọn lớp trang chủ,
 * nơi chỉ đủ chỗ cho một mục.
 */
export const congCuNoiBat: Record<number, string> = {
  1: '/bang-cong-tru',
  2: '/xem-dong-ho',
  3: '/so-do-doan-thang',
  4: '/phan-so',
  5: '/tien-viet-nam',
};
