'use client';

import Link from 'next/link';
import { CATALOG, gradeHref, gradeName, type CatalogItem, type Grade, type Subject } from '../../lib/catalog';
import { useLopCuaBe } from '../../lib/lopCuaBe';
import { ItemGrid } from '../catalog/CatalogCards';
import { framePalette, frameItem, hubOf } from './meta';

// CHÂN TRANG CHUNG "Học tiếp" cho mọi trang học: 3 gợi ý cùng môn, cùng lớp lấy từ sổ đăng ký + nút về trang
// lớp. Bé đã chọn lớp (lopCuaBe) thì gợi ý theo đúng lớp đó; chưa chọn thì theo các lớp hợp với trang.
// Lần dựng đầu (máy chủ) chưa biết lớp → vẫn ra đủ 3 liên kết cho máy tìm kiếm đọc.

type ExtraLink = { href: string; label: string; emoji?: string };

const SUGGEST_KINDS = new Set(['cong-cu', 'tro-choi']);

function sameFamily(a: Subject, b: Subject) {
  const fam = (s: Subject) => (s === 'tu-duy' ? 'toan' : s);
  return fam(a) === fam(b);
}

export function goiYHocTiep(item: CatalogItem, lop: Grade | null, n = 3): CatalogItem[] {
  const target: Grade[] = lop != null && (item.grades.includes(lop) || !item.grades.length) ? [lop] : item.grades;
  const idx = Math.max(0, CATALOG.findIndex((x) => x.href === item.href));
  const N = CATALOG.length;
  // Xoay vòng từ ngay sau trang hiện tại → mỗi trang gợi ý một bộ khác nhau, nhưng luôn cố định (không random).
  const order = (x: CatalogItem) => (CATALOG.indexOf(x) - idx + N) % N;
  const ok = (x: CatalogItem) =>
    x.href !== item.href &&
    !x.paid &&
    SUGGEST_KINDS.has(x.kind) &&
    // Toán tư duy từng lớp: chỉ gợi ý khi khớp đúng lớp, tránh 5 thẻ gần giống nhau.
    (!x.href.startsWith('/toan-tu-duy-lop-') || (lop != null && x.grades.includes(lop))) &&
    (!target.length || x.grades.some((g) => target.includes(g)));
  const first = CATALOG.filter((x) => ok(x) && sameFamily(x.subject, item.subject)).sort((a, b) => order(a) - order(b));
  const out = first.slice(0, n);
  if (out.length < n) {
    const more = CATALOG.filter((x) => ok(x) && !out.includes(x) && x.subject !== 'tong-hop').sort((a, b) => order(a) - order(b));
    out.push(...more.slice(0, n - out.length));
  }
  return out;
}

export function HocTiep({
  href,
  links,
  subject,
  grades,
  className = 'mt-8',
}: {
  /** URL trang hiện tại — khoá tra sổ đăng ký. */
  href: string;
  /** Liên kết chọn tay riêng của trang (khóa học, bài tập, phiếu in…) — hiện thành hàng "Xem thêm". */
  links?: ExtraLink[];
  subject?: Subject;
  grades?: Grade[];
  className?: string;
}) {
  const [lop] = useLopCuaBe();
  const item = frameItem(href, { subject, grades });
  const pal = framePalette(item.subject);
  const hub = hubOf(item.subject);
  const list = goiYHocTiep(item, lop);
  const sorted = [...item.grades].sort((a, b) => a - b);
  const g: Grade | null = lop ?? sorted.find((x) => x > 0) ?? sorted[0] ?? null;

  return (
    <section
      className={`${className} rounded-panel border-2 bg-surface p-4 sm:p-6`}
      style={{ borderColor: pal.border }}
      aria-labelledby="hoc-tiep-h"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl" style={{ background: pal.soft }} aria-hidden>
          👉
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="hoc-tiep-h" className="kid-display text-h2 font-black text-ink">Học tiếp</h2>
          <p className="text-small leading-snug text-ink-muted">
            {lop != null ? `Gợi ý cho bé ${gradeName(lop).toLowerCase()}` : 'Gợi ý cùng lứa tuổi'} — bấm để sang bài khác.
          </p>
        </div>
      </div>

      {list.length > 0 && <ItemGrid items={list} />}

      <div className="mt-4 flex flex-wrap gap-2">
        {g != null && (
          <Link
            href={gradeHref(g)}
            className="kid-display inline-flex items-center gap-1.5 rounded-chip px-4 py-2 text-sm font-black text-white transition hover:brightness-110"
            style={{ background: pal.c }}
          >
            ← Về trang {gradeName(g)}
          </Link>
        )}
        {hub.href !== '/' && hub.href !== href && (
          <Link
            href={hub.href}
            className="kid-display inline-flex items-center gap-1.5 rounded-chip border-2 px-4 py-2 text-sm font-black"
            style={{ borderColor: pal.border, color: pal.c, background: pal.soft }}
          >
            Mọi bài {hub.label} →
          </Link>
        )}
      </div>

      {links && links.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-2 text-small font-black text-ink-muted">Xem thêm</p>
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href} className="min-w-0">
                <Link
                  href={l.href}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-chip border bg-surface px-3 py-1.5 text-[13px] font-bold text-ink-2 hover:underline"
                  style={{ borderColor: pal.border }}
                >
                  {l.emoji && <span aria-hidden>{l.emoji}</span>}
                  <span className="min-w-0 truncate">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
