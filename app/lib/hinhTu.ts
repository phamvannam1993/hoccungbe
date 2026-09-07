// ẢNH CHO TỪ trong vòng tròn âm vần — có ảnh thì dùng ảnh, không thì dùng emoji.
//
// Ảnh do admin tải lên ở /admin/am-van, lưu chung bảng `vocab_images` với ảnh từ
// vựng tiếng Anh. Dùng chung bảng vì cấu trúc y hệt (một khoá chữ → một URL ảnh),
// nên không phải tạo bảng mới và không phải chạy migration trên máy chủ thật.
// Để hai loại không đụng khoá nhau, khoá của phần này luôn mang tiền tố "am-van:".

/** Dấu phụ của nguyên âm → chuỗi ASCII RIÊNG. Kiểu Telex, ai gõ tiếng Việt cũng quen. */
const CHU_GOC: Record<string, string> = {
  'ă': 'aw', 'â': 'aa', 'ê': 'ee', 'ô': 'oo', 'ơ': 'ow', 'ư': 'uw', 'đ': 'dd',
};

/** Dấu thanh → một chữ cái. */
const THANH: Record<string, string> = {
  '̀': 'f', // huyền
  '́': 's', // sắc
  '̉': 'r', // hỏi
  '̃': 'x', // ngã
  '̣': 'j', // nặng
};

/**
 * Khoá ảnh của một từ: "bé" → "bes", "bê" → "bee", "cầu vồng" → "caauf-vongf".
 *
 * PHẢI giữ được cả dấu phụ lẫn dấu thanh. Bản đầu tiên bỏ sạch dấu nên "bé" và
 * "bê" ra cùng một khoá "be" — tải ảnh cho từ này thì từ kia dùng luôn ảnh đó.
 * Có 44 nhóm từ bị dính nhau như vậy (bò/bơ, cỏ/cò/cờ, ghế/ghé/ghẹ/ghe/ghẻ…).
 *
 * Cũng KHÔNG dùng thẳng chữ tiếng Việt làm khoá: cột khoá trong MySQL dùng bảng
 * đối chiếu bỏ qua dấu, nên "bé" và "bê" vẫn bị coi là một.
 */
export function slugTu(tu: string): string {
  const tachTiengMot = (tieng: string): string => {
    // Bước 1 — gỡ DẤU THANH ra khỏi tiếng, giữ nguyên dấu phụ của nguyên âm.
    // Phải tách bằng NFD rồi ghép lại NFC: nếu chỉ duyệt ký tự thì "ê" ở dạng
    // tổ hợp (e + ◌̂) không khớp bảng CHU_GOC và dấu phụ bị mất trắng.
    let thanh = '';
    const goc = tieng
      .normalize('NFD')
      .split('')
      .filter((c) => {
        if (THANH[c]) { thanh = THANH[c]; return false; }
        return true;
      })
      .join('')
      .normalize('NFC');

    // Bước 2 — đổi từng con chữ có dấu phụ thành chuỗi ASCII riêng.
    let ra = '';
    for (const c of goc.toLowerCase()) ra += CHU_GOC[c] ?? c;

    // Dấu thanh đặt cuối tiếng, giống cách gõ Telex.
    return ra + thanh;
  };

  return tu
    .trim()
    .split(/\s+/)
    .map(tachTiengMot)
    .join('-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Khoá ảnh của một từ trong bảng vocab_images. */
export function khoaAnh(tu: string): string {
  return `am-van:${slugTu(tu)}`;
}

/**
 * Khoá theo CÁCH CŨ — bỏ sạch dấu. CHỈ dùng ở trang admin để tìm lại những ảnh
 * đã tải lên trước khi đổi cách đặt khoá, rồi gán tay về đúng từ.
 *
 * KHÔNG dùng khi hiển thị: khoá cũ dính nhau ("bé" và "bê" cùng ra "be"), nên
 * lấy nó làm lối lùi thì "bê" sẽ mượn ảnh của "bé" — đã gặp và đã gỡ.
 */
export function khoaAnhCu(tu: string): string {
  const bo = tu
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `am-van:${bo}`;
}
