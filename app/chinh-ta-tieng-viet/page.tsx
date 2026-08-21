import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { CHINH_TA_TOPICS, totalChinhTaQuestions } from '../lib/chinhTa';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import ChinhTaClient from './ChinhTaClient';

export const revalidate = 86400;

const TITLE = 'Chính tả tiếng Việt cho bé: phân biệt s/x, ch/tr, l/n, hỏi/ngã';
const DESCRIPTION =
  `Luyện chính tả tiếng Việt cho trẻ qua trò chơi: phân biệt s/x, ch/tr, l/n, d/gi/r và dấu hỏi/ngã. ${totalChinhTaQuestions()} câu có nghĩa, chọn đáp án đúng, nghe phát âm và giải thích. Sửa lỗi chính tả phổ biến. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/chinh-ta-tieng-viet') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/chinh-ta-tieng-viet'),
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
      { '@type': 'ListItem', position: 2, name: 'Chính tả tiếng Việt', item: `${SITE_URL}/chinh-ta-tieng-viet` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Chính tả tiếng Việt' }]} />

      <KidHero
        emoji="✍️"
        eyebrow="Tiếng Việt · Chính tả"
        title="Chính tả phân biệt cho bé"
        tone="pink"
        description={
          <>
            Sửa các lỗi chính tả hay gặp nhất của trẻ Việt qua <strong>trò chơi chọn đáp án</strong>: phân biệt{' '}
            <strong>s/x, ch/tr, l/n, d/gi/r</strong> và <strong>dấu hỏi/ngã</strong>. {totalChinhTaQuestions()} câu có nghĩa,
            chọn đúng là nghe từ đúng và có tiếng khen ngay.
          </>
        }
      />

      <ChinhTaClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/hoc-doc-tieng-viet', label: 'Học đọc tiếng Việt (đánh vần)', emoji: '📖' },
              { href: '/bang-chu-cai', label: 'Bảng chữ cái tiếng Việt', emoji: '🅰️' },
              { href: '/luyen-viet-chu', label: 'Luyện viết chữ', emoji: '✍️' },
              { href: '/bai-tap/tieng-viet-lop-2', label: 'Bài tập Tiếng Việt lớp 2', emoji: '📝' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
