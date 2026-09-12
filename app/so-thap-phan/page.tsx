import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/soThapPhan';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import ThapPhanClient from './ThapPhanClient';

export const revalidate = 86400;

const TITLE = 'Số thập phân trực quan cho bé lớp 4 và lớp 5';
const DESCRIPTION =
  'Bé nhìn thanh chia 10 phần và lưới 100 ô để đọc số thập phân, so sánh hai số bằng cách đặt hai thanh cạnh nhau, và đổi phân số thập phân sang số thập phân. Chữa đúng lỗi tưởng 0,45 lớn hơn 0,5. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/so-thap-phan') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/so-thap-phan'),
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
      { '@type': 'ListItem', position: 2, name: 'Số thập phân', item: `${SITE_URL}/so-thap-phan` },
    ],
  };

  const faq = [
    {
      q: 'Vì sao bé tưởng 0,45 lớn hơn 0,5?',
      a: 'Vì bé mang thói quen so sánh số tự nhiên sang: 45 lớn hơn 5. Nhưng số thập phân phải so TỪNG HÀNG — hàng phần mười trước, bằng nhau mới xuống hàng phần trăm. Đặt hai thanh 100 ô cạnh nhau là thấy ngay thanh 0,5 dài hơn.',
    },
    {
      q: '0,3 và 0,30 có bằng nhau không?',
      a: 'Bằng nhau. Thêm số 0 vào cuối phần thập phân không làm số to lên: 0,3 = 0,30 = 30/100. Trên lưới 100 ô, cả hai đều tô đúng 30 ô.',
    },
    {
      q: 'Đổi phân số thập phân sang số thập phân thế nào?',
      a: 'Mẫu số 10 thì phần thập phân có một chữ số (7/10 = 0,7), mẫu số 100 thì hai chữ số (7/100 = 0,07). Lỗi hay gặp là viết 7/100 thành 0,7 — sai một bậc.',
    },
    {
      q: 'Bé lớp mấy học số thập phân?',
      a: 'Lớp 4 làm quen phân số thập phân và số thập phân có một chữ số sau dấu phẩy. Lớp 5 học kỹ hơn: hai chữ số, so sánh, đổi qua lại với phân số.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Số thập phân' }]} />

      <KidHero
        emoji="🔢"
        eyebrow="Toán · Số thập phân"
        title="Số thập phân – nhìn thanh là hiểu"
        tone="sky"
        description={
          <>
            Ba việc: <strong>đọc số</strong> từ thanh chia 10 phần và lưới 100 ô, <strong>so sánh</strong> bằng cách
            đặt hai thanh cạnh nhau, và <strong>đổi phân số thập phân</strong>. Chữa đúng hai lỗi kinh điển: tưởng
            0,45 lớn hơn 0,5 và tưởng 0,3 khác 0,30.
          </>
        }
      />

      <ThapPhanClient />

      <div className="mt-8">
        <KidCard emoji="📶" title="Hai mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (<li key={m.lop}><b>{m.ten}</b> — {m.moTa}</li>))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="orange">
          <KidLinkList
            tone="orange"
            items={[
              { href: '/phan-so', label: 'Phân số trực quan – tô bánh để hiểu', emoji: '🍕' },
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/do-luong', label: 'Đo lường – thước, cân, đổi đơn vị', emoji: '📐' },
              { href: '/tim-x', label: 'Tìm x – cân thăng bằng', emoji: '⚖️' },
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
