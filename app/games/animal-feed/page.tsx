import type { Metadata } from 'next';
import AnimalFeedGame from './AnimalFeedGame';

export const metadata: Metadata = {
  title: 'Cho thú ăn đúng số lượng',
  description:
    'Trò chơi Cho thú ăn đúng số lượng giúp bé luyện đếm số, nhận biết số lượng và làm theo nhiệm vụ thông qua hoạt động cho con vật ăn trực quan, vui nhộn.',
  alternates: {
    canonical: '/games/animal-feed',
  },
  openGraph: {
    title: 'Cho thú ăn đúng số lượng | Học Cùng Bé',
    description:
      'Bé nghe nhiệm vụ, chọn đúng số lượng đồ ăn và cho con vật ăn để rèn kỹ năng đếm số một cách tự nhiên.',
    url: '/games/animal-feed',
    type: 'website',
    images: [
      {
        url: '/og-animal-feed.jpg',
        width: 1200,
        height: 630,
        alt: 'Cho thú ăn đúng số lượng - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cho thú ăn đúng số lượng | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện đếm số, nhận biết số lượng và tập trung khi cho con vật ăn đúng số lượng.',
    images: ['/og-animal-feed.jpg'],
  },
};

export default function Page() {
  return <AnimalFeedGame />;
}
