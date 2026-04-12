import type { Metadata } from 'next';
import OddOneOutGame from './OddOneOutGame';

export const metadata: Metadata = {
  title: 'Tìm điểm khác biệt',
  description:
    'Trò chơi tìm điểm khác biệt giúp bé quan sát, so sánh và nhận ra vật hoặc hình ảnh không cùng nhóm một cách nhanh nhạy và vui nhộn.',
  alternates: {
    canonical: '/games/odd-one-out',
  },
  openGraph: {
    title: 'Tìm điểm khác biệt | Học Cùng Bé',
    description:
      'Bé quan sát các hình ảnh và chọn ra vật khác biệt để phát triển tư duy phân loại, khả năng so sánh và sự tập trung.',
    url: '/games/odd-one-out',
    type: 'website',
    images: [
      {
        url: '/og-odd-one-out.jpg',
        width: 1200,
        height: 630,
        alt: 'Tìm điểm khác biệt - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tìm điểm khác biệt | Học Cùng Bé',
    description:
      'Trò chơi giúp bé rèn khả năng quan sát, phân loại và nhận biết vật khác biệt trong nhóm.',
    images: ['/og-odd-one-out.jpg'],
  },
};

export default function OddOneOutPage() {
  return <OddOneOutGame />;
}