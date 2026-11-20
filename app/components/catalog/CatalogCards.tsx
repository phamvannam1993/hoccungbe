import Link from 'next/link';
import type { ReactNode } from 'react';
import { KIND_META, SUBJECT_META, gradeRangeLabel, type CatalogItem, type Palette } from '../../lib/catalog';

// Một kiểu thẻ cho mọi trang gom mới (trang lớp, /tieng-viet, /tai-lieu-in, trang chủ): cùng bo góc, cùng
// viền, màu theo môn lấy từ SUBJECT_META. Đợt 3 sẽ dùng lại cho các trang học cũ.

export function paletteOf(item: CatalogItem): Palette {
  if (item.kind === 'de-thi' || item.kind === 'on-tap') return KIND_META[item.kind].palette;
  if (item.kind === 'thi-dau') return KIND_META['thi-dau'].palette;
  if (item.subject === 'tong-hop') return KIND_META[item.kind].palette;
  return SUBJECT_META[item.subject].palette;
}

export function GradeChip({ item, palette }: { item: CatalogItem; palette?: Palette }) {
  const p = palette ?? paletteOf(item);
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-black" style={{ background: p.soft, color: p.c }}>
      {gradeRangeLabel(item.grades)}
    </span>
  );
}

export function ItemCard({ item, compact = false }: { item: CatalogItem; compact?: boolean }) {
  const p = paletteOf(item);
  return (
    <Link
      href={item.href}
      className="group flex h-full min-w-0 items-start gap-3 rounded-3xl border-2 bg-white p-3.5 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-4"
      style={{ borderColor: p.border, boxShadow: `0 3px 0 ${p.border}` }}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: p.soft }} aria-hidden>
        {item.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="kid-display block text-[15px] font-black leading-snug text-slate-800 group-hover:underline">{item.title}</span>
        {!compact && <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{item.desc}</span>}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <GradeChip item={item} palette={p} />
          {item.paid && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-800">Trả phí</span>}
        </span>
      </span>
    </Link>
  );
}

export function ItemGrid({ items, compact, cols = 3 }: { items: CatalogItem[]; compact?: boolean; cols?: 2 | 3 | 4 }) {
  const c = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <ul className={`grid gap-3 ${c}`}>
      {items.map((it) => (
        <li key={it.href} className="min-w-0">
          <ItemCard item={it} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

/** Khối có tiêu đề + nút "Xem tất cả". */
export function Section({
  id,
  emoji,
  title,
  palette,
  more,
  children,
  desc,
}: {
  id?: string;
  emoji: string;
  title: string;
  palette: Palette;
  more?: { href: string; label: string };
  desc?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[28px] border-2 bg-white p-4 sm:p-6" style={{ borderColor: palette.border }} aria-labelledby={id ? `${id}-h` : undefined}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: palette.soft }} aria-hidden>
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={id ? `${id}-h` : undefined} className="kid-display text-lg font-black text-slate-900 sm:text-xl">{title}</h2>
          {desc && <p className="text-[13px] leading-snug text-slate-500">{desc}</p>}
        </div>
        {more && (
          <Link href={more.href} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-black" style={{ background: palette.soft, color: palette.c }}>
            {more.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
