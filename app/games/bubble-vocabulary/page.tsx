import type { Metadata } from 'next';
import BubbleVocabularyClient from './BubbleVocabularyClient';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Bắt Bong Bóng Từ Vựng | 3-5 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi bắt bóng từ vựng giúp bé từ vựng, nghe hiểu, phân biệt. Phù hợp với trẻ 3-5 tuổi. Tải ngay để bé học từ vựng.',
  keywords: ['bóng', 'từ vựng', 'nghe hiểu', 'tiếng Việt', 'game bắt bóng từ vựng', 'bubble vocabulary game', 'learn Vietnamese vocabulary'],
  alternates: {
    canonical: '/tro-choi/bat-bong-tu-vung',
  },
  openGraph: {
    title: 'Bắt Bong Bóng Từ Vựng | 3-5 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi bắt bóng từ vựng giúp bé từ vựng, nghe hiểu, phân biệt. Phù hợp với trẻ 3-5 tuổi. Tải ngay để bé học từ vựng.',
    url: '/tro-choi/bat-bong-tu-vung',
    type: 'website',
    images: [
      {
        url: '/og-bubble-vocabulary.jpg',
        width: 1200,
        height: 630,
        alt: 'Bắt Bong Bóng Từ Vựng - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bắt Bong Bóng Từ Vựng | 3-5 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi bắt bóng từ vựng giúp bé từ vựng, nghe hiểu, phân biệt. Phù hợp với trẻ 3-5 tuổi. Tải ngay để bé học từ vựng.',
    images: ['/og-bubble-vocabulary.jpg'],
  },
};

export default function BubbleVocabularyPage() {
  return (
    <>
      <GameStructuredData slug="bubble-vocabulary" />
      <BubbleVocabularyClient />
    <GameSeoContent slug="bubble-vocabulary" />
    </>
  );
}
