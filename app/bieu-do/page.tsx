import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/bieuDo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import BieuDoClient from './BieuDoClient';

export const revalidate = 86400;

const TITLE = 'Biểu đồ tranh và biểu đồ cột cho bé lớp 2 đến lớp 5';
const DESCRIPTION =
  'Bé đọc biểu đồ tranh và biểu đồ cột để trả lời nhiều nhất, ít nhất, hơn kém bao nhiêu, tổng cộng; rồi tự kéo cột vẽ biểu đồ từ bảng số liệu. Có nhắc bẫy hệ số của biểu đồ tranh. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bieu-do') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bieu-do'),
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
      { '@type': 'ListItem', position: 2, name: 'Biểu đồ', item: `${SITE_URL}/bieu-do` },
    ],
  };

  const faq = [
    {
      q: 'Bẫy hay gặp nhất ở biểu đồ tranh là gì?',
      a: 'Đếm số hình rồi trả lời luôn, quên nhân hệ số. Nếu mỗi hình là 5 quả mà có 4 hình thì đáp án là 20 chứ không phải 4. Vì vậy một trong các đáp án sai ở đây luôn là "số hình" — buộc bé nhìn dòng ghi chú hệ số.',
    },
    {
      q: 'Vì sao phải tập VẼ biểu đồ chứ không chỉ đọc?',
      a: 'Đọc và vẽ là hai kỹ năng khác nhau. Bé nhìn cột cao thấp thì so sánh được, nhưng cho bảng số liệu rồi bảo dựng cột đúng vạch thì mới lộ ra có hiểu trục dọc hay không.',
    },
    {
      q: 'Bé lớp mấy học biểu đồ?',
      a: 'Lớp 2 làm quen biểu đồ tranh mỗi hình một đơn vị; lớp 3 biểu đồ tranh có hệ số và bắt đầu đọc biểu đồ cột; lớp 4 so sánh và tính tổng trên biểu đồ cột; lớp 5 thêm câu hỏi trung bình cộng.',
    },
    {
      q: 'Đọc biểu đồ cột thế nào cho nhanh?',
      a: 'Nhìn trục dọc trước để biết mỗi vạch là bao nhiêu, rồi mới dóng đỉnh cột sang. Nhiều bé nhìn cột cao hơn là kết luận luôn mà không để ý mỗi vạch có thể là 2, 5 hay 10 đơn vị.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Biểu đồ' }]} />

      <KidHero
        emoji="📊"
        eyebrow="Toán · Thống kê"
        title="Biểu đồ – đọc được và vẽ được"
        tone="purple"
        description={
          <>
            Hai chiều của cùng một kỹ năng: <strong>đọc biểu đồ</strong> tranh và cột để trả lời câu hỏi, rồi{' '}
            <strong>tự kéo cột vẽ biểu đồ</strong> từ bảng số liệu. Biết đọc chưa chắc đã vẽ được.
          </>
        }
      />

      <BieuDoClient />

      <div className="mt-8">
        <KidCard emoji="📶" title="Bốn mức theo lớp" tone="purple" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (<li key={m.lop}><b>{m.ten}</b> — {m.moTa}</li>))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/chu-vi-dien-tich', label: 'Chu vi và diện tích', emoji: '📏' },
              { href: '/hinh-hoc', label: 'Hình học – nhận hình, đối xứng', emoji: '🔷' },
              { href: '/do-luong', label: 'Đo lường – thước, cân, đổi đơn vị', emoji: '📐' },
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
