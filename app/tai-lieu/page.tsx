import { Metadata } from 'next';
import Link from 'next/link';
import DocumentsListClient from './DocumentsListClient';
import { DEFAULT_OG_IMAGE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Kho tài liệu học tập miễn phí cho học sinh tiểu học',
  description: 'Thư viện tài liệu học tập miễn phí cho bé tiểu học: phiếu bài tập, đề ôn luyện Toán, Tiếng Việt và Tiếng Anh lớp 1–3 — tải về in cho bé luyện tại nhà.',
  keywords: ['tài liệu học tập cho bé', 'phiếu bài tập tiểu học', 'tài liệu toán lớp 1', 'tài liệu tiếng việt lớp 1', 'tài liệu tiếng anh lớp 1', 'tài liệu học tập miễn phí'],
  alternates: { canonical: '/tai-lieu' },
  // Tạm noindex tới khi có đủ ~10–20 tài liệu thực tế render sẵn từ máy chủ (tránh index trang "Đang tải…").
  robots: { index: false, follow: true },
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
          Kho tài liệu học tập miễn phí cho học sinh tiểu học
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
          Tổng hợp tài liệu PDF miễn phí giúp bé lớp 1–3 luyện tập tại nhà: phiếu bài tập,
          đề ôn luyện và tài liệu tham khảo các môn Toán, Tiếng Việt và Tiếng Anh. Phụ huynh
          có thể xem trực tuyến hoặc tải về in cho bé thực hành mỗi ngày.
        </p>
        {/* Trang gom mọi tài liệu in (phiếu miễn phí, phiếu tập viết, gói in) — lọc theo lớp/môn. */}
        <Link href="/tai-lieu-in" className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 font-bold text-amber-900 hover:bg-amber-100">
          <span className="text-2xl" aria-hidden>🖨️</span>
          <span className="min-w-0 flex-1">Tìm phiếu in theo lớp và môn: phiếu bài tập, phiếu tập viết, bộ đề A4</span>
          <span aria-hidden>→</span>
        </Link>
      </section>
      <DocumentsListClient />
    </>
  );
}
