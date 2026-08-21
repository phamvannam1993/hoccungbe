import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { DONG_DAO } from '../lib/dongDao';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import DongDaoClient from './DongDaoClient';

export const revalidate = 86400;

const TITLE = 'Đồng dao, ca dao cho bé (có đọc mẫu)';
const DESCRIPTION =
  `Tuyển tập ${DONG_DAO.length} bài đồng dao và ca dao dân gian quen thuộc cho bé: Dung dăng dung dẻ, Nu na nu nống, Công cha như núi Thái Sơn… Nghe đọc mẫu từng câu, đọc cả bài, kèm ý nghĩa. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/dong-dao-ca-dao') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/dong-dao-ca-dao'),
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
      { '@type': 'ListItem', position: 2, name: 'Đồng dao, ca dao', item: `${SITE_URL}/dong-dao-ca-dao` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đồng dao, ca dao' }]} />

      <KidHero
        emoji="🎶"
        eyebrow="Tiếng Việt · Văn hóa dân gian"
        title="Đồng dao & ca dao cho bé"
        tone="orange"
        description={
          <>
            {DONG_DAO.length} bài <strong>đồng dao, ca dao</strong> dân gian quen thuộc — vừa vui, vừa dạy bé điều hay. Bé{' '}
            <strong>nghe đọc mẫu từng câu</strong>, bấm <strong>đọc cả bài</strong>; ca dao có kèm <strong>ý nghĩa</strong>{' '}
            để ba mẹ giảng cho bé.
          </>
        }
      />

      <DongDaoClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/tap-doc-tieng-viet', label: 'Tập đọc tiếng Việt', emoji: '📖' },
              { href: '/hoc-doc-tieng-viet', label: 'Học đọc (đánh vần)', emoji: '🔤' },
              { href: '/chinh-ta-tieng-viet', label: 'Chính tả phân biệt', emoji: '✍️' },
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
