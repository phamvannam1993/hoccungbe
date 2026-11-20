import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import StadiumFrame from '../StadiumFrame';
import PhongClient from './PhongClient';

const PATH = '/san-choi-tri-tue/phong';
const TITLE = 'Phòng thi đấu — thử sức cùng bạn bè';
const DESCRIPTION =
  'Tạo phòng thi đấu Sân chơi Trí tuệ, gửi mã mời cho bạn bè: mọi người cùng làm 10 câu Toán, Tiếng Việt, Tiếng Anh, Khám phá trong 48 giờ, ai điểm cao nhất sẽ thắng.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical(PATH),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <StadiumFrame
      max="max-w-4xl"
      crumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Sân chơi Trí tuệ', href: '/san-choi-tri-tue' }, { label: 'Phòng thi đấu' }]}
    >
      <PhongClient />
    </StadiumFrame>
  );
}
