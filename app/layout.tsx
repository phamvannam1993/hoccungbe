import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Nunito, Baloo_2 } from 'next/font/google';
import SiteShell from './components/SiteShell';

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

const baloo2 = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo2',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://behayhoc.com'),

  title: {
    default:
      'Bé Hay Học - Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    template: '%s | Bé Hay Học',
  },

  description:
    'Bé Hay Học giúp trẻ 3-10 tuổi học chữ, toán, tiếng Anh và tư duy qua trò chơi giáo dục ngắn, trực quan; phụ huynh dễ theo dõi tiến độ mỗi ngày.',

  keywords: [
    'Bé Hay Học',
    'Bé Hay Học',
    'nền tảng học tập cho bé',
    'trò chơi giáo dục cho bé',
    'học online cho trẻ em',
    'khóa học cho bé 3-10 tuổi',
    'học chữ cái cho bé',
    'học toán vui cho bé',
    'học tiếng Anh cho bé',
    'trò chơi tư duy cho trẻ em',
    'ứng dụng học tập cho trẻ em',
    'website học tập cho bé tại nhà',
  ],

  authors: [{ name: 'Bé Hay Học' }],
  creator: 'Bé Hay Học',
  publisher: 'Bé Hay Học',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.ico'],
  },

  openGraph: {
    title:
      'Bé Hay Học - Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    description:
      'Giúp bé học chữ, toán, tiếng Anh và tư duy qua trò chơi giáo dục ngắn, vui, trực quan; phụ huynh dễ dàng theo dõi tiến độ học tập mỗi ngày.',
    url: 'https://behayhoc.com',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bé Hay Học - Nền tảng học tập và trò chơi giáo dục cho bé 3-10 tuổi',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title:
      'Bé Hay Học - Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    description:
      'Trò chơi giáo dục, bài học ngắn và báo cáo tiến độ rõ ràng giúp bé học vui mỗi ngày.',
    images: ['/og-image.jpg'],
  },

  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bé Hay Học',
    alternateName: 'Bé Hay Học',
    url: 'https://behayhoc.com',
    inLanguage: 'vi-VN',
    description:
      'Nền tảng học tập và trò chơi giáo dục cho bé 3-10 tuổi, giúp trẻ học chữ, toán, tiếng Anh và tư duy qua các hoạt động ngắn, trực quan.',
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bé Hay Học',
    alternateName: 'Bé Hay Học',
    url: 'https://behayhoc.com',
    logo: 'https://behayhoc.com/logo.png',
    sameAs: [],
  };

  return (
    <html lang="vi" className={`${nunito.variable} ${baloo2.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen text-slate-900 antialiased bg-[#6ec6c6] font-sans">
        <SiteShell>{children}</SiteShell>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0SJ6BCCVGN"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0SJ6BCCVGN');
          `}
        </Script>
      </body>
    </html>
  );
}
