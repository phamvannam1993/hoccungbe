import type { Metadata } from 'next';
import WhereBelongsGame from './WhereBelongsGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

const TITLE = 'Đồ vật ở đâu? - Trò chơi phân loại cho bé';
const DESCRIPTION =
  'Trò chơi giúp bé quan sát đồ vật và chọn đúng địa điểm nơi nó thuộc về, phát triển tư duy phân loại và liên hệ với cuộc sống thực tế.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'trò chơi phân loại đồ vật',
    'game phân loại cho bé',
    'tư duy bối cảnh cho trẻ',
    'đồ vật ở đâu',
    'game tư duy cho bé 4 tuổi',
    'game tư duy cho bé 5 tuổi',
    'game tư duy cho bé 6 tuổi',
    'trò chơi giáo dục cho bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/games/where-belongs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${TITLE} | Học Cùng Bé`,
    description:
      'Bé chọn đúng nơi đồ vật thuộc về để rèn tư duy phân loại và mở rộng vốn từ.',
    url: '/games/where-belongs',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Học Cùng Bé`,
    description:
      'Trò chơi phân loại đồ vật theo bối cảnh giúp bé tư duy có hệ thống.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="where-belongs" />
      <WhereBelongsGame />
    </>
  );
}
