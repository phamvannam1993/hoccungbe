import HomePage from './components/edu/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',

  description:
    'Bé Hay Học giúp trẻ 3-10 tuổi học chữ, toán, tiếng Anh và tư duy qua trò chơi giáo dục ngắn, trực quan; phụ huynh dễ theo dõi tiến độ mỗi ngày.',

  keywords: [
    'Bé Hay Học',
    'Bé Hay Học',
    'nền tảng học tập cho bé',
    'trò chơi giáo dục cho bé',
    'trò chơi giáo dục cho trẻ em',
    'học online cho bé',
    'học chữ cái cho bé',
    'học toán vui cho bé',
    'học tiếng Anh cho bé',
    'trò chơi tư duy cho trẻ em',
    'bài học ngắn cho trẻ em',
    'phụ huynh theo dõi tiến độ học tập',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'Bé Hay Học - Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    description:
      'Giúp bé học chữ, toán, tiếng Anh và tư duy qua trò chơi giáo dục ngắn, vui, trực quan; phụ huynh dễ dàng theo dõi tiến độ học tập mỗi ngày.',
    url: '/',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Bé Hay Học - Nền tảng học tập và trò chơi giáo dục cho bé 3-10 tuổi',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Bé Hay Học - Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    description:
      'Trò chơi giáo dục, bài học ngắn và báo cáo tiến độ rõ ràng giúp bé học vui mỗi ngày.',
    images: ['/og-home.jpg'],
  },
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export default function Page() {
  // Single WebSite schema with correct SearchAction URL (C5, C6)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bé Hay Học',
    url: SITE,
    inLanguage: 'vi-VN',
    description: 'Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/khoa-hoc?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <HomePage />
    </>
  );
}
