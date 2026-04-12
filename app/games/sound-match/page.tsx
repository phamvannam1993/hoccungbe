import type { Metadata } from 'next';
import SoundMatchGame from './SoundMatchGame';

export const metadata: Metadata = {
  title: 'Ghép cặp âm thanh',
  description:
    'Trò chơi ghép cặp âm thanh giúp bé nghe từ, nhận diện hình ảnh và phản xạ chọn đáp án đúng theo từng chủ đề quen thuộc.',
  alternates: {
    canonical: '/games/sound-match',
  },
  openGraph: {
    title: 'Ghép cặp âm thanh | Học Cùng Bé',
    description:
      'Bé nghe âm thanh và chọn đúng hình minh họa theo từng chủ đề như con vật, trái cây, phương tiện và thiên nhiên.',
    url: '/games/sound-match',
    type: 'website',
    images: [
      {
        url: '/og-sound-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép cặp âm thanh - Học Cùng Bé',
      },
    ],
  },
};

export default function Page() {
  return <SoundMatchGame />;
}
