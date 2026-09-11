import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { CONG_CU_TOAN, congCuTheoLop } from '../lib/congCuToan';
import { KidShell, KidCrumb, KidHero, KidCard, KidFaq } from '../components/seo/kid';

export const revalidate = 86400;

const TITLE = 'Học Toán tiểu học – bộ công cụ trực quan cho bé lớp 1 đến lớp 5';
const DESCRIPTION =
  `${CONG_CU_TOAN.length} công cụ Toán bấm được, không phải trắc nghiệm khô khan: bảng cộng trừ, đặt tính cột dọc, xem đồng hồ, phân số, sơ đồ đoạn thẳng, tiền Việt Nam, tính nhẩm và toán tư duy. Miễn phí, không cần đăng nhập.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/hoc-toan') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/hoc-toan'),
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
      { '@type': 'ListItem', position: 2, name: 'Học Toán', item: `${SITE_URL}/hoc-toan` },
    ],
  };

  const danhSach = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CONG_CU_TOAN.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.ten, url: `${SITE_URL}${c.href}`,
    })),
  };

  const faq = [
    {
      q: 'Vì sao cần công cụ thao tác thay vì làm trắc nghiệm?',
      a: 'Vì trẻ tắc ở chỗ không hình dung được, chứ không phải thiếu câu hỏi. Kéo được kim đồng hồ, tô được miếng bánh, kéo được đoạn thẳng thì bé hiểu; còn thêm trắc nghiệm chỉ đo lại đúng cái bé chưa hiểu.',
    },
    {
      q: 'Bé lớp 1 bắt đầu từ đâu?',
      a: 'Bảng cộng trừ trong phạm vi 10 trước, rồi đặt tính cột dọc không nhớ, rồi xem đồng hồ giờ đúng. Ba thứ đó đủ cho cả năm lớp 1.',
    },
    {
      q: 'Có cần đăng nhập không?',
      a: 'Không. Mọi công cụ dùng được ngay, tiến độ lưu trên máy của bé.',
    },
    {
      q: 'Máy chấm bài có giải thích không?',
      a: 'Có, và giải thích bám vào chỗ sai cụ thể: “hàng chục quên cộng 1 nhớ”, “kim ngắn chưa tới số 4 nên vẫn là 3 giờ”, “tô 3 trên 4 phần nên là ba phần tư”.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(danhSach) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Học Toán' }]} />

      <KidHero
        emoji="🔢"
        eyebrow="Toán tiểu học"
        title="Học Toán bằng tay, không chỉ bằng mắt"
        tone="blue"
        description={
          <>
            <strong>{CONG_CU_TOAN.length} công cụ bấm được</strong> cho bé lớp 1 đến lớp 5: kéo kim đồng hồ, tô miếng
            bánh, kéo đoạn thẳng, điền cột dọc, đếm tiền. Máy chấm và <strong>chỉ đúng chỗ sai</strong> chứ không chỉ
            nói đúng hay sai.
          </>
        }
      />

      {/* Lưới công cụ */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONG_CU_TOAN.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-start gap-3 rounded-3xl border-2 bg-white p-4 transition hover:-translate-y-0.5"
            style={{ borderColor: `${c.mau}33`, boxShadow: `0 4px 0 ${c.mau}22` }}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                  style={{ background: `${c.mau}1a` }} aria-hidden>
              {c.emoji}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <b className="text-base text-slate-900">{c.ten}</b>
                {c.moi && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-black text-white" style={{ background: c.mau }}>
                    MỚI
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-slate-600">{c.moTa}</span>
              <span className="mt-1 block text-xs font-bold" style={{ color: c.mau }}>
                Lớp {c.lop.join(', ')}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Gợi ý theo lớp — phần chữ này cũng để máy tìm kiếm đọc được */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((lop) => (
          <KidCard key={lop} emoji={['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][lop - 1]} title={`Lớp ${lop} nên dùng gì?`} tone="blue">
            <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
              {congCuTheoLop(lop).map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="font-bold text-sky-700 hover:underline">{c.emoji} {c.ten}</Link>
                </li>
              ))}
            </ul>
          </KidCard>
        ))}
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
