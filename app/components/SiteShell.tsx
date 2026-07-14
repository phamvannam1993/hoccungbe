'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from './edu/SiteHeader';
import Footer from './edu/Footer';
import GuestWelcomeModal from './edu/GuestWelcomeModal';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  // Quiz play pages: /[lessonSlug]/[exercise] — two segments, second is bai-tap-*
  const segments = pathname.split('/').filter(Boolean);
  const isQuizPlay = segments.length === 2 && segments[1].startsWith('bai-tap');
  if (isAdmin || isQuizPlay) return <>{children}</>;
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <GuestWelcomeModal />
    </>
  );
}
