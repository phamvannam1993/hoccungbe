// Khoá ảnh của từ vựng tiếng Anh trong bảng `vocab_images`.
//
// Khác khoá của vòng tròn âm vần ("am-van:cà"): ảnh từ vựng đã có sẵn từ trước,
// admin tải ở /admin/vocabulary với khoá dạng "<chủ đề>:<từ tiếng Anh>". Giữ
// nguyên khoá đó để vòng tròn từ vựng dùng lại được toàn bộ ảnh đã có.

/** "dong-vat" + "cat" → "dong-vat:cat". */
export const khoaAnhTuVung = (slugChuDe: string, en: string) => `${slugChuDe}:${en}`;
