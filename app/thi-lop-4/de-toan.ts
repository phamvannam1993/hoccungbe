// Toán lớp 4 — chép từ thư mục "de thi toan lop 4": 5 đề kiểm tra giữa kì 1 (Đề 1, 3 từ bản Word; Đề 2, 4, 5
// từ PDF có hướng dẫn giải) và "20 đề thi học kì 1 Toán 4 có đáp án và lời giải chi tiết". Hình vẽ cắt từ PDF
// (public/thi-lop-4), đã xoá chữ chìm. Phép tính tự tính bằng ev(); góc / cạnh đếm trên hình và đối chiếu lời giải.

import type { RawBai, RawBlock, RawPhieu } from '../thi-lop-1/kieu';

const I = (n: string) => `/thi-lop-4/${n}`;

const sach = (expr: string) => expr.replace(/×|x(?=\s*\d)/g, '*').replace(/:/g, '/').replace(/−|–/g, '-');
/** Tính biểu thức số tự nhiên: + − × : và ngoặc; chia phải hết. */
export function ev(expr: string): number {
  const js = sach(expr);
  if (!/^[\d\s+\-*/()]+$/.test(js)) throw new Error(`Biểu thức lạ: ${expr}`);
  const v = Function(`"use strict";return (${js})`)() as number;
  if (!Number.isInteger(v) || v < 0) throw new Error(`Kết quả không phải số tự nhiên: ${expr} = ${v}`);
  return v;
}
const evR = (expr: string) => Function(`"use strict";return (${sach(expr)})`)() as number;
const dep = (s: string) => s.replace(/ - /g, ' − ').replace(/ \* /g, ' × ');

/** Tìm x để đẳng thức đúng. x ở số hạng / thừa số / số bị chia → giải tuyến tính; x ở số chia → thử dần. */
function giai(eq: string): number {
  const [l, r] = eq.split('=');
  const thay = (s: string, x: number) => s.replace(/\b[xya]\b/g, String(x));
  const dung = (x: number) => {
    try {
      return ev(thay(l, x)) === ev(thay(r, x));
    } catch {
      return false;
    }
  };
  const g = (x: number) => evR(thay(l, x)) - evR(thay(r, x));
  const g0 = g(0);
  const g1 = g(1);
  if (Number.isFinite(g0) && g1 !== g0) {
    const x = Math.round(-g0 / (g1 - g0));
    if (x >= 0 && dung(x)) return x;
  }
  for (let x = 1; x <= 5000; x++) if (dung(x)) return x;
  throw new Error(`Không giải được: ${eq}`);
}
const timX = (eq: string, bien = 'x') => `${dep(eq)}   →   ${bien} = [[N:${giai(eq)}]]`;
const tinh = (e: string) => `${dep(e)} = [[n:${ev(e)}]]`;
/** Đặt tính: + − × theo cột; chia ghi thương (và số dư nếu có). */
const datTinh = (...es: string[]): RawBlock[] => {
  const cot = es.filter((e) => !e.includes(':'));
  const chia = es.filter((e) => e.includes(':'));
  const out: RawBlock[] = [];
  if (cot.length) out.push({ t: 'cols', items: cot.map((e) => `${e.replace('-', '−')} = ${ev(e)}`) });
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
const tx = (text: string): RawBlock => ({ t: 'text', text });
const img = (src: string, w = 260): RawBlock => ({ t: 'img', src: I(src), w });
const hinh = (src: string, w: number, blocks: RawBlock[]): RawBlock => ({ t: 'row', widths: ['3fr', '2fr'], cols: [blocks, [img(src, w)]] });
const viet = (dong = 2): RawBlock => ({ t: 'viet', dong });
const loiVan = (dapSo: string[]): RawBlock[] => [viet(2), ln(dapSo)];
const B = (title: string, blocks: RawBlock[], diem?: number): RawBai => ({ title, diem, blocks });
/** Bấm chọn các số đúng trong dãy. */
const chon = (day: (number | string)[], dung: (number | string)[]): RawBlock => ({ t: 'gach', cau: day.join('   '), dung: dung.map(String) });
/** Đúng ghi Đ, sai ghi S. */
const ds = (s: string, d: boolean) => `${s}  [[D:${d ? 'Đ' : 'S'}]]`;
/** Sắp xếp dãy số: ô trống theo thứ tự đúng. */
const xep = (nums: number[], tang: boolean) =>
  [...nums]
    .sort((a, b) => (tang ? a - b : b - a))
    .map((n) => `[[n:${n}]]`)
    .join(' ;  ');
const GOC = 'góc nhọn,góc vuông,góc tù,góc bẹt';
const goc = (ans: string) => `[[t:${ans}/${GOC}]]`;

const gk = (n: number, desc: string, tn: RawBai[], tl: RawBai[], diemTn = 0.5): RawPhieu => ({
  slug: `toan-lop-4-giua-ki-1-de-${n}`,
  title: `Đề kiểm tra giữa kì 1 – Toán lớp 4 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ KIỂM TRA GIỮA HỌC KÌ I – TOÁN 4', `ĐỀ SỐ ${n}`, ' 4'],
  thoiGian: 40,
  phan: { 0: 'I. Trắc nghiệm (4 điểm)', [tn.length]: 'II. Tự luận (6 điểm)' },
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? diemTn })), ...tl],
});
/** Đề 1–10 chia trắc nghiệm / tự luận; đề 11–20 chỉ đánh số câu (điểm chia đều). */
const hk = (n: number, desc: string, tn: RawBai[], tl: RawBai[]): RawPhieu => ({
  slug: `toan-lop-4-hoc-ki-1-de-${n}`,
  title: `Kiểm tra học kì 1 – Toán lớp 4 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ KIỂM TRA HỌC KÌ I – TOÁN 4', `ĐỀ SỐ ${n}`, ' 4'],
  thoiGian: 40,
  phan: tn.length ? { 0: 'I. Phần trắc nghiệm', [tn.length]: 'II. Phần tự luận' } : undefined,
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? 0.5 })), ...tl],
});
const T = (q: string, opts: string[], ans: string, anh?: [string, number], diem?: number) => B(q, [anh ? hinh(anh[0], anh[1], [mc('', opts, ans)]) : mc('', opts, ans)], diem);
/** Đặt tính bốn phép (đề HK 1–10, bài 1). */
const dt = (title: string, ...es: string[]) => B(title, datTinh(...es));

/* ───────────── 5 đề giữa kì I ───────────── */

export const DE_GK4: RawPhieu[] = [
  gk(1, 'Đọc viết số, giá trị chữ số, trung bình cộng, đổi tấn – kg, phút – giây, góc, tổng – hiệu, chu vi hình chữ nhật.', [
    T('Câu 1. Số “Sáu trăm mười lăm nghìn không trăm bảy mươi tám” viết là:', ['610 578', '615 078', '6 150 078', '615 780'], '615 078'),
    T('Câu 2. Trong các số dưới đây, chữ số 7 trong số nào có giá trị là 7000?', ['71 608', '57 312', '570 064', '703 890'], '57 312'),
    T('Câu 3. Lớp 4A có 35 học sinh, lớp 4B có 38 học sinh, lớp 4C có 32 học sinh. Hỏi trung bình mỗi lớp có bao nhiêu học sinh?', ['35 học sinh', '33 học sinh', '32 học sinh', '105 học sinh'], '35 học sinh'),
    T('Câu 4. 3 tấn 54 kg = …….. kg. Số thích hợp điền vào chỗ chấm là:', ['30540', '3540', '3054', '3504'], '3054'),
    T('Câu 5. Số thích hợp điền vào chỗ chấm 6 phút 18 giây = …..… giây là:', ['198', '378', '318', '360'], '378'),
    T('Câu 6. Số lớn nhất trong các số 673 412; 627 421; 624 721; 687 421 là:', ['673 412', '627 421', '624 721', '687 421'], '687 421'),
    T('Câu 7. Với a là số lẻ lớn nhất có 1 chữ số thì biểu thức 1250 + 5 × a có giá trị là:', ['1255', '11295', '1290', '1295'], '1295'),
    T('Câu 8. Hình dưới đây có:', ['2 góc vuông, 2 góc nhọn', '2 góc vuông, 2 góc tù', '2 góc vuông, 1 góc nhọn, 1 góc tù', '1 góc vuông, 2 góc nhọn, 1 góc tù'], '2 góc vuông, 1 góc nhọn, 1 góc tù', ['gk1-c8', 240]),
  ], [
    B('Câu 1 (1 điểm). Đặt tính rồi tính:', datTinh('514626 + 8236', '987864 - 783259'), 1),
    B('Câu 2 (2 điểm)', [ln(['a) Tính giá trị của biểu thức: ' + tinh('11142 : 9 + 7256 × 3'), 'b) Tìm x, biết: ' + timX('90532 - x = 26735')])], 2),
    B('Câu 3 (2 điểm). Hai thửa ruộng thu hoạch được tất cả 3 tấn 7 tạ thóc. Biết rằng thửa ruộng thứ nhất thu hoạch được ít hơn thửa ruộng thứ hai là 500 kg. Hỏi mỗi thửa ruộng thu được bao nhiêu ki-lô-gam thóc?', loiVan(['Đáp số: Thửa thứ nhất: [[n:1600]] kg thóc;  Thửa thứ hai: [[n:2100]] kg thóc']), 2),
    B('Câu 4 (1 điểm). Một mảnh đất hình chữ nhật có chiều rộng 25 m, chiều dài gấp 4 lần chiều rộng. Tính chu vi mảnh đất hình chữ nhật đó.', loiVan(['Đáp số: [[n:250]] m']), 1),
  ]),
  gk(2, 'Giá trị chữ số, số lớn nhất, đổi tấn – tạ, phút – giây, diện tích hình chữ nhật, thế kỉ, góc, trung bình cộng, tổng – hiệu.', [
    T('Câu 1. Giá trị của chữ số 8 trong số 123 846 579 là:', ['80', '800', '8000', '800 000'], '800 000'),
    T('Câu 2. Số lớn nhất gồm 5 chữ số khác nhau là:', ['99998', '98756', '98765', '99987'], '98765'),
    T('Câu 3. 6 tấn 45 tạ = ........... tạ. Số cần điền là:', ['645', '105', '1005', '6045'], '105'),
    T('Câu 4. 2 phút 25 giây = .............. giây. Số cần điền là:', ['115', '125', '135', '145'], '145'),
    T('Câu 5. Một hình chữ nhật có chu vi là 36 cm, chiều rộng bằng 6 cm. Diện tích của hình chữ nhật đó là:', ['72 cm²', '36 cm²', '108 cm²', '48 cm²'], '72 cm²'),
    T('Câu 6. Bác Hồ đọc bản tuyên ngôn độc lập năm 1945. Năm đó thuộc thế kỉ nào?', ['XVIII', 'XX', 'XIX', 'XXI'], 'XX'),
    B('Câu 7. Điền số vào chỗ trống: Trong hình bên:', [hinh('gk2-c7', 240, [ln(['a) Tam giác ADC có [[n:2]] góc nhọn, [[n:1]] góc vuông.', 'b) Tứ giác ABCD có [[n:1]] góc tù.'])])], 1),
  ], [
    B('Câu 1 (1 điểm). Đặt tính rồi tính:', datTinh('182954 + 24643', '628362 - 48272'), 1),
    B('Câu 2 (1 điểm)', [ln(['a) Tính giá trị của biểu thức 1568 – m × n với m = 148, n = 3:   ' + tinh('1568 - 148 × 3'), 'b) Tính bằng cách thuận tiện nhất: ' + tinh('677 + 969 + 123 + 31')])], 1),
    B('Câu 3 (2 điểm). Hải có 36 viên bi, Hà có 48 viên bi và Nam có số bi nhiều hơn trung bình cộng của Hải và Hà là 15 viên. Tính trung bình số bi của ba bạn?', loiVan(['Đáp số: [[n:47]] viên bi']), 2),
    B('Câu 4 (2 điểm). Trong thư viện có 1842 quyển sách. Trong đó sách giáo khoa nhiều hơn sách đọc thêm là 916 quyển. Hỏi thư viện đó có bao nhiêu quyển sách mỗi loại?', loiVan(['Đáp số: Sách giáo khoa: [[n:1379]] quyển;  Sách đọc thêm: [[n:463]] quyển']), 2),
  ]),
  gk(3, 'Hàng và lớp, viết số, so sánh số, đổi tấn – kg, diện tích, thế kỉ, đếm góc, trung bình cộng, tổng – hiệu.', [
    T('Câu 1. Chữ số 5 trong số 950 174 thuộc hàng ........, lớp ..........', ['Hàng nghìn, lớp nghìn', 'Hàng trăm, lớp đơn vị', 'Hàng trăm nghìn, lớp nghìn', 'Hàng chục nghìn, lớp nghìn'], 'Hàng chục nghìn, lớp nghìn'),
    T('Câu 2. Số gồm 8 triệu, 4 chục nghìn, 5 chục, 9 đơn vị viết là:', ['84 000 059', '8 400 059', '8 040 059', '80 400 059'], '8 040 059'),
    T('Câu 3. Chữ cái a được thay bằng chữ số nào để 462a27 > 462 885?', ['6', '7', '8', '9'], '9'),
    T('Câu 4. 4 tấn 8kg = ............ kg', ['408', '4080', '480', '4008'], '4008'),
    T('Câu 5. Một hình chữ nhật có chiều dài 15cm, chiều rộng bằng 1/3 chiều dài. Vậy diện tích của hình chữ nhật đó là:', ['75 cm²', '5 cm²', '20 cm²', '40 cm²'], '75 cm²'),
    T('Câu 6. Năm 1647 thuộc thế kỉ ..............', ['XV', 'XVII', 'XIV', 'XVI'], 'XVII'),
  ], [
    B('Câu 1 (1 điểm). Đặt tính rồi tính:', datTinh('260482 + 58283', '83752 - 62748'), 1),
    B('Câu 2 (1 điểm). Điền số vào chỗ trống. Trong hình vẽ có:', [hinh('gk3-c2', 260, [ln(['[[n:4]] góc nhọn', '[[n:2]] góc vuông', '[[n:2]] góc tù', '[[n:1]] góc bẹt'], 2)])], 1),
    B('Câu 3 (2 điểm). Trung bình cộng số tuổi của hai bố con Mai là 26 tuổi. Tính tuổi của mỗi người, biết bố hơn Mai 28 tuổi.', loiVan(['Đáp số: Bố: [[n:40]] tuổi;  Mai: [[n:12]] tuổi']), 2),
    B('Câu 4 (2 điểm). Một cửa hàng có 2 bao gạo nếp, mỗi bao cân nặng 38kg và 6 bao gạo tẻ, mỗi bao cân nặng 54kg. Trung bình mỗi bao gạo cân nặng bao nhiêu ki-lô-gam?', loiVan(['Đáp số: [[n:50]] kg']), 2),
  ], 4 / 6),
  gk(4, 'Giá trị chữ số, trung bình cộng, thế kỉ, tìm x, tổng – hiệu, diện tích hình vuông, đổi tấn – kg, xem lịch, đếm góc.', [
    T('Câu 1. Giá trị của chữ số 6 trong số 176 829 891 là:', ['6 000', '60 000', '600 000', '6 000 000'], '6 000 000'),
    T('Câu 2. Trung bình cộng của các số 92, 18, 47, 63 là:', ['55', '54', '53', '52'], '55'),
    T('Câu 3. Nhà Trần thành lập năm 1226, đó là thế kỉ thứ mấy?', ['X', 'XI', 'XII', 'XIII'], 'XIII'),
    T('Câu 4. Tìm x, biết: x – 97128 = 5267', ['x = 91861', 'x = 102395', 'x = 102359', 'x = 102385'], 'x = 102395'),
    T('Câu 5. Hai tấm vải dài 135m, tấm vải xanh dài hơn tấm vải hoa 9m. Hỏi mỗi tấm vải dài bao nhiêu mét?', ['63m và 72m', '62m và 73m', '60m và 75m', '67m và 71m'], '63m và 72m'),
    T('Câu 6. Một mảnh đất hình vuông có chu vi bằng 96 m. Diện tích của mảnh đất bằng:', ['120 m²', '384 m²', '576 m²', '192 m²'], '576 m²'),
    T('Câu 7. Số cần điền vào chỗ chấm 3052 kg = …… tấn ……. kg là:', ['3 tấn 520 kg', '30 tấn 52 kg', '3 tấn 52 kg', '3 tấn 502 kg'], '3 tấn 52 kg'),
    T('Câu 8. Thứ bảy này là ngày 26 tháng 8 thì thứ bảy tuần tới là:', ['1 tháng 9', '2 tháng 9', '3 tháng 9', '4 tháng 9'], '2 tháng 9'),
  ], [
    B('Câu 1 (1 điểm). Đặt tính rồi tính:', datTinh('85953 + 68494', '79357 - 55738'), 1),
    B('Câu 2 (1 điểm). Cho hình vẽ sau:', [hinh('gk4-c2', 150, [ln(['a) Hình vẽ trên có số góc vuông là: [[n:4]] góc vuông.', 'b) Hình vẽ trên có số góc nhọn là: [[n:2]] góc nhọn.', 'c) Hình vẽ trên có số góc tù là: [[n:2]] góc tù.'])])], 1),
    B('Câu 3 (2 điểm). Một thửa ruộng hình chữ nhật có chu vi là 50 m. Nếu bớt chiều dài đi 7m thì được chiều rộng. Tính diện tích của thửa ruộng hình chữ nhật đó.', loiVan(['Đáp số: [[n:144]] m²']), 2),
    B('Câu 4 (2 điểm). Tính bằng cách thuận tiện:', [ln(['a) ' + tinh('54397 + 2457 + 5603 + 1543'), 'b) ' + tinh('913 + 6742 + 1089 - 742 - 13 + 11')])], 2),
  ]),
  gk(5, 'Đọc số, so sánh số, thế kỉ, góc, trung bình cộng, đổi tấn – kg, giờ – phút, kg – dag, đặt tính, diện tích, tính thuận tiện.', [
    T('Câu 1. Số 37 682 915 được đọc là:', ['Ba bảy triệu tám trăm sáu mươi hai nghìn chín trăm mười năm', 'Ba mươi bảy triệu sáu trăm tám hai nghìn chín trăm', 'Ba mươi bảy triệu sáu trăm tám mươi hai nghìn chín trăm mười lăm', 'Ba mươi bảy triệu tám trăm sáu mươi hai nghìn chín trăm mười lăm'], 'Ba mươi bảy triệu sáu trăm tám mươi hai nghìn chín trăm mười lăm'),
    T('Câu 2. Số lớn nhất trong các số 927 852; 927 174; 927 847; 927 902 là:', ['927 852', '927 174', '927 847', '927 902'], '927 902'),
    T('Câu 3. Năm 1523 thuộc thế kỉ:', ['Thế kỉ XVII', 'Thế kỉ XIV', 'Thế kỉ XV', 'Thế kỉ XVI'], 'Thế kỉ XVI'),
    T('Câu 4. Hình bên có:', ['1 góc bẹt, 1 góc tù, 5 góc vuông và 1 góc nhọn', '1 góc bẹt, 5 góc vuông, 2 góc nhọn', '1 góc bẹt, 1 góc tù, 5 góc vuông, 2 góc nhọn', '1 góc bẹt, 1 góc tù, 4 góc vuông, 2 góc nhọn'], '1 góc bẹt, 1 góc tù, 5 góc vuông, 2 góc nhọn', ['gk5-c4', 130]),
    T('Câu 5. Trung bình cộng của hai số là 218. Biết số thứ nhất là 198. Số thứ hai là:', ['238', '20', '208', '178'], '238'),
    T('Câu 6. 5 tấn 7 yến = ……. kg', ['570', '5700', '5070', '5007'], '5070'),
    T('Câu 7. 7 giờ 32 phút = ……… phút', ['732 phút', '7032 phút', '432 phút', '452 phút'], '452 phút'),
    T('Câu 8. 6kg 7dag > ……….. dag', ['67', '607', '670', '760'], '67'),
  ], [
    B('Câu 1 (1 điểm).', [
      ln([
        'a) Viết số gồm 4 triệu, 9 trăm nghìn, 6 nghìn, 7 trăm, 2 chục: [[n:4906720]]',
        'b) Đọc số 325 004 789: [[w:ba trăm hai mươi lăm triệu không trăm linh bốn nghìn bảy trăm tám mươi chín|ba trăm hai mươi lăm triệu không trăm lẻ bốn nghìn bảy trăm tám mươi chín|ba trăm hai mươi lăm triệu không trăm linh tư nghìn bảy trăm tám mươi chín|ba trăm hai mươi lăm triệu không trăm lẻ tư nghìn bảy trăm tám mươi chín]]',
      ]),
    ], 1),
    B('Câu 2 (2 điểm). Đặt tính rồi tính:', datTinh('378427 + 419384', '516234 - 24927', '23096 × 5', '29754 : 8'), 2),
    B('Câu 3 (2 điểm). Một hình chữ nhật có chu vi là 188 cm, chiều dài hơn chiều rộng là 30 cm. Tính diện tích hình chữ nhật đó.', loiVan(['Đáp số: [[n:1984]] cm²']), 2),
    B('Câu 4 (1 điểm). Tính bằng cách thuận tiện nhất:', [ln([tinh('1463 + 267 + 1537 + 873 + 1733')])], 1),
  ]),
];

/* ───────────── 20 đề học kì I ───────────── */

export const DE_HK4: RawPhieu[] = [
  hk(1, 'Đọc số, so sánh, giá trị biểu thức, rút về đơn vị, tổng – hiệu, đặt tính, sắp xếp, tìm x, chu vi – diện tích.', [
    T('Câu 1. Số 93 085 đọc là:', ['Chín nghìn ba mươi trăm tám mươi lăm', 'Chín trăm ba mươi trăm tám mươi lăm', 'Chín mươi ba nghìn không trăm tám mươi lăm', 'Chín ba nghìn không tám lăm'], 'Chín mươi ba nghìn không trăm tám mươi lăm'),
    T('Câu 2. Số lớn nhất trong các số: 85 091, 85 190, 58 901, 58 910 là:', ['85 091', '85 190', '58 901', '58 910'], '85 190'),
    T('Câu 3. Điền dấu (>, <, =) vào chỗ chấm:   60 240 …… 60 000 + 200 + 4', ['<', '>', '='], '>'),
    T('Câu 4. Nếu a = 8260 thì giá trị biểu thức 35420 – a : 4 là:', ['2 065', '8 855', '6 790', '33 355'], '33 355'),
    T('Câu 5. Một tổ công nhân trong 5 ngày làm được 425 dụng cụ. Hỏi với mức làm như thế thì trong 9 ngày tổ công nhân đó làm được bao nhiêu dụng cụ?', ['765 dụng cụ', '675 dụng cụ', '756 dụng cụ', '567 dụng cụ'], '765 dụng cụ'),
    T('Câu 6. Hai số có tổng là 1035, số lớn hơn số bé 117 đơn vị. Vậy số lớn là:', ['459', '567', '576', '765'], '576'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '72638 + 80133', '780135 - 498023', '2316 × 42', '13036 : 28'),
    B('Bài 2.', [ln(['a) Sắp xếp các số 37 109; 29 815; 48 725; 19 624; 20 001 theo thứ tự từ bé đến lớn:', xep([37109, 29815, 48725, 19624, 20001], true), 'b) Sắp xếp các số 65 008; 27 912; 84 109; 12 754; 39 789 theo thứ tự từ lớn đến bé:', xep([65008, 27912, 84109, 12754, 39789], false)])]),
    B('Bài 3. Tính giá trị của biểu thức sau:', [ln(['a) ' + tinh('7536 - 124 × 5'), 'b) ' + tinh('(7536 + 124) : 5')], 2)]),
    B('Bài 4. Tìm x, biết:', [ln([timX('3408 + x = 8034'), timX('x - 1276 = 4324'), timX('x × 8 = 2016'), timX('x : 6 = 2025')], 2)]),
    B('Bài 5. Một hình chữ nhật có chiều dài 124cm, chiều rộng bằng 1/4 chiều dài. Tính chu vi và diện tích hình chữ nhật đó.', loiVan(['Đáp số: Chu vi: [[n:310]] cm;  Diện tích: [[n:3844]] cm²'])),
  ]),
  hk(2, 'Số lớn nhất, giá trị chữ số, đổi km – m, trung bình cộng, viết biểu thức, dấu hiệu chia hết, tổng – hiệu.', [
    T('Câu 1. Số tự nhiên lớn nhất có năm chữ số khác nhau là:', ['90000', '99999', '98765', '97531'], '98765'),
    T('Câu 2. Giá trị của chữ số 9 trong số 693 482 là:', ['9', '900', '9 000', '90 000'], '90 000'),
    T('Câu 3. Hiệu của số bé nhất có năm chữ số khác nhau và số lớn nhất có ba chữ số là:', ['9 023', '9 327', '9 235', '9 236'], '9 235'),
    T('Câu 4. Một hình vuông có diện tích 100cm². Chu vi hình vuông đó là:', ['40cm', '50cm', '25cm', '10cm'], '40cm'),
    T('Câu 5. Điền số thích hợp vào chỗ chấm: 3km 42m = …….. m', ['342', '3042', '3420', '30042'], '3042'),
    T('Câu 6. Trung bình cộng của hai số là 88, số thứ nhất là 53. Số thứ hai là:', ['35', '38', '135', '123'], '123'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '28027 + 80133', '104672 - 83528', '1378 × 35', '40782 : 36'),
    B('Bài 2. Viết biểu thức và tính giá trị biểu thức:', [ln(['a) Nhân 24 với tổng của 1324 và 2107:   ' + tinh('24 × (1324 + 2107)'), 'b) 10318 trừ đi tích của 528 và 16:   ' + tinh('10318 - 528 × 16')])]),
    (() => {
      const day = [75, 358, 3457, 4560, 915, 2464, 2367, 2050, 3132, 7815];
      const loc = (f: (n: number) => boolean) => day.filter(f);
      return B('Bài 3. Trong các số: 75; 358; 3457; 4560; 915; 2464; 2367; 2050; 3132; 7815 (bấm chọn các số đúng)', [
        tx('a) Các số chia hết cho 2 là:'),
        chon(day, loc((n) => n % 2 === 0)),
        tx('b) Các số chia hết cho 3 là:'),
        chon(day, loc((n) => n % 3 === 0)),
        tx('c) Các số chia hết cho 5 là:'),
        chon(day, loc((n) => n % 5 === 0)),
        tx('d) Các số chia hết cho 9 là:'),
        chon(day, loc((n) => n % 9 === 0)),
        tx('e) Các số chia hết cho cả 2 và 5 là:'),
        chon(day, loc((n) => n % 10 === 0)),
      ]);
    })(),
    B('Bài 4. Vừa qua trường phát động phong trào ủng hộ các bạn học sinh vùng lũ lụt. Lớp 4A ủng hộ được 186 000 đồng, lớp 4B ủng hộ được 171 000 đồng, lớp 4C ủng hộ ít hơn lớp 4A là 18 000 đồng. Hỏi trung bình mỗi lớp ủng hộ được bao nhiêu tiền?', loiVan(['Đáp số: [[n:175000]] đồng'])),
    B('Bài 5. Một sân trường hình chữ nhật có chu vi là 492m, chiều dài hơn chiều rộng 32m. a) Tính chiều dài và chiều rộng của sân trường. b) Tính diện tích của sân trường.', loiVan(['Đáp số: a) Chiều dài: [[n:139]] m;  Chiều rộng: [[n:107]] m', 'b) Diện tích: [[n:14873]] m²'])),
  ]),
  hk(3, 'Viết số, giá trị chữ số, tổng – hiệu, chia hết cho 2 và 5, trung bình cộng, đổi tấn – kg, so sánh, tìm x, phân số của số.', [
    T('Câu 1. Số gồm: năm mươi triệu, năm mươi nghìn và năm mươi viết là:', ['50 500 500', '50 050 050', '50 005 005', '50 500 050'], '50 050 050'),
    T('Câu 2. Chữ số 8 trong số 856 127 có giá trị là:', ['800 000', '80 000', '8 000', '80'], '800 000'),
    T('Câu 3. Tổng hai số là 145 và hiệu hai số đó là 29 thì số lớn là:', ['116', '58', '99', '87'], '87'),
    T('Câu 4. Trong các số 100; 365; 752; 565; 980 số vừa chia hết cho 2, vừa chia hết cho 5 là:', ['980; 100', '365; 565', '100; 365', '980; 752'], '980; 100'),
    T('Câu 5. Trung bình cộng của hai số là 1204. Số bé là 486 thì số lớn là:', ['1922', '2408', '718', '1690'], '1922'),
    T('Câu 6. Điền số thích hợp vào chỗ chấm: 2 tấn 5 yến =………... kg', ['250', '2500', '2050', '2000'], '2050'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '306291 + 115876', '629045 - 358991', '875 × 52', '30027 : 123'),
    B('Bài 2. Điền dấu (>, <, =) thích hợp vào ô trống:', [ln(['678 645 [[C:>]] 95 976', '700 000 [[C:>]] 699 998', '528 725 [[C:<]] 588 752', '99 999 [[C:<]] 100 000', '345 012 [[C:=]] 345 000 + 12'], 2)]),
    B('Bài 3. Viết các số sau theo thứ tự từ bé đến lớn: 129 000 ; 98 705 ; 128 999 ; 300 000 ; 288 601.', [ln([xep([129000, 98705, 128999, 300000, 288601], true)])]),
    B('Bài 4. Tìm x, biết:', [ln([timX('x + 1760 = 10345'), timX('x : 18 - 844 = 1025')], 2)]),
    B('Bài 5. Một vườn trồng cây ăn quả có tất cả 36 000 cây, trong đó 1/5 số cây là cây nhãn, số cây vải gấp 2 lần số cây nhãn, còn lại là cây cam. Hỏi mỗi loại có bao nhiêu cây?', loiVan(['Đáp số: Nhãn: [[n:7200]] cây;  Vải: [[n:14400]] cây;  Cam: [[n:14400]] cây'])),
  ]),
  hk(4, 'Số chẵn lớn nhất, so sánh, cấu tạo số, biểu thức, đổi tấn – kg, dm² – m², tìm x, tổng – hiệu, tính nhanh.', [
    T('Câu 1. Số chẵn lớn nhất có 6 chữ số là:', ['888 888', '989 898', '999 899', '999 998'], '999 998'),
    T('Câu 2. Số lớn nhất trong các số sau: 987543; 997889; 899987; 987658 là:', ['987543', '997889', '899987', '987658'], '997889'),
    T('Câu 3. Số bé nhất có 6 chữ số mà tổng 6 chữ số bằng 3 là:', ['101 010', '100 011', '100 002', '210 000'], '100 002'),
    T('Câu 4. Giá trị của biểu thức 468 : 3 + 61 × 4 là:', ['868', '217', '300', '400'], '400'),
    T('Câu 5. Điền số thích hợp vào chỗ chấm: 4 tấn 70kg = ….... kg.', ['4070', '40070', '4700', '40700'], '4070'),
    T('Câu 6. Điền số thích hợp vào chỗ chấm: 68000dm² = ….... m²', ['6800', '68', '680', '680000'], '680'),
  ], [
    dt('Câu 1. Đặt tính rồi tính:', '37052 + 28456', '596178 - 44695', '487 × 215', '45138 : 37'),
    B('Câu 2. Tìm x:', [ln([timX('x : 48 = 792'), timX('2471 - x × 27 = 1526')], 2)]),
    B('Câu 3. Một đội công nhân hai ngày sửa được 3 450m đường. Ngày thứ nhất sửa ít hơn ngày thứ hai là 176m đường. Hỏi mỗi ngày đội đó sửa được bao nhiêu mét đường?', loiVan(['Đáp số: Ngày thứ nhất: [[n:1637]] m;  Ngày thứ hai: [[n:1813]] m'])),
    B('Câu 4. Tính nhanh:', [ln(['a) ' + tinh('2010 × 32 + 2010 × 67 + 2010'), 'b) ' + tinh('34 × 13 + 68 × 43 + 34')])]),
  ]),
  hk(5, 'Lớp nghìn, giá trị chữ số, chia hết cho 9, đổi dm² – cm², tìm x, diện tích hình bình hành, biểu thức, tổng – hiệu.', [
    T('Câu 1. Các chữ số thuộc lớp nghìn trong số 205 341 678 là:', ['6, 7, 8', '1, 6, 7', '3, 4, 1', '2, 0, 5'], '3, 4, 1'),
    T('Câu 2. Chữ số 2 trong số 520 071 có giá trị là:', ['2', '20', '2000', '20000'], '20000'),
    T('Câu 3. Trong các số: 605, 7362, 1207, 20641, số chia hết cho 9 là:', ['605', '7362', '1207', '20641'], '7362'),
    T('Câu 4. 10dm² 2cm² = ……….cm². Số thích hợp điền vào chỗ chấm là:', ['1020', '102', '1002', '120'], '1002'),
    T('Câu 5. Biết x × 45 = 5760. Giá trị của x là:', ['128', '182', '218', '281'], '128'),
    T('Câu 6. Một hình bình hành có độ dài đáy là 5m, chiều cao tương ứng là 34dm. Diện tích hình bình hành đó là:', ['85dm²', '170dm²', '850dm²', '1700dm²'], '1700dm²'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '410372 + 28459', '100395 - 64827', '1276 × 254', '73426 : 145'),
    B('Bài 2. Tính giá trị của biểu thức:', [ln(['a) ' + tinh('54673 + 2468 × 5 - 34142'), 'b) ' + tinh('26781 : 3 + 7567 × 4')])]),
    B('Bài 3. Tìm chữ số x để số 4x72 chia hết cho 3 (bấm chọn tất cả các chữ số đúng):', [chon([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [2, 5, 8])]),
    B('Bài 4. Một mảnh vườn hình chữ nhật có chu vi 148m, chiều dài hơn chiều rộng 26m. Trên mảnh vườn đó người ta trồng cà chua, trung bình cứ 5m² thu được 18kg cà chua. Hỏi trên mảnh vườn đó người ta thu được tất cả bao nhiêu ki-lô-gam cà chua?', loiVan(['Đáp số: [[n:4320]] kg cà chua'])),
    B('Bài 5. Tìm một số có 3 chữ số biết chữ số hàng trăm gấp 5 lần chữ số hàng đơn vị và tổng 3 chữ số bằng số nhỏ nhất có 2 chữ số.', [ln(['Số đó là: [[n:541]]'])]),
  ]),
  hk(6, 'Hàng của chữ số, tìm y, trung bình cộng, thế kỉ, đổi dag – g, đếm góc, tìm x, tổng – hiệu, tính thuận tiện.', [
    T('Câu 1. Chữ số 9 trong số 671 935 thuộc hàng:', ['Hàng chục nghìn', 'Hàng nghìn', 'Hàng chục', 'Hàng trăm'], 'Hàng trăm'),
    T('Câu 2. Giá trị của y trong biểu thức y : 11 = 89 là:', ['989', '979', '797', '980'], '979'),
    T('Câu 3. Số trung bình cộng của các số sau: 307, 412 và 154 là:', ['291', '283', '300', '873'], '291'),
    T('Câu 4. Bác Hồ sinh năm 1890. Bác Hồ sinh vào thế kỉ nào?', ['Thế kỉ 17', 'Thế kỉ 18', 'Thế kỉ 19', 'Thế kỉ 20'], 'Thế kỉ 19'),
    T('Câu 5. 5dag = …….. g. Số thích hợp để viết vào chỗ chấm là:', ['50', '500', '5', '5000'], '50'),
    T('Câu 6. Cho hình vẽ như sau. Hình vẽ đã cho có:', ['3 góc nhọn, 2 góc vuông, 2 góc tù', '4 góc nhọn, 3 góc vuông, 1 góc tù', '4 góc nhọn, 3 góc vuông, 2 góc tù', '3 góc nhọn, 3 góc vuông, 3 góc tù'], '4 góc nhọn, 3 góc vuông, 1 góc tù', ['d6-c6', 230]),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '125359 + 524686', '72058 - 24129', '2021 × 235', '25710 : 46'),
    B('Bài 2. Tìm x, biết:', [ln([timX('x : 11 = 1234 - 1156'), timX('148 × x = 25 × 444')], 2)]),
    B('Bài 3. Cả hai thửa ruộng thu hoạch được 12 tấn 5 tạ thóc. Thửa ruộng thứ nhất thu hoạch được nhiều hơn thửa ruộng thứ hai 17 tạ thóc. Hỏi mỗi thửa ruộng thu hoạch được bao nhiêu tạ thóc?', loiVan(['Đáp số: Thửa thứ nhất: [[n:71]] tạ;  Thửa thứ hai: [[n:54]] tạ'])),
    B('Bài 4. Tính bằng cách thuận tiện nhất:', [ln(['a) ' + tinh('135 × 4 × 25'), 'b) ' + tinh('6789 × 123 - 6789 × 23')])]),
  ]),
  hk(7, 'Giá trị chữ số, so sánh tạ – kg, giờ – phút, trung bình cộng, thế kỉ, hình bình hành, sắp xếp, chia hết cho 9, tổng – hiệu.', [
    T('Câu 1. Giá trị của chữ số 3 trong số 387 492 là:', ['300', '3000', '30 000', '300 000'], '300 000'),
    T('Câu 2. Điền dấu >, <, = thích hợp vào chỗ chấm:   3 tạ 4kg .… 340kg', ['<', '>', '='], '<'),
    T('Câu 3. Viết số thích hợp vào chỗ chấm: 3 giờ 20 phút = …… phút.', ['320', '200', '150', '240'], '200'),
    T('Câu 4. Số trung bình cộng của các số 48; 111; 215 và 466 là:', ['210', '220', '230', '240'], '210'),
    T('Câu 5. Mùa xuân năm 2009 kỉ niệm 220 năm Quang Trung đại phá quân Thanh. Như vậy Quang Trung đại phá quân Thanh năm nào? Năm đó thuộc thế kỉ mấy?', ['Năm 1689, thuộc thế kỉ thứ 17.', 'Năm 1789, thuộc thế kỉ thứ 18.', 'Năm 1889, thuộc thế kỉ thứ 18.', 'Năm 1889, thuộc thế kỉ thứ 19.'], 'Năm 1789, thuộc thế kỉ thứ 18.'),
    T('Câu 6. Một mảnh đất trồng hoa hình bình hành có độ dài đáy 4m, chiều cao là 24dm. Diện tích của mảnh đất đó là:', ['48m²', '480dm²', '96m²', '960dm²'], '960dm²'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '37456 + 90345', '813521 - 25672', '2163 × 203', '32328 : 24'),
    B('Bài 2.', [ln(['a) Viết các số 644 999 ; 3 670 012 ; 645 702 ; 645 712 ; 645 803 theo thứ tự giảm dần:', xep([644999, 3670012, 645702, 645712, 645803], false), 'b) Chữ số x để số 34x8 chia hết cho 9 là: x = [[N:3]]'])]),
    B('Bài 3. Tính bằng cách thuận tiện nhất:', [ln(['a) ' + tinh('2 × 357 × 5'), 'b) ' + tinh('234 × 95 + 5 × 234')], 2)]),
    B('Bài 4. Tổng số tuổi của mẹ và con là 49 tuổi. Mẹ hơn con 31 tuổi. Hỏi mẹ bao nhiêu tuổi, con bao nhiêu tuổi?', loiVan(['Đáp số: Mẹ: [[n:40]] tuổi;  Con: [[n:9]] tuổi'])),
    B('Bài 5. Tìm số bị chia nhỏ nhất trong phép chia có thương là 35 và số dư là 44.', [ln(['Số bị chia nhỏ nhất là: [[n:1619]]'])]),
  ]),
  hk(8, 'Giá trị chữ số, đổi yến – tấn, m² – dm², trung bình cộng, đếm góc, chia hết cho 5, tìm x, diện tích, giá trị biểu thức.', [
    T('Câu 1. Giá trị của chữ số 5 trong số bé nhất có 6 chữ số khác nhau là:', ['5', '50', '500', '5000'], '5'),
    T('Câu 2. Viết số thích hợp vào chỗ chấm: 300 yến = …… tấn', ['3', '30', '3000', '30000'], '3'),
    T('Câu 3. Viết số thích hợp vào chỗ chấm: 4m² 15dm² = …... dm²', ['40015', '4150', '4015', '415'], '415'),
    T('Câu 4. Trung bình cộng của hai số là 123. Số bé là 58 thì số lớn là:', ['65', '75', '115', '188'], '188'),
    T('Câu 5. Hình bên có:', ['1 góc nhọn, 1 góc tù và 2 góc vuông.', '1 góc nhọn, 2 góc tù và 2 góc vuông.', '2 góc nhọn, 1 góc tù và 2 góc vuông.', '1 góc nhọn, 1 góc tù và 3 góc vuông.'], '1 góc nhọn, 2 góc tù và 2 góc vuông.', ['d8-c5', 200]),
    T('Câu 6. Trong các số dưới đây số nào chia hết cho 5?', ['70963', '90411', '65940', '55948'], '65940'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '386154 + 260765', '126485 - 52936', '308 × 263', '25176 : 35'),
    B('Bài 2. Tìm x:', [ln([timX('x × 74 = 18944'), timX('x + 246572 = 1584 × 278')], 2)]),
    B('Bài 3. Một mảnh đất hình chữ nhật có chu vi là 144m, chiều rộng kém chiều dài 24m. Tính diện tích mảnh đất hình chữ nhật đó.', loiVan(['Đáp số: [[n:1152]] m²'])),
    B('Bài 4. Tính giá trị của biểu thức a + 567 × b, với a là số bé nhất có ba chữ số khác nhau và b là số lớn nhất có hai chữ số.', [ln(['a = [[n:102]] ;   b = [[n:99]]', `a + 567 × b = [[n:${ev('102 + 567 × 99')}]]`])]),
  ]),
  hk(9, 'Hàng của chữ số, so sánh, trung bình cộng, đổi tấn – yến, chia hết cho 2 và 5, xem lịch, tìm x, thế kỉ, tổng – hiệu, tính nhanh.', [
    T('Câu 1. Chữ số 7 trong số 587964 thuộc hàng nào?', ['Hàng trăm', 'Hàng nghìn', 'Hàng chục', 'Hàng đơn vị'], 'Hàng nghìn'),
    T('Câu 2. Trong các số 1397 ; 1367 ; 1697 ; 1679 số lớn nhất là số:', ['1397', '1367', '1697', '1679'], '1697'),
    T('Câu 3. Trung bình cộng của các số 314, 326, 338, 350 là:', ['180', '332', '284', '386'], '332'),
    T('Câu 4. Số thích hợp điền vào chỗ chấm để 2 tấn = … yến là:', ['200', '20', '20000', '2000'], '200'),
    T('Câu 5. Trong các số sau số vừa chia hết cho 2 vừa chia hết cho 5 là:', ['545', '405', '504', '450'], '450'),
    T('Câu 6. Ngày 23 tháng 5 là thứ ba, ngày 1 tháng 6 năm đó là:', ['Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu'], 'Thứ năm'),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '236105 + 82993', '935807 - 52453', '365 × 103', '11890 : 58'),
    B('Bài 2. Tìm x:', [ln([timX('42 × x = 15792'), timX('x : 155 = 2401 - 1612')], 2)]),
    B('Bài 3. Điền vào chỗ chấm (viết số La Mã hoặc số thường):', [
      ln([
        'a) Năm 43 thuộc thế kỉ thứ [[w:I|1|một]]',
        'b) Năm 1010 thuộc thế kỉ thứ [[w:XI|11|mười một]]',
        'c) Thế kỉ XV kéo dài từ năm [[n:1401]] đến năm [[n:1500]]',
        'd) Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng năm 938. Năm đó thuộc thế kỉ thứ [[w:X|10|mười]]',
      ]),
    ]),
    B('Bài 4. Một trường tiểu học có 672 học sinh, số học sinh nữ nhiều hơn số học sinh nam là 92 em. Hỏi trường đó có bao nhiêu học sinh nữ, bao nhiêu học sinh nam?', loiVan(['Đáp số: Nữ: [[n:382]] học sinh;  Nam: [[n:290]] học sinh'])),
    B('Bài 5. Tính nhanh:', [ln(['a) ' + tinh('490 × 365 - 390 × 365'), 'b) ' + tinh('2364 + 37 × 2364 + 63')])]),
  ]),
  hk(10, 'So sánh số, giá trị chữ số, đổi dm² – cm², cộng tạ, chu vi – diện tích hình vuông, cạnh vuông góc, sắp xếp, chia hết cho 3.', [
    T('Câu 1. Trong các số 5784; 6874; 6784; 8764 số lớn nhất là:', ['5784', '6784', '6874', '8764'], '8764'),
    T('Câu 2. Giá trị của chữ số 3 trong số 653 297 là:', ['30 000', '3000', '300', '30'], '3000'),
    T('Câu 3. 10 dm² 2cm² = ...... cm². Số thích hợp điền vào chỗ chấm là:', ['12cm²', '102cm²', '120cm²', '1002cm²'], '1002cm²'),
    T('Câu 4. 357 tạ + 482 tạ = ……', ['729 tạ', '739 tạ', '839 tạ', '829 tạ'], '839 tạ'),
    T('Câu 5. Chu vi của hình vuông là 16m thì diện tích sẽ là:', ['16m', '16m²', '32m', '32m²'], '16m²'),
    T('Câu 6. Hình bên có các cặp cạnh vuông góc là:', ['AB và AD; BD và BC.', 'BA và BC; DB và DC.', 'AB và AD; BD và BC; DA và DC.', 'AB và BD; BD và BC; DA và DB.'], 'AB và AD; BD và BC; DA và DC.', ['d10-c6', 230]),
  ], [
    dt('Bài 1. Đặt tính rồi tính:', '186954 + 247436', '839084 - 465127', '428 × 39', '4935 : 44'),
    B('Bài 2.', [
      ln(['a) Viết các số 75 639; 57 963; 75 936; 57 396 theo thứ tự từ bé đến lớn:', xep([75639, 57963, 75936, 57396], true)]),
      tx('b) Tìm chữ số x để số x258 chia hết cho 3 (bấm chọn tất cả các chữ số đúng):'),
      chon([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 6, 9]),
    ]),
    B('Bài 3. Tuổi của mẹ và tuổi của con cộng lại là 57 tuổi. Mẹ hơn con 33 tuổi. Hỏi mẹ bao nhiêu tuổi, con bao nhiêu tuổi?', loiVan(['Đáp số: Mẹ: [[n:45]] tuổi;  Con: [[n:12]] tuổi'])),
    B('Bài 4. Tìm số lớn nhất có 4 chữ số khác nhau, chữ số hàng trăm là chữ số 5 mà số đó vừa chia hết cho 2 và vừa chia hết cho 5.', [ln(['Số đó là: [[n:9580]]'])]),
  ]),
  hk(11, 'Viết số, giá trị chữ số, đổi tấn – kg, thời gian, thế kỉ, biểu đồ cột, dãy số lẻ – chẵn, trung bình cộng, tính nhanh.', [], [
    B('Câu 1. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) Số gồm ba mươi triệu ba mươi nghìn và ba mươi viết là:', ['303 030', '3 030 030', '3 003 030', '30 030 030'], '30 030 030'),
      mc('b) Giá trị chữ số 6 trong số 268 519 là:', ['600 000', '60 000', '68 000', '6000'], '60 000'),
    ]),
    B('Câu 2. Đúng ghi Đ, sai ghi S:', [ln([ds('a) 8 tấn 15kg = 815kg', false), ds('b) 8 tấn 15kg = 8015kg', true), ds('c) 1 tấn 2 yến = 1200kg', false), ds('d) 1 tấn 2 yến = 1020kg', true)], 2)]),
    B('Câu 3. Đúng ghi Đ, sai ghi S:', [ln([ds('a) 180 phút = 3 giờ', true), ds('b) 1/4 phút = 20 giây', false), ds('c) 1/5 thế kỉ = 15 năm', false), ds('d) Năm 1000 thuộc thế kỉ thứ 11', false)], 2)]),
    B('Câu 4. Hãy xem biểu đồ số học sinh giỏi toán khối lớp 4 trường Đoàn Kết năm 2008 – 2009 rồi khoanh vào chữ đặt trước câu trả lời đúng: Trung bình mỗi lớp có bao nhiêu học sinh giỏi toán?', [img('d11-c4', 380), mc('', ['21 em', '22 em', '23 em', '24 em'], '23 em')]),
    B('Câu 5.', [ln(['a) Viết 5 số lẻ liên tiếp bắt đầu từ số lớn nhất có 4 chữ số:', '[[n:9999]] ;  [[n:10001]] ;  [[n:10003]] ;  [[n:10005]] ;  [[n:10007]]', 'b) Viết 5 số chẵn liên tiếp mà số lớn nhất là số nhỏ nhất có 5 chữ số:', '[[n:9992]] ;  [[n:9994]] ;  [[n:9996]] ;  [[n:9998]] ;  [[n:10000]]'])]),
    B('Câu 6. Có 5 gói kẹo loại 200 gam mỗi gói và 4 gói kẹo loại 250 gam mỗi gói. Hỏi có tất cả bao nhiêu ki-lô-gam kẹo?', loiVan(['Đáp số: [[n:2]] kg kẹo'])),
    B('Câu 7. Một ô tô giờ thứ nhất đi được 64km, giờ thứ hai đi được 48km, giờ thứ ba đi được số km bằng trung bình cộng của hai giờ đầu. a) Cả 3 giờ ô tô đi được bao nhiêu ki-lô-mét? b) Hỏi trung bình mỗi giờ ô tô đi được bao nhiêu ki-lô-mét?', loiVan(['Đáp số: a) [[n:168]] km;  b) [[n:56]] km'])),
    B('Câu 8. Tính nhanh giá trị biểu thức 72 × a + 38 × a – a × 10 với a = 25.', [ln([tinh('72 × 25 + 38 × 25 - 25 × 10')])]),
  ]),
  hk(12, 'Giá trị chữ số, năm nhuận, trung bình cộng, Đ/S tổng – hiệu, so sánh không tính, quy luật dãy số, bài toán trung bình cộng.', [], [
    B('Câu 1. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) Trong các số dưới đây, số có chữ số 3 mang giá trị 3000 là:', ['36 512', '54 312', '53 724', '54 832'], '53 724'),
      mc('b) Giá trị của chữ số 3 trong số nhỏ nhất có 6 chữ số khác nhau là:', ['30', '300', '3000', '30 000'], '300'),
    ]),
    B('Câu 2. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) Tháng hai của năm nhuận có số ngày là:', ['28', '29', '30', '31'], '29'),
      mc('b) Bắt đầu từ năm 1980 đến hết năm 2020 có số năm nhuận là:', ['8', '9', '10', '11'], '11'),
    ]),
    B('Câu 3. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) Trung bình cộng của số lớn nhất có 4 chữ số khác nhau với số nhỏ nhất có 3 chữ số là:', ['4986', '4988', '5000'], '4988'),
      mc('b) Trung bình cộng của số bé nhất có 6 chữ số khác nhau với số lớn nhất có 4 chữ số là:', ['56 072', '56 172', '56 222'], '56 172'),
    ]),
    B('Câu 4. Đúng ghi Đ, sai ghi S:', [
      ln([
        ds('a) Tổng số lẻ nhỏ nhất có 5 chữ số với số lớn nhất có 4 chữ số là: 20 000.', true),
        ds('b) Tổng của số lớn nhất có 5 chữ số khác nhau với số bé nhất có 5 chữ số khác nhau là: 108 900.', false),
        ds('c) Hiệu của số lớn nhất có 4 chữ số khác nhau đều là số lẻ với số bé nhất có 4 chữ số khác nhau đều là số chẵn là: 7707.', true),
        ds('d) Hiệu của số chẵn lớn nhất có 5 chữ số với số lớn nhất có 4 chữ số là: 89 898.', false),
      ]),
    ]),
    B('Câu 5. Không thực hiện phép tính, hãy so sánh giá trị của M và N:   M × 88 = 88 × 1090;   (N + 1090) × 256 = (984 + 1090) × 256', [ln(['M [[C:>]] N'])]),
    B('Câu 6. Hãy viết thêm bốn số thích hợp vào chỗ chấm trong dãy số sau:', [ln(['1 ; 2 ; 3 ; 5 ; 8 ;  [[n:13]] ;  [[n:21]] ;  [[n:34]] ;  [[n:55]]'])]),
    B('Câu 7. Hà làm được 16 bông hoa, Hằng làm được 19 bông hoa, Lan làm được số bông hoa nhiều hơn mức trung bình của cả 3 bạn là 5 bông hoa. Hỏi cả ba bạn làm được bao nhiêu bông hoa?', loiVan(['Đáp số: [[n:60]] bông hoa'])),
  ]),
  hk(13, 'Cộng trừ số lớn, đổi m – km, giá trị biểu thức có chữ, tính chất phép cộng, đặt tính, tìm x, đổi kg – tạ, tính thuận tiện.', [], [
    B('Câu 1. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) Tổng của 508 323 và 467 895 là:', ['965 218', '965 118', '976 118', '976 218'], '976 218'),
      mc('b) Hiệu của 3 207 048 và 376 709 là:', ['3 830 339', '2 830 239', '2 830 339', '2 830 349'], '2 830 339'),
    ]),
    T('Câu 2. Một ô tô giờ thứ nhất chạy được 58 015m, giờ thứ hai chạy ít hơn giờ thứ nhất 16 030m. Hỏi cả hai giờ ô tô chạy được bao nhiêu ki-lô-mét?', ['90km', '96km', '100km'], '100km'),
    B('Câu 3. Viết vào ô trống (theo mẫu):', [
      {
        t: 'grid',
        border: true,
        rows: [
          ['a', 'b', 'c', 'a × (b + c)', '(a + b) × c', 'a × (b − c)', '(a − b) × c'],
          ['8', '6', '4', '80', '56', '16', '8'],
          ...[
            [9, 7, 5],
            [24, 14, 10],
            [35, 25, 15],
            [18, 15, 12],
          ].map(([a, b, c]) => [String(a), String(b), String(c), `[[n:${a * (b + c)}]]`, `[[n:${(a + b) * c}]]`, `[[n:${a * (b - c)}]]`, `[[n:${(a - b) * c}]]`]),
        ],
      },
    ]),
    B('Câu 4. Đúng ghi Đ, sai ghi S:', [ln([ds('a) 34015 + 72985 = 72985 + 34015', true), ds('b) 376 + 102 – 214 = 214 – 102 + 376', false), ds('c) 78 + 35 × 8 = 8 × 35 + 78', true), ds('d) 215 + 75 : 5 = 215 : 5 + 75', false)], 2)]),
    B('Câu 5. Đặt tính rồi tính:', datTinh('32174 + 64326', '729318 + 58492', '78904 - 9178', '375102 - 296048')),
    B('Câu 6. Tìm x:', [ln([timX('x - 4702 = 9198'), timX('x + 37206 = 108927'), timX('485126 + x = 854609'), timX('780134 - x = 89476')], 2)]),
    B('Câu 7. Gia đình ông An vụ trước thu hoạch được 1763kg thóc, vụ sau thu được ít hơn vụ trước 326kg. Hỏi cả hai vụ gia đình ông An thu được bao nhiêu tạ thóc?', loiVan(['Đáp số: [[n:32]] tạ thóc'])),
    B('Câu 8. Tính giá trị của biểu thức sau bằng cách thuận tiện nhất:', [ln([tinh('328450 - 296 + 72296 - 450 + 600000')])]),
  ]),
  hk(14, 'Tính chất tổng – hiệu, viết biểu thức, số nghĩ, chu vi – diện tích, hiệu mới, biểu thức có chữ, tính hợp lí, trung bình cộng.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S:', [
      ln([
        ds('a) Trong một tổng, nếu ta cùng thêm hay cùng bớt ở mỗi số hạng cùng một số thì tổng không thay đổi.', false),
        ds('b) Trong một hiệu, nếu ta cùng thêm hay cùng bớt ở số bị trừ và số trừ cùng một số thì hiệu hai số không thay đổi.', true),
        ds('c) Trong một tổng, nếu ta thêm số hạng này bao nhiêu đơn vị đồng thời bớt số hạng kia đi bấy nhiêu đơn vị thì tổng không thay đổi.', true),
        ds('d) Trong một hiệu, nếu ta thêm vào số bị trừ bao nhiêu đơn vị đồng thời bớt số trừ đi bấy nhiêu đơn vị thì hiệu hai số đó không thay đổi.', false),
      ]),
    ]),
    T('Câu 2. Hiệu của 4567 với 1023 nhân với 3 viết là:', ['4567 – 1023 × 3', '4567 × 3 – 1023', '(4567 – 1023) × 3', '1023 × 3 – 4567'], '(4567 – 1023) × 3'),
    T('Câu 3. Tú nghĩ ra một số. Tú lấy số đó trừ đi số nhỏ nhất có 4 chữ số khác nhau thì được số chẵn lớn nhất có 4 chữ số. Số Tú nghĩ là:', ['9993', '11 201', '11 021', '11 210'], '11 021'),
    T('Câu 4. Một miếng bìa hình chữ nhật có chu vi là 60cm. Nếu bớt chiều dài 6cm và thêm vào chiều rộng 4cm thì được hình vuông. Diện tích miếng bìa hình chữ nhật đó là:', ['150cm²', '225cm²', '200cm²', '300cm²'], '200cm²'),
    B('Câu 5. Hiệu của hai số là số lớn nhất có 3 chữ số. Nếu thêm vào số bị trừ 125 đơn vị, thêm vào số trừ 52 đơn vị thì hiệu mới là bao nhiêu?', [ln(['Hiệu mới là: [[n:1072]]'])]),
    B('Câu 6. Viết biểu thức rồi tính giá trị của biểu thức với a = 8 ; b = 4209 ; c = 2049:', [ln(['a) a nhân với tổng của b và c:   ' + tinh('8 × (4209 + 2049)'), 'b) Hiệu của b và c chia cho a:   ' + tinh('(4209 - 2049) : 8')])]),
    B('Câu 7. Tính giá trị của biểu thức sau bằng cách hợp lí nhất:', [ln([tinh('(145 × 99 + 145) - (143 × 101 - 143)')])]),
    B('Câu 8. Cho hai số, biết số lớn là 1516 và số này hơn trung bình cộng của cả hai số là 173. Tìm số bé.', loiVan(['Đáp số: [[n:1170]]'])),
  ]),
  hk(15, 'Công thức tổng – hiệu, gọi tên góc, đếm góc, tuổi bố con, tính thuận tiện, diện tích hình chữ nhật.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S:', [ln([ds('Số bé = (tổng + hiệu) : 2', false), ds('Số lớn = (tổng + hiệu) × 2', false), ds('Số bé = (tổng – hiệu) : 2', true), ds('Số lớn = (tổng – hiệu) : 2', false), ds('Số bé = (tổng + hiệu) : 2', false), ds('Số lớn = (tổng + hiệu) : 2', true)], 2)]),
    B('Câu 2. Chọn “góc nhọn”, “góc vuông”, “góc tù”, “góc bẹt” cho thích hợp với từng hình:', [img('d15-c2', 440), ln([`a) ${goc('góc vuông')}`, `b) ${goc('góc tù')}`, `c) ${goc('góc bẹt')}`, `d) ${goc('góc nhọn')}`], 4)]),
    B('Câu 3. Đúng ghi Đ, sai ghi S. Hình vẽ bên có:', [hinh('d15-c3', 240, [ln([ds('5 góc nhọn', false), ds('1 góc tù', true), ds('6 góc nhọn', false), ds('2 góc vuông', true), ds('2 góc tù', false), ds('9 góc nhọn', true)], 2)])]),
    T('Câu 4. Tổng số tuổi của bố và con là 54 tuổi, bố hơn con 28 tuổi. Tính tuổi của mỗi bố con.', ['Bố: 40 tuổi ; Con: 14 tuổi', 'Bố: 42 tuổi ; Con: 12 tuổi', 'Bố: 41 tuổi ; Con: 13 tuổi'], 'Bố: 41 tuổi ; Con: 13 tuổi'),
    B('Câu 5. Tính bằng cách thuận tiện nhất:', [ln(['a) ' + tinh('5816 + 2009 + 3184'), 'b) ' + tinh('2750 + 3128 + 1272'), 'c) ' + tinh('327184 - 28942 + 456816 - 71058')])]),
    B('Câu 6. Một mảnh vườn hình chữ nhật có chu vi là 98m, chiều dài hơn chiều rộng 9m. Tính diện tích mảnh vườn đó.', loiVan(['Đáp số: [[n:580]] m²'])),
    B('Câu 7. Trong hình sau, mỗi góc là góc vuông, góc nhọn hay góc tù? (mẫu: Góc vuông đỉnh A, cạnh AB, AC)', [hinh('d15-c7', 240, [ln([`Góc đỉnh A, cạnh AB, AC: ${goc('góc vuông')}`, `Góc đỉnh B, cạnh BA, BD: ${goc('góc tù')}`, `Góc đỉnh C, cạnh CA, CD: ${goc('góc vuông')}`, `Góc đỉnh D, cạnh DB, DC: ${goc('góc nhọn')}`])])]),
  ]),
  hk(16, 'Đếm góc, hai số chẵn – lẻ, cạnh vuông góc, tổng – hiệu, bài toán mua vở, gọi tên góc.', [], [
    T('Câu 1. Hình vẽ có:', ['2 góc vuông và 4 góc nhọn.', '4 góc vuông và 8 góc nhọn.', '2 góc vuông và 12 góc nhọn.', '4 góc vuông và 10 góc nhọn.'], '4 góc vuông và 10 góc nhọn.', ['d16-c1', 230]),
    T('Câu 2. Tổng của hai số chẵn là 1994, giữa hai số chẵn đó có 7 số lẻ. Hai số chẵn đó là:', ['994 và 1000', '998 và 1006', '990 và 1004', '1000 và 1004'], '990 và 1004'),
    B('Câu 3. Đúng ghi Đ, sai ghi S. Hình bên có các cặp cạnh vuông góc với nhau là:', [hinh('d16-c3', 240, [ln([ds('AB và AD', true), ds('AB và DC', false), ds('BA và BC', true), ds('BC và AD', false), ds('DA và DC', true)], 2)])]),
    B('Câu 4. Tổng của hai số lẻ là số nhỏ nhất có 4 chữ số, biết giữa hai số lẻ đó có 5 số chẵn. Tìm hai số lẻ đó.', loiVan(['Đáp số: Số bé: [[n:495]];  Số lớn: [[n:505]]'])),
    B('Câu 5. An và Bình mua chung 54 quyển vở và phải trả 135 000 đồng. An trả nhiều hơn Bình 15 000 đồng. Hỏi mỗi bạn mua bao nhiêu quyển vở?', loiVan(['Đáp số: An: [[n:30]] quyển;  Bình: [[n:24]] quyển'])),
    B('Câu 6. Nêu tên các góc có trong hình bên:', [hinh('d16-c6', 240, [ln([`Góc đỉnh O, cạnh OA, OC: ${goc('góc vuông')}`, `Góc đỉnh O, cạnh OB, OC: ${goc('góc vuông')}`, `Góc đỉnh O, cạnh OC, OD: ${goc('góc nhọn')}`, `Góc đỉnh O, cạnh OD, OB: ${goc('góc nhọn')}`, `Góc đỉnh O, cạnh OA, OD: ${goc('góc tù')}`, `Góc đỉnh O, cạnh OA, OB: ${goc('góc bẹt')}`])])]),
  ]),
  hk(17, 'Nhận biết hình vuông, đường cao, diện tích, song song – vuông góc, vẽ hình chữ nhật và hình vuông.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S. Hình vuông có cạnh 3 cm được vẽ như sau:', [{ t: 'pics', items: [{ img: I('d17-c1a'), cell: 'a) [[D:S]]' }, { img: I('d17-c1b'), cell: 'b) [[D:S]]' }, { img: I('d17-c1c'), cell: 'c) [[D:Đ]]' }] }]),
    T('Câu 2. Đường cao của hình tam giác ABC tương ứng với đáy BC là:', ['AB', 'AC', 'BM', 'AH'], 'AH', ['d17-c2', 220]),
    T('Câu 3. Một mảnh vườn hình chữ nhật có chu vi là 120m. Chiều dài hơn chiều rộng 12m. Diện tích của hình chữ nhật đó là:', ['648m²', '548m²', '864m²', '3564m²'], '864m²'),
    B('Câu 4. Đúng ghi Đ, sai ghi S. Hình AMBCD gồm hình chữ nhật ABCD và hình tam giác AMB có:', [
      hinh('d17-c4', 220, [
        ln([ds('a) DA và CB cắt nhau tại M', false), ds('b) AD song song với BC', true), ds('c) MB vuông góc với BC', false), ds('d) AB song song với DC', true), ds('e) AM song song với BC', false), ds('g) AB vuông góc với AD', true), ds('h) AD vuông góc với BC', false), ds('i) DA và CB không bao giờ cắt nhau', true)]),
      ]),
    ]),
    B('Câu 5. Viết tiếp vào chỗ chấm. Cho 3 hình chữ nhật ABCD, ABIE, EICD.', [hinh('d17-c5', 230, [ln(['a) Các cạnh song song với EI là: [[w:AB và DC|DC và AB|AB, DC|DC, AB|AB ; DC|DC ; AB|AB DC|DC AB|AB và CD|CD và AB|AB, CD|CD, AB|AB ; CD|CD ; AB|AB CD|CD AB|BA và DC|DC và BA|BA, DC|DC, BA|BA ; DC|DC ; BA|BA DC|DC BA|BA và CD|CD và BA|BA, CD|CD, BA|BA ; CD|CD ; BA|BA CD|CD BA]]', 'b) Trong hình chữ nhật EICD, các cạnh vuông góc với DC là: [[w:ED và IC|IC và ED|ED, IC|IC, ED|ED ; IC|IC ; ED|ED IC|IC ED|ED và CI|CI và ED|ED, CI|CI, ED|ED ; CI|CI ; ED|ED CI|CI ED|DE và IC|IC và DE|DE, IC|IC, DE|DE ; IC|IC ; DE|DE IC|IC DE|DE và CI|CI và DE|DE, CI|CI, DE|DE ; CI|CI ; DE|DE CI|CI DE]]'])])]),
    B('Câu 6. Vẽ hình chữ nhật có chiều dài 5cm, chiều rộng 3cm và tính diện tích hình vừa vẽ.', [viet(3), ln(['Diện tích: [[n:15]] cm²'])]),
    B('Câu 7. Vẽ hình vuông có chu vi bằng chu vi hình chữ nhật (ở câu 6) và tính diện tích hình vuông đó.', [viet(3), ln(['Cạnh hình vuông: [[n:4]] cm;  Diện tích: [[n:16]] cm²'])]),
  ]),
  hk(18, 'Góc và cạnh song song, đường chéo hình vuông, đường cao tam giác, tổng bằng hiệu, lập số, đếm hình, ba số.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S. Hình vẽ bên có:', [hinh('d18-c1', 200, [ln([ds('a) 3 góc vuông, 3 góc tù.', false), ds('b) 2 góc nhọn, 2 góc tù.', false), ds('c) 2 cặp cạnh song song với nhau.', true), ds('d) 3 cặp cạnh song song với nhau.', false)])])]),
    B('Câu 2. Đúng ghi Đ, sai ghi S:', [ln([ds('A. 2 đường chéo của hình vuông không bằng nhau.', false), ds('B. 2 đường chéo của hình vuông bằng nhau.', true), ds('C. 2 đường chéo của hình vuông không vuông góc với nhau.', false), ds('D. 2 đường chéo của hình vuông vuông góc với nhau.', true)])]),
    B('Câu 3. Đúng ghi Đ, sai ghi S. Trong hình vẽ bên:', [hinh('d18-c3', 230, [ln([ds('a) AM là chiều cao của tam giác AMC.', false), ds('b) AH là chiều cao của tam giác ABC.', true), ds('c) AM là chiều cao của tam giác ABC.', false), ds('d) AH là chiều cao của tam giác AMC.', true)])])]),
    T('Câu 4. Tổng của hai số bằng hiệu của hai số đó khi:', ['Hai số đều là số chẵn.', 'Hai số đều là số 0.', 'Hai số đều là số lẻ.', 'Một trong hai số bằng 0.'], 'Một trong hai số bằng 0.'),
    B('Câu 5. Cho 4 chữ số 0, 1, 2, 3. Hãy lập tất cả các số có 3 chữ số khác nhau rồi tính tổng tất cả các số đó bằng cách nhanh nhất.', [viet(2), ln(['Lập được [[n:18]] số;  Tổng các số đó là: [[n:3864]]'])]),
    B('Câu 6. Cho hình vuông ABCD, MN song song với hai cạnh AB và CD. Trên MN lấy điểm I, từ I vẽ đường thẳng song song với hai cạnh AD và BC, cắt AB tại E và CD tại F. Nối E với M và N, nối F với M và N. Hình vẽ có bao nhiêu hình chữ nhật, bao nhiêu hình tam giác?', [viet(3), ln(['Có [[n:8|9]] hình chữ nhật và [[n:12]] hình tam giác.'])]),
    B('Câu 7. Tổng của 3 số là 225. Tìm 3 số đó, biết số thứ nhất kém số thứ hai 12, số thứ hai kém số thứ ba 18.', loiVan(['Đáp số: Số thứ nhất: [[n:61]];  Số thứ hai: [[n:73]];  Số thứ ba: [[n:91]]'])),
  ]),
  hk(19, 'Đếm góc, Đ/S biểu thức, bài toán thư viện, so sánh tích, vẽ hình chữ nhật, nhân số có nhiều chữ số, biểu thức có chữ.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S. Hình vẽ có (dùng ê ke kiểm tra):', [hinh('d19-c1', 220, [ln([ds('a) 2 góc vuông', false), ds('3 góc vuông', true), ds('b) 2 góc tù', true), ds('1 góc tù', false), ds('c) 5 góc nhọn', false), ds('7 góc nhọn', true)], 2)])]),
    B('Câu 2. Đúng ghi Đ, sai ghi S:', [ln([ds('a) 13428 + 12045 × 8 = 109788', true), ds('b) 15164 × 5 + 25180 = 105000', false), ds('c) 816907 – 40316 × 7 = 634695', false), ds('d) 27548 × 6 – 85509 = 79779', true)], 2)]),
    T('Câu 3. Một thư viện trường học có 8 giá sách loại lớn, mỗi giá sách để 745 cuốn sách và 9 giá sách loại nhỏ, mỗi giá sách để 534 cuốn sách. Hỏi thư viện đó có tất cả bao nhiêu cuốn sách?', ['6944', '10 806', '10 766', '10 800'], '10 766'),
    B('Câu 4. Đúng ghi Đ, sai ghi S:', [ln([ds('2008 × 4 < 3 × 2009', false), ds('1998 × 8 = 8 × 1998', true), ds('1260 × 6 > 630 × 12', false), ds('12 × 7015 = 7015 × 12', true)], 2)]),
    B('Câu 5. a) Hãy vẽ hình chữ nhật có chiều dài 6cm, chiều rộng 3cm. b) Tính chu vi và diện tích hình chữ nhật đó.', [viet(3), ln(['Chu vi: [[n:18]] cm;  Diện tích: [[n:18]] cm²'])]),
    B('Câu 6. Đặt tính rồi tính:', datTinh('20468 × 5', '13579 × 7', '243819 × 8')),
    B('Câu 7. Cho a = 5 ; 6 ; 7 ; 8. Hãy tính giá trị của biểu thức 23085 + 1235 × a:', [ln([5, 6, 7, 8].map((a) => `Với a = ${a}:  23085 + 1235 × ${a} = [[n:${ev(`23085 + 1235 × ${a}`)}]]`), 2)]),
    B('Câu 8. Một xe ô tô chở 7 bao gạo, mỗi bao nặng 125kg và chở 9 bao mì, mỗi bao nặng 105kg. Hỏi xe đó chở tất cả bao nhiêu ki-lô-gam gạo và mì?', loiVan(['Đáp số: [[n:1820]] kg'])),
  ]),
  hk(20, 'Cạnh song song, tích khi giảm thừa số, so sánh tích, cách tính thuận tiện, tìm m, tích bị viết nhầm, tính hợp lí.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S. Hình bên có:', [hinh('d20-c1', 230, [ln([ds('a) AD song song với BC.', false), ds('b) AB song song với các cạnh EG, MN, DC.', true), ds('c) Có 3 cặp cạnh song song với nhau.', false), ds('d) Có 6 cặp cạnh song song với nhau.', true)])])]),
    T('Câu 2. Tích của hai số là 12 480. Nếu một thừa số giảm đi 5 lần thì tích mới là:', ['3120', '12485', '2500', '2496'], '2496'),
    B('Câu 3. Đúng ghi Đ, sai ghi S. Điền dấu (>, <, =) thích hợp vào chỗ chấm: 3750 × 9 … 11250 × 3', [ln([ds('a) 3750 × 9 > 11250 × 3', false), ds('b) 3750 × 9 = 11250 × 3', true), ds('c) 3750 × 9 < 11250 × 3', false)])]),
    T('Câu 4. Chọn cách tính thích hợp nhất của 25 × 6 × 5 × 4:', ['a) = 150 × 5 × 4 = 750 × 4 = 3000', 'b) = (25 × 6) × (5 × 4) = 150 × 20 = 3000', 'c) = (25 × 5) × (6 × 4) = 125 × 24 = 3000', 'd) = (25 × 4) × (6 × 5) = 100 × 30 = 3000'], 'd) = (25 × 4) × (6 × 5) = 100 × 30 = 3000'),
    B('Câu 5. Tìm các số tự nhiên m, biết 48125 × m < 144370 (bấm chọn tất cả các số đúng):', [chon([0, 1, 2, 3, 4, 5], [0, 1, 2])]),
    B('Câu 6. Khi nhân một số với 2468, Khuê đã viết nhầm chữ số 8 ở hàng đơn vị của số 2468 thành chữ số 3 nên tích giảm đi 35 đơn vị. Hãy tìm tích đúng.', loiVan([`Đáp số: Tích đúng là [[n:${ev('7 × 2468')}]]`])),
    B('Câu 7. Tính giá trị của biểu thức sau bằng cách hợp lí nhất:', [ln([tinh('2 × 4 × 5 × 6 × 15 × 25')])]),
  ]),
];
