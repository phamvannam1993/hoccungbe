'use client';

import { useMemo, useState } from 'react';
import { ItemCard } from '../components/catalog/CatalogCards';
import { ALL_GRADES, SUBJECT_META, gradeName, type CatalogItem, type Grade, type Subject } from '../lib/catalog';

// Bộ lọc theo lớp / môn cho trang Tài liệu in. Máy chủ đã vẽ sẵn MỌI thẻ (máy tìm kiếm thấy đủ),
// ở đây chỉ ẩn bớt theo lựa chọn.

const SUBJECTS: Subject[] = ['toan', 'tieng-viet', 'tieng-anh'];

export type Nhom = { id: string; title: string; emoji: string; desc: string; items: CatalogItem[] };

export default function LocTaiLieu({ nhom }: { nhom: Nhom[] }) {
  const [lop, setLop] = useState<Grade | null>(null);
  const [mon, setMon] = useState<Subject | null>(null);

  const shown = useMemo(
    () =>
      nhom.map((n) => ({
        ...n,
        items: n.items.filter((x) => (lop == null || x.grades.includes(lop)) && (mon == null || x.subject === mon || x.subject === 'tong-hop')),
      })),
    [nhom, lop, mon],
  );
  const total = shown.reduce((s, n) => s + n.items.length, 0);

  const chip = (active: boolean) =>
    `kid-display shrink-0 rounded-full border-2 px-3.5 py-1.5 text-sm font-black transition ${
      active ? 'border-amber-500 bg-amber-500 text-white' : 'border-amber-200 bg-white text-slate-700 hover:bg-amber-50'
    }`;

  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 mt-4 border-b border-amber-100 bg-[#fffdf5]/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-3xl sm:border-2 sm:border-amber-200 sm:bg-white sm:p-4">
        <div role="group" aria-label="Lọc theo lớp" className="flex flex-wrap gap-2">
          <span className="self-center text-xs font-black uppercase tracking-wide text-slate-400">Lớp</span>
          <button type="button" aria-pressed={lop == null} onClick={() => setLop(null)} className={chip(lop == null)}>Tất cả</button>
          {ALL_GRADES.map((g) => (
            <button key={g} type="button" aria-pressed={lop === g} onClick={() => setLop(lop === g ? null : g)} className={chip(lop === g)}>
              {g === 0 ? 'Mẫu giáo' : g}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Lọc theo môn" className="mt-2 flex flex-wrap gap-2">
          <span className="self-center text-xs font-black uppercase tracking-wide text-slate-400">Môn</span>
          <button type="button" aria-pressed={mon == null} onClick={() => setMon(null)} className={chip(mon == null)}>Tất cả</button>
          {SUBJECTS.map((s) => (
            <button key={s} type="button" aria-pressed={mon === s} onClick={() => setMon(mon === s ? null : s)} className={chip(mon === s)}>
              {SUBJECT_META[s].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs font-bold text-slate-500" aria-live="polite">
          {total} tài liệu{lop != null ? ` · ${gradeName(lop)}` : ''}{mon ? ` · ${SUBJECT_META[mon].label}` : ''}
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        {shown.map((n) => (
          <section key={n.id} id={n.id} className="scroll-mt-28 rounded-[28px] border-2 border-amber-200 bg-white p-4 sm:p-6" hidden={!n.items.length}>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-xl" aria-hidden>{n.emoji}</span>
              <div className="min-w-0">
                <h2 className="kid-display text-lg font-black text-slate-900 sm:text-xl">{n.title}</h2>
                <p className="text-[13px] leading-snug text-slate-500">{n.desc}</p>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {n.items.map((it) => (
                <li key={it.href} className="min-w-0"><ItemCard item={it} /></li>
              ))}
            </ul>
          </section>
        ))}
        {total === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center font-bold text-slate-500">Chưa có tài liệu cho lựa chọn này. Thử bỏ bớt bộ lọc nhé.</p>
        )}
      </div>
    </>
  );
}
