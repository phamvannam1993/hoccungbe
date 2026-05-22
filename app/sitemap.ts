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
    { url: `${baseUrl}/`,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/khoa-hoc`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/courses`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/games`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/blog`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/pricing`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/how-it-works`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`,lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // Blog posts
  const blogSlugs = [
    'giup-be-tap-trung-khi-hoc',
    'goc-hoc-tap-cho-be',
    'sai-lam-day-con-hoc-tai-nha',
    'thoi-luong-hoc-phu-hop-cho-tre',
  ];
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Courses from API
  type CourseItem = { slug: string; updatedAt?: string };
  const coursesRes = await fetchJson<CourseItem[] | { data: CourseItem[] }>(`${apiUrl}/courses?limit=200`);
  const courses: CourseItem[] = Array.isArray(coursesRes) ? coursesRes : (coursesRes as { data: CourseItem[] })?.data ?? [];
  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${baseUrl}/courses/${c.slug}`,
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

  return [...staticPages, ...blogPages, ...coursePages, ...lessonPages];
}
