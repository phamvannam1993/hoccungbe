import Link from 'next/link';
import ExamListClient, { type ExamItem, SUBJECT_LABEL } from './ExamListClient';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

async function fetchExams(): Promise<ExamItem[]> {
  try {
    const res = await fetch(`${API}/api/exams`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch { return []; }
}

export default async function ExamListPage() {
  const exams = await fetchExams();
  const grades = Array.from(new Set(exams.map((e) => e.grade))).sort((a, b) => a - b);
  const subjects = Array.from(new Set(exams.map((e) => SUBJECT_LABEL[e.subject] ?? e.subject)));

  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Đề thi & bài kiểm tra tiểu học – Bé Hay Học',
    numberOfItems: exams.length,
    itemListElement: exams.slice(0, 50).map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.title, url: `${SITE}/de-thi/${e.slug}` })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Đề thi', item: `${SITE}/de-thi` },
    ],
  };

  return (
    <div className="kid-bg relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="relative mx-auto max-w-4xl px-4 pb-2 pt-4 sm:px-6">
        <nav className="flex items-center gap-1.5 text-sm font-bold">
          <Link href="/" className="text-pink-600 hover:text-pink-700">🏠 Trang chủ</Link>
          <span className="text-purple-400">›</span>
          <span className="text-purple-700">Đề thi</span>
        </nav>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-4 sm:px-6">
        {/* Hero + H1 rõ ràng + giới thiệu (SSR, crawlable) */}
        <div className="mb-6 rounded-[32px] border-4 border-pink-200 bg-white p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-4xl">📝</span>
            <h1 className="text-2xl font-black kid-display sm:text-3xl" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Đề thi &amp; bài kiểm tra Toán, Tiếng Việt, Tiếng Anh tiểu học
            </h1>
          </div>
          <p className="text-sm font-medium leading-7 text-purple-700/90 sm:text-base">
            Tổng hợp <strong>{exams.length} đề thi &amp; bài kiểm tra</strong> cho học sinh {grades.length ? `lớp ${grades[0]}–${grades[grades.length - 1]}` : 'tiểu học'}, môn {subjects.join(', ')},
            biên soạn bám sát chương trình của Bộ Giáo dục &amp; Đào tạo. Mỗi đề có mô tả, thời gian làm bài, thang điểm và được chấm tự động ngay khi bé làm xong.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-pink-50 px-4 py-3 ring-1 ring-pink-100">
              <p className="text-xs font-bold text-pink-600">📚 Phân loại theo</p>
              <p className="text-sm font-semibold text-slate-700">Lớp · Môn · Học kỳ</p>
            </div>
            <div className="rounded-2xl bg-teal-50 px-4 py-3 ring-1 ring-teal-100">
              <p className="text-xs font-bold text-teal-600">⏱️ Mỗi đề có</p>
              <p className="text-sm font-semibold text-slate-700">Thời gian &amp; thang điểm</p>
            </div>
            <div className="rounded-2xl bg-violet-50 px-4 py-3 ring-1 ring-violet-100">
              <p className="text-xs font-bold text-violet-600">✅ Sau khi làm</p>
              <p className="text-sm font-semibold text-slate-700">Chấm điểm &amp; xem đáp án</p>
            </div>
          </div>
        </div>

        {/* Hướng dẫn sử dụng (SSR) */}
        <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <h2 className="mb-3 text-lg font-black text-slate-900">Hướng dẫn sử dụng đề thi</h2>
          <ol className="space-y-2 text-sm leading-7 text-slate-600">
            <li>1. Chọn <strong>lớp</strong> và <strong>môn</strong> phù hợp với bé ở bộ lọc bên dưới.</li>
            <li>2. Bấm vào một đề để xem mô tả, số câu, thời gian và bắt đầu làm bài.</li>
            <li>3. Làm bài trực tuyến; hệ thống <strong>chấm điểm ngay</strong> và hiển thị đáp án để bé tự sửa.</li>
            <li>4. Ba mẹ có thể cho bé làm lại nhiều lần miễn phí để ôn tập trước kỳ kiểm tra.</li>
          </ol>
        </div>

        {/* Danh sách đề + bộ lọc (SSR qua props, có tương tác) */}
        {exams.length === 0 ? (
          <div className="rounded-3xl border-4 border-pink-200 bg-white p-12 text-center" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
            <div className="mb-3 text-6xl">📭</div>
            <p className="text-lg font-bold text-purple-700 kid-display">Đề thi đang được cập nhật, ba mẹ quay lại sau nhé!</p>
          </div>
        ) : (
          <ExamListClient exams={exams} />
        )}

        {/* SEO: liên kết crawlable toàn bộ đề (đảm bảo Google index đủ) */}
        <div className="mt-8 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <h2 className="mb-3 text-base font-black text-slate-900">Tất cả đề thi</h2>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {exams.map((e) => (
              <li key={e.id}>
                <Link href={`/de-thi/${e.slug}`} className="text-sm text-blue-600 hover:underline">{e.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
