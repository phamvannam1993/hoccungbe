import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

// Trang gom các game luyện nghe tiếng Anh.
//
// Có hub riêng vì các game này dùng chung một kho từ và chung một mạch: nghe →
// nhận mặt hình → nhận mặt chữ → phản xạ. Bé chơi xong một game cần thấy ngay
// bước tiếp theo, chứ không phải quay về trang chủ tìm lại.

const title = 'Game luyện nghe tiếng Anh cho bé lớp 1–5';
const description =
  'Bốn cách luyện nghe tiếng Anh cho học sinh tiểu học: nghe chọn hình, nghe đoán từ, nghe nhanh 60 giây và nghe truyện trả lời câu hỏi. '
  + 'Từ vựng chia sẵn theo lớp, phát âm chuẩn, có nghe chậm. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: canonical('/luyen-nghe') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/luyen-nghe'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

const GAME = [
  {
    href: '/nghe-chon-hinh', emoji: '🎧', ten: 'Nghe chọn hình',
    mo: 'Nghe từ rồi chọn đúng hình trong bốn hình.',
    hop: 'Dễ nhất — hợp bé mới bắt đầu',
    mau: 'from-sky-400 to-cyan-400',
  },
  {
    href: '/nghe-doan-tu', emoji: '🕵️', ten: 'Nghe đoán từ',
    mo: 'Nhìn hình, nghe từ rồi chọn đúng cách viết.',
    hop: 'Bước tiếp theo — tập nhận mặt chữ',
    mau: 'from-emerald-400 to-teal-400',
  },
  {
    href: '/nghe-nhanh', emoji: '⚡', ten: 'Nghe nhanh 60 giây',
    mo: 'Trả lời càng nhiều càng tốt trong một phút.',
    hop: 'Khi bé đã quen — luyện phản xạ',
    mau: 'from-rose-400 to-orange-400',
  },
  {
    href: '/nghe-truyen', emoji: '📖', ten: 'Nghe truyện tiếng Anh',
    mo: 'Nghe truyện ngắn rồi trả lời câu hỏi.',
    hop: 'Khó nhất — luyện nghe hiểu cả đoạn',
    mau: 'from-amber-400 to-yellow-400',
  },
  {
    href: '/vong-tu-vung', emoji: '🎡', ten: 'Vòng tròn từ vựng',
    mo: 'Học từ mới theo lớp và theo chủ đề trước khi chơi.',
    hop: 'Học từ — nơi bắt đầu',
    mau: 'from-violet-400 to-fuchsia-400',
  },
];

export default function Page() {
  return (
    // Nền phủ hai chỗ: min-h-screen cho khớp <main> của SiteShell, và -mb-24/pb-32
    // cho phần đệm chừa thanh nav dưới ở mobile.
    <div className="-mb-24 min-h-screen pb-32 lg:-mb-0 lg:pb-10"
      style={{ background: 'linear-gradient(165deg,#f0f9ff 0%,#faf5ff 55%,#fff7ed 100%)' }}>
      <header className="mx-auto max-w-2xl px-4 pt-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-sky-600 shadow-sm backdrop-blur">
          🎧 Luyện nghe tiếng Anh
        </span>
        <h1 className="chu-mau mt-2 bg-gradient-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
          Bé luyện nghe tiếng Anh
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold text-slate-500">
          Từ nhận mặt từ tới nghe hiểu cả đoạn, năm chặng luyện nối tiếp nhau. Chọn lớp của bé là có ngay từ vừa sức.
        </p>
      </header>

      <ul className="mx-auto mt-6 grid max-w-2xl gap-3 px-4 sm:grid-cols-2">
        {GAME.map((g) => (
          <li key={g.href}>
            <Link href={g.href}
              className="flex h-full flex-col rounded-[26px] border-2 border-white bg-white/85 p-4 shadow-[0_5px_0_rgba(148,163,184,.25)] transition hover:-translate-y-0.5">
              <span className={`mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${g.mau} text-3xl`} aria-hidden>
                {g.emoji}
              </span>
              <span className="chu-mau text-lg font-black text-slate-800">{g.ten}</span>
              <span className="mt-0.5 text-sm font-bold text-slate-500">{g.mo}</span>
              <span className="mt-2 text-[11px] font-black uppercase tracking-wide text-slate-400">{g.hop}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-6 max-w-2xl px-4 text-center text-xs font-bold leading-6 text-slate-400">
        Ba hình sai trong mỗi câu đều lấy cùng một chủ đề với hình đúng — để bé phải nghe ra từ,
        chứ không đoán được bằng cách loại trừ.
      </p>
    </div>
  );
}
