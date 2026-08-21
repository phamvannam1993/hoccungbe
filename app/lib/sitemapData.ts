import { SITE_URL, safeDate } from './seo';
import { gamesData } from '../components/edu/data/gamesData';
import { parseExamDbSlug } from './examNav';
import { getCourseTopics, topicLastmod } from './topicSeo';
import { publishableCategories } from './gameCategories';
import { publishableVocabTopics } from './vocab';

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
  ['/tu-vung-tieng-anh', '2026-08-18'],
  ['/bang-chu-cai-tieng-anh', '2026-08-21'],
  ['/phonics-tieng-anh', '2026-08-21'],
  ['/mau-cau-tieng-anh', '2026-08-21'],
  ['/sight-words-tieng-anh', '2026-08-21'],
  ['/hoi-thoai-tieng-anh', '2026-08-21'],
  ['/bai-hat-tieng-anh', '2026-08-21'],
  ['/ngu-phap-tieng-anh', '2026-08-21'],
  ['/hoc-doc-tieng-viet', '2026-08-21'],
  ['/cong-cu', '2026-08-10'],
  ['/cong-cu/tao-bai-tap-cong-tru', '2026-08-10'],
  ['/cong-cu/chuyen-van-ban-thanh-giong-noi', '2026-06-24'],
  ['/cong-cu/chuyen-giong-noi-thanh-van-ban', '2026-06-24'],
  ['/bai-tap', '2026-08-10'],
  ['/phieu-bai-tap', '2026-08-19'],
  ['/lop-1', '2026-08-19'],
  ['/lop-2', '2026-08-19'],
  ['/lop-3', '2026-08-19'],
  ['/lop-4', '2026-08-19'],
  ['/lop-5', '2026-08-19'],
  ['/bang-cuu-chuong', '2026-08-19'],
  ['/bang-chu-cai', '2026-08-19'],
  ['/luyen-viet-chu', '2026-08-19'],
  ['/toan-tu-duy', '2026-08-20'],
  ['/toan-tu-duy-lop-1', '2026-08-20'],
  ['/toan-tu-duy-lop-2', '2026-08-20'],
  ['/toan-tu-duy-lop-3', '2026-08-20'],
  ['/toan-tu-duy-lop-4', '2026-08-20'],
  ['/toan-tu-duy-lop-5', '2026-08-20'],
  ['/so-do-trang', '2026-08-20'],
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
  const base = STATIC_PATHS.map(([path, date]) => ({ loc: `${SITE_URL}${path}`, lastmod: safeDate(date) }));
  // Trang chủ đề từ vựng tiếng Anh (dữ liệu tĩnh trong app/lib/vocab.ts).
  const vocab = publishableVocabTopics().map((t) => ({
    loc: `${SITE_URL}/tu-vung-tieng-anh/${t.slug}`,
    lastmod: safeDate('2026-08-18'),
  }));
  return [...base, ...vocab];
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

// Phiếu bài tập (in/PDF) của MỘT khóa. Chỉ submit bản 'ca-bai' (phiếu đầy đủ): 3 mức
// con (de/trung-binh/nang-cao) đã canonical về 'ca-bai' nên KHÔNG đưa vào sitemap để
// tránh loãng index (~1000 URL gần trùng). Thêm hub phiếu theo khoá /phieu-bai-tap/lop/{slug}.
// Chỉ lấy bài ĐÃ có quiz (quizCount > 0) để tránh URL phiếu 404 (trang phiếu notFound
// khi bài chưa có câu hỏi). API cũ chưa trả quizCount → giữ nguyên (không loại) để không mất URL.
export async function worksheetEntriesByCourse(courseId: number, courseSlug: string): Promise<SitemapEntry[]> {
  type LessonItem = { slug?: string; updatedAt?: string; createdAt?: string; quizCount?: number };
  const res = await fetchJson<LessonItem[] | { data: LessonItem[] }>(`${apiUrl}/api/lessons?courseId=${courseId}&slim=1`);
  const now = new Date();
  const lessonEntries: SitemapEntry[] = [];
  for (const l of unwrapData<LessonItem>(res)) {
    if (!l.slug) continue;
    if (l.quizCount != null && l.quizCount <= 0) continue; // bài chưa có quiz → bỏ
    const lastmod = safeDate(l.updatedAt || l.createdAt || now);
    lessonEntries.push({ loc: `${SITE_URL}/phieu-bai-tap/${l.slug}/ca-bai`, lastmod });
  }
  // Hub lastmod = phiếu mới nhất (ổn định, tự cập nhật) — KHÔNG dùng new Date() mỗi request (churn).
  const hubMod = lessonEntries.reduce((m, e) => (e.lastmod > m ? e.lastmod : m), safeDate('2026-08-19'));
  return [{ loc: `${SITE_URL}/phieu-bai-tap/lop/${courseSlug}`, lastmod: hubMod }, ...lessonEntries];
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
  type ArticleItem = { slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string; isPublished?: boolean; status?: string };
  const res = await fetchJson<ArticleItem[] | { data: ArticleItem[] }>(`${apiUrl}/api/articles?limit=500`);
  const now = new Date();
  return unwrapData<ArticleItem>(res)
    // Chỉ bài ĐÃ xuất bản (loại nháp) — tránh submit URL 404/mỏng. Nhất quán courseEntries.
    .filter((a) => !!a.slug && a.isPublished !== false && a.status !== 'draft')
    .map((a) => ({ loc: `${SITE_URL}/bai-viet/${a.slug}`, lastmod: safeDate(a.updatedAt || a.publishedAt || a.createdAt || now) }));
}

// Đề thi theo URL lồng: trang tổng hợp cụm + từng đề (chỉ đề thuộc bộ URL lồng
// mới có slug parse được → tự bỏ qua đề cũ). Trang kết quả/làm lại không có URL riêng.
export async function examEntries(): Promise<SitemapEntry[]> {
  type ExamItem = { slug?: string; grade?: number; updatedAt?: string; createdAt?: string };
  let res: ExamItem[] | { data: ExamItem[] } | null = null;
  try {
    const r = await fetch(`${apiUrl}/api/exams`, { cache: 'no-store' });
    if (r.ok) res = await r.json();
  } catch {
    res = null;
  }
  const now = new Date();
  const entries: SitemapEntry[] = [];
  const seenAgg = new Set<string>();
  const grades = new Set<number>();
  for (const e of unwrapData<ExamItem>(res)) {
    if (typeof e.grade === 'number' && e.grade >= 1 && e.grade <= 5) grades.add(e.grade);
    if (!e.slug) continue;
    const p = parseExamDbSlug(e.slug);
    if (!p) continue;
    const lastmod = safeDate(e.updatedAt || e.createdAt || now);
    // Trang tổng hợp cụm (1 lần / course+group)
    const aggPath = `/${p.courseSlug}/${p.groupSeg}`;
    if (!seenAgg.has(aggPath)) {
      seenAgg.add(aggPath);
      entries.push({ loc: `${SITE_URL}${aggPath}`, lastmod });
    }
    // Trang đề chi tiết
    entries.push({ loc: `${SITE_URL}${aggPath}/de-${p.n}`, lastmod });
  }
  // Hub đề thi theo lớp /de-thi-lop-{g} — chỉ lớp THỰC SỰ có đề (trang notFound nếu rỗng).
  for (const g of [...grades].sort()) {
    entries.push({ loc: `${SITE_URL}/de-thi-lop-${g}`, lastmod: safeDate('2026-08-19') });
  }
  return entries;
}

// Cụm bài tập theo chủ đề: /bai-tap/{courseSlug} + /bai-tap/{courseSlug}/{topicSlug}.
// Trang chủ đề rỗng câu hỏi sẽ notFound() → chỉ đưa vào sitemap chủ đề CÓ bài học,
// đúng bộ lọc mà getCourseTopics() đã áp dụng.
export async function practiceEntriesByCourse(courseSlug: string): Promise<SitemapEntry[]> {
  const data = await getCourseTopics(courseSlug);
  if (!data || data.topics.length === 0) return [];
  const topicEntries: SitemapEntry[] = data.topics.map((topic) => ({
    loc: `${SITE_URL}/bai-tap/${courseSlug}/${topic.slug}`,
    lastmod: topicLastmod(topic),
  }));
  // Hub lastmod = chủ đề mới nhất (ổn định) — KHÔNG dùng new Date() mỗi request (churn).
  const hubMod = topicEntries.reduce((m, e) => (e.lastmod > m ? e.lastmod : m), safeDate('2026-08-19'));
  return [{ loc: `${SITE_URL}/bai-tap/${courseSlug}`, lastmod: hubMod }, ...topicEntries];
}

export function gameEntries(): SitemapEntry[] {
  return [
    // Hub danh mục trước, rồi tới từng trò chơi.
    ...publishableCategories().map((c) => ({
      loc: `${SITE_URL}/tro-choi/${c.slug}`,
      lastmod: safeDate('2026-08-10'),
    })),
    ...gamesData
      .filter((g) => g.status === 'ready')
      .map((g) => ({ loc: `${SITE_URL}/tro-choi/${g.slug}`, lastmod: safeDate('2026-06-24') })),
  ];
}

