// Toán lớp 1 — chép từ bộ đề giấy "TOÁN - TV 1_1.pdf", giữ đúng thứ tự bài, cách trình bày và tranh
// (cắt từ bản scan, nằm ở public/thi-lop-1). Đáp án do giai.ts tự tính từ đề.
// Bỏ: 3 phép tính in lỗi cho kết quả âm ("3 - 6", "1 - 6 ? 2 + 5", "7 + 2 ? 3 - 4", "2 - 3 ? 2 - 1").

import { calc, chuoi, cmp, dau, day, dot, ds, hoPhepTinh, ineq, kq, o, tachGop, thap } from './giai';
import type { RawBlock, RawPhieu } from './kieu';

const tinh4 = (...items: string[]): RawBlock => ({ t: 'lines', cols: 4, items: items.map((s) => calc(s)) });
const so4 = (...items: string[]): RawBlock => ({ t: 'lines', cols: 4, items: items.map((s) => calc(s)) });
const xep = (nums: number[], giam = false) => [...nums].sort((a, b) => (giam ? b - a : a - b)).map(dot).join(', ');
/** Nối phép tính với kết quả (hoặc với phép tính bằng nó): mỗi ô trên → mọi ô dưới cùng giá trị. */
const noi = (top: string[], bottom: string[]) => {
  const v = (s: string) => kq(s.replace(/−/g, '-'));
  return top.map((t) => bottom.map((b, j) => (v(b) === v(t) ? j : -1)).filter((j) => j >= 0)).map((js) => {
    if (!js.length) throw new Error('Nối không có cặp');
    return js;
  });
};
const m = (s: string) => s.replace(/ - /g, ' − ');
const eq = (img: string, a: number | 'any', b = 0) => ({ img, ans: a === 'any' ? ('any' as const) : hoPhepTinh(a, b) });

const giuaKi = (n: number, extra: Partial<RawPhieu> = {}): Pick<RawPhieu, 'slug' | 'title' | 'mon' | 'kieu' | 'head' | 'thoiGian'> => ({
  slug: `toan-giua-ki-1-de-${n}`,
  title: `Kiểm tra giữa kì 1 – Toán lớp 1 – Đề ${n}`,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['KIỂM TRA GIỮA KÌ 1', `MÔN: TOÁN - Đề ${n}`, ' 1A'],
  thoiGian: 40,
  ...extra,
});
const onTap = (n: number): Pick<RawPhieu, 'slug' | 'title' | 'mon' | 'kieu' | 'head' | 'thoiGian'> => ({
  slug: `toan-on-tap-hoc-ki-1-phieu-${n}`,
  title: `Ôn tập học kì 1 – Toán lớp 1 – Phiếu ${n}`,
  mon: 'toan',
  kieu: 'on-tap',
  head: ['ÔN TẬP HỌC KÌ 1'],
  thoiGian: 40,
});

const PHIEU: RawPhieu[] = [
  /* ───── Kiểm tra giữa kì 1 ───── */
  {
    ...giuaKi(1),
    description: 'Thứ tự các số trong phạm vi 10, so sánh, tách – gộp số và bài toán có lời văn.',
    bai: [
      {
        title: 'Bài 1: (3 điểm) Viết các số 6, 0, 8, 4, 9, 2, 5',
        diem: 3,
        blocks: [{ t: 'lines', bullet: true, items: [`Số bé nhất là: ${dot(0)}`, `Số lớn nhất là: ${dot(9)}`, `Xếp các số theo thứ tự từ bé đến lớn: ${xep([6, 0, 8, 4, 9, 2, 5])}`] }],
      },
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 3, items: ['8 > ?', '6 > ?', '9 > ?', '3 < ?', '4 < ?', '5 < ?'].map((s) => ineq(s, false)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: ['0 _ _ 3 _', '_ 6 _ _ 9', '4 _ _ 1 _', '9 _ _ 6 _'].map((r) => ({ cells: day(r) })) }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 3, items: ['8 ? 9', '4 ? 4', '2 ? 10', '0 ? 3', '5 ? 8', '7 ? 7'].map((s) => cmp(s, false)) }] },
      {
        title: 'Bài 5: (2 điểm) Tách - gộp số (viết các số còn thiếu)',
        diem: 2,
        blocks: [{ t: 'trees', shape: 'square', items: [tachGop(9, 3, null), tachGop(6, 4, null), tachGop(5, 3, null), tachGop(null, 4, 4)] }],
      },
      {
        title: 'Bài 6: (1 điểm)',
        diem: 1,
        blocks: [
          { t: 'text', text: 'An có 7 quả táo. An cho bạn 2 quả táo. Hỏi An còn lại bao nhiêu quả táo?' },
          { t: 'row', widths: ['1fr', '1fr'], cols: [[{ t: 'lines', items: [`Phép tính: ${dot(7)} - ${dot(2)} = ${dot(5)}`, `Trả lời: An còn lại ${dot(5)} quả táo`] }], [{ t: 'img', src: 'd1-tao', w: 300 }]] },
        ],
      },
      {
        title: 'Bài 7: (1 điểm) Khoanh vào đáp án đúng',
        diem: 1,
        blocks: [{ t: 'row', cols: [[{ t: 'mc', q: 'Số nào lớn nhất?', opts: ['4', '5', '8', '7'], ans: '8' }], [{ t: 'mc', q: 'Số nào bé nhất?', opts: ['2', '6', '0', '1'], ans: '0' }]] }],
      },
      { title: 'Bài 8: (1 điểm) Viết số thích hợp', diem: 1, blocks: [{ t: 'lines', cols: 2, boxed: true, items: [calc('4 + 2 = ?'), calc('5 - 3 = ?')] }] },
    ],
  },
  {
    ...giuaKi(4),
    description: 'Xếp thứ tự, dãy số, so sánh, tách – gộp số và phép cộng, trừ trong phạm vi 10.',
    bai: [
      {
        title: 'Bài 1: (3 điểm) Viết các số 6, 1, 8, 4, 10, 2, 5',
        diem: 3,
        blocks: [{ t: 'lines', bullet: true, items: [`Xếp các số theo thứ tự từ bé đến lớn là: ${xep([6, 1, 8, 4, 10, 2, 5])}`, `Xếp các số theo thứ tự từ lớn đến bé : ${xep([6, 1, 8, 4, 10, 2, 5], true)}`] }],
      },
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 3, items: ['8 > ?', '6 > ?', '9 > ?', '3 < ?', '4 < ?', '5 < ?'].map((s) => ineq(s, false)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: ['0 _ _ 3 _', '_ 6 _ _ 9', '5 _ _ 2 _', '10 _ _ 7 _'].map((r) => ({ cells: day(r) })) }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 4, items: ['8 ? 9', '2 ? 2', '3 ? 4', '1 ? 0', '6 ? 7', '1 ? 5', '6 ? 9', '5 ? 5'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 5: (2 điểm) Tách - gộp số (viết các số còn thiếu)',
        diem: 2,
        blocks: [{ t: 'trees', shape: 'circle', items: [tachGop(10, 3, null), tachGop(null, 4, 5), tachGop(5, 3, null), tachGop(null, 4, 4)] }],
      },
      { title: 'Bài 6: (1 điểm) Viết phép tính thích hợp', diem: 1, blocks: [{ t: 'eq', items: [eq('d4-le', 3, 3)] }] },
      {
        title: 'Bài 7: (1 điểm) Khoanh vào đáp án đúng',
        diem: 1,
        blocks: [{ t: 'row', cols: [[{ t: 'mc', q: 'a, Số nào lớn nhất?', opts: ['4', '9', '6', '7'], ans: '9' }], [{ t: 'mc', q: 'b, Số nào bé nhất?', opts: ['2', '6', '3', '7'], ans: '2' }]] }],
      },
      { title: 'Bài 8: (1 điểm) Viết số thích hợp', diem: 1, blocks: [{ t: 'lines', cols: 2, boxed: true, items: [calc('7 + 2 = ?'), calc('8 - 3 = ?')] }] },
    ],
  },
  {
    ...giuaKi(10),
    description: 'Số chẵn – số lẻ, chuỗi phép tính, so sánh biểu thức, phép cộng theo cột và đếm hình.',
    bai: [
      {
        title: 'Bài 1: (3 điểm) Cho các số sau: 2, 4, 1, 7, 9, 10',
        diem: 3,
        blocks: [
          {
            t: 'lines',
            bullet: true,
            items: [
              `Các số lớn hơn 4 nhưng nhỏ hơn 10 là: ${dot('7|9')}, ${dot('7|9')}`,
              `Các số lẻ trong dãy số đã cho là: ${dot('1|7|9')}, ${dot('1|7|9')}, ${dot('1|7|9')}`,
              `Các số chẵn trong dãy số đã cho là: ${dot('2|4|10')}, ${dot('2|4|10')}, ${dot('2|4|10')}`,
            ],
          },
        ],
      },
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 4, items: ['8 - 4 > ?', '6 - 3 > ?', '9 - 4 > ?', '3 + 4 > ?', '3 + 5 < ?', '4 + 5 < ?', '5 + 1 < ?', '1 + 8 < ?'].map((s) => ineq(s)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: [chuoi('9 -3 _ +4 _ -6 _ +5 _')] }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 3, items: ['8 - 4 ? 9 - 5', '4 + 3 ? 9', '2 + 8 ? 9 + 1'].map((s) => cmp(s)) }] },
      { title: 'Bài 5: (2 điểm) Tính và điền vào chỗ chấm', diem: 2, blocks: [{ t: 'cols', items: ['4 + 5', '3 + 5', '5 + 5', '6 + 2', '3 + 1', '4 + 2'].map((e) => `${e} = ${kq(e)}`) }] },
      {
        title: 'Bài 6: (1 điểm) An có 6 quả táo. Lan cho An thêm 3 quả táo. Hỏi An có tất cả bao nhiêu quả táo?',
        diem: 1,
        blocks: [{ t: 'row', widths: ['1fr', '1fr'], cols: [[{ t: 'lines', items: [`Phép tính: ${dot('6|3')} + ${dot('3|6')} = ${dot(9)}`, `Trả lời: An có ${dot(9)} quả táo`] }], [{ t: 'img', src: 'd10-tao', w: 260 }]] }],
      },
      {
        title: 'Bài 7: (2 điểm) Đúng điền Đ, sai điền S',
        diem: 2,
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '2fr'],
            cols: [
              [{ t: 'lines', bullet: true, items: ['Có 2 hình vuông trong hình bên [[D:S]]', 'Có 5 hình tam giác trong hình bên [[D:S]]', 'Có 1 hình chữ nhật trong hình bên [[D:Đ]]', 'Có 7 hình tam giác trong hình bên [[D:Đ]]'] }],
              [{ t: 'img', src: 'd10-hinh', w: 240 }],
            ],
          },
        ],
      },
    ],
  },
  {
    ...giuaKi(13, { head: ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 13', ''], phan: { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' } }),
    description: 'Đếm số lượng, so sánh, số lớn nhất – bé nhất, tính và tách – gộp số.',
    bai: [
      { title: 'Bài 1: Số?', blocks: [{ t: 'pics', framed: true, items: [5, 6, 7, 8].map((n, i) => ({ img: `d13-b1-${i + 1}`, cell: o(n) })) }] },
      { title: 'Bài 2: Dấu cần điền vào chỗ chấm là: 5 + 2 .............. 6 + 1', blocks: [{ t: 'mc', opts: ['>', '<', '='], ans: '=', cols: 3 }] },
      { title: 'Bài 3: Số bé nhất trong các số: 6, 8, 2, 10 là:', blocks: [{ t: 'mc', opts: ['8', '6', '2', '10'], ans: '2' }] },
      { title: 'Bài 4: Số lớn nhất trong các số sau là: 9, 2, 1, 5', blocks: [{ t: 'mc', opts: ['2', '1', '9', '5'], ans: '9' }] },
      { title: 'Bài 6: Tính', blocks: [{ t: 'grid', border: true, rows: [['3 + 7 = ?', '5 + 4 = ?', '6 - 2 = ?', '5 + 3 = ?'], ['4 + 6 = ?', '9 - 4 = ?', '2 + 4 = ?', '8 - 3 = ?']].map((r) => r.map((s) => calc(s))) }] },
      { title: 'Bài 7: Điền số thích hợp vào ô trống', blocks: [{ t: 'grid', border: true, rows: [day('1 _ _ 4 _ _ 7 _ _ 10'), day('10 _ _ 7 _ _ 4 _ _ 1')] }] },
      {
        title: 'Bài 8: Tách - gộp. Điền số thích hợp vào ô trống',
        blocks: [{ t: 'trees', shape: 'circle', fill: true, items: [tachGop(8, 2, null), tachGop(null, 2, 5), tachGop(9, 7, null), tachGop(null, 4, 3)] }],
      },
    ],
  },
  {
    ...giuaKi(19, { head: ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 19', ''], phan: { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' } }),
    description: 'Đếm hình, tính giá trị biểu thức, đúng – sai, điền dấu + / − và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Đếm và điền số tương ứng vào ô trống', blocks: [{ t: 'pics', items: [1, 3, 4].map((n, i) => ({ img: `d19-b1-${i + 1}`, cell: o(n) })) }] },
      { title: 'Bài 2: Kết quả của phép tính 10 - 3 + 2 = ........ là:', blocks: [{ t: 'mc', opts: ['7', '4', '9', '5'], ans: '9' }] },
      { title: 'Bài 3: Điền dấu thích hợp vào chỗ trống: 4 + 5 .............. 7 + 3', blocks: [{ t: 'mc', opts: ['>', '<', '='], ans: '<', cols: 3 }] },
      { title: 'Bài 4: Số liền sau số 2 là số nào?', blocks: [{ t: 'mc', opts: ['1', '3', '0', '2'], ans: '3' }] },
      { title: 'Bài 6: Đúng ghi Đ, sai ghi S', blocks: [{ t: 'lines', cols: 4, items: ['4 + 6 > 10', '10 - 6 < 5', '2 + 4 = 6', '8 + 1 > 10', '3 + 3 < 7', '7 - 3 < 4', '4 + 3 > 7', '7 + 3 = 8'].map(ds) }] },
      { title: 'Bài 7: Điền dấu + , - thích hợp vào ô trống', blocks: [{ t: 'lines', cols: 2, boxed: true, items: ['4 ? 3 = 7', '7 ? 5 = 2', '10 ? 7 = 3', '8 ? 3 = 5'].map(dau) }] },
      { title: 'Bài 8: Quan sát hình dưới đây và viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('d19-b8-1', 2, 2), eq('d19-b8-2', 3, 6)] }] },
    ],
  },
  {
    ...giuaKi(21, { head: ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 21', ''], phan: { 0: 'I. Trắc nghiệm', 5: 'II. Tự luận' } }),
    description: 'Quy luật dãy số, xếp thứ tự, tìm số chưa biết và nối phép tính với kết quả.',
    bai: [
      { title: 'Bài 1: Số thích hợp điền vào chỗ trống là: ......... + 4 = 10', blocks: [{ t: 'mc', opts: ['5', '3', '2', '6'], ans: '6' }] },
      { title: 'Bài 2: Tìm số thích hợp để đặt vào dấu “?”   [ 1, 3, 5, 7, ? ]', blocks: [{ t: 'mc', opts: ['7', '9', '2', '4'], ans: '9' }] },
      { title: 'Bài 3: Các số 4, 10, 3, 8 được xếp theo thứ tự từ bé đến lớn là', blocks: [{ t: 'mc', opts: ['10, 8, 4, 3', '4, 3, 8, 10', '3, 4, 8, 10'], ans: '3, 4, 8, 10', cols: 3 }] },
      { title: 'Bài 4: Các số 0, 7, 5, 3, 10 được xếp theo thứ tự từ lớn đến bé là:', blocks: [{ t: 'mc', opts: ['0, 3, 5, 7, 10', '10, 7, 5, 3, 0', '10, 5, 7, 3, 0'], ans: '10, 7, 5, 3, 0', cols: 3 }] },
      {
        title: 'Bài 5: Tìm hình thích hợp để đặt vào dấu “?”',
        blocks: [
          { t: 'text', text: '▲   ◆   ●   ▲   ◆   ?   ▲' },
          { t: 'mc', opts: ['●', '▲', '◆'], ans: '●', cols: 3 },
        ],
      },
      { title: 'Bài 6: Điền số thích hợp vào ô trống', blocks: [{ t: 'grid', border: true, rows: [day('1 _ _ 4 _ _ 7 _ _ 10'), day('10 _ 8 _ _ 5 _ _ _ 1')] }] },
      { title: 'Bài 7: Điền số thích hợp vào ô trống', blocks: [{ t: 'lines', cols: 3, items: ['6 + ? = 10', '5 - ? = 5', '5 + ? = 8', '2 + ? = 9', '7 - ? = 3', '8 - ? = 2'].map((s) => calc(s, true)) }] },
      {
        title: 'Bài 8: Nối. Sau đó tô màu vào phép tính có kết quả bé nhất.',
        blocks: [
          (() => {
            const top = ['7 + 2', '1 + 9', '4 − 4', '8 − 5', '9 − 2'];
            const bottom = ['0', '10', '9', '7', '3'];
            return { t: 'match', top: top.map((text) => ({ text })), bottom: bottom.map((text) => ({ text })), pairs: noi(top, bottom), topShape: 'box', bottomShape: 'apple' } as RawBlock;
          })(),
          { t: 'mc', q: 'Phép tính có kết quả bé nhất (tô màu):', opts: ['7 + 2', '1 + 9', '4 − 4', '8 − 5', '9 − 2'], ans: '4 − 4', cols: 5 },
        ],
      },
    ],
  },
  {
    ...giuaKi(23, { head: ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 23', ''] }),
    description: 'Xếp thứ tự, dãy số, so sánh, tách – gộp số và tính hai phép tính liên tiếp.',
    bai: [
      {
        title: 'Bài 1: (3 điểm) Viết các số 3, 0, 8, 4, 10, 2, 5',
        diem: 3,
        blocks: [{ t: 'lines', bullet: true, items: [`Xếp các số theo thứ tự từ bé đến lớn là: ${xep([3, 0, 8, 4, 10, 2, 5])}`, `Xếp các số theo thứ tự từ lớn đến bé : ${xep([3, 0, 8, 4, 10, 2, 5], true)}`] }],
      },
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 3, items: ['8 + 1 > ?', '6 - 4 > ?', '9 - 5 > ?', '3 + 2 < ?', '4 + 3 < ?', '5 + 4 < ?'].map((s) => ineq(s, false)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: ['1 _ _ 4 _', '_ 5 _ _ 8', '4 _ _ 1 _', '9 _ _ 6 _'].map((r) => ({ cells: day(r) })) }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 4, items: ['8 ? 9', '2 ? 2', '3 ? 4', '1 ? 0', '6 ? 6', '1 ? 5', '6 ? 9', '3 ? 5'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 5: (2 điểm) Tách - gộp số (viết các số còn thiếu)',
        diem: 2,
        blocks: [{ t: 'trees', shape: 'circle', items: [tachGop(10, 6, null), tachGop(null, 4, 1), tachGop(9, 3, null), tachGop(null, 4, 4)] }],
      },
      { title: 'Bài 6: (1 điểm) Viết phép tính thích hợp', diem: 1, blocks: [{ t: 'eq', items: [eq('d23-chuoi', 3, 3)] }] },
      {
        title: 'Bài 7: (1 điểm) Khoanh vào đáp án đúng',
        diem: 1,
        blocks: [{ t: 'row', cols: [[{ t: 'mc', q: 'a, Số nào lớn nhất?', opts: ['4', '9', '6', '10'], ans: '10' }], [{ t: 'mc', q: 'b, Số nào bé nhất?', opts: ['2', '6', '0', '7'], ans: '0' }]] }],
      },
      { title: 'Bài 8: (1 điểm) Viết số thích hợp', diem: 1, blocks: [{ t: 'lines', cols: 2, boxed: true, items: [calc('7 + 2 - 4 = ?'), calc('8 - 3 + 2 = ?')] }] },
    ],
  },
  {
    ...giuaKi(28, { head: ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 28', ''], phan: { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' } }),
    description: 'Đếm số lượng, tìm số thỏa điều kiện, tính và nối hai phép tính bằng nhau.',
    bai: [
      { title: 'Bài 1: Số?', blocks: [{ t: 'pics', framed: true, items: [8, 10, 6, 5].map((n, i) => ({ img: `d28-b1-${i + 1}`, cell: o(n) })) }] },
      { title: 'Bài 2: Số cần điền vào chỗ chấm là: 7 + ......... > 9', blocks: [{ t: 'mc', opts: ['1', '2', '3', '0'], ans: '3' }] },
      { title: 'Bài 3: Số cần điền vào chỗ chấm là: 9 - ............. < 2', blocks: [{ t: 'mc', opts: ['3', '7', '8', '5'], ans: '8' }] },
      { title: 'Bài 4: Số liền sau số 9 là số:', blocks: [{ t: 'mc', opts: ['8', '10', '9', '7'], ans: '10' }] },
      { title: 'Bài 6: Tính', blocks: [tinh4('6 + 2 = ?', '7 - 2 = ?', '6 + 4 = ?', '9 - 3 = ?', '4 + 3 = ?', '8 - 4 = ?', '4 + 5 = ?', '8 - 3 = ?')] },
      {
        title: 'Bài 7: Điền số thích hợp vào chỗ chấm',
        blocks: [
          {
            t: 'arrows',
            rows: [
              { cells: ['3', '7', '2'], labels: [`+ ${dot(4)}`, `− ${dot(5)}`], shapes: ['tri', 'circle', 'box'] },
              { cells: ['4', '9', '6'], labels: [`+ ${dot(5)}`, `− ${dot(3)}`], shapes: ['tri', 'circle', 'box'] },
            ],
          },
        ],
      },
      {
        title: 'Bài 8: Nối hai phép tính có kết quả giống nhau',
        blocks: [
          (() => {
            const top = ['6 + 3', '2 + 8', '9 − 9', '9 − 6', '8 − 2'];
            const bottom = ['5 + 5', '4 + 5', '7 − 1', '8 − 8', '0 + 3'];
            return { t: 'match', top: top.map((text) => ({ text })), bottom: bottom.map((text) => ({ text })), pairs: noi(top, bottom), topShape: 'box', bottomShape: 'box' } as RawBlock;
          })(),
        ],
      },
    ],
  },

  /* ───── Ôn tập học kì 1 (10 phiếu) ───── */
  {
    ...onTap(1),
    description: 'Tính, tìm số chưa biết, điền dấu + / −, so sánh với 5 và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('3 + 5 = ?', '6 + 4 = ?', '4 - 1 + 5 = ?', '10 - 2 + 3 = ?', '1 + 8 = ?', '7 + 0 = ?', '5 + 1 - 4 = ?', '3 + 3 - 6 = ?', '4 + 4 = ?', '1 + 5 = ?', '3 + 0 - 1 = ?', '4 + 2 - 1 = ?', '5 + 2 = ?', '3 + 2 = ?', '5 + 5 - 4 = ?', '10 - 5 + 4 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('3 + ? = 6', '? + 3 = 9', '3 + ? = 4', '5 + ? + 2 = 9', '10 - ? = 8', '? - 1 = 9', '? - 3 = 3', '? - 3 + 2 = 6', '1 + ? = 7', '? + 5 = 7', '7 + ? = 9', '3 + 2 + ? = 10', '10 - ? = 5', '? - 3 = 5', '? - 6 = 0', '7 - ? - 1 = 2')] },
      { title: 'Bài 3: Điền dấu +/-', blocks: [{ t: 'lines', cols: 3, items: ['4 ? 1 = 5', '7 ? 1 = 6', '2 ? 2 ? 2 = 6', '2 ? 8 = 10', '4 ? 3 = 7', '8 ? 1 ? 2 = 9', '6 ? 3 = 3', '5 ? 1 = 4', '3 ? 1 ? 5 = 7', '8 ? 4 = 4', '1 ? 8 = 9', '10 ? 8 ? 3 = 5'].map(dau) }] },
      {
        title: 'Bài 4: Cho các số: 2, 8, 1, 3, 7, 5',
        blocks: [
          {
            t: 'lines',
            items: [
              `a. Các số lớn hơn 5 là: ${dot('7|8')}, ${dot('7|8')}`,
              `b. Các số bé hơn 5 là: ${dot('1|2|3')}, ${dot('1|2|3')}, ${dot('1|2|3')}`,
              `c. Các số cộng với nhau bằng 9 là: ${dot('2|7')} và ${dot('7|2')}; ${dot('8|1')} và ${dot('1|8')}`,
              `d. Sắp xếp theo thứ tự từ bé đến lớn: ${xep([2, 8, 1, 3, 7, 5])}`,
            ],
          },
        ],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p12-tranh-1', 3, 1), eq('p12-tranh-2', 3, 4), eq('p12-tranh-3', 5, 2)] }] },
    ],
  },
  {
    ...onTap(2),
    description: 'Cộng ba số, tìm số chưa biết, điền số thích hợp, đếm hình và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('6 + 3 = ?', '1 + 4 = ?', '3 + 1 + 4 = ?', '0 + 1 + 3 = ?', '2 + 4 = ?', '3 + 3 = ?', '2 + 3 + 3 = ?', '2 + 2 + 2 = ?', '3 + 7 = ?', '4 + 5 = ?', '2 + 0 + 5 = ?', '3 + 2 + 0 = ?', '4 + 3 = ?', '7 + 1 = ?', '3 + 1 + 5 = ?', '4 + 5 + 1 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('3 + ? = 9', '? + 4 = 6', '1 + ? = 2', '1 + ? + 2 = 8', '1 - ? = 0', '? - 2 = 5', '? + 4 = 5', '? - 4 + 2 = 6', '4 + ? = 8', '? + 5 = 7', '1 + ? = 6', '5 + 3 - ? = 7', '6 - ? = 2', '? - 4 = 3', '? + 0 = 9', '4 + ? + 1 = 8')] },
      { title: 'Bài 3: Số?', blocks: [{ t: 'lines', cols: 4, items: ['9 < ?', '? < 1', '5 + 5 > ?', '2 + ? > 8', '3 > ?', '? < 8', '9 - 5 < ?', '8 - ? < 6', '7 < ?', '? > 9', '2 + 6 > ?', '1 + ? = 9', '6 > ?', '? > 3', '7 - 1 < ?', '4 - ? = 2'].map((s) => ineq(s)) }] },
      {
        title: 'Bài 4: Cho các số: 6, 2, 7, 9, 1',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '2fr'],
            cols: [
              [{ t: 'lines', items: [`a. Số lớn nhất là: ${dot(9)}`, `b. Số bé nhất là: ${dot(1)}`, `c. Số lớn nhất cộng số bé nhất bằng: ${dot(10)}`] }],
              [{ t: 'text', text: 'Bài 5: Đếm hình:' }, { t: 'img', src: 'p13-hinh', w: 130 }, { t: 'lines', items: [`Có ${dot(8)} hình tam giác`, `Có ${dot(3)} hình vuông`] }],
            ],
          },
        ],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p13-tranh-1', 4, 2), eq('p13-tranh-2', 3, 1), eq('p13-tranh-3', 4, 1)] }] },
    ],
  },
  {
    ...onTap(3),
    description: 'Phép trừ trong phạm vi 10, tìm số chưa biết, so sánh hai biểu thức và đếm hình.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('6 - 1 = ?', '6 - 5 = ?', '10 - 2 - 6 = ?', '0 + 5 - 2 = ?', '8 - 5 = ?', '9 - 5 = ?', '8 - 2 - 1 = ?', '9 - 3 + 4 = ?', '7 - 3 = ?', '4 - 2 = ?', '7 - 1 - 3 = ?', '5 + 5 - 2 = ?', '5 - 4 = ?', '2 - 2 = ?', '9 - 2 - 6 = ?', '7 - 5 + 4 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('6 - ? = 2', '? - 5 = 2', '7 - ? = 1', '8 - ? = 2', '8 - ? = 5', '? - 6 = 4', '? - 3 = 7', '? - 2 = 3', '9 - ? = 1', '? - 5 = 4', '6 - ? = 0', '10 - ? = 2', '4 - ? = 0', '? - 2 = 6', '? - 4 = 5', '? - 3 = 5')] },
      { title: 'Bài 3: Dấu > < = ?', blocks: [{ t: 'lines', cols: 3, items: ['1 + 6 ? 2 + 5', '5 + 2 - 2 ? 6 - 4 + 2', '7 - 2 ? 8 - 4', '8 - 4 + 1 ? 0 + 9 - 4', '10 - 3 ? 5 + 1', '10 - 4 - 0 ? 3 - 0 + 2', '4 - 4 ? 5 - 5', '9 - 4 ? 9 - 5', '6 - 0 + 3 ? 10 - 8 + 4'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 4: Tô màu phép tính có kết quả lớn nhất:',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '2fr'],
            cols: [
              [{ t: 'mc', opts: ['10 − 3', '8 − 3', '3 + 3', '8 − 4', '7 − 5', '5 − 2', '7 − 7'], ans: '10 − 3', cols: 3 }],
              [{ t: 'text', text: 'Bài 5: Đếm hình:' }, { t: 'img', src: 'p14-hinh', w: 130 }, { t: 'lines', items: [`Có ${dot(4)} hình tam giác`, `Có ${dot(2)} hình vuông`] }],
            ],
          },
        ],
      },
      { title: 'Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p14-tranh-1', 5, 2), eq('p14-tranh-2', 8, 2), eq('p14-tranh-3', 2, 2)] }] },
    ],
  },
  {
    ...onTap(4),
    description: 'Tính, so sánh biểu thức, số lớn nhất – bé nhất, xếp thứ tự, nối phép tính bằng nhau và đếm hình.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('2 + 4 = ?', '5 - 3 = ?', '6 - 4 + 3 = ?', '6 + 2 + 2 = ?', '6 - 1 = ?', '9 - 3 = ?', '7 - 5 + 1 = ?', '7 - 1 + 3 = ?', '2 + 5 = ?', '2 + 6 = ?', '3 + 4 - 4 = ?', '1 + 2 - 3 = ?', '10 - 2 = ?', '5 - 5 = ?', '4 + 4 - 8 = ?', '10 - 5 + 1 = ?')] },
      {
        title: 'Bài 2: Dấu >, <, =',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '2fr'],
            cols: [
              [{ t: 'lines', cols: 2, items: ['6 - 3 ? 5', '5 + 2 - 2 ? 6 - 4 + 2', '2 + 7 ? 6', '8 - 4 + 1 ? 0 + 9 - 4', '8 - 3 ? 7', '10 - 4 - 0 ? 3 - 0 + 2', '5 + 4 ? 9', '6 - 0 + 3 ? 10 - 8 + 4'].map((s) => cmp(s)) }],
              [{ t: 'text', text: 'Bài 3: Số?' }, { t: 'lines', cols: 2, items: ['5 - ? > 3', '? + 3 = 8', '8 + ? < 10', '? - 4 = 6', '5 + ? = 7', '? - 5 < 5', '4 - ? = 0', '? + 2 > 6'].map((s) => ineq(s, false)) }],
            ],
          },
        ],
      },
      {
        title: 'Bài 3: a. Cho các số: 8, 2, 6, 1, 5      b. Cho các số: 3, 7, 4, 9, 2',
        blocks: [
          {
            t: 'row',
            cols: [
              [{ t: 'lines', bullet: true, items: [`Số lớn nhất là: ${dot(8)}`, `Số bé nhất là: ${dot(1)}`, `Xếp theo thứ tự từ bé đến lớn: ${[1, 2, 5, 6, 8].map(o).join(' ')}`] }],
              [{ t: 'lines', bullet: true, items: [`Số lớn nhất là: ${dot(9)}`, `Số bé nhất là: ${dot(2)}`, `Xếp theo thứ tự từ lớn đến bé: ${[9, 7, 4, 3, 2].map(o).join(' ')}`] }],
            ],
          },
        ],
      },
      {
        title: 'Bài 4: Nối các phép tính có kết quả bằng nhau:',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '1fr'],
            cols: [
              [
                (() => {
                  const top = ['2 + 3', '1 + 7', '4 + 6', '3 + 4', '3 + 3', '1 + 4'];
                  const bottom = ['2 + 5', '4 + 2', '3 + 2', '5 + 5', '6 + 2', '1 + 4'];
                  return { t: 'match', top: top.map((text) => ({ text })), bottom: bottom.map((text) => ({ text })), pairs: noi(top, bottom), topShape: 'worm', bottomShape: 'worm' } as RawBlock;
                })(),
              ],
              [{ t: 'text', text: 'Bài 5: Số?' }, { t: 'img', src: 'p15-hinh', w: 130 }, { t: 'lines', items: [`Có ${dot(4)} hình tam giác`, `Có ${dot(1)} hình vuông`] }],
            ],
          },
        ],
      },
      { title: 'Bài 6: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p15-tranh-1', 3, 3), eq('p15-tranh-2', 6, 2), eq('p15-tranh-3', 5, 1)] }] },
    ],
  },
  {
    ...onTap(5),
    description: 'Tính nhẩm, so sánh, chuỗi phép tính trên ngôi sao, đúng – sai và đếm khối.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('5 + 3 = ?', '9 - 1 = ?', '10 - 6 + 1 = ?', '0 + 5 - 2 = ?', '8 - 5 = ?', '10 - 3 = ?', '8 - 2 + 3 = ?', '5 - 3 + 4 = ?', '2 + 8 = ?', '4 + 6 = ?', '5 + 5 - 6 = ?', '1 + 9 - 2 = ?', '8 - 4 = ?', '3 - 3 = ?', '4 + 3 - 7 = ?', '6 - 5 + 4 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('6 - ? = 2', '? + 5 = 7', '7 - ? = 1', '8 - ? = 2', '8 + ? = 10', '? - 6 = 4', '? - 3 = 7', '? - 2 = 3', '9 - ? = 1', '? - 5 = 4', '6 - ? = 0', '10 - ? = 4', '4 - ? = 0', '? + 2 = 6', '? - 4 = 5', '? - 3 = 5')] },
      { title: 'Bài 3: Dấu > < = ?', blocks: [{ t: 'lines', cols: 3, items: ['9 - 6 ? 2 + 5', '1 + 6 ? 2 + 5', '5 + 2 - 2 ? 6 - 4 + 2', '7 + 2 ? 10 - 4', '7 - 2 ? 8 - 4', '8 - 4 + 1 ? 0 + 9 - 4', '8 - 3 ? 6 - 1', '10 - 3 ? 5 + 1', '10 - 4 - 0 ? 3 - 0 + 2', '4 - 4 ? 5 - 5', '9 - 4 ? 9 - 5', '6 - 0 + 3 ? 10 - 8 + 4'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 4: Số?',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '1fr'],
            cols: [
              [{ t: 'arrows', shape: 'star', rows: [chuoi('9 -3 _ +2 _ -5 _ +7 _'), chuoi('5 +3 _ -6 _ +3 _ +4 _'), chuoi('_ -6 _ +4 5 +3 _ -7 _')] }],
              [{ t: 'text', text: 'Bài 5: Đ/S?' }, { t: 'lines', items: ['4 − 2 = 3  S', ds('7 - 3 = 4'), ds('9 - 5 > 3'), ds('8 - 6 < 1')] }],
            ],
          },
        ],
      },
      { title: 'Bài 6: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p16-tranh-1', 4, 4), eq('p16-tranh-2', 3, 3)] }] },
      { title: 'Bài 7: Số?', blocks: [{ t: 'row', widths: ['1fr', '1fr'], cols: [[{ t: 'img', src: 'p16-khoi', w: 200 }], [{ t: 'lines', items: [`Có: ${dot(3)} khối lập phương`, `${dot(2)} khối hộp chữ nhật`] }]] }] },
    ],
  },
  {
    ...onTap(6),
    description: 'Nối phép tính với kết quả, tìm số chưa biết, điền số, xếp thứ tự và viết phép tính theo tranh.',
    bai: [
      {
        title: 'Bài 1: Nối',
        blocks: [
          (() => {
            const top = ['5 + 2', '1 + 9 − 2', '2 + 7', '4 − 1 + 7', '7 − 3 + 4', '5 + 5 − 1', '2 + 1 + 7'];
            const bottom = ['9', '7', '8', '10'];
            return { t: 'match', top: top.map((text) => ({ text })), bottom: bottom.map((text) => ({ text })), pairs: noi(top, bottom), topShape: 'worm', bottomShape: 'leaf' } as RawBlock;
          })(),
        ],
      },
      { title: 'Bài 2: Số?', blocks: [so4('5 + ? = 6', '? - 4 = 2', '4 + ? = 10', '4 + ? + 1 = 10', '2 + ? = 5', '? - 2 = 8', '? + 3 = 7', '? + 1 + 6 = 7', '? + 3 = 8', '9 - ? = 3', '8 - ? = 6', '5 + 0 + ? = 8', '? + 1 = 4', '5 - ? = 1', '5 - ? = 2', '2 + ? + 2 = 10')] },
      { title: 'Bài 3: Số?', blocks: [{ t: 'lines', cols: 4, items: ['4 > ?', '? > 6', '2 + 5 > ?', '2 + ? > 5', '7 < ?', '? > 2', '4 + 4 < ?', '5 + ? < 8', '2 > ?', '? < 5', '3 + 3 > ?', '1 + ? < 4', '9 < ?', '? < 1', '6 + 3 < ?', '5 + ? > 10'].map((s) => ineq(s)) }] },
      {
        title: 'Bài 4: a. Cho các số: 5, 3, 9, 7, 6      b. Cho các số: 2, 8, 4, 1, 5',
        blocks: [
          {
            t: 'row',
            cols: [
              [{ t: 'lines', items: ['- Xếp theo thứ tự từ bé đến lớn:', [3, 5, 6, 7, 9].map(o).join(' ')] }],
              [{ t: 'lines', items: ['- Xếp theo thứ tự từ lớn đến bé:', [8, 5, 4, 2, 1].map(o).join(' ')] }],
            ],
          },
        ],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p17-tranh-1', 4, 1), eq('p17-tranh-2', 3, 1), eq('p17-tranh-3', 'any')] }] },
    ],
  },
  {
    ...onTap(7),
    description: 'Tính, tìm số chưa biết, điền số thích hợp, tách – gộp số và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('2 + 5 = ?', '2 + 4 = ?', '4 + 1 - 2 = ?', '0 + 2 + 6 = ?', '1 + 6 = ?', '7 - 3 = ?', '5 - 1 + 0 = ?', '3 - 1 + 8 = ?', '3 + 4 = ?', '5 - 5 = ?', '3 - 0 + 4 = ?', '3 - 2 + 9 = ?', '5 - 3 = ?', '6 - 2 = ?', '5 + 2 - 6 = ?', '3 + 0 + 3 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('7 + ? = 8', '? + 3 = 8', '5 + ? = 10', '10 - ? = 8', '1 + ? = 6', '? + 1 = 9', '? + 6 = 7', '6 - ? = 5', '2 + ? = 9', '? + 2 = 6', '1 + ? = 6', '? - 4 = 6', '0 + ? = 5', '? + 2 = 10', '? + 0 = 4', '? - 3 = 5')] },
      { title: 'Bài 3: Số?', blocks: [{ t: 'lines', cols: 4, items: ['5 < ?', '? < 4', '5 + 5 > ?', '2 + ? > 7', '7 > ?', '? < 6', '4 + 3 < ?', '5 + ? < 6', '9 < ?', '? > 8', '1 + 4 > ?', '1 + ? < 5', '5 > ?', '? > 9', '8 + 1 < ?', '5 + ? > 8'].map((s) => ineq(s)) }] },
      {
        title: 'Bài 4: Số?',
        blocks: [{ t: 'trees', topShape: 'square', shape: 'circle', items: [tachGop(4, null, 0), tachGop(6, 1, null), tachGop(8, null, 3), tachGop(9, 3, null), tachGop(8, null, 1, 3), tachGop(10, 2, null, 3)] }],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p18-tranh-1', 3, 1), eq('p18-tranh-2', 3, 4), eq('p18-tranh-3', 5, 2)] }] },
    ],
  },
  {
    ...onTap(8),
    description: 'Tính, tìm số chưa biết, điền số thích hợp, tách – gộp số và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('7 + 1 = ?', '7 - 5 = ?', '10 - 5 + 3 = ?', '4 + 5 - 2 = ?', '6 - 3 = ?', '6 + 3 = ?', '4 + 3 - 6 = ?', '5 - 2 + 4 = ?', '1 + 4 = ?', '10 - 3 = ?', '6 + 2 - 3 = ?', '7 - 5 + 8 = ?', '9 - 8 = ?', '2 + 4 = ?', '2 - 1 + 9 = ?', '3 + 6 - 1 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('6 + ? = 10', '? + 4 = 8', '5 - ? = 2', '? - 5 = 3', '2 + ? = 7', '? + 2 = 9', '8 - ? = 4', '? - 1 = 2', '5 + ? = 8', '? + 5 = 6', '10 - ? = 4', '? - 6 = 3', '4 + ? = 6', '? + 4 = 10', '7 - ? = 1', '? - 4 = 0')] },
      { title: 'Bài 3: Số?', blocks: [{ t: 'lines', cols: 4, items: ['1 + 3 < ?', '3 + 4 > ?', '? > 2 + 2', '? > 4 + 5', '5 - 2 < ?', '6 - 3 < ?', '? > 8 - 1', '? < 6 - 5', '3 + 4 > ?', '9 - 2 > ?', '? < 10 - 4', '? < 4 + 4', '5 - 4 > ?', '2 + 7 < ?', '? < 4 + 2', '? > 3 + 3'].map((s) => ineq(s)) }] },
      {
        title: 'Bài 4: Số?',
        blocks: [{ t: 'trees', topShape: 'square', shape: 'circle', items: [tachGop(6, null, 3), tachGop(7, 2, null), tachGop(9, null, 2), tachGop(5, 1, null), tachGop(10, null, 3, 2), tachGop(9, 1, null, 5)] }],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p19-tranh-1', 5, 5), eq('p19-tranh-2', 3, 1), eq('p19-tranh-3', 4, 1)] }] },
    ],
  },
  {
    ...onTap(9),
    description: 'Tính, tìm số bị trừ – số trừ, so sánh, nối phép tính với kết quả, tháp số và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('4 + 2 = ?', '6 - 3 = ?', '2 - 1 + 4 = ?', '0 + 6 - 5 = ?', '2 + 3 = ?', '6 + 3 - 0 = ?', '4 - 2 + 4 = ?', '2 + 5 = ?', '10 - 2 = ?', '4 + 0 - 2 = ?', '9 - 5 + 2 = ?', '4 - 3 = ?', '6 + 4 = ?', '5 - 1 + 2 = ?', '4 + 5 - 1 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('2 - ? = 1', '? - 3 = 7', '10 - ? = 8', '7 - ? = 2', '3 - ? = 0', '? - 5 = 3', '? - 3 = 2', '? - 1 = 3', '5 - ? = 1', '? - 2 = 5', '6 - ? = 6', '10 - ? = 7', '7 - ? = 6', '? - 4 = 4', '? - 2 = 5', '3 - ? = 2')] },
      { title: 'Bài 3: Dấu > < = ?', blocks: [{ t: 'lines', cols: 4, items: ['4 ? 7', '3 ? 8', '8 - 5 ? 2 + 3', '6 + 2 ? 7 - 4', '9 ? 5', '4 ? 5', '8 + 2 ? 9 - 4', '3 - 1 ? 2 + 3', '10 ? 9', '8 ? 4', '10 - 6 ? 8 + 1', '4 - 0 ? 4 + 0', '6 ? 8', '2 ? 1', '4 + 4 ? 9 - 7', '0 + 2 ? 0 + 5'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 4: Nối?',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '1fr'],
            cols: [
              [
                (() => {
                  const top = ['6 + 2', '2 + 5', '3 + 6', '10 − 3', '9 − 1', '10 − 1'];
                  const bottom = ['8', '7', '9'];
                  return { t: 'match', top: top.map((text) => ({ text })), bottom: bottom.map((text) => ({ text })), pairs: noi(top, bottom), topShape: 'box', bottomShape: 'fish' } as RawBlock;
                })(),
              ],
              [{ t: 'pyramid', rows: thap([[8], [5, null], [null, 1, null], [null, 1, 0, null]]) }],
            ],
          },
        ],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p20-tranh-1', 7, 2), eq('p20-tranh-2', 5, 3), eq('p20-tranh-3', 3, 2)] }] },
    ],
  },
  {
    ...onTap(10),
    description: 'Cộng trừ, tìm số chưa biết, so sánh, chuỗi phép cộng, tháp số và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Tính:', blocks: [tinh4('5 + 2 = ?', '8 + 2 = ?', '1 + 2 + 6 = ?', '5 + 5 - 4 = ?', '7 - 3 = ?', '2 + 3 = ?', '5 - 2 + 1 = ?', '2 - 2 + 5 = ?', '10 - 4 = ?', '6 - 4 = ?', '3 + 0 + 5 = ?', '10 - 6 + 2 = ?', '0 + 8 = ?', '5 - 2 = ?', '2 - 1 + 9 = ?', '6 - 2 + 1 = ?')] },
      { title: 'Bài 2: Số?', blocks: [so4('3 + ? = 6', '? + 4 = 7', '5 + ? = 8', '1 + ? = 8', '2 + ? = 4', '? + 1 = 9', '? + 5 = 9', '? + 2 = 9', '5 + ? = 10', '? + 4 = 6', '1 + ? = 7', '5 + ? = 7', '4 + ? = 8', '? + 3 = 10', '? + 4 = 6', '3 + ? = 10')] },
      { title: 'Bài 3: Dấu > < = ?', blocks: [{ t: 'lines', cols: 4, items: ['3 ? 5', '2 ? 7', '1 + 6 ? 7 - 5', '3 + 3 ? 10 - 5', '5 ? 2', '8 ? 4', '9 - 2 ? 3 + 4', '6 - 4 ? 6 + 4', '7 ? 9', '5 ? 6', '2 + 3 ? 2 + 1', '6 + 2 ? 2 + 5', '6 ? 3', '1 ? 0', '4 - 4 ? 5 - 5', '9 - 4 ? 8 - 5'].map((s) => cmp(s)) }] },
      {
        title: 'Bài 4: Số?',
        blocks: [
          {
            t: 'row',
            widths: ['3fr', '1fr'],
            cols: [
              [{ t: 'arrows', shape: 'pot', rows: [chuoi('3 +2 _ +0 _ +2 _ +1 _ +2 _'), chuoi('2 +2 _ +1 _ +3 _ +0 _ +1 _'), chuoi('_ +1 _ +2 5 +0 _ +1 _ +3 _')] }],
              [{ t: 'pyramid', rows: thap([[10], [4, null], [null, 1, null], [null, 1, 0, null]]) }],
            ],
          },
        ],
      },
      { title: 'Bài 5: Viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eq('p21-tranh-1', 3, 1), eq('p21-tranh-2', 5, 2), eq('p21-tranh-3', 3, 5)] }] },
    ],
  },
];

export const DE_TOAN: RawPhieu[] = PHIEU.map((p) => ({ ...p, bai: p.bai.map((b) => ({ ...b, title: m(b.title) })) }));
