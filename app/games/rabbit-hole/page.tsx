import type { Metadata } from 'next';
import RabbitHoleGame from "./RabbitHoleGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  keywords: ['thỏ', 'hang', 'số lượng', 'toán', 'trò chơi thỏ vào hang', 'game học số qua câu chuyện', 'subtraction game'],
  alternates: { canonical: '/tro-choi/tho-vao-hang' },
  openGraph: {
    title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    url: '/tro-choi/tho-vao-hang',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-hole" />
      <RabbitHoleGame />
    <GameSeoContent slug="rabbit-hole" />
    </>
  );
}
