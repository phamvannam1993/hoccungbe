import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { HINH_PHANG, KHOI, MUC_DO } from '../lib/hinhHoc';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import HinhHocClient from './HinhHocClient';

export const revalidate = 86400;

const TITLE = 'Hình học cho bé lớp 1 đến lớp 5 – nhận hình, đối xứng, khối 3D';
const DESCRIPTION =
  `Nhận biết ${HINH_PHANG.length} hình phẳng và ${KHOI.length} khối 3D, tự tô nửa còn lại cho hình đối xứng, đếm mặt – cạnh – đỉnh. Hình vẽ có xoay để bé nhận bằng số cạnh chứ không bằng tư thế quen mắt. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/hinh-hoc') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/hinh-hoc'),
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
      { '@type': 'ListItem', position: 2, name: 'Hình học', item: `${SITE_URL}/hinh-hoc` },
    ],
  };

  const faq = [
    {
      q: 'Vì sao bé thuộc tên hình mà vẫn nhận sai?',
      a: 'Vì sách thường in hình ở tư thế "đứng thẳng", bé nhớ theo hình dáng quen mắt. Xoay hình vuông 45 độ là nhiều bé gọi thành hình thoi. Ở đây hình được vẽ hơi xoay để bé buộc phải đếm cạnh và nhìn góc.',
    },
    {
      q: 'Hình vuông có phải hình chữ nhật không?',
      a: 'Có. Hình vuông là trường hợp đặc biệt của hình chữ nhật — cũng 4 góc vuông, nhưng thêm điều kiện 4 cạnh bằng nhau. Ở tiểu học, khi hình có 4 cạnh bằng nhau thì gọi tên chính xác nhất là hình vuông.',
    },
    {
      q: 'Dạng đối xứng luyện được gì?',
      a: 'Bé tô nửa còn lại của hình sao cho gấp đôi theo trục thì hai nửa trùng khít. Đây là nền của bài "hình có trục đối xứng" và cũng rèn khả năng nhìn vị trí — ô cách trục mấy cột thì ô đối diện cũng cách đúng bấy nhiêu.',
    },
    {
      q: 'Đếm mặt, cạnh, đỉnh của khối 3D thế nào cho khỏi sót?',
      a: 'Đếm theo nhóm: mặt trên, mặt dưới rồi các mặt xung quanh; đỉnh thì đếm bốn đỉnh mặt trên rồi bốn đỉnh mặt dưới. Chỗ hay sót là các mặt và đỉnh bị khuất phía sau — trong hình vẽ chúng được thể hiện bằng nét đứt.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Hình học' }]} />

      <KidHero
        emoji="🔷"
        eyebrow="Toán · Hình học"
        title="Hình học – nhìn hình, tự tô, tự đếm"
        tone="sky"
        description={
          <>
            Ba việc: <strong>nhận tên hình</strong> (hình vẽ có xoay, buộc bé đếm cạnh chứ không nhớ tư thế),{' '}
            <strong>tô nửa còn lại cho đối xứng</strong>, và <strong>nhận khối 3D</strong> rồi đếm mặt – đỉnh.
          </>
        }
      />

      <HinhHocClient />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <KidCard emoji="🔷" title="Các hình phẳng" tone="blue" badge={`${HINH_PHANG.length} hình`}>
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            {HINH_PHANG.map((h) => (
              <li key={h.ma}><b>{h.ten}</b> (lớp {h.tuLop}) — {h.dacDiem}.</li>
            ))}
          </ul>
        </KidCard>
        <KidCard emoji="🧊" title="Các khối 3D" tone="purple" badge={`${KHOI.length} khối`}>
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            {KHOI.map((k) => (
              <li key={k.ma}>
                <b>{k.ten}</b> (lớp {k.tuLop}) — giống {k.viDu}
                {!k.cong && <>, có {k.mat} mặt, {k.canh} cạnh, {k.dinh} đỉnh</>}.
              </li>
            ))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Năm mức theo lớp" tone="green" badge={`${MUC_DO.length} mức`}>
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
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/do-luong', label: 'Đo lường – thước, cân, đổi đơn vị', emoji: '📐' },
              { href: '/phan-so', label: 'Phân số trực quan', emoji: '🍕' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
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
