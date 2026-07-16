'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from './edu/SiteHeader';
import Footer from './edu/Footer';
import GuestWelcomeModal from './edu/GuestWelcomeModal';
import BottomNav from './edu/BottomNav';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  // Quiz play pages: /[lessonSlug]/[exercise] — two segments, second is bai-tap-*
  const segments = pathname.split('/').filter(Boolean);
  // Trang làm bài: /[lessonSlug]/bai-tap-* HOẶC /[lessonSlug]/[slug]-{de|trung-binh|nang-cao}.html
  const isQuizPlay =
    segments.length === 2 &&
    (segments[1].startsWith('bai-tap') || /-(de|trung-binh|nang-cao)(\.html)?$/.test(segments[1]));
  // Phiếu bài tập in ra giấy → không kèm header/footer.
  const isWorksheet = pathname.startsWith('/phieu-bai-tap');
  if (isAdmin || isWorksheet) return <>{children}</>;
  return (
    <>
      <SiteHeader />
      {/* pb-24 trên mobile để thanh điều hướng dưới không che nội dung.
          Trang làm bài tự chừa bên trong nền gradient của nó → tránh lòi nền teal của body. */}
      <main className={`min-h-screen ${isQuizPlay ? '' : 'pb-24 lg:pb-0'}`}>{children}</main>
      {/* Trang làm bài: bỏ footer để bé thấy trọn bài, không phải cuộn qua footer dài */}
      {!isQuizPlay && <Footer />}
      <BottomNav />
      <GuestWelcomeModal />
    </>
  );
}
