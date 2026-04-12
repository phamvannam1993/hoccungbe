import type { Metadata } from 'next';
import LoginPage from '../components/edu/LoginPage';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description:
    'Đăng nhập vào Học Cùng Bé để tiếp tục bài học, lưu tiến độ, theo dõi báo cáo học tập và quản lý hồ sơ của bé.',
  keywords: [
    'đăng nhập học cùng bé',
    'tài khoản phụ huynh',
    'đăng nhập nền tảng học tập cho bé',
    'theo dõi tiến độ học của bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Đăng nhập | Học Cùng Bé',
    description:
      'Đăng nhập để tiếp tục học, lưu tiến độ và theo dõi hành trình học tập của bé.',
    url: '/login',
    type: 'website',
    images: [
      {
        url: '/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'Đăng nhập - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đăng nhập | Học Cùng Bé',
    description:
      'Đăng nhập để tiếp tục học và theo dõi tiến độ học tập của bé.',
    images: ['/og-login.jpg'],
  },
};

export default function Page() {
  return <LoginPage />;
}