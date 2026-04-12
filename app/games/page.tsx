import GamesView from '../components/edu/GamesView';

import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Kho trò chơi giáo dục cho bé',
  description:
    'Khám phá kho trò chơi giáo dục cho bé với nội dung ngắn gọn, trực quan, phù hợp theo độ tuổi, giúp rèn tư duy, phản xạ, ghi nhớ và kỹ năng học tập nền tảng.',
  keywords: [
    'trò chơi giáo dục cho bé',
    'game cho trẻ em',
    'trò chơi học tập',
    'trò chơi tư duy cho bé',
    'trò chơi phản xạ cho trẻ',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/games',
  },
  openGraph: {
    title: 'Kho trò chơi giáo dục cho bé | Học Cùng Bé',
    description:
      'Chọn trò chơi phù hợp với độ tuổi và mục tiêu học tập của bé để học vui hơn mỗi ngày.',
    url: '/games',
    type: 'website',
    images: [
      {
        url: '/og-games.jpg',
        width: 1200,
        height: 630,
        alt: 'Kho trò chơi giáo dục cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho trò chơi giáo dục cho bé | Học Cùng Bé',
    description:
      'Kho trò chơi trực quan, ngắn gọn và phù hợp với từng độ tuổi của bé.',
    images: ['/og-games.jpg'],
  },
};

export default function Page() {
  return <GamesView />;
}