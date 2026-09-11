import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/datTinh';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import DatTinhClient from './DatTinhClient';

export const revalidate = 86400;

const TITLE = 'Đặt tính rồi tính – cộng trừ nhân cột dọc cho bé lớp 1 đến lớp 5';
const DESCRIPTION =
  'Bé điền từng chữ số vào bảng cột dọc như làm trên giấy, có ô ghi số nhớ. Máy chấm TỪNG CỘT và chỉ đúng chỗ sai: quên nhớ 1, không mượn khi trừ, viết hai chữ số vào một ô. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/dat-tinh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/dat-tinh'),
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
      { '@type': 'ListItem', position: 2, name: 'Đặt tính rồi tính', item: `${SITE_URL}/dat-tinh` },
    ],
  };

  const faq = [
    {
      q: 'Đặt tính rồi tính là gì?',
      a: 'Là viết hai số thẳng cột theo hàng đơn vị, hàng chục, hàng trăm rồi tính từ phải sang trái. Viết lệch cột là sai ngay từ đầu, nên bảng ở trang này giữ sẵn cột cho bé, bé chỉ việc điền chữ số.',
    },
    {
      q: 'Vì sao bé hay quên nhớ 1?',
      a: 'Vì số nhớ nằm trong đầu chứ không nằm trên giấy. Trang này có hàng ô gạch nét đứt ở trên cùng để bé GHI số nhớ ra — thói quen này bỏ được gần hết lỗi quên nhớ.',
    },
    {
      q: 'Máy chấm khác gì trắc nghiệm?',
      a: 'Trắc nghiệm chỉ nói đúng hay sai. Ở đây máy chấm từng cột và nói rõ sai vì đâu: "hàng chục: bé quên cộng thêm 1 nhớ từ hàng bên phải" hay "8 không trừ được 9 nên phải mượn 1". Ba mẹ nhìn là biết cần dạy lại chỗ nào.',
    },
    {
      q: 'Bé lớp mấy học được?',
      a: 'Lớp 1 cộng trừ hai chữ số không nhớ; lớp 2 có nhớ trong phạm vi 100; lớp 3 thêm ba chữ số và phép nhân với số có một chữ số; lớp 4–5 số lớn hơn, nhiều lần nhớ liên tiếp.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đặt tính rồi tính' }]} />

      <KidHero
        emoji="🧮"
        eyebrow="Toán · Tính cột dọc"
        title="Đặt tính rồi tính – chấm từng cột"
        tone="purple"
        description={
          <>
            Bé điền từng chữ số như làm trên giấy, có <strong>ô ghi số nhớ</strong> ở trên. Máy chấm{' '}
            <strong>từng cột</strong> và nói rõ sai ở đâu — quên nhớ 1, không mượn khi trừ, hay viết hai chữ số vào
            một ô.
          </>
        }
      />

      <DatTinhClient />

      <div className="mt-8">
        <KidCard emoji="📶" title="Năm mức theo lớp" tone="purple" badge={`${MUC_DO.length} mức`}>
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
              { href: '/tien-viet-nam', label: 'Học tiêu tiền Việt Nam', emoji: '💵' },
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
              { href: '/phan-so', label: 'Phân số trực quan – tô bánh để hiểu', emoji: '🍕' },
              { href: '/xem-dong-ho', label: 'Xem đồng hồ – kéo kim để học', emoji: '🕐' },
              { href: '/luyen-tinh-nham', label: 'Luyện tính nhẩm', emoji: '⚡' },
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
