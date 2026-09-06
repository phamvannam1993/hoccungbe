import type { Metadata } from 'next';
import VongTronAmClient from './VongTronAmClient';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Vòng tròn âm vần: học đánh vần tiếng Việt cho bé lớp 1';
const description =
  'Mỗi âm đầu một vòng tròn 10 từ quen thuộc: bé bấm nghe đọc, xem đánh vần từng bước theo đúng cách dạy lớp 1 (bờ – ong – bong – sắc – bóng, bờ – ăp – sắc – bắp) và đánh dấu từ đã học.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/vong-tron-am') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/vong-tron-am'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    // Nền kem ấm để vòng tròn nhiều màu nổi lên.
    //
    // Nền phải phủ HAI chỗ, thiếu chỗ nào cũng lòi nền teal của <body>:
    //  • min-h-screen — <main> của SiteShell cũng min-h-screen, nên khi nội dung
    //    ngắn hơn màn hình thì main vẫn cao 100vh; trang không cao theo là hở đáy.
    //  • -mb-24 + pb-32 — main còn có pb-24 chừa chỗ cho thanh nav dưới ở mobile;
    //    đó là padding của thẻ CHA nên nền của trang không tự phủ tới.
    <div className="-mb-24 min-h-screen pb-32 lg:-mb-0 lg:pb-8" style={{ background: 'linear-gradient(180deg,#fffdf7 0%,#fff6ef 60%,#fdf2f8 100%)' }}>
      <header className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <h1 className="chu-mau text-2xl font-black text-slate-900 sm:text-3xl">🎡 Vòng tròn âm vần</h1>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold text-slate-500">
          Chọn một âm, bấm vào từng ô để nghe đọc và tập đánh vần theo đúng cách dạy lớp 1.
        </p>
      </header>
      <VongTronAmClient />
    </div>
  );
}
