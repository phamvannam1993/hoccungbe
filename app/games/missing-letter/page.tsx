import type { Metadata } from 'next';
import MissingLetterGame from './MissingLetterGame';
import GameStructuredData from '@/app/components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Tìm Chữ Bị Mất - Trò Chơi Học Từ Vựng Cho Bé | Bé Hay Học',
  description:
    'Trò chơi tìm chữ bị mất với 100 câu hỏi giúp bé phát triển kỹ năng nhận diện chữ, suy luận từ vựng. 5 dạng câu: điền chữ, sắp xếp chữ cái. Có âm thanh TTS và theo dõi tiến độ.',
  keywords: [
    'tìm chữ bị mất',
    'trò chơi chữ cái',
    'học từ vựng tiếng Việt',
    'trò chơi ngôn ngữ cho bé',
    'phát triển kỹ năng đọc',
    'sắp xếp chữ cái',
    'nhận diện chữ',
    'giáo dục trẻ em',
  ],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/tim-chu-bi-mat',
  },
  openGraph: {
    title: 'Tìm Chữ Bị Mất - Trò Chơi Học Từ Vựng Cho Bé',
    description: 'Trò chơi tìm chữ bị mất giúp bé nhận diện chữ, suy luận và phát triển từ vựng tiếng Việt',
    url: '/tro-choi/tim-chu-bi-mat',
    type: 'website',
    images: [
      {
        url: 'https://behayhoc.com/og-missing-letter.jpg',
        width: 1200,
        height: 630,
        alt: 'Trò chơi tìm chữ bị mất cho bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tìm Chữ Bị Mất - Bé Hay Học',
    description: 'Trò chơi tìm chữ bị mất giúp bé học từ vựng tiếng Việt',
    images: ['https://behayhoc.com/og-missing-letter.jpg'],
  },
};

export default function MissingLetterGamePage() {
  return (
    <>
      <GameStructuredData slug="tim-chu-bi-mat" />
      <MissingLetterGame />
    </>
  );
}
