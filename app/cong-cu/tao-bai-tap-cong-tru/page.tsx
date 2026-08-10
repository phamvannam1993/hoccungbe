import type { Metadata } from 'next';
import Link from 'next/link';
import WorksheetBuilder from './WorksheetBuilder';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';

// Công cụ tạo phiếu tính nhẩm. Khác với /phieu-bai-tap (in lại đúng câu hỏi của một
// bài học trong DB), công cụ này SINH đề mới không giới hạn — đáp ứng truy vấn
// "tạo bài tập cộng trừ", "bài tập cộng trừ lớp 1 in ra giấy".

const TITLE = 'Tạo bài tập cộng trừ nhân chia – in miễn phí';
const DESCRIPTION =
  'Công cụ tạo phiếu bài tập toán miễn phí: chọn phép cộng, trừ, nhân, chia, phạm vi số và số câu, bấm in hoặc lưu PDF. Có đáp án, không cần đăng ký.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/cong-cu/tao-bai-tap-cong-tru') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/cong-cu/tao-bai-tap-cong-tru'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const FAQ = [
  {
    q: 'Công cụ này có miễn phí không?',
    a: 'Có. Bạn tạo và in bao nhiêu phiếu tuỳ ý, không cần đăng ký tài khoản và không giới hạn số lần.',
  },
  {
    q: 'Làm sao để lưu thành file PDF?',
    a: 'Bấm nút "In / Lưu PDF", sau đó ở hộp thoại in của trình duyệt chọn máy in là "Lưu dưới dạng PDF" (Save as PDF).',
  },
  {
    q: 'Phiếu có kèm đáp án không?',
    a: 'Có. Bật ô "Hiện đáp án" rồi in thêm một bản để làm phiếu chấm cho phụ huynh hoặc giáo viên.',
  },
  {
    q: 'Bài tập có phù hợp chương trình lớp 1 không?',
    a: 'Có. Chọn phép cộng, trừ và phạm vi đến 10 hoặc đến 100 là đúng yêu cầu tính nhẩm của Toán lớp 1. Phép trừ luôn cho kết quả không âm và phép chia luôn chia hết.',
  },
];

export default function Page() {
  const path = '/cong-cu/tao-bai-tap-cong-tru';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Công cụ', item: `${SITE_URL}/cong-cu` },
      { '@type': 'ListItem', position: 3, name: 'Tạo bài tập cộng trừ', item: `${SITE_URL}${path}` },
    ],
  };

  const appLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tạo bài tập cộng trừ nhân chia',
    url: `${SITE_URL}${path}`,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'vi-VN',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav aria-label="Breadcrumb" className="no-print text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/cong-cu" className="hover:text-sky-700">Công cụ</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">Tạo bài tập cộng trừ</li>
        </ol>
      </nav>

      <header className="no-print mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Tạo bài tập cộng trừ nhân chia cho bé
        </h1>
        <p className="mt-3 text-slate-600">
          Chọn phép tính, phạm vi số và số câu, phiếu bài tập sẽ được tạo ngay bên dưới. Mỗi lần bấm “Tạo đề mới” là một
          bộ câu khác, nên bé luyện được nhiều buổi mà không bị nhớ đáp án. Phiếu in vừa khổ A4, có sẵn dòng ghi họ tên
          và ngày làm bài.
        </p>
      </header>

      <div className="mt-6">
        <WorksheetBuilder />
      </div>

      <section className="no-print mt-12">
        <h2 className="text-xl font-extrabold text-slate-900">Câu hỏi thường gặp</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border-2 border-slate-200 bg-white p-4">
              <dt className="font-bold text-slate-900">{f.q}</dt>
              <dd className="mt-1 text-slate-600">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="no-print mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Có thể bé thích</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>
            <Link href="/bai-tap/toan-lop-1/phep-cong-phep-tru-trong-pham-vi-10" className="text-sky-700 hover:underline">
              Bài tập phép cộng, phép trừ trong phạm vi 10
            </Link>
          </li>
          <li><Link href="/bai-tap" className="text-sky-700 hover:underline">Bài tập theo chủ đề các lớp</Link></li>
          <li><Link href="/tro-choi/toan" className="text-sky-700 hover:underline">Trò chơi Toán học cho bé</Link></li>
          <li><Link href="/de-thi" className="text-sky-700 hover:underline">Đề thi &amp; kiểm tra có chấm điểm</Link></li>
        </ul>
      </section>
    </div>
  );
}
