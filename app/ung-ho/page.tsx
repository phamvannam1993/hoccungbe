import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero } from '../components/seo/kid';
import UngHoClient from './UngHoClient';

export const revalidate = 86400;

const TITLE = 'Ủng hộ dự án Bé Hay Học';
const DESCRIPTION =
  'Bé Hay Học là nơi học miễn phí cho các bé. Nếu website hữu ích với gia đình, bạn có thể mời chúng tôi một cốc cà phê để góp một phần chi phí máy chủ, tên miền và thời gian làm thêm bài học mới.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/ung-ho') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/ung-ho'),
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
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Ủng hộ dự án' }]} />

      <KidHero
        emoji="☕"
        eyebrow="Ủng hộ dự án"
        title={`Mời ${SITE_NAME} một cốc cà phê`}
        tone="orange"
        description={
          <>
            {SITE_NAME} được xây dựng để các bé có thêm một nơi học <strong>đơn giản, vui và dễ sử dụng</strong>. Nếu website
            hữu ích với gia đình, bạn có thể mời chúng tôi một cốc cà phê để góp một phần <strong>chi phí máy chủ, tên miền</strong> và
            thời gian làm thêm bài học mới.
          </>
        }
      >
        <div className="mt-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-500">
          Việc ủng hộ hoàn toàn tự nguyện. Mọi bài học hiện có vẫn được sử dụng bình thường dù bạn có đóng góp hay không.
        </div>
      </KidHero>

      <UngHoClient />
    </KidShell>
  );
}
