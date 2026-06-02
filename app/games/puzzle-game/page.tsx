import type { Metadata } from 'next';
import PuzzleGame from './PuzzleGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép Hình - Thế rừng | Trò chơi ghép mảnh cho bé',
  description:
    'Trò chơi ghép ảnh hình thế rừng. Giúp bé phát triển tư duy logic, khả năng quan sát và suy luận không gian.',
  keywords: [
    'ghép mảnh',
    'trò chơi ghép hình',
    'tư duy logic',
    'toán tư duy',
    'giáo dục trẻ em',
    'phát triển nhận thức',
    'hoạt động cho bé',
  ],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/ghep-hinh-rung',
  },
  openGraph: {
    title: 'Ghép Hình - Thế rừng | Bé Hay Học',
    description: 'Trò chơi ghép ảnh hình thế rừng giúp phát triển kỹ năng tư duy của bé',
    url: '/tro-choi/ghep-hinh-rung',
    type: 'website',
    images: [
      {
        url: '/og-puzzle-game.jpg',
        width: 1200,
        height: 630,
        alt: 'Trò chơi ghép mảnh hình',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép Hình - Thế rừng | Bé Hay Học',
    description: 'Trò chơi ghép ảnh giúp phát triển tư duy logic cho bé',
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
