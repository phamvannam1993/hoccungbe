import type { Metadata } from 'next';
import BirdCountGame from "./BirdCountGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Đếm Chim | 3-6 tuổi',
  description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
  keywords: ['đếm chim', 'đếm số', 'số lượng', 'trò chơi đếm chim cho bé', 'game học đếm số qua hình ảnh', 'đếm vật thể'],
  alternates: { canonical: '/tro-choi/dem-chim' },
  openGraph: {
    title: 'Đếm Chim | 3-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
    url: '/tro-choi/dem-chim',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đếm Chim | 3-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-count" />
      <BirdCountGame />
    <GameSeoContent slug="bird-count" />
    </>
  );
}
