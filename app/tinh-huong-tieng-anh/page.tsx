import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero } from '../components/seo/kid';
import SituationsClient from './SituationsClient';

export const revalidate = 86400;

const TITLE = '360 tình huống tiếng Anh cho ba mẹ nói với con';
const DESCRIPTION =
  'Chưa biết nói gì tiếng Anh với con? Bắt đầu với 360 tình huống hằng ngày: buổi sáng, giờ ăn, tắm rửa, vui chơi, an toàn, lễ phép, sức khỏe, ở trường, đi ngủ… Mỗi câu có nghe, nghe chậm và nghĩa tiếng Việt.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tinh-huong-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tinh-huong-tieng-anh'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <KidShell max="3xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tình huống tiếng Anh' }]} />
      <KidHero
        emoji="🗣️"
        eyebrow="Tiếng Anh · Giao tiếp cùng con"
        title="Chưa biết nói gì tiếng Anh với con?"
        tone="pink"
        description={
          <>
            Bắt đầu với <strong>360 tình huống</strong> hằng ngày — buổi sáng, giờ ăn, tắm rửa, vui chơi, an toàn, lễ phép, sức khỏe, ở trường, đi ngủ… Mỗi câu có
            <strong> nghe</strong>, <strong>nghe chậm</strong> và <strong>nghĩa tiếng Việt</strong> để ba mẹ nói cùng con tự tin hơn.
          </>
        }
      />
      <SituationsClient />
    </KidShell>
  );
}
