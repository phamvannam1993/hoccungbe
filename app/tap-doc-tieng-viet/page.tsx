import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { TAP_DOC } from '../lib/tapDoc';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import TapDocClient from './TapDocClient';

export const revalidate = 86400;

const TITLE = 'Tập đọc tiếng Việt cho bé lớp 1–2 (có đọc mẫu)';
const DESCRIPTION =
  `Tập đọc tiếng Việt cho trẻ lớp 1–2 với ${TAP_DOC.length} bài đọc ngắn theo chủ đề quen thuộc: gia đình, con vật, trường lớp. Nghe đọc mẫu từng câu, đọc cả bài và trả lời câu hỏi đọc hiểu. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tap-doc-tieng-viet') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tap-doc-tieng-viet'),
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
      { '@type': 'ListItem', position: 2, name: 'Tập đọc tiếng Việt', item: `${SITE_URL}/tap-doc-tieng-viet` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tập đọc tiếng Việt' }]} />

      <KidHero
        emoji="📖"
        eyebrow="Tiếng Việt · Đọc hiểu"
        title="Tập đọc tiếng Việt"
        tone="sky"
        description={
          <>
            {TAP_DOC.length} bài đọc ngắn cho bé lớp 1–2 theo chủ đề quen thuộc. Bé <strong>nghe đọc mẫu từng câu</strong>,{' '}
            bấm <strong>đọc cả bài</strong> rồi trả lời <strong>câu hỏi đọc hiểu</strong> — bước từ đọc trơn lên đọc hiểu.
          </>
        }
      />

      <TapDocClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/hoc-doc-tieng-viet', label: 'Học đọc tiếng Việt (đánh vần)', emoji: '📖' },
              { href: '/chinh-ta-tieng-viet', label: 'Chính tả phân biệt', emoji: '✍️' },
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
              { href: '/bai-tap/tieng-viet-lop-1', label: 'Bài tập Tiếng Việt lớp 1', emoji: '📝' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
