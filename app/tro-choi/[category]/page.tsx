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

  // Bảng màu xoay vòng cho thẻ game: hai thẻ cạnh nhau không trùng màu, và màu
  // gắn theo vị trí nên mỗi lần dựng lại vẫn ra đúng màu đó.
  const MAU = [
    { nen: 'from-rose-50 to-pink-50', vien: '#fbcfe8', chu: '#db2777' },
    { nen: 'from-amber-50 to-orange-50', vien: '#fde68a', chu: '#d97706' },
    { nen: 'from-emerald-50 to-teal-50', vien: '#a7f3d0', chu: '#059669' },
    { nen: 'from-sky-50 to-blue-50', vien: '#bfdbfe', chu: '#2563eb' },
    { nen: 'from-violet-50 to-purple-50', vien: '#ddd6fe', chu: '#7c3aed' },
    { nen: 'from-lime-50 to-green-50', vien: '#d9f99d', chu: '#65a30d' },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6">
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

      {/* Đầu trang: thẻ nền chuyển sắc thay cho tiêu đề chữ trơn — cùng ngôn ngữ
          thị giác với trang chủ và các trang game khác. */}
      <header className="mt-3 overflow-hidden rounded-[28px] border-2 border-white bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white text-4xl shadow-sm sm:h-20 sm:w-20 sm:text-5xl" aria-hidden>
            {games[0]?.emoji ?? '🎮'}
          </span>
          <div className="min-w-0">
            <h1 className="kid-display text-2xl font-black text-slate-900 sm:text-3xl">{c.heading}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{c.intro}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[`${games.length} trò chơi`, 'Miễn phí', 'Chơi ngay trên trình duyệt', 'Không cần cài đặt'].map((t) => (
                <li key={t} className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-black text-slate-500 sm:text-xs">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((g, i) => {
          const m = MAU[i % MAU.length];
          return (
            <li key={g.slug}>
              <Link
                href={`/tro-choi/${g.slug}`}
                className={`group flex h-full flex-col rounded-[26px] bg-gradient-to-br ${m.nen} p-4 transition hover:-translate-y-0.5`}
                style={{ border: `2px solid ${m.vien}`, boxShadow: `0 5px 0 ${m.vien}` }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/85 text-3xl shadow-sm" aria-hidden>
                  {g.emoji}
                </span>
                <span className="kid-display mt-3 block font-black text-slate-900" style={{ color: m.chu }}>
                  {g.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">{g.shortDescription}</span>
                <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                  {[g.age, g.time, g.difficulty].map((t) => (
                    <span key={t} className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-black text-slate-500">
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto grid h-7 w-7 place-items-center rounded-full text-sm text-white transition group-hover:translate-x-0.5"
                    style={{ background: m.chu }} aria-hidden>›</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-6 rounded-[26px] border-2 border-white bg-white p-5 shadow-sm">
        <h2 className="kid-display text-lg font-black text-slate-900">⭐ Nhóm trò chơi khác</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/tro-choi/${o.slug}`}
                className="inline-block rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-100 hover:text-sky-700">
                {o.heading}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/tro-choi"
              className="inline-block rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700">
              Tất cả trò chơi
            </Link>
          </li>
          <li>
            <Link href="/bai-tap"
              className="inline-block rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700">
              Bài tập theo chủ đề
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
