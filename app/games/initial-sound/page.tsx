import type { Metadata } from 'next';
import InitialSoundGame from './InitialSoundGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Nhận biết âm đầu',
  description:
    'Trò chơi nhận biết âm đầu giúp bé làm quen với chữ cái, phát âm chuẩn và nhận diện âm đầu của từ qua hình ảnh trực quan, sinh động.',
  alternates: {
    canonical: '/games/initial-sound',
  },
  openGraph: {
    title: 'Nhận biết âm đầu | Học Cùng Bé',
    description:
      'Bé quan sát hình ảnh, nghe hoặc nhận diện từ để chọn đúng âm đầu, từ đó phát triển khả năng ngôn ngữ và tiền đọc viết.',
    url: '/games/initial-sound',
    type: 'website',
    images: [
      {
        url: '/og-initial-sound.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhận biết âm đầu - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhận biết âm đầu | Học Cùng Bé',
    description:
      'Trò chơi giúp bé nhận diện âm đầu của từ, làm quen chữ cái và phát triển ngôn ngữ sớm.',
    images: ['/og-initial-sound.jpg'],
  },
};

export default function InitialSoundPage() {
  return (
    <>
      <GameStructuredData slug="initial-sound" />
      <InitialSoundGame />
    </>
  );
}
