import type { Metadata } from 'next';
import GameNgheNhanh from './GameNgheNhanh';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Nghe nhanh 60 giây: game phản xạ tiếng Anh cho bé';
const description =
  'Nghe từ tiếng Anh và chọn hình thật nhanh trong 60 giây. Đúng liền 3 câu được nhân đôi điểm. Từ vựng chia theo lớp 1 đến lớp 5.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: canonical('/nghe-nhanh') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/nghe-nhanh'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="⚡ Luyện nghe"
      tieuDe="Nghe nhanh 60 giây"
      moTa="Nghe từ, chọn hình thật nhanh. Đúng liền 3 câu thì được nhân đôi điểm."
      nen="linear-gradient(165deg,#fef2f2 0%,#faf5ff 50%,#f0f9ff 100%)"
      trangTri={['⚡', '⏱️', '🔥', '🏆']}
    >
      <GameNgheNhanh />
    </NenGameNghe>
  );
}
