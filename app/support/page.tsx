import type { Metadata } from 'next';
import SupportPage from '../components/edu/SupportPage';

export const metadata: Metadata = {
  title: 'Hỗ trợ phụ huynh',
  description:
    'Liên hệ hỗ trợ để được tư vấn chọn lộ trình học, giải đáp về tài khoản, gói học và cách theo dõi tiến độ học tập của bé trên Học Cùng Bé.',
  keywords: [
    'hỗ trợ phụ huynh',
    'tư vấn gói học cho bé',
    'liên hệ học cùng bé',
    'hỗ trợ tài khoản học tập',
    'chăm sóc khách hàng học cùng bé',
  ],
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Hỗ trợ phụ huynh | Học Cùng Bé',
    description:
      'Cần tư vấn chọn lộ trình, hỗ trợ tài khoản hoặc tìm hiểu thêm về cách hệ thống hoạt động? Chúng tôi luôn sẵn sàng đồng hành.',
    url: '/support',
    type: 'website',
    images: [
      {
        url: '/og-support.jpg',
        width: 1200,
        height: 630,
        alt: 'Hỗ trợ phụ huynh - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hỗ trợ phụ huynh | Học Cùng Bé',
    description:
      'Liên hệ để được hỗ trợ nhanh về tài khoản, gói học và lộ trình phù hợp cho bé.',
    images: ['/og-support.jpg'],
  },
};

export default function Page() {
  return <SupportPage />;
}