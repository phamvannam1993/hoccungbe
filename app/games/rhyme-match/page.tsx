import type { Metadata } from 'next';
import RhymeMatchGame from './RhymeMatchGame';

export const metadata: Metadata = {
  title: 'Ghép vần tương ứng',
  description:
    'Trò chơi ghép vần tương ứng giúp bé làm quen với âm vần, nhận biết các từ có vần giống nhau và phát triển khả năng ngôn ngữ một cách vui nhộn.',
  alternates: {
    canonical: '/games/rhyme-match',
  },
  openGraph: {
    title: 'Ghép vần tương ứng | Học Cùng Bé',
    description:
      'Bé tìm và ghép các từ có vần giống nhau để rèn luyện nghe âm, nhận biết vần và phát triển kỹ năng ngôn ngữ sớm.',
    url: '/games/rhyme-match',
    type: 'website',
    images: [
      {
        url: '/og-rhyme-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép vần tương ứng - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép vần tương ứng | Học Cùng Bé',
    description:
      'Trò chơi giúp bé nhận biết vần giống nhau, luyện nghe âm và phát triển ngôn ngữ.',
    images: ['/og-rhyme-match.jpg'],
  },
};

export default function RhymeMatchPage() {
  return <RhymeMatchGame />;
}
