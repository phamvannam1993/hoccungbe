// /de-thi — trang tổng hợp đề thi DẠNG MỚI: các khu /thi-lop-1 … /thi-lop-5 (vẽ lại từ tờ đề giấy, chấm điểm
// ngay trên trang). Trang đề cũ lấy từ API /exams tạm tắt — xem TrangDeThiCu.tsx để bật lại.
import type { Metadata } from 'next';
import Link from 'next/link';
import { NHOM_DE as NHOM_1, THI_LOP_1 } from '../thi-lop-1/de';
import { NHOM_DE as NHOM_2, THI_LOP_2 } from '../thi-lop-2/de';
import { NHOM_DE as NHOM_3, THI_LOP_3 } from '../thi-lop-3/de';
import { NHOM_DE as NHOM_4, THI_LOP_4 } from '../thi-lop-4/de';
import { NHOM_DE as NHOM_5, THI_LOP_5 } from '../thi-lop-5/de';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Đề thi tiểu học lớp 1–5 có chấm điểm – giữa kì, cuối kì 1',
  description: 'Đề kiểm tra giữa kì 1 và cuối kì 1 môn Toán, Tiếng Việt lớp 1 đến lớp 5 — làm trực tuyến như tờ đề giấy, nộp bài có điểm và đáp án từng câu.',
  alternates: { canonical: `${SITE}/de-thi` },
};

const LOP = [
  { lop: 1, href: '/thi-lop-1', de: THI_LOP_1, nhom: NHOM_1, mau: ['#FF6B9D', '#e04f80'] },
  { lop: 2, href: '/thi-lop-2', de: THI_LOP_2, nhom: NHOM_2, mau: ['#FF9F45', '#e07f22'] },
  { lop: 3, href: '/thi-lop-3', de: THI_LOP_3, nhom: NHOM_3, mau: ['#6BCB77', '#43a650'] },
  { lop: 4, href: '/thi-lop-4', de: THI_LOP_4, nhom: NHOM_4, mau: ['#4ECDC4', '#2aa9a0'] },
  { lop: 5, href: '/thi-lop-5', de: THI_LOP_5, nhom: NHOM_5, mau: ['#A06CD5', '#7d49b3'] },
];

export default function DeThiPage() {
  const tong = LOP.reduce((s, l) => s + l.de.length, 0);
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Đề thi', item: `${SITE}/de-thi` },
    ],
  };
  return (
    <div className="kid-bg relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="relative mx-auto max-w-4xl px-4 pb-2 pt-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm font-bold">
          <Link href="/" className="text-pink-600 hover:text-pink-700">🏠 Trang chủ</Link>
          <span className="text-purple-400">›</span>
          <span className="text-purple-700">Đề thi</span>
        </nav>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <div className="mb-6 rounded-[32px] border-4 border-pink-200 bg-white p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-4xl">📝</span>
            <h1
              className="kid-display text-2xl font-black sm:text-3xl"
              style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Đề thi lớp 1 – lớp 5
            </h1>
          </div>
          <p className="text-sm font-medium leading-7 text-purple-700/90 sm:text-base">
            <strong>{tong} đề thi và phiếu ôn tập</strong> giữa kì 1, cuối kì 1, trình bày y như tờ đề giấy ở trường. Bé điền thẳng vào tờ đề,
            nộp bài là có điểm và đáp án từng câu. Chọn lớp của bé:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LOP.map((l) => (
            <Link
              key={l.lop}
              href={l.href}
              className="group rounded-3xl border-4 border-purple-100 bg-white p-5 transition-transform hover:-translate-y-0.5 hover:border-pink-200"
              style={{ boxShadow: '0 6px 20px rgba(160,108,213,0.12)' }}>
              <div className="flex items-center gap-3">
                <span
                  className="kid-display grid h-14 w-14 flex-none place-items-center rounded-2xl text-2xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${l.mau[0]}, ${l.mau[1]})`, boxShadow: `0 3px 0 ${l.mau[1]}` }}>
                  {l.lop}
                </span>
                <div className="min-w-0">
                  <p className="kid-display text-xl font-black text-slate-800 group-hover:text-pink-600">Lớp {l.lop}</p>
                  <p className="text-sm font-bold text-slate-500">{l.de.length} đề · chấm điểm ngay</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {l.nhom.map((n) => (
                  <li key={n.key}>
                    {n.icon} {n.title}
                  </li>
                ))}
              </ul>
              <span className="mt-3 inline-block text-sm font-black text-pink-600">Vào làm đề →</span>
            </Link>
          ))}
        </div>

        <p className="py-8 text-center text-sm font-semibold text-purple-600">
          Muốn in đề ra giấy cho bé? Xem <Link href="/goi-tai-lieu" className="underline">gói tài liệu in</Link> — mỗi bộ đề có bản A4 kèm đáp án.
        </p>
      </div>
    </div>
  );
}
