import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/phanSo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import PhanSoClient from './PhanSoClient';

export const revalidate = 86400;

const TITLE = 'Phân số trực quan – học phân số bằng hình cho bé lớp 2 đến lớp 5';
const DESCRIPTION =
  'Bé tự tô bánh tròn và thanh dài để hiểu phân số: tô màu theo phân số, đọc phân số từ hình, so sánh hai phân số và cộng trừ cùng mẫu. Chia mức theo lớp 2–5, có giải thích từng bước. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/phan-so') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/phan-so'),
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
      { '@type': 'ListItem', position: 2, name: 'Phân số trực quan', item: `${SITE_URL}/phan-so` },
    ],
  };

  const faq = [
    {
      q: 'Bé học phân số từ lớp mấy?',
      a: 'Lớp 2 làm quen "một phần hai, một phần ba, một phần tư". Lớp 3 học phân số nhiều phần và so sánh cùng mẫu. Lớp 4 rút gọn và so sánh khác mẫu. Lớp 5 cộng trừ phân số. Trang này chia sẵn đúng bốn mức đó.',
    },
    {
      q: 'Vì sao bé nhìn 3/4 lại đọc thành 4/3?',
      a: 'Vì bé chưa gắn con số với hình. Số DƯỚI là số phần chia ra, số TRÊN là số phần được tô. Cách chữa nhanh nhất là cho bé tự tô: chia bánh làm 4 rồi tô 3 miếng, làm vài lần là nhớ.',
    },
    {
      q: 'Vì sao 1/2 lớn hơn 1/4 dù 4 lớn hơn 2?',
      a: 'Chia cái bánh cho càng nhiều người thì mỗi người càng được ít. Mẫu số càng lớn, miếng càng nhỏ. Nhìn hai hình cạnh nhau trong phần So sánh là bé thấy ngay, không cần giải thích dài.',
    },
    {
      q: 'Cộng phân số cùng mẫu thì làm sao?',
      a: 'Giữ nguyên mẫu số, chỉ cộng tử số: 1/5 + 2/5 = 3/5. Lỗi hay gặp là cộng luôn cả mẫu thành 3/10 — nhìn hai thanh ghép lại là thấy tổng vẫn chia làm 5 phần.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Phân số trực quan' }]} />

      <KidHero
        emoji="🍕"
        eyebrow="Toán · Phân số"
        title="Phân số trực quan – tô bánh để hiểu"
        tone="orange"
        description={
          <>
            Bốn dạng bài: <strong>tô màu</strong> theo phân số, <strong>đọc phân số</strong> từ hình,{' '}
            <strong>so sánh</strong> hai phân số và <strong>cộng trừ</strong> cùng mẫu. Bé bấm tô từng miếng bánh nên
            hiểu bằng tay, không phải học thuộc con số.
          </>
        }
      />

      <PhanSoClient />

      <div className="mt-8">
        <KidCard emoji="📶" title="Bốn mức theo lớp" tone="orange" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (<li key={m.lop}><b>{m.ten}</b> — {m.moTa}</li>))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="green">
          <KidLinkList
            tone="green"
            items={[
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
              { href: '/xem-dong-ho', label: 'Xem đồng hồ – kéo kim để học', emoji: '🕐' },
              { href: '/luyen-tinh-nham', label: 'Luyện tính nhẩm cộng trừ nhân chia', emoji: '⚡' },
              { href: '/bang-cuu-chuong', label: 'Bảng cửu chương', emoji: '✖️' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp về phân số" tone="purple">
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
