// Kiểu dữ liệu tờ đề /thi-lop-1 và bước biên dịch: mẫu chữ có [[k:đáp án]] → đoạn chữ + ô trống có id,
// gom mọi ô vào `blanks` (id → loại, đáp án, bài) để PhieuThi chấm điểm. Module thường (không 'use client').

export type Kind = 'n' | 'c' | 's' | 'd' | 't' | 'w' | 'g' | 'mc' | 'eq' | 'match';
export type Blank = { id: string; kind: Kind; box: boolean; ans: string[]; opts?: string[]; bai: number; any?: boolean };
export type Seg = string | { b: string };
export type Tpl = Seg[];
export type Item = { text?: string; img?: string };
/** Tranh ghép: `n` hình đơn `icon` (public/thi-lop-1/i-{icon}.webp), `gach` hình cuối bị gạch chéo. */
export type Nhom = { icon: string; n: number; gach?: number };

/* Khối soạn (chữ thô) */
export type RawBlock =
  | { t: 'text'; text: string; italic?: boolean; center?: boolean }
  | { t: 'lines'; items: string[]; bullet?: boolean; cols?: number; boxed?: boolean }
  | { t: 'grid'; rows: string[][]; border?: boolean }
  | { t: 'mc'; q?: string; opts: string[]; ans: number | string; cols?: number }
  | { t: 'pics'; items: { img?: string; nhom?: Nhom; cell: string }[]; framed?: boolean }
  | { t: 'arrows'; rows: { cells: string[]; labels?: string[]; shapes?: string[] }[]; shape?: 'box' | 'star' | 'pot' }
  | { t: 'trees'; items: { top: string; kids: string[] }[]; shape: 'circle' | 'square'; fill?: boolean; topShape?: 'circle' | 'square' }
  | { t: 'cols'; items: string[] }
  | { t: 'eq'; items: { img?: string; imgs?: string[]; nhom?: Nhom[]; ans: string[] | 'any' }[] }
  | { t: 'match'; top: Item[]; bottom: Item[]; pairs: (number | number[])[]; layout?: 'rows' | 'cols'; topShape?: string; bottomShape?: string }
  | { t: 'pyramid'; rows: string[][] }
  | { t: 'cards'; items: { img: string; word: string }[]; cols: number; numbered?: boolean }
  | { t: 'row'; cols: RawBlock[][]; widths?: string[] }
  /** Gạch chân: bấm các từ trong `cau`; đúng khi chọn đủ và chỉ các từ thuộc các cụm trong `dung`. */
  | { t: 'gach'; cau: string; dung: string[] }
  | { t: 'img'; src: string; w?: number }
  /** Phần viết tự do (tập chép, viết câu): ô li để viết tay, không chấm trên máy. `mau`: chữ mẫu. */
  | { t: 'viet'; dong: number; mau?: string; cursive?: boolean }
  | { t: 'nhom'; nhom: Nhom[] };

export type RawBai = { title: string; diem?: number; blocks: RawBlock[] };
export type Kieu = 'giua-ki' | 'on-tap' | 'ct-gh' | 'ct' | 'tv-phieu' | 'tv-hk1';
export type RawPhieu = {
  slug: string;
  title: string; // tiêu đề SEO / danh sách
  description: string;
  mon: 'toan' | 'tieng-viet';
  kieu: Kieu;
  /** Dòng đầu tờ đề, vd. ['KIỂM TRA GIỮA KÌ 1', 'MÔN: TOÁN - Đề 13'] */
  head: string[];
  /** Tên phần trước bài thứ i (vd. { 0: 'I. Trắc nghiệm', 4: 'II. Tự luận' }) */
  phan?: Record<number, string>;
  bai: RawBai[];
  thoiGian?: number;
};

/* Khối đã biên dịch */
export type Block =
  | { t: 'text'; text: Tpl; italic?: boolean; center?: boolean }
  | { t: 'lines'; items: Tpl[]; bullet?: boolean; cols?: number; boxed?: boolean }
  | { t: 'grid'; rows: Tpl[][]; border?: boolean }
  | { t: 'mc'; q?: Tpl; opts: string[]; b: string; cols?: number }
  | { t: 'pics'; items: { img?: string; nhom?: Nhom; cell: Tpl }[]; framed?: boolean }
  | { t: 'arrows'; rows: { cells: Tpl[]; labels?: Tpl[]; shapes?: string[] }[]; shape?: 'box' | 'star' | 'pot' }
  | { t: 'trees'; items: { top: Tpl; kids: Tpl[] }[]; shape: 'circle' | 'square'; fill?: boolean; topShape?: 'circle' | 'square' }
  | { t: 'cols'; items: { a: string; b: string; op: string; r: Tpl }[] }
  | { t: 'eq'; items: { img?: string; imgs?: string[]; nhom?: Nhom[]; b: string }[] }
  | { t: 'match'; top: Item[]; bottom: Item[]; b: string[]; layout: 'rows' | 'cols'; topShape?: string; bottomShape?: string }
  | { t: 'pyramid'; rows: Tpl[][] }
  | { t: 'cards'; items: { img: string; word: Tpl }[]; cols: number; numbered?: boolean }
  | { t: 'row'; cols: Block[][]; widths?: string[] }
  | { t: 'gach'; tu: string[]; b: string }
  | { t: 'img'; src: string; w?: number }
  /** Phần viết tự do (tập chép, viết câu): ô li để viết tay, không chấm trên máy. `mau`: chữ mẫu. */
  | { t: 'viet'; dong: number; mau?: string; cursive?: boolean }
  | { t: 'nhom'; nhom: Nhom[] };

export type Bai = { title: string; diem: number; blocks: Block[] };
export type Phieu = Omit<RawPhieu, 'bai'> & { bai: Bai[]; blanks: Record<string, Blank>; soO: number };

const OPTS: Record<string, string[]> = { c: ['>', '<', '='], s: ['+', '−'], d: ['Đ', 'S'] };

export function compile(raw: RawPhieu): Phieu {
  const blanks: Record<string, Blank> = {};
  let n = 0;
  let bai = 0;
  const add = (b: Omit<Blank, 'id' | 'bai'>) => {
    const id = `o${++n}`;
    blanks[id] = { ...b, id, bai };
    return id;
  };

  const tpl = (s: string): Tpl => {
    const out: Tpl = [];
    let last = 0;
    for (const m of s.matchAll(/\[\[(\w):([^\]]*)\]\]/g)) {
      if (m.index! > last) out.push(s.slice(last, m.index));
      const k = m[1].toLowerCase() as Kind;
      const box = m[1] !== m[1].toLowerCase();
      let ans = m[2].split('|');
      let opts = OPTS[k];
      if (k === 't') {
        const [a, o] = m[2].split('/');
        ans = [a];
        // Lựa chọn có chứa dấu phẩy (vd. dấu câu) → ngăn bằng "|"
        opts = o.includes('|') ? o.split('|') : o.split(',');
      }
      if (k === 's') ans = ans.map((a) => (a === '-' ? '−' : a));
      out.push({ b: add({ kind: k, box, ans, opts }) });
      last = m.index! + m[0].length;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  };

  const block = (r: RawBlock): Block => {
    switch (r.t) {
      case 'text':
        return { ...r, text: tpl(r.text) };
      case 'lines':
        return { ...r, items: r.items.map(tpl) };
      case 'grid':
        return { ...r, rows: r.rows.map((row) => row.map(tpl)) };
      case 'mc': {
        const idx = typeof r.ans === 'number' ? r.ans : r.opts.indexOf(r.ans);
        if (idx < 0) throw new Error(`Đáp án không có trong lựa chọn: ${r.q}`);
        return { t: 'mc', q: r.q ? tpl(r.q) : undefined, opts: r.opts, cols: r.cols, b: add({ kind: 'mc', box: false, ans: [String(idx)] }) };
      }
      case 'pics':
        return { ...r, items: r.items.map((i) => ({ img: i.img, nhom: i.nhom, cell: tpl(i.cell) })) };
      case 'arrows':
        return { ...r, rows: r.rows.map((row) => ({ shapes: row.shapes, labels: row.labels?.map(tpl), cells: row.cells.map(tpl) })) };
      case 'trees':
        return { ...r, items: r.items.map((i) => ({ top: tpl(i.top), kids: i.kids.map(tpl) })) };
      case 'cols':
        return {
          t: 'cols',
          items: r.items.map((s) => {
            const [a, op, b, , res] = s.split(/\s+/);
            return { a, op: op === '-' ? '−' : op, b, r: tpl(`[[n:${res}]]`) };
          }),
        };
      case 'eq':
        return {
          t: 'eq',
          items: r.items.map((i) => ({
            img: i.img,
            imgs: i.imgs,
            nhom: i.nhom,
            b: add({ kind: 'eq', box: true, ans: i.ans === 'any' ? [] : i.ans, any: i.ans === 'any' }),
          })),
        };
      case 'match':
        return {
          t: 'match',
          top: r.top,
          bottom: r.bottom,
          layout: r.layout ?? 'rows',
          topShape: r.topShape,
          bottomShape: r.bottomShape,
          b: r.pairs.map((p) => add({ kind: 'match', box: false, ans: [p].flat().map(String) })),
        };
      case 'pyramid':
        return { t: 'pyramid', rows: r.rows.map((row) => row.map(tpl)) };
      case 'cards':
        return { ...r, items: r.items.map((i) => ({ img: i.img, word: tpl(i.word) })) };
      case 'row':
        return { t: 'row', widths: r.widths, cols: r.cols.map((c) => c.map(block)) };
      case 'gach': {
        const tu = r.cau.split(/\s+/).filter(Boolean);
        const sach = (x: string) => x.replace(/[.,!?:;“”"()]/g, '').toLowerCase();
        const chon = new Set<number>();
        for (const cum of r.dung) {
          const c = cum.toLowerCase().split(/\s+/);
          let hit = false;
          for (let i = 0; i + c.length <= tu.length; i++) {
            if (c.every((w, k) => sach(tu[i + k]) === w)) {
              c.forEach((_, k) => chon.add(i + k));
              hit = true;
              break;
            }
          }
          if (!hit) throw new Error(`Không thấy "${cum}" trong: ${r.cau}`);
        }
        return { t: 'gach', tu, b: add({ kind: 'g', box: false, ans: [[...chon].sort((a, b) => a - b).join(',')] }) };
      }
      case 'img':
      case 'nhom':
      case 'viet':
        return r;
    }
  };

  // Bài không ghi điểm → chia đều phần còn lại của thang 10
  const daCo = raw.bai.reduce((s, b) => s + (b.diem ?? 0), 0);
  const chuaCo = raw.bai.filter((b) => b.diem === undefined).length;
  const moi = chuaCo ? Math.max(0, 10 - daCo) / chuaCo : 0;

  // Vài đề giấy ghi điểm từng bài cộng lại quá 10 (vd. Đề 1: 13) → giữ chữ trên đề, chấm quy về thang 10
  const heSo = daCo > 10 ? 10 / daCo : 1;
  const bais: Bai[] = raw.bai.map((b, i) => {
    bai = i;
    return { title: b.title, diem: (b.diem ?? moi) * heSo, blocks: b.blocks.map(block) };
  });
  return { ...raw, bai: bais, blanks, soO: n };
}

/** Chuẩn hoá câu trả lời số/chữ để so. */
export const chuan = (s: string) => s.normalize('NFC').trim().replace(/−/g, '-').replace(/\s+/g, ' ').replace(/[.!?,]+$/, '').toLowerCase();

/** Số bé gõ: "17/6", "2 5/6" (hỗn số), "12", "3,50" → [tử, mẫu] nguyên (thập phân → mẫu 10ⁿ); không hiểu → null. */
function docSo(s: string): [number, number] | null {
  const t = s.trim().replace(/\s+/g, ' ');
  let m = /^(\d+) (\d+)\/(\d+)$/.exec(t);
  if (m) return +m[3] ? [+m[1] * +m[3] + +m[2], +m[3]] : null;
  m = /^(\d+)\/(\d+)$/.exec(t);
  if (m) return +m[2] ? [+m[1], +m[2]] : null;
  m = /^(\d+)(?:,(\d+))?$/.exec(t);
  if (m) return [Number(m[1] + (m[2] ?? '')), 10 ** (m[2]?.length ?? 0)];
  return null;
}
const luyThua10 = (n: number) => /^10*$/.test(String(n)) && n >= 10;

/**
 * Ô số so theo giá trị (lớp 5):
 * - đáp án phân số → nhận phân số chưa rút gọn, hỗn số "2 5/6", số thập phân bằng nhau;
 *   riêng đáp án là phân số thập phân (mẫu 10, 100…) thì bé cũng phải viết phân số có mẫu 10ⁿ;
 * - đáp án số thập phân → nhận "87,640" = "87,64" nhưng không nhận phân số ("viết dưới dạng số thập phân").
 */
function bangGiaTri(a: string, v: string): boolean {
  const x = docSo(a);
  const y = docSo(v);
  if (!x || !y || x[0] * y[1] !== y[0] * x[1]) return false;
  const vPhanSo = v.includes('/');
  if (a.includes('/')) return !luyThua10(x[1]) || (vPhanSo && luyThua10(y[1]));
  if (a.includes(',')) return !vPhanSo && v.includes(',');
  return false;
}

/** Ô `b` với câu trả lời `v` có đúng không. */
export function dungO(b: Blank, v: string | undefined): boolean {
  if (v === undefined || v === '') return false;
  if (b.kind === 'eq') {
    const [a, op, x, r] = JSON.parse(v) as string[];
    if (![a, x, r].every((t) => /^\d+$/.test(t.trim())) || !op) return false;
    const val = op === '+' ? Number(a) + Number(x) : Number(a) - Number(x);
    if (val !== Number(r) || val < 0) return false;
    if (b.any) return true;
    return b.ans.includes(`${Number(a)}${op === '+' ? '+' : '-'}${Number(x)}=${Number(r)}`);
  }
  // Ô bấm chọn (dấu, Đ/S, âm/vần): so khớp nguyên văn — chuan() bỏ dấu câu cuối nên "," và "." sẽ bị coi là như nhau
  if (b.kind === 't' || b.kind === 'c' || b.kind === 'd' || b.kind === 's') return b.ans.includes(v);
  // Ô chữ tự do: "~x" = câu trả lời chứa x (vd. "tưới cây", "đang tưới hoa")
  if (b.kind === 'w') return b.ans.some((a) => (a.startsWith('~') ? chuan(v).includes(chuan(a.slice(1))) : chuan(a) === chuan(v)));
  // Ô số: lớp 5 có số thập phân "3,5"; đáp án số nguyên thì dấu phẩy/chấm bé gõ là phân cách hàng nghìn → bỏ
  if (b.kind === 'n') return b.ans.some((a) => chuan(a) === chuan(a.includes(',') ? v : v.replace(/,/g, '')) || bangGiaTri(a, v));
  return b.ans.some((a) => chuan(a) === chuan(v));
}
