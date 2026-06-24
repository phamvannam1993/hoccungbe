import type { Metadata } from 'next';
import PuzzleGame from './PuzzleGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép Hình | 3-6 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi ghép hình giúp bé logic, tư duy không gian, quan sát. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học logic.',
  keywords: ['ghép hình', 'puzzle', 'logic', 'tư duy', 'trò chơi ghép hình', 'picture puzzle game', 'logic puzzle for kids'],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/ghep-hinh-rung',
  },
  openGraph: {
    title: 'Ghép Hình | 3-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi ghép hình giúp bé logic, tư duy không gian, quan sát. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học logic.',
    url: '/tro-choi/ghep-hinh-rung',
    type: 'website',
    images: [
      {
        url: '/og-puzzle-game.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép Hình - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép Hình | 3-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi ghép hình giúp bé logic, tư duy không gian, quan sát. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học logic.',
    images: ['/og-puzzle-game.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="ghep-hinh-rung" />
      <PuzzleGame />
    </>
  );
}
