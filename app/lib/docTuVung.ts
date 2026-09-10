// Chuyển nghĩa tiếng Việt của một từ vựng thành CHUỖI ĐỂ ĐỌC.
//
// Nghĩa trong `vocab.ts` viết cho MẮT ĐỌC, không phải để nói ra:
//     "khoẻ, ổn"            — hai từ đồng nghĩa, ngăn bằng dấu phẩy
//     "số một (1)"          — chữ số trong ngoặc để đối chiếu
//     "xin lỗi (làm phiền)" — chú thích ngữ cảnh
//
// Đưa nguyên vào máy đọc thì hỏng: đo thực tế "khoẻ, ổn" bị đọc thành "Quê ổn",
// "vâng, có" thành "Vâng, gái". Máy vấp ở chỗ ngắt câu giữa hai mảnh rời rạc.
//
// Chỉ đọc VẾ ĐẦU và bỏ phần trong ngoặc. Màn hình vẫn hiện nguyên bản để bé
// thấy đủ các cách nói — chỉ khác ở phần phát ra tiếng.
//
// DÙNG CHUNG cho cả trang web lẫn script sinh audio. Bắt buộc phải một chỗ:
// hai bên làm sạch lệch nhau một dấu là khoá cache không khớp, và trang lặng lẽ
// rơi về giọng cũ mà không báo lỗi gì.

/**
 * Tách nghĩa thành TỪNG MẢNH ĐỂ ĐỌC RIÊNG.
 *
 * "chú, bác, cậu" phải nghe đủ cả ba, nhưng đưa nguyên chuỗi cho máy đọc thì
 * hỏng — đo bằng máy nghe lại: "chú, bác, cậu" ra "2, 3, cầu", "cô, dì, bác
 * gái" ra "Cứu xì đắc gái". Nối bằng chữ "và" cũng không cứu được ("khoẻ và
 * ổn" ra "Cảm ơn mọi người").
 *
 * Máy chỉ đọc chuẩn từng mảnh ngắn rời. Nên trả về mảng, để bên phát đọc lần
 * lượt — bé nghe đủ nghĩa mà mảnh nào cũng rõ.
 */
export function docNghiaDs(vi: string): string[] {
  return String(vi || '')
    .replace(/\([^)]*\)/g, ' ')     // bỏ phần chú thích trong ngoặc
    .split(/[,;/]|\bhoặc\b/)         // các nghĩa ngăn bằng dấu phẩy
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export function docNghia(vi: string): string {
  const ra = docNghiaDs(vi)[0] || '';
  // Nghĩa chỉ gồm ngoặc đơn (hiếm) thì thà đọc nguyên bản còn hơn đọc rỗng.
  return ra || String(vi || '').trim();
}
