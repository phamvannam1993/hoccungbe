import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/xacSuat';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import XacSuatClient from './XacSuatClient';

export const revalidate = 86400;

const TITLE = 'Chắc chắn – có thể – không thể: xác suất cho bé lớp 2 đến lớp 5';
const DESCRIPTION =
  'Bé nhìn hộp bóng màu để trả lời chắc chắn, có thể hay không thể xảy ra; so sánh khả năng giữa các màu; và tự bấm rút thử nhiều lần để kiểm chứng. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/xac-suat') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/xac-suat'),
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
      { '@type': 'ListItem', position: 2, name: 'Xác suất', item: `${SITE_URL}/xac-suat` },
    ],
  };

  const faq = [
    {
      q: 'Chắc chắn, có thể, không thể khác nhau thế nào?',
      a: 'CHẮC CHẮN là lần nào cũng xảy ra — hộp chỉ toàn bóng đỏ thì lấy quả nào cũng đỏ. KHÔNG THỂ là không bao giờ xảy ra — hộp không có bóng vàng thì đừng mong lấy được vàng. CÓ THỂ là ở giữa: màu đó có trong hộp nhưng còn màu khác nữa.',
    },
    {
      q: 'Vì sao cần cho bé bấm rút thử?',
      a: 'Vì nói "màu nhiều hơn thì dễ ra hơn" là câu chữ, còn rút 20 lần rồi nhìn cột thống kê là trải nghiệm. Bé cũng thấy được điều quan trọng thứ hai: màu ít quả vẫn ra được đôi lần — nhiều khả năng hơn không có nghĩa là chắc chắn.',
    },
    {
      q: 'Bé lớp mấy học phần này?',
      a: 'Từ lớp 2 với ba mức chắc chắn – có thể – không thể. Lớp 3 thêm so sánh khả năng giữa các màu. Lớp 4–5 hộp nhiều màu hơn và tập rút thử để tự rút ra kết luận.',
    },
    {
      q: 'Lỗi bé hay mắc là gì?',
      a: 'Nhầm "có thể" thành "chắc chắn" khi màu đó chiếm đa số. Nhiều quả hơn chỉ nghĩa là dễ ra hơn; chỉ khi hộp CHỈ có một màu thì mới nói chắc chắn được.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xác suất' }]} />

      <KidHero
        emoji="🎲"
        eyebrow="Toán · Khả năng xảy ra"
        title="Chắc chắn – có thể – không thể"
        tone="pink"
        description={
          <>
            Nhìn hộp bóng màu rồi trả lời: lấy được màu này là <strong>chắc chắn</strong>,{' '}
            <strong>có thể</strong> hay <strong>không thể</strong>? Có phần <strong>rút thử</strong> để bé bấm thật
            nhiều lần và tự thấy màu nhiều quả hay ra hơn.
          </>
        }
      />

      <XacSuatClient />

      <div className="mt-8">
        <KidCard emoji="🧠" title="Ba mức khả năng, nhớ bằng hộp bóng" tone="pink">
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            <li><b>Chắc chắn</b> — hộp CHỈ có một màu, lấy quả nào cũng ra màu đó.</li>
            <li><b>Có thể</b> — hộp có màu đó nhưng còn màu khác nữa.</li>
            <li><b>Không thể</b> — hộp KHÔNG có màu đó, lấy bao nhiêu lần cũng không ra.</li>
          </ul>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Nhiều quả hơn chỉ có nghĩa là <b>dễ ra hơn</b>, không phải chắc chắn — đây là chỗ bé hay nhầm nhất.
          </p>
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
              { href: '/bieu-do', label: 'Biểu đồ – đọc và vẽ', emoji: '📊' },
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/cau-tao-so', label: 'Cấu tạo số – hàng và lớp', emoji: '🔢' },
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
