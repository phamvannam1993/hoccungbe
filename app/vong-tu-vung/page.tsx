import type { Metadata } from 'next';
import VongTuVungClient from './VongTuVungClient';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VONG_TU_VUNG, CAC_LOP, chuDeTheoLop } from '../lib/vongTuVung';

const soTu = VONG_TU_VUNG.reduce((a, v) => a + v.tu.length, 0);
const soChuDe = CAC_LOP.reduce((a, l) => a + chuDeTheoLop(l).length, 0);

const title = 'Vòng tròn từ vựng tiếng Anh: học theo lớp và theo chủ đề';
const description =
  `Bánh xe ${soChuDe} chủ đề từ vựng tiếng Anh tiểu học, chia sẵn theo lớp 1 đến lớp 5. `
  + 'Bấm vào từ để nghe phát âm chuẩn, nghe chậm từng âm, xem phiên âm, nghĩa và câu ví dụ.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/vong-tu-vung') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/vong-tu-vung'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="🎡 Từ vựng tiếng Anh"
      tieuDe="Vòng tròn từ vựng"
      moTa={`Chọn lớp và chủ đề, bấm vào từng ô để nghe phát âm, xem phiên âm và nghĩa. Hơn ${soTu.toLocaleString('vi-VN')} từ chia theo ${soChuDe} chủ đề.`}
      nen="linear-gradient(165deg,#ecfeff 0%,#eff6ff 50%,#faf5ff 100%)"
      trangTri={['🎡', '🔤', '🌍', '⭐']}
    >
      <VongTuVungClient />
    </NenGameNghe>
  );
}
