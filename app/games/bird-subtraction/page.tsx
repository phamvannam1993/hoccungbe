import type { Metadata } from 'next';
import BirdSubtractionGame from "./BirdSubtractionGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Chim bay mất | Bé Hay Học',
  description: 'Trò chơi chim bay mất giúp bé học phép trừ trực quan. Đếm số chim còn lại sau khi một số con bay đi – vui và dễ hiểu cho bé 4–7 tuổi.',
  keywords: ['chim bay mất', 'học phép trừ cho bé', 'trò chơi trừ số', 'toán học cho trẻ em', 'đếm chim', 'bé hay học'],
  alternates: { canonical: '/tro-choi/chim-bay-mat' },
  openGraph: {
    title: 'Chim bay mất | Bé Hay Học',
    description: 'Quan sát chim đậu rồi xem bao nhiêu con bay đi. Chọn đúng số còn lại – trò chơi học phép trừ sinh động cho bé.',
    url: '/tro-choi/chim-bay-mat',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Chim bay mất - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chim bay mất | Bé Hay Học',
    description: 'Đếm số chim còn lại sau khi một số bay đi – học phép trừ vui cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-subtraction" />
      <BirdSubtractionGame />
    </>
  );
}
