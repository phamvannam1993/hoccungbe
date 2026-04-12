import type { Metadata } from 'next';
import MiniMazeGame from './MiniMazeGame';

export const metadata: Metadata = {
  title: 'Trò chơi ghi nhớ cho bé',
  description:
    'Trò chơi ghi nhớ cho bé giúp rèn luyện trí nhớ, tăng khả năng quan sát và phản xạ nhanh thông qua các hoạt động tìm và ghi nhớ hình ảnh vui nhộn.',
  alternates: {
    canonical: '/games/memory-hunt',
  },
  openGraph: {
    title: 'Trò chơi ghi nhớ cho bé | Học Cùng Bé',
    description:
      'Bé tham gia trò chơi ghi nhớ hình ảnh để phát triển trí nhớ, sự tập trung và khả năng quan sát một cách tự nhiên.',
    url: '/games/memory-hunt',
    type: 'website',
    images: [
      {
        url: '/og-memory-hunt.jpg',
        width: 1200,
        height: 630,
        alt: 'Trò chơi ghi nhớ cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trò chơi ghi nhớ cho bé | Học Cùng Bé',
    description:
      'Trò chơi giúp bé rèn trí nhớ, tăng tập trung và phát triển khả năng quan sát qua hình ảnh.',
    images: ['/og-memory-hunt.jpg'],
  },
};

export default function Page() {
  return <MiniMazeGame />;
}
