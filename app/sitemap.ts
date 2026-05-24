import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`,                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/khoa-hoc`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/tro-choi`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/bai-viet`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/huong-dan`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cau-hoi-thuong-gap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/lien-he`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/chinh-sach-bao-mat`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/dieu-khoan`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // Blog posts from API
  type ArticleItem = { slug: string; updatedAt?: string; publishedAt?: string };
  const articlesRes = await fetchJson<ArticleItem[] | { data: ArticleItem[] }>(`${apiUrl}/api/articles?limit=200&isPublished=true`);
  const articles: ArticleItem[] = Array.isArray(articlesRes) ? articlesRes : (articlesRes as { data: ArticleItem[] })?.data ?? [];
  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/bai-viet/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : a.updatedAt ? new Date(a.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Courses from API
  type CourseItem = { slug: string; updatedAt?: string };
  const coursesRes = await fetchJson<CourseItem[] | { data: CourseItem[] }>(`${apiUrl}/courses?limit=200`);
  const courses: CourseItem[] = Array.isArray(coursesRes) ? coursesRes : (coursesRes as { data: CourseItem[] })?.data ?? [];
  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${baseUrl}/khoa-hoc/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Lessons from API
  type LessonItem = { slug: string; updatedAt?: string };
  const lessonsRes = await fetchJson<LessonItem[] | { data: LessonItem[] }>(`${apiUrl}/lessons?limit=500`);
  const lessons: LessonItem[] = Array.isArray(lessonsRes) ? lessonsRes : (lessonsRes as { data: LessonItem[] })?.data ?? [];
  const lessonPages: MetadataRoute.Sitemap = lessons
    .filter((l) => !!l.slug)
    .map((l) => ({
      url: `${baseUrl}/${l.slug}`,
      lastModified: l.updatedAt ? new Date(l.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

  return [...staticPages, ...articlePages, ...coursePages, ...lessonPages];
}
