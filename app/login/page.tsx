import type { Metadata } from 'next';
import LoginPage from '../components/edu/LoginPage';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description:
    'Đăng nhập vào Bé Hay Học để tiếp tục bài học, lưu tiến độ, theo dõi báo cáo học tập và quản lý hồ sơ của bé.',
  keywords: [
    'đăng nhập bé hay học',
    'tài khoản phụ huynh',
    'đăng nhập nền tảng học tập cho bé',
    'theo dõi tiến độ học của bé',
    'bé hay học',
  ],
  alternates: {
    canonical: '/dang-nhap',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Đăng nhập | Bé Hay Học',
    description:
      'Đăng nhập để tiếp tục học, lưu tiến độ và theo dõi hành trình học tập của bé.',
    url: '/dang-nhap',
    type: 'website',
    images: [
      {
        url: '/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'Đăng nhập - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đăng nhập | Bé Hay Học',
    description:
      'Đăng nhập để tiếp tục học và theo dõi tiến độ học tập của bé.',
    images: ['/og-login.jpg'],
  },
};

export default function Page() {
  return <LoginPage />;
}