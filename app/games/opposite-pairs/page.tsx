import type { Metadata } from 'next';
import OppositePairsGame from './OppositePairsGame';

export const metadata: Metadata = {
  title: 'Ghép cặp từ trái nghĩa',
  description:
    'Trò chơi ghép cặp từ trái nghĩa giúp bé nhận biết các cặp khái niệm đối lập, mở rộng vốn từ và phát triển tư duy ngôn ngữ một cách trực quan, thú vị.',
  alternates: {
    canonical: '/games/opposite-pairs',
  },
  openGraph: {
    title: 'Ghép cặp từ trái nghĩa | Học Cùng Bé',
    description:
      'Bé tìm và ghép đúng các cặp từ trái nghĩa để phát triển ngôn ngữ, khả năng so sánh và tư duy khái niệm.',
    url: '/games/opposite-pairs',
    type: 'website',
    images: [
      {
        url: '/og-opposite-pairs.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép cặp từ trái nghĩa - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép cặp từ trái nghĩa | Học Cùng Bé',
    description:
      'Trò chơi giúp bé học các cặp từ trái nghĩa, mở rộng vốn từ và rèn tư duy ngôn ngữ.',
    images: ['/og-opposite-pairs.jpg'],
  },
};

export default function OppositePairsPage() {
  return <OppositePairsGame />;
}
