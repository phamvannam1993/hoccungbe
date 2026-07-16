import type { Metadata } from 'next';
import HocHomNayClient from './HocHomNayClient';

export const metadata: Metadata = {
  title: 'Học hôm nay',
  description: 'Cùng bé học mỗi ngày — nhiệm vụ hôm nay, tiến độ và gợi ý bài học phù hợp cho bé.',
  alternates: { canonical: '/hoc-hom-nay' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HocHomNayClient />;
}
