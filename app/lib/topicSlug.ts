// Suy ra slug URL từ TÊN chủ đề trong DB (chủ đề không có cột slug).
//
// Tách riêng khỏi topicSeo.ts để cả client component (trang khóa học) và server
// (trang /bai-tap, sitemap) dùng CHUNG một hàm — hai bên tự tính slug riêng là
// cách chắc chắn nhất để sinh ra link 404.
//
// Slug phải ỔN ĐỊNH: đổi cách sinh slug = mất URL đã index, nên mọi thay đổi ở
// đây phải kèm redirect 301 trong next.config.ts.

export function slugifyVi(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Bỏ tiền tố đánh số ("Chủ đề 3:", "Chương VIII —") vì nó không mang từ khoá.
 * Toán lớp 4 đánh chương bằng số La Mã nên phải nhận cả hai kiểu số.
 */
export function topicLabel(name: string): string {
  return (
    name.replace(/^\s*(ch[uủ]\s*đ[eề]|ch[uư][oơ]ng|ph[aầ]n)\s*(\d+|[ivxlc]+)\s*[:.\-–—]\s*/i, '').trim() ||
    name.trim()
  );
}

export function topicSlug(name: string): string {
  return slugifyVi(topicLabel(name));
}
