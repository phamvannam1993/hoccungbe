import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb } from '../components/seo/kid';
import ThiTaiClient from './ThiTaiClient';

export const revalidate = 86400;

const TITLE = 'Thi Tài — sân thi đấu kiến thức cho bé';
const DESCRIPTION =
  'Thi Tài Bé Hay Học: thi đấu Toán, Tiếng Anh và Khám phá tính giờ, có combo điểm, huy chương Vàng–Bạc–Đồng và hạng mùa. Bé vừa thi vừa nhận sao và khoe thành tích.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/thi-tai') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/thi-tai'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <KidShell max="5xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đấu Trường' }]} />
      <ThiTaiClient />
    </KidShell>
  );
}
