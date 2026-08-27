import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero } from '../components/seo/kid';
import BoSuuTapClient from './BoSuuTapClient';

export const revalidate = 86400;

const TITLE = 'Bộ sưu tập của bé';
const DESCRIPTION =
  'Hoàn thành bài tập để kiếm sao, rồi đổi sao lấy nhãn dán và thú cưng đáng yêu. Cách vui để bé giữ thói quen học mỗi ngày trên Bé Hay Học.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bo-suu-tap') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bo-suu-tap'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <KidShell max="4xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bộ sưu tập' }]} />
      <KidHero
        emoji="⭐"
        eyebrow="Phần thưởng"
        title="Bộ sưu tập của bé"
        tone="yellow"
        description={
          <>
            Mỗi bài tập hoàn thành, bé nhận được <strong>sao</strong>. Gom sao để <strong>mở khoá nhãn dán và thú cưng</strong> đáng yêu —
            vừa học vừa sưu tầm thật vui!
          </>
        }
      />
      <BoSuuTapClient />
    </KidShell>
  );
}
