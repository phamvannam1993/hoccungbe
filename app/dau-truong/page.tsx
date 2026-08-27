import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero } from '../components/seo/kid';
import DauTruongClient from './DauTruongClient';

export const revalidate = 3600;

const TITLE = 'Đấu Trường — Thử thách Toán tốc độ';
const DESCRIPTION =
  'Thi đấu Toán tốc độ 60 giây trên Bé Hay Học: trả lời càng nhiều phép tính đúng càng tốt, ghi điểm lên bảng xếp hạng tuần. Miễn phí, vui và kịch tính cho bé.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/dau-truong') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/dau-truong'),
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
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đấu Trường' }]} />
      <KidHero
        emoji="⚔️"
        eyebrow="Thi đấu"
        title="Đấu Trường Toán tốc độ"
        tone="orange"
        description={
          <>
            Thi đấu <strong>Toán tốc độ</strong> hoặc <strong>Đố vui khám phá</strong>: trả lời đúng liên tiếp càng nhiều càng tốt —
            sai một câu là dừng! Điểm cao nhất tuần lên <strong>bảng xếp hạng riêng từng môn, từng lớp</strong>.
          </>
        }
      />
      <DauTruongClient />
    </KidShell>
  );
}
