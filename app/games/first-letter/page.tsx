import type { Metadata } from 'next';
import FirstLetterGame from './FirstLetterGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Chọn chữ cái đầu',
  description:
    'Trò chơi chọn chữ cái đầu giúp bé nhận biết từ vựng, mặt chữ và chọn đúng chữ cái đầu tiên của từ.',
  alternates: {
    canonical: '/games/first-letter',
  },
  openGraph: {
    title: 'Chọn chữ cái đầu | Học Cùng Bé',
    description:
      'Bé nhìn hình, nghe câu hỏi và chọn đúng chữ cái đầu tiên của từ tương ứng.',
    url: '/games/first-letter',
    type: 'website',
    images: [
      {
        url: '/og-first-letter.jpg',
        width: 1200,
        height: 630,
        alt: 'Chọn chữ cái đầu - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chọn chữ cái đầu | Học Cùng Bé',
    description:
      'Trò chơi giúp bé làm quen mặt chữ và nhận biết chữ cái đầu của từ.',
    images: ['/og-first-letter.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="first-letter" />
      <FirstLetterGame />
    </>
  );
}
