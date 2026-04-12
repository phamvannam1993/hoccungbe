import type { Metadata } from 'next';
import CountAnimalsGame from './CountAnimalsGame';

export const metadata: Metadata = {
  title: 'Đếm con vật',
  description:
    'Trò chơi đếm con vật giúp bé quan sát, đếm số lượng và chọn đúng đáp án theo từng nhóm con vật quen thuộc.',
  alternates: {
    canonical: '/games/count-animals',
  },
  openGraph: {
    title: 'Đếm con vật | Học Cùng Bé',
    description:
      'Bé nhìn nhóm con vật, đếm số lượng và chọn đáp án đúng để rèn quan sát và tư duy số học.',
    url: '/games/count-animals',
    type: 'website',
    images: [
      {
        url: '/og-count-animals.jpg',
        width: 1200,
        height: 630,
        alt: 'Đếm con vật - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đếm con vật | Học Cùng Bé',
    description:
      'Trò chơi giúp bé đếm số lượng con vật và chọn đáp án chính xác.',
    images: ['/og-count-animals.jpg'],
  },
};

export default function Page() {
  return <CountAnimalsGame />;
}
