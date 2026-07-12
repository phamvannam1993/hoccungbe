import GamesView from '../components/edu/GamesView';
import { gamesData } from '../components/edu/data/gamesData';
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
    images: [{ url: '/og-games.jpg', width: 1200, height: 630, alt: 'Kho trò chơi giáo dục cho bé 3-10 tuổi - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi | Bé Hay Học',
    description: 'Kho game học tập trực quan giúp bé học chữ, toán, tiếng Anh và rèn tư duy mỗi ngày.',
    images: ['/og-games.jpg'],
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
      {/* SSR game list — crawlable by Google and AI crawlers */}
      <div className="sr-only">
        <h1>Kho trò chơi giáo dục cho bé 3–10 tuổi</h1>
        <p>{readyGames.length} trò chơi giáo dục miễn phí giúp bé học chữ, toán, tiếng Anh và tư duy logic qua hoạt động ngắn, trực quan.</p>
        <ul>
          {readyGames.map((g) => (
            <li key={g.slug}>
              <a href={`/tro-choi/${g.slug}`}>{g.title}</a>
              {g.shortDescription && <span> — {g.shortDescription}</span>}
            </li>
          ))}
        </ul>
      </div>
      <GamesView />
    </>
  );
}
