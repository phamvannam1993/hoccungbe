import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Nunito, Baloo_2 } from 'next/font/google';
import SiteShell from './components/SiteShell';
import { DEFAULT_LOGO, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from './lib/seo';

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
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      'Bé Hay Học – Game học toán, trò chơi giáo dục cho bé 3-10 tuổi miễn phí',
    template: '%s | Bé Hay Học – Game giáo dục cho bé',
  },

  description:
    'Bé Hay Học – nền tảng game học toán cho bé, trò chơi giáo dục cho trẻ 3-10 tuổi miễn phí. Game đếm số, học chữ cái, tư duy logic, ghi nhớ. Phụ huynh theo dõi tiến độ học tập dễ dàng.',

  keywords: [
    // Brand
    'Bé Hay Học',
    'behayhoc',
    // Toán học
    'học toán lớp 1',
    'học toán lớp 2',
    'toán tư duy cho trẻ em',
    'trò chơi toán học',
    'phép cộng cho bé',
    'phép trừ cho bé',
    'bảng cửu chương',
    'game học toán cho bé',
    'trò chơi giáo dục cho bé',
    'game đếm số cho bé',
    // Tiếng Việt
    'học chữ cái tiếng Việt',
    'tập đánh vần cho bé',
    'học đọc cho bé',
    'học viết chữ cho bé',
    'tiếng Việt lớp 1',
    // Tiếng Anh
    'học tiếng Anh cho bé',
    'từ vựng tiếng Anh cho trẻ em',
    'học tiếng Anh lớp 1',
    'trò chơi tiếng Anh cho bé',
    'học phát âm tiếng Anh cho trẻ em',
    // Tư duy
    'trò chơi trí tuệ cho trẻ em',
    'trò chơi tư duy logic',
    'câu đố cho trẻ em',
    'bài tập IQ cho bé',
    'phát triển tư duy cho trẻ em',
    // Phụ huynh tìm
    'ứng dụng học tập cho trẻ em',
    'website học tập cho trẻ em',
    'học online miễn phí cho bé',
    'học tại nhà cho trẻ em',
    'chương trình học cho bé 5 tuổi',
    'chương trình học cho bé 6 tuổi',
    'chương trình học cho bé 7 tuổi',
  ],

  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

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
      { url: '/icon.ico', sizes: '100x100', type: 'image/x-icon' },
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
    url: SITE_URL,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
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
    name: SITE_NAME,
    alternateName: 'Bé Hay Học',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(DEFAULT_LOGO),
      width: 1000,
      height: 250,
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
