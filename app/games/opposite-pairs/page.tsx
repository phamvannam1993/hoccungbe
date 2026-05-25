import type { Metadata } from 'next';
import OppositePairsGame from './OppositePairsGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép cặp từ trái nghĩa',
  description:
    'Trò chơi ghép cặp từ trái nghĩa giúp bé nhận biết các cặp khái niệm đối lập, mở rộng vốn từ và phát triển tư duy ngôn ngữ một cách trực quan, thú vị.',
  alternates: {
    canonical: '/tro-choi/cap-doi-trai-nghia',
  },
  openGraph: {
    title: 'Ghép cặp từ trái nghĩa | Bé Hay Học',
    description:
      'Bé tìm và ghép đúng các cặp từ trái nghĩa để phát triển ngôn ngữ, khả năng so sánh và tư duy khái niệm.',
    url: '/tro-choi/cap-doi-trai-nghia',
    type: 'website',
    images: [
      {
        url: '/og-opposite-pairs.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép cặp từ trái nghĩa - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép cặp từ trái nghĩa | Bé Hay Học',
    description:
      'Trò chơi giúp bé học các cặp từ trái nghĩa, mở rộng vốn từ và rèn tư duy ngôn ngữ.',
    images: ['/og-opposite-pairs.jpg'],
  },
};

export default function OppositePairsPage() {
  return (
    <>
      <GameStructuredData slug="opposite-pairs" />
      <OppositePairsGame />
    </>
  );
}
