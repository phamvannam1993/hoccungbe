import type { MetadataRoute } from 'next';
import { gamesData } from './components/edu/data/gamesData';
import { SITE_URL, safeDate } from './lib/seo';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

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

function page(path: string, lastModified: string | Date, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: safeDate(lastModified),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    page('/', '2026-06-24', 'weekly', 1.0),
    page('/khoa-hoc', '2026-06-24', 'weekly', 0.9),
    page('/tro-choi', '2026-06-24', 'weekly', 0.9),
    page('/cong-cu/chuyen-van-ban-thanh-giong-noi', '2026-06-24', 'weekly', 0.85),
    page('/cong-cu/chuyen-giong-noi-thanh-van-ban', '2026-06-24', 'weekly', 0.8),
    page('/de-thi', '2026-06-24', 'weekly', 0.75),
    page('/tai-lieu', '2026-06-24', 'weekly', 0.7),
    page('/bai-viet', '2026-06-24', 'weekly', 0.7),
    page('/goc-phu-huynh', '2026-06-24', 'monthly', 0.6),
    page('/goc-phu-huynh/giup-be-tap-trung-khi-hoc', '2026-06-24', 'monthly', 0.55),
    page('/goc-phu-huynh/thoi-luong-hoc-phu-hop-cho-tre', '2026-06-24', 'monthly', 0.55),
    page('/goc-phu-huynh/goc-hoc-tap-cho-be', '2026-06-24', 'monthly', 0.55),
    page('/goc-phu-huynh/sai-lam-day-con-hoc-tai-nha', '2026-06-24', 'monthly', 0.55),
    page('/cau-hoi-thuong-gap', '2026-06-01', 'monthly', 0.55),
    page('/huong-dan', '2026-06-01', 'monthly', 0.55),
    page('/lien-he', '2026-06-01', 'monthly', 0.45),
    page('/ho-tro', '2026-06-01', 'monthly', 0.45),
    page('/chinh-sach-bao-mat', '2026-04-01', 'yearly', 0.25),
    page('/dieu-khoan', '2026-04-01', 'yearly', 0.25),
  ];

  type ArticleItem = { slug?: string; updatedAt?: string; publishedAt?: string; createdAt?: string };
  const articlesRes = await fetchJson<ArticleItem[] | { data: ArticleItem[] }>(`${apiUrl}/api/articles?limit=500`);
  const articles = unwrapData<ArticleItem>(articlesRes);
  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => !!a.slug)
    .map((a) => ({
      url: `${SITE_URL}/bai-viet/${a.slug}`,
      lastModified: safeDate(a.updatedAt || a.publishedAt || a.createdAt || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  type CourseItem = { slug?: string; updatedAt?: string; createdAt?: string };
  const coursesRes = await fetchJson<CourseItem[] | { data: CourseItem[] }>(`${apiUrl}/api/courses?limit=500`);
  const courses = unwrapData<CourseItem>(coursesRes);
  const coursePages: MetadataRoute.Sitemap = courses
    .filter((c) => !!c.slug)
    .map((c) => ({
      url: `${SITE_URL}/khoa-hoc/${c.slug}`,
      lastModified: safeDate(c.updatedAt || c.createdAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

  type LessonItem = { slug?: string; updatedAt?: string; createdAt?: string };
  const lessonsRes = await fetchJson<LessonItem[] | { data: LessonItem[] }>(`${apiUrl}/api/lessons?limit=1000`);
  const lessons = unwrapData<LessonItem>(lessonsRes);
  const lessonPages: MetadataRoute.Sitemap = lessons
    .filter((l) => !!l.slug)
    .map((l) => ({
      url: `${SITE_URL}/${l.slug}`,
      lastModified: safeDate(l.updatedAt || l.createdAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

  const gamePages: MetadataRoute.Sitemap = gamesData
    .filter((g) => g.status === 'ready')
    .map((g) => ({
      url: `${SITE_URL}/tro-choi/${g.slug}`,
      lastModified: safeDate('2026-06-24'),
      changeFrequency: 'monthly' as const,
      priority: g.isFeatured ? 0.75 : 0.65,
    }));

  return [...staticPages, ...coursePages, ...lessonPages, ...gamePages, ...articlePages];
}
