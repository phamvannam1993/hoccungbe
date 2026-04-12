import type { Metadata } from 'next';
import RegisterPage from '../components/edu/RegisterPage';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
  description:
    'Trang đăng ký tài khoản tại Học Cùng Bé giúp phụ huynh tạo tài khoản nhanh chóng để đồng hành cùng bé trong hành trình học tập và vui chơi bổ ích.',
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Đăng ký tài khoản | Học Cùng Bé',
    description:
      'Phụ huynh đăng ký tài khoản để cùng bé trải nghiệm các trò chơi giáo dục, bài học trực quan và hoạt động phát triển tư duy.',
    url: '/register',
    type: 'website',
    images: [
      {
        url: '/og-register.jpg',
        width: 1200,
        height: 630,
        alt: 'Đăng ký tài khoản - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đăng ký tài khoản | Học Cùng Bé',
    description:
      'Tạo tài khoản nhanh chóng để bắt đầu hành trình học tập và khám phá cùng bé.',
    images: ['/og-register.jpg'],
  },
};

export default function Page() {
  return <RegisterPage />;
}
