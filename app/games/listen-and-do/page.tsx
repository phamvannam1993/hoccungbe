import type { Metadata } from 'next';
import ListenAndDoGame from './ListenAndDoGame';

export const metadata: Metadata = {
  title: 'Nghe và làm theo',
  description:
    'Trò chơi nghe và làm theo giúp bé rèn kỹ năng lắng nghe, ghi nhớ hướng dẫn và phản xạ đúng với yêu cầu thông qua các hoạt động vui nhộn.',
  alternates: {
    canonical: '/games/listen-and-do',
  },
  openGraph: {
    title: 'Nghe và làm theo | Học Cùng Bé',
    description:
      'Bé lắng nghe yêu cầu và thực hiện đúng hành động để phát triển khả năng tập trung, ghi nhớ và làm theo hướng dẫn.',
    url: '/games/listen-and-do',
    type: 'website',
    images: [
      {
        url: '/og-listen-and-do.jpg',
        width: 1200,
        height: 630,
        alt: 'Nghe và làm theo - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nghe và làm theo | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện kỹ năng lắng nghe, ghi nhớ và phản xạ theo hướng dẫn.',
    images: ['/og-listen-and-do.jpg'],
  },
};

export default function ListenAndDoPage() {
  return <ListenAndDoGame />;
}
