import type { Metadata } from 'next';
import GameNgheDoanTu from './GameNgheDoanTu';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

const title = 'Nghe đoán từ tiếng Anh: nhìn hình, nghe từ, chọn đúng cách viết';
const description =
  'Bé nhìn hình và nghe từ tiếng Anh, rồi chọn đúng cách viết trong bốn chữ. Từ vựng chia sẵn theo lớp 1 đến lớp 5, có nghe chậm và đọc nghĩa khi chọn sai.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: canonical('/nghe-doan-tu') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/nghe-doan-tu'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="🕵️ Luyện nghe"
      tieuDe="Nghe đoán từ"
      moTa="Nhìn hình, nghe từ tiếng Anh rồi chọn đúng cách viết."
      nen="linear-gradient(165deg,#ecfdf5 0%,#f0f9ff 50%,#faf5ff 100%)"
      trangTri={['🕵️', '🔤', '💡', '📖']}
    >
      <GameNgheDoanTu />
    </NenGameNghe>
  );
}
