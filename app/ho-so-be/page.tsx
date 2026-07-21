import type { Metadata } from 'next';
import HoSoBeClient from './HoSoBeClient';

export const metadata: Metadata = {
  title: 'Hồ sơ của bé',
  description: 'Tạo và quản lý hồ sơ học tập cho từng bé trên Bé Hay Học.',
  alternates: { canonical: '/ho-so-be' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <HoSoBeClient />;
}
