import { SITE_URL, safeDate } from './seo';
import { gamesData } from '../components/edu/data/gamesData';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

export type SitemapEntry = { loc: string; lastmod: Date };

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function unwrapData<T>(value: T[] | { data?: T[] } | null): T[] {
  if (Array.isArray(value)) return value;
  return Array.isArray(value?.data) ? value.data : [];
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] as string),
  );
}

// ── XML builders (Google chỉ dùng <loc> + <lastmod>) ────────────────────────
export function urlsetXml(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod.toISOString()}</lastmod>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export function sitemapIndexXml(items: { loc: string; lastmod?: Date }[]): string {
  const body = items
    .map(
      (it) =>
        `  <sitemap>\n    <loc>${escapeXml(it.loc)}</loc>${it.lastmod ? `\n    <lastmod>${it.lastmod.toISOString()}</lastmod>` : ''}\n  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

// ── Nguồn dữ liệu cho từng sitemap con ──────────────────────────────────────
const STATIC_PATHS: [string, string][] = [
  ['/', '2026-06-24'],
  ['/khoa-hoc', '2026-06-24'],
  ['/tro-choi', '2026-06-24'],
  ['/cong-cu/chuyen-van-ban-thanh-giong-noi', '2026-06-24'],
  ['/cong-cu/chuyen-giong-noi-thanh-van-ban', '2026-06-24'],
  ['/de-thi', '2026-06-24'],
  // /tai-lieu tạm bỏ khỏi sitemap (đang noindex tới khi có đủ tài liệu thực tế).
  ['/bai-viet', '2026-06-24'],
  ['/cau-hoi-thuong-gap', '2026-06-01'],
  ['/huong-dan', '2026-06-01'],
  ['/ho-tro', '2026-06-01'],
  ['/chinh-sach-bao-mat', '2026-04-01'],
  ['/dieu-khoan', '2026-04-01'],
];

export function staticEntries(): SitemapEntry[] {
  return STATIC_PATHS.map(([path, date]) => ({ loc: `${SITE_URL}${path}`, lastmod: safeDate(date) }));
}

export async function courseEntries(): Promise<SitemapEntry[]> {
  type CourseItem = { slug?: string; isPublished?: boolean; updatedAt?: string; createdAt?: string };
  const res = await fetchJson<CourseItem[] | { data: CourseItem[] }>(`${apiUrl}/api/courses?limit=500`);
  const now = new Date();
  return unwrapData<CourseItem>(res)
    .filter((c) => !!c.slug && c.isPublished) // chỉ khóa đã xuất bản (active)
    .map((c) => ({ loc: `${SITE_URL}/khoa-hoc/${c.slug}`, lastmod: safeDate(c.updatedAt || c.createdAt || now) }));
}

// Danh sách khóa học (id + slug + loại) — để tách sitemap lessons/phiếu theo từng khóa.
export async function courseList(): Promise<{ id: number; slug: string; courseType?: string }[]> {
  type C = { id?: number; slug?: string; isPublished?: boolean; courseType?: string };
  const res = await fetchJson<C[] | { data: C[] }>(`${apiUrl}/api/courses?limit=500`);
  return unwrapData<C>(res)
    .filter((c) => !!c.slug && c.id != null && c.isPublished) // chỉ khóa active
    .map((c) => ({ id: c.id as number, slug: c.slug as string, courseType: c.courseType }));
}

// Các mức phiếu bài tập tương ứng URL /phieu-bai-tap/{lessonSlug}/{muc}.
// Mọi bài của khóa Toán đều có đủ 3 mức + bản 'ca-bai' → an toàn đưa vào sitemap.
const WORKSHEET_MUCS = ['de', 'trung-binh', 'nang-cao', 'ca-bai'] as const;

// Phiếu bài tập (in/PDF) của MỘT khóa: mỗi bài học sinh ra 4 URL phiếu.
// Chỉ lấy bài ĐÃ có quiz (quizCount > 0) để tránh URL phiếu 404 (trang phiếu notFound
// khi bài chưa có câu hỏi). API cũ chưa trả quizCount → giữ nguyên (không loại) để không mất URL.
export async function worksheetEntriesByCourse(courseId: number, courseSlug: string): Promise<SitemapEntry[]> {
  type LessonItem = { slug?: string; updatedAt?: string; createdAt?: string; quizCount?: number };
  const res = await fetchJson<LessonItem[] | { data: LessonItem[] }>(`${apiUrl}/api/lessons?courseId=${courseId}&slim=1`);
  const now = new Date();
  const entries: SitemapEntry[] = [];
  for (const l of unwrapData<LessonItem>(res)) {
    if (!l.slug) continue;
    if (l.quizCount != null && l.quizCount <= 0) continue; // bài chưa có quiz → bỏ
    const lastmod = safeDate(l.updatedAt || l.createdAt || now);
    for (const muc of WORKSHEET_MUCS) {
      entries.push({ loc: `${SITE_URL}/phieu-bai-tap/${l.slug}/${muc}`, lastmod });
    }
  }
  return entries;
}

// Bài học của MỘT khóa (slim=1 → chỉ slug + ngày, tránh tải ~13MB kèm quizzes/content).
// URL bài học theo cấu trúc mới: /{courseSlug}/{lessonSlug}.
export async function lessonEntriesByCourse(courseId: number, courseSlug: string): Promise<SitemapEntry[]> {
  type LessonItem = { slug?: string; updatedAt?: string; createdAt?: string };
  const res = await fetchJson<LessonItem[] | { data: LessonItem[] }>(`${apiUrl}/api/lessons?courseId=${courseId}&slim=1`);
  const now = new Date();
  return unwrapData<LessonItem>(res)
    .filter((l) => !!l.slug)
    .map((l) => ({ loc: `${SITE_URL}/${courseSlug}/${l.slug}`, lastmod: safeDate(l.updatedAt || l.createdAt || now) }));
}

export async function articleEntries(): Promise<SitemapEntry[]> {
  type ArticleItem = { slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string };
  const res = await fetchJson<ArticleItem[] | { data: ArticleItem[] }>(`${apiUrl}/api/articles?limit=500`);
  const now = new Date();
  return unwrapData<ArticleItem>(res)
    .filter((a) => !!a.slug)
    .map((a) => ({ loc: `${SITE_URL}/bai-viet/${a.slug}`, lastmod: safeDate(a.updatedAt || a.publishedAt || a.createdAt || now) }));
}

export function gameEntries(): SitemapEntry[] {
  return gamesData
    .filter((g) => g.status === 'ready')
    .map((g) => ({ loc: `${SITE_URL}/tro-choi/${g.slug}`, lastmod: safeDate('2026-06-24') }));
}

