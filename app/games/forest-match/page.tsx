import type { Metadata } from 'next';
import ForestMatchGame from './ForestMatchGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép hình - Thế rừng',
  description:
    'Trò chơi ghép hình giúp bé phát triển tư duy logic, nhận dạng hình ảnh, số lượng và chữ cái qua các cấp độ dễ đến khó.',
  alternates: {
    canonical: '/tro-choi/ghep-hinh-rung',
  },
  openGraph: {
    title: 'Ghép hình - Thế rừng | Bé Hay Học',
    description:
      'Ghép hình, số và chữ cái với giao diện thế rừng đẹp. Rèn kỹ năng quan sát, nhớ và logic cho bé.',
    url: '/tro-choi/ghep-hinh-rung',
    type: 'website',
    images: [
      {
        url: '/og-forest-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép hình - Thế rừng | Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép hình - Thế rừng | Bé Hay Học',
    description:
      'Trò chơi ghép hình vui nhộn giúp bé nhận biết hình ảnh, số lượng và chữ cái.',
    images: ['/og-forest-match.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="ghep-hinh-rung" />
      <ForestMatchGame />
    </>
  );
}
