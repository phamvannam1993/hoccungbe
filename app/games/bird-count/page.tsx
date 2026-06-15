import type { Metadata } from 'next';
import BirdCountGame from "./BirdCountGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Đếm Chim | 3-6 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
  keywords: ['đếm chim', 'đếm số', 'số lượng', 'trò chơi đếm chim cho bé', 'game học đếm số qua hình ảnh', 'đếm vật thể'],
  alternates: { canonical: '/tro-choi/dem-chim' },
  openGraph: {
    title: 'Đếm Chim | 3-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
    url: '/tro-choi/dem-chim',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Đếm Chim - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đếm Chim | 3-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi đếm chim giúp bé đếm số, nhận diện số lượng. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học đếm số.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-count" />
      <BirdCountGame />
    </>
  );
}
