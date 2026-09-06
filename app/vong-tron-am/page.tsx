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
    // KHÔNG ép cao 100dvh: trên điện thoại nội dung ngắn hơn màn hình nên phần
    // dư thành một mảng trống rồi đụng nền footer, tạo vệt màu chìa ra rất xấu.
    // Để nền cao đúng bằng nội dung thì trang nối liền mạch với phần bên dưới.
    // <main> của SiteShell đã có pb-24 (chừa chỗ cho thanh nav dưới); phần đệm đó
    // để lộ nền teal của <body> thành một vệt màu chìa ra. Kéo nền của trang phủ
    // luôn qua đó: pb-32 vẽ nền xuống thấp hơn, -mb-24 bù lại để không dôi chiều cao.
    <div className="-mb-24 pb-32 lg:-mb-0 lg:pb-8" style={{ background: 'linear-gradient(180deg,#fffdf7 0%,#fff6ef 60%,#fdf2f8 100%)' }}>
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
