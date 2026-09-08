import type { Metadata } from 'next';
import VongTuVungClient from './VongTuVungClient';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VONG_TU_VUNG, CAC_LOP, chuDeTheoLop } from '../lib/vongTuVung';

const soTu = VONG_TU_VUNG.reduce((a, v) => a + v.tu.length, 0);
const soChuDe = CAC_LOP.reduce((a, l) => a + chuDeTheoLop(l).length, 0);

const title = 'Vòng tròn từ vựng tiếng Anh: học theo lớp và theo chủ đề';
const description =
  `Bánh xe ${soChuDe} chủ đề từ vựng tiếng Anh tiểu học, chia sẵn theo lớp 1 đến lớp 5. `
  + 'Bấm vào từ để nghe phát âm chuẩn, nghe chậm từng âm, xem phiên âm, nghĩa và câu ví dụ.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/vong-tu-vung') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/vong-tu-vung'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    // Nền phải phủ HAI chỗ, thiếu chỗ nào cũng lòi nền teal của <body>:
    //  • min-h-screen — <main> của SiteShell cũng min-h-screen, nội dung ngắn hơn
    //    màn hình thì main vẫn cao 100vh; trang không cao theo là hở đáy.
    //  • -mb-24 + pb-32 — main còn có pb-24 chừa chỗ cho thanh nav dưới ở mobile.
    <div className="-mb-24 min-h-screen pb-32 lg:-mb-0 lg:pb-8"
      style={{ background: 'linear-gradient(180deg,#f0fdfa 0%,#eff6ff 55%,#faf5ff 100%)' }}>
      <header className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <h1 className="chu-mau text-2xl font-black text-slate-900 sm:text-3xl">🎡 Vòng tròn từ vựng tiếng Anh</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm font-bold text-slate-500">
          Chọn lớp và chủ đề, bấm vào từng ô để nghe phát âm, xem phiên âm và nghĩa.
          Hơn {soTu.toLocaleString('vi-VN')} từ chia theo {soChuDe} chủ đề.
        </p>
      </header>
      <VongTuVungClient />
    </div>
  );
}
