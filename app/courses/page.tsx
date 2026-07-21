import CourseLibraryPage from '../components/edu/CourseLibraryPage';
import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

type CourseItem = { slug?: string; title?: string; description?: string; ageRange?: string };

// Lấy danh sách khóa học để dựng ItemList schema + danh sách crawlable (giống trang /tro-choi).
async function fetchCourses(): Promise<CourseItem[]> {
  try {
    const res = await fetch(`${API}/api/courses?limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json) ? json : (json.data ?? []);
    return (list as CourseItem[]).filter((c) => !!c.slug);
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Khóa học cho bé',
  description:
    'Khám phá thư viện khóa học cho bé với các nhóm nội dung về ngôn ngữ, toán học, tư duy và ngoại ngữ, được thiết kế trực quan, dễ tiếp cận và phù hợp theo độ tuổi.',
  keywords: [
    'khóa học cho bé',
    'bài học cho trẻ em',
    'học ngôn ngữ cho bé',
    'toán học cho bé',
    'tiếng Anh cho trẻ em',
    'học trực tuyến cho trẻ',
    'bé hay học',
  ],
  alternates: {
    canonical: '/khoa-hoc',
  },
  openGraph: {
    title: 'Khóa học cho bé | Bé Hay Học',
    description:
      'Thư viện khóa học trực quan, ngắn gọn và phù hợp với từng giai đoạn phát triển của bé.',
    url: `${SITE}/khoa-hoc`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Khóa học cho bé - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khóa học cho bé | Bé Hay Học',
    description: 'Khám phá các nhóm bài học phù hợp với nhu cầu phát triển của bé.',
    images: ['/og-home.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Khóa học cho bé | Bé Hay Học',
  description: 'Thư viện khóa học giáo dục cho bé 3-10 tuổi: ngôn ngữ, toán học, tư duy và tiếng Anh.',
  url: `${SITE}/khoa-hoc`,
  inLanguage: 'vi-VN',
  publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Khóa học', item: `${SITE}/khoa-hoc` },
  ],
};

export default async function Page() {
  const courses = await fetchCourses();

  const itemListSchema = courses.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Khóa học cho bé | Bé Hay Học',
    description: `${courses.length} khóa học giáo dục cho bé 3-10 tuổi`,
    url: `${SITE}/khoa-hoc`,
    numberOfItems: courses.length,
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      url: `${SITE}/khoa-hoc/${c.slug}`,
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <h1 className="sr-only">Khóa học cho bé 3–10 tuổi</h1>
      {/* Danh sách khóa học crawlable — hỗ trợ Google & AI crawler kể cả khi UI render phía client */}
      {courses.length > 0 && (
        <ul className="sr-only">
          {courses.map((c) => (
            <li key={c.slug}>
              <a href={`/khoa-hoc/${c.slug}`}>{c.title}</a>
              {c.description && <span> — {c.description}</span>}
            </li>
          ))}
        </ul>
      )}
      <CourseLibraryPage />
    </>
  );
}
