import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO } from '../lib/dongHo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import XemDongHoClient from './XemDongHoClient';

export const revalidate = 86400;

const TITLE = 'Xem đồng hồ – học xem giờ cho bé lớp 1 đến lớp 5';
const DESCRIPTION =
  'Đồng hồ tương tác kéo được kim: bé đọc giờ, tự quay kim theo đề bài và tính "mấy phút nữa là mấy giờ". Chia mức theo lớp 1–5, giải thích theo vị trí từng kim. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/xem-dong-ho') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/xem-dong-ho'),
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
      { '@type': 'ListItem', position: 2, name: 'Xem đồng hồ', item: `${SITE_URL}/xem-dong-ho` },
    ],
  };

  const faq = [
    {
      q: 'Bé mấy tuổi thì học xem đồng hồ được?',
      a: 'Lớp 1 (6 tuổi) học giờ đúng — kim dài luôn chỉ số 12. Lớp 2 thêm giờ rưỡi và 15 phút, lớp 3 đọc theo bước 5 phút, lớp 4–5 đọc phút lẻ và cách nói giờ 24 giờ. Trang này chia sẵn đúng năm mức đó.',
    },
    {
      q: 'Vì sao bé đọc 3 giờ rưỡi thành 4 giờ rưỡi?',
      a: 'Vì lúc kim dài chỉ số 6, kim ngắn đã nằm giữa số 3 và số 4, bé nhìn thấy nó gần số 4 nên đọc nhầm. Cách chữa là cho bé TỰ QUAY kim: quay kim phút một vòng sẽ thấy kim giờ nhích dần chứ không nhảy cóc.',
    },
    {
      q: 'Dạng "chỉnh kim" khác gì trắc nghiệm?',
      a: 'Trắc nghiệm bé có thể đoán trong bốn đáp án. Chỉnh kim thì bé phải đặt đúng cả hai kim, không đoán được — đây mới là lúc biết bé thật sự hiểu hay chưa.',
    },
    {
      q: 'Giờ kém là gì?',
      a: '"9 giờ kém 10" nghĩa là còn 10 phút nữa tới 9 giờ, tức 8 giờ 50 phút. Cách nói này xuất hiện từ lớp 3, trang tự chuyển sang lối nói dân dã khi bé chọn lớp 3 trở lên.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem đồng hồ' }]} />

      <KidHero
        emoji="🕐"
        eyebrow="Toán · Thời gian"
        title="Xem đồng hồ – kéo kim để học"
        tone="blue"
        description={
          <>
            Ba dạng bài đi từ dễ đến khó: <strong>đọc giờ</strong>, <strong>tự quay kim</strong> theo đề bài, và{' '}
            <strong>tính mấy phút nữa là mấy giờ</strong>. Kim kéo được bằng tay nên bé thấy rõ kim giờ nhích dần
            theo kim phút — chỗ mà nhìn hình tĩnh không bao giờ hiểu được.
          </>
        }
      />

      <XemDongHoClient />

      <div className="mt-8">
        <KidCard emoji="📶" title="Năm mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (
              <li key={m.lop}>
                <b>{m.ten}</b> — {m.moTa}
              </li>
            ))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="green">
          <KidLinkList
            tone="green"
            items={[
              { href: '/phan-so', label: 'Phân số trực quan – tô bánh để hiểu', emoji: '🍕' },
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
              { href: '/luyen-tinh-nham', label: 'Luyện tính nhẩm cộng trừ nhân chia', emoji: '⚡' },
              { href: '/bang-cuu-chuong', label: 'Bảng cửu chương', emoji: '✖️' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
              { href: '/trieu-phu-nhi', label: 'Game Triệu Phú Nhí', emoji: '💎' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp về học xem giờ" tone="orange">
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
