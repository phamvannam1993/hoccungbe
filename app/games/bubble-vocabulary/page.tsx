import type { Metadata } from 'next';
import BubbleVocabularyClient from './BubbleVocabularyClient';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Bắt Bong Bóng Từ Vựng | Trò Chơi Học Tiếng Việt Cho Bé',
  description:
    'Trò chơi bắt bong bóng từ vựng giúp bé phát triển kỹ năng nghe hiểu, ghi nhớ từ vựng tiếng Việt qua hình ảnh trực quan. Bé nghe âm thanh TTS rồi chọn bong bóng đúng với từ được gọi.',
  keywords: ['bắt bong bóng', 'từ vựng tiếng Việt', 'học tiếng Việt', 'trò chơi giáo dục', 'nghe hiểu', 'trẻ em'],
  alternates: {
    canonical: '/tro-choi/bat-bong-tu-vung',
  },
  openGraph: {
    title: 'Bắt Bong Bóng Từ Vựng | Bé Hay Học',
    description:
      'Trò chơi nghe từ vựng tiếng Việt và bắt bong bóng đúng. Giúp bé phát triển kỹ năng nghe hiểu, ghi nhớ và khám phá từ vựng mới.',
    url: '/tro-choi/bat-bong-tu-vung',
    type: 'website',
    images: [
      {
        url: '/og-bubble-vocabulary.jpg',
        width: 1200,
        height: 630,
        alt: 'Bắt Bong Bóng Từ Vựng - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bắt Bong Bóng Từ Vựng | Bé Hay Học',
    description:
      'Bé nghe từ vựng tiếng Việt và bắt bong bóng đúng để phát triển kỹ năng nghe hiểu.',
    images: ['/og-bubble-vocabulary.jpg'],
  },
};

export default function BubbleVocabularyPage() {
  return (
    <>
      <GameStructuredData slug="bubble-vocabulary" />
      <BubbleVocabularyClient />
    </>
  );
}
