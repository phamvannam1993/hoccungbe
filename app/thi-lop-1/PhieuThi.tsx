'use client';
/* eslint-disable @next/next/no-img-element */

// Tờ đề /thi-lop-1 vẽ lại đúng như bản giấy (TOÁN - TV 1_1.pdf): đầu đề, ô Điểm, "I. Trắc nghiệm",
// bảng tính, hàng ô, sơ đồ tách – gộp, nối bằng đường kẻ, ô viết phép tính dưới tranh…
// Bé điền thẳng vào tờ đề; Nộp bài → tô xanh/đỏ từng ô, hiện đáp án đúng và điểm trong ô "Điểm".

import { createContext, useCallback, useContext, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { dungO, type Bai, type Blank, type Block, type Item, type Nhom, type Phieu, type Tpl } from './kieu';

const IMG = (n: string) => `/thi-lop-1/${n}.webp`;

type Ctx = {
  blanks: Record<string, Blank>;
  ans: Record<string, string>;
  set: (id: string, v: string) => void;
  nop: boolean;
  kieu: Phieu['kieu'];
  /** 'lam' làm bài · 'in' bản in trống · 'dap-an' bản in có sẵn đáp án */
  mode: Mode;
};
export type Mode = 'lam' | 'in' | 'dap-an';
const C = createContext<Ctx | null>(null);
const useC = () => useContext(C)!;

const XANH = '#16a34a';
const DO = '#dc2626';

/* ─────────── Ô trống ─────────── */

function O({ id, bare, style }: { id: string; bare?: boolean; style?: CSSProperties }) {
  const { blanks, ans, set, nop, mode } = useC();
  const b = blanks[id];
  const v = ans[id] ?? '';
  const ok = nop ? dungO(b, v) : null;
  const mau = ok === null ? undefined : ok ? XANH : DO;
  const sai = nop && !ok && mode === 'lam' ? <sup className="ml-0.5 text-[0.65em] font-bold" style={{ color: DO }}>{b.ans[0]}</sup> : null;

  const khung: CSSProperties = bare
    ? { width: '100%', height: '100%', border: 'none', background: 'transparent' }
    : b.box
      ? { width: b.kind === 'n' ? '2.1em' : '1.8em', height: '1.8em', border: `1.5px solid ${mau ?? '#222'}`, borderRadius: 4, background: '#fff' }
      : { minWidth: '2.6em', height: '1.15em', lineHeight: '1.15em', padding: 0, border: 'none', borderBottom: `2px dotted ${mau ?? '#555'}`, background: 'transparent' };

  if (b.kind === 'w') {
    return (
      <span className="inline-flex items-baseline">
        <input
          value={v}
          onChange={(e) => set(id, e.target.value.slice(0, 40))}
          disabled={nop}
          aria-label="Điền chữ"
          className="text-center font-semibold outline-none focus:bg-amber-50"
          style={{ ...khung, color: mau ?? '#1d4ed8', width: bare ? '100%' : `${Math.max(b.box ? 3 : 4.5, v.length * 0.62 + 1.4)}em`, ...style }}
        />
        {sai}
      </span>
    );
  }
  if (b.kind === 'n') {
    return (
      <span className={`inline-flex items-baseline ${b.box || bare ? 'align-middle' : ''}`} style={bare ? { width: '100%', height: '100%' } : undefined}>
        <input
          value={v}
          onChange={(e) => set(id, e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
          disabled={nop}
          inputMode="numeric"
          aria-label="Điền số"
          className="text-center font-bold outline-none focus:bg-amber-50"
          style={{ ...khung, color: mau ?? '#1d4ed8', width: bare ? '100%' : b.box ? '2.1em' : `${Math.max(2.6, v.length * 0.7 + 1.6)}em`, ...style }}
        />
        {sai}
      </span>
    );
  }
  // Dấu / Đ-S / chữ: bấm để đổi lần lượt
  const opts = b.opts ?? [];
  const next = () => {
    if (nop) return;
    const i = opts.indexOf(v);
    set(id, i + 1 >= opts.length ? opts[0] : opts[i + 1]);
  };
  return (
    <span className="inline-flex items-baseline align-middle">
      <button
        type="button"
        onClick={next}
        disabled={nop}
        title="Bấm để chọn"
        className="inline-flex items-center justify-center font-bold hover:bg-amber-50"
        style={{ ...khung, minWidth: b.kind === 't' ? '2.6em' : khung.width ?? '2.2em', width: bare ? '100%' : b.kind === 't' ? 'auto' : khung.width, padding: b.kind === 't' ? '0 0.3em' : 0, color: mau ?? '#1d4ed8', ...style }}>
        {v || <span className="text-[0.7em] font-normal text-slate-300">{b.kind === 't' ? '…' : '?'}</span>}
      </button>
      {sai}
    </span>
  );
}

function T({ tpl, bare }: { tpl: Tpl; bare?: boolean }) {
  return (
    <>
      {tpl.map((s, i) => (typeof s === 'string' ? <span key={i} className="whitespace-pre-wrap">{s}</span> : <O key={i} id={s.b} bare={bare && tpl.length === 1} />))}
    </>
  );
}

/** Ô chỉ có một chỗ trống (để vẽ khung ngoài) */
const chiMotO = (t: Tpl) => t.length === 1 && typeof t[0] !== 'string';

/* ─────────── Tranh ghép từ hình đơn ─────────── */

/** n hình xếp như trên giấy: ≤4 một hàng, nhiều hơn chia hai hàng (5 → 3 + 2, 8 → 4 + 4). */
function HinhDon({ g, size = '2.4em' }: { g: Nhom; size?: string }) {
  const perRow = g.n <= 4 ? g.n : Math.ceil(g.n / 2);
  return (
    // Mỗi hình tối đa `size`, ô hẹp thì tự co để không tràn khung
    <div className="grid w-full justify-center justify-items-center gap-1" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, ${size}))` }}>
      {Array.from({ length: g.n }, (_, i) => {
        const gach = g.gach && i >= g.n - g.gach;
        return (
          <span key={i} className="relative aspect-square w-full">
            <img src={IMG(`i-${gach && g.icon === 'tao' ? 'taox' : g.icon}`)} alt="" className="h-full w-full object-contain" />
            {gach && g.icon !== 'tao' ? (
              <svg viewBox="0 0 10 10" className="absolute inset-0 h-full w-full"><path d="M1 1L9 9M9 1L1 9" stroke="#222" strokeWidth="0.7" /></svg>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

/** Nhóm tranh cho bài viết phép tính: [nhóm 1] + [nhóm 2] trong khung như Đề 4, hoặc một hàng có hình gạch. */
function NhomTranh({ nhom }: { nhom: Nhom[] }) {
  if (nhom.length === 1)
    return (
      <div style={{ width: `${Math.min(nhom[0].n, 5) * 2.4}em`, maxWidth: '100%' }}>
        <HinhDon g={nhom[0]} size="2.2em" />
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      {nhom.map((g, i) => (
        <span key={i} className="flex items-center gap-2">
          {i ? <span className="font-bold">+</span> : null}
          <span className="rounded border-[1.5px] border-slate-500 p-1" style={{ width: `${Math.min(g.n, 4) * 2.1 + 0.6}em` }}>
            <HinhDon g={g} size="1.9em" />
          </span>
        </span>
      ))}
    </div>
  );
}

/* ─────────── Các khối ─────────── */

function Lines({ b }: { b: Extract<Block, { t: 'lines' }> }) {
  const cols = b.cols ?? 1;
  return (
    // Đúng số cột như tờ giấy; điện thoại tối đa 2 cột
    <div className="tl1-cot grid gap-x-4 gap-y-2 py-1" style={{ '--c': cols, '--cm': Math.min(cols, 2) } as CSSProperties}>
      {b.items.map((t, i) => (
        <div key={i} className={`leading-[2.1] ${b.bullet ? 'flex gap-2' : ''} ${b.boxed ? 'rounded-xl border-[1.5px] border-slate-700 px-4 py-1 text-center' : ''}`}>
          {b.bullet ? <span>•</span> : null}
          <span>
            <T tpl={t} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Grid({ b }: { b: Extract<Block, { t: 'grid' }> }) {
  return (
    <div className="overflow-x-auto p-px py-1 print:overflow-visible">
      <table className="w-full border-collapse">
        <tbody>
          {b.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="whitespace-nowrap px-2 text-center"
                  style={{ border: b.border ? '1.5px solid #222' : undefined, height: '2.3em', padding: chiMotO(cell) ? 0 : undefined, textAlign: 'center' }}>
                  <T tpl={cell} bare />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mc({ b }: { b: Extract<Block, { t: 'mc' }> }) {
  const { blanks, ans, set, nop } = useC();
  const chon = ans[b.b];
  const dungIdx = blanks[b.b].ans[0];
  return (
    <div className="py-1">
      {b.q ? (
        <div className="mb-1 font-semibold">
          <T tpl={b.q} />
        </div>
      ) : null}
      <div className="grid gap-y-1 pl-6" style={{ gridTemplateColumns: `repeat(${b.cols ?? Math.min(4, b.opts.length)}, minmax(0, 1fr))` }}>
        {b.opts.map((o, i) => {
          const sel = chon === String(i);
          const isDung = nop && String(i) === dungIdx;
          const mau = nop ? (isDung ? XANH : sel ? DO : undefined) : sel ? '#1d4ed8' : undefined;
          return (
            <button key={i} type="button" disabled={nop} onClick={() => set(b.b, String(i))} className="flex items-center gap-1 text-left">
              <span
                className="-ml-1 inline-flex h-[1.6em] w-[1.6em] items-center justify-center rounded-full"
                style={{ border: sel || isDung ? `2px solid ${mau}` : '2px solid transparent', color: mau }}>
                {'ABCDEFG'[i]}
              </span>
              {/* Lựa chọn chỉ là chữ cái (tranh A, B, C, D ở trên) → không lặp "A . A" */}
              {o && o !== 'ABCDEFG'[i] ? <span className="-ml-1" style={{ color: mau }}>.&nbsp;{o}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pics({ b }: { b: Extract<Block, { t: 'pics' }> }) {
  return (
    <div className="py-1">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${b.items.length}, minmax(0, 1fr))`, border: b.framed ? '1.5px solid #222' : undefined }}>
        {b.items.map((it, i) => (
          <div key={i} className="flex items-center justify-center p-1" style={{ borderLeft: b.framed && i ? '1.5px solid #222' : undefined }}>
            {it.img ? <img src={IMG(it.img)} alt="" className="max-h-32 w-full object-contain" /> : null}
            {it.nhom ? <HinhDon g={it.nhom} size="2.6em" /> : null}
          </div>
        ))}
      </div>
      <div className="grid pt-2" style={{ gridTemplateColumns: `repeat(${b.items.length}, minmax(0, 1fr))` }}>
        {b.items.map((it, i) => (
          <div key={i} className="flex justify-center">
            <span className="inline-flex h-[2.2em] w-[2.4em] items-center justify-center rounded-md" style={{ border: '1.5px solid #222' }}>
              <T tpl={it.cell} bare />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shape({ shape, children, fill }: { shape: string; children: ReactNode; fill?: string }) {
  const { kieu } = useC();
  const line = kieu === 'giua-ki' ? '#222' : '#e8710a';
  const base: CSSProperties = { width: '2.6em', height: '2.6em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: fill ?? '#fff', flex: 'none' };
  if (shape === 'circle') return <span style={{ ...base, borderRadius: '50%', border: `1.5px solid ${line}` }}>{children}</span>;
  if (shape === 'tri')
    return (
      <span style={{ ...base, position: 'relative', background: 'transparent' }}>
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full"><polygon points="20,2 38,38 2,38" fill="#fde8d8" stroke="#555" strokeWidth="1.5" /></svg>
        <span className="relative pt-2">{children}</span>
      </span>
    );
  if (shape === 'star')
    return (
      <span style={{ ...base, position: 'relative', background: 'transparent', width: '3em', height: '3em' }}>
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full"><polygon points="20,2 25,14 38,15 28,24 31,37 20,30 9,37 12,24 2,15 15,14" fill="#fde047" stroke="#ca8a04" strokeWidth="1.2" /></svg>
        <span className="relative pt-1 text-[0.9em]">{children}</span>
      </span>
    );
  if (shape === 'pot') return <span style={{ ...base, borderRadius: '0.6em 0.6em 0.9em 0.9em', border: '2px solid #d97706', background: '#fef3c7' }}>{children}</span>;
  return <span style={{ ...base, borderRadius: 6, border: `1.5px solid ${line}` }}>{children}</span>;
}

function Arrows({ b }: { b: Extract<Block, { t: 'arrows' }> }) {
  const half = b.rows.length > 1 && b.rows.every((r) => r.cells.length <= 5 && !r.labels);
  return (
    <div className={`grid gap-x-6 gap-y-3 py-1 text-[0.9em] ${half ? 'sm:grid-cols-2' : ''}`}>
      {b.rows.map((r, ri) => (
        <div key={ri} className="flex flex-wrap items-center gap-y-2 sm:flex-nowrap">
          {r.cells.map((c, i) => (
            <span key={i} className="flex items-center">
              {i ? (
                <span className="flex flex-col items-center px-1 text-[0.85em] font-bold" style={{ color: '#b91c1c' }}>
                  {r.labels?.[i - 1] ? <span className="leading-none"><T tpl={r.labels[i - 1]} /></span> : null}
                  <span className="leading-none text-slate-700">→</span>
                </span>
              ) : null}
              <Shape shape={r.shapes?.[i] ?? b.shape ?? 'box'} fill={r.shapes?.[i] === 'circle' ? '#eee' : undefined}>
                <T tpl={c} bare />
              </Shape>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Trees({ b }: { b: Extract<Block, { t: 'trees' }> }) {
  return (
    <div className="flex flex-wrap justify-around gap-x-4 gap-y-4 py-2">
      {b.items.map((it, i) => (
        <div key={i} className="flex flex-col items-center">
          <Shape shape={b.topShape === 'square' ? 'box' : 'circle'} fill={b.fill ? '#fbe3d6' : undefined}>
            <T tpl={it.top} bare />
          </Shape>
          {(() => {
            // Đơn vị 1/10 em: ô rộng 2.6em, khe giữa các ô 1.8em
            const n = it.kids.length;
            const w = n * 26 + (n - 1) * 18;
            return (
              <svg viewBox={`0 0 ${w} 14`} style={{ width: `${w / 10}em`, height: '1.4em' }} className="-my-0.5" preserveAspectRatio="none">
                {it.kids.map((_, k) => (
                  <line key={k} x1={w / 2} y1="0" x2={13 + k * 44} y2="14" stroke="#333" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
            );
          })()}
          <div className="flex" style={{ gap: '1.8em' }}>
            {it.kids.map((k, ki) => (
              <Shape key={ki} shape={b.shape === 'square' ? 'box' : 'circle'}>
                <T tpl={k} bare />
              </Shape>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Cols({ b }: { b: Extract<Block, { t: 'cols' }> }) {
  return (
    <div className="flex flex-wrap justify-around gap-6 py-2">
      {b.items.map((it, i) => (
        <div key={i} className="grid grid-cols-[1em_auto] text-right leading-tight">
          <span />
          <span>{it.a}</span>
          <span className="text-left">{it.op}</span>
          <span className="border-b-2 border-slate-700">{it.b}</span>
          <span />
          <span className="pt-1">
            <T tpl={it.r} />
          </span>
        </div>
      ))}
    </div>
  );
}

function EqBoxes({ id }: { id: string }) {
  const { blanks, ans, set, nop, mode } = useC();
  const b = blanks[id];
  const v: string[] = ans[id] ? JSON.parse(ans[id]) : ['', '', '', ''];
  const ok = nop ? dungO(b, ans[id]) : null;
  const mau = ok === null ? '#1d4ed8' : ok ? XANH : DO;
  const put = (i: number, x: string) => {
    const n = [...v];
    n[i] = x;
    set(id, JSON.stringify(n));
  };
  const box: CSSProperties = { width: '2.2em', height: '2.2em', border: `1.5px solid ${ok === null ? '#94a3b8' : mau}`, textAlign: 'center', fontWeight: 700, color: mau, background: '#fff' };
  const num = (i: number) => (
    <input value={v[i]} disabled={nop} inputMode="numeric" aria-label="Số" onChange={(e) => put(i, e.target.value.replace(/\D/g, '').slice(0, 2))} style={box} className="outline-none focus:bg-amber-50" />
  );
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {num(0)}
        <button type="button" disabled={nop} onClick={() => put(1, v[1] === '+' ? '-' : '+')} style={box} title="Bấm để chọn + hoặc −">
          {v[1] === '-' ? '−' : v[1] || <span className="text-xs font-normal text-slate-300">±</span>}
        </button>
        {num(2)}
        <span style={{ ...box, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>=</span>
        {num(3)}
      </div>
      {nop && !ok && mode === 'lam' ? (
        <span className="mt-1 text-xs font-bold" style={{ color: DO }}>
          {b.any ? 'Phép tính chưa đúng' : `VD: ${b.ans[0].replace('-', ' − ').replace('+', ' + ').replace('=', ' = ')}`}
        </span>
      ) : null}
    </div>
  );
}

function Eq({ b }: { b: Extract<Block, { t: 'eq' }> }) {
  return (
    <div className="grid gap-4 py-1" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${b.items.length > 2 ? 11 : 14}rem, 1fr))` }}>
      {b.items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg p-1">
          {it.img ? <img src={IMG(it.img)} alt="" className="max-h-36 w-full object-contain" /> : null}
          {it.nhom ? <NhomTranh nhom={it.nhom} /> : null}
          <EqBoxes id={it.b} />
        </div>
      ))}
    </div>
  );
}

function ItemView({ it, shape }: { it: Item; shape?: string }) {
  if (it.img) return <img src={IMG(it.img)} alt="" className="h-16 w-20 object-contain sm:h-20 sm:w-24" />;
  const st: Record<string, CSSProperties> = {
    box: { border: '1.5px solid #333', borderRadius: 8, padding: '0.25em 0.8em', background: '#fff' },
    worm: { border: '2px solid #65a30d', borderRadius: 999, padding: '0.2em 0.7em', background: '#ecfccb' },
    cloud: { border: '2px solid #64748b', borderRadius: '1.2em', padding: '0.35em 0.9em', background: '#fff' },
    circle: { border: '2px solid #333', borderRadius: '50%', width: '2.4em', height: '2.4em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff' },
    apple: { border: '2px solid #333', borderRadius: '50% 50% 45% 45%', width: '2.6em', height: '2.5em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff' },
    leaf: { borderRadius: '0 1.2em 0 1.2em', padding: '0.25em 0.8em', background: '#4d7c0f', color: '#fff' },
    fish: { borderRadius: '1em 40% 40% 1em', padding: '0.25em 0.9em', background: '#fde68a', border: '2px solid #d97706' },
    word: { border: '1.5px solid #333', borderRadius: 999, padding: '0.2em 1.1em', background: '#fff' },
  };
  return <span style={st[shape ?? 'box'] ?? st.box} className="whitespace-nowrap font-semibold">{it.text}</span>;
}

/**
 * Nối: bấm một ô bên trên/trái rồi bấm ô bên dưới/phải → kẻ đường; bấm lại ô đã nối để gỡ.
 * Ô xếp theo lưới chia đều nên tâm mỗi ô biết trước theo % → đường kẻ không cần đo DOM:
 * in ra (tờ co 180mm, zoom) hay chưa chạy JS vẫn nối đúng ô.
 */
function Match({ b }: { b: Extract<Block, { t: 'match' }> }) {
  const { ans, set, nop, blanks, mode } = useC();
  const [chon, setChon] = useState<number | null>(null);
  const cot = b.layout === 'cols';
  const nT = b.top.length;
  const nB = b.bottom.length;
  const tam = (i: number, n: number) => ((i + 0.5) / n) * 100;

  const lines = b.b.flatMap((id, i) => {
    const v = ans[id];
    if (v === undefined || v === '') return [];
    const c = nop ? (dungO(blanks[id], v) ? XANH : DO) : '#2563eb';
    return [{ a: tam(i, nT), z: tam(Number(v), nB), c }];
  });

  const bamTren = (i: number) => {
    if (nop) return;
    if (ans[b.b[i]] && chon !== i) {
      set(b.b[i], '');
      setChon(i);
      return;
    }
    setChon(chon === i ? null : i);
  };
  const bamDuoi = (j: number) => {
    if (nop || chon === null) return;
    set(b.b[chon], String(j));
    setChon(null);
  };

  const o = (it: Item, i: number, isTop: boolean, shape?: string) => (
    <button
      key={i}
      type="button"
      onClick={() => (isTop ? bamTren(i) : bamDuoi(i))}
      disabled={nop}
      className={`flex min-w-0 items-center justify-center rounded-xl p-0.5 transition ${isTop && chon === i ? 'ring-4 ring-amber-300' : ''} ${!isTop && chon !== null ? 'ring-2 ring-sky-200 hover:ring-sky-400' : ''}`}>
      <ItemView it={it} shape={shape} />
    </button>
  );

  const svg = (
    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {lines.map((l, i) =>
        cot ? (
          <line key={i} x1="0" y1={l.a} x2="100" y2={l.z} stroke={l.c} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        ) : (
          <line key={i} x1={l.a} y1="0" x2={l.z} y2="100" stroke={l.c} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        ),
      )}
    </svg>
  );

  return (
    <div className="py-1">
      {!nop && mode === 'lam' ? <p className="mb-2 text-xs italic text-slate-500">Bấm một ô rồi bấm ô cần nối với nó.</p> : null}
      {cot ? (
        // Hai cột cùng chiều cao, mỗi cột chia đều theo số ô
        <div className="mx-auto grid max-w-md grid-cols-[1fr_4rem_1fr] sm:grid-cols-[1fr_7rem_1fr]">
          <div className="grid" style={{ gridTemplateRows: `repeat(${nT}, minmax(4.5rem, 1fr))` }}>
            {b.top.map((it, i) => <div key={i} className="flex items-center justify-end">{o(it, i, true, b.topShape)}</div>)}
          </div>
          {svg}
          <div className="grid" style={{ gridTemplateRows: `repeat(${nB}, 1fr)` }}>
            {b.bottom.map((it, i) => <div key={i} className="flex items-center justify-start">{o(it, i, false, b.bottomShape)}</div>)}
          </div>
        </div>
      ) : (
        <div className="text-[0.92em]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${nT}, minmax(0, 1fr))` }}>
            {b.top.map((it, i) => <div key={i} className="flex justify-center">{o(it, i, true, b.topShape)}</div>)}
          </div>
          <div className="h-12 px-0">{svg}</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${nB}, minmax(0, 1fr))` }}>
            {b.bottom.map((it, i) => <div key={i} className="flex justify-center">{o(it, i, false, b.bottomShape)}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function Pyramid({ b }: { b: Extract<Block, { t: 'pyramid' }> }) {
  return (
    <div className="flex flex-col items-center py-1">
      {b.rows.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((c, ci) => (
            <span key={ci} className="inline-flex h-[2.2em] w-[2.6em] items-center justify-center font-bold" style={{ border: `2px solid ${ri ? '#65a30d' : '#dc2626'}`, margin: 1, borderRadius: 4, background: '#fff' }}>
              <T tpl={c} bare />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Cards({ b }: { b: Extract<Block, { t: 'cards' }> }) {
  return (
    <div className="grid gap-2 py-1 sm:gap-3" style={{ gridTemplateColumns: b.cols > 4 ? 'repeat(auto-fill, minmax(5.4rem, 1fr))' : `repeat(${b.cols}, minmax(0, 1fr))` }}>
      {b.items.map((it, i) => (
        <div key={i} className={`flex flex-col items-center ${b.numbered ? 'rounded-xl border border-slate-200 bg-white p-1 shadow-sm' : ''}`}>
          <img src={IMG(it.img)} alt="" className="aspect-square w-full object-contain" />
          <div className="whitespace-nowrap pt-1 text-center text-[0.95em] leading-snug">
            <T tpl={it.word} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'text':
      return (
        <p className={`py-0.5 leading-relaxed ${b.italic ? 'italic' : ''} ${b.center ? 'text-center font-bold' : ''}`}>
          <T tpl={b.text} />
        </p>
      );
    case 'lines':
      return <Lines b={b} />;
    case 'grid':
      return <Grid b={b} />;
    case 'mc':
      return <Mc b={b} />;
    case 'pics':
      return <Pics b={b} />;
    case 'arrows':
      return <Arrows b={b} />;
    case 'trees':
      return <Trees b={b} />;
    case 'cols':
      return <Cols b={b} />;
    case 'eq':
      return <Eq b={b} />;
    case 'match':
      return <Match b={b} />;
    case 'pyramid':
      return <Pyramid b={b} />;
    case 'cards':
      return <Cards b={b} />;
    case 'nhom':
      return (
        <div className="flex justify-center py-1">
          <NhomTranh nhom={b.nhom} />
        </div>
      );
    case 'viet':
      return (
        <div className="py-1">
          {b.mau ? (
            <p className="mb-2 whitespace-pre-line text-center text-[1.15em] leading-relaxed" style={{ fontFamily: b.cursive ? '"Brush Script MT", "Segoe Script", cursive' : 'inherit', fontStyle: b.cursive ? 'italic' : 'normal' }}>
              {b.mau}
            </p>
          ) : null}
          {/* Ô li vở lớp 1: kẻ đậm mỗi dòng, kẻ mờ chia 4 ô nhỏ */}
          <div
            className="rounded-sm border border-slate-300"
            style={{
              height: `${b.dong * 3.2}em`,
              backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
              backgroundSize: '100% 3.2em, 100% 0.8em, 0.8em 100%',
            }}
          />
          <p className="no-print mt-1 text-xs italic text-slate-500">Phần viết tay — bé viết ra giấy, phụ huynh / giáo viên chấm.</p>
        </div>
      );
    case 'img':
      return <img src={IMG(b.src)} alt="" className="mx-auto object-contain" style={{ maxWidth: b.w ? `${b.w}px` : '100%', width: '100%' }} />;
    case 'row':
      return (
        <div className="flex flex-col gap-3 sm:grid sm:items-center" style={{ gridTemplateColumns: b.widths?.join(' ') ?? `repeat(${b.cols.length}, minmax(0, 1fr))` }}>
          {b.cols.map((col, i) => (
            <div key={i} className="min-w-0">
              {col.map((x, j) => (
                <BlockView key={j} b={x} />
              ))}
            </div>
          ))}
        </div>
      );
  }
}

/* ─────────── Khung theo kiểu tờ đề ─────────── */

const fmt = (x: number) => (Math.round(x * 10) / 10).toLocaleString('vi-VN');

function DiemBox({ diem, max }: { diem: number | null; max: number }) {
  return (
    <div className="flex h-24 w-28 flex-none flex-col items-center rounded-md border-[1.5px] border-slate-800 bg-white pt-1 sm:h-28 sm:w-36">
      <span>Điểm</span>
      {diem !== null ? (
        <span className="mt-1 text-3xl font-bold sm:text-4xl" style={{ color: DO, fontFamily: '"Comic Sans MS", cursive' }}>
          {fmt(diem)}
          {max !== 10 ? <span className="text-base">/{fmt(max)}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

/** Không ngắt dòng giữa phép tính trong tiêu đề ("9 -" / "2"). */
const lien = (t: string) => t.replace(/(\d) ([+\-−=<>]) (?=\d|\.)/g, '$1\u00a0$2\u00a0');

function BaiView({ bai: b0, kieu }: { bai: Bai; kieu: Phieu['kieu'] }) {
  const bai = { ...b0, title: lien(b0.title) };
  if (kieu === 'on-tap')
    return (
      <section className="mb-3">
        <h3 className="mb-1 font-bold" style={{ color: '#d9480f', fontFamily: 'inherit', fontSize: 'inherit' }}>{bai.title}</h3>
        <div className="rounded-lg border-2 border-dashed px-3 py-2" style={{ borderColor: '#0e7490' }}>
          {bai.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </div>
      </section>
    );
  if (kieu === 'ct' || kieu === 'ct-gh')
    return (
      <section className="mb-4">
        <h3 className="mb-2 font-bold" style={{ fontFamily: 'inherit', fontSize: 'inherit' }} dangerouslySetInnerHTML={{ __html: `✏️ ${tieuDeCT(bai.title)}` }} />
        {bai.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </section>
    );
  return (
    <section className="mb-3">
      <h3 className="font-bold" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{bai.title}</h3>
      <div className="pl-1">
        {bai.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </div>
    </section>
  );
}

/** Tô đỏ các âm/vần cần phân biệt trong tiêu đề ("Điền x hay s"). */
const tieuDeCT = (s: string) => s.replace(/Điền (\S+) (hay|hoặc) (\S+)/, 'Điền <span style="color:#dc2626">$1</span> $2 <span style="color:#dc2626">$3</span>');

/** Đáp án mẫu cho mọi ô (bản in đáp án): ô nhiều đáp án lấy đáp án đầu, phép tính theo tranh lấy phép đầu. */
function dapAnMau(phieu: Phieu): Record<string, string> {
  const out: Record<string, string> = {};
  for (const b of Object.values(phieu.blanks)) {
    if (b.kind !== 'eq') out[b.id] = b.ans[0];
    else if (!b.any) {
      const m = /^(\d+)([+-])(\d+)=(\d+)$/.exec(b.ans[0]);
      if (m) out[b.id] = JSON.stringify([m[1], m[2], m[3], m[4]]);
    }
  }
  return out;
}

export default function PhieuThi({ phieu, mode = 'lam' }: { phieu: Phieu; mode?: Mode }) {
  const [ans, setAns] = useState<Record<string, string>>(() => (mode === 'dap-an' ? dapAnMau(phieu) : {}));
  const [nop, setNop] = useState(mode === 'dap-an');
  const set = useCallback((id: string, v: string) => setAns((a) => ({ ...a, [id]: v })), []);

  const ketQua = useMemo(() => {
    // Làm tròn: quy đề 13 điểm về thang 10 cộng lại ra 10.000000000000002
    const max = Math.round(phieu.bai.reduce((s, b) => s + b.diem, 0) * 100) / 100;
    const theoBai = phieu.bai.map(() => ({ dung: 0, tong: 0 }));
    for (const b of Object.values(phieu.blanks)) {
      theoBai[b.bai].tong++;
      if (dungO(b, ans[b.id])) theoBai[b.bai].dung++;
    }
    const diem = phieu.bai.reduce((s, b, i) => s + (theoBai[i].tong ? (b.diem * theoBai[i].dung) / theoBai[i].tong : 0), 0);
    const daLam = Object.values(phieu.blanks).filter((b) => (ans[b.id] ?? '') !== '').length;
    return { diem, max, daLam, dung: theoBai.reduce((s, x) => s + x.dung, 0) };
  }, [ans, phieu]);

  const ctx: Ctx = { blanks: phieu.blanks, ans, set: mode === 'lam' ? set : () => {}, nop, kieu: phieu.kieu, mode };
  const diemHien = nop && mode === 'lam' ? Math.round(ketQua.diem * 2) / 2 : null;
  const coDauBam = Object.values(phieu.blanks).some((b) => ['c', 's', 'd', 't'].includes(b.kind));

  const noiDung = (
    <>
      {phieu.bai.map((bai, i) => (
        <div key={i}>
          {phieu.phan?.[i] ? <h2 className="mt-2 font-bold" style={{ color: DO, fontFamily: 'inherit', fontSize: '1.1em' }}>{phieu.phan[i]}</h2> : null}
          <BaiView bai={bai} kieu={phieu.kieu} />
        </div>
      ))}
    </>
  );

  let giay: ReactNode;
  if (phieu.kieu === 'giua-ki') {
    giay = (
      <div className="rounded-sm bg-white p-4 text-[15px] text-black shadow-lg sm:p-8 sm:text-[19px]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap justify-between gap-x-6 font-bold">
              <span>Họ và tên:………………………</span>
              <span>Lớp{phieu.head[2] ?? ''}: ………</span>
            </div>
            <p className="mt-2 text-center font-bold">{phieu.head[0]}</p>
            <p className="text-center font-bold" style={{ color: phieu.head[1].includes('Đề') && !phieu.phan ? DO : undefined }}>{phieu.head[1]}</p>
          </div>
          <DiemBox diem={diemHien} max={ketQua.max} />
        </div>
        <div className="mt-1">{noiDung}</div>
      </div>
    );
  } else if (phieu.kieu === 'on-tap') {
    giay = (
      <div className="rounded-sm bg-[#fffdf7] p-3 text-[14px] shadow-lg sm:p-6 sm:text-[16px]" style={{ backgroundImage: 'linear-gradient(#f1ede4 1px, transparent 1px), linear-gradient(90deg, #f1ede4 1px, transparent 1px)', backgroundSize: '22px 22px', color: '#1e3a8a' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border-2 px-3 py-0.5 text-sm font-extrabold" style={{ borderColor: '#f59e0b', color: '#15803d' }}>PHIẾU BÀI TẬP</span>
          <span className="rounded-full border px-3 py-0.5 text-sm italic text-slate-700">Tên bé: ……………………</span>
          <DiemMini diem={diemHien} max={ketQua.max} />
        </div>
        <h2 className="my-2 text-center text-3xl font-black tracking-wide sm:text-4xl" style={{ color: '#1e40af', fontFamily: 'var(--font-display, inherit)' }}>{phieu.head[0]}</h2>
        <div className="rounded-2xl border-[3px] p-2 sm:p-4" style={{ borderColor: '#f59e0b' }}>
          {noiDung}
        </div>
      </div>
    );
  } else if (phieu.kieu === 'tv-hk1') {
    // Mẫu "KIỂM TRA HỌC KÌ I MÔN TIẾNG VIỆT": ĐỀ N xanh, họ tên/lớp, thứ ngày tháng, khung cam "Nhận xét của giáo viên"
    giay = (
      <div className="rounded-sm bg-white p-4 text-[15px] text-black shadow-lg sm:p-8 sm:text-[17px]" style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif' }}>
        <div className="grid grid-cols-2 gap-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          <div>
            <p className="pl-8 font-bold text-blue-700">{phieu.head[0]}</p>
            <p className="font-bold">Họ và tên:………………………</p>
            <p className="font-bold">Lớp ……………………………</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{phieu.head[1]}</p>
            <p className="mt-2 italic">Thứ……… ngày….. tháng ….năm ………</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
          <div className="rounded-[1.4rem] border-[3px] px-4 py-2 text-center" style={{ borderColor: '#f0954a', fontFamily: '"Times New Roman", Times, serif' }}>
            <p className="font-bold">Nhận xét của giáo viên</p>
            <p className="mt-2 tracking-widest text-slate-500">……………………………………………………</p>
            <p className="tracking-widest text-slate-500">……………………………………………………</p>
          </div>
          <DiemBox diem={diemHien} max={ketQua.max} />
        </div>
        <div className="mt-2">{noiDung}</div>
      </div>
    );
  } else if (phieu.kieu === 'ct-gh') {
    giay = (
      <div className="rounded-xl bg-gradient-to-b from-sky-50 to-white p-3 text-[15px] shadow-lg sm:p-6">
        <div className="mx-auto mb-3 max-w-md rounded-[2rem] border-4 border-sky-200 bg-white px-4 py-3 text-center">
          <p className="text-xl font-black sm:text-2xl" style={{ color: '#db2777' }}>{phieu.head[0]}</p>
          <p className="text-2xl font-black sm:text-4xl" style={{ color: '#16a34a' }}>{phieu.head[1]}</p>
        </div>
        <div className="mb-2 flex justify-end"><DiemMini diem={diemHien} max={ketQua.max} /></div>
        {noiDung}
      </div>
    );
  } else if (phieu.kieu === 'ct') {
    giay = (
      <div className="rounded-xl p-3 shadow-lg sm:p-6" style={{ background: '#f9d9bf' }}>
        <div className="rounded-2xl bg-white p-4 text-[15px] sm:p-6 sm:text-[17px]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-xl font-black">✏️ {phieu.head[0]}</h2>
            <DiemMini diem={diemHien} max={ketQua.max} />
          </div>
          {noiDung}
        </div>
      </div>
    );
  } else {
    giay = (
      <div className="rounded-xl bg-gradient-to-b from-sky-100 to-white p-3 text-[15px] shadow-lg sm:p-6 sm:text-[17px]">
        <div className="mb-3 text-center">
          <p className="text-2xl font-black" style={{ color: '#dc2626' }}>{phieu.head[0]}</p>
          <p className="font-bold text-blue-800">{phieu.head[1]}</p>
          <p className="font-bold text-blue-800">{phieu.head[2]}</p>
        </div>
        <div className="mb-3 grid grid-cols-[auto_1fr] items-center gap-3 rounded-xl border border-sky-300 bg-white p-2">
          <DiemBox diem={diemHien} max={ketQua.max} />
          <div className="text-sm">
            <p>Họ và tên học sinh: ……………………</p>
            <p className="mt-1 rounded bg-sky-100 px-2 py-1 font-bold text-blue-900">{phieu.head[3]}</p>
          </div>
        </div>
        {noiDung}
      </div>
    );
  }

  if (mode !== 'lam')
    return (
      <C.Provider value={ctx}>
        <style>{`.tl1-cot{grid-template-columns:repeat(var(--c),minmax(0,1fr))}`}</style>
        {mode === 'dap-an' ? <p className="mb-1 text-sm font-black text-emerald-700">ĐÁP ÁN · {phieu.title}</p> : null}
        {giay}
      </C.Provider>
    );

  return (
    <C.Provider value={ctx}>
      <style>{`.tl1-cot{grid-template-columns:repeat(var(--c),minmax(0,1fr))}@media (max-width:640px){.tl1-cot{grid-template-columns:repeat(var(--cm),minmax(0,1fr))}}`}</style>
      <div className="mx-auto w-full max-w-3xl px-2 pb-28 pt-4 sm:px-4">
        {coDauBam && !nop ? (
          <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">💡 Ô số: gõ số. Ô dấu / Đ-S / chữ: bấm vào ô để đổi lựa chọn.</p>
        ) : null}
        {nop ? (
          <div className="mb-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-3 text-center">
            <p className="text-lg font-black text-emerald-700">
              Bé được {fmt(diemHien ?? 0)} / {fmt(ketQua.max)} điểm {diemHien !== null && diemHien >= ketQua.max * 0.8 ? '🎉' : '💪'}
            </p>
            <p className="text-sm text-emerald-800">Ô xanh là đúng, ô đỏ là sai — số nhỏ màu đỏ bên cạnh là đáp án đúng.</p>
          </div>
        ) : null}
        {giay}
        <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 lg:bottom-6">
          <div className="flex items-center gap-3 rounded-full border-2 border-pink-200 bg-white/95 px-4 py-2 shadow-xl backdrop-blur">
            {nop ? (
              <button
                type="button"
                onClick={() => {
                  setAns({});
                  setNop(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-5 py-2 font-black text-white">
                🔄 Làm lại
              </button>
            ) : (
              <>
                <span className="text-sm font-bold text-slate-600">
                  Đã làm {ketQua.daLam}/{phieu.soO} ô
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setNop(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-2 font-black text-white">
                  🏆 Nộp bài
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </C.Provider>
  );
}

function DiemMini({ diem, max }: { diem: number | null; max: number }) {
  return (
    <span className="inline-flex min-w-[5.5rem] items-center justify-center gap-1 rounded-xl border-2 border-slate-700 bg-white px-2 py-1 text-sm font-bold text-slate-800">
      Điểm:
      <span className="text-xl" style={{ color: DO, fontFamily: '"Comic Sans MS", cursive' }}>
        {diem !== null ? fmt(diem) : ''}
      </span>
      {diem !== null && max !== 10 ? `/${fmt(max)}` : ''}
    </span>
  );
}
