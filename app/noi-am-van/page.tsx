import type { Metadata } from 'next';
import GameNoiAmVan from './GameNoiAmVan';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Game nối âm vần: bé nhìn hình đoán chữ, tập đọc mà như chơi';
const description =
  'Nối hình với chữ đúng — bốn từ mỗi ván đều cùng một âm nên bé phải đọc hết phần vần mới nối trúng. Mỗi thẻ chữ có sẵn gợi ý đánh vần và nút nghe đọc.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/noi-am-van') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/noi-am-van'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

// Vệt trang trí nền. Đặt cố định theo phần trăm (không random) để bản dựng ở máy
// chủ và ở trình duyệt giống hệt nhau — random ở đây từng gây lỗi lệch hydration.
const TRANG_TRI = [
  { e: '🎈', trai: '4%', tren: '12%', co: 'text-4xl', tre: '0s' },
  { e: '⭐', trai: '92%', tren: '8%', co: 'text-3xl', tre: '1.1s' },
  { e: '🌈', trai: '88%', tren: '62%', co: 'text-4xl', tre: '2.3s' },
  { e: '✏️', trai: '6%', tren: '70%', co: 'text-3xl', tre: '1.7s' },
  { e: '🧩', trai: '50%', tren: '95%', co: 'text-3xl', tre: '3s' },
];

export default function Page() {
  return (
    // Nền phải phủ HAI chỗ, thiếu chỗ nào cũng lòi nền teal của <body>:
    //  • min-h-screen — <main> của SiteShell cũng min-h-screen, nên khi nội dung
    //    ngắn hơn màn hình thì main vẫn cao 100vh; trang không cao theo là hở đáy.
    //  • -mb-24 + pb-32 — main còn có pb-24 chừa chỗ cho thanh nav dưới ở mobile;
    //    đó là padding của thẻ CHA nên nền của trang không tự phủ tới.
    <div
      className="relative -mb-24 min-h-screen overflow-hidden pb-32 lg:-mb-0 lg:pb-10"
      style={{ background: 'linear-gradient(165deg,#fff7ed 0%,#faf5ff 45%,#eff6ff 100%)' }}
    >
      {/* Hai quầng sáng mờ tạo chiều sâu cho nền, không chắn nội dung */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

      {/* Hình trang trí — ẩn trên mobile cho khỏi rối, chỉ hiện từ màn hình vừa */}
      <div className="pointer-events-none absolute inset-0 hidden select-none sm:block" aria-hidden>
        {TRANG_TRI.map((t, i) => (
          <span
            key={i}
            className={`nav-troi absolute ${t.co} opacity-45`}
            style={{ left: t.trai, top: t.tren, animationDelay: t.tre }}
          >
            {t.e}
          </span>
        ))}
      </div>

      <header className="relative mx-auto max-w-3xl px-4 pt-7 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-violet-500 shadow-sm backdrop-blur">
          🎧 Nghe · nhìn · nối
        </span>
        <h1 className="chu-mau mt-2 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-sky-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
          Nối âm vần
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold text-slate-500">
          Nhìn hình bên trái, tìm đúng chữ bên phải rồi nối hai chấm lại với nhau.
        </p>
      </header>

      <div className="relative">
        <GameNoiAmVan />
      </div>
    </div>
  );
}
