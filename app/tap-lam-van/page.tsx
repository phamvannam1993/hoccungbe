import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { TAP_LAM_VAN } from '../lib/tapLamVan';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import TapLamVanClient from './TapLamVanClient';

export const revalidate = 86400;

const TITLE = 'Tập làm văn lớp 2–3 cho bé (dàn ý + bài văn mẫu)';
const DESCRIPTION =
  `Tập làm văn cho bé lớp 2–3 với ${TAP_LAM_VAN.length} đề: tả con mèo, cây bàng, tả mẹ, cái cặp, kể ngày đầu đi học… Có dàn ý gợi ý, từ ngữ hay, bài văn mẫu nghe được và ô cho bé tự viết. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tap-lam-van') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tap-lam-van'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tập làm văn', item: `${SITE_URL}/tap-lam-van` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tập làm văn' }]} />

      <KidHero
        emoji="✍️"
        eyebrow="Tiếng Việt · Lớp 2–3"
        title="Tập làm văn cho bé"
        tone="green"
        description={
          <>
            {TAP_LAM_VAN.length} đề tập làm văn quen thuộc (tả con vật, cây cối, người thân, đồ vật; kể chuyện). Mỗi đề có{' '}
            <strong>dàn ý gợi ý, từ ngữ hay, bài văn mẫu nghe được</strong> và <strong>ô cho bé tự viết</strong> (lưu tự động).
          </>
        }
      />

      <TapLamVanClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
              { href: '/mo-rong-von-tu', label: 'Mở rộng vốn từ', emoji: '📚' },
              { href: '/truyen-co-tich', label: 'Truyện cổ tích Việt Nam', emoji: '📖' },
              { href: '/tap-doc-tieng-viet', label: 'Tập đọc tiếng Việt', emoji: '📖' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
