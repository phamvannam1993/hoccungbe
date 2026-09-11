import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { CAC_TO, MUC_DO, TO_THIEU_ANH, vietTien } from '../lib/tienViet';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import TienClient from './TienClient';

export const revalidate = 86400;

const TITLE = 'Học tiêu tiền Việt Nam – nhận biết, trả tiền, tính tiền thối';
const DESCRIPTION =
  'Bé nhận mặt các tờ tiền Việt Nam, tự chọn tờ để trả đúng số tiền và tính tiền được trả lại khi mua hàng. Chia mức theo lớp 1–5, có giải thích từng bước. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tien-viet-nam') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tien-viet-nam'),
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
      { '@type': 'ListItem', position: 2, name: 'Tiền Việt Nam', item: `${SITE_URL}/tien-viet-nam` },
    ],
  };

  const faq = [
    {
      q: 'Bé học tiền từ lớp mấy?',
      a: 'Lớp 1 nhận biết các tờ từ 1.000 đến 10.000 đồng. Lớp 2 tập trả tiền đủ trong phạm vi 20.000. Lớp 3 tính tiền thối tới 100.000. Lớp 4–5 mua nhiều món và dùng tờ mệnh giá lớn.',
    },
    {
      q: 'Vì sao bé hay tính nhầm tiền?',
      a: 'Lỗi phổ biến nhất là lệch một hàng số 0 — nhầm 5.000 với 50.000. Vì vậy các đáp án sai trong trang này cố ý đặt đúng kiểu nhầm đó, để bé tập nhìn kỹ số 0 chứ không đoán.',
    },
    {
      q: 'Trả tiền có mấy cách?',
      a: 'Rất nhiều cách, miễn cộng lại đúng số tiền. Trang chấp nhận mọi cách bé chọn, phần giải thích chỉ gợi ý thêm cách trả ít tờ nhất để bé so sánh.',
    },
    {
      q: 'Hình tờ tiền có giống tiền thật không?',
      a: 'Phần lớn là ảnh chụp tờ tiền thật để bé nhận đúng mặt tiền khi cầm ngoài đời. Vài mệnh giá chưa có ảnh thì trang tạm vẽ khối màu có ghi số — bé vẫn học được bình thường, và sẽ thay bằng ảnh khi bổ sung.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tiền Việt Nam' }]} />

      <KidHero
        emoji="💵"
        eyebrow="Toán · Tiền Việt Nam"
        title="Học tiêu tiền – trả đúng, thối đúng"
        tone="green"
        description={
          <>
            Ba dạng bài như ngoài chợ thật: <strong>nhận mặt tờ tiền</strong>, <strong>chọn tờ để trả đủ</strong> số
            tiền, và <strong>tính tiền được trả lại</strong>. Bé bấm lấy từng tờ ra khỏi ví, cộng tới đâu thấy ngay tới
            đó.
          </>
        }
      />

      <TienClient />

      <div className="mt-8">
        <KidCard emoji="💴" title="Các tờ tiền Việt Nam đang lưu hành" tone="green" badge={`${CAC_TO.length} tờ`}>
          <p className="text-sm leading-6 text-slate-600">
            {CAC_TO.map((t) => vietTien(t.gia)).join(' · ')}.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Phần lớn các tờ dùng <b>ảnh chụp thật</b> để bé nhận mặt đúng tờ tiền cầm ngoài đời.
            {TO_THIEU_ANH.length > 0 && (
              <> Riêng {TO_THIEU_ANH.map((g) => vietTien(g)).join(', ')} chưa có ảnh nên tạm vẽ khối màu có ghi mệnh giá.</>
            )}
          </p>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Năm mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (<li key={m.lop}><b>{m.ten}</b> — {m.moTa}</li>))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="purple">
          <KidLinkList
            tone="purple"
            items={[
              { href: '/dat-tinh', label: 'Đặt tính rồi tính – chấm từng cột', emoji: '🧮' },
              { href: '/so-do-doan-thang', label: 'Giải toán lời văn bằng sơ đồ đoạn thẳng', emoji: '📏' },
              { href: '/phan-so', label: 'Phân số trực quan', emoji: '🍕' },
              { href: '/xem-dong-ho', label: 'Xem đồng hồ', emoji: '🕐' },
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
