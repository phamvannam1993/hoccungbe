import type { Metadata } from 'next';
import ShadowMatchGame from './ShadowMatchGame';

export const metadata: Metadata = {
  title: 'Ghép bóng với đồ vật',
  description:
    'Trò chơi ghép bóng với đồ vật giúp bé quan sát hình bóng, nhận diện hình dạng và chọn đúng đồ vật tương ứng theo từng chủ đề quen thuộc.',
  alternates: {
    canonical: '/games/shadow-match',
  },
  openGraph: {
    title: 'Ghép bóng với đồ vật | Học Cùng Bé',
    description:
      'Bé nhìn hình bóng và chọn đúng đồ vật tương ứng để rèn quan sát, nhận biết hình dạng và phản xạ.',
    url: '/games/shadow-match',
    type: 'website',
    images: [
      {
        url: '/og-shadow-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép bóng với đồ vật - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép bóng với đồ vật | Học Cùng Bé',
    description:
      'Trò chơi giúp bé nhận diện hình dạng đồ vật một cách trực quan và vui nhộn.',
    images: ['/og-shadow-match.jpg'],
  },
};

export default function Page() {
  return <ShadowMatchGame />;
}