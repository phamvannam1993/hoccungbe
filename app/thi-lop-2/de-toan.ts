// Toán lớp 2 — chép từ "5 ĐỀ THI GIỮA HỌC KÌ 1 LỚP 2.pdf" (Mathx.vn) và "BỘ 20 ĐỀ KIỂM TRA HỌC KÌ I TOÁN 2.pdf".
// Hình vẽ cắt từ bản PDF (public/thi-lop-2). Đáp án phép tính tự tính; đáp án đếm hình đếm tay từ hình vẽ.
// Câu không có đáp án xác định (vẽ hình, "Số 57 là kết quả của phép tính …" không có lựa chọn…) để phần viết, không chấm.

import { cmp, ds, kq } from '../thi-lop-1/giai';
import type { RawBai, RawBlock, RawPhieu } from '../thi-lop-1/kieu';

const I = (n: string) => `/thi-lop-2/${n}`;
const dep = (s: string) => s.replace(/ - /g, ' − ');

/** Tìm số ở "?" trong 0…200 sao cho đẳng thức đúng (x, chỗ chấm…). */
function giaiX(eq: string): number {
  const [l, r] = eq.split('=');
  for (let x = 0; x <= 200; x++) {
    const f = (s: string) => {
      try {
        return kq(s.replace('?', String(x)));
      } catch {
        return NaN;
      }
    };
    if (f(l) === f(r)) return x;
  }
  throw new Error(`Không giải được: ${eq}`);
}
/** "x + 35 = 82" → "x + 35 = 82   →   x = [[n:47]]" */
const timX = (eq: string, bien = 'x') => `${dep(eq)}   →   ${bien} = [[N:${giaiX(eq.replace(bien, '?'))}]]`;
/** "74 - 38 + 27" → "74 − 38 + 27 = [[n:63]]" */
const tinh = (e: string) => `${dep(e)} = [[n:${kq(e)}]]`;
/** So sánh có đơn vị: "37kg + 4kg ? 40kg" (đơn vị chỉ để hiện). */
const ss = (item: string) => {
  const bo = item.replace(/\s*(kg|cm|dm|lít|l)\b/g, '');
  const [a, b] = bo.split('?');
  const x = kq(a);
  const y = kq(b);
  const [l, r] = item.split('?');
  return `${dep(l.trim())} [[C:${x === y ? '=' : x < y ? '<' : '>'}]] ${dep(r.trim())}`;
};

const mc = (q: string, opts: string[], ans: string | number, cols?: number): RawBlock => ({ t: 'mc', q, opts, ans, cols: cols ?? (opts.some((o) => o.length > 18) ? (opts.some((o) => o.length > 34) ? 1 : 2) : Math.min(opts.length, 4)) });
const dt = (...e: string[]): RawBlock => ({ t: 'cols', items: e.map((x) => `${x} = ${kq(x)}`) });
const ln = (items: string[], cols = 2): RawBlock => ({ t: 'lines', cols, items });
const img = (src: string, w = 240): RawBlock => ({ t: 'img', src: I(src), w });
const viet = (dong = 2): RawBlock => ({ t: 'viet', dong });
/** Bài toán có lời văn: đề + chỗ trình bày + "Đáp số" chấm điểm. */
const loiVan = (de: string, phep: string, donVi: string): RawBlock[] => [
  ...(de ? [{ t: 'text' as const, text: de }] : []),
  viet(2),
  ln([`Đáp số: [[n:${kq(phep)}]] ${donVi}`], 1),
];
const hinh = (src: string, w: number, blocks: RawBlock[]): RawBlock => ({ t: 'row', widths: ['3fr', '2fr'], cols: [blocks, [img(src, w)]] });
const B = (title: string, diem: number | undefined, blocks: RawBlock[]): RawBai => ({ title, diem, blocks });
const tuDo = (title: string, dong = 2): RawBai => ({ title, diem: 0, blocks: [viet(dong)] });

const gk = (n: number, desc: string, bai: RawBai[]): RawPhieu => ({
  slug: `toan-lop-2-giua-ki-1-de-${n}`,
  title: `Đề thi giữa kì 1 – Toán lớp 2 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ THI ÔN TẬP GIỮA KÌ 1 – TOÁN LỚP 2', `ĐỀ SỐ ${n}`, ' 2'],
  thoiGian: 40,
  bai,
});
const hk = (n: number, desc: string, bai: RawBai[], tl?: number): RawPhieu => ({
  slug: `toan-lop-2-hoc-ki-1-de-${n}`,
  title: `Kiểm tra học kì 1 – Toán lớp 2 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['BỘ ĐỀ KIỂM TRA HỌC KÌ I – TOÁN 2', `ĐỀ SỐ ${n}`, ' 2'],
  thoiGian: 40,
  phan: tl === undefined ? undefined : { 0: 'I. TRẮC NGHIỆM', [tl]: 'II. TỰ LUẬN' },
  bai,
});

/* ───────────── 5 đề giữa kì 1 ───────────── */

export const DE_GK: RawPhieu[] = [
  gk(1, 'Bài toán nhiều hơn, so sánh có đơn vị kg – cm, tính, đọc – viết số, đổi dm – cm.', [
    B('Câu 1. Giải bài toán theo tóm tắt sau:', 1, [ln(['Đoạn MN: 27cm.', 'Đoạn PQ hơn đoạn MN: 6cm.', `Vậy đoạn PQ = [[n:${27 + 6}]] cm.`], 1)]),
    B('Câu 2. Điền dấu <, >, = thích hợp vào chỗ chấm:', 1, [ln(['37kg + 4kg ? 40kg', '23kg + 18kg ? 43kg', '35cm - 12cm ? 20cm + 13cm', '35kg + 16kg ? 41kg'].map(ss))]),
    B('Câu 3. Tính:', 1, [ln(['37 + 23', '45 + 26', '91 - 11', '64 - 2'].map(tinh), 4)]),
    B('Câu 4. Đọc số sau:', 1, [ln(['25: [[w:hai mươi lăm|hai lăm]]'], 1)]),
    B('Câu 5. Viết số thích hợp vào chỗ chấm:', 1, [ln(['a) Tám mươi bảy: [[n:87]]', 'b) Hai mươi tư: [[n:24]]'])]),
    B('Câu 6. Chọn đáp án đúng:', 1, [mc('5 chục hơn 2 chục số đơn vị là:', ['3', '20', '30'], '30', 3)]),
    B('Câu 7. Tìm số a thích hợp thỏa mãn: 53 > a9 > 48', 1, [ln(['Vậy chữ số a là: [[n:4]]'], 1)]),
    B('Câu 8. 2dm 3cm = … cm.', 1, [ln(['2dm 3cm = [[n:23]] cm'], 1)]),
    tuDo('Câu 9. Số 57 là kết quả của phép tính: … (viết một phép tính có kết quả bằng 57)', 1),
    B('Câu 10. Điền dấu thích hợp (<, >, =) vào chỗ …', 1, [ln([cmp('17 + 3 ? 18 + 2')], 1)]),
  ]),
  gk(2, 'So sánh biểu thức, chọn phép tính đúng, bài toán nhiều hơn – ít hơn, đếm hình, đổi dm – cm.', [
    B('Câu 1. Điền dấu thích hợp (>, <, =) vào chỗ …', 1, [ln([cmp('14 + 56 ? 85 - 15')], 1)]),
    // Đề gốc có 2 phép tính đúng (37 + 53 = 90 và 32 + 25 = 57) → đổi sang Đúng/Sai cho từng phép tính
    B('Câu 2. Phép tính nào đúng, phép tính nào sai? (Đúng ghi Đ, sai ghi S)', 1, [ln(['96 - 24 = 54', '37 + 53 = 90', '32 + 25 = 57', '70 - 18 = 68'].map(ds))]),
    B('Câu 3. Phúc nặng 36kg. Phúc nhẹ hơn Hồng 9kg.', 1, [ln([`Vậy cân nặng của Hồng là: [[n:${36 + 9}]] kg.`], 1)]),
    B('Câu 4. Một người mua hai loại bút, trong đó có 36 bút xanh. Số bút đỏ nhiều hơn số bút xanh là 7 cái.', 1, [ln([`Vậy tổng số bút người đó mua là: [[n:${36 + 36 + 7}]] cái.`], 1)]),
    B('Câu 5. Hình dưới đây:', 1, [hinh('gk-d2-c5', 260, [ln(['Có [[n:2]] hình tam giác.', 'Có [[n:4]] hình tứ giác.'], 1)])]),
    B('Câu 6. Tính:', 1, [ln(['42 + 46', '95 - 13', '28 + 42', '67 - 15'].map(tinh), 4)]),
    B('Câu 7. Chọn đáp án đúng: Phép tính có kết quả bằng 89 là:', 1, [mc('', ['65 + 25', '78 + 22', '52 + 37', '47 + 43'], '52 + 37')]),
    B('Câu 8. Kết quả của phép tính:', 1, [ln([tinh('96 - 24')], 1)]),
    B('Câu 9. Điền số thích hợp vào chỗ chấm:', 1, [ln([tinh('24 + 52'), '18cm + 12cm = [[n:30]] cm'])]),
    B('Câu 10. Viết các số vào dấu …', 1, [ln(['a) 3dm = [[n:30]] cm.', 'b) 40cm = [[n:4]] dm'])]),
  ]),
  gk(3, 'Bài toán ngắn hơn – cao hơn, so sánh dãy tính, tìm chữ số, đếm hình tam giác, số liền trước.', [
    B('Câu 1. Thước kẻ màu đỏ dài 40cm, thước kẻ màu xanh ngắn hơn thước kẻ màu đỏ 15cm.', 1, [ln([`Vậy độ dài của thước kẻ màu xanh là: [[n:${40 - 15}]] cm.`], 1)]),
    B('Câu 2. Điền dấu thích hợp vào chỗ chấm:', 1, [ln([cmp('15 + 75 - 10 ? 65 - 23 + 15')], 1)]),
    B('Câu 3. Bạn Bình cao 81cm, Nam cao hơn Bình 7cm.', 1, [ln([`Vậy chiều cao của Nam là: [[n:${81 + 7}]] cm.`], 1)]),
    B('Câu 4. Tính:', 1, [ln(['23 + 8', '32 + 9', '67 - 17', '95 - 4'].map(tinh), 4)]),
    B('Câu 5. Thay các chữ cái A, B, C bằng các chữ số thích hợp:', 1, [ln(['a) 5A + 36 = 91  →  A = [[n:5]]', 'b) 45 + B7 = 9C  →  B = [[n:4]], C = [[n:2]]'], 1)]),
    B('Câu 6. Hình vẽ bên có số hình tam giác là: … hình.', 1, [hinh('gk-d3-c6', 260, [ln(['Có [[n:11]] hình tam giác.'], 1)])]),
    B('Câu 7. Trong các số: 94, 93, 96, 59. Số liền trước số 95 là:', 1, [ln(['[[n:94]]'], 1)]),
    B('Câu 8. Số tròn chục nhỏ hơn 32 là (lớn nhất):', 1, [ln(['[[n:30]]'], 1)]),
    B('Câu 9. Kết quả của phép trừ 57kg − 11kg − 4kg là:', 1, [ln([`[[n:${57 - 11 - 4}]] kg`], 1)]),
    B('Câu 10. Kết quả của phép cộng 33 + 5 là:', 1, [ln(['[[n:38]]'], 1)]),
  ]),
  gk(4, 'Bài toán ít hơn – tổng, tính có đơn vị kg – lít, đếm hình chữ nhật, đổi cm – dm, số lẻ.', [
    B('Câu 1. Lớp 2A có 26 học sinh nữ, số học sinh nam ít hơn số học sinh nữ 5 bạn. Cô giáo tặng mỗi bạn một phần quà trung thu.', 1, [ln([`a) Lớp 2A có số học sinh nam là: [[n:${26 - 5}]] học sinh.`, `b) Cô giáo đã tặng số phần quà cho cả lớp là: [[n:${26 + 21}]] phần quà.`], 1)]),
    B('Câu 2. Tính:', 1, [ln(['47 + 22', '69 - 25', '58 + 12'].map(tinh), 3)]),
    B('Câu 3. Điền số thích hợp vào chỗ chấm.', 1, [ln([`a) 17kg + 20kg − 13kg = [[n:${17 + 20 - 13}]] kg.`, `b) 24kg + 19kg − 11kg = [[n:${24 + 19 - 11}]] kg.`])]),
    B('Câu 4. Hình dưới đây có số hình chữ nhật là:', 1, [hinh('gk-d4-c4', 240, [ln(['[[n:8]] hình chữ nhật.'], 1)])]),
    B('Câu 5. 95 lít − 2 lít − 53 lít = … lít.', 1, [ln([`[[n:${95 - 2 - 53}]] lít`], 1)]),
    B('Câu 6. 25 + 2 < … < 35 − 2. Số tròn chục cần điền vào chỗ chấm là:', 1, [ln(['[[n:30]]'], 1)]),
    B('Câu 7. Điền vào chỗ chấm:', 1, [ln(['54cm = [[n:5]] dm [[n:4]] cm.'], 1)]),
    B('Câu 8. 23kg + 7kg + 8kg = … kg.', 1, [ln([`[[n:${23 + 7 + 8}]] kg`], 1)]),
    B('Câu 9. Chọn đáp án đúng: 52 là kết quả của phép tính:', 1, [mc('', ['43 + 11', '5 + 7', '27 + 25', '22 + 32'], '27 + 25')]),
    B('Câu 10. Số lẻ liền sau của 17 là:', 1, [ln(['[[n:19]]'], 1)]),
  ]),
  gk(5, 'Bài toán tổng – nhiều hơn, so sánh, đặt tính, đếm hình tứ giác, phép cộng có chữ số còn thiếu.', [
    B('Câu 1. Bao gạo to cân nặng 25kg, bao gạo bé cân nặng 10kg.', 1, [ln([`Vậy cả hai bao gạo cân nặng số ki-lô-gam là: [[n:${25 + 10}]] kg.`], 1)]),
    B('Câu 2. Điền dấu thích hợp (<; >; =) vào chỗ chấm:', 1, [ln(['85 + 7 - 32 ? 97', '96 lít - 22 lít - 24 lít ? 60 lít'].map(ss))]),
    B('Câu 3. Đặt tính rồi tính:', 1, [dt('37 + 32', '96 - 45', '81 - 30', '67 + 25')]),
    B('Câu 4. Tùng phụ mẹ hái bưởi mang ra chợ bán. Tùng hái được 15 quả, mẹ hái được nhiều hơn Tùng 6 quả.', 1, [ln([`Vậy số quả bưởi mẹ hái được là: [[n:${15 + 6}]] quả bưởi.`], 1)]),
    B('Câu 5. 27 + 23 < … < 52 + 14. Số tròn chục cần điền vào chỗ chấm là:', 1, [ln(['[[n:60]]'], 1)]),
    B('Câu 6. Hình vẽ dưới đây có số hình tứ giác là:', 1, [hinh('gk-d5-c6', 200, [ln(['[[n:5]] hình tứ giác.'], 1)])]),
    B('Câu 7. Kết quả của phép tính 26 + 38 − 13 là:', 1, [ln([`[[n:${26 + 38 - 13}]]`], 1)]),
    B('Câu 8. Chữ số cần điền vào chỗ … để được phép tính đúng 53 + 2… = 82 là:', 1, [ln(['[[n:9]]'], 1)]),
    B('Câu 9. 2dm 3cm = … cm.', 1, [ln(['[[n:23]] cm'], 1)]),
    B('Câu 10. 32cm + 2cm + 5cm = …', 1, [ln([`[[n:${32 + 2 + 5}]] cm`], 1)]),
  ]),
];

/* ───────────── 20 đề kiểm tra học kì 1 ───────────── */

export const DE_HK: RawPhieu[] = [
  hk(1, 'Tìm x, phép tính bằng 100, đổi dm – cm, đếm tứ giác, đặt tính, bài toán ngắn hơn.', [
    B('Câu 1. Tìm x, biết 9 + x = 14:', 0.5, [mc('', ['x = 5', 'x = 8', 'x = 6', 'x = 23'], 'x = 5')]),
    B('Câu 2. Phép tính nào dưới đây có kết quả là 100?', 0.5, [mc('', ['55 + 35', '23 + 76', '69 + 31', '69 + 41'], '69 + 31')]),
    B('Câu 3. Kết quả tính 13 – 3 – 4 bằng kết quả phép trừ nào dưới đây?', 0.5, [mc('', ['12 − 8', '12 − 6', '12 − 7', '13 − 1'], '12 − 6')]),
    B('Câu 4. 10dm = …cm', 0.5, [mc('', ['10 cm', '1 cm', '100 cm', '11 cm'], '100 cm')]),
    B('Câu 5. Số liền sau số lớn nhất có 2 chữ số là:', 0.5, [mc('', ['99', '98', '100', '90'], '100')]),
    B('Câu 6. Hình sau có:', 0.5, [hinh('hk-d1-c6', 240, [mc('', ['3 tứ giác', '4 tứ giác', '5 tứ giác'], '3 tứ giác', 1)])]),
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', 2, [dt('60 - 32', '26 + 39', '73 + 27', '100 - 58')]),
    B('Câu 8. Tìm x: (2 điểm)', 2, [ln([timX('x + 35 = 82'), timX('47 - x = 19')])]),
    B('Câu 9. Mảnh vải màu xanh dài 33dm, mảnh vải màu tím ngắn hơn mảnh vải màu xanh 15dm. Hỏi mảnh vải màu tím dài bao nhiêu đề-xi-mét? (2 điểm)', 2, loiVan('', '33 - 15', 'dm')),
    B('Câu 10. Tính hiệu, biết số bị trừ là số lớn nhất có hai chữ số và số trừ là 90. (1 điểm)', 1, [ln([`Hiệu là: [[n:${99 - 90}]]`], 1)]),
  ], 6),
  hk(2, 'Số liền trước, so sánh, tìm số bị trừ, giờ trong ngày, đếm hình, bài toán ít hơn.', [
    B('Câu 1. Số liền trước của 70 là: (0,5 điểm)', 0.5, [mc('', ['69', '68', '71', '80'], '69')]),
    B('Câu 2. Số lớn nhất có hai chữ số là: (0,5 điểm)', 0.5, [mc('', ['10', '90', '99', '100'], '99')]),
    B('Câu 3. Điền dấu (<, >, =) thích hợp vào chỗ chấm: 23 + 45 … 90 – 30 (1 điểm)', 1, [mc('', ['<', '>', '=', '+'], '>')]),
    B('Câu 4. …… – 35 = 65. Số cần điền vào chỗ chấm là: (0,5 điểm)', 0.5, [mc('', ['90', '35', '100', '30'], '100')]),
    B('Câu 5. 1 giờ chiều hay ….giờ. (0,5 điểm)', 0.5, [mc('', ['12', '13', '14', '15'], '13')]),
    B('Câu 6. Hình bên có bao nhiêu hình tứ giác? (1 điểm)', 1, [hinh('hk-d2-c6', 240, [mc('', ['1', '2', '3', '4'], '3')])]),
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', 2, [dt('26 + 29', '45 + 38', '41 - 27', '60 - 16')]),
    B('Câu 8. Nhà Lan nuôi một con bò sữa. Ngày thứ nhất con bò cho 43l sữa. Ngày thứ hai nó cho ít hơn ngày thứ nhất 18l sữa. Hỏi ngày thứ hai con bò cho bao nhiêu lít sữa? (2 điểm)', 2, loiVan('', '43 - 18', 'l sữa')),
    B('Câu 9. Tìm x: (1 điểm)', 1, [ln([timX('x + 17 = 24'), timX('45 - x = 19')])]),
    B('Câu 10. Viết số thích hợp vào chỗ trống: (1 điểm) Hình vẽ bên', 1, [hinh('hk-d2-c10', 260, [ln(['a. Có [[n:5]] tam giác.', 'b. Có [[n:5]] tứ giác.'], 1)])]),
  ], 6),
  hk(3, 'Dãy số cách 2, đọc – viết số, tính nhẩm, đúng sai, đặt tính, đếm hình, bài toán ít hơn.', [
    B('Câu 1. Viết số thích hợp vào chỗ chấm: (1 điểm)', 1, [ln(['a. 28; 30; 32; [[n:34]]; [[n:36]]; [[n:38]]; [[n:40]]; 42; 44.', 'b. 55; 57; 59; [[n:61]]; [[n:63]]; [[n:65]]; [[n:67]]; 69; 71.'], 1)]),
    B('Câu 2. Viết số hoặc chữ thích hợp vào chỗ chấm: (1 điểm)', 1, [{ t: 'grid', border: true, rows: [['Đọc số', 'Viết số'], ['Chín mươi tám', '[[n:98]]'], ['[[w:bảy mươi chín]]', '79']] }]),
    B('Câu 3. Tính nhẩm: (1 điểm)', 1, [ln(['9 + 9', '3 + 9', '14 - 7', '13 - 8'].map(tinh))]),
    B('Câu 4. Đúng ghi Đ, sai ghi S vào chỗ chấm: (1 điểm)', 1, [ln([ds('8 + 9 = 16'), ds('5 + 7 = 12')])]),
    B('Câu 5. Đặt tính rồi tính: (2 điểm)', 2, [dt('57 + 26', '39 + 6', '81 - 35', '90 - 58')]),
    B('Câu 6. Khoanh vào chữ đặt trước câu trả lời đúng: (1 điểm)', 1, [mc('a. 8dm + 20dm = …dm', ['28', '10', '100'], '28', 3), mc('b. Tìm x biết: x + 10 = 10', ['x = 10', 'x = 0', 'x = 20'], 'x = 0', 3)]),
    B('Câu 7. Khoanh vào chữ đặt trước câu trả lời đúng: (1 điểm)', 1, [hinh('hk-d3-c7', 220, [mc('a. Có bao nhiêu hình chữ nhật?', ['1 hình', '2 hình', '3 hình'], '1 hình', 3), mc('b. Có bao nhiêu hình tam giác?', ['2 hình', '3 hình', '4 hình'], '3 hình', 3)])]),
    B('Câu 8. Nhà bạn Mai nuôi 44 con gà. Nhà bạn Hà nuôi ít hơn nhà bạn Mai 13 con gà. Hỏi nhà bạn Hà nuôi bao nhiêu con gà? (2 điểm)', 2, loiVan('', '44 - 13', 'con gà')),
  ]),
  hk(4, 'Cộng có nhớ, bài toán nhiều hơn, xem lịch, tìm số hạng, đếm hình chữ nhật, tìm x.', [
    B('Câu 1. Kết quả của phép tính 16 + 7 là:', 0.5, [mc('', ['22', '23', '24', '86'], '23')]),
    B('Câu 2. Tổ em trồng được 17 cây. Tổ bạn trồng được nhiều hơn tổ em 8 cây. Tổ bạn trồng được số cây là:', 0.5, [mc('', ['9 cây', '25 cây', '97 cây', '15 cây'], '25 cây')]),
    B('Câu 3. Chủ nhật tuần này là ngày 19 tháng 5. Vậy chủ nhật tuần trước là ngày:', 0.5, [mc('', ['11 tháng 5', '12 tháng 5', '13 tháng 5', '14 tháng 5'], '12 tháng 5')]),
    B('Câu 4. Tổng số cân của hai bạn Uyên và Ánh là 61kg, trong đó Uyên cân nặng 32kg. Vậy số cân của Ánh là:', 0.5, [mc('', ['33kg', '29kg', '27kg', '31kg'], '29kg')]),
    B('Câu 5. 32 – x = 16. x bằng:', 0.5, [mc('', ['24', '16', '28', '48'], '16')]),
    B('Câu 6. Hình sau có:', 0.5, [hinh('hk-d4-c6', 240, [mc('', ['3 hình chữ nhật', '4 hình chữ nhật', '5 hình chữ nhật', '6 hình chữ nhật'], '5 hình chữ nhật', 2)])]),
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', 2, [dt('32 - 25', '94 - 57', '53 + 19', '100 - 59')]),
    B('Câu 8. Tìm x: (2 điểm)', 2, [ln([timX('x + 30 = 80'), timX('x - 22 = 38')])]),
    B('Câu 9. Quyển truyện có 85 trang. Tâm đã đọc 79 trang. Hỏi Tâm còn phải đọc mấy trang nữa thì hết quyển truyện? (2 điểm)', 2, loiVan('', '85 - 79', 'trang')),
    B('Câu 10. Viết phép trừ có số bị trừ, số trừ và hiệu bằng nhau. (1 điểm)', 1, [ln(['[[n:0]] − [[n:0]] = [[n:0]]'], 1)]),
  ], 6),
  hk(5, 'Thành phần phép trừ, phép tính bằng 100, tìm x, đổi dm – cm, bài toán tuổi, tính biểu thức.', [
    B('Câu 1. (0,5 điểm) Trong phép trừ: 56 – 23 = 33, số 56 gọi là:', 0.5, [mc('', ['Số hạng', 'Hiệu', 'Số bị trừ', 'Số trừ'], 'Số bị trừ')]),
    B('Câu 2. (1 điểm) Phép tính nào dưới đây có kết quả là 100?', 1, [mc('', ['55 + 35', '23 + 76', '69 + 31', '12 + 82'], '69 + 31')]),
    B('Câu 3. (0,5 điểm) Tìm x, biết 9 + x = 14', 0.5, [mc('', ['x = 5', 'x = 23', 'x = 6', 'x = 13'], 'x = 5')]),
    B('Câu 4. (0,5 điểm) 5dm = …cm. Số thích hợp để điền vào chỗ chấm là:', 0.5, [mc('', ['10', '20', '500', '50'], '50')]),
    B('Câu 5. (0,5 điểm) Số lớn nhất có hai chữ số là:', 0.5, [mc('', ['10', '90', '99', '100'], '99')]),
    B('Câu 6. (0,5 điểm) Điền dấu (<, >, =) thích hợp vào chỗ chấm 23 + 45 … 90 – 30', 0.5, [mc('', ['<', '>', '=', '+'], '>')]),
    B('Câu 7. (0,5 điểm) …. – 35 = 65. Số cần điền vào chỗ chấm là:', 0.5, [mc('', ['90', '35', '100', '30'], '100')]),
    B('Câu 8. (1 điểm) Năm nay mẹ 32 tuổi, mẹ kém bà 28 tuổi. Hỏi năm nay bà bao nhiêu tuổi?', 1, [mc('', ['50', '60', '70', '80'], '60')]),
    B('Câu 9. (0,5 điểm) Kết quả của phép tính: 13 – 3 – 4 = ?', 0.5, [mc('', ['6', '7', '8', '9'], '6')]),
    B('Câu 10. (0,5 điểm) Hiệu của 24 và 12 là:', 0.5, [mc('', ['36', '12', '33', '2'], '12')]),
    B('Câu 11. Tìm x: (1 điểm)', 1, [ln([timX('x - 18 = 34'), timX('71 - x = 29')])]),
    B('Câu 12. Tính: (1 điểm)', 1, [ln([tinh('74 - 38 + 27'), tinh('35 + 15 - 40')])]),
    B('Câu 13. (1 điểm) Khối lớp Hai có 94 học sinh. Khối lớp Ba có ít hơn khối lớp Hai 16 học sinh. Hỏi khối lớp Ba có bao nhiêu học sinh?', 1, loiVan('', '94 - 16', 'học sinh')),
    B('Câu 14. (1 điểm) Tính hiệu, biết số bị trừ là số lớn nhất có hai chữ số và số trừ là 36.', 1, [ln([`Hiệu là: [[n:${99 - 36}]]`], 1)]),
  ], 10),
  hk(6, 'Tính nhanh, đặt tính, tìm x, so sánh, xem lịch và đồng hồ, bài toán nhiều hơn – ít hơn, đếm hình.', [
    B('Câu 1. Hãy khoanh tròn vào chữ đặt trước câu trả lời đúng: (2 điểm)', 2, [{ t: 'row', cols: [[mc('a. 39 + 6 = ?', ['44', '45', '46', '99'], '45'), mc('c. 98 – 7 = ?', ['28', '91', '95', '97'], '91')], [mc('b. 17 – 9 = ?', ['8', '9', '10', '12'], '8'), mc('d. 8 + 6 = ?', ['14', '15', '86', '68'], '14')]] }]),
    B('Câu 2. Đặt tính rồi tính: (2 điểm)', 2, [dt('27 + 69', '14 + 56', '77 - 48', '63 - 45')]),
    B('Câu 3. Tìm x: (1 điểm)', 1, [ln([timX('x + 20 = 48'), timX('x - 22 = 49')])]),
    B('Câu 4. Điền dấu >; <; = (1 điểm)', 1, [ln([cmp('13 + 29 ? 28 + 14'), cmp('97 - 58 ? 32 + 5')])]),
    B('Câu 5. (1 điểm) a. Xem lịch rồi cho biết · b. Xem đồng hồ', 1, [{ t: 'row', widths: ['3fr', '1fr'], cols: [[img('hk-d6-lich', 380), ln(['- Tháng 11 có [[n:30]] ngày.', '- Có [[n:4]] ngày chủ nhật.'], 1)], [img('hk-d6-dongho', 140), ln(['Đồng hồ chỉ [[n:5]] giờ.'], 1)]] }]),
    B('Câu 6. (2 điểm)', 2, [
      ...loiVan('a. Anh cân nặng 47kg, em nhẹ hơn anh 19kg. Hỏi em cân nặng bao nhiêu ki-lô-gam?', '47 - 19', 'kg'),
      ...loiVan('b. Thùng bé đựng được 51 lít nước, thùng lớn đựng nhiều hơn thùng bé 19 lít nước. Hỏi thùng lớn đựng được bao nhiêu lít nước?', '51 + 19', 'lít'),
    ]),
    B('Câu 7. (1 điểm) Trong hình bên:', 1, [hinh('hk-d6-c7', 240, [ln(['a. Có [[n:3]] hình tam giác.', 'b. Có [[n:3]] hình tứ giác.'], 1)])]),
  ]),
  hk(7, 'Sắp xếp số, tính có đơn vị kg, bài toán tuổi, tìm x, khoảng thời gian, đếm hình, bài toán nhẹ hơn.', [
    B('Câu 1. Thứ tự sắp xếp từ bé đến lớn nào đúng:', 0.5, [mc('', ['34; 56; 79; 19; 98', '19; 56; 34; 79; 98', '19; 34; 56; 79; 98'], '19; 34; 56; 79; 98', 1)]),
    B('Câu 2. 24kg – 13kg + 4kg = ….kg. Số thích hợp điền vào chỗ chấm là:', 0.5, [mc('', ['17', '15', '51', '41'], '15')]),
    B('Câu 3. Kết quả của phép tính 56 – 19 là:', 0.5, [mc('', ['47', '37', '43', '33'], '37')]),
    B('Câu 4. Mẹ 34 tuổi, Cha hơn Mẹ 6 tuổi. Hỏi Cha bao nhiêu tuổi?', 0.5, [mc('', ['94 tuổi', '40 tuổi', '39 tuổi', '28 tuổi'], '40 tuổi')]),
    B('Câu 5. x + 19 = 22. Giá trị của x là:', 0.5, [mc('', ['7', '17', '3', '13'], '3')]),
    B('Câu 6. Từ 3 giờ chiều đến 6 giờ chiều là mấy giờ?', 0.5, [mc('', ['3 giờ', '4 giờ', '5 giờ', '6 giờ'], '3 giờ')]),
    B('Câu 7. (1 điểm) Tính nhẩm:', 1, [ln(['16 + 3', '14 - 8', '15 - 6', '9 + 7'].map(tinh))]),
    B('Câu 8. (2 điểm) Đặt tính rồi tính:', 2, [dt('35 + 44', '46 + 25', '80 - 47', '39 - 16')]),
    B('Câu 9. (2 điểm) Tìm x biết:', 2, [ln([timX('x + 16 = 73'), timX('x - 27 = 57')])]),
    B('Câu 10. (1 điểm) Nhận dạng hình: Trong hình vẽ dưới đây', 1, [hinh('hk-d7-c10', 240, [ln(['a. Có [[n:5]] hình tam giác.', 'b. Có [[n:5]] hình tứ giác.'], 1)])]),
    B('Câu 11. (1 điểm) Anh Tùng học lớp 5 cân nặng 43 kg, bạn Tuấn học lớp 2 nhẹ hơn anh Tùng 15 kg. Hỏi bạn Tuấn cân nặng bao nhiêu ki-lô-gam?', 1, loiVan('', '43 - 15', 'kg')),
  ], 6),
  hk(8, 'Đặt tính, tìm x, bài toán tìm phần còn lại, tính ba số, đếm hình, phép tính có hiệu bằng số bị trừ.', [
    B('Câu 1. (2 điểm) Đặt tính rồi tính:', 2, [dt('54 + 36', '27 + 63', '54 - 38', '88 - 49')]),
    B('Câu 2. (2 điểm) Tìm x:', 2, [ln([timX('x - 36 = 56'), timX('92 - x = 42')])]),
    B('Câu 3. (2 điểm) Trong một ngày, cửa hàng bán được 56 kg đường, trong đó buổi sáng bán được 27kg. Hỏi buổi chiều bán được bao nhiêu kg đường?', 2, loiVan('', '56 - 27', 'kg đường')),
    B('Câu 4. (2 điểm) Khoanh tròn vào chữ cái trước kết quả đúng', 2, [{ t: 'row', cols: [[mc('a. 28 + 36 + 14 = ?', ['68', '78', '79'], '78', 1)], [mc('b. 76 – 22 – 38 = ?', ['26', '15', '16'], '16', 1)]] }]),
    B('Câu 5. (1 điểm) Hình bên có:', 1, [hinh('hk-d8-c5', 240, [ln(['[[n:6]] tam giác', '[[n:4]] tứ giác'], 1)])]),
    B('Câu 6. (1 điểm) Viết phép tính có hiệu bằng số bị trừ (ví dụ với số bị trừ là 25):', 1, [ln(['25 − [[n:0]] = 25'], 1)]),
  ]),
  hk(9, 'Đếm hình vuông – tam giác, trừ có nhớ, tìm số hạng, tìm x, bài toán ít hơn, số lớn nhất có tổng chữ số.', [
    B('Câu 1. Cho hình vẽ: (1 điểm)', 1, [hinh('hk-d9-c1', 200, [mc('a. Số hình vuông có trong hình vẽ là:', ['4', '5', '6'], '5', 3), mc('b. Số hình tam giác có trong hình vẽ là:', ['4', '5', '6'], '6', 3)])]),
    B('Câu 2. Cho phép tính: 53 – 36. Kết quả của phép tính trên là: (0,5 điểm)', 0.5, [mc('', ['27', '17', '37'], '17', 3)]),
    B('Câu 3. 14kg + ... kg = 32kg. Số thích hợp điền vào chỗ chấm là: (0,5 điểm)', 0.5, [mc('', ['22kg', '18kg', '28kg'], '18kg', 3)]),
    B('Câu 4. Kết quả của phép cộng 18 + 17 là: (0,5 điểm)', 0.5, [mc('', ['25', '35', '21'], '35', 3)]),
    B('Câu 5. Đặt tính rồi tính: (2 điểm)', 2, [dt('53 - 28', '60 + 27', '63 - 26', '74 - 25')]),
    B('Câu 6. Tìm x: (2 điểm)', 2, [ln([timX('x - 29 = 52'), timX('43 - x = 41'), timX('x + 45 = 63'), timX('55 + x = 61')])]),
    B('Câu 7. Lan hái được 34 bông hoa, Mai hái được ít hơn Lan 8 bông hoa. Hỏi Mai hái được bao nhiêu bông hoa? (2 điểm)', 2, loiVan('', '34 - 8', 'bông hoa')),
    B('Câu 8. Tìm số lớn nhất có hai chữ số mà tổng hai chữ số của số đó bằng 13? (1 điểm)', 1, [ln(['Số đó là: [[n:94]]'], 1)]),
    B('Câu 9. (0,5 điểm) Hình vẽ sau có:', 0.5, [hinh('hk-d9-c9', 240, [ln(['[[n:4]] hình tam giác.'], 1)])]),
  ], 4),
  hk(10, 'Trừ có nhớ, tính dãy, đọc – viết số, đặt tính, tìm x, bài toán ít hơn, đếm hình tam giác.', [
    B('Câu 1. Khoanh vào chữ đặt trước câu trả lời đúng (2 điểm)', 2, [mc('a. 85 – 39 = ..... Số thích hợp điền vào chỗ chấm là:', ['45', '46', '55', '56'], '46'), mc('b. 29 – 5 + 15 = .... Số thích hợp điền vào chỗ chấm là:', ['49', '39', '19', '9'], '39')]),
    B('Câu 2. Viết các số vào ô trống (1 điểm)', 1, [{ t: 'grid', border: true, rows: [['Đọc', 'Viết'], ['Tám mươi lăm', '[[n:85]]'], ['Chín mươi chín', '[[n:99]]']] }]),
    B('Câu 3. Đặt tính rồi tính (2 điểm)', 2, [dt('43 + 57', '92 - 75', '48 + 35', '62 - 26')]),
    B('Câu 4. Tìm x: (2 điểm)', 2, [ln([timX('x - 22 = 38'), timX('x + 14 = 43')])]),
    B('Câu 5. Một cửa hàng buổi sáng bán được 45 kg đường, buổi chiều bán được ít hơn buổi sáng 24 kg đường. Hỏi buổi chiều cửa hàng đó bán được bao nhiêu ki-lô-gam đường? (2 điểm)', 2, loiVan('', '45 - 24', 'kg đường')),
    B('Câu 6. Hình vẽ bên có mấy hình tam giác? (1 điểm)', 1, [hinh('hk-d10-c6', 240, [ln(['Hình vẽ bên có [[n:5]] hình tam giác.'], 1)])]),
  ]),
  hk(11, 'Bảng số hạng – tổng, số bị trừ – hiệu, tính dãy, đếm tứ giác, bài toán nhẹ hơn, giờ trong ngày, tính nhanh.', [
    B('Câu 1. Viết số thích hợp vào ô trống: (2 điểm)', 2, [
      { t: 'grid', border: true, rows: [['Số hạng', '38', '15', '25', `[[n:${82 - 32}]]`], ['Số hạng', '27', `[[n:${60 - 15}]]`, '25', '32'], ['Tổng', `[[n:${38 + 27}]]`, '60', `[[n:${25 + 25}]]`, '82']] },
      { t: 'grid', border: true, rows: [['Số bị trừ', '11', `[[n:${34 + 15}]]`, '64', '90'], ['Số trừ', '4', '34', `[[n:${64 - 34}]]`, `[[n:${90 - 38}]]`], ['Hiệu', `[[n:${11 - 4}]]`, '15', '34', '38']] },
    ]),
    B('Câu 2. Tính: (3 điểm)', 3, [ln([tinh('72 - 36 + 24'), tinh('36 + 24 - 18')])]),
    B('Câu 3. Khoanh vào chữ đặt trước kết quả đúng: (1 điểm) Số hình tứ giác trong hình vẽ là:', 1, [hinh('hk-d11-c3', 230, [mc('', ['1', '2', '3', '4'], '4')])]),
    B('Câu 4. Bình cân nặng 28 kg, An nhẹ hơn Bình 4 kg. Hỏi An nặng bao nhiêu ki-lô-gam? (2 điểm)', 2, loiVan('', '28 - 4', 'kg')),
    B('Câu 5. Điền số thích hợp vào chỗ chấm: (1 điểm)', 1, [ln(['a. Một ngày có [[n:24]] giờ', 'b. 15 giờ hay [[n:3]] giờ chiều', 'c. Từ 7 giờ sáng đến 10 giờ sáng cùng ngày là [[n:3]] giờ.'], 1)]),
    B('Câu 6. Tính nhanh: (1 điểm)', 1, [ln([tinh('10 - 9 + 8 - 7 + 6 - 5 + 4 - 3 + 2 - 1')], 1)]),
  ]),
  hk(12, 'Thành phần phép trừ, phép tính bằng 100, tìm x, đổi dm, bài toán tuổi, tính dãy, đếm hình.', [
    B('Câu 1. (0,5 điểm) Trong phép trừ: 56 - 23 = 33, số 56 gọi là:', 0.5, [mc('', ['Số hạng', 'Hiệu', 'Số bị trừ', 'Số trừ'], 'Số bị trừ')]),
    B('Câu 2. (1 điểm) Phép tính nào dưới đây có kết quả là 100?', 1, [mc('', ['75 + 15', '33 + 76', '59 + 41', '59 + 51'], '59 + 41')]),
    B('Câu 3. (0,5 điểm) Tìm x, biết 14 + x = 19', 0.5, [mc('', ['x = 5', 'x = 33', 'x = 6', 'x = 9'], 'x = 5')]),
    B('Câu 4. (0,5 điểm) 5dm = ... cm. Số thích hợp để điền vào chỗ chấm là:', 0.5, [mc('', ['10', '20', '500', '50'], '50')]),
    B('Câu 5. (0,5 điểm) Số lớn nhất có hai chữ số là:', 0.5, [mc('', ['10', '90', '99', '100'], '99')]),
    B('Câu 6. (0,5 điểm) Điền dấu (<, >, =) thích hợp vào ô trống: 23 + 45 □ 90 – 30', 0.5, [mc('', ['<', '>', '=', '+'], '>')]),
    B('Câu 7. (0,5 điểm) … - 35 = 65. Số cần điền vào chỗ chấm là:', 0.5, [mc('', ['90', '35', '100', '30'], '100')]),
    B('Câu 8. (1 điểm) Năm nay mẹ 32 tuổi, mẹ kém bà 28 tuổi. Hỏi năm nay bà bao nhiêu tuổi?', 1, [mc('', ['50', '60', '70', '80'], '60')]),
    B('Câu 9. (0,5 điểm) Kết quả của phép tính: 13 - 3 - 4 = ?', 0.5, [mc('', ['6', '7', '8'], '6', 3)]),
    B('Câu 10. (0,5 điểm) Hiệu của 24 và 12 là:', 0.5, [mc('', ['36', '12', '33', '2'], '12')]),
    B('Câu 11. Thực hiện phép tính: (2 điểm)', 2, [ln([tinh('52 - 19 + 9'), tinh('67 + 8 - 19')])]),
    B('Câu 12. Anh Hoàng cân nặng 46kg, Minh cân nhẹ hơn anh Hoàng 18kg. Hỏi Minh cân nặng bao nhiêu ki-lô-gam? (1 điểm)', 1, loiVan('', '46 - 18', 'kg')),
    B('Câu 13. Viết số thích hợp vào chỗ chấm: (0,5 điểm) Hình vẽ bên:', 0.5, [hinh('hk-d12-c13', 240, [ln(['a. Có [[n:2]] hình tam giác.', 'b. Có [[n:4]] hình tứ giác.'], 1)])]),
    B('Câu 14. Tìm số bé nhất có hai chữ số mà tổng hai chữ số của số đó bằng 10. (0,5 điểm)', 0.5, [ln(['Số đó là: [[n:19]]'], 1)]),
  ], 10),
  hk(13, 'Số liền trước, đếm tam giác, giờ trong ngày, tổng, tìm x, đặt tính, sơ đồ cộng trừ, bài toán ít hơn.', [
    B('Câu 1. Số liền trước 50 là', 0.5, [mc('', ['49', '51', '48'], '49', 3)]),
    B('Câu 2. Số lớn nhất có hai chữ số là:', 0.5, [mc('', ['88', '99', '90'], '99', 3)]),
    B('Câu 3. Hình vẽ bên có mấy hình tam giác?', 0.5, [hinh('hk-d13-c3', 200, [mc('', ['3', '4', '5'], '5', 3)])]),
    B('Câu 4. Câu nào đúng?', 0.5, [mc('', ['Một ngày có 24 giờ', 'Một ngày có 12 giờ', 'Một ngày có 20 giờ'], 'Một ngày có 24 giờ', 1)]),
    B('Câu 5. Tính tổng, biết các số hạng là 48 và 17.', 0.5, [mc('', ['56', '65', '45'], '65', 3)]),
    B('Câu 6. Tìm x: x + 16 = 30', 0.5, [mc('', ['15', '16', '14'], '14', 3)]),
    B('Câu 7. Tính kết quả: 86 – 6 – 9 = ?', 0.5, [mc('', ['71', '70', '81'], '71', 3)]),
    B('Câu 8. Mẹ hái được 55 quả cam, mẹ biếu bà 20 quả cam. Hỏi mẹ còn lại bao nhiêu quả cam?', 0.5, [mc('', ['30 quả', '35 quả', '25 quả'], '35 quả', 3)]),
    B('Câu 9. Đặt tính rồi tính: (2 điểm)', 2, [dt('46 + 49', '83 - 35', '80 - 43', '45 + 39')]),
    B('Câu 10. (1 điểm) Số?', 1, [img('hk-d13-c10a', 380), ln([`Ô thứ nhất: [[n:${26 + 9}]] kg · Ô thứ hai: [[n:${26 + 9 - 18}]] kg`], 1), img('hk-d13-c10b', 380), ln([`Ô đầu: [[n:${38 + 26}]] · Ô cuối: [[n:${38 + 15}]]`], 1)]),
    B('Câu 11. Tính: (2 điểm)', 2, [ln([tinh('34 + 66 - 20'), tinh('85 - 15 + 12')])]),
    B('Câu 12. Một cửa hàng buổi sáng bán được 83l dầu, buổi chiều bán được ít hơn buổi sáng 27l dầu. Hỏi buổi chiều cửa hàng đó bán được bao nhiêu lít dầu? (1 điểm)', 1, loiVan('', '83 - 27', 'l dầu')),
  ], 8),
  hk(14, 'Bài toán cho kẹo, xem lịch, đếm đoạn thẳng, xem đồng hồ, đếm hình, tính nhẩm, tìm x, phép trừ khuyết số.', [
    B('Câu 1. Anh nhiều hơn em 8 viên kẹo. Nếu anh cho em 4 viên kẹo thì ai có kẹo nhiều hơn?', 0.5, [mc('', ['Anh', 'Em', 'Không ai nhiều hơn'], 'Không ai nhiều hơn', 3)]),
    B('Câu 2. Ngày 27 tháng 12 là thứ hai. Ngày 22 tháng 12 là thứ mấy?', 0.5, [mc('', ['Thứ năm', 'Thứ tư', 'Thứ ba'], 'Thứ tư', 3)]),
    B('Câu 3. Có mấy đoạn thẳng ở hình bên:  A ——— B ——— C ——— D (4 điểm trên một đường thẳng)', 0.5, [mc('', ['6 đoạn thẳng', '5 đoạn thẳng', '4 đoạn thẳng'], '6 đoạn thẳng', 3)]),
    B('Câu 4. ......9 < 89. Số thích hợp điền vào chỗ chấm là:', 0.5, [mc('', ['7', '8', '9'], '7', 3)]),
    B('Câu 5. Đồng hồ nào chỉ cùng giờ:', 0.5, [img('hk-d14-c5', 520), mc('', ['Đồng hồ A và đồng hồ D', 'Đồng hồ A và đồng hồ E', 'Đồng hồ C và đồng hồ D'], 'Đồng hồ A và đồng hồ E', 1)]),
    B('Câu 6. Hình bên có:', 0.5, [hinh('hk-d14-c6', 230, [mc('', ['3 hình tam giác và 1 hình tứ giác.', '3 hình tam giác và 2 hình tứ giác.', '4 hình tam giác và 2 hình tứ giác.'], '4 hình tam giác và 2 hình tứ giác.', 1)])]),
    B('Câu 7. (2 điểm) Đặt tính và tính:', 2, [dt('58 + 29', '91 - 89', '52 + 15', '100 - 71')]),
    B('Câu 8. (1 điểm) Tính nhẩm:', 1, [ln(['7 + 23 + 8', '79 - 9 + 5', '85 - 25 + 6', '20 + 40 - 30'].map(tinh))]),
    B('Câu 9. (1 điểm) Tìm x biết:', 1, [ln([timX('56 - x = 27'), `x + 18 = 71 − 23   →   x = [[N:${71 - 23 - 18}]]`])]),
    B('Câu 10. (2 điểm) Đoạn thẳng thứ nhất dài 63dm. Đoạn thẳng thứ hai ngắn hơn đoạn thẳng thứ nhất 14dm. Hỏi đoạn thẳng thứ hai dài bao nhiêu đề-xi-mét?', 2, loiVan('', '63 - 14', 'dm')),
    B('Câu 11. (1 điểm) Điền số còn thiếu vào ô trống', 1, [ln(['4[[N:0]] − 17 = 23', '[[N:86]] − 37 = 49'])]),
  ], 6),
  hk(15, 'Đọc số, xem lịch, số lớn nhất có chữ số khác nhau, tổng, đếm tứ giác, bài toán nhiều hơn, tìm a.', [
    B('Câu 1. Số 59 đọc là:', 0.5, [mc('', ['Năm chín', 'Năm mươi chín', 'Chín năm', 'Chín mươi lăm'], 'Năm mươi chín', 2)]),
    B('Câu 2. Ngày 22 tháng 12 năm 2008 là thứ Hai. Ngày đầu tiên của năm 2009 là thứ mấy?', 0.5, [mc('', ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm'], 'Thứ Năm')]),
    B('Câu 3. Số lớn nhất có 2 chữ số khác nhau là:', 0.5, [mc('', ['99', '89', '98', '100'], '98')]),
    B('Câu 4. 92 bằng tổng của hai số nào trong các cặp số sau đây?', 0.5, [mc('', ['32 và 50', '55 và 47', '37 và 55', '45 và 47'], '37 và 55')]),
    B('Câu 5. Hình vẽ dưới đây có bao nhiêu hình tứ giác?', 0.5, [hinh('hk-d15-c5', 240, [mc('', ['2', '3', '4', '5'], '4')])]),
    B('Câu 6. An có 8 viên bi. Hùng có nhiều hơn An 2 viên bi. Hỏi Hùng có bao nhiêu viên bi?', 0.5, [mc('', ['11', '10 viên bi', '15 (viên bi)', '6 viên bi'], '10 viên bi')]),
    B('Câu 7. (2 điểm) Đặt tính rồi tính:', 2, [dt('36 + 47', '100 - 65', '47 + 37', '94 - 57')]),
    B('Câu 8. (1 điểm) Tìm a, biết:', 1, [ln([timX('37 + a = 81', 'a'), timX('63 - a = 25', 'a')])]),
    B('Câu 9. (2 điểm) Một khu vườn có 100 cây đào, sau khi bán đi một số cây đào thì khu vườn còn lại 37 cây đào. Hỏi đã bán bao nhiêu cây đào?', 2, loiVan('', '100 - 37', 'cây đào')),
    { title: 'Câu 10. (1 điểm) Hãy vẽ thêm một đoạn thẳng vào hình bên để có 1 hình tam giác và 2 hình tứ giác. Đọc tên các hình đó?', diem: 0, blocks: [img('hk-d15-c10', 240), viet(2)] },
    B('Câu 11. (1 điểm) Tìm số lớn nhất có hai chữ số mà hiệu hai chữ số của số đó bằng 4.', 1, [ln(['Số đó là: [[n:95]]'], 1)]),
  ], 6),
  hk(16, 'Đọc số, xem lịch tháng 2, số chẵn, tổng, đếm hình, đúng sai, đặt tính, tìm x, bài toán nhiều hơn.', [
    B('Câu 1. Số 78 đọc là:', 0.5, [mc('', ['Bảy tám', 'Bảy mươi tám', 'Tám bảy', 'Tám mươi bảy'], 'Bảy mươi tám', 2)]),
    B('Câu 2. Trong tháng 2 có số ngày thứ năm là:', 0.5, [img('hk-d16-lich', 420), mc('', ['22', '4', '1', '28'], '4')]),
    B('Câu 3. Số lớn nhất có 2 chữ số chẵn là:', 0.5, [mc('', ['98', '88', '90', '100'], '88')]),
    B('Câu 4. 79 bằng tổng của hai số nào trong các cặp số sau đây?', 0.5, [mc('', ['39 và 50', '55 và 24', '34 và 55', '39 và 49'], '55 và 24')]),
    B('Câu 5. Hình vẽ dưới đây có bao nhiêu hình tứ giác?', 0.5, [hinh('hk-d16-c5', 240, [mc('', ['2', '3', '4', '5'], '4')])]),
    B('Câu 6. My có 33 cái kẹo, My cho Ngọc một số cái kẹo thì My còn lại 21 cái kẹo. My đã cho Ngọc số kẹo là:', 0.5, [mc('', ['54 cái kẹo', '11 cái kẹo', '18 cái kẹo', '12 cái kẹo'], '12 cái kẹo', 2)]),
    B('Câu 7. (1 điểm) Đúng ghi Đ, sai ghi S vào ô trống:', 1, [ln(['9 + 7 = 17', '13 - 8 = 6', '16 - 9 = 7', '8 + 9 = 17'].map(ds))]),
    B('Câu 8. (2 điểm) Đặt tính rồi tính:', 2, [dt('51 + 19', '53 - 38', '37 + 26', '100 - 36')]),
    B('Câu 9. (1 điểm) Tìm x:', 1, [ln([timX('89 - x = 36'), timX('x + 6 = 45')])]),
    B('Câu 10. (2 điểm) Lớp 2A có 36 học sinh, lớp 2B có nhiều hơn lớp 2A 7 học sinh. Hỏi lớp 2B có bao nhiêu học sinh?', 2, loiVan('', '36 + 7', 'học sinh')),
    B('Câu 11. (1 điểm) Viết số thích hợp vào chỗ chấm: Hình vẽ bên', 1, [hinh('hk-d16-c11', 240, [ln(['a. Có [[n:2]] hình tam giác.', 'b. Có [[n:4]] hình tứ giác.'], 1)])]),
  ], 6),
  hk(17, 'Sơ đồ cộng, xem lịch, số có hai chữ số giống nhau, bài toán còn lại, xem đồng hồ, đổi dm – cm, tìm x.', [
    B('Câu 1. 36 —(+14)→ □. Số thích hợp điền vào ô trống là:', 0.5, [mc('', ['40', '50', '60', '67'], '50')]),
    B('Câu 2. Ngày 23 tháng 12 là ngày thứ sáu. Vậy ngày 27 tháng 12 cùng năm đó là thứ:', 0.5, [mc('', ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm'], 'Thứ Ba')]),
    B('Câu 3. Số nhỏ nhất có hai chữ số giống nhau là:', 0.5, [mc('', ['10', '22', '11', '9'], '11')]),
    B('Câu 4. Một cửa hàng có 85 chiếc xe đạp, đã bán được 27 chiếc xe đạp. Hỏi cửa hàng còn lại bao nhiêu chiếc xe đạp?', 0.5, [mc('', ['62 chiếc', '58 chiếc', '68 chiếc', '92 chiếc'], '58 chiếc')]),
    B('Câu 5. Đồng hồ sau đây chỉ mấy giờ:', 0.5, [hinh('hk-d17-c5', 150, [mc('', ['12 giờ', '10 giờ', '11 giờ', '21 giờ'], '10 giờ', 2)])]),
    B('Câu 6. 6dm 3cm = ....cm. Số thích hợp điền vào chỗ chấm là:', 0.5, [mc('', ['90', '63', '603', '36'], '63')]),
    B('Câu 7. Tính: (2 điểm)', 2, [ln([tinh('16 + 5 - 10'), tinh('51 - 19 - 5')])]),
    B('Câu 8. Đặt tính rồi tính: (2 điểm)', 2, [dt('47 + 25', '54 + 36', '93 - 28', '100 - 47')]),
    B('Câu 9. Tính x: (1,5 điểm)', 1.5, [ln([timX('x + 18 = 42'), timX('x - 32 = 58'), timX('60 - x = 16')], 3)]),
    B('Câu 10. Mẹ vắt được 67 lít sữa bò, chị vắt được 33 lít sữa bò. Hỏi mẹ và chị vắt được bao nhiêu lít sữa bò? (1 điểm)', 1, loiVan('', '67 + 33', 'lít sữa')),
    B('Câu 11. Tìm số lớn nhất có hai chữ số mà hiệu hai chữ số của số đó bằng 4. (0,5 điểm)', 0.5, [ln(['Số đó là: [[n:95]]'], 1)]),
  ], 6),
  hk(18, 'Bài toán nặng hơn, xem lịch, số tròn chục, trừ có đơn vị lít, đặt tính, tìm x, đếm hình.', [
    B('Câu 1. Quang cân nặng 38 kg. Minh cân nặng hơn Quang 6 kg. Vậy Minh cân nặng:', 0.5, [mc('', ['32kg', '44', '34kg', '44kg'], '44kg')]),
    B('Câu 2. Ngày 23 tháng 12 là ngày thứ sáu. Vậy ngày 27 tháng 12 cùng năm đó là thứ:', 0.5, [mc('', ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm'], 'Thứ Ba')]),
    B('Câu 3. Số tròn chục lớn nhất có hai chữ số là:', 0.5, [mc('', ['10', '98', '90', '100'], '90')]),
    B('Câu 4. 45l – 15l = ..... Điền vào chỗ chấm?', 0.5, [mc('', ['40', '40l', '30', '30l'], '30l')]),
    B('Câu 5. Kết quả của phép tính 65 – 9 là:', 0.5, [mc('', ['64', '56', '66', '54'], '56')]),
    B('Câu 6. My có 16 cái kẹo, My cho Ngọc một số cái kẹo thì My còn lại 9 cái kẹo. My đã cho Ngọc số kẹo là:', 0.5, [mc('', ['25 cái kẹo', '15 cái kẹo', '7 cái kẹo', '17 cái kẹo'], '7 cái kẹo', 2)]),
    B('Câu 7. Đặt tính rồi tính (2 điểm):', 2, [dt('46 + 28', '72 - 36', '46 + 34', '90 - 47')]),
    B('Câu 8. Tìm x (1 điểm):', 1, [ln([timX('x + 40 = 90'), timX('x - 16 = 58')])]),
    B('Câu 9. Một cửa hàng có 65 chiếc xe đạp, đã bán được 28 chiếc xe đạp. Hỏi cửa hàng còn lại bao nhiêu chiếc xe đạp? (2 điểm)', 2, loiVan('', '65 - 28', 'chiếc xe đạp')),
    B('Câu 10. (1 điểm) Hình bên có:', 1, [hinh('hk-d18-c10', 240, [ln(['[[n:2]] hình tứ giác.', '[[n:4]] hình tam giác.'], 1)])]),
    B('Câu 11. (1 điểm) Tìm số lớn nhất có hai chữ số mà tổng hai chữ số đó bằng 10.', 1, [ln(['Số đó là: [[n:91]]'], 1)]),
  ], 6),
  hk(19, 'Đọc – viết số, sắp xếp số, đặt tính, tìm x, ước lượng độ dài, đếm tam giác, bài toán nhiều hơn.', [
    B('Câu 1. Viết số hoặc chữ thích hợp vào ô trống:', 1, [{ t: 'grid', border: true, rows: [['Viết số', 'Đọc số'], ['[[n:72]]', 'Bảy mươi hai'], ['49', '[[w:bốn mươi chín]]'], ['[[n:83]]', 'Tám mươi ba'], ['57', '[[w:năm mươi bảy]]']] }]),
    B('Câu 2. Viết các số 45, 73, 66, 39, 80.', 1, [ln(['a. Theo thứ tự từ bé đến lớn: [[n:39]], [[n:45]], [[n:66]], [[n:73]], [[n:80]]', 'b. Theo thứ tự từ lớn đến bé: [[n:80]], [[n:73]], [[n:66]], [[n:45]], [[n:39]]'], 1)]),
    B('Câu 3. Đặt tính rồi tính:', 2, [dt('58 + 27', '71 - 49')]),
    B('Câu 4. Tìm x:', 1, [ln([timX('x - 73 = 17'), timX('57 + x = 83')])]),
    B('Câu 5. Đoạn thẳng AB dài khoảng mấy xăng-ti-mét? (đoạn trên dài 2dm)', 1, [img('hk-d19-c5', 320), mc('', ['19cm', '21cm', '31cm'], '19cm', 3)]),
    B('Câu 6. Trong hình bên có:', 1, [hinh('hk-d19-c6', 230, [mc('', ['1 hình tam giác', '2 hình tam giác', '3 hình tam giác'], '3 hình tam giác', 1)])]),
    B('Câu 7. Lớp 2A trồng được 45 cây, lớp 2B trồng được nhiều hơn lớp 2A 7 cây. Hỏi lớp 2B trồng được bao nhiêu cây?', 2, loiVan('', '45 + 7', 'cây')),
    B('Câu 8. Khoanh vào chữ đặt trước câu trả lời đúng: 85 − …9 = 56. Chữ số cần điền là:', 1, [mc('', ['2', '1', '3'], '2', 3)]),
  ]),
  hk(20, 'Cộng trừ có nhớ, so sánh tổng, đếm tam giác, giờ buổi tối, xem lịch, đặt tính, tìm x, tính nhanh.', [
    B('Câu 1. (2 điểm) Khoanh vào chữ cái đứng trước phương án đúng.', 2, [
      { t: 'row', cols: [[mc('a. Kết quả của phép cộng 67 + 26 là:', ['83', '93', '94', '95'], '93'), mc('c. Tổng nào dưới đây bé hơn 56?', ['50 + 8', '49 + 7', '36 + 29', '48 + 6'], '48 + 6', 2)], [mc('b. Phép trừ 100 − 57 có kết quả là:', ['53', '44', '43', '33'], '43'), hinh('hk-d20-c1d', 150, [mc('d. Số hình tam giác có trong hình bên là:', ['2', '3', '4', '5'], '4', 2)])]] },
    ]),
    B('Câu 2. (1 điểm) Điền số hoặc dấu (>, <, =) thích hợp vào chỗ chấm.', 1, [ln([cmp('42 + 15 ? 55'), cmp('100 - 67 ? 43'), 'c. 8 giờ tối còn gọi là [[n:20]] giờ.', 'd. Ngày 1 tháng 1 năm 2011 là thứ 7. Thứ bảy tuần sau đó là ngày [[n:8]] tháng [[n:1]].'])]),
    B('Câu 3. (2 điểm) Đặt tính và tính:', 2, [dt('36 + 28', '75 - 37', '100 - 64', '29 + 17')]),
    B('Câu 4. (1 điểm) Tính:', 1, [ln([tinh('48 + 25 - 38'), tinh('100 - 38 + 15')])]),
    B('Câu 5. (1 điểm) Tìm x, biết:', 1, [ln([timX('x + 37 = 73'), timX('42 - x = 30')])]),
    B('Câu 6. (2 điểm) Thùng gạo tẻ có 53 kg, thùng gạo nếp có ít hơn thùng gạo tẻ 8 kg. Hỏi thùng gạo nếp có bao nhiêu ki-lô-gam?', 2, loiVan('', '53 - 8', 'kg')),
    B('Câu 7. (1 điểm) Tính nhanh:', 1, [ln([tinh('48 + 49 - 9 - 8')], 1)]),
  ]),
];
