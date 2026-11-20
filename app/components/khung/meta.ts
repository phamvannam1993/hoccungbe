// Phần dữ liệu dùng chung cho khung trang học (PageHeader, HocTiep, NenGameNghe): tra sổ đăng ký theo URL,
// lấy màu theo môn, trang gom của môn và nhãn "Hợp lớp …". Không có JSX để dùng được cả ở server lẫn client.

import { PALETTE, SUBJECT_META, byHref, gradeRangeLabel, type CatalogItem, type Grade, type Palette, type Subject } from '../../lib/catalog';

/** Trang gom của môn — đích của breadcrumb giữa và nút "Mọi bài …". Tư duy thuộc về Toán. */
export function hubOf(subject: Subject): { href: string; label: string } {
  if (subject === 'tu-duy' || subject === 'toan') return { href: SUBJECT_META.toan.hub, label: 'Toán' };
  if (subject === 'tong-hop') return { href: '/', label: 'Trang chủ' };
  return { href: SUBJECT_META[subject].hub, label: SUBJECT_META[subject].label };
}

/** Màu khung: Toán tím, Tiếng Việt hồng, Tiếng Anh xanh ngọc, Tư duy xanh trời. */
export function framePalette(subject: Subject): Palette {
  return subject === 'tong-hop' ? PALETTE.slate : SUBJECT_META[subject].palette;
}

/** "Hợp lớp 1–2", "Hợp mẫu giáo – lớp 1", "Hợp lớp 3". */
export function hopLopLabel(grades: Grade[]): string {
  const s = gradeRangeLabel(grades);
  return s ? `Hợp ${s.charAt(0).toLowerCase()}${s.slice(1)}` : '';
}

/** Mục trong sổ đăng ký; trang chưa đăng ký thì dựng tạm từ các tham số dự phòng. */
export function frameItem(href: string, fallback?: { subject?: Subject; grades?: Grade[]; title?: string; emoji?: string; desc?: string }): CatalogItem {
  const it = byHref(href);
  if (it) return it;
  return {
    href,
    title: fallback?.title ?? '',
    desc: fallback?.desc ?? '',
    emoji: fallback?.emoji ?? '📚',
    subject: fallback?.subject ?? 'tong-hop',
    kind: 'cong-cu',
    grades: fallback?.grades ?? [],
  };
}
