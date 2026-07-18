import type { Metadata } from 'next';
import KhaoSatClient from './KhaoSatClient';

export const metadata: Metadata = {
  title: 'Khảo sát đầu vào',
  description: 'Khảo sát ngắn 10–15 câu giúp Bé Hay Học hiểu năng lực của bé và tạo lộ trình học cá nhân hóa phù hợp.',
  alternates: { canonical: '/khao-sat-dau-vao' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <KhaoSatClient />;
}
