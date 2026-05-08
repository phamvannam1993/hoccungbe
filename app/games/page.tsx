import GamesView from '../components/edu/GamesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi',

  description:
    'Khám phá kho trò chơi giáo dục cho bé 3-10 tuổi: game học chữ, toán vui, tiếng Anh, ghi nhớ, phản xạ và tư duy logic qua các hoạt động ngắn, trực quan.',

  keywords: [
    'trò chơi giáo dục cho bé',
    'kho trò chơi giáo dục',
    'game học tập cho trẻ em',
    'game học chữ cho bé',
    'trò chơi học toán cho bé',
    'trò chơi tiếng Anh cho bé',
    'trò chơi tư duy cho bé',
    'trò chơi phản xạ cho trẻ',
    'trò chơi ghi nhớ cho bé',
    'game giáo dục cho trẻ em',
    'học cùng bé',
    'bé hay học',
  ],

  alternates: {
    canonical: '/games',
  },

  openGraph: {
    title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi | Học Cùng Bé',
    description:
      'Giúp bé học chữ, toán, tiếng Anh, ghi nhớ, phản xạ và tư duy logic qua các trò chơi giáo dục ngắn, vui, trực quan.',
    url: '/games',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-games.jpg',
        width: 1200,
        height: 630,
        alt: 'Kho trò chơi giáo dục cho bé 3-10 tuổi - Học Cùng Bé',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Kho trò chơi giáo dục cho bé 3-10 tuổi | Học Cùng Bé',
    description:
      'Kho game học tập trực quan giúp bé học chữ, toán, tiếng Anh và rèn tư duy mỗi ngày.',
    images: ['/og-games.jpg'],
  },
};

export default function Page() {
  return <GamesView />;
}
