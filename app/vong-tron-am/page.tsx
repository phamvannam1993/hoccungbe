import type { Metadata } from 'next';
import VongTronAmClient from './VongTronAmClient';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Vòng tròn âm vần: học đánh vần tiếng Việt cho bé lớp 1';
const description =
  'Mỗi âm đầu một vòng tròn 10 từ quen thuộc: bé bấm nghe đọc, xem đánh vần từng bước theo đúng cách dạy lớp 1 (bờ – ong – bong – sắc – bóng, bờ – ăp – sắc – bắp) và đánh dấu từ đã học.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/vong-tron-am') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/vong-tron-am'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="🎡 Tập đánh vần"
      tieuDe="Vòng tròn âm vần"
      moTa="Chọn một âm, bấm vào từng ô để nghe đọc và tập đánh vần theo đúng cách dạy lớp 1."
      nen="linear-gradient(165deg,#fff7ed 0%,#fdf2f8 50%,#f5f3ff 100%)"
      trangTri={['🎡', '🔤', '⭐', '📖']}
    >
      <VongTronAmClient />
    </NenGameNghe>
  );
}
