import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import SiteHeader from './components/edu/SiteHeader';
import Footer from './components/edu/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://behayhoc.com'),
  title: {
    default: 'Học Cùng Bé - Nền tảng học tập vui cho trẻ em',
    template: '%s | Học Cùng Bé',
  },
  description:
    'Học Cùng Bé là nền tảng học tập dành cho trẻ em với trò chơi giáo dục, bài học ngắn, nội dung trực quan và theo dõi tiến độ rõ ràng cho phụ huynh.',
  keywords: [
    'Học Cùng Bé',
    'học cho trẻ em',
    'trò chơi giáo dục',
    'khóa học cho bé',
    'học online cho trẻ',
    'bé học vui',
    'nền tảng học tập cho bé',
  ],
  authors: [{ name: 'Học Cùng Bé' }],
  creator: 'Học Cùng Bé',
  publisher: 'Học Cùng Bé',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: 'Học Cùng Bé - Nền tảng học tập vui cho trẻ em',
    description:
      'Trò chơi giáo dục, bài học ngắn, nội dung trực quan và báo cáo tiến độ rõ ràng giúp bé học vui mỗi ngày.',
    url: 'https://behayhoc.com',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Học Cùng Bé - Nền tảng học tập cho trẻ em',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Học Cùng Bé - Nền tảng học tập vui cho trẻ em',
    description:
      'Trò chơi giáo dục, bài học ngắn và theo dõi tiến độ rõ ràng cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <Footer />
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