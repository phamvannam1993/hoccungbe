import type { Metadata } from 'next';
import GameNgheTruyen from './GameNgheTruyen';
import { NenGameNghe } from '../components/edu/NenGameNghe';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { TRUYEN_NGHE } from '../lib/truyenNghe';

const soCauHoi = TRUYEN_NGHE.reduce((a, t) => a + t.hoi.length, 0);

const title = 'Nghe truyện tiếng Anh và trả lời câu hỏi — cho bé lớp 1–5';
const description =
  `${TRUYEN_NGHE.length} truyện tiếng Anh ngắn chia theo lớp 1 đến lớp 5, kèm ${soCauHoi} câu hỏi đọc hiểu. `
  + 'Bé nghe trước, chữ được che đi; nghe bao nhiêu lần cũng được rồi mới trả lời.';

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: canonical('/nghe-truyen') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`, description, url: canonical('/nghe-truyen'),
    type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <NenGameNghe
      nhan="📖 Luyện nghe"
      tieuDe="Nghe truyện tiếng Anh"
      moTa="Nghe truyện ngắn rồi trả lời câu hỏi. Chữ được che đi để bé nghe, không đọc."
      nen="linear-gradient(165deg,#fffbeb 0%,#f0f9ff 55%,#faf5ff 100%)"
      trangTri={['📖', '🎧', '💭', '⭐']}
    >
      <GameNgheTruyen />
    </NenGameNghe>
  );
}
