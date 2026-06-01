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
      'Bé Hay Học – Game học toán, trò chơi giáo dục cho bé 3-10 tuổi miễn phí',
    template: '%s | Bé Hay Học – Game giáo dục cho bé',
  },

  description:
    'Bé Hay Học – nền tảng game học toán cho bé, trò chơi giáo dục cho trẻ 3-10 tuổi miễn phí. Game đếm số, học chữ cái, tư duy logic, ghi nhớ. Phụ huynh theo dõi tiến độ học tập dễ dàng.',

  keywords: [
    // Core brand
    'Bé Hay Học',
    'behayhoc',
    // High-traffic transactional
    'game học toán cho bé',
    'trò chơi giáo dục cho bé',
    'game đếm số cho bé',
    'trò chơi học toán trực tuyến',
    'ứng dụng học toán cho trẻ',
    'game học chữ cái',
    'game trí nhớ cho bé',
    'game tư duy logic cho bé',
    'trò chơi giáo dục cho trẻ 3-6 tuổi',
    // Age-specific (high intent)
    'game cho bé 3 tuổi',
    'trò chơi học tập cho bé 4 tuổi',
    'game giáo dục bé 5 tuổi',
    'game tiểu học',
    'ứng dụng lớp 1',
    // Subject-specific
    'bài tập toán cho bé',
    'game cộng trừ nhân chia',
    'trò chơi đếm số từ 1 đến 100',
    'học bảng chữ cái tiếng Việt',
    'game ghép chữ cho trẻ',
    'game ghi nhớ cho bé',
    // Parent-centric
    'ứng dụng giáo dục miễn phí cho bé',
    'game giáo dục tốt cho trẻ em',
    'phương pháp dạy con thông qua trò chơi',
    'game học vui cho con',
    // Long-tail
    'học toán cho bé lớp 1',
    'học toán cho bé lớp 2',
    'trò chơi phát triển trí thông minh',
    'game STEM cho trẻ em',
    'game học vần tiếng Việt',
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
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bé Hay Học',
    alternateName: 'Bé Hay Học',
    url: 'https://behayhoc.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://behayhoc.com/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Nền tảng học tập và trò chơi giáo dục cho trẻ em 3-10 tuổi tại Việt Nam',
    inLanguage: 'vi-VN',
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    sameAs: [
      'https://www.facebook.com/behayhoc',
      'https://www.youtube.com/@behayhoc',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'behayhoc@gmail.com',
      availableLanguage: 'Vietnamese',
    },
  };

  return (
    <html lang="vi" className={`${nunito.variable} ${baloo2.variable}`}>
      <head>
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
