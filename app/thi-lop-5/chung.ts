// Hàm soạn đề Toán lớp 5 dùng chung cho các file đề (de-gk-*.ts, de-hk-*.ts).
// Số thập phân viết kiểu Việt Nam "12,5"; phân số trong chữ viết `{3/4}` (PhieuThi vẽ xếp chồng), hỗn số `2{3/4}`.

import type { RawBai, RawBlock, RawPhieu } from '../thi-lop-1/kieu';

export const I = (n: string) => `/thi-lop-5/${n}`;

/** "12,5 × 3 : (2 − 0,5)" → biểu thức JS (dấu phẩy thập phân → chấm). */
const js = (expr: string) =>
  expr
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/×|x(?=\s*[\d(])/g, '*')
    .replace(/:/g, '/')
    .replace(/−|–/g, '-');

/** Tính biểu thức số thập phân (làm tròn 6 chữ số để bỏ sai số dấu phẩy động); kết quả phải ≥ 0. */
export function ev(expr: string): number {
  const e = js(expr);
  if (!/^[\d\s+\-*/().]+$/.test(e)) throw new Error(`Biểu thức lạ: ${expr}`);
  const v = Function(`"use strict";return (${e})`)() as number;
  const r = Math.round(v * 1e6) / 1e6;
  if (!Number.isFinite(r) || r < 0) throw new Error(`Kết quả lạ: ${expr} = ${v}`);
  if (Math.abs(r * 1e4 - Math.round(r * 1e4)) > 1e-6) throw new Error(`Kết quả quá 4 chữ số thập phân: ${expr} = ${v}`);
  return r;
}
/** 12.5 → "12,5" */
export const vn = (n: number) => String(n).replace('.', ',');
const dep = (s: string) => s.replace(/ - /g, ' − ').replace(/ \* /g, ' × ');

/** Tìm x (số thập phân cũng được) để đẳng thức đúng: giải tuyến tính rồi kiểm lại. */
function giai(eq: string): number {
  const [l, r] = eq.split('=');
  const thay = (s: string, x: number) => s.replace(/\b[xya]\b/g, `(${x})`);
  const raw = (s: string) => Function(`"use strict";return (${js(s)})`)() as number;
  const g = (x: number) => raw(thay(l, x)) - raw(thay(r, x));
  const ok = (x: number) => Math.abs(g(x)) < 1e-6;
  const g0 = g(0);
  const g1 = g(1);
  if (Number.isFinite(g0) && Number.isFinite(g1) && g1 !== g0) {
    const x = Math.round((-g0 / (g1 - g0)) * 1e4) / 1e4;
    if (x >= 0 && ok(x)) return x;
  }
  // x ở số chia / mẫu số → thử dần
  for (let k = 1; k <= 100000; k++) {
    const x = k / 100;
    if (ok(x)) return x;
  }
  throw new Error(`Không giải được: ${eq}`);
}

/** "x × 2,5 = 10"  →  x = [ô] */
export const timX = (eq: string, bien = 'x') => `${dep(eq)}   →   ${bien} = [[N:${vn(giai(eq))}]]`;
/** "a + b × c" = [ô] */
export const tinh = (e: string) => `${dep(e)} = [[n:${vn(ev(e))}]]`;
/** Đặt tính: + − × theo cột; chia ghi thương (chia hết, kể cả thập phân) hoặc thương + số dư (số tự nhiên). */
export const datTinh = (...es: string[]): RawBlock[] => {
  const cot = es.filter((e) => !e.includes(':'));
  const chia = es.filter((e) => e.includes(':'));
  const out: RawBlock[] = [];
  if (cot.length) out.push({ t: 'cols', items: cot.map((e) => `${e.replace(' - ', ' − ')} = ${vn(ev(e))}`) });
  if (chia.length)
    out.push({
      t: 'lines',
      cols: 2,
      items: chia.map((e) => {
        const [a, b] = e.split(':').map((x) => x.trim());
        try {
          return `${a} : ${b} = [[n:${vn(ev(e))}]]`;
        } catch {
          const A = Number(a);
          const Bn = Number(b);
          if (!Number.isInteger(A) || !Number.isInteger(Bn)) throw new Error(`Chia không hết: ${e}`);
          return `${a} : ${b} = [[n:${Math.floor(A / Bn)}]] (dư [[n:${A % Bn}]])`;
        }
      }),
    });
  return out;
};

export const mc = (q: string, opts: string[], ans: string): RawBlock => {
  // độ dài hiển thị: phân số {a/b} tính như 2 ký tự
  const len = (o: string) => o.replace(/\{([^{}/]+)\/([^{}]+)\}/g, 'ab').length;
  if (!opts.includes(ans)) throw new Error(`Đáp án "${ans}" không có trong lựa chọn: ${opts.join(' | ')}`);
  return { t: 'mc', q, opts, ans, cols: opts.some((o) => len(o) > 24) ? 1 : opts.some((o) => len(o) > 12) ? 2 : Math.min(opts.length, 4) };
};
export const ln = (items: string[], cols = 1): RawBlock => ({ t: 'lines', cols, items });
export const tx = (text: string): RawBlock => ({ t: 'text', text });
export const img = (src: string, w = 260): RawBlock => ({ t: 'img', src: I(src), w });
/** Chữ / ô bên trái, hình bên phải. */
export const hinh = (src: string, w: number, blocks: RawBlock[]): RawBlock => ({ t: 'row', widths: ['3fr', '2fr'], cols: [blocks, [img(src, w)]] });
/** Ô li viết tay (không chấm). */
export const viet = (dong = 2): RawBlock => ({ t: 'viet', dong });
/** Bài giải có lời văn: ô li viết + dòng đáp số có ô. */
export const loiVan = (dapSo: string[]): RawBlock[] => [viet(2), ln(dapSo)];
export const B = (title: string, blocks: RawBlock[], diem?: number): RawBai => ({ title, diem, blocks });
/** Câu trắc nghiệm một khối (kèm hình bên phải nếu có). */
export const T = (q: string, opts: string[], ans: string, anh?: [string, number], diem?: number) => {
  const m = mc('', opts, ans);
  // Cạnh hình chỉ còn ~3/5 bề ngang → tối đa 2 cột để "3900 cm²" không bị xuống dòng
  return B(q, [anh ? hinh(anh[0], anh[1], [m.t === 'mc' ? { ...m, cols: Math.min(m.cols ?? 2, 2) } : m]) : m], diem);
};
/** Bấm chọn các số đúng trong dãy. */
export const chon = (day: (number | string)[], dung: (number | string)[]): RawBlock => ({ t: 'gach', cau: day.join('   '), dung: dung.map(String) });
/** Đúng ghi Đ, sai ghi S. */
export const ds = (s: string, d: boolean) => `${s}  [[D:${d ? 'Đ' : 'S'}]]`;
/** Sắp xếp dãy số (thập phân được): ô trống theo thứ tự đúng. */
export const xep = (nums: number[], tang: boolean) =>
  [...nums]
    .sort((a, b) => (tang ? a - b : b - a))
    .map((n) => `[[n:${vn(n)}]]`)
    .join(' ;  ');

/** Đề kiểm tra giữa kì 1 (phần I trắc nghiệm, phần II tự luận). `diemTn`: điểm mỗi câu trắc nghiệm nếu đề không ghi. */
export const gk = (n: number, desc: string, tn: RawBai[], tl: RawBai[], diemTn?: number): RawPhieu => ({
  slug: `toan-lop-5-giua-ki-1-de-${n}`,
  title: `Đề kiểm tra giữa kì 1 – Toán lớp 5 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ KIỂM TRA GIỮA HỌC KÌ I – TOÁN 5', `ĐỀ SỐ ${n}`, ' 5'],
  thoiGian: 40,
  phan: tn.length ? { 0: 'I. Trắc nghiệm', [tn.length]: 'II. Tự luận' } : undefined,
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? diemTn })), ...tl],
});
/** Đề kiểm tra học kì 1. Đề không chia phần thì để `tn` rỗng, mọi câu vào `tl`. */
export const hk = (n: number, desc: string, tn: RawBai[], tl: RawBai[], diemTn?: number): RawPhieu => ({
  slug: `toan-lop-5-hoc-ki-1-de-${n}`,
  title: `Kiểm tra học kì 1 – Toán lớp 5 – Đề ${n}`,
  description: desc,
  mon: 'toan',
  kieu: 'giua-ki',
  head: ['ĐỀ KIỂM TRA HỌC KÌ I – TOÁN 5', `ĐỀ SỐ ${n}`, ' 5'],
  thoiGian: 40,
  phan: tn.length ? { 0: 'I. Phần trắc nghiệm', [tn.length]: 'II. Phần tự luận' } : undefined,
  bai: [...tn.map((b) => ({ ...b, diem: b.diem ?? diemTn })), ...tl],
});
