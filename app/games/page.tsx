import Link from 'next/link';
import GamesView from '../components/edu/GamesView';
import { gamesData } from '../components/edu/data/gamesData';
import { publishableCategories } from '../lib/gameCategories';
import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi',
  description:
    'Khám phá kho trò chơi giáo dục cho bé 3-10 tuổi: game học chữ, toán vui, tiếng Anh, ghi nhớ, phản xạ và tư duy logic qua các hoạt động ngắn, trực quan.',
  keywords: [
    'trò chơi giáo dục cho bé',
    'kho trò chơi giáo dục',
    'game học tập cho trẻ em',
    'game học chữ cho bé',
    'trò chơi học toán cho bé',
    'trò chơi tiếng Anh cho bé',
    'trò chơi tư duy cho bé',
    'trò chơi phản xạ cho trẻ',
    'trò chơi ghi nhớ cho bé',
    'game giáo dục cho trẻ em',
    'bé hay học',
  ],
  alternates: {
    canonical: '/tro-choi',
  },
  openGraph: {
    title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi | Bé Hay Học',
    description:
      'Giúp bé học chữ, toán, tiếng Anh, ghi nhớ, phản xạ và tư duy logic qua các trò chơi giáo dục ngắn, vui, trực quan.',
    url: `${SITE}/tro-choi`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Kho trò chơi giáo dục cho bé 3-10 tuổi - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi | Bé Hay Học',
    description: 'Kho game học tập trực quan giúp bé học chữ, toán, tiếng Anh và rèn tư duy mỗi ngày.',
    images: ['/og-home.jpg'],
  },
};

const readyGames = gamesData.filter((g) => g.status === 'ready');

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Kho trò chơi giáo dục cho bé | Bé Hay Học',
  description: `${readyGames.length} trò chơi giáo dục cho bé 3-10 tuổi: học chữ, toán, tiếng Anh, ghi nhớ, phản xạ và tư duy.`,
  url: `${SITE}/tro-choi`,
  inLanguage: 'vi-VN',
  publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Trò chơi giáo dục', item: `${SITE}/tro-choi` },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Kho trò chơi giáo dục cho bé | Bé Hay Học',
  description: `${readyGames.length} trò chơi giáo dục cho bé 3-10 tuổi`,
  url: `${SITE}/tro-choi`,
  numberOfItems: readyGames.length,
  itemListElement: readyGames.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: g.title,
    url: `${SITE}/tro-choi/${g.slug}`,
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {/* GamesView (server component) đã SSR H1 + danh sách game crawlable → không cần khối sr-only lặp lại. */}
      <GamesView />

      {/*
        "Ai Là Triệu Phú Nhí" KHÔNG nằm trong gamesData vì nó không phải mini-game:
        có 3 chế độ, thang thưởng, bảng xếp hạng và phân tích năng lực — quy mô
        gần với /thi-tai hơn. Nhưng đây là nơi trẻ tìm trò chơi, nên phải có lối
        vào nổi bật ở đây.
      */}
      <section className="mx-auto max-w-4xl px-4 pb-2">
        <Link
          href="/trieu-phu-nhi"
          className="flex items-center gap-4 rounded-3xl p-4 text-white transition hover:-translate-y-1 sm:p-5"
          style={{
            background: 'radial-gradient(120% 100% at 50% 0%, #1e40af 0%, #10256e 55%, #071143 100%)',
            boxShadow: '0 10px 0 #050d33, 0 20px 34px rgba(7,17,67,.35)',
          }}
        >
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-4xl" aria-hidden>
            👑
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-widest text-[#FFD54A]">
              Sân chơi lớn
            </span>
            <span className="block text-lg font-black sm:text-xl">Ai Là Triệu Phú Nhí</span>
            <span className="mt-0.5 block text-xs font-bold text-white/70">
              Leo 15 mốc thưởng · Thử thách 60 giây · Thử thách Boss
            </span>
          </span>
          <span
            className="hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-black text-[#5a2d00] sm:block"
            style={{ background: 'linear-gradient(180deg,#FFE27A,#F0A400)', boxShadow: '0 4px 0 #B96A00' }}
          >
            Chơi ngay
          </span>
        </Link>
      </section>

      {/* Link sang các hub danh mục. Trang này liệt kê phẳng cả kho nên tự nó không
          nhắm được truy vấn hẹp ("game toán", "trò chơi cho bé 3 tuổi"); các hub bên
          dưới làm việc đó, và cần link từ đây để Google tìm ra chúng. */}
      <nav aria-label="Nhóm trò chơi" className="mx-auto max-w-4xl px-4 pb-12">
        <h2 className="text-lg font-bold text-slate-900">Chọn theo nhóm</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {publishableCategories().map((c) => (
            <li key={c.slug}>
              <Link
                href={`/tro-choi/${c.slug}`}
                className="inline-block rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
              >
                {c.heading}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
