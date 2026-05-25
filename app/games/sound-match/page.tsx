import type { Metadata } from 'next';
import SoundMatchGame from './SoundMatchGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép cặp âm thanh',
  description:
    'Trò chơi ghép cặp âm thanh giúp bé nghe từ, nhận diện hình ảnh và phản xạ chọn đáp án đúng theo từng chủ đề quen thuộc.',
  alternates: {
    canonical: '/tro-choi/ghep-am-thanh',
  },
  openGraph: {
    title: 'Ghép cặp âm thanh | Bé Hay Học',
    description:
      'Bé nghe âm thanh và chọn đúng hình minh họa theo từng chủ đề như con vật, trái cây, phương tiện và thiên nhiên.',
    url: '/tro-choi/ghep-am-thanh',
    type: 'website',
    images: [
      {
        url: '/og-sound-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép cặp âm thanh - Bé Hay Học',
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="sound-match" />
      <SoundMatchGame />
    </>
  );
}
