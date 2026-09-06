// ẢNH CHO TỪ trong vòng tròn âm vần — có ảnh thì dùng ảnh, không thì dùng emoji.
//
// Ảnh do admin tải lên ở /admin/am-van, lưu chung bảng `vocab_images` với ảnh từ
// vựng tiếng Anh. Dùng chung bảng vì cấu trúc y hệt (một khoá chữ → một URL ảnh),
// nên không phải tạo bảng mới và không phải chạy migration trên máy chủ thật.
// Để hai loại không đụng khoá nhau, khoá của phần này luôn mang tiền tố "am-van:".

/** "cầu vồng" → "cau-vong". Dùng làm khoá ảnh, ổn định vì từ không đổi. */
export function slugTu(tu: string): string {
  return tu
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Khoá ảnh của một từ trong bảng vocab_images. */
export function khoaAnh(tu: string): string {
  return `am-van:${slugTu(tu)}`;
}
