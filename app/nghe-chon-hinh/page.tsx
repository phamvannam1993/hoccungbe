import type { Metadata } from 'next';
import GameNgheChonHinh from './GameNgheChonHinh';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Nghe chọn hình tiếng Anh: game luyện nghe cho bé lớp 1–5';
const description =
  'Nghe một từ tiếng Anh rồi chọn đúng hình trong bốn hình. Từ vựng chia sẵn theo lớp 1 đến lớp 5, có nghe chậm và đọc nghĩa khi chọn sai. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/nghe-chon-hinh') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/nghe-chon-hinh'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="🎧 Luyện nghe"
      tieuDe="Nghe chọn hình"
      moTa="Nghe từ tiếng Anh rồi chọn đúng hình. Chọn lớp của bé để nhận từ vừa sức."
      nen="linear-gradient(165deg,#f0f9ff 0%,#faf5ff 50%,#fff7ed 100%)"
      trangTri={['🎧', '⭐', '🔊', '🖼️']}
    >
      <GameNgheChonHinh />
    </NenGameNghe>
  );
}
