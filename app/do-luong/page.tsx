import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { DON_VI, MUC_DO } from '../lib/doLuong';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import DoLuongClient from './DoLuongClient';

export const revalidate = 86400;

const TITLE = 'Đo lường và đổi đơn vị – thước kẻ, cân, lít cho bé lớp 1 đến lớp 5';
const DESCRIPTION =
  'Bé đọc số đo trên thước kẻ 20cm (có bài đặt lệch vạch 0), đặt quả cân cho cân thăng bằng và đổi đơn vị đo độ dài, khối lượng, dung tích, thời gian. Giải thích theo bậc đơn vị. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/do-luong') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/do-luong'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const NHOM = [
  { ten: 'Độ dài', ma: 'dai' as const, emoji: '📏' },
  { ten: 'Khối lượng', ma: 'khoi-luong' as const, emoji: '⚖️' },
  { ten: 'Dung tích', ma: 'dung-tich' as const, emoji: '🥤' },
  { ten: 'Thời gian', ma: 'thoi-gian' as const, emoji: '⏱️' },
];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Đo lường', item: `${SITE_URL}/do-luong` },
    ],
  };

  const faq = [
    {
      q: 'Vì sao bé đo đúng mà vẫn ghi sai số?',
      a: 'Vì đoạn thẳng không phải lúc nào cũng bắt đầu ở vạch 0. Khi đặt lệch, phải lấy vạch cuối TRỪ vạch đầu. Từ lớp 3 trang này cố ý ra nhiều bài đặt lệch để bé quen với việc trừ hai vạch.',
    },
    {
      q: 'Đổi đơn vị thì khi nào nhân, khi nào chia?',
      a: 'Đổi từ đơn vị LỚN sang đơn vị BÉ thì nhân (1 m = 100 cm), từ BÉ sang LỚN thì chia (500 g = 0,5 kg). Cách nhớ chắc nhất là thuộc thứ tự các bậc: mm – cm – dm – m – km, và g – kg – tạ – tấn.',
    },
    {
      q: 'Lỗi hay gặp nhất khi đổi đơn vị là gì?',
      a: 'Lệch một bậc, tức là kết quả gấp 10 hoặc bằng một phần mười đáp án đúng. Vì vậy các đáp án sai ở đây cố ý đặt đúng kiểu đó, buộc bé phải đếm bậc chứ không đoán.',
    },
    {
      q: 'Phần cân học được gì?',
      a: 'Bé đặt từng quả cân lên đĩa và nhìn cán cân nghiêng về bên nặng hơn. Thăng bằng nghĩa là tổng quả cân đúng bằng khối lượng vật — đây là cách hiểu phép cộng khối lượng bằng mắt.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đo lường' }]} />

      <KidHero
        emoji="📐"
        eyebrow="Toán · Đo lường"
        title="Đo lường – thước, cân và đổi đơn vị"
        tone="orange"
        description={
          <>
            Ba việc bé tự làm: <strong>đọc số đo trên thước kẻ</strong> (có bài đặt lệch vạch 0),{' '}
            <strong>đặt quả cân cho thăng bằng</strong>, và <strong>đổi đơn vị</strong> độ dài, khối lượng, dung tích,
            thời gian.
          </>
        }
      />

      <DoLuongClient />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {NHOM.map((n) => (
          <KidCard key={n.ma} emoji={n.emoji} title={n.ten} tone="orange">
            <p className="text-sm font-bold leading-7 text-slate-700">
              {DON_VI.filter((d) => d.nhom === n.ma).map((d) => d.ma).join(' → ')}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Đi từ trái sang phải là đơn vị lớn dần. Sang phải một bậc thì chia, sang trái một bậc thì nhân.
            </p>
          </KidCard>
        ))}
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Năm mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
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
              { href: '/dat-tinh', label: 'Đặt tính rồi tính – cộng trừ nhân chia', emoji: '🧮' },
              { href: '/xem-dong-ho', label: 'Xem đồng hồ', emoji: '🕐' },
              { href: '/tien-viet-nam', label: 'Học tiêu tiền Việt Nam', emoji: '💵' },
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
