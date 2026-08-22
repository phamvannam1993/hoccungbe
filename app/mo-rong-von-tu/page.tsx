import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VON_TU_TOPICS, totalVonTu } from '../lib/vonTu';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import VonTuClient from './VonTuClient';

export const revalidate = 86400;

const TITLE = 'Mở rộng vốn từ tiếng Việt cho bé theo chủ đề';
const DESCRIPTION =
  `Mở rộng vốn từ tiếng Việt cho bé theo ${VON_TU_TOPICS.length} chủ đề: con vật, nghề nghiệp, thiên nhiên, cảm xúc… Mỗi từ có nghĩa, ví dụ và phát âm. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/mo-rong-von-tu') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/mo-rong-von-tu'),
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
      { '@type': 'ListItem', position: 2, name: 'Mở rộng vốn từ', item: `${SITE_URL}/mo-rong-von-tu` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Mở rộng vốn từ' }]} />

      <KidHero
        emoji="📚"
        eyebrow="Tiếng Việt · Vốn từ"
        title="Mở rộng vốn từ theo chủ đề"
        tone="purple"
        description={
          <>
            Bé học thêm <strong>{totalVonTu()} từ ngữ</strong> theo {VON_TU_TOPICS.length} chủ đề quen thuộc (con vật, nghề
            nghiệp, thiên nhiên, cảm xúc…). Mỗi từ có <strong>nghĩa dễ hiểu, câu ví dụ và nghe phát âm</strong> để bé hiểu
            và dùng từ đúng.
          </>
        }
      />

      <VonTuClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/tap-doc-tieng-viet', label: 'Tập đọc tiếng Việt', emoji: '📖' },
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
              { href: '/chinh-ta-tieng-viet', label: 'Chính tả phân biệt', emoji: '✍️' },
              { href: '/dong-dao-ca-dao', label: 'Đồng dao, ca dao', emoji: '🎶' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
