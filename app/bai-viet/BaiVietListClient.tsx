'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: string;
  publishedAt?: string;
  createdAt: string;
  viewCount: number;
}

interface ArticlesResponse { data: Article[]; total: number; page: number; limit: number; }

const CATEGORIES = [
  { value: 'kien-thuc', label: 'Kiến thức' },
  { value: 'kinh-nghiem', label: 'Kinh nghiệm' },
  { value: 'tin-tuc', label: 'Tin tức' },
  { value: 'hoat-dong', label: 'Hoạt động' },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Chỉ hiển thị đoạn tóm tắt gọn (~160 ký tự) — tránh nhồi cả nội dung dài vào DOM danh sách.
function excerptShort(s?: string): string {
  const t = (s || '').replace(/\s+/g, ' ').trim();
  return t.length > 160 ? `${t.slice(0, 157)}…` : t;
}

function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/bai-viet/${article.slug}`}
        className="group flex flex-col overflow-hidden rounded-[26px] border-2 border-white bg-white shadow-[0_5px_0_rgba(148,163,184,.20)] transition hover:-translate-y-0.5 sm:flex-row">
        <div className="relative shrink-0 w-full sm:w-80 h-52 sm:h-auto">
          {article.thumbnailUrl
            ? <Image src={article.thumbnailUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
            : <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-5xl">📝</div>
          }
          {article.category && CATEGORY_LABEL[article.category] && (
            <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-black text-white shadow">
              {CATEGORY_LABEL[article.category]}
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col justify-center flex-1">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-violet-700 transition-colors leading-snug mb-3 line-clamp-3">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">{excerptShort(article.excerpt)}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            <span>·</span>
            <span>{article.viewCount.toLocaleString('vi-VN')} lượt xem</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/bai-viet/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border-2 border-white bg-white shadow-[0_5px_0_rgba(148,163,184,.20)] transition hover:-translate-y-0.5">
      <div className="relative w-full h-44">
        {article.thumbnailUrl
          ? <Image src={article.thumbnailUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
          : <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-3xl">📝</div>
        }
        {article.category && CATEGORY_LABEL[article.category] && (
          <span className="absolute left-2 top-2 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
            {CATEGORY_LABEL[article.category]}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-bold text-gray-800 group-hover:text-violet-700 transition-colors line-clamp-2 leading-snug text-sm mb-1.5 flex-1">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{excerptShort(article.excerpt)}</p>
        )}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-50">
          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          <span>·</span>
          <span>{article.viewCount.toLocaleString('vi-VN')} lượt xem</span>
        </div>
      </div>
    </Link>
  );
}

function ArticlesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 10;

  const fetchArticles = useCallback(async (cat: string, pg: number, append: boolean) => {
    if (!append) setLoading(true); else setLoadingMore(true);
    try {
      const p = new URLSearchParams({ page: String(pg), limit: String(limit), sortBy: 'createdAt', sortOrder: 'desc' });
      if (cat) p.set('category', cat);
      const res = await fetch(`${BASE_URL}/api/articles?${p}`);
      const json: ArticlesResponse = await res.json();
      setArticles((prev) => append ? [...prev, ...json.data] : json.data);
      setTotal(json.total);
    } catch { /* silent */ } finally {
      setLoading(false); setLoadingMore(false);
    }
  }, []);

  useEffect(() => { setPage(1); fetchArticles(categoryParam, 1, false); }, [categoryParam, fetchArticles]);

  const handleLoadMore = () => { const n = page + 1; setPage(n); fetchArticles(categoryParam, n, true); };
  const setCategory = (cat: string) => router.push(cat ? `/bai-viet?category=${cat}` : '/bai-viet');

  const hasMore = articles.length < total;
  const [featured, ...rest] = articles;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">Trang chủ</Link>
        <span className="text-slate-300">›</span>
        <span className="font-medium text-slate-800">Bài viết</span>
        {categoryParam && (
          <><span className="text-slate-300">›</span>
          <span className="text-slate-700">{CATEGORY_LABEL[categoryParam] || categoryParam}</span></>
        )}
      </nav>

      {/* Đầu trang: thẻ nền chuyển sắc.
          Trước đây là chữ TRẮNG đặt thẳng lên nền trang — hồi nền site còn màu
          teal thì đọc được, giờ nền sáng nên chữ trắng gần như mất hút. */}
      <header className="mb-5 overflow-hidden rounded-[28px] border-2 border-white bg-gradient-to-br from-amber-50 via-rose-50 to-violet-50 p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white text-3xl shadow-sm sm:h-20 sm:w-20 sm:text-4xl" aria-hidden>
            📖
          </span>
          <div className="min-w-0">
            <h1 className="kid-display text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
              Góc phụ huynh
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-500 sm:text-base">
              Kinh nghiệm nuôi dạy và học cùng con
            </p>
          </div>
        </div>
      </header>

      <div className="flex gap-7 items-start">
        {/* ── Sidebar ───────────────────────────────────── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-6 rounded-[26px] border-2 border-white bg-white p-4 shadow-[0_5px_0_rgba(148,163,184,.20)]">
            <h3 className="mb-3 text-[11px] font-black uppercase tracking-wide text-slate-400">Danh mục bài viết</h3>
            <ul className="space-y-0.5">
              <li>
                <button onClick={() => setCategory('')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    !categoryParam ? 'bg-violet-100 font-black text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-violet-700'
                  }`}>
                  Tất cả <span className="text-gray-300">›</span>
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <button onClick={() => setCategory(cat.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryParam === cat.value ? 'bg-violet-100 font-black text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-violet-700'
                    }`}>
                    {cat.label} <span className="text-gray-300">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Mobile category tabs */}
          <div className="flex gap-2 flex-wrap mb-5 lg:hidden">
            {[{ value: '', label: 'Tất cả' }, ...CATEGORIES].map((cat) => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  categoryParam === cat.value ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent" />
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-[26px] border-2 border-white bg-white p-16 text-center text-slate-400 shadow-[0_5px_0_rgba(148,163,184,.20)]">
              <div className="text-4xl mb-3">📭</div>
              <p>Chưa có bài viết nào.</p>
            </div>
          ) : (
            <>
              {/* Featured first article */}
              {featured && (
                <div className="mb-5">
                  <ArticleCard article={featured} featured />
                </div>
              )}

              {/* Grid of rest */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {/* Load more */}
              {hasMore && (
                <div className="text-center mt-4">
                  <button onClick={handleLoadMore} disabled={loadingMore}
                    className="rounded-full bg-violet-600 px-8 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:opacity-60">
                    {loadingMore ? 'Đang tải...' : 'Xem thêm bài viết'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function BaiVietPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-500 border-t-transparent" />
      </div>
    }>
      <ArticlesContent />
    </Suspense>
  );
}
