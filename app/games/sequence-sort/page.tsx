import type { Metadata } from 'next';
import SequenceSortGame from './SequenceSortGame';

export const metadata: Metadata = {
  title: 'Sắp xếp theo thứ tự',
  description:
    'Trò chơi sắp xếp theo thứ tự giúp bé nhận biết trình tự trước sau, rèn tư duy logic và sắp xếp các đối tượng theo đúng quy trình hoặc thứ tự hợp lý.',
  alternates: {
    canonical: '/games/sequence-sort',
  },
  openGraph: {
    title: 'Sắp xếp theo thứ tự | Học Cùng Bé',
    description:
      'Bé quan sát các hình ảnh hoặc sự việc và sắp xếp đúng thứ tự để phát triển tư duy logic, khả năng suy luận và nhận biết trình tự.',
    url: '/games/sequence-sort',
    type: 'website',
    images: [
      {
        url: '/og-sequence-sort.jpg',
        width: 1200,
        height: 630,
        alt: 'Sắp xếp theo thứ tự - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sắp xếp theo thứ tự | Học Cùng Bé',
    description:
      'Trò chơi giúp bé rèn tư duy logic, nhận biết trình tự và sắp xếp đúng thứ tự các sự vật hoặc sự việc.',
    images: ['/og-sequence-sort.jpg'],
  },
};

export default function SequenceSortPage() {
  return <SequenceSortGame />;
}
