import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { TRUYEN_CO_TICH } from '../lib/truyenCoTich';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import TruyenClient from './TruyenClient';

export const revalidate = 86400;

const TITLE = 'Truyện cổ tích Việt Nam cho bé (có đọc mẫu)';
const DESCRIPTION =
  `${TRUYEN_CO_TICH.length} truyện cổ tích Việt Nam cho bé: Thánh Gióng, Sơn Tinh–Thủy Tinh, Sự tích Hồ Gươm… Nghe đọc mẫu, kèm bài học và câu hỏi đọc hiểu. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/truyen-co-tich') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/truyen-co-tich'),
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
      { '@type': 'ListItem', position: 2, name: 'Truyện cổ tích', item: `${SITE_URL}/truyen-co-tich` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Truyện cổ tích' }]} />

      <KidHero
        emoji="📖"
        eyebrow="Tiếng Việt · Truyện dân gian"
        title="Truyện cổ tích Việt Nam"
        tone="orange"
        description={
          <>
            {TRUYEN_CO_TICH.length} truyện cổ tích quen thuộc (Thánh Gióng, Sơn Tinh – Thủy Tinh, Sự tích Hồ Gươm…). Bé{' '}
            <strong>nghe đọc mẫu từng câu</strong>, bấm <strong>đọc cả truyện</strong>, rút ra <strong>bài học</strong> và
            trả lời <strong>câu hỏi đọc hiểu</strong>.
          </>
        }
      />

      <TruyenClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/tap-doc-tieng-viet', label: 'Tập đọc tiếng Việt', emoji: '📖' },
              { href: '/dong-dao-ca-dao', label: 'Đồng dao, ca dao', emoji: '🎶' },
              { href: '/mo-rong-von-tu', label: 'Mở rộng vốn từ', emoji: '📚' },
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
