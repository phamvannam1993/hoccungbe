// ẢNH CHO TỪ trong vòng tròn âm vần — có ảnh thì dùng ảnh, không thì dùng emoji.
//
// Ảnh do admin tải lên ở /admin/am-van, lưu chung bảng `vocab_images` với ảnh từ
// vựng tiếng Anh. Dùng chung bảng vì cấu trúc y hệt (một khoá chữ → một URL ảnh),
// nên không phải tạo bảng mới. Khoá mang tiền tố "am-van:" để hai loại không đụng nhau.

/**
 * Khoá ảnh của một từ — GIỮ NGUYÊN chữ tiếng Việt có dấu:
 *     "cà" → "am-van:cà"      "cá" → "am-van:cá"
 *     "cầu vồng" → "am-van:cầu-vồng"
 *
 * Chuẩn hoá NFC để hai cách gõ cùng một chữ ("ề" một ký tự hay "e" + dấu huyền)
 * luôn ra cùng một chuỗi byte — nếu không, cùng một từ có thể sinh hai khoá khác
 * nhau tuỳ nguồn nhập.
 *
 * ĐIỀU KIỆN Ở DATABASE: cột `vocab_images.wordId` phải dùng đối chiếu utf8mb4_bin.
 * Đối chiếu mặc định utf8mb4_unicode_ci coi "cà" và "cá" là MỘT (đã kiểm trên máy
 * chủ: SELECT 'cà'='cá' trả về 1), mà wordId lại là khoá chính — nên hai từ khác
 * nhau sẽ đè ảnh của nhau. Chạy `node scripts/khoa-anh-giu-dau.cjs --apply` bên
 * api-hoccungbe để đổi đối chiếu; đã chạy trên máy chủ hiện tại.
 */
export function slugTu(tu: string): string {
  return tu.normalize('NFC').toLowerCase().trim().replace(/\s+/g, '-');
}

/** Khoá ảnh của một từ trong bảng vocab_images. */
export function khoaAnh(tu: string): string {
  return `am-van:${slugTu(tu)}`;
}

/**
 * Khoá theo cách ĐẦU TIÊN — bỏ sạch dấu. CHỈ dùng ở trang admin để tìm lại ảnh
 * tải lên hồi đó rồi gán tay về đúng từ.
 *
 * KHÔNG dùng khi hiển thị: khoá này dính nhau ("bé" và "bê" cùng ra "be"), lấy
 * làm lối lùi thì "bê" sẽ mượn ảnh của "bé" — đã gặp và đã gỡ.
 */
export function khoaAnhCu(tu: string): string {
  const bo = tu
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `am-van:${bo}`;
}
