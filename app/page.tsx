import HomePage from './components/edu/HomePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Học Cùng Bé là nền tảng học tập vui cho trẻ em với trò chơi giáo dục, bài học ngắn, nội dung trực quan và theo dõi tiến độ rõ ràng dành cho phụ huynh.',
  keywords: [
    'học cùng bé',
    'nền tảng học tập cho bé',
    'trò chơi giáo dục cho trẻ em',
    'học online cho bé',
    'bài học cho trẻ em',
    'phụ huynh theo dõi tiến độ học',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Học Cùng Bé - Nền tảng học tập vui cho trẻ em',
    description:
      'Trò chơi giáo dục ngắn, trực quan và phù hợp theo độ tuổi, giúp bé học hứng thú hơn mỗi ngày.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/og-home.jpg',
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
      'Giúp bé học vui mỗi ngày, phụ huynh theo dõi dễ dàng với trò chơi và bài học trực quan.',
    images: ['/og-home.jpg'],
  },
};

export default function Page() {
  return <HomePage />;
}