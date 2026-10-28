import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero } from '../components/seo/kid';
import BaoCaoClient from './BaoCaoClient';
import IqUpsell from '../components/upsell/IqUpsell';

export const revalidate = 86400;

const TITLE = 'Báo cáo tuần của bé';
const DESCRIPTION =
  'Bản tóm tắt 7 ngày qua cho phụ huynh: bé học bao nhiêu bài, độ chính xác, môn chăm nhất, chuỗi ngày và gợi ý cho tuần tới. Dễ đọc, chia sẻ được.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bao-cao') },
  robots: { index: false, follow: true }, // trang cá nhân của bé — không cần index
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bao-cao'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
};

export default function Page() {
  return (
    <KidShell max="3xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Báo cáo tuần' }]} />
      <KidHero
        emoji="📊"
        eyebrow="Dành cho phụ huynh"
        title="Báo cáo tuần của bé"
        tone="sky"
        description={
          <>
            Xem nhanh <strong>7 ngày qua</strong> bé đã học gì, tiến bộ ra sao và nên tập trung điều gì tuần tới — để đồng hành cùng con dễ dàng hơn.
          </>
        }
      />
      <BaoCaoClient />
      <IqUpsell
        spot="bao-cao"
        className="mt-6"
        title="Muốn bé tiến bộ nhanh hơn ở môn Toán?"
        body="Toán IQ trọn lớp có 12 khóa, 60 bài thử thách tư duy, tự chấm và giải thích từng bước."
      />
    </KidShell>
  );
}
