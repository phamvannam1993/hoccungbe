import type { Metadata } from 'next';
import FallingNumberGame from './FallingNumberGame';

export const metadata: Metadata = {
  title: 'Bắt số đúng',
  description:
    'Trò chơi bắt số đúng giúp bé luyện tính nhẩm, nhận biết số tiếp theo và ghi nhớ quy luật tăng dần như cộng 1, cộng 3, cộng 5 một cách vui nhộn.',

  alternates: {
    canonical: '/games/falling-number',
  },

  openGraph: {
    title: 'Bắt số đúng | Học Cùng Bé',
    description:
      'Bé quan sát số rơi, tính kết quả theo quy luật tăng dần và chọn đúng đáp án để nhận tiền thưởng qua các mức độ dễ, trung bình, khó và cực khó.',
    url: '/games/falling-number',
    type: 'website',
    images: [
      {
        url: '/og-falling-number.jpg',
        width: 1200,
        height: 630,
        alt: 'Bắt số đúng - Học Cùng Bé',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Bắt số đúng | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện cộng nhẩm, nhận biết số tiếp theo và phản xạ nhanh khi chọn số đúng đang rơi.',
    images: ['/og-falling-number.jpg'],
  },
};

export default function FallingNumberPage() {
  return <FallingNumberGame />;
}
