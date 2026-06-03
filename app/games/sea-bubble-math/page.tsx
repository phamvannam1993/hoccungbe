import { Metadata } from 'next';
import SeaBubbleMathGame from "./SeaBubbleMathGame";
import GameStructuredData from '@/app/components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Bóng Biển - Toán | Trò chơi tính toán nhanh cho bé',
  description: 'Trò chơi Bóng Biển - Toán giúp bé phát triển kỹ năng tính toán, tư duy logic và phản xạ nhanh qua các phép cộng trừ trong giao diện biển vui nhộn.',
  keywords: ['bóng biển', 'toán cộng trừ', 'toán nhanh', 'tính toán', 'phản xạ', 'giáo dục trẻ em'],
  alternates: { canonical: 'https://behayhoc.com/tro-choi/toan-bong-bong-bien' },
  openGraph: {
    title: 'Bóng Biển - Toán | Bé Hay Học',
    description: 'Trò chơi Bóng Biển - Toán giúp bé phát triển kỹ năng tính toán và phản xạ nhanh',
    url: '/tro-choi/toan-bong-bong-bien',
    type: 'website',
    images: [{ url: '/og-sea-bubble-math.jpg', width: 1200, height: 630, alt: 'Trò chơi Bóng Biển - Toán' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bóng Biển - Toán | Bé Hay Học',
    description: 'Trò chơi Bóng Biển - Toán giúp bé phát triển kỹ năng tính toán',
    images: ['/og-sea-bubble-math.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData
        gameTitle="Bóng Biển - Toán"
        gameSlug="toan-bong-bong-bien"
        description="Trò chơi Bóng Biển - Toán giúp bé phát triển kỹ năng tính toán, tư duy logic và phản xạ nhanh qua các phép cộng trừ."
        keywords={['bóng biển', 'toán cộng trừ', 'toán nhanh', 'tính toán']}
        ageGroup="4-6"
      />
      <SeaBubbleMathGame />
    </>
  );
}
