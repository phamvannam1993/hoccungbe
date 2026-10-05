import type { Metadata } from 'next';
import RegisterPage from '../components/edu/RegisterPage';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
  description:
    'Trang đăng ký tài khoản tại Bé Hay Học giúp phụ huynh tạo tài khoản nhanh chóng để đồng hành cùng bé trong hành trình học tập và vui chơi bổ ích.',
  alternates: {
    canonical: '/dang-ky',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Đăng ký tài khoản | Bé Hay Học',
    description:
      'Phụ huynh đăng ký tài khoản để cùng bé trải nghiệm các trò chơi giáo dục, bài học trực quan và hoạt động phát triển tư duy.',
    url: '/dang-ky',
    type: 'website',
    images: [
      {
        url: '/og-register.jpg',
        width: 1200,
        height: 630,
        alt: 'Đăng ký tài khoản - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đăng ký tài khoản | Bé Hay Học',
    description:
      'Tạo tài khoản nhanh chóng để bắt đầu hành trình học tập và khám phá cùng bé.',
    images: ['/og-register.jpg'],
  },
};

export default function Page() {
  return <RegisterPage />;
}
