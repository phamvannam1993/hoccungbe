import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Grade, Subject } from '../../lib/catalog';
import { framePalette, frameItem, hopLopLabel, hubOf } from './meta';

// ĐẦU TRANG CHUNG cho mọi trang học: breadcrumb → H1 → chip "Hợp lớp …" (lấy từ sổ đăng ký app/lib/catalog.ts)
// → một câu "bé học được gì" → đoạn giới thiệu riêng của trang (giữ nguyên chữ cũ cho SEO).
// Thay cho cặp KidCrumb + KidHero cũ. Màu theo môn đọc từ token (--hue-* trong globals.css).

export function PageHeader({
  href,
  title,
  emoji,
  eyebrow,
  description,
  crumbLabel,
  subject,
  grades,
  children,
}: {
  /** URL của trang — khoá tra sổ đăng ký (lớp, môn, câu "bé học được gì"). */
  href: string;
  /** Chữ H1 — giữ nguyên chữ cũ của trang. */
  title: string;
  emoji?: string;
  eyebrow?: string;
  /** Đoạn giới thiệu dài của trang (giữ cho SEO). */
  description?: ReactNode;
  /** Chữ ở mắt xích cuối breadcrumb (mặc định: tên trong sổ đăng ký). */
  crumbLabel?: string;
  /** Dự phòng cho trang chưa có trong sổ đăng ký. */
  subject?: Subject;
  grades?: Grade[];
  children?: ReactNode;
}) {
  const item = frameItem(href, { subject, grades, title, emoji });
  const pal = framePalette(item.subject);
  const hub = hubOf(item.subject);
  const crumbs = [
    { label: 'Trang chủ', href: '/' },
    ...(hub.href !== '/' && hub.href !== href ? [hub] : []),
    { label: crumbLabel ?? (item.title || title) },
  ];
  const hop = hopLopLabel(item.grades);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-small font-bold">
          {crumbs.map((c, i) => (
            <li key={i} className="flex min-w-0 items-center gap-1.5">
              {'href' in c && c.href ? (
                <Link href={c.href} className="hover:underline" style={{ color: pal.c }}>
                  {i === 0 ? '🏠 ' : ''}
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink-muted" aria-current="page">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="text-ink-muted/60" aria-hidden>›</span>}
            </li>
          ))}
        </ol>
      </nav>

      <header
        className="rounded-panel border-2 bg-surface p-5 sm:p-7"
        style={{ borderColor: pal.border, boxShadow: `0 4px 0 ${pal.border}` }}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl sm:h-16 sm:w-16 sm:text-4xl"
            style={{ background: pal.soft }}
            aria-hidden
          >
            {emoji ?? item.emoji}
          </span>
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="kid-display text-chip font-black uppercase tracking-widest" style={{ color: pal.c }}>
                {eyebrow}
              </p>
            )}
            <h1 className="kid-display text-h1 font-black leading-tight text-ink">{title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {hop && (
                <span
                  className="inline-flex items-center rounded-chip px-2.5 py-0.5 text-chip font-black"
                  style={{ background: pal.soft, color: pal.c }}
                  title={item.uncertain ? 'Lớp ước lượng theo nội dung bài' : undefined}
                >
                  🎒 {hop}
                </span>
              )}
              {hub.href !== '/' && hub.href !== href && (
                <Link
                  href={hub.href}
                  className="inline-flex items-center rounded-chip border px-2.5 py-0.5 text-chip font-black hover:underline"
                  style={{ borderColor: pal.border, color: pal.c }}
                >
                  {hub.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {item.desc && (
          <p className="mt-4 rounded-2xl px-3.5 py-2.5 text-[15px] font-semibold leading-snug text-ink-2" style={{ background: pal.soft }}>
            <span aria-hidden>🎯 </span>
            <b style={{ color: pal.c }}>Bé học được:</b> {item.desc}
          </p>
        )}
        {description && <p className="mt-3 text-[15px] leading-6 text-ink-muted sm:text-base sm:leading-7">{description}</p>}
        {children}
      </header>
    </>
  );
}
