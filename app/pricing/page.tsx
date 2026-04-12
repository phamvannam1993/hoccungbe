import type { Metadata } from 'next';
import PricingPage from '../components/edu/PricingPage';

export const metadata: Metadata = {
  title: 'Bảng giá',
  description:
    'Xem bảng giá các gói học tại Học Cùng Bé để lựa chọn giải pháp phù hợp với độ tuổi, nhu cầu học tập và hành trình phát triển của bé.',
  keywords: [
    'bảng giá học cùng bé',
    'gói học cho bé',
    'chi phí học cho trẻ em',
    'giá khóa học cho bé',
    'nền tảng học tập cho bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Bảng giá | Học Cùng Bé',
    description:
      'Khám phá các gói học phù hợp để bé học vui mỗi ngày và phụ huynh dễ dàng theo dõi tiến độ.',
    url: '/pricing',
    type: 'website',
    images: [
      {
        url: '/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'Bảng giá - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng giá | Học Cùng Bé',
    description:
      'Xem các gói học phù hợp cho bé theo từng nhu cầu và giai đoạn phát triển.',
    images: ['/og-pricing.jpg'],
  },
};

export default function Page() {
  return <PricingPage />;
}