import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopProvider from './components/ShopProvider';
import IconOverrides from './components/IconOverrides';
import AccessSync from './components/AccessSync';
import PaymentReturn from './components/PaymentReturn';
import { getIconOverrides } from './lib/icons-server';
import { shopInfo } from './lib/catalog';
import './khoa-hoc-iq.css';

export const metadata: Metadata = {
  title: {
    default: 'Toán IQ lớp 1, lớp 2 – khóa thử thách tư duy cho bé',
    template: '%s | Toán IQ vui',
  },
  description:
    'Các khóa Toán IQ lớp 1 và lớp 2, mỗi lớp 12 khóa với 60 bài thử thách dạng game: quy luật, logic, đếm hình, thời gian, tiền bạc, đo lường… Có đếm ngược, gợi ý cách làm và lời giải từng bước.',
  alternates: { canonical: '/khoa-hoc-iq' },
};

// Khu bán khóa học độc lập: không dùng header/footer của trang chính (xem SiteShell).
export default async function KhoaHocVuiLayout({ children }: { children: React.ReactNode }) {
  const icons = await getIconOverrides();
  return (
    <div className="khv-root">
      <IconOverrides icons={icons}>
        <ShopProvider shop={shopInfo}>{children}</ShopProvider>
        <Suspense fallback={null}>
          <AccessSync />
          <PaymentReturn />
        </Suspense>
      </IconOverrides>
    </div>
  );
}
