import type { Metadata } from 'next';
import ApplePickGame from './ApplePickGame';

export const metadata: Metadata = {
  title: 'Nhặt táo theo số',
  description:
    'Trò chơi Nhặt táo theo số giúp bé luyện đếm số, nhận biết số lượng và làm theo nhiệm vụ thông qua hoạt động nhặt táo trực quan, vui nhộn.',
  alternates: {
    canonical: '/games/apple-pick',
  },
  openGraph: {
    title: 'Nhặt táo theo số | Học Cùng Bé',
    description:
      'Bé nghe nhiệm vụ, quan sát vườn táo và nhặt đúng số quả táo được yêu cầu để rèn kỹ năng đếm số một cách tự nhiên.',
    url: '/games/apple-pick',
    type: 'website',
    images: [
      {
        url: '/og-apple-pick.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhặt táo theo số - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhặt táo theo số | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện đếm số, nhận biết số lượng và tập trung khi nhặt đúng số quả táo.',
    images: ['/og-apple-pick.jpg'],
  },
};

export default function Page() {
  return <ApplePickGame />;
}
