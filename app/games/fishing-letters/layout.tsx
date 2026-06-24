import type { Metadata } from 'next';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Câu Cá Chữ Cái | 4-6 tuổi | Bé Hay Học 2026',
  description: 'Game câu cá chữ cái giúp bé 4-6 tuổi nhận diện chữ cái, phân biệt chữ hoa/thường và học từ vựng tiếng Việt qua trò chơi vui nhộn.',
  keywords: ['câu cá chữ cái', 'học chữ cái cho bé', 'game học chữ cái cho bé', 'trò chơi tiếng Việt', 'phân biệt chữ hoa thường', 'học đọc sớm'],
  alternates: {
    canonical: '/tro-choi/cau-ca-chu-cai',
  },
  openGraph: {
    title: 'Câu Cá Chữ Cái | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi câu cá chữ cái giúp bé học nhận diện chữ, phân biệt chữ hoa/thường và phát triển vốn từ tiếng Việt.',
    url: '/tro-choi/cau-ca-chu-cai',
    type: 'website',
    images: [
      {
        url: '/og-fishing-letters.jpg',
        width: 1200,
        height: 630,
        alt: 'Câu Cá Chữ Cái - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu Cá Chữ Cái | Bé Hay Học',
    description: 'Game học chữ cái tiếng Việt miễn phí cho bé 4-6 tuổi.',
    images: ['/og-fishing-letters.jpg'],
  },
};

export default function FishingLettersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GameStructuredData slug="fishing-letters" imageUrl="/og-fishing-letters.jpg" />
      {children}
    </>
  );
}
