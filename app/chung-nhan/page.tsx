import type { Metadata } from 'next';
import ChungNhanClient from './ChungNhanClient';

export const metadata: Metadata = {
  title: 'Chứng nhận hoàn thành',
  description: 'Xem và in chứng nhận hoàn thành khóa học của bé trên Bé Hay Học.',
  alternates: { canonical: '/chung-nhan' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ChungNhanClient />;
}
