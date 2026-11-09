// Toán lớp 3 — chép từ "ĐỀ KIỂM TRA GIỮA KÌ I LỚP 3_KNTT_Đề.pdf" (5 đề, Kết nối tri thức) và
// "BỘ 20 ĐỀ KIỂM TRA HỌC KÌ I TOÁN 3.pdf". Hình vẽ cắt từ PDF (public/thi-lop-3), đã xoá chữ chìm.
// Bản PDF 20 đề mất ký tự ×, (, ) trong lớp chữ — đã đọc lại trên ảnh trang. Phép tính tự tính bằng ev();
// số hình / góc vuông đếm tay trên hình vẽ.

import type { RawBai, RawBlock, RawPhieu } from '../thi-lop-1/kieu';

const I = (n: string) => `/thi-lop-3/${n}`;

/** Tính biểu thức lớp 3: + − × : và ngoặc; chia phải hết. */
export function ev(expr: string): number {
  const js = expr.replace(/×|x(?=\s*\d)/g, '*').replace(/:/g, '/').replace(/−|–/g, '-');
  if (!/^[\d\s+\-*/()]+$/.test(js)) throw new Error(`Biểu thức lạ: ${expr}`);
  const v = Function(`"use strict";return (${js})`)() as number;
  if (!Number.isInteger(v) || v < 0) throw new Error(`Kết quả không phải số tự nhiên: ${expr} = ${v}`);
  return v;
}
const dep = (s: string) => s.replace(/ - /g, ' − ').replace(/ \* /g, ' × ');

/** Tìm số ở "x" (0…2000) để đẳng thức đúng; hỗ trợ "(dư r)". */
function giai(eq: string): number {
  const du = /\(dư (\d+)\)/.exec(eq);
  const e = eq.replace(/\(dư \d+\)/, '').trim();
  const [l, r] = e.split('=');
  for (let x = 0; x <= 2000; x++) {
    const thay = (s: string) => s.replace(/\b[xya]\b/g, String(x));
    try {
      if (du) {
        // a : b = q (dư r) → kiểm a = b × q + r, r < b
        const m = /^\s*(.+?)\s*:\s*(.+?)\s*$/.exec(thay(l))!;
        const a = ev(m[1]);
        const b = ev(m[2]);
        const q = ev(thay(r));
        if (b > 0 && a === b * q + Number(du[1]) && Number(du[1]) < b) return x;
      } else if (ev(thay(l)) === ev(thay(r))) return x;
    } catch {
      /* chia không hết / âm → thử tiếp */
    }
  }
  throw new Error(`Không giải được: ${eq}`);
}
const timX = (eq: string, bien = 'x') => `${dep(eq)}   →   ${bien} = [[N:${giai(eq)}]]`;
const tinh = (e: string) => `${dep(e)} = [[n:${ev(e)}]]`;
/** Đặt tính: + − × theo cột; chia ghi thương (và số dư nếu có). */
const datTinh = (...es: string[]): RawBlock[] => {
  const cot = es.filter((e) => !e.includes(':'));
  const chia = es.filter((e) => e.includes(':'));
  const out: RawBlock[] = [];
  if (cot.length) out.push({ t: 'cols', items: cot.map((e) => `${e.replace('-', '−')} = ${ev(e.replace('×', '*'))}`) });
  if (chia.length)
    out.push({
      t: 'lines',
      cols: 2,
      items: chia.map((e) => {
        const [a, b] = e.split(':').map((x) => Number(x.trim()));
        const q = Math.floor(a / b);
        const r = a % b;
        return `${a} : ${b} = [[n:${q}]]${r ? ` (dư [[n:${r}]])` : ''}`;
      }),
    });
  return out;
};

const mc = (q: string, opts: string[], ans: string): RawBlock => ({ t: 'mc', q, opts, ans, cols: opts.some((o) => o.length > 24) ? 1 : opts.some((o) => o.length > 12) ? 2 : Math.min(opts.length, 4) });
const ln = (items: string[], cols = 1): RawBlock => ({ t: 'lines', cols, items });
const img = (src: string, w = 260): RawBlock => ({ t: 'img', src: I(src), w });
const hinh = (src: string, w: number, blocks: RawBlock[]): RawBlock => ({ t: 'row', widths: ['3fr', '2fr'], cols: [blocks, [img(src, w)]] });
const viet = (dong = 2): RawBlock => ({ t: 'viet', dong });
const loiVan = (dapSo: string[]): RawBlock[] => [viet(2), ln(dapSo)];
const B = (title: string, blocks: RawBlock[], diem?: number): RawBai => ({ title, diem, blocks });
/** Viết phép tính vào 3 ô: a × b = c (hai thừa số đổi chỗ vẫn đúng). */
const oPhepTinh = (a: number, b: number, op: '×' | '+', donVi: string) => `[[N:${a}|${b}]] ${op} [[N:${b}|${a}]] = [[N:${op === '×' ? a * b : a + b}]] (${donVi})`;

const gk = (n: number, desc: string, tn: RawBai[], tl: RawBai[]): RawPhieu => ({
  slug: `toan-lop-3-giua-ki-1-de-${n}`,
  title: `Đề kiểm tra giữa kì 1 – Toán lớp 3 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ KIỂM TRA GIỮA KÌ I (Sách kết nối tri thức)', `ĐỀ SỐ ${n}`, ' 3'],
  thoiGian: 40,
  phan: { 0: 'Phần I. Trắc nghiệm (3 điểm)', [tn.length]: 'Phần II. Tự luận (7 điểm)' },
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? 0.5 })), ...tl],
});
const hk = (n: number, desc: string, tn: RawBai[], tl: RawBai[]): RawPhieu => ({
  slug: `toan-lop-3-hoc-ki-1-de-${n}`,
  title: `Kiểm tra học kì 1 – Toán lớp 3 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['BỘ ĐỀ THI CUỐI HỌC KÌ I – TOÁN 3', `ĐỀ SỐ ${n}`, ' 3'],
  thoiGian: 40,
  phan: { 0: 'I. Trắc nghiệm', [tn.length]: 'II. Tự luận' },
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? 0.5 })), ...tl],
});
const T = (q: string, opts: string[], ans: string, anh?: [string, number], diem?: number) => B(q, [anh ? hinh(anh[0], anh[1], [mc('', opts, ans)]) : mc('', opts, ans)], diem);
const bang = (...items: string[]) => B('Bài 1. Tính', [ln(items.map(tinh), 4)]);

/* ───────────── 5 đề giữa kì I ───────────── */

export const DE_GK3: RawPhieu[] = [
  gk(1, 'Bảng nhân chia, số bị trừ, dãy số, trung điểm, đường kính, đặt tính, tìm số, một phần mấy, bài toán.', [
    T('Câu 1. Tích của 6 và 4 là:', ['24', '10', '20', '28'], '24'),
    T('Câu 2. Biết hiệu là 245, số trừ là 162, số bị trừ là:', ['83', '307', '407', '183'], '407'),
    T('Câu 3. Cho dãy số: 3, 6, 9, 12, ..., ..., ..., ..., 27, 30. Các số thích hợp điền vào chỗ chấm lần lượt là:', ['13, 14, 15, 16', '23, 24, 25, 26', '14, 16, 18, 20', '15, 18, 21, 24'], '15, 18, 21, 24'),
    T('Câu 4. Nhà của Sâu, Kiến và Ốc Sên nằm trên ba điểm A, B, C. Đoạn thẳng AC dài 16 cm và B là trung điểm của đoạn thẳng AC. Vậy khoảng cách từ nhà Kiến (B) đến nhà Sâu (A) là:', ['6 cm', '7 cm', '8 cm', '9 cm'], '8 cm', ['gk-1-0', 300]),
    T('Câu 5. Số?   ? × 9 = 76 + 24 − 19', ['6', '7', '8', '9'], '9'),
    T('Câu 6. Bố An xây một cái bể cá hình chữ nhật và trồng hoa súng trong đó. Mỗi lá súng có dạng hình tròn đường kính 3 dm. Vậy chiều dài của bể cá khoảng:', ['8 × 3 = 24 (dm)', '3 × 8 = 24 (dm)', '4 × 3 = 12 (dm)', '3 × 4 = 12 (dm)'], '3 × 8 = 24 (dm)', ['gk-2-4', 280]),
  ], [
    bang('7 * 8', '8 * 6', '72 : 8', '36 : 6', '3 * 9', '9 * 4', '42 : 7', '63 : 9'),
    B('Bài 2. Đặt tính rồi tính', datTinh('727 + 29', '431 - 180')),
    B('Bài 3. Số?', [ln([timX('6 × x = 54'), timX('x + 169 = 582'), timX('27 : x = 9'), timX('605 - x = 461')], 2)]),
    B('Bài 4. Viết phép tính thích hợp. Hình tròn tâm O có đường kính bằng 7 dm. Độ dài của đường gấp khúc ABDC là:', [hinh('gk-3-5', 200, [ln([oPhepTinh(7, 3, '×', 'dm')])])]),
    B('Bài 5. Số?', [hinh('gk-3-7', 260, [ln(['1/2 số con bọ cánh cam là [[n:10]] con', '1/5 số con bọ cánh cam là [[n:4]] con'])])]),
    B('Bài 6. Gia đình An có 8 người. Sau mỗi bữa cơm, mỗi thành viên ăn 3 miếng cam. a) Sau mỗi bữa cơm, gia đình An ăn hết bao nhiêu miếng cam? b) An lấy 6 quả cam và cắt thành các miếng nhỏ. Để đủ số miếng cam cho cả gia đình, An nên cắt mỗi quả cam thành mấy miếng?', loiVan(['a) Đáp số: [[n:24]] miếng cam', 'b) Đáp số: [[n:4]] miếng'])),
  ]),
  gk(2, 'Cấu tạo số, sơ đồ cộng trừ, tâm – bán kính – đường kính, góc vuông, khối hộp, tìm x, điểm thẳng hàng, trung điểm.', [
    T('Câu 1. Chọn đáp án đúng trong các câu sau:', ['457 = 700 + 50 + 4', '230 = 200 + 3 + 0', '801 = 800 + 10 + 1', '502 = 500 + 2'], '502 = 500 + 2'),
    T('Câu 2. Số cần điền trong hình tam giác là:  403 —(+280)→ ○ —(−416)→ △', ['267', '312', '197', '319'], '267'),
    T('Câu 3. Biết số trừ là 175, hiệu là 289. Số bị trừ là:', ['124', '464', '372', '117'], '464'),
    T('Câu 4. Tâm, bán kính, đường kính của hình tròn dưới đây lần lượt là:', ['C, CD, AB', 'A, BD, CD', 'B, CD, AC', 'A, AB, CD'], 'A, AB, CD', ['gk-4-9', 200]),
    B('Câu 5. Hình nào dưới đây nhiều góc vuông nhất?', [{ t: 'row', cols: [[img('gk-4-10', 110)], [img('gk-4-11', 110)], [img('gk-4-12', 110)], [img('gk-4-13', 130)]] }, mc('', ['Hình B', 'Hình D', 'Hình A', 'Hình C'], 'Hình D')]),
    T('Câu 6. Bạn Lan làm hộp quà có dạng khối hộp chữ nhật. Bạn dùng các nan tre làm cạnh và mỗi mặt dán một tờ giấy màu khác nhau. Làm 1 hộp quà như thế thì cần bao nhiêu nan tre và bao nhiêu tờ giấy màu?', ['27 nan tre, 15 tờ giấy màu', '12 nan tre, 6 tờ giấy màu', '36 nan tre, 18 tờ giấy màu', '36 nan tre, 15 tờ giấy màu'], '12 nan tre, 6 tờ giấy màu'),
  ], [
    B('Bài 1. Đặt tính rồi tính', datTinh('521 + 199', '534 - 218')),
    B('Bài 2. Tìm x, biết:', [ln([timX('x + 274 = 851'), timX('312 - x = 188'), timX('x × 8 + 3 = 75'), timX('54 : x = 9')], 2)]),
    B('Bài 3. Quan sát hình và cho biết:', [hinh('gk-5-14', 240, [ln(['a) Kể tên các bộ ba điểm thẳng hàng: ……', 'b) Điểm D ở giữa những điểm nào? ……', 'c) Điểm B là trung điểm của đoạn thẳng [[w:AC|CA]].'])])]),
    B('Bài 4. Mẹ mua 20 quả táo. Mẹ chia cho Linh 1/4 số táo đó. Hỏi Linh có bao nhiêu quả táo?', loiVan(['Đáp số: [[n:5]] quả táo'])),
    B('Bài 5. Tìm số bị trừ biết 1/6 tổng của hiệu và số trừ bằng 8.', [ln(['Số bị trừ là: [[n:48]]'])]),
  ]),
  gk(3, 'Thương, thừa số, một phần mấy, dãy số, bán kính, đặt tính, tìm số, đường gấp khúc, bài toán uống thuốc.', [
    T('Câu 1. Thương của 64 và 8 là:', ['58', '72', '8', '7'], '8'),
    T('Câu 2. Biết thừa số thứ nhất là 6, tích là 42, thừa số thứ hai là:', ['7', '8', '6', '9'], '7'),
    B('Câu 3. Hình được tô màu 1/5 hình là:', [{ t: 'row', cols: [[img('gk-6-17', 140)], [img('gk-6-16', 130)], [img('gk-6-18', 140)], [img('gk-6-15', 130)]] }, mc('', ['A', 'B', 'C', 'D'], 'D')]),
    T('Câu 4. Cho dãy số: 60, 54, 48, 42, ..., ..., ..., ..., 12, 6. Các số thích hợp điền vào chỗ chấm lần lượt là:', ['40, 35, 30, 25', '36, 30, 24, 18', '35, 28, 21, 14', '34, 36, 18, 14'], '36, 30, 24, 18'),
    T('Câu 5. Hình vuông có cạnh dài 12 cm. Độ dài bán kính của hình tròn là:', ['8 cm', '7 cm', '6 cm', '5 cm'], '6 cm', ['gk-6-19', 160]),
    T('Câu 6. Nam đếm được có 9 viên gạch men xếp theo chiều rộng của lớp học, mỗi viên gạch men có dạng hình vuông cạnh dài 6 dm. Vậy chiều rộng của lớp học Nam là:', ['9 × 6 = 54 (dm)', '6 + 9 = 15 (dm)', '6 × 9 = 54 (dm)', '6 × 6 = 36 (dm)'], '6 × 9 = 54 (dm)', ['gk-7-20', 240]),
  ], [
    bang('4 * 9', '7 * 3', '56 : 8', '16 : 4', '6 * 8', '8 * 4', '27 : 3', '49 : 7'),
    B('Bài 2. Đặt tính rồi tính', datTinh('128 + 594', '850 - 626')),
    B('Bài 3. Số?', [ln([timX('4 × x = 36'), timX('x - 158 = 670'), timX('24 : x = 3'), timX('582 - x = 267')], 2)]),
    B('Bài 4. Viết phép tính thích hợp. ABEG và BCDE là hai hình vuông có cạnh dài 8 cm. Độ dài của đường gấp khúc ABEDC là:', [hinh('gk-7-21', 220, [ln([oPhepTinh(8, 4, '×', 'cm')])])]),
    B('Bài 5. Số?', [hinh('gk-8-24', 260, [ln(['1/3 số bông hoa là [[n:8]] bông hoa', '1/8 số bông hoa là [[n:3]] bông hoa'])])]),
    B('Bài 6. Hộp thuốc bổ mắt có 40 viên. Bác sĩ dặn Hoa: “mỗi ngày uống 2 lần, mỗi lần uống 4 viên thuốc”. a) Mỗi ngày Hoa cần uống bao nhiêu viên thuốc? b) Sau khi uống hết thuốc mẹ đưa Hoa đi khám lại. Hỏi mẹ sẽ đưa Hoa đi khám lại sau bao nhiêu ngày?', loiVan(['a) Đáp số: [[n:8]] viên thuốc', 'b) Đáp số: [[n:5]] ngày'])),
  ]),
  gk(4, 'Nhân có đơn vị lít, góc vuông, dãy số, hộp lập phương, tính nhẩm, nối phép tính bằng nhau, một phần mấy.', [
    T('Câu 1. Kết quả của phép tính 9 l × 6 là:', ['54', '54 l', '15 l', '45 l'], '54 l'),
    T('Câu 2. Biết hiệu là 78, số trừ là 419, số bị trừ là:', ['487', '441', '341', '497'], '497'),
    B('Câu 3. Hình nào có nhiều góc vuông nhất:', [{ t: 'row', widths: ['3fr', '2fr'], cols: [[img('gk-9-25', 280)], [img('gk-9-26', 160)]] }, mc('', ['A', 'B', 'C', 'D'], 'D')]),
    T('Câu 4. Cho dãy số: 8, 16, 24, 32, ..., ..., ..., ..., 72, 80. Các số thích hợp điền vào chỗ chấm lần lượt là:', ['36, 40, 44, 48', '34, 36, 38, 40', '40, 48, 56, 64', '36, 45, 54, 63'], '40, 48, 56, 64'),
    T('Câu 5. Số?   ? × 8 = 180 − 145 − 35', ['0', '80', '72', '56'], '0'),
    T('Câu 6. Hạnh muốn biếu ông bà 2 cặp bánh chưng và cần một chiếc hộp dạng khối lập phương để đựng vừa khít. Mỗi chiếc bánh chưng dày 6 cm. Hạnh nên mua chiếc hộp cạnh dài bao nhiêu xăng-ti-mét?', ['12 cm', '16 cm', '24 cm', '28 cm'], '24 cm', ['gk-10-32', 200]),
  ], [
    bang('4 * 3', '4 * 7', '45 : 9', '64 : 8', '6 * 2', '8 * 9', '21 : 7', '24 : 4'),
    B('Bài 2. Đặt tính rồi tính', datTinh('145 + 538', '928 - 476')),
    B('Bài 3. Số?', [ln([timX('9 × x = 81'), timX('x + 52 = 725'), timX('x : 6 = 7'), timX('587 - x = 329')], 2)]),
    B('Bài 4. Nối các phép tính có kết quả bằng nhau với nhau:', [{ t: 'match', top: ['3 × 8', '72 : 9', '45 : 9', '0 : 3'].map((text) => ({ text })), bottom: ['4 × 2', '35 : 7', '4 × 6', '9 × 0'].map((text) => ({ text })), pairs: [2, 0, 1, 3], topShape: 'box', bottomShape: 'box' }]),
    B('Bài 5. Viết phép tính thích hợp. Độ dài của đường gấp khúc ABCDE là:', [hinh('gk-11-41', 240, [ln([oPhepTinh(6, 4, '×', 'm')])])]),
    B('Bài 6. Số?', [hinh('gk-11-43', 280, [ln(['1/3 số bông hoa là [[n:4]] bông hoa', '1/6 số bông hoa là [[n:2]] bông hoa'])])]),
    B('Bài 7. Mỗi bạn học sinh Giỏi được tặng thưởng 8 quyển vở. Trên bàn cô giáo có 80 quyển vở. Hỏi lớp 3A có bao nhiêu học sinh Giỏi?', loiVan(['Đáp số: [[n:10]] học sinh'])),
  ]),
  gk(5, 'Tích, số bị chia, so sánh kết quả, bán kính – cạnh hình vuông, khoảng cách, cạnh hình lập phương, xem đồng hồ.', [
    T('Câu 1. Tích của 6 và 8 là:', ['42', '48', '54', '63'], '48'),
    T('Câu 2. Biết thương là 7, số chia là 4, số bị chia là:', ['24', '21', '11', '28'], '28'),
    T('Câu 3. Trong các phép tính sau, phép tính nào có kết quả lớn nhất?', ['29 + 37', '9 × 10', '755 − 685', '7 × 8'], '9 × 10'),
    T('Câu 4. Bán kính của hình tròn là 9 dm. Độ dài cạnh của hình vuông là:', ['9 dm', '12 dm', '18 dm', '27 dm'], '18 dm', ['gk-12-44', 220]),
    T('Câu 5. Số?   8 × 8 = 108 + 46 − ?', ['90', '80', '70', '60'], '90'),
    T('Câu 6. Các ngôi nhà trong khu phố được xây sát nhau, mỗi ngôi nhà rộng 4 m. Nhà Hà cách nhà An 9 ngôi nhà. Vậy khoảng cách từ nhà Hà đến nhà An là:', ['13 m', '18 m', '27 m', '36 m'], '36 m', ['gk-13-49', 280]),
  ], [
    bang('3 * 7', '9 * 3', '72 : 9', '18 : 3', '8 * 7', '6 * 6', '40 : 4', '63 : 7'),
    B('Bài 2. Đặt tính rồi tính', datTinh('762 + 28', '546 - 371')),
    B('Bài 3. Số?', [ln([timX('x × 7 = 49'), timX('x - 108 = 765'), timX('48 : x = 6'), timX('508 + x = 924')], 2)]),
    B('Bài 4. Viết phép tính thích hợp. Con kiến bò từ đỉnh A qua các đỉnh B, C của chiếc hộp dạng hình lập phương để đến chỗ miếng dưa ở đỉnh D. Quãng đường con kiến bò dài là:', [hinh('gk-13-50', 220, [ln([oPhepTinh(9, 3, '×', 'dm')])])]),
    B('Bài 5. Số?', [hinh('gk-14-52', 260, [ln(['1/2 số chú ong là [[n:9]] chú ong', '1/6 số chú ong là [[n:3]] chú ong'])])]),
    B('Bài 6. Hai chị em Hằng và Tuấn trồng 6 cây ổi, mỗi cây mất 5 phút. a) Trồng 6 cây ổi hết bao nhiêu phút? b) Khi bắt đầu trồng, đồng hồ chỉ như hình bên. Hỏi trồng xong 6 cây ổi vào lúc mấy giờ?', [hinh('gk-14-53', 150, [viet(2), ln(['a) Đáp số: [[n:30]] phút', 'b) Trồng xong lúc [[n:4]] giờ [[n:30]] phút'])])]),
  ]),
];

/* ───────────── 20 đề kiểm tra học kì I ───────────── */

export const DE_HK3: RawPhieu[] = [
  hk(1, 'Nhân chia số có ba chữ số, đổi m – cm, chu vi hình vuông, số dư lớn nhất, biểu thức, tóm tắt bài toán, đếm hình.', [
    T('Câu 1. Kết quả của phép tính: 317 × 2 là:', ['624', '634', '324', '614'], '634'),
    T('Câu 2. Kết quả của phép tính: 396 : 9 là:', ['31', '24', '34', '44'], '44'),
    T('Câu 3. 6m 40cm = ……….cm. Số thích hợp điền vào chỗ trống là:', ['604', '64', '406', '640'], '640'),
    T('Câu 4. Một hình vuông có cạnh bằng 9cm. Chu vi hình vuông đó là:', ['36cm', '18cm', '9cm', '72cm'], '36cm'),
    T('Câu 5. Một phép chia có số dư lớn nhất là 8. Số chia là:', ['7', '9', '12', '18'], '9'),
    T('Câu 6. Biểu thức 210 + 10 × 3 có giá trị là:', ['240', '660', '550', '313'], '240'),
  ], [
    B('Câu 7. Tìm x: (2 điểm)', [ln([timX('324 : x = 2'), timX('9 × x = 513')], 2)], 2),
    B('Câu 8. Dựa vào tóm tắt sau, em hãy giải bài toán: (2 điểm)  Con trâu: 276kg; con bò nhẹ hơn con trâu 85kg. Hỏi cả hai con nặng bao nhiêu ki-lô-gam?', [img('hk-1-0', 340), ...loiVan([`Đáp số: [[n:${276 + 276 - 85}]] kg`])], 2),
    B('Câu 9. Một thùng đựng 64 lít nước. Người ta đã lấy ra 1/8 số lít nước. Hỏi trong thùng còn lại bao nhiêu lít nước? (2 điểm)', loiVan(['Đáp số: [[n:56]] lít'])),
    B('Câu 10. (1 điểm) Hình bên có:', [hinh('hk-2-1', 220, [ln(['[[n:5]] hình tam giác.', '[[n:3]] hình tứ giác.'])])], 1),
  ]),
  hk(2, 'Đọc số, gấp lên, biểu thức, đếm hình chữ nhật, đổi kg – g, cạnh hình vuông, đổi hm – dam, tìm x.', [
    T('Câu 1. Số 907 được đọc là:', ['Chín bảy', 'Chín trăm linh bảy', 'Chín mươi bảy', 'Bảy trăm linh chín'], 'Chín trăm linh bảy'),
    T('Câu 2. Số 17 gấp 3 lần là:', ['51', '37', '31', '317'], '51'),
    T('Câu 3. Giá trị biểu thức: 153 : 9 – 96 : 8 là:', ['25', '655', '15', '5'], '5'),
    T('Câu 4. Số hình chữ nhật trong hình vẽ là:', ['2', '3', '4', '5'], '3', ['hk-3-2', 200]),
    T('Câu 5. 8kg = …g. Điền vào chỗ chấm?', ['8000', '80', '800', '8'], '8000'),
    T('Câu 6. Cạnh của hình vuông biết chu vi bằng 24cm là:', ['12cm', '6cm', '3cm', '1cm'], '6cm'),
  ], [
    B('Câu 7. Điền số thích hợp vào chỗ trống:', [ln(['a) 6hm 9dam = [[n:69]] dam', 'b) 3hm 4dam – 1hm 5dam = [[n:19]] dam'], 2)]),
    B('Câu 8. Tính:', datTinh('356 + 118', '985 - 237', '256 × 3', '453 : 3')),
    B('Câu 9. Tìm x:', [ln([timX('x : 101 = 8'), timX('x × 8 = 896')], 2)]),
    B('Câu 10. Anh có 69 viên bi, số bi của em bằng 1/3 số bi của anh. Hỏi cả hai anh em có bao nhiêu viên bi?', loiVan(['Đáp số: [[n:92]] viên bi'])),
    B('Câu 11. Hình bên có:', [hinh('hk-4-3', 220, [ln(['a. [[n:2]] hình tam giác.', 'b. [[n:3]] hình chữ nhật.'])])]),
  ]),
  hk(3, 'Nhân, bài toán rút về đơn vị, dãy số, chu vi, biểu thức, đặt tính, tìm x, tính nhanh.', [
    T('Câu 1. Kết quả của phép tính: 349 × 2 là:', ['688', '698', '689', '886'], '698'),
    T('Câu 2. 36 học sinh xếp thành 4 hàng. 126 học sinh sẽ xếp được số hàng là:', ['22', '14', '18', '16'], '14'),
    T('Câu 3. Cho dãy số 7; 10; 13; 16; 19; …; …; … Các số thích hợp điền vào chỗ chấm là:', ['20; 23; 26', '22; 25; 29', '22; 24; 27', '22; 25; 28'], '22; 25; 28'),
    T('Câu 4. Chu vi của hình sau là:', ['15cm', '12cm', '25cm', '36cm'], '25cm', ['hk-5-4', 200]),
    T('Câu 5. Kết quả của phép tính 48 : 4 × 2 là:', ['24', '6', '14', '20'], '24'),
    T('Câu 6. Lớp 3A có 40 học sinh. 1/5 số học sinh của lớp là:', ['200 học sinh', '5 học sinh', '8 học sinh', '6 học sinh'], '8 học sinh'),
  ], [
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', datTinh('345 + 569', '567 - 129', '67 × 9', '68 : 8'), 2),
    B('Câu 8. Thực hiện phép tính: (1 điểm)', [ln([tinh('345 : 5 + 234'), tinh('2 × 345 - 323')], 2)], 1),
    B('Câu 9. Tìm x: (1 điểm)', [ln([timX('x : 8 = 48 : 4'), timX('234 - x = 422 : 2')], 2)], 1),
    B('Câu 10. Lớp 3A có 34 học sinh. Lớp 3B có ít hơn lớp 3A 9 học sinh. Hỏi cả hai lớp có bao nhiêu học sinh? (2 điểm)', loiVan(['Đáp số: [[n:59]] học sinh']), 2),
    B('Câu 11. Tính (1 điểm): 100 − 98 + 96 − 94 + 92 − 90 + … + 52 − 50', [ln(['= [[n:26]]'])], 1),
  ]),
  hk(4, 'Đổi m – dm – cm, biểu thức, một phần mấy, thời gian, tìm x, xem lịch, đếm hình.', [
    T('Câu 1. 2m 40dm = …cm. Số thích hợp điền vào chỗ chấm là:', ['240', '24', '60', '600'], '600'),
    T('Câu 2. Giá trị của biểu thức 15 + 45 : 5 là:', ['12', '24', '14', '22'], '24'),
    T('Câu 3. 1/7 của 49 là:', ['7', '343', '243', '253'], '7'),
    T('Câu 4. Lan ngủ từ 10 giờ tối đến 6 giờ sáng. Lan ngủ số giờ là:', ['6 giờ', '7 giờ', '8 giờ', '10 giờ'], '8 giờ'),
    T('Câu 5. Hiệu của số nhỏ nhất có 3 chữ số và 27 là:', ['53', '63', '73', '77'], '73'),
    T('Câu 6. Nhà Lan nuôi 36 con gà, số con vịt bằng 1/3 số con gà. Vậy nhà Lan nuôi tất cả số con gà và vịt là:', ['48 con', '12 con', '24 con', '36 con'], '48 con'),
  ], [
    B('Câu 7. Thực hiện phép tính:', datTinh('345 + 245', '921 - 197', '104 × 9', '986 : 9')),
    B('Câu 8. Tìm x:', [ln([timX('469 - x = 123'), timX('x : 7 = 108 + 29')], 2)]),
    B('Câu 9. Cô giáo có 55 quyển sách. Sau khi thưởng cho các bạn học sinh giỏi, số quyển sách còn lại bằng 1/5 số sách ban đầu. Hỏi cô đã thưởng bao nhiêu quyển sách?', loiVan(['Đáp số: [[n:44]] quyển sách'])),
    B('Câu 10. Ngày 18 tháng 3 là thứ ba. Hỏi ngày 27 tháng 3 cùng năm đó là thứ mấy?', [mc('', ['Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'], 'Thứ năm')]),
    B('Câu 11. Hình sau có:', [hinh('hk-9-5', 220, [ln(['[[n:12]] hình tam giác,', '[[n:6]] hình tứ giác'])])]),
  ]),
  hk(5, 'Nhân, so sánh tổng, một phần mấy, số lẻ liền trước, biểu thức, đổi m – dm, tìm a, đếm góc vuông.', [
    T('Câu 1. Giá trị của phép tính 109 × 8 là:', ['802', '872', '852', '882'], '872'),
    T('Câu 2. 136 + 497 … 584 + 34. Dấu cần điền vào chỗ chấm là:', ['>', '<', '='], '>'),
    T('Câu 3. 1/6 của 42kg thêm 4kg thì được:', ['7kg', '11kg', '3kg', '28kg'], '11kg'),
    T('Câu 4. Số lẻ liền trước của số nhỏ nhất có 3 chữ số là:', ['99', '100', '101', '103'], '99'),
    T('Câu 5. Giá trị của biểu thức: 48 : 4 × 6 là:', ['12', '36', '2', '72'], '72'),
    T('Câu 6. Một sợi dây dài 3m 5dm. An cắt một đoạn dây dài bằng 1/5 độ dài sợi dây đó. Độ dài đoạn dây An đã cắt là:', ['7m', '61dm', '7dm', '6dm'], '7dm'),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('356 + 188', '125 × 7', '988 : 4')),
    B('Câu 8. Tìm a biết:', [ln([timX('a : 6 = 73', 'a'), timX('456 - a = 783 : 9', 'a')], 2)]),
    B('Câu 9. Lớp 3A có 36 bạn. Đội văn nghệ đã chọn 1/4 số học sinh của lớp 3A tham gia. Hỏi còn bao nhiêu học sinh của lớp 3A không tham gia đội văn nghệ?', loiVan(['Đáp số: [[n:27]] học sinh'])),
    B('Câu 10. Tìm số tự nhiên biết rằng nếu lấy 1/3 số đó cộng với 24 thì được kết quả là 51.', [ln(['Số đó là: [[n:81]]'])]),
    B('Câu 11. Hình vẽ sau có bao nhiêu góc vuông?', [hinh('hk-12-6', 220, [ln(['Có [[n:8]] góc vuông.'])])]),
  ]),
  hk(6, 'Đổi m – cm, chu vi hình chữ nhật, thừa số, số liền trước, đếm hình, tìm x có dư, số có hai chữ số.', [
    T('Câu 1. 7m 50cm = ….cm. Số cần điền là:', ['750', '705', '507', '570'], '750'),
    T('Câu 2. Chu vi của hình chữ nhật có chiều rộng là 40cm, chiều dài gấp đôi chiều rộng là:', ['80cm', '120cm', '240cm', '60cm'], '240cm'),
    T('Câu 3. Tích của hai số là 456, biết thừa số thứ nhất là 3. Thừa số thứ hai là:', ['150', '152', '112', '102'], '152'),
    T('Câu 4. Số lớn nhất nhỏ hơn 345 là:', ['999', '343', '344', '1000'], '344'),
    T('Câu 5. Hình dưới đây có:', ['4 tam giác và 3 tứ giác.', '4 tam giác và 5 tứ giác.', '5 tam giác và 4 tứ giác.', '5 tam giác và 5 tứ giác.'], '5 tam giác và 5 tứ giác.', ['hk-13-7', 200]),
    T('Câu 6. An có 49 quyển vở, số vở của Bình bằng 1/7 số vở của An. Hỏi Bình có bao nhiêu quyển vở?', ['7 quyển vở', '54 quyển vở', '343 quyển vở', '50 quyển vở'], '7 quyển vở'),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('243 - 198', '8 × 34', '879 : 3', '765 : 9')),
    B('Câu 8. Tìm x biết:', [ln([timX('122 : x = 98 - 96'), timX('47 : x = 3 (dư 2)')], 2)]),
    B('Câu 9. Hùng có 24 quyển truyện. Sau khi Hùng cho em 1/6 số quyển truyện mình có thì Hùng còn lại bao nhiêu quyển truyện?', loiVan(['Đáp số: [[n:20]] quyển truyện'])),
    B('Câu 10. Tìm số có hai chữ số có tích các chữ số là 18 và hiệu giữa chữ số hàng chục và hàng đơn vị là 7.', [ln(['Số đó là: [[n:92]]'])]),
  ]),
  hk(7, 'Số dư lớn nhất, biểu thức, đổi km – hm, đặt tính, bài toán gấp lên, chu vi hình chữ nhật, lập số.', [
    T('Bài 1. Trong phép chia có dư với số chia là 5, số dư lớn nhất có thể có trong phép chia đó là:', ['3', '4', '5', '6'], '4', undefined, 1),
    T('Bài 2. Tính giá trị của biểu thức: 105 + 45 : 9', ['16', '17', '110', '100'], '110', undefined, 1),
    T('Bài 3. Tìm số dư trong phép chia: 50 : 7', ['1', '5', '3', '2'], '1', undefined, 1),
    T('Bài 4. 9km 30dam = ..........hm. Số thích hợp viết vào chỗ chấm là:', ['930', '903', '93', '39'], '93', undefined, 1),
  ], [
    B('Bài 5. Đặt tính rồi tính (2 điểm)', datTinh('902 - 379', '236 × 4', '928 : 4', '799 : 3'), 2),
    B('Bài 6. Một cửa hàng buổi sáng bán được 70 chiếc xe, buổi chiều bán được nhiều gấp 3 lần buổi sáng. Hỏi buổi chiều cửa hàng bán được bao nhiêu chiếc xe? (1 điểm)', loiVan(['Đáp số: [[n:210]] chiếc xe']), 1),
    B('Bài 7. Một hình chữ nhật có chiều dài 36m, chiều rộng bằng 1/2 chiều dài. Tính chu vi hình chữ nhật đó. (2 điểm)', loiVan(['Đáp số: [[n:108]] m']), 2),
    B('Bài 8. Tìm số bé nhất có 3 chữ số khác nhau lập được từ các số: 0; 3; 7; 9. (1 điểm)', [ln(['Số đó là: [[n:307]]'])], 1),
  ]),
  hk(8, 'Biểu thức, một phần mấy, chu vi hình vuông, đổi m – cm, tìm số bị chia, góc vuông, so sánh gấp mấy lần.', [
    T('Câu 1. Kết quả của biểu thức 96 : 3 + 12 là:', ['42', '44', '34', '15'], '44'),
    T('Câu 2. 1/3 của 57m là:', ['17', '18', '19', '20'], '19'),
    T('Câu 3. Chu vi của một mảnh vườn hình vuông có độ dài cạnh 12m là:', ['24m', '48m', '12m', '6m'], '48m'),
    T('Câu 4. 7m 5dm = …cm. Số thích hợp điền vào chỗ chấm là:', ['75', '705', '507', '750'], '750'),
    T('Câu 5. … : 3 = 43. Số thích hợp điền vào chỗ chấm là:', ['129', '110', '11', '12'], '129'),
    T('Câu 6. Hình sau có số góc vuông là:', ['4', '5', '6', '7'], '5', ['hk-17-8', 220]),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('436 × 2', '951 : 3', '567 : 4')),
    B('Câu 8. Tính giá trị của biểu thức:', [ln([tinh('134 × (78 - 75)'), tinh('(690 - 234) : 8')], 2)]),
    B('Câu 9. Trong vườn có 48 cây bưởi. Số cây cam ít hơn số cây bưởi 40 cây. Hỏi số cây bưởi gấp mấy lần số cây cam?', loiVan(['Đáp số: [[n:6]] lần'])),
    B('Câu 10. Tổng của hai số gấp 3 lần số hạng thứ nhất, biết số hạng thứ nhất là 48. Tìm số hạng thứ hai.', [ln(['Số hạng thứ hai là: [[n:96]]'])]),
  ]),
  hk(9, 'Đổi hm – m, biểu thức, phân số tuổi, số dư, đổi dam – m, tìm x, chu vi hình chữ nhật, tìm một số.', [
    T('Câu 1. 9hm 7m = ….m. Số thích hợp điền vào chỗ chấm là:', ['97', '970', '907', '79'], '907', undefined, 1),
    T('Câu 2. Kết quả của phép tính 405 : 3 + 2 là:', ['81', '135', '87', '137'], '137', undefined, 1),
    T('Câu 3. Năm nay Lan 8 tuổi, mẹ hơn Lan 24 tuổi. Hỏi năm nay tuổi Lan bằng một phần mấy tuổi mẹ?', ['1/3', '1/2', '1/4', '1/6'], '1/4', undefined, 1),
    T('Câu 4. Cho một số, biết số đó chia 6 dư 4. Vậy khi chia số đó cho 2 thì số dư là:', ['0', '1', '2', '3'], '0', undefined, 1),
  ], [
    B('Câu 5. Điền số thích hợp vào chỗ chấm: (1,5 điểm)', [ln(['a. 80dam 6m = [[n:806]] m', 'b. 5l + 27l = [[n:32]] l', 'c. 1/3 của 12 giờ là [[n:4]] giờ'], 3)], 1.5),
    B('Câu 6. Tìm x: (1 điểm)', [ln([timX('x : 7 = 25 + 29'), timX('405 - x = 234 : 2')], 2)], 1),
    B('Câu 7. Cô giáo có 35 quyển vở. Cô phát phần thưởng cho học sinh hết 1/5 số vở đó. Hỏi cô giáo còn lại bao nhiêu quyển vở? (2 điểm)', loiVan(['Đáp số: [[n:28]] quyển vở']), 2),
    B('Câu 8. Tính chu vi của một mảnh vườn hình chữ nhật có chiều rộng 6m, chiều dài gấp 5 lần chiều rộng. (1 điểm)', loiVan(['Đáp số: [[n:72]] m']), 1),
    B('Câu 9. Tìm một số biết rằng lấy số đó nhân với 3 rồi cộng với 64 thì được kết quả là 88? (0,5 điểm)', [ln(['Số đó là: [[n:8]]'])], 0.5),
  ]),
  hk(10, 'Nhân, bài toán rút về đơn vị, sắp xếp số, chu vi hình chữ nhật, biểu thức, đếm hình, tìm x, đổi đơn vị.', [
    T('Câu 1. Kết quả của phép tính 103 × 9 là:', ['107', '907', '917', '927'], '927'),
    T('Câu 2. Có 56 lít dầu chứa đều trong 8 can. Hỏi 7 can chứa được bao nhiêu lít dầu?', ['49 lít', '50 lít', '1 lít', '448 lít'], '49 lít'),
    T('Câu 3. Trình tự sắp xếp từ bé đến lớn của các số 78; 192; 496; 385; 981; 108 là:', ['192; 108; 385; 496; 78; 981', '78; 108; 192; 385; 496; 981', '108; 192; 385; 496; 78; 981', '192; 496; 385; 108; 78; 981'], '78; 108; 192; 385; 496; 981'),
    T('Câu 4. Cho hình chữ nhật có chiều dài 50m, chiều rộng bằng 1/5 chiều dài. Chu vi hình chữ nhật là:', ['60m', '120m', '240m', '250m'], '120m'),
    T('Câu 5. Giá trị của biểu thức 234 + 123 × 3 là:', ['1000', '603', '630', '970'], '603'),
    T('Câu 6. Hình vẽ có:', ['3 tam giác và 1 tứ giác.', '3 tam giác và 2 tứ giác.', '4 tam giác và 1 tứ giác.', '4 tam giác và 2 tứ giác.'], '4 tam giác và 2 tứ giác.', ['hk-21-9', 220]),
  ], [
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', datTinh('688 - 209', '249 + 556', '148 × 4', '750 : 6'), 2),
    B('Câu 8. Tìm x: (2 điểm)', [ln([timX('x : 7 = 104 - 3'), timX('559 - x = 289 - 5')], 2)], 2),
    B('Câu 9. Điền số thích hợp vào chỗ chấm: (1 điểm)', [ln(['a. 3m 5dm = [[n:350]] cm', 'b. 4hm 40m = [[n:440]] m', 'c. 8dam 50dm = [[n:85]] m'], 3)], 1),
    B('Câu 10. Một đàn gà có 40 con gà trống, số gà mái bằng 1/8 số gà trống. Hỏi đàn gà có bao nhiêu con gà trống và gà mái? (2 điểm)', loiVan(['Đáp số: [[n:45]] con gà']), 2),
  ]),
  hk(11, 'Chia, một phần mấy, biểu thức, góc vuông, tìm số bị chia, cạnh hình vuông, tìm x, bài toán rút về đơn vị.', [
    T('Câu 1. Kết quả của phép tính 78 : 6 là:', ['11', '12', '13', '14'], '13'),
    T('Câu 2. 1/8 của 104kg là:', ['832kg', '832 lít', '13 lít', '13kg'], '13kg'),
    T('Câu 3. Giá trị biểu thức: 976 : 8 + 1 là:', ['120', '122', '123', '124'], '123'),
    T('Câu 4. Số góc vuông có trong hình vẽ là:', ['9', '7', '6', '8'], '9', ['hk-23-10', 240]),
    T('Câu 5. … : 4 = 24. Điền vào chỗ chấm?', ['6', '98', '96', '12'], '96'),
    T('Câu 6. Cạnh của hình vuông biết chu vi bằng 36cm là:', ['13cm', '9cm', '6cm', '1cm'], '9cm'),
  ], [
    B('Câu 7. Tính:', datTinh('395 + 437', '597 - 248', '154 × 4', '495 : 5')),
    B('Câu 8. Tìm x:', [ln([timX('456 : x = 4'), timX('x × 7 = 200 - 25')], 2)]),
    B('Câu 9. Cuộn dây điện dài 64m được cắt thành 8 đoạn dây bằng nhau. Hỏi cuộn dây 720m thì được cắt thành bao nhiêu đoạn dây như thế?', loiVan(['Đáp số: [[n:90]] đoạn dây'])),
    B('Câu 10. Hùng nghĩ tới một số có ba chữ số, biết rằng số tròn chục lớn nhất có ba chữ số nhiều hơn số đó là 348 đơn vị. Tìm số Hùng nghĩ.', [ln(['Số Hùng nghĩ là: [[n:642]]'])]),
  ]),
  hk(12, 'Biểu thức, một phần mấy, nhân, góc vuông, đổi m – cm, chu vi, tìm y, bài toán hai bước, thêm dấu ngoặc.', [
    T('Câu 1. Kết quả của phép tính 125 + 345 : 5', ['194', '470', '450', '94'], '194'),
    T('Câu 2. 1/8 của 56 lít là:', ['8', '8 lít', '7', '7 lít'], '7 lít'),
    T('Câu 3. Một quả tạ nặng 35kg. 5 quả như thế nặng số ki-lô-gam là:', ['155', '175', '165', '255'], '175'),
    T('Câu 4. Số góc vuông có trong hình vẽ là:', ['5', '7', '6', '8'], '7', ['hk-25-11', 240]),
    T('Câu 5. 7m 5dm = …cm. Số thích hợp điền vào chỗ chấm là:', ['75', '57', '750', '705'], '750'),
    T('Câu 6. Một mảnh vườn hình chữ nhật có chiều dài 35m, chiều rộng bằng 1/5 chiều dài. Chu vi mảnh vườn là:', ['84m', '42m', '40m', '80m'], '84m'),
  ], [
    B('Câu 7. Tính:', datTinh('444 - 364', '243 + 139', '5 × 153', '584 : 4')),
    B('Câu 8. Tìm y:', [ln([timX('y : 32 = 5 + 3', 'y'), timX('y × 5 = 100 - 45', 'y')], 2)]),
    B('Câu 9. Một cửa hàng có 567kg gạo, người ta bán đi 87kg. Số còn lại đóng đều vào 8 túi. Hỏi mỗi túi có bao nhiêu ki-lô-gam gạo?', loiVan(['Đáp số: [[n:60]] kg gạo'])),
    B('Câu 10. Thêm dấu ngoặc đơn vào biểu thức 50 − 5 × 4 − 70 để được biểu thức mới có giá trị bằng 110.', [mc('', ['(50 − 5) × 4 − 70', '50 − 5 × (4 − 70)', '50 − (5 × 4 − 70)', '(50 − 5 × 4) − 70'], '(50 − 5) × 4 − 70')]),
  ]),
  hk(13, 'Biểu thức có ngoặc, chu vi hình chữ nhật, đổi hm – m, đếm tứ giác, số dư, tìm x, bài toán rút về đơn vị, điền chữ số.', [
    T('Câu 1. Kết quả của phép tính (81 + 15) : 8 + 4 là: (0,5 điểm)', ['12', '16', '20', '24'], '16'),
    T('Câu 2. Một hình chữ nhật có chiều rộng bằng 23cm, chiều dài gấp 3 lần chiều rộng. Chu vi hình chữ nhật là: (1 điểm)', ['69cm', '92cm', '138cm', '184cm'], '184cm', undefined, 1),
    T('Câu 3. 4hm 5m = ….m. Số thích hợp điền vào chỗ chấm là: (0,5 điểm)', ['405', '45', '450', '54'], '405'),
    T('Câu 4. Hình vẽ sau có …. hình tứ giác. (0,5 điểm)', ['2', '3', '4', '5'], '3', ['hk-27-12', 220]),
    T('Câu 5. Cho phép chia 789 : 7. Số dư của phép chia là: (0,5 điểm)', ['3', '4', '5', '6'], '5'),
  ], [
    B('Câu 6. Đặt tính rồi tính: (2 điểm)', datTinh('345 + 228', '465 - 259', '295 × 3', '468 : 4'), 2),
    B('Câu 7. Tìm x biết: (2 điểm)', [ln([timX('315 + x = 981 : 3'), timX('x : 3 = 350 - 21')], 2)], 2),
    B('Câu 8. Có 45 học sinh xếp đều vào 5 hàng. Hỏi có 225 học sinh thì xếp được vào bao nhiêu hàng như thế? (2 điểm)', loiVan(['Đáp số: [[n:25]] hàng']), 2),
    B('Câu 9. Điền số thích hợp vào dấu *: (1 điểm)', [ln(['[[N:2]]25 × 3 = 6[[N:7]][[N:5]]'])], 1),
  ]),
  hk(14, 'Chia, chu vi hình vuông, đổi km – hm – dam, đếm tứ giác, số dư, tìm x có dư, một phần mấy, tìm số.', [
    T('Câu 1. Kết quả của phép tính 657 : 9 là: (1 điểm)', ['73', '13', '63', '53'], '73', undefined),
    T('Câu 2. Một hình vuông có độ dài một cạnh là 35cm. Chu vi của hình vuông đó là: (1 điểm)', ['70cm', '140dm', '70dm', '140cm'], '140cm'),
    T('Câu 3. 4km 3hm = …..dam. Số thích hợp điền vào chỗ chấm là: (0,5 điểm)', ['43', '403', '430', '34'], '430'),
    T('Câu 4. Hình vẽ sau có …. hình tứ giác. (1 điểm)', ['2', '3', '4', '5'], '5', ['hk-29-13', 220]),
    T('Câu 5. Phép chia 563 : 5 có số dư là:', ['1', '2', '3', '4'], '3'),
    T('Câu 6. 231 : x = 51 – 48. Giá trị của x là:', ['639', '693', '77', '58'], '77'),
  ], [
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', datTinh('456 + 127', '485 - 138', '104 × 7', '549 : 4'), 2),
    B('Câu 8. Tìm x biết: (2 điểm)', [ln([timX('634 - x = 327 : 3'), timX('x : 7 = 24 (dư 2)')], 2)], 2),
    B('Câu 9. Lớp 3A có 54 học sinh. Cô giáo cử 1/9 số học sinh của lớp đi thi học sinh giỏi. Hỏi lớp còn bao nhiêu bạn không đi thi? (2 điểm)', loiVan(['Đáp số: [[n:48]] học sinh']), 2),
    B('Câu 10. Tìm số có ba chữ số biết lấy số đó nhân với 3 rồi cộng với 8 ta được kết quả bằng 593.', [ln(['Số đó là: [[n:195]]'])]),
  ]),
  hk(15, 'Biểu thức có đơn vị hm, một phần mấy, thừa số, số tròn chục, đếm tứ giác, gấp lên, tìm x, điền dấu phép tính.', [
    T('Câu 1. Kết quả của phép tính 54hm : 6 + 13hm = ……', ['21', '21hm', '22', '22hm'], '22hm'),
    T('Câu 2. Nhà Hoa có 5 chuồng gà, mỗi chuồng có 9 con gà. Hôm nay nhà Hoa bán đi 1/9 số gà. Hỏi nhà Hoa bán đi bao nhiêu con gà?', ['5 con gà', '9 con gà', '45 con gà', '405 con gà'], '5 con gà'),
    T('Câu 3. Tích của hai số là 112, biết thừa số thứ nhất là 4. Thừa số thứ hai là:', ['13', '28', '3', '30'], '28'),
    T('Câu 4. Số tròn chục nhỏ nhất có ba chữ số khác nhau là:', ['100', '101', '102', '120'], '120'),
    T('Câu 5. Hình dưới đây có số hình tứ giác là:', ['6', '7', '9', '8'], '9', ['hk-31-14', 220]),
    T('Câu 6. Lớp 3A thu được 21kg giấy vụn, lớp 3B thu được gấp 3 lần lớp 3A. Cả hai lớp thu được số ki-lô-gam giấy vụn là:', ['61kg', '63kg', '82kg', '84kg'], '84kg'),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('496 + 249', '144 - 99', '174 : 3', '665 : 7')),
    B('Câu 8. Tìm x biết:', [ln([timX('345 : x = 132 - 127'), timX('x - 123 = 235 : 5')], 2)]),
    B('Câu 9. Lớp 3A và 3B có tổng cộng 99 học sinh, lớp 3A có số học sinh bằng 1/3 tổng số học sinh của 2 lớp. Tính số học sinh của lớp 3B?', loiVan(['Đáp số: [[n:66]] học sinh'])),
    B('Câu 10. Điền +, −, ×, : vào ô trống sao cho thích hợp:', [ln(['12 [[T:×/+|−|×|:]] 9 [[T:−/+|−|×|:]] 8 = 100'])]),
  ]),
  hk(16, 'Nhân chia, đổi hm – m, chiều rộng hình chữ nhật, số dư lớn nhất, góc vuông, tìm x, một phần mấy, gấp lên.', [
    T('Câu 1. Kết quả của phép tính: 134 × 5 là:', ['650', '670', '660', '680'], '670'),
    T('Câu 2. Kết quả của phép tính: 549 : 9 là:', ['601', '16', '61', '46'], '61'),
    T('Câu 3. 5hm 4m = ……….m. Số thích hợp điền vào chỗ trống là:', ['54', '45', '540', '504'], '504'),
    T('Câu 4. Một hình chữ nhật có chiều dài 36cm, chiều rộng bằng 1/4 chiều dài. Chiều rộng hình chữ nhật là:', ['90cm', '9cm', '45cm', '101cm'], '9cm'),
    T('Câu 5. Một phép chia có số dư lớn nhất là 4. Số chia là:', ['5', '6', '7', '8'], '5'),
    T('Câu 6. Hình sau có số góc vuông là:', ['5', '6', '7', '8'], '6', ['hk-34-15', 220]),
  ], [
    B('Câu 7. Tìm x: (2 điểm)', [ln([timX('243 : x = 341 - 338'), timX('x × 6 = 28 + 8')], 2)], 2),
    B('Câu 8. Hùng có 68 viên bi, Hùng cho Tú 1/4 số bi của mình. Hỏi sau khi cho, Hùng còn lại bao nhiêu viên bi? (2 điểm)', loiVan(['Đáp số: [[n:51]] viên bi']), 2),
    B('Câu 9. Bình có 34 quyển vở, số quyển vở của Ngọc gấp 3 lần số quyển vở của Bình. Tính tổng số quyển vở của Ngọc và Bình? (2 điểm)', loiVan(['Đáp số: [[n:136]] quyển vở']), 2),
    B('Câu 10. Tìm x biết: x : 5 : 2 = 15', [ln(['x = [[N:150]]'])]),
  ]),
  hk(17, 'Giá trị chữ số, biểu thức, đổi hm – m, góc vuông, nhân, gấp lên, đặt tính, một phần mấy, tìm x.', [
    T('Câu 1. Chữ số 8 trong số 689 có giá trị là:', ['8', '80', '800'], '80'),
    T('Câu 2. Giá trị của biểu thức 56 : 7 + 46 là:', ['50', '54', '56'], '54'),
    T('Câu 3. Điền số thích hợp vào chỗ chấm: 4hm 7m = …..m:', ['407', '470', '47'], '407'),
    T('Câu 4. Hình ABCD có số góc vuông là:', ['2', '3', '4'], '2', ['hk-36-16', 200]),
    T('Câu 5. 134 × 7 = … Số thích hợp điền vào chỗ chấm là:', ['936', '948', '938'], '938'),
    T('Câu 6. Gấp 12 lên 6 lần ta được số:', ['2', '70', '72'], '72'),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('131 + 139', '325 - 139', '107 × 8', '364 : 4')),
    B('Câu 8. Một quyển truyện dày 136 trang. An đã đọc được 1/4 số trang đó. Hỏi còn bao nhiêu trang sách An chưa đọc?', loiVan(['Đáp số: [[n:102]] trang'])),
    B('Câu 9. Tìm x:', [ln([timX('x × 5 - 9 = 476'), timX('x : 7 = 72 - 59')], 2)]),
  ]),
  hk(18, 'Số chẵn, số lẻ, đổi m – cm, cộng, gấp lên, một phần mấy, biểu thức, tìm x có dư, chu vi, đếm hình vuông.', [
    T('Câu 1. Số chẵn lớn nhất có 3 chữ số mà tổng các chữ số bằng 11 là:', ['911', '902', '920', '922'], '920'),
    T('Câu 2. Trong các số 357; 339; 597; 539, số lẻ nhỏ nhất là:', ['357', '339', '597', '539'], '339'),
    T('Câu 3. Điền số thích hợp vào chỗ chấm: 3m 19cm = ……cm:', ['319', '49', '94', '391'], '319'),
    T('Câu 4. Kết quả của phép tính 546 + 248 là:', ['790', '794', '784', '708'], '794'),
    T('Câu 5. 19 lít gấp lên 5 lần là:', ['90 lít', '105 lít', '100 lít', '95 lít'], '95 lít'),
    T('Câu 6. Mẹ có 36 quả cam, mẹ cho bà 1/2 số quả cam. Vậy mẹ cho bà số quả cam là:', ['28 quả', '18 quả', '72 quả', '62 quả'], '18 quả'),
  ], [
    B('Câu 7. Tính giá trị của biểu thức:', [ln([tinh('345 + 87 : 3'), tinh('(475 - 384) × 3')], 2)]),
    B('Câu 8. Tìm x:', [ln([timX('x : 5 = 14 (dư 2)'), timX('89 : x = 8 (dư 1)')], 2)]),
    B('Câu 9. Năm nay mẹ 36 tuổi, con ít hơn mẹ 30 tuổi. Hỏi tuổi mẹ gấp mấy lần tuổi con?', loiVan(['Đáp số: [[n:6]] lần'])),
    B('Câu 10. Khu đất hình chữ nhật có chiều rộng 124m, chiều dài gấp 3 lần chiều rộng. Tính chu vi khu đất đó?', loiVan(['Đáp số: [[n:992]] m'])),
    B('Câu 11. Hình bên có bao nhiêu hình vuông?', [hinh('hk-40-17', 200, [ln(['Có [[n:30]] hình vuông.'])])]),
  ]),
  hk(19, 'Tìm số chia có dư, đổi m – cm, một phần mấy, số dư, chu vi hình chữ nhật, góc vuông, tìm x, số bị chia.', [
    T('Câu 1. 74 : x = 8 (dư 2). Giá trị của x là:', ['7', '8', '9', '10'], '9'),
    T('Câu 2. 5m 4dm = ……cm. Số thích hợp điền vào chỗ chấm là:', ['54', '504', '540', '450'], '540'),
    T('Câu 3. Bạn Minh có 45 viên bi, Minh cho Hùng 1/9 số bi. Hỏi Minh còn lại bao nhiêu viên bi?', ['5 viên bi', '40 viên bi', '31 viên bi', '36 viên bi'], '40 viên bi'),
    T('Câu 4. Số dư của phép chia 389 : 7 là:', ['4', '5', '6', '3'], '4'),
    T('Câu 5. Một mảnh đất hình chữ nhật có chiều rộng 30cm, chiều dài gấp 2 lần chiều rộng. Chu vi của hình chữ nhật là:', ['60', '60m', '180cm', '180m'], '180cm'),
    T('Câu 6. Trong hình vẽ bên có số góc vuông là:', ['4', '5', '6', '7'], '6', ['hk-41-18', 220]),
  ], [
    B('Câu 7. Đặt tính rồi tính:', datTinh('665 + 245', '600 - 387', '284 × 3', '780 : 4')),
    B('Câu 8. Tìm x:', [ln([timX('x × 9 + 273 = 363'), timX('x : 7 = 123'), timX('x - 384 + 124 = 173')], 3)]),
    B('Câu 9. Một hình chữ nhật có chiều dài 144cm, chiều rộng bằng 1/3 chiều dài. Tính chu vi hình chữ nhật đó?', loiVan(['Đáp số: [[n:384]] cm'])),
    B('Câu 10. Tìm số bị chia trong phép chia có dư, biết thương là 7 và số chia là 4, số dư là số dư lớn nhất có thể.', [ln(['Số bị chia là: [[n:31]]'])]),
  ]),
  hk(20, 'Chia, bài toán rút về đơn vị, đường gấp khúc, cấu tạo số, biểu thức, gấp lên, tính có đơn vị, tìm x, đếm hình.', [
    T('Câu 1. Kết quả của phép tính 342 : 9 là:', ['48', '38', '28', '40'], '38'),
    T('Câu 2. Có 135 chiếc kẹo được chia đều vào 5 túi. Hỏi 8 chiếc túi như thế đựng được bao nhiêu chiếc kẹo?', ['206 chiếc kẹo', '226 chiếc kẹo', '216 chiếc kẹo', '236 chiếc kẹo'], '216 chiếc kẹo'),
    T('Câu 3. Đường gấp khúc gồm AB và BC. Biết AB bằng 10cm và dài gấp 2 lần BC. Độ dài đường gấp khúc đó là:', ['12cm', '8cm', '15cm', '5cm'], '15cm'),
    T('Câu 4. Số gồm 4 chục, 3 trăm, 5 đơn vị được viết là:', ['435', '345', '543', '534'], '345'),
    T('Câu 5. Kết quả của phép tính 234 × 2 − 129 là:', ['320', '340', '329', '339'], '339'),
    T('Câu 6. 7 lần của 49 lít là:', ['343 lít', '7', '343', '7 lít'], '343 lít'),
  ], [
    B('Câu 7. Đặt tính rồi tính: (2 điểm)', datTinh('345 + 219', '274 - 198', '167 × 3', '184 : 3'), 2),
    B('Câu 8. Tính: (1 điểm)', [ln(['a. 56dm : 8 = [[n:7]] dm', 'b. 9kg × 7 : 3 = [[n:21]] kg', 'c. 14km : 2 + 148km = [[n:155]] km', 'd. 500kg : 2 – 150kg = [[n:100]] kg'], 2)], 1),
    B('Câu 9. Tìm x: (1 điểm)', [ln([timX('x : 112 = 8'), timX('240 : x + 1 = 81 : 9')], 2)], 1),
    B('Câu 10. Một cửa hàng có 165kg gạo. Sau khi bán 45kg gạo, người đó san đều số gạo còn lại vào 8 túi. Hỏi mỗi túi có bao nhiêu ki-lô-gam gạo? (2 điểm)', loiVan(['Đáp số: [[n:15]] kg gạo']), 2),
    B('Câu 11. Hình vẽ sau có bao nhiêu hình tam giác, bao nhiêu hình tứ giác? (1 điểm)', [hinh('hk-46-19', 220, [ln(['[[n:6]] hình tam giác,', '[[n:2]] hình tứ giác.'])])], 1),
  ]),
];
