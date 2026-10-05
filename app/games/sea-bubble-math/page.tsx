import { Metadata } from 'next';
import SeaBubbleMathGame from "./SeaBubbleMathGame";
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import GameSeoContent from '@/app/components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Toán Bong Bóng Biển | 4-8 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi toán bong bóng biển giúp bé đếm số, tính toán, phản xạ. Phù hợp với trẻ 4-8 tuổi. Tải ngay để bé học tính toán.',
  keywords: ['bóng biển', 'toán học', 'bắt bóng', 'số học', 'trò chơi bóng biển toán học cho bé', 'game bắt bóng số đếm', 'toán thử thách biển'],
  alternates: { canonical: 'https://behayhoc.com/tro-choi/toan-bong-bong-bien' },
  openGraph: {
    title: 'Toán Bong Bóng Biển | 4-8 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi toán bong bóng biển giúp bé đếm số, tính toán, phản xạ. Phù hợp với trẻ 4-8 tuổi. Tải ngay để bé học tính toán.',
    url: '/tro-choi/toan-bong-bong-bien',
    type: 'website',
    images: [{ url: '/og-sea-bubble-math.jpg', width: 1200, height: 630, alt: 'Toán Bong Bóng Biển - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toán Bong Bóng Biển | 4-8 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi toán bong bóng biển giúp bé đếm số, tính toán, phản xạ. Phù hợp với trẻ 4-8 tuổi. Tải ngay để bé học tính toán.',
    images: ['/og-sea-bubble-math.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="toan-bong-bong-bien" />
      <SeaBubbleMathGame />
    <GameSeoContent slug="toan-bong-bong-bien" />
    </>
  );
}
