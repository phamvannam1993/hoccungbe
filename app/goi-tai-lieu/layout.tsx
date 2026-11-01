import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopProvider from '../khoa-hoc-iq/components/ShopProvider';
import AccessSync from '../khoa-hoc-iq/components/AccessSync';
import PaymentReturn from '../khoa-hoc-iq/components/PaymentReturn';
import { shopInfo } from '../khoa-hoc-iq/lib/catalog';
import '../khoa-hoc-iq/khoa-hoc-iq.css';

export const metadata: Metadata = {
  title: { default: 'Gói tài liệu in cho bé', template: '%s | Bé Hay Học' },
  description: 'Bộ đề ôn thi học kỳ có đáp án, trọn bộ card Phonics tiếng Anh — in A4 hoặc lưu PDF.',
  alternates: { canonical: '/goi-tai-lieu' },
};

// Mua và quyền tải dùng chung với Toán IQ: mã kích hoạt, payOS, cookie khv_access.
export default function GoiTaiLieuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="khv-root">
      <ShopProvider shop={shopInfo}>{children}</ShopProvider>
      <Suspense fallback={null}>
        <AccessSync />
        <PaymentReturn />
      </Suspense>
    </div>
  );
}
