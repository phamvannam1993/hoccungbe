// Trợ giúp soạn đề /thi-lop-1: viết phép tính như trên giấy, "?" là chỗ bé điền — đáp án tự tính.
// Ô trống trong mẫu chữ: [[k:đáp án]] — k thường = chấm chấm "……", k HOA = ô vuông.
//   n/N số · c/C dấu > < = · s/S dấu + − · d/D Đ/S · t/T chọn chữ (đáp án/lựa chọn: "gh/g,gh")
// Nhiều đáp án đúng: ngăn bằng "|" (vd. "8 > ?" → [[n:0|1|…|7]]).

const tach = (s: string) => s.replace(/−/g, '-').trim().split(/\s+/);
const dep = (s: string) => s.replace(/(\d)\s*-\s*(?=\d|\?)/g, '$1 − ').replace(/ - /g, ' − ');

/** "3 + 5 - 2" → 6; mọi bước trung gian phải không âm (Toán lớp 1). */
export function tinh(tokens: string[]): number {
  let v = Number(tokens[0]);
  if (Number.isNaN(v)) throw new Error(`Biểu thức lỗi: ${tokens.join(' ')}`);
  for (let i = 1; i < tokens.length; i += 2) {
    const n = Number(tokens[i + 1]);
    if (tokens[i] === '+') v += n;
    else if (tokens[i] === '-') v -= n;
    else throw new Error(`Phép lạ "${tokens[i]}" trong ${tokens.join(' ')}`);
    if (Number.isNaN(n) || v < 0) throw new Error(`Biểu thức không hợp lệ cho lớp 1: ${tokens.join(' ')}`);
  }
  return v;
}
export const kq = (expr: string) => tinh(tach(expr));

const CMP = ['=', '<', '>'];
const dung = (a: number, op: string, b: number) => (op === '=' ? a === b : op === '<' ? a < b : a > b);

/** Tất cả x trong [0, max] làm "a ? b" đúng (một "?" duy nhất). */
function nghiem(item: string, max: number): number[] {
  const tokens = tach(item);
  const i = tokens.findIndex((t) => CMP.includes(t));
  if (i < 0 || tokens.filter((t) => t === '?').length !== 1) throw new Error(`Cần đúng 1 "?" và một dấu so sánh: ${item}`);
  const out: number[] = [];
  for (let x = 0; x <= max; x++) {
    const thay = (ts: string[]) => ts.map((t) => (t === '?' ? String(x) : t));
    try {
      if (dung(tinh(thay(tokens.slice(0, i))), tokens[i], tinh(thay(tokens.slice(i + 1))))) out.push(x);
    } catch {
      /* bước âm → bỏ */
    }
  }
  return out;
}

/** "3 + ? = 9" → "3 + [[n:6]] = 9" (đúng một nghiệm). `o` = ô vuông thay chấm chấm. */
export function calc(item: string, o = false): string {
  const xs = nghiem(item, 20);
  if (xs.length !== 1) throw new Error(`"${item}" có ${xs.length} nghiệm`);
  return dep(item).replace('?', `[[${o ? 'N' : 'n'}:${xs[0]}]]`);
}

/** "8 > ?" — nhiều đáp án: nhận mọi số 0…10 (không có thì tới 20) thoả. */
export function ineq(item: string, o = true): string {
  let xs = nghiem(item, 10);
  if (!xs.length) xs = nghiem(item, 20);
  if (!xs.length) throw new Error(`"${item}" vô nghiệm`);
  return dep(item).replace('?', `[[${o ? 'N' : 'n'}:${xs.join('|')}]]`);
}

/** "8 - 4 ? 9 - 5" → điền dấu >, <, =. */
export function cmp(item: string, o = true): string {
  const [l, r] = item.split('?');
  const a = kq(l);
  const b = kq(r);
  return `${dep(l.trim())} [[${o ? 'C' : 'c'}:${a === b ? '=' : a < b ? '<' : '>'}]] ${dep(r.trim())}`;
}

/** "8 ? 1 ? 2 = 9" → điền + / − (phải đúng một cách). */
export function dau(item: string): string {
  const tokens = tach(item);
  const cho = tokens.map((t, i) => (t === '?' ? i : -1)).filter((i) => i >= 0);
  const iBang = tokens.indexOf('=');
  const ketQua = Number(tokens[iBang + 1]);
  let tohop: string[][] = [[]];
  for (let n = 0; n < cho.length; n++) tohop = tohop.flatMap((t) => [[...t, '+'], [...t, '-']]);
  const ok = tohop.filter((signs) => {
    const ts = tokens.slice(0, iBang);
    cho.forEach((i, j) => (ts[i] = signs[j]));
    try {
      return tinh(ts) === ketQua;
    } catch {
      return false;
    }
  });
  if (ok.length !== 1) throw new Error(`"${item}" có ${ok.length} cách điền dấu`);
  let j = 0;
  return tokens.map((t) => (t === '?' ? `[[S:${ok[0][j++]}]]` : t === '-' ? '−' : t)).join(' ');
}

/** Đúng ghi Đ, sai ghi S: "4 + 6 > 10". */
export function ds(item: string): string {
  const tokens = tach(item);
  const i = tokens.findIndex((t) => CMP.includes(t));
  const d = dung(tinh(tokens.slice(0, i)), tokens[i], tinh(tokens.slice(i + 1)));
  return `${dep(item)} [[D:${d ? 'Đ' : 'S'}]]`;
}

/** Ô số (vuông) có đáp án cho sẵn — dùng trong dãy, tháp, tách – gộp. */
export const o = (n: number | string) => `[[N:${n}]]`;
/** Ô chấm chấm có đáp án cho sẵn. */
export const dot = (n: number | string) => `[[n:${n}]]`;

/** Dãy số cách đều "0 _ _ 3 _" → mảng ô: số đã cho giữ nguyên, "_" thành ô có đáp án. */
export function day(row: string): string[] {
  const cells = row.trim().split(/\s+/);
  const biet = cells.map((c, i) => [i, Number(c)] as const).filter(([, v]) => !Number.isNaN(v));
  const [[i1, v1], [i2, v2]] = biet;
  const buoc = (v2 - v1) / (i2 - i1);
  return cells.map((c, i) => {
    const v = v1 + buoc * (i - i1);
    if (c !== '_' && Number(c) !== v) throw new Error(`Dãy không cách đều: ${row}`);
    return c === '_' ? o(v) : c;
  });
}

/** Chuỗi "9 -3 _ +4 _" → { cells, labels } — tự lan đáp án xuôi/ngược. */
export function chuoi(row: string): { cells: string[]; labels: string[] } {
  const ts = row.trim().split(/\s+/);
  const vals: (number | null)[] = [];
  const steps: number[] = [];
  ts.forEach((t, i) => (i % 2 === 0 ? vals.push(t === '_' ? null : Number(t)) : steps.push(Number(t))));
  for (let lap = 0; lap < vals.length; lap++)
    for (let i = 0; i < steps.length; i++) {
      if (vals[i] !== null && vals[i + 1] === null) vals[i + 1] = vals[i]! + steps[i];
      if (vals[i] === null && vals[i + 1] !== null) vals[i] = vals[i + 1]! - steps[i];
    }
  if (vals.some((v) => v === null || v < 0)) throw new Error(`Chuỗi không giải được: ${row}`);
  return {
    cells: vals.map((v, i) => (ts[i * 2] === '_' ? o(v!) : String(v))),
    labels: steps.map((s) => (s < 0 ? `−${-s}` : `+${s}`)),
  };
}

/** Tách – gộp: top/kids là số hoặc null (ô cần điền); đúng một ô null. */
export function tachGop(top: number | null, ...kids: (number | null)[]) {
  const tong = kids.reduce<number>((s, k) => s + (k ?? 0), 0);
  if (top === null) return { top: o(tong), kids: kids.map(String) };
  const thieu = top - tong;
  if (thieu < 0 || kids.filter((k) => k === null).length !== 1) throw new Error(`Tách gộp lỗi: ${top} / ${kids}`);
  return { top: String(top), kids: kids.map((k) => (k === null ? o(thieu) : String(k))) };
}

/** Tháp số: ô = tổng hai ô ngay dưới; null là ô cần điền. Lan tới khi đủ. */
export function thap(rows: (number | null)[][]): string[][] {
  const v = rows.map((r) => [...r]);
  for (let lap = 0; lap < 20; lap++)
    for (let r = 0; r + 1 < v.length; r++)
      for (let i = 0; i < v[r].length; i++) {
        const [a, b, c] = [v[r][i], v[r + 1][i], v[r + 1][i + 1]];
        if (a === null && b !== null && c !== null) v[r][i] = b + c;
        if (a !== null && b === null && c !== null) v[r + 1][i] = a - c;
        if (a !== null && b !== null && c === null) v[r + 1][i + 1] = a - b;
      }
  return v.map((r, ri) =>
    r.map((x, i) => {
      if (x === null || x < 0) throw new Error('Tháp số không giải được');
      return rows[ri][i] === null ? o(x) : String(x);
    }),
  );
}

/** Họ phép tính của hai nhóm a, b: a + b = c, b + a = c, c − a = b, c − b = a. */
export const hoPhepTinh = (a: number, b: number) => {
  const c = a + b;
  return [`${a}+${b}=${c}`, `${b}+${a}=${c}`, `${c}-${a}=${b}`, `${c}-${b}=${a}`];
};
