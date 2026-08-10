import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  findCategory,
  gamesInCategory,
  publishableCategories,
  type GameCategory,
} from '../../lib/gameCategories';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';

// Hub trò chơi theo danh mục: /tro-choi/toan, /tro-choi/cho-be-3-tuoi, …
//
// LƯU Ý ROUTING: /tro-choi/{slug-game} được phục vụ bằng rewrite sang /games/{en}
// khai báo trong next.config.ts. Rewrite dạng mảng là `afterFiles`, được kiểm tra
// TRƯỚC dynamic route, nên 18 trang game vẫn thắng route này. Chỉ những segment
// KHÔNG phải slug game mới rơi xuống đây — và danh sách danh mục là whitelist cố
// định, nên không có chuyện một slug lạ dựng ra trang rác.

export const revalidate = 86400;

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return publishableCategories().map((c) => ({ category: c.slug }));
}

/** Danh mục tồn tại nhưng không đạt ngưỡng chất lượng → coi như không có. */
function resolve(slug: string): GameCategory | null {
  const c = findCategory(slug);
  if (!c) return null;
  return publishableCategories().some((p) => p.slug === c.slug) ? c : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = resolve(category);
  if (!c) return { title: 'Trò chơi', robots: { index: false, follow: false } };

  const url = canonical(`/tro-choi/${c.slug}`);
  const image = `${SITE_URL}/og-home.jpg`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${c.title} | ${SITE_NAME}`,
      description: c.description,
      url,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      images: [{ url: image, width: 1200, height: 630, alt: c.title }],
    },
    twitter: { card: 'summary_large_image', title: c.title, description: c.description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { category } = await params;
  const c = resolve(category);
  if (!c) notFound();

  const games = gamesInCategory(c);
  const others = publishableCategories().filter((x) => x.slug !== c.slug);
  const path = `/tro-choi/${c.slug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Trò chơi', item: `${SITE_URL}/tro-choi` },
      { '@type': 'ListItem', position: 3, name: c.heading, item: `${SITE_URL}${path}` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.heading,
    numberOfItems: games.length,
    itemListElement: games.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `${SITE_URL}/tro-choi/${g.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/tro-choi" className="hover:text-sky-700">Trò chơi</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">{c.heading}</li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{c.heading}</h1>
        <p className="mt-3 text-slate-600">{c.intro}</p>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {games.length} trò chơi · miễn phí · chơi ngay trên trình duyệt, không cần cài đặt
        </p>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/tro-choi/${g.slug}`}
              className="flex h-full flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:shadow"
            >
              <span className="text-2xl" aria-hidden>{g.emoji}</span>
              <span className="mt-1 font-bold text-slate-900">{g.title}</span>
              <span className="mt-1 text-sm text-slate-600">{g.shortDescription}</span>
              <span className="mt-auto pt-3 text-xs font-medium text-slate-500">
                {g.age} · {g.time} · {g.difficulty}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Nhóm trò chơi khác</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/tro-choi/${o.slug}`} className="text-sky-700 hover:underline">
                {o.heading}
              </Link>
            </li>
          ))}
          <li><Link href="/tro-choi" className="text-sky-700 hover:underline">Tất cả trò chơi</Link></li>
          <li><Link href="/bai-tap" className="text-sky-700 hover:underline">Bài tập theo chủ đề</Link></li>
        </ul>
      </section>
    </div>
  );
}
