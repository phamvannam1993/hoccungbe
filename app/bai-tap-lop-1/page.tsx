import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Bài tập lớp 1 – Toán và Tiếng Việt lớp 1 miễn phí',
  description:
    'Bài tập lớp 1 miễn phí: toán lớp 1 (cộng trừ, đếm số), tiếng Việt lớp 1 (đọc, viết, đánh vần). Bài tập dạng trò chơi giúp bé ôn luyện vui và hiệu quả tại nhà.',
  keywords: [
    'bài tập lớp 1',
    'bài tập toán lớp 1',
    'bài tập tiếng Việt lớp 1',
    'đề bài lớp 1',
    'ôn tập lớp 1',
    'luyện tập lớp 1',
    'bài tập về nhà lớp 1',
    'bài tập lớp 1 miễn phí',
    'bài tập lớp 1 online',
    'đề kiểm tra lớp 1',
    'bài tập đếm số lớp 1',
    'bài tập chữ cái lớp 1',
  ],
  alternates: { canonical: `${SITE}/bai-tap-lop-1` },
  openGraph: {
    title: 'Bài tập lớp 1 – Toán & Tiếng Việt miễn phí | Bé Hay Học',
    description:
      'Bài tập lớp 1 dạng trò chơi: toán cộng trừ, đếm số, đọc chữ, ghép vần. Miễn phí, không cần đăng ký.',
    url: `${SITE}/bai-tap-lop-1`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Bài tập lớp 1 – Bé Hay Học' }],
  },
};

const mathGames = [
  { title: 'Đếm Chim', href: '/games/dem-chim', desc: 'Đếm và nhận biết số lượng, nền tảng toán lớp 1.' },
  { title: 'Táo Học Toán', href: '/games/hai-tao-hoc-toan', desc: 'Phép cộng trong phạm vi 10 qua hình ảnh trực quan.' },
  { title: 'Thỏ Cắp Cà Rốt', href: '/games/tho-cap-ca-rot', desc: 'Luyện phép trừ qua trò chơi đếm cà rốt.' },
  { title: 'Dãy Số', href: '/games/day-so', desc: 'Điền số còn thiếu và nhận biết quy luật số.' },
];

const langGames = [
  { title: 'Câu Cá Chữ Cái', href: '/games/cau-ca-chu-cai', desc: 'Nhận biết chữ cái qua trò chơi câu cá.' },
  { title: 'Ghép Chữ Thành Vần', href: '/games/ghep-chu-thanh-van', desc: 'Kéo thả để ghép âm thành vần và từ.' },
  { title: 'Tìm Chữ Bị Mất', href: '/games/tim-chu-bi-mat', desc: 'Ghi nhớ và tìm chữ còn thiếu trong dãy.' },
  { title: 'Tập Viết Chữ', href: '/games/tap-viet-chu', desc: 'Tập tô chữ theo mẫu để luyện viết đẹp.' },
];

const faqItems = [
  {
    q: 'Bé lớp 1 cần làm bao nhiêu bài tập mỗi ngày?',
    a: 'Không có con số cố định, nhưng hướng dẫn chung: 15–20 phút bài tập về nhà là đủ cho lớp 1. Bé cần thời gian vui chơi ngoài trời và hoạt động tự do — đây cũng là phần của sự phát triển.',
  },
  {
    q: 'Làm sao để bé lớp 1 chịu làm bài tập?',
    a: 'Tạo thói quen giờ học cố định (ví dụ: sau bữa tối 30 phút), bắt đầu bằng bài dễ để tạo đà, xen kẽ bài tập với trò chơi học tập. Khen ngợi nỗ lực thay vì kết quả — bé sẽ chủ động hơn.',
  },
  {
    q: 'Bài tập lớp 1 nên ưu tiên môn gì?',
    a: 'Tiếng Việt (đọc và viết) là nền tảng quan trọng nhất — bé đọc được thì tự học được mọi môn. Toán là ưu tiên thứ hai. Nếu bé yếu cả hai, tập trung vào chữ cái và đếm số trước.',
  },
  {
    q: 'Bài tập lớp 1 trên mạng có đáng tin không?',
    a: 'Nên chọn bài tập từ các nguồn uy tín, bám sát chương trình GDPT 2018. Bài tập dạng trò chơi trực tuyến có ưu điểm: bé tự kiểm tra ngay, có phản hồi tức thì và dễ điều chỉnh độ khó.',
  },
];

export default function BaiTapLop1Page() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Bài tập lớp 1 – Toán và Tiếng Việt miễn phí',
      url: `${SITE}/bai-tap-lop-1`,
      description: 'Bài tập lớp 1 dạng trò chơi: toán cộng trừ, đếm số, đọc chữ, ghép vần. Miễn phí.',
      inLanguage: 'vi-VN',
      isPartOf: { '@type': 'WebSite', name: 'Bé Hay Học', url: SITE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/">Trang chủ</Link> &rsaquo; <span className="text-gray-800">Bài tập lớp 1</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Bài tập lớp 1 – Toán và Tiếng Việt lớp 1 miễn phí
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bài tập lớp 1 theo chương trình mới: toán (cộng, trừ, đếm số, so sánh) và tiếng Việt (nhận biết chữ, đánh vần, tập viết). Tất cả dưới dạng trò chơi — bé ôn luyện mà không áp lực.
        </p>

        {/* Bài tập Toán */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bài tập Toán lớp 1</h2>
          <p className="text-sm text-gray-500 mb-4">Đếm số, phép cộng, phép trừ, so sánh, dãy số</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mathGames.map((g) => (
              <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition">
                <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                <p className="text-sm text-gray-600">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/toan-lop-1" className="text-blue-600 text-sm font-semibold hover:underline">Xem thêm bài tập toán lớp 1 →</Link>
          </div>
        </section>

        {/* Bài tập Tiếng Việt */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bài tập Tiếng Việt lớp 1</h2>
          <p className="text-sm text-gray-500 mb-4">Nhận biết chữ cái, ghép vần, đánh vần, tập viết</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {langGames.map((g) => (
              <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:border-pink-400 hover:shadow-md transition">
                <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                <p className="text-sm text-gray-600">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-3">
            <Link href="/hoc-chu-cai" className="text-pink-600 text-sm font-semibold hover:underline">Xem thêm bài tập chữ cái lớp 1 →</Link>
          </div>
        </section>

        {/* Nội dung SEO */}
        <article className="prose prose-gray max-w-none mb-10">
          <h2>Bài tập lớp 1 theo chương trình GDPT 2018</h2>
          <p>
            Chương trình giáo dục phổ thông 2018 cho lớp 1 tập trung vào hai môn cốt lõi: <strong>Tiếng Việt</strong> (420 tiết/năm) và <strong>Toán</strong> (105 tiết/năm). Bài tập ở nhà nên bổ trợ cho những gì bé đang học trên lớp, không đi trước chương trình.
          </p>

          <h2>Nguyên tắc ôn bài tập lớp 1 hiệu quả</h2>
          <ul>
            <li><strong>Lặp lại vừa đủ:</strong> 3-5 lần lặp lại trong 1 tuần giúp ghi nhớ sâu hơn 15 lần trong 1 ngày.</li>
            <li><strong>Đa dạng hình thức:</strong> Xen kẽ viết tay, trò chơi, và đọc to để kích hoạt nhiều vùng não.</li>
            <li><strong>Phản hồi ngay:</strong> Bé cần biết ngay câu trả lời đúng hay sai — trò chơi online có ưu điểm này.</li>
            <li><strong>Không ép:</strong> Nếu bé mệt hoặc căng thẳng, nghỉ 10 phút rồi tiếp tục hiệu quả hơn ép ngồi học.</li>
          </ul>
        </article>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp về bài tập lớp 1</h2>
          <div className="space-y-4">
            {faqItems.map(({ q, a }) => (
              <details key={q} className="border border-gray-200 rounded-lg p-4">
                <summary className="font-semibold text-gray-900 cursor-pointer">{q}</summary>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Liên kết nội bộ */}
        <nav className="border-t pt-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Xem thêm</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/toan-lop-1" className="text-blue-600 hover:underline">Toán lớp 1</Link>
            <Link href="/hoc-chu-cai" className="text-blue-600 hover:underline">Học chữ cái</Link>
            <Link href="/de-thi" className="text-blue-600 hover:underline">Đề thi thử lớp 1</Link>
            <Link href="/tro-choi-giao-duc" className="text-blue-600 hover:underline">Trò chơi giáo dục</Link>
            <Link href="/games" className="text-blue-600 hover:underline">Tất cả trò chơi</Link>
          </div>
        </nav>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
