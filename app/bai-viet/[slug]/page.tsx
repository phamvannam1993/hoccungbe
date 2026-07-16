import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ArticleContent from '../../components/edu/ArticleContent';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  viewCount: number;
  authorName?: string;
}

const CATEGORIES = [
  { slug: 'kien-thuc', label: 'Kiến thức' },
  { slug: 'kinh-nghiem', label: 'Kinh nghiệm' },
  { slug: 'tin-tuc', label: 'Tin tức' },
  { slug: 'hoat-dong', label: 'Hoạt động' },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label]));

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRelated(category: string | undefined, slug: string): Promise<Article[]> {
  try {
    const url = category
      ? `${BASE_URL}/api/articles?category=${category}&limit=5`
      : `${BASE_URL}/api/articles?limit=5`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return ((json.data || []) as Article[]).filter((a) => a.slug !== slug).slice(0, 4);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Bài viết không tồn tại - Bé Hay Học' };
  const url = `${SITE}/bai-viet/${slug}`;
  const desc = article.excerpt || article.title;
  return {
    title: article.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: article.title, description: desc, url, type: 'article', siteName: 'Bé Hay Học', locale: 'vi_VN', images: article.thumbnailUrl ? [{ url: article.thumbnailUrl, width: 1200, height: 630, alt: article.title }] : [] },
    twitter: { card: 'summary_large_image', title: article.title, description: desc, images: article.thumbnailUrl ? [article.thumbnailUrl] : [] },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getArticle(slug),
    getArticle(slug).then((a) => a ? getRelated(a.category, slug) : [] as Article[]),
  ]);

  if (!article) {
    notFound();
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Bài viết không tìm thấy</h1>
        <Link href="/bai-viet" className="text-[#c0392b] hover:underline">Quay lại danh sách bài viết</Link>
      </div>
    );
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Bài viết', item: `${SITE}/bai-viet` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE}/bai-viet/${slug}` },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.thumbnailUrl,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.publishedAt || article.createdAt,
    author: { '@type': article.authorName ? 'Person' : 'Organization', name: article.authorName || 'Bé Hay Học' },
    publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    url: `${SITE}/bai-viet/${slug}`,
  };

  const pageUrl = `${SITE}/bai-viet/${slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
        {/* Breadcrumb */}
        <nav className="text-sm text-white/70 mb-6 flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          <span className="text-white/40">›</span>
          <Link href="/bai-viet" className="hover:text-white">Bài viết</Link>
          <span className="text-white/40">›</span>
          <span className="text-white line-clamp-1">{article.title}</span>
        </nav>

        <div className="flex gap-6 items-start min-w-0 overflow-x-hidden">
          {/* ── Left sidebar ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-6">
              <h3 className="text-sm font-bold text-[#c0392b] uppercase tracking-wide mb-4">Danh mục bài viết</h3>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/bai-viet?category=${cat.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        article.category === cat.slug
                          ? 'bg-[#c0392b]/10 text-[#c0392b] font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#c0392b]'
                      }`}
                    >
                      {cat.label}
                      <span className="text-gray-300">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related on sidebar */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 mt-10 sticky top-[220px]">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Có thể bạn sẽ thích</h3>
                <ul className="space-y-3">
                  {related.slice(0, 3).map((rel) => (
                    <li key={rel.id}>
                      <Link href={`/bai-viet/${rel.slug}`} className="flex gap-2 group">
                        {rel.thumbnailUrl ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image src={rel.thumbnailUrl} alt={rel.title} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-red-400 shrink-0" />
                        )}
                        <p className="text-xs text-gray-700 group-hover:text-[#c0392b] leading-snug line-clamp-3 transition-colors">{rel.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            <article className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              {/* Category badge */}
              {article.category && CATEGORY_LABEL[article.category] && (
                <Link href={`/bai-viet?category=${article.category}`}
                  className="inline-block mb-3 text-xs font-semibold px-3 py-1 rounded-full bg-[#c0392b]/10 text-[#c0392b] hover:bg-[#c0392b]/20 transition-colors">
                  {CATEGORY_LABEL[article.category]}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight mb-4">{article.title}</h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-6 pb-5 border-b border-gray-100">
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                {article.authorName && (
                  <span>· <span className="text-gray-600 font-medium">{article.authorName}</span></span>
                )}
                <span>· {article.viewCount.toLocaleString('vi-VN')} lượt xem</span>
              </div>

              {/* Thumbnail */}
              {article.thumbnailUrl && (
                <ArticleContent
                  html={`<img src="${article.thumbnailUrl}" alt="${article.title.replace(/"/g, '&quot;')}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;margin:0 0 24px 0;" />`}
                  className=""
                />
              )}

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-base text-gray-600 italic border-l-4 border-[#c0392b] pl-4 mb-6 leading-relaxed">{article.excerpt}</p>
              )}

              {/* HTML Content */}
              <style>{`
                .article-content {
                  overflow-x: hidden;
                  word-break: normal;
                  overflow-wrap: break-word;
                  hyphens: none;
                  -webkit-hyphens: none;
                  white-space: normal;
                }
                /* Đè mọi inline style của editor để text wrap đúng tại space */
                .article-content *,
                .article-content *::before,
                .article-content *::after {
                  max-width: 100% !important;
                  width: auto !important;
                  box-sizing: border-box;
                  word-break: normal !important;
                  overflow-wrap: break-word !important;
                  white-space: normal !important;
                  hyphens: none !important;
                  -webkit-hyphens: none !important;
                }
                /* Trừ pre/code — giữ khoảng trắng nhưng cho phép wrap */
                .article-content pre, .article-content code {
                  white-space: pre-wrap !important;
                  overflow-wrap: anywhere !important;
                }
                /* Bảng và ảnh không bị ép width auto */
                .article-content table { width: 100% !important; }
                .article-content img { width: auto !important; height: auto !important; }
                .article-content p { margin-bottom: 1rem; line-height: 1.75; }
                .article-content img { height: auto !important; width: auto !important; max-width: 100% !important; border-radius: 10px; margin: 12px auto; display: block; }
                .article-content .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; margin: 16px 0; }
                .article-content table { border-collapse: collapse !important; width: 100% !important; min-width: 0 !important; }
                .article-content thead tr { background: #f3f4f6; }
                .article-content th { border: 1px solid #e5e7eb !important; padding: 10px 14px !important; font-weight: 600; color: #374151; text-align: left; font-size: 14px; white-space: nowrap; }
                .article-content td { border: 1px solid #e5e7eb !important; padding: 10px 14px !important; vertical-align: middle; font-size: 14px; color: #374151; }
                .article-content td img { max-height: 120px !important; width: auto !important; margin: 4px auto; border-radius: 6px; }
                .article-content tr:nth-child(even) td { background-color: #fafafa; }
                .article-content tr:hover td { background-color: #f0fdf4; transition: background 0.15s; }
                .article-content iframe { width: 100% !important; max-width: 100% !important; aspect-ratio: 16/9; border-radius: 10px; }
                .article-content pre { overflow-x: auto; border-radius: 8px; white-space: pre-wrap; word-break: break-all; }
                .article-content code { word-break: break-all; white-space: pre-wrap; }
                .article-content blockquote { border-left: 4px solid #c0392b; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1rem 0; }
                .article-content a { color: #c0392b; text-decoration: underline; word-break: break-all; }
                .article-content h2 { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 2rem 0 0.75rem; }
                .article-content h3 { font-size: 1.1rem; font-weight: 600; color: #1f2937; margin: 1.5rem 0 0.5rem; }
                .article-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                .article-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                .article-content li { margin-bottom: 0.4rem; line-height: 1.7; }
              `}</style>
              <ArticleContent
                html={article.content}
                className="article-content prose prose-base max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-8 [&_h2]:mb-3
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1.5
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#c0392b]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500
                  [&_a]:text-[#c0392b] [&_a]:underline [&_a:hover]:text-[#a93226]
                  [&_strong]:text-gray-800
                  [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                  [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-4"
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-5 border-t border-gray-100">
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs hover:bg-gray-200 transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share row */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                <Link href="/bai-viet" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c0392b] transition-colors">
                  ← Quay lại bài viết
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 mr-1">Chia sẻ:</span>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity text-sm font-bold">f</a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity text-xs font-bold">X</a>
                  <a href={`https://zalo.me/share/url?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#0068ff] text-white flex items-center justify-center hover:opacity-90 transition-opacity text-xs font-bold">Z</a>
                </div>
              </div>
            </article>

            {/* Related articles below on mobile/tablet */}
            {related.length > 0 && (
              <section className="mt-6">
                <h2 className="text-base font-bold text-gray-700 mb-4 px-1">Có thể bạn sẽ thích</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {related.map((rel) => (
                    <Link key={rel.id} href={`/bai-viet/${rel.slug}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative w-full aspect-[4/3]">
                        {rel.thumbnailUrl
                          ? <Image src={rel.thumbnailUrl} alt={rel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                          : <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-red-400 flex items-center justify-center text-2xl">📝</div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-800 group-hover:text-[#c0392b] transition-colors line-clamp-2 leading-snug">{rel.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatDate(rel.publishedAt || rel.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* ── Right sidebar — share (fixed, 2xl only) ───────────────── */}
          <aside className="hidden 2xl:flex fixed right-6 top-48 flex-col items-center gap-3 z-10">
            <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest whitespace-nowrap mb-1">Share</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform font-bold shadow-md text-base">f</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform font-bold shadow-md text-sm">X</a>
            <a href={`https://zalo.me/share/url?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#0068ff] text-white flex items-center justify-center hover:scale-110 transition-transform font-bold shadow-md text-sm">Z</a>
            <a href="https://www.youtube.com/@behayhoc" target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.35 12.35 0 00-8.64 0A4.83 4.83 0 013.41 6.69 28.1 28.1 0 003 12a28.1 28.1 0 00.41 5.31 4.83 4.83 0 003.77 2.75 12.35 12.35 0 008.64 0 4.83 4.83 0 003.77-2.75A28.1 28.1 0 0021 12a28.1 28.1 0 00-.41-5.31zM9.75 15V9l5.25 3z"/></svg>
            </a>
          </aside>
        </div>
      </div>
    </>
  );
}
