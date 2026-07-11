import type { Metadata } from 'next';
import MissingLetterGame from './MissingLetterGame';
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import GameSeoContent from '@/app/components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Tìm Chữ Bị Mất | 4-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi tìm chữ bị mất giúp bé chữ cái, từ vựng, logic. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học từ vựng.',
  keywords: ['tìm chữ', 'chữ bị mất', 'từ vựng', 'logic', 'game tìm chữ bị mất', 'missing letter puzzle', 'hoàn thành từ'],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/tim-chu-bi-mat',
  },
  openGraph: {
    title: 'Tìm Chữ Bị Mất | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi tìm chữ bị mất giúp bé chữ cái, từ vựng, logic. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học từ vựng.',
    url: '/tro-choi/tim-chu-bi-mat',
    type: 'website',
    images: [
      {
        url: 'https://behayhoc.com/og-missing-letter.jpg',
        width: 1200,
        height: 630,
        alt: 'Tìm Chữ Bị Mất - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tìm Chữ Bị Mất | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi tìm chữ bị mất giúp bé chữ cái, từ vựng, logic. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học từ vựng.',
    images: ['https://behayhoc.com/og-missing-letter.jpg'],
  },
};

export default function MissingLetterGamePage() {
  return (
    <>
      <GameStructuredData slug="tim-chu-bi-mat" />
      <MissingLetterGame />
    <GameSeoContent slug="tim-chu-bi-mat" />
    </>
  );
}
