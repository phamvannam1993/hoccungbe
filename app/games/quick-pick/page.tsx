import type { Metadata } from 'next';
import QuickPickGame from './QuickPickGame';

export const metadata: Metadata = {
  title: 'Nhìn nhanh chọn đúng',
  description:
    'Trò chơi nhìn nhanh chọn đúng giúp bé quan sát nhanh, nhận diện hình ảnh và phản xạ chọn đáp án chính xác theo từng chủ đề quen thuộc.',
  alternates: {
    canonical: '/games/quick-pick',
  },
  openGraph: {
    title: 'Nhìn nhanh chọn đúng | Học Cùng Bé',
    description:
      'Bé nhìn yêu cầu ngắn và chọn đúng hình tương ứng trong thời gian ngắn, vui nhộn và trực quan.',
    url: '/games/quick-pick',
    type: 'website',
    images: [
      {
        url: '/og-quick-pick.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhìn nhanh chọn đúng - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhìn nhanh chọn đúng | Học Cùng Bé',
    description:
      'Trò chơi giúp bé tăng quan sát, phản xạ và khả năng nhận biết hình ảnh.',
    images: ['/og-quick-pick.jpg'],
  },
};

export default function Page() {
  return <QuickPickGame />;
}
