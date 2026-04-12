import type { Metadata } from 'next';
import SequenceMemoryGame from './SequenceMemoryGame';

export const metadata: Metadata = {
  title: 'Ghi nhớ chuỗi',
  description:
    'Trò chơi ghi nhớ chuỗi giúp bé rèn luyện trí nhớ ngắn hạn, khả năng tập trung và ghi nhớ đúng thứ tự của hình ảnh, âm thanh hoặc hành động.',
  alternates: {
    canonical: '/games/sequence-memory',
  },
  openGraph: {
    title: 'Ghi nhớ chuỗi | Học Cùng Bé',
    description:
      'Bé quan sát và ghi nhớ đúng thứ tự của chuỗi để phát triển trí nhớ, sự tập trung và khả năng phản xạ.',
    url: '/games/sequence-memory',
    type: 'website',
    images: [
      {
        url: '/og-sequence-memory.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghi nhớ chuỗi - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghi nhớ chuỗi | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện trí nhớ, ghi nhớ thứ tự và tăng khả năng tập trung.',
    images: ['/og-sequence-memory.jpg'],
  },
};

export default function SequenceMemoryPage() {
  return <SequenceMemoryGame />;
}
