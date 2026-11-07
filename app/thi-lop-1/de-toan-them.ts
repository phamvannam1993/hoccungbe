// 22 đề Kiểm tra giữa kì 1 – Toán lớp 1 soạn thêm cho đủ Đề 1 → Đề 30, theo đúng 4 mẫu trình bày của bộ
// đề giấy (Đề 1/4/23 · Đề 13/28 · Đề 19/21 · Đề 10). Số liệu sinh theo số đề (cố định, tải lại không đổi),
// chỉ trong phạm vi 10 của học kì 1; đáp án tính bằng giai.ts. Tranh ghép từ hình đơn cắt ở bản scan.

import { calc, chuoi, cmp, dau, day, dot, ds, hoPhepTinh, ineq, kq, o, tachGop } from './giai';
import type { Nhom, RawBai, RawBlock, RawPhieu } from './kieu';

/* ─────────── Ngẫu nhiên có hạt giống ─────────── */

function rngOf(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type R = () => number;
const int = (r: R, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const pick = <T,>(r: R, xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
const tron = <T,>(r: R, xs: readonly T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const khacNhau = (r: R, k: number, lo: number, hi: number) => tron(r, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, k);

/* ─────────── Mẩu bài dùng chung ─────────── */

const xep = (nums: number[], giam = false) => [...nums].sort((a, b) => (giam ? b - a : a - b)).map(dot).join(', ');

/** Phép cộng/trừ ngẫu nhiên trong phạm vi 10: "a + b" hoặc "a - b". */
function bieuThuc(r: R, cong = r() < 0.5) {
  if (cong) {
    const a = int(r, 0, 9);
    return `${a} + ${int(r, 0, 10 - a)}`;
  }
  const a = int(r, 1, 10);
  return `${a} - ${int(r, 0, a)}`;
}
function haiPhep(r: R) {
  for (;;) {
    const s = `${bieuThuc(r)} ${pick(r, ['+', '-'])} ${int(r, 0, 5)}`;
    try {
      if (kq(s) <= 10) return s;
    } catch {
      /* bước âm → thử lại */
    }
  }
}

/** Dãy 5 ô cách đều như Bài 3 Đề 1: "0 _ _ 3 _" / "_ 6 _ _ 9". */
function day5(r: R) {
  const tang = r() < 0.5;
  const dau0 = tang ? int(r, 0, 6) : int(r, 4, 10);
  const vals = Array.from({ length: 5 }, (_, i) => (tang ? dau0 + i : dau0 - i));
  const giu = pick(r, [[0, 3], [1, 4], [0, 4], [1, 3]]);
  return vals.map((v, i) => (giu.includes(i) ? String(v) : '_')).join(' ');
}

/** Dãy 10 ô như Bài 7 Đề 13: 1 → 10 hoặc 10 → 1, giữ lại 4 số. */
function day10(r: R) {
  const tang = r() < 0.5;
  const vals = Array.from({ length: 10 }, (_, i) => (tang ? i + 1 : 10 - i));
  const giu = pick(r, [[0, 3, 6, 9], [0, 2, 5, 8], [1, 4, 7, 9]]);
  return vals.map((v, i) => (giu.includes(i) ? String(v) : '_')).join(' ');
}

/** Tách – gộp: số trên 4–10, một ô cần điền (trên hoặc một nhánh). */
function tg(r: R) {
  const top = int(r, 4, 10);
  const a = int(r, 1, top - 1);
  const kieu = int(r, 0, 2);
  return kieu === 0 ? tachGop(null, a, top - a) : kieu === 1 ? tachGop(top, a, null) : tachGop(top, null, top - a);
}

const TEN = ['An', 'Bình', 'Lan', 'Mai', 'Nam', 'Hoa', 'Minh', 'Linh'];
const DO_VAT: { ten: string; icon: string }[] = [
  { ten: 'quả táo', icon: 'tao' },
  { ten: 'quả lê', icon: 'lev' },
  { ten: 'quả chuối', icon: 'chuoi' },
  { ten: 'cái bánh', icon: 'banh1' },
  { ten: 'quả dâu', icon: 'dau' },
];
const MAU_DEM = ['dau', 'catim', 'cachua', 'le', 'banh1', 'banh2', 'banh3', 'banh4', 'chuoi', 'tao', 'lev', 'hoa'];

/** Bài toán có lời văn kèm tranh (Bài 6 Đề 1 / Đề 10). */
function loiVan(r: R): RawBlock[] {
  const [ten, ten2] = tron(r, TEN);
  const dv = pick(r, DO_VAT);
  if (r() < 0.5) {
    const a = int(r, 2, 7);
    const b = int(r, 1, 10 - a);
    return [
      { t: 'text', text: `${ten} có ${a} ${dv.ten}. ${ten2} cho ${ten} thêm ${b} ${dv.ten}. Hỏi ${ten} có tất cả bao nhiêu ${dv.ten}?` },
      {
        t: 'row',
        widths: ['1fr', '1fr'],
        cols: [[{ t: 'lines', items: [`Phép tính: ${dot(`${a}|${b}`)} + ${dot(`${b}|${a}`)} = ${dot(a + b)}`, `Trả lời: ${ten} có ${dot(a + b)} ${dv.ten}`] }], [{ t: 'nhom', nhom: [{ icon: dv.icon, n: a }, { icon: dv.icon, n: b }] }]],
      },
    ];
  }
  const a = int(r, 5, 9);
  const b = int(r, 1, a - 2);
  return [
    { t: 'text', text: `${ten} có ${a} ${dv.ten}. ${ten} cho bạn ${b} ${dv.ten}. Hỏi ${ten} còn lại bao nhiêu ${dv.ten}?` },
    {
      t: 'row',
      widths: ['1fr', '1fr'],
      cols: [[{ t: 'lines', items: [`Phép tính: ${dot(a)} - ${dot(b)} = ${dot(a - b)}`, `Trả lời: ${ten} còn lại ${dot(a - b)} ${dv.ten}`] }], [{ t: 'nhom', nhom: [{ icon: dv.icon, n: a, gach: b }] }]],
    },
  ];
}

/** Bài viết phép tính theo tranh: hai nhóm cộng, hoặc một hàng có hình bị gạch (trừ). */
function eqTranh(r: R, icon: string) {
  if (r() < 0.6) {
    const a = int(r, 1, 6);
    const b = int(r, 1, 10 - a);
    return { nhom: [{ icon, n: a }, { icon, n: b }] as Nhom[], ans: hoPhepTinh(a, b) };
  }
  const a = int(r, 4, 9);
  const b = int(r, 1, a - 1);
  return { nhom: [{ icon, n: a, gach: b }] as Nhom[], ans: hoPhepTinh(a - b, b) };
}

/** "Số nào lớn/bé nhất?" — 4 số khác nhau. */
function mcCucTri(r: R, q: string, lon: boolean): RawBlock {
  const opts = khacNhau(r, 4, 0, 10);
  const ans = lon ? Math.max(...opts) : Math.min(...opts);
  return { t: 'mc', q, opts: opts.map(String), ans: String(ans) };
}

/** Câu trắc nghiệm có đúng một lựa chọn đúng: đáp án + 3 nhiễu khác nhau. */
function mcSo(r: R, ans: number, lo = 0, hi = 10, nhieu?: number[]) {
  const pool = (nhieu ?? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).filter((x) => x !== ans);
  const opts = tron(r, [ans, ...tron(r, pool).slice(0, 3)]);
  return { opts: opts.map(String), ans: String(ans) };
}

const dauSoSanh = (a: number, b: number) => (a === b ? '=' : a < b ? '<' : '>');

/* ─────────── 4 mẫu đề ─────────── */

const meta = (n: number, phan?: Record<number, string>) => ({
  slug: `toan-giua-ki-1-de-${n}`,
  title: `Kiểm tra giữa kì 1 – Toán lớp 1 – Đề ${n}`,
  mon: 'toan' as const,
  kieu: 'giua-ki' as const,
  head: ['KIỂM TRA GIỮA KÌ 1', `MÔN: TOÁN - Đề ${n}`, phan ? '' : ' 1A'],
  thoiGian: 40,
  phan,
});

/** Mẫu Đề 1 / 4 / 23: 8 bài có ghi điểm. */
function mauA(n: number, r: R): RawPhieu {
  const nums = khacNhau(r, 7, 0, 10);
  const ds1 = nums.join(', ');
  const b1: RawBai =
    r() < 0.5
      ? { title: `Bài 1: (3 điểm) Viết các số ${ds1}`, diem: 3, blocks: [{ t: 'lines', bullet: true, items: [`Số bé nhất là: ${dot(Math.min(...nums))}`, `Số lớn nhất là: ${dot(Math.max(...nums))}`, `Xếp các số theo thứ tự từ bé đến lớn: ${xep(nums)}`] }] }
      : { title: `Bài 1: (3 điểm) Viết các số ${ds1}`, diem: 3, blocks: [{ t: 'lines', bullet: true, items: [`Xếp các số theo thứ tự từ bé đến lớn là: ${xep(nums)}`, `Xếp các số theo thứ tự từ lớn đến bé : ${xep(nums, true)}`] }] };
  const lon = khacNhau(r, 3, 3, 10).map((a) => `${a} > ?`);
  const be = khacNhau(r, 3, 1, 9).map((a) => `${a} < ?`);
  const cmpItems = Array.from({ length: 8 }, () => {
    const a = int(r, 0, 10);
    return `${a} ? ${r() < 0.2 ? a : int(r, 0, 10)}`;
  });
  return {
    ...meta(n),
    description: 'Thứ tự các số trong phạm vi 10, so sánh, dãy số, tách – gộp số và bài toán có lời văn.',
    bai: [
      b1,
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 3, items: [...lon, ...be].map((s) => ineq(s, false)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: Array.from({ length: 4 }, () => ({ cells: day(day5(r)) })) }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 4, items: cmpItems.map((s) => cmp(s)) }] },
      { title: 'Bài 5: (2 điểm) Tách - gộp số (viết các số còn thiếu)', diem: 2, blocks: [{ t: 'trees', shape: pick(r, ['circle', 'square'] as const), items: Array.from({ length: 4 }, () => tg(r)) }] },
      { title: 'Bài 6: (1 điểm)', diem: 1, blocks: loiVan(r) },
      { title: 'Bài 7: (1 điểm) Khoanh vào đáp án đúng', diem: 1, blocks: [{ t: 'row', cols: [[mcCucTri(r, 'a, Số nào lớn nhất?', true)], [mcCucTri(r, 'b, Số nào bé nhất?', false)]] }] },
      { title: 'Bài 8: (1 điểm) Viết số thích hợp', diem: 1, blocks: [{ t: 'lines', cols: 2, boxed: true, items: [calc(`${r() < 0.5 ? bieuThuc(r) : haiPhep(r)} = ?`), calc(`${r() < 0.5 ? bieuThuc(r) : haiPhep(r)} = ?`)] }] },
    ],
  };
}

/** Mẫu Đề 13 / 28: I. Trắc nghiệm (tranh đếm, dấu, số) – II. Tự luận (tính, dãy, tách – gộp hoặc nối). */
function mauB(n: number, r: R): RawPhieu {
  const icons = tron(r, MAU_DEM).slice(0, 4);
  const dem = khacNhau(r, 4, 3, 10);
  const [x, y] = [bieuThuc(r), bieuThuc(r)];
  const dauDung = dauSoSanh(kq(x), kq(y));
  const tinh8 = Array.from({ length: 8 }, () => `${bieuThuc(r)} = ?`);

  const lien = int(r, 1, 9);
  const b3: RawBai =
    r() < 0.5
      ? (() => {
          const s = khacNhau(r, 4, 0, 10);
          return { title: `Bài 3: Số bé nhất trong các số: ${s.join(', ')} là:`, blocks: [{ t: 'mc', opts: s.map(String), ans: String(Math.min(...s)) }] };
        })()
      : { title: `Bài 3: Số liền trước số ${lien} là số:`, blocks: [{ t: 'mc', ...mcSo(r, lien - 1, Math.max(0, lien - 3), Math.min(10, lien + 2)) }] };

  // "a + … > t" / "c - … < d": đúng một lựa chọn thoả (các nhiễu đều nhỏ hơn đáp án)
  const b4: RawBai =
    r() < 0.5
      ? (() => {
          const a = int(r, 3, 7);
          const t = int(r, a + 2, 10);
          const ans = t - a + 1;
          return { title: `Bài 4: Số cần điền vào chỗ chấm là: ${a} + ......... > ${t}`, blocks: [{ t: 'mc', ...mcSo(r, ans, 0, 10, Array.from({ length: ans }, (_, i) => i)) }] };
        })()
      : (() => {
          const c = int(r, 6, 10);
          const d = int(r, 2, 4);
          const ans = c - d + 1;
          return { title: `Bài 4: Số cần điền vào chỗ chấm là: ${c} - ............. < ${d}`, blocks: [{ t: 'mc', ...mcSo(r, ans, 0, 10, Array.from({ length: ans }, (_, i) => i)) }] };
        })();

  const b8: RawBai =
    r() < 0.5
      ? { title: 'Bài 8: Tách - gộp. Điền số thích hợp vào ô trống', blocks: [{ t: 'trees', shape: 'circle', fill: true, items: Array.from({ length: 4 }, () => tg(r)) }] }
      : (() => {
          // 5 cặp phép tính bằng nhau, kết quả khác nhau
          const kqs = khacNhau(r, 5, 1, 10);
          const ra = (v: number, khac?: string): string => {
            for (;;) {
              const s = r() < 0.6 ? (() => { const a = int(r, 0, v); return `${a} + ${v - a}`; })() : (() => { const a = int(r, v, 10); return `${a} - ${a - v}`; })();
              if (s !== khac) return s;
            }
          };
          const top = kqs.map((v) => ra(v));
          const bottom = tron(r, kqs.map((v, i) => ra(v, top[i])));
          const pairs = top.map((t) => bottom.findIndex((b) => kq(b) === kq(t)));
          const dep = (s: string) => s.replace(' - ', ' − ');
          return { title: 'Bài 8: Nối hai phép tính có kết quả giống nhau', blocks: [{ t: 'match', top: top.map((s) => ({ text: dep(s) })), bottom: bottom.map((s) => ({ text: dep(s) })), pairs, topShape: 'box', bottomShape: 'box' }] };
        })();

  return {
    ...meta(n, { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' }),
    description: 'Đếm số lượng, so sánh, số liền trước – liền sau, tính, dãy số và tách – gộp số.',
    bai: [
      { title: 'Bài 1: Số?', blocks: [{ t: 'pics', framed: true, items: icons.map((icon, i) => ({ nhom: { icon, n: dem[i] }, cell: o(dem[i]) })) }] },
      { title: `Bài 2: Dấu cần điền vào chỗ chấm là: ${x} .............. ${y}`, blocks: [{ t: 'mc', opts: ['>', '<', '='], ans: dauDung, cols: 3 }] },
      b3,
      b4,
      { title: 'Bài 6: Tính', blocks: [{ t: 'grid', border: true, rows: [tinh8.slice(0, 4), tinh8.slice(4)].map((row) => row.map((s) => calc(s))) }] },
      { title: 'Bài 7: Điền số thích hợp vào ô trống', blocks: [{ t: 'grid', border: true, rows: [day(day10(r)), day(day10(r))] }] },
      b8,
    ],
  };
}

/** Mẫu Đề 19 / 21: trắc nghiệm, Đ/S, điền dấu + −, viết phép tính theo tranh. */
function mauC(n: number, r: R): RawPhieu {
  const hoa = khacNhau(r, 3, 1, 6).sort((a, b) => a - b);
  const bt = haiPhep(r);
  const v = kq(bt);
  const [x, y] = [bieuThuc(r, true), bieuThuc(r, true)];
  const so = int(r, 0, 9);
  const truoc = r() < 0.5;
  const dsItems = Array.from({ length: 8 }, () => {
    const e = bieuThuc(r);
    const val = kq(e);
    const op = pick(r, ['=', '<', '>']);
    const lech = int(r, -1, 1);
    return `${e} ${op} ${Math.max(0, Math.min(10, val + lech))}`;
  });
  const dauItems = Array.from({ length: 4 }, () => {
    const cong = r() < 0.5;
    const a = cong ? int(r, 1, 8) : int(r, 3, 10);
    const b = cong ? int(r, 1, 10 - a) : int(r, 1, a - 1);
    return `${a} ? ${b} = ${cong ? a + b : a - b}`;
  });
  const [i1, i2] = tron(r, MAU_DEM.filter((i) => i !== 'hoa')).slice(0, 2);
  return {
    ...meta(n, { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' }),
    description: 'Đếm hình, tính giá trị biểu thức, so sánh, đúng – sai, điền dấu + / − và viết phép tính theo tranh.',
    bai: [
      { title: 'Bài 1: Đếm và điền số tương ứng vào ô trống', blocks: [{ t: 'pics', framed: true, items: hoa.map((k) => ({ nhom: { icon: 'hoa', n: k }, cell: o(k) })) }] },
      { title: `Bài 2: Kết quả của phép tính ${bt} = ........ là:`, blocks: [{ t: 'mc', ...mcSo(r, v, Math.max(0, v - 4), Math.min(10, v + 4)) }] },
      { title: `Bài 3: Điền dấu thích hợp vào chỗ trống: ${x} .............. ${y}`, blocks: [{ t: 'mc', opts: ['>', '<', '='], ans: dauSoSanh(kq(x), kq(y)), cols: 3 }] },
      truoc && so > 0
        ? { title: `Bài 4: Số liền trước số ${so} là số nào?`, blocks: [{ t: 'mc', ...mcSo(r, so - 1, Math.max(0, so - 3), Math.min(10, so + 2)) }] }
        : { title: `Bài 4: Số liền sau số ${so} là số nào?`, blocks: [{ t: 'mc', ...mcSo(r, so + 1, Math.max(0, so - 2), Math.min(10, so + 3)) }] },
      { title: 'Bài 6: Đúng ghi Đ, sai ghi S', blocks: [{ t: 'lines', cols: 4, items: dsItems.map(ds) }] },
      { title: 'Bài 7: Điền dấu + , - thích hợp vào ô trống', blocks: [{ t: 'lines', cols: 2, boxed: true, items: dauItems.map(dau) }] },
      { title: 'Bài 8: Quan sát hình dưới đây và viết phép tính phù hợp với hình:', blocks: [{ t: 'eq', items: [eqTranh(r, i1), eqTranh(r, i2)] }] },
    ],
  };
}

/** Mẫu Đề 10: số chẵn – lẻ, so sánh biểu thức, chuỗi phép tính, cộng theo cột, lời văn, Đ/S. */
function mauD(n: number, r: R): RawPhieu {
  let nums = khacNhau(r, 6, 0, 10).sort((a, b) => a - b);
  // Cần có cả số lẻ lẫn số chẵn để hai dòng sau có đáp án
  while (!nums.some((x) => x % 2) || nums.every((x) => x % 2)) nums = khacNhau(r, 6, 0, 10).sort((a, b) => a - b);
  const [lo, hi] = [nums[1], nums[5]];
  const giua = nums.filter((x) => x > lo && x < hi);
  const le = nums.filter((x) => x % 2 === 1);
  const chan = nums.filter((x) => x % 2 === 0);
  const tapHop = (xs: number[]) => (xs.length ? xs.map(() => dot(xs.join('|'))).join(', ') : dot('0'));
  const ineq8 = Array.from({ length: 8 }, (_, i) => {
    for (;;) {
      const e = bieuThuc(r);
      if (i >= 4 && kq(e) >= 10) continue; // "10 < ?" không có đáp án trong phạm vi 10
      const s = `${e} ${i < 4 ? '>' : '<'} ?`;
      try {
        ineq(s);
        return s;
      } catch {
        /* vô nghiệm → thử lại */
      }
    }
  });
  // Chuỗi 4 bước luôn trong 0…10
  const bat = int(r, 2, 9);
  let cur = bat;
  const buoc: string[] = [];
  for (let i = 0; i < 4; i++) {
    const tru = cur >= 10 || (cur > 0 && r() < 0.5);
    const s2 = tru ? -int(r, 1, cur) : int(r, 1, 10 - cur);
    cur += s2;
    buoc.push(`${s2 > 0 ? '+' : ''}${s2} _`);
  }
  const cot = Array.from({ length: 6 }, () => {
    const a = int(r, 1, 8);
    const e = `${a} + ${int(r, 1, 10 - a)}`;
    return `${e} = ${kq(e)}`;
  });
  return {
    ...meta(n),
    description: 'Số chẵn – số lẻ, chuỗi phép tính, so sánh biểu thức, phép cộng theo cột và bài toán có lời văn.',
    bai: [
      {
        title: `Bài 1: (3 điểm) Cho các số sau: ${tron(r, nums).join(', ')}`,
        diem: 3,
        blocks: [
          {
            t: 'lines',
            bullet: true,
            items: [`Các số lớn hơn ${lo} nhưng nhỏ hơn ${hi} là: ${tapHop(giua)}`, `Các số lẻ trong dãy số đã cho là: ${tapHop(le)}`, `Các số chẵn trong dãy số đã cho là: ${tapHop(chan)}`],
          },
        ],
      },
      { title: 'Bài 2: (1 điểm) Điền số thích hợp:', diem: 1, blocks: [{ t: 'lines', cols: 4, items: ineq8.map((s) => ineq(s)) }] },
      { title: 'Bài 3: (2 điểm) Điền số vào ô trống:', diem: 2, blocks: [{ t: 'arrows', rows: [chuoi(`${bat} ${buoc.join(' ')}`)] }] },
      { title: 'Bài 4: (2 điểm) Điền dấu >, <, =', diem: 2, blocks: [{ t: 'lines', cols: 3, items: [`${bieuThuc(r)} ? ${bieuThuc(r)}`, `${bieuThuc(r)} ? ${int(r, 0, 10)}`, `${bieuThuc(r, true)} ? ${bieuThuc(r, true)}`].map((s) => cmp(s)) }] },
      { title: 'Bài 5: (2 điểm) Tính và điền vào chỗ chấm', diem: 2, blocks: [{ t: 'cols', items: cot }] },
      { title: 'Bài 6: (1 điểm)', diem: 1, blocks: loiVan(r) },
      { title: 'Bài 7: (2 điểm) Đúng điền Đ, sai điền S', diem: 2, blocks: [{ t: 'lines', bullet: true, cols: 2, items: Array.from({ length: 4 }, () => `${bieuThuc(r)} ${pick(r, ['=', '<', '>'])} ${int(r, 0, 10)}`).map(ds) }] },
    ],
  };
}

/** Số đề còn thiếu trong bộ giấy (đã có: 1, 4, 10, 13, 19, 21, 23, 28). */
export const SO_DE_THEM = Array.from({ length: 30 }, (_, i) => i + 1).filter((n) => ![1, 4, 10, 13, 19, 21, 23, 28].includes(n));

const MAU = [mauA, mauB, mauC, mauD];

export const DE_TOAN_THEM: RawPhieu[] = SO_DE_THEM.map((n, i) => MAU[i % MAU.length](n, rngOf(n * 7919 + 17)));
