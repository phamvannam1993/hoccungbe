import type { Metadata } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Góc phụ huynh - Kiến thức nuôi dạy con | Bé Hay Học',
  description: 'Bài viết kiến thức, kinh nghiệm nuôi dạy con, tin tức giáo dục trẻ em và các hoạt động học tập cho bé từ đội ngũ Bé Hay Học.',
  keywords: [
    'nuôi dạy con',
    'kinh nghiệm dạy trẻ',
    'giáo dục trẻ em tại nhà',
    'bài viết cho phụ huynh',
    'kiến thức phát triển trẻ',
    'bé hay học blog',
  ],
  alternates: { canonical: `${SITE}/bai-viet` },
  openGraph: {
    title: 'Góc phụ huynh | Bé Hay Học',
    description: 'Kiến thức, kinh nghiệm và tin tức giáo dục trẻ em từ Bé Hay Học.',
    url: `${SITE}/bai-viet`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Góc phụ huynh - Bé Hay Học' }],
  },
};

interface ArticleItem { id: number; title: string; slug: string; excerpt?: string; publishedAt?: string; createdAt: string; }

async function fetchArticles(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API}/articles?limit=30`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : json.data) ?? [];
  } catch { return []; }
}

export default async function BaiVietLayout({ children }: { children: React.ReactNode }) {
  const articles = await fetchArticles();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Góc phụ huynh | Bé Hay Học',
    description: 'Kiến thức, kinh nghiệm nuôi dạy con và tin tức giáo dục trẻ em.',
    url: `${SITE}/bai-viet`,
    inLanguage: 'vi-VN',
    publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    blogPost: articles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${SITE}/bai-viet/${a.slug}`,
      datePublished: a.publishedAt || a.createdAt,
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Bài viết', item: `${SITE}/bai-viet` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* SSR article list — crawlable by Google, hidden visually */}
      {articles.length > 0 && (
        <div className="sr-only" aria-hidden="true">
          <h2>Bài viết mới nhất</h2>
          <ul>
            {articles.map((a) => (
              <li key={a.id}>
                <a href={`/bai-viet/${a.slug}`}>{a.title}</a>
                {a.excerpt && <p>{a.excerpt}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </>
  );
}
