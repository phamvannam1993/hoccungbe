import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { LTC_TOPICS, totalLtcQuestions } from '../lib/luyenTuCau';
import { KidShell } from '../components/seo/kid';
import { PageHeader, HocTiep } from '../components/khung';
import LuyenTuCauClient from './LuyenTuCauClient';

export const revalidate = 86400;

const TITLE = 'Luyện từ và câu tiếng Việt cho bé (lớp 2–3)';
const DESCRIPTION =
  'Luyện từ và câu tiếng Việt cho bé lớp 2–3: từ chỉ sự vật, hoạt động, đặc điểm; dấu câu; từ trái nghĩa. Trò chơi có quy tắc và giải thích. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/luyen-tu-va-cau') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/luyen-tu-va-cau'),
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
      { '@type': 'ListItem', position: 2, name: 'Luyện từ và câu', item: `${SITE_URL}/luyen-tu-va-cau` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <PageHeader
        href="/luyen-tu-va-cau"
        crumbLabel="Luyện từ và câu"
        emoji="🧩"
        eyebrow="Tiếng Việt · Lớp 2–3"
        title="Luyện từ và câu"
        description={
          <>
            Bé luyện <strong>từ và câu</strong> qua trò chơi chọn đáp án: từ chỉ <strong>sự vật, hoạt động, đặc điểm</strong>,{' '}
            <strong>dấu câu</strong> và <strong>từ trái nghĩa</strong>. {totalLtcQuestions()} câu có quy tắc, ví dụ và giải
            thích, chọn đúng có tiếng khen ngay.
          </>
        }
      />

      <LuyenTuCauClient />

      <HocTiep href="/luyen-tu-va-cau" links={[
        { href: '/chinh-ta-tieng-viet', label: 'Chính tả phân biệt (s/x, ch/tr…)', emoji: '✍️' },
        { href: '/hoc-doc-tieng-viet', label: 'Học đọc tiếng Việt (đánh vần)', emoji: '📖' },
        { href: '/bai-tap/tieng-viet-lop-2', label: 'Bài tập Tiếng Việt lớp 2', emoji: '📝' },
        { href: '/bai-tap/tieng-viet-lop-3', label: 'Bài tập Tiếng Việt lớp 3', emoji: '📝' },
      ]} />
    </KidShell>
  );
}
