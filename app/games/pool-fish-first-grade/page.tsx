import type { Metadata } from 'next';
import PoolFishFirstGradeGame from "./PoolFishFirstGradeGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Cá Trong Hồ Bơi | 4-6 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi cá trong hồ giúp bé đếm số, phép cộng. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép cộng.',
  keywords: ['cá', 'hồ', 'đếm', 'số', 'game cá trong hồ', 'đếm cá học toán', 'trò chơi nước cho bé'],
  alternates: { canonical: '/tro-choi/ca-trong-ho-boi' },
  openGraph: {
    title: 'Cá Trong Hồ Bơi | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi cá trong hồ giúp bé đếm số, phép cộng. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép cộng.',
    url: '/tro-choi/ca-trong-ho-boi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cá Trong Hồ Bơi | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi cá trong hồ giúp bé đếm số, phép cộng. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học phép cộng.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="pool-fish-first-grade" />
      <PoolFishFirstGradeGame />
    <GameSeoContent slug="pool-fish-first-grade" />
    </>
  );
}
