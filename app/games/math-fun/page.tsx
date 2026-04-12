import type { Metadata } from 'next';
import MathFunPage from '../../components/edu/MathFunPage';

export const metadata: Metadata = {
  title: 'Toán vui cho bé | Học Cùng Bé',
  description:
    'Khám phá các bài học toán vui cho bé với nội dung đếm số, so sánh, nối số theo thứ tự và tư duy toán học cơ bản, được thiết kế trực quan, sinh động và phù hợp theo độ tuổi.',
  keywords: [
    'toán vui cho bé',
    'toán học cho trẻ em',
    'bé học đếm số',
    'nối số cho bé',
    'tư duy toán học cho bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/math-fun',
  },
  openGraph: {
    title: 'Toán vui cho bé | Học Cùng Bé',
    description:
      'Bé học toán qua các bài học ngắn, trực quan và dễ hiểu như đếm số, nối số và so sánh số lượng.',
    url: '/math-fun',
    type: 'website',
    images: [
      {
        url: '/og-math-fun.jpg',
        width: 1200,
        height: 630,
        alt: 'Toán vui cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toán vui cho bé | Học Cùng Bé',
    description:
      'Bài học toán trực quan giúp bé làm quen với số đếm, thứ tự và tư duy toán học cơ bản.',
    images: ['/og-math-fun.jpg'],
  },
};

export default function Page() {
  return <MathFunPage />;
}
