import type { Metadata } from 'next';
import BirdSubtractionGame from "./BirdSubtractionGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Chim Bay Mất | 4-6 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi chim bay mất giúp bé phép trừ, đếm, logic. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép trừ.',
  keywords: ['chim bay', 'mất', 'trừ', 'logic', 'trò chơi chim bay mất', 'subtraction game cho bé', 'toán logic vui'],
  alternates: { canonical: '/tro-choi/chim-bay-mat' },
  openGraph: {
    title: 'Chim Bay Mất | 4-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi chim bay mất giúp bé phép trừ, đếm, logic. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép trừ.',
    url: '/tro-choi/chim-bay-mat',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Chim Bay Mất - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chim Bay Mất | 4-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi chim bay mất giúp bé phép trừ, đếm, logic. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép trừ.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-subtraction" />
      <BirdSubtractionGame />
    </>
  );
}
