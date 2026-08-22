import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VN_LETTERS, totalVan } from '../lib/vietReading';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import VietReadingClient from './VietReadingClient';

export const revalidate = 86400;

const TITLE = 'Học đọc tiếng Việt: bảng chữ cái, đánh vần, bảng vần';
const DESCRIPTION =
  'Bé lớp 1 học đọc tiếng Việt: bảng chữ cái 29 chữ, tập đánh vần, 6 dấu thanh và bảng vần đầy đủ. Bấm nghe giọng đọc chuẩn, tập đọc từng bước. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/hoc-doc-tieng-viet') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/hoc-doc-tieng-viet'),
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
      { '@type': 'ListItem', position: 2, name: 'Học đọc tiếng Việt', item: `${SITE_URL}/hoc-doc-tieng-viet` },
    ],
  };

  const faq = [
    { q: 'Đánh vần tiếng Việt là gì?', a: 'Đánh vần là đọc tách từng phần của tiếng rồi ghép lại: âm đầu – vần – thêm dấu thanh. Ví dụ "bà": bờ – a – ba – huyền – bà. Đây là cách trẻ lớp 1 tập đọc.' },
    { q: 'Tiếng Việt có mấy dấu thanh?', a: 'Có 6 thanh: ngang (không dấu), huyền, sắc, hỏi, ngã, nặng. Dấu thanh làm thay đổi nghĩa của tiếng, ví dụ: ma – mà – má – mả – mã – mạ.' },
    { q: 'Nên cho bé học đọc khi nào?', a: 'Khi bé đã nhận mặt được các chữ cái và âm cơ bản (thường đầu lớp 1), bé có thể bắt đầu tập đánh vần ghép tiếng.' },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Học đọc tiếng Việt' }]} />

      <KidHero
        emoji="📖"
        eyebrow="Tiếng Việt · Tập đọc lớp 1"
        title="Học đọc tiếng Việt"
        tone="pink"
        description={
          <>
            Bé tập đọc theo đúng thứ tự: <strong>{VN_LETTERS.length} chữ cái</strong> có phát âm →{' '}
            <strong>đánh vần & 6 dấu thanh</strong> → <strong>{totalVan()} vần thường gặp</strong>. Bấm để nghe giọng đọc
            chuẩn, tập đọc trơn từng bước.
          </>
        }
      />

      <VietReadingClient />

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="orange">
          <KidFaq items={faq} tone="orange" />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai', label: 'Bảng chữ cái tiếng Việt', emoji: '🅰️' },
              { href: '/luyen-viet-chu', label: 'Luyện viết chữ', emoji: '✍️' },
              { href: '/khoa-hoc/tieng-viet-lop-1', label: 'Khóa Tiếng Việt lớp 1', emoji: '🎒' },
              { href: '/bai-tap/tieng-viet-lop-1', label: 'Bài tập Tiếng Việt lớp 1', emoji: '📝' },
            ]}
          />
        </KidCard>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
    </KidShell>
  );
}
