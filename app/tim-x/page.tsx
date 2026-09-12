import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO, QUY_TAC, TEN_THANH_PHAN } from '../lib/timX';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import TimXClient from './TimXClient';

export const revalidate = 86400;

const TITLE = 'Tìm x – tìm thành phần chưa biết cho bé lớp 2 đến lớp 5';
const DESCRIPTION =
  'Bé tìm số hạng, số bị trừ, số trừ, thừa số, số bị chia và số chia; có cân thăng bằng minh hoạ để thấy vì sao phải làm phép tính ngược. Đủ quy tắc và lời giải từng bước. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tim-x') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tim-x'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const DANG_LIET_KE: { de: string; dang: keyof typeof QUY_TAC }[] = [
  { de: 'x + 7 = 12', dang: 'cong' },
  { de: 'x − 7 = 12', dang: 'tru' },
  { de: '20 − x = 8', dang: 'tru-dao' },
  { de: 'x × 4 = 36', dang: 'nhan' },
  { de: 'x : 5 = 6', dang: 'chia' },
  { de: '48 : x = 6', dang: 'chia-dao' },
];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tìm x', item: `${SITE_URL}/tim-x` },
    ],
  };

  const faq = [
    {
      q: 'Vì sao tìm x lại phải làm phép tính ngược?',
      a: 'Vì hai vế của dấu bằng luôn cân nhau như hai đĩa cân. Muốn còn lại một mình x ở đĩa trái thì phải bỏ bớt phần thừa, mà bỏ ở đĩa này bao nhiêu thì phải bỏ ở đĩa kia đúng bấy nhiêu — nên phép tính đảo ngược lại.',
    },
    {
      q: 'Bé hay nhầm dạng nào nhất?',
      a: 'Dạng "20 − x = 8" và "48 : x = 6", tức là x đứng ở vị trí số trừ và số chia. Nhiều bé áp máy móc quy tắc của dạng "x − a = b" nên làm ngược. Ở đây mỗi bài đều nói rõ x đang đóng vai gì trước khi nêu quy tắc.',
    },
    {
      q: 'Làm sao biết mình tìm đúng?',
      a: 'Thay giá trị vừa tìm vào đề và tính lại. Trong trang này, chọn xong là cân nghiêng ngay theo giá trị bé chọn — sai thì thấy đĩa lệch, đúng thì cân vẫn thăng bằng.',
    },
    {
      q: 'Bé lớp mấy học tìm x?',
      a: 'Lớp 2 bắt đầu với số hạng, số bị trừ, số trừ trong phạm vi 100. Lớp 3 thêm thừa số và số bị chia. Lớp 4–5 làm với số lớn hơn và thêm dạng tìm số chia.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tìm x' }]} />

      <KidHero
        emoji="⚖️"
        eyebrow="Toán · Tìm thành phần chưa biết"
        title="Tìm x – nhìn cân là hiểu vì sao"
        tone="purple"
        description={
          <>
            Đủ sáu dạng: số hạng, số bị trừ, số trừ, thừa số, số bị chia, số chia. Mỗi bài nói rõ{' '}
            <strong>x đang đóng vai gì</strong> rồi mới nêu quy tắc, và có <strong>cân thăng bằng</strong> nghiêng
            ngay theo giá trị bé chọn.
          </>
        }
      />

      <TimXClient />

      <div className="mt-8">
        <KidCard emoji="📋" title="Sáu quy tắc cần thuộc" tone="purple" badge={`${DANG_LIET_KE.length} dạng`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {DANG_LIET_KE.map((d) => (
              <li key={d.de}>
                <b>{d.de}</b> — x là {TEN_THANH_PHAN[d.dang]}. {QUY_TAC[d.dang]}
              </li>
            ))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Bốn mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
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
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/dat-tinh', label: 'Đặt tính rồi tính', emoji: '🧮' },
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
              { href: '/bieu-do', label: 'Biểu đồ – đọc và vẽ', emoji: '📊' },
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
