import type { Metadata } from 'next';
import WordPictureMatchPage from '../../components/edu/WordPictureMatchPage';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'ghép chữ với hình | Bé Hay Học',
  description:
    'Trò chơi ghép chữ với hình giúp bé nhận biết từ vựng, liên kết chữ và hình ảnh, phát triển ngôn ngữ và khả năng quan sát một cách trực quan, sinh động.',
  keywords: [
    'ghép chữ với hình',
    'trò chơi từ vựng cho bé',
    'học chữ qua hình ảnh',
    'trò chơi ngôn ngữ cho trẻ em',
    'bé học từ vựng',
    'bé hay học',
  ],
  alternates: {
    canonical: '/tro-choi/ghep-tu',
  },
  openGraph: {
    title: 'ghép chữ với hình | Bé Hay Học',
    description:
      'Bé học từ vựng qua trò chơi ghép chữ với hình ảnh trực quan, dễ hiểu và phù hợp theo độ tuổi.',
    url: '/tro-choi/ghep-tu',
    type: 'website',
    images: [
      {
        url: '/og-match-word.jpg',
        width: 1200,
        height: 630,
        alt: 'ghép chữ với hình - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ghép chữ với hình | Bé Hay Học',
    description:
      'Trò chơi giúp bé nối từ với hình đúng, phát triển vốn từ và khả năng quan sát.',
    images: ['/og-match-word.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="match-word" />
      <WordPictureMatchPage />
    </>
  );
}