import { Metadata } from 'next';
import DocumentsListClient from './DocumentsListClient';
import { DEFAULT_OG_IMAGE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Kho tài liệu học tập PDF cho bé tiểu học',
  description: 'Thư viện tài liệu PDF miễn phí cho bé tiểu học: phiếu bài tập, đề ôn luyện Toán, Tiếng Việt và Tiếng Anh lớp 1–3 — tải về in cho bé luyện tại nhà.',
  keywords: ['tài liệu PDF cho bé', 'phiếu bài tập tiểu học', 'tài liệu toán lớp 1', 'tài liệu tiếng việt lớp 1', 'tài liệu tiếng anh lớp 1', 'tài liệu học tập miễn phí'],
  alternates: { canonical: '/tai-lieu' },
  openGraph: {
    title: 'Kho tài liệu học tập PDF cho bé tiểu học',
    description: 'Thư viện tài liệu PDF miễn phí cho bé tiểu học: phiếu bài tập và đề ôn luyện Toán, Tiếng Việt, Tiếng Anh.',
    url: '/tai-lieu',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Kho tài liệu học tập PDF cho bé - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho tài liệu học tập PDF cho bé tiểu học | Bé Hay Học',
    description: 'Thư viện tài liệu PDF miễn phí cho bé tiểu học.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DocumentsPage() {
  return (
    <>
      {/* Nội dung SSR (crawlable) — tránh trang chỉ có "Đang tải…". */}
      <section className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Kho tài liệu học tập PDF cho bé tiểu học
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
          Tổng hợp tài liệu PDF miễn phí giúp bé lớp 1–3 luyện tập tại nhà: phiếu bài tập,
          đề ôn luyện và tài liệu tham khảo các môn Toán, Tiếng Việt và Tiếng Anh. Phụ huynh
          có thể xem trực tuyến hoặc tải về in cho bé thực hành mỗi ngày.
        </p>
      </section>
      <DocumentsListClient />
    </>
  );
}
