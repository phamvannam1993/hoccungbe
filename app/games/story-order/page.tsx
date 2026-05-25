import type { Metadata } from 'next';
import StoryOrderGame from './StoryOrderGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

const TITLE = 'Sắp xếp trước - sau - Trò chơi tư duy thời gian cho bé';
const DESCRIPTION =
  'Trò chơi giúp bé sắp xếp các hình ảnh theo đúng trình tự câu chuyện, phát triển tư duy thời gian, nguyên nhân - kết quả và kỹ năng quan sát.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'trò chơi sắp xếp trình tự',
    'game tư duy logic cho bé',
    'tư duy thời gian cho trẻ',
    'sắp xếp trước sau',
    'game nguyên nhân kết quả',
    'game tư duy cho bé 5 tuổi',
    'game tư duy cho bé 6 tuổi',
    'game tư duy cho bé 7 tuổi',
    'trò chơi giáo dục cho bé',
    'bé hay học',
  ],
  alternates: {
    canonical: '/tro-choi/sap-xep-truyen',
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
    title: `${TITLE} | Bé Hay Học`,
    description:
      'Bé sắp xếp hình ảnh theo đúng thứ tự để rèn tư duy logic và kể chuyện.',
    url: '/tro-choi/sap-xep-truyen',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Bé Hay Học`,
    description:
      'Trò chơi sắp xếp trình tự câu chuyện giúp bé rèn tư duy logic.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="story-order" />
      <StoryOrderGame />
    </>
  );
}
