import Link from 'next/link';
import type { ReactNode } from 'react';

// Bộ component style "kid" dùng chung cho các trang SEO/nội dung — đồng bộ tông vui nhộn
// của Bé Hay Học (rounded lớn, viền pastel, chữ kid-display, gradient, emoji).

export type Tone = 'pink' | 'purple' | 'blue' | 'orange' | 'green' | 'sky' | 'yellow';

export const TONES: Record<Tone, { c: string; border: string; tint: string; grad: string; shadow: string }> = {
  pink: { c: '#c81e5b', border: '#FBCFE8', tint: '#FFF1F6', grad: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', shadow: 'rgba(255,107,157,0.22)' },
  purple: { c: '#6d28d9', border: '#E9D5FF', tint: '#F6F0FF', grad: 'linear-gradient(135deg,#A06CD5,#4ECDC4)', shadow: 'rgba(160,108,213,0.22)' },
  blue: { c: '#0d7a74', border: '#99F6E4', tint: '#ECFEFB', grad: 'linear-gradient(135deg,#4ECDC4,#87CEEB)', shadow: 'rgba(78,205,196,0.25)' },
  orange: { c: '#c2410c', border: '#FED7AA', tint: '#FFF7ED', grad: 'linear-gradient(135deg,#FF9F45,#FFD93D)', shadow: 'rgba(255,159,69,0.25)' },
  green: { c: '#15803d', border: '#BBF7D0', tint: '#F0FDF4', grad: 'linear-gradient(135deg,#6BCB77,#4ECDC4)', shadow: 'rgba(107,203,119,0.25)' },
  sky: { c: '#0369a1', border: '#BAE6FD', tint: '#F0F9FF', grad: 'linear-gradient(135deg,#87CEEB,#4ECDC4)', shadow: 'rgba(135,206,235,0.28)' },
  yellow: { c: '#a16207', border: '#FDE68A', tint: '#FEFCE8', grad: 'linear-gradient(135deg,#FFD93D,#FF9F45)', shadow: 'rgba(255,217,61,0.3)' },
};

const CYCLE: Tone[] = ['pink', 'blue', 'orange', 'purple', 'green', 'sky', 'yellow'];

/** Nền + container chung cho trang. */
export function KidShell({ children, max = '4xl' }: { children: ReactNode; max?: '3xl' | '4xl' | '5xl' }) {
  const mw = max === '3xl' ? 'max-w-3xl' : max === '5xl' ? 'max-w-5xl' : 'max-w-4xl';
  return (
    <div className="kid-bg min-h-screen">
      <div className={`mx-auto ${mw} px-4 py-6 sm:py-9`}>{children}</div>
    </div>
  );
}

/** Breadcrumb kiểu kid. */
export function KidCrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="text-[#c81e5b] hover:underline">{i === 0 ? '🏠 ' : ''}{it.label}</Link>
            ) : (
              <span className="text-purple-700">{it.label}</span>
            )}
            {i < items.length - 1 && <span className="text-purple-300">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Hero: thẻ bo lớn, emoji, tiêu đề gradient, mô tả. */
export function KidHero({
  emoji,
  eyebrow,
  title,
  description,
  tone = 'pink',
  children,
}: {
  emoji?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <section
      className="rounded-[28px] border-4 bg-white p-5 sm:p-8"
      style={{ borderColor: t.border, boxShadow: `0 10px 34px ${t.shadow}` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {emoji && (
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl kid-bounce" style={{ background: t.tint }} aria-hidden>
            {emoji}
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="text-[11px] font-black uppercase tracking-widest kid-display" style={{ color: t.c }}>{eyebrow}</p>}
          <h1
            className="text-2xl font-black kid-display sm:text-4xl"
            style={{ backgroundImage: t.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
            {title}
          </h1>
        </div>
      </div>
      {description && <p className="mt-4 leading-7 text-slate-600">{description}</p>}
      {children}
    </section>
  );
}

/** Thẻ nội dung có tiêu đề (viền + emoji theo tông). */
export function KidCard({
  emoji,
  title,
  tone = 'blue',
  badge,
  children,
  className = '',
}: {
  emoji?: string;
  title?: string;
  tone?: Tone;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <section className={`rounded-3xl border-2 bg-white p-5 sm:p-6 ${className}`} style={{ borderColor: t.border, boxShadow: `0 6px 22px ${t.shadow}` }}>
      {title && (
        <h2 className="flex items-center gap-3 text-lg font-black text-slate-900 kid-display sm:text-xl">
          {emoji && <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: t.tint }} aria-hidden>{emoji}</span>}
          <span className="min-w-0">{title}</span>
          {badge != null && <span className="ml-auto rounded-full px-2.5 py-1 text-xs font-black" style={{ background: t.tint, color: t.c }}>{badge}</span>}
        </h2>
      )}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

/** Danh sách link dạng "viên thuốc" nhiều màu (tự xoay tông). */
export function KidPills({ items, tone }: { items: { href: string; label: string }[]; tone?: Tone }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((it, i) => {
        const t = TONES[tone ?? CYCLE[i % CYCLE.length]];
        return (
          <Link
            key={it.href + i}
            href={it.href}
            className="inline-flex items-center rounded-2xl border-2 bg-white px-4 py-2 text-sm font-black kid-display transition hover:-translate-y-0.5"
            style={{ borderColor: t.border, color: t.c, boxShadow: `0 3px 0 ${t.border}` }}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}

/** Danh sách link dạng ô lưới (có mũi tên), 1–2 cột. */
export function KidLinkList({ items, tone = 'sky' }: { items: { href: string; label: string; emoji?: string }[]; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.href}>
          <Link
            href={it.href}
            className="group flex items-center gap-2 rounded-2xl border-2 bg-white px-4 py-3 font-bold text-slate-700 transition hover:-translate-y-0.5"
            style={{ borderColor: t.border, boxShadow: `0 3px 0 ${t.border}` }}
          >
            {it.emoji && <span aria-hidden>{it.emoji}</span>}
            <span className="min-w-0">{it.label}</span>
            <span className="ml-auto text-lg transition group-hover:translate-x-0.5" style={{ color: t.c }} aria-hidden>→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Phân trang kid. Trang 1 = basePath (không tham số); trang N = basePath?param=N. */
export function KidPager({
  basePath,
  page,
  totalPages,
  param = 'trang',
  tone = 'blue',
}: {
  basePath: string;
  page: number;
  totalPages: number;
  param?: string;
  tone?: Tone;
}) {
  if (totalPages <= 1) return null;
  const t = TONES[tone];
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?${param}=${p}`);

  // Cửa sổ số trang: 1 … (page-1) page (page+1) … last
  const nums = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const list = [...nums].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const withGaps: (number | '…')[] = [];
  let prev = 0;
  for (const p of list) {
    if (p - prev > 1) withGaps.push('…');
    withGaps.push(p);
    prev = p;
  }

  const btn = 'grid h-10 min-w-10 place-items-center rounded-2xl border-2 px-3 text-sm font-black kid-display transition';
  return (
    <nav aria-label="Phân trang" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={btn} style={{ borderColor: t.border, color: t.c }} aria-label="Trang trước">←</Link>
      ) : (
        <span className={`${btn} opacity-40`} style={{ borderColor: '#e2e8f0', color: '#94a3b8' }} aria-hidden>←</span>
      )}

      {withGaps.map((p, i) =>
        p === '…' ? (
          <span key={`g${i}`} className="px-1 text-slate-400">…</span>
        ) : p === page ? (
          <span key={p} className={`${btn} text-white`} style={{ backgroundImage: t.grad, borderColor: 'transparent' }} aria-current="page">{p}</span>
        ) : (
          <Link key={p} href={href(p)} className={btn} style={{ borderColor: t.border, color: t.c }}>{p}</Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={btn} style={{ borderColor: t.border, color: t.c }} aria-label="Trang sau">→</Link>
      ) : (
        <span className={`${btn} opacity-40`} style={{ borderColor: '#e2e8f0', color: '#94a3b8' }} aria-hidden>→</span>
      )}
    </nav>
  );
}

/** FAQ dạng accordion kid. */
export function KidFaq({ items, tone = 'purple' }: { items: { q: string; a: ReactNode }[]; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: t.border }}>
          <summary className="cursor-pointer font-black text-slate-800 kid-display">{f.q}</summary>
          <div className="mt-2 leading-7 text-slate-600">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
