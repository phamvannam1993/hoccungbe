import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { DANG_THEO_LOP, TEN_DANG } from '../lib/soDoDoanThang';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import SoDoClient from './SoDoClient';

export const revalidate = 86400;

const TITLE = 'Giải toán có lời văn bằng sơ đồ đoạn thẳng – lớp 2 đến lớp 5';
const DESCRIPTION =
  'Bé nhìn sơ đồ đoạn thẳng để hiểu đề rồi mới tính: chọn phép tính trước, tính kết quả sau. Đủ 6 dạng toán lời văn tiểu học gồm tìm tổng, phần còn lại, nhiều hơn, ít hơn, gấp số lần, tổng – hiệu. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/so-do-doan-thang') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/so-do-doan-thang'),
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
      { '@type': 'ListItem', position: 2, name: 'Sơ đồ đoạn thẳng', item: `${SITE_URL}/so-do-doan-thang` },
    ],
  };

  const faq = [
    {
      q: 'Sơ đồ đoạn thẳng là gì?',
      a: 'Là cách vẽ mỗi đại lượng trong bài toán thành một đoạn thẳng, đoạn dài hơn nghĩa là nhiều hơn. Nhìn sơ đồ là thấy ngay bài cho gì, hỏi gì và phải cộng hay trừ — đây là cách sách giáo khoa tiểu học Việt Nam dạy giải toán có lời văn.',
    },
    {
      q: 'Vì sao bé đọc hiểu đề mà vẫn giải sai?',
      a: 'Phần lớn là chọn nhầm phép tính chứ không phải tính sai. Vì vậy trang này tách làm hai bước: bước 1 chỉ chọn phép tính, bước 2 mới tính ra số. Ba mẹ nhìn bé sai ở bước nào là biết cần dạy lại chỗ nào.',
    },
    {
      q: 'Dạng "tổng – hiệu" giải thế nào?',
      a: 'Vẽ hai đoạn, đoạn dài hơn có phần dôi ra đúng bằng hiệu. Cắt bỏ phần dôi thì hai đoạn bằng nhau, lấy tổng trừ hiệu rồi chia đôi được số bé. Sơ đồ trong bài vẽ sẵn phần dôi ra đó nên bé thấy được vì sao phải chia 2.',
    },
    {
      q: 'Bé lớp mấy học được?',
      a: 'Lớp 2 làm các dạng tìm tổng, phần còn lại, nhiều hơn, ít hơn. Lớp 3 thêm gấp một số lần. Lớp 4–5 thêm tổng – hiệu và số lớn hơn. Trang tự lọc dạng bài theo lớp bé chọn.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sơ đồ đoạn thẳng' }]} />

      <KidHero
        emoji="📏"
        eyebrow="Toán · Giải toán có lời văn"
        title="Sơ đồ đoạn thẳng – nhìn là hiểu đề"
        tone="green"
        description={
          <>
            Bé giải theo <strong>hai bước</strong>: nhìn sơ đồ <strong>chọn phép tính</strong> trước, rồi mới{' '}
            <strong>tính ra số</strong>. Tách vậy để biết bé tắc ở đâu — chọn nhầm phép tính là chưa hiểu đề, còn
            tính lệch chỉ là nhầm số.
          </>
        }
      />

      <SoDoClient />

      <div className="mt-8">
        <KidCard emoji="📚" title="Sáu dạng toán lời văn" tone="green" badge={`${Object.keys(TEN_DANG).length} dạng`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {(Object.keys(TEN_DANG) as (keyof typeof TEN_DANG)[]).map((d) => {
              const lopCo = ([2, 3, 4, 5] as const).filter((l) => DANG_THEO_LOP[l].includes(d));
              return <li key={d}><b>{TEN_DANG[d]}</b> — lớp {lopCo.join(', ')}</li>;
            })}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/dat-tinh', label: 'Đặt tính rồi tính – chấm từng cột', emoji: '🧮' },
              { href: '/phan-so', label: 'Phân số trực quan – tô bánh để hiểu', emoji: '🍕' },
              { href: '/xem-dong-ho', label: 'Xem đồng hồ – kéo kim để học', emoji: '🕐' },
              { href: '/luyen-tinh-nham', label: 'Luyện tính nhẩm cộng trừ nhân chia', emoji: '⚡' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="orange">
          <KidFaq items={faq} tone="orange" />
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
