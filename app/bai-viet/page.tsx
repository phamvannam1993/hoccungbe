import BaiVietListClient from './BaiVietListClient';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  createdAt: string;
}

async function fetchArticles(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API}/api/articles?limit=30`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : json.data) ?? [];
  } catch {
    return [];
  }
}

// Trang DANH SÁCH bài viết: JSON-LD Blog + danh sách crawlable chỉ đặt ở đây,
// KHÔNG đặt trong layout (tránh lọt sang trang bài viết chi tiết).
export default async function BaiVietPage() {
  const articles = await fetchArticles();

  const blogLd = {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* H1 crawlable render phía server (client dùng useSearchParams nên nội dung không có sẵn trong SSR). */}
      <h1 className="sr-only">Góc phụ huynh – Bài viết kinh nghiệm nuôi dạy và học cùng con</h1>

      <BaiVietListClient />

      {/* SSR danh sách bài — crawlable, ẩn thị giác. Đặt sau H1 (trong client) để đúng thứ tự heading. */}
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
    </>
  );
}
