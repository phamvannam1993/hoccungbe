import type { Metadata } from 'next';
import ShopProvider from './components/ShopProvider';
import { shopInfo } from './lib/catalog';
import './khoa-hoc-vui.css';

export const metadata: Metadata = {
  title: {
    default: 'Toán IQ lớp 1, lớp 2 – khóa thử thách tư duy cho bé',
    template: '%s | Toán IQ vui',
  },
  description:
    'Các khóa Toán IQ lớp 1 và lớp 2, mỗi lớp 12 khóa với 60 bài thử thách dạng game: quy luật, logic, đếm hình, thời gian, tiền bạc, đo lường… Có đếm ngược, gợi ý cách làm và lời giải từng bước.',
  alternates: { canonical: '/khoa-hoc-vui' },
};

// Khu bán khóa học độc lập: không dùng header/footer của trang chính (xem SiteShell).
export default function KhoaHocVuiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="khv-root">
      <ShopProvider shop={shopInfo}>{children}</ShopProvider>
    </div>
  );
}
