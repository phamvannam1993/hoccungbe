import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { CAP_BAN_CUA_10 } from '../lib/bangCongTru';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import BangCongTruClient from './BangCongTruClient';

export const revalidate = 86400;

const TITLE = 'Bảng cộng, bảng trừ trong phạm vi 10 và 20 cho bé lớp 1';
const DESCRIPTION =
  'Bảng cộng trừ bấm được: bấm một ô là nghe đọc và mọi phép cho cùng kết quả sáng lên, bé thấy được quy luật thay vì học vẹt. Có chế độ đố nhanh, ẩn kết quả hoặc ẩn số hạng. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bang-cong-tru') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bang-cong-tru'),
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
      { '@type': 'ListItem', position: 2, name: 'Bảng cộng trừ', item: `${SITE_URL}/bang-cong-tru` },
    ],
  };

  const faq = [
    {
      q: 'Bé cần thuộc bảng cộng trừ đến mức nào?',
      a: 'Trong phạm vi 10 thì phải thuộc như thuộc tên mình — nhìn là ra, không đếm ngón tay. Trong phạm vi 20 thì cần nhanh, vì lên lớp 2 làm phép có nhớ đều dựa vào đó.',
    },
    {
      q: 'Cặp bạn của 10 là gì?',
      a: `Là các cặp cộng lại đúng bằng 10: ${CAP_BAN_CUA_10.map(([a, b]) => `${a}+${b}`).join(', ')}. Thuộc năm cặp này thì cộng qua 10 nhanh hẳn, ví dụ 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.`,
    },
    {
      q: 'Vì sao bảng ở đây khác bảng in trong vở?',
      a: 'Vì bấm được. Bấm một ô thì máy đọc phép đó và MỌI ô cho cùng kết quả sáng lên — bé thấy ngay 3+4, 4+3, 5+2 cùng ra 7. Bảng in không cho thấy quy luật này, nên bé dễ học vẹt từng dòng.',
    },
    {
      q: 'Chế độ ẩn số hạng để làm gì?',
      a: 'Dạng "3 + ? = 7" khó hơn hẳn "3 + 4 = ?" vì bé phải nghĩ ngược. Đây chính là nền của bài "tìm số hạng chưa biết" ở lớp 2, nên tập sớm là vừa.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng cộng trừ' }]} />

      <KidHero
        emoji="➕"
        eyebrow="Toán · Lớp 1"
        title="Bảng cộng trừ – bấm để thấy quy luật"
        tone="pink"
        description={
          <>
            Bảng trong phạm vi <strong>10 và 20</strong>. Bấm một ô là nghe đọc phép đó, và{' '}
            <strong>mọi ô cho cùng kết quả sáng lên</strong> — bé thấy 3+4, 4+3, 5+2 cùng ra 7. Có chế độ{' '}
            <strong>đố nhanh</strong>, ẩn kết quả hoặc ẩn số hạng.
          </>
        }
      />

      <BangCongTruClient />

      <div className="mt-8">
        <KidCard emoji="🤝" title="Năm cặp bạn của 10" tone="orange" badge="học trước tiên">
          <p className="text-sm leading-6 text-slate-600">
            {CAP_BAN_CUA_10.map(([a, b]) => `${a} + ${b}`).join(' · ')} — đều bằng 10.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Thuộc năm cặp này thì cộng qua 10 nhanh hẳn: <b>8 + 5</b> = 8 + <b>2</b> + 3 = 10 + 3 = <b>13</b>.
          </p>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-cuu-chuong', label: 'Bảng cửu chương', emoji: '✖️' },
              { href: '/dat-tinh', label: 'Đặt tính rồi tính – chấm từng cột', emoji: '🧮' },
              { href: '/luyen-tinh-nham', label: 'Luyện tính nhẩm', emoji: '⚡' },
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <KidFaq items={faq} tone="purple" />
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
