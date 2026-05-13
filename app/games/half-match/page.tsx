import type { Metadata } from 'next';
import HalfMatchGame from './HalfMatchGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép nửa còn lại',
  description:
    'Trò chơi ghép nửa còn lại giúp bé quan sát hình ảnh, nhận biết sự tương ứng và rèn luyện tư duy logic qua hoạt động nối các phần phù hợp.',
  alternates: {
    canonical: '/games/half-match',
  },
  openGraph: {
    title: 'Ghép nửa còn lại | Học Cùng Bé',
    description:
      'Bé tìm và ghép đúng nửa còn lại của hình để phát triển khả năng quan sát, tư duy và nhận biết hình ảnh.',
    url: '/games/half-match',
    type: 'website',
    images: [
      {
        url: '/og-half-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép nửa còn lại - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép nửa còn lại | Học Cùng Bé',
    description:
      'Trò chơi giúp bé ghép đúng nửa hình còn thiếu và rèn luyện khả năng quan sát trực quan.',
    images: ['/og-half-match.jpg'],
  },
};

export default function HalfMatchPage() {
  return (
    <>
      <GameStructuredData slug="half-match" />
      <HalfMatchGame />
    </>
  );
}
