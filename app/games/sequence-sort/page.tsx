import type { Metadata } from 'next';
import SequenceSortGame from './SequenceSortGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Sắp xếp số theo thứ tự',
  description:
    'Trò chơi Sắp xếp số theo thứ tự giúp bé biết số nào lớn hơn, nhỏ hơn và sắp xếp dãy số theo thứ tự từ bé đến lớn hoặc từ lớn đến bé.',
  alternates: {
    canonical: '/games/sequence-sort',
  },
  openGraph: {
    title: 'Sắp xếp số theo thứ tự | Học Cùng Bé',
    description:
      'Bé quan sát dãy số, so sánh các số và sắp xếp lại theo thứ tự tăng dần hoặc giảm dần.',
    url: '/games/sequence-sort',
    type: 'website',
    images: [
      {
        url: '/og-sequence-sort.jpg',
        width: 1200,
        height: 630,
        alt: 'Sắp xếp số theo thứ tự - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sắp xếp số theo thứ tự | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện so sánh số, nhận biết số lớn hơn nhỏ hơn và sắp xếp dãy số.',
    images: ['/og-sequence-sort.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="sequence-sort" />
      <SequenceSortGame />
    </>
  );
}
