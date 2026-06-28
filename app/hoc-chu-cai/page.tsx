import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Học chữ cái cho bé – Tập viết, nhận biết chữ cái tiếng Việt lớp 1',
  description:
    'Hướng dẫn bé học chữ cái tiếng Việt: tập viết chữ, nhận biết mặt chữ, ghép vần, đánh vần lớp 1. Phương pháp học qua trò chơi, bé học nhanh hơn và nhớ lâu hơn.',
  keywords: [
    'học chữ cái cho bé',
    'tập viết chữ',
    'học chữ cái tiếng Việt',
    'bé học chữ',
    'nhận biết chữ cái',
    'học đánh vần lớp 1',
    'tập viết lớp 1',
    'ghép vần cho bé',
    'học chữ cái a b c',
    'cách dạy bé học chữ',
    'học chữ cái online',
    'tập tô chữ cho bé',
  ],
  alternates: { canonical: `${SITE}/hoc-chu-cai` },
  openGraph: {
    title: 'Học chữ cái cho bé – Tập viết & nhận biết chữ cái tiếng Việt | Bé Hay Học',
    description:
      'Bé học chữ cái tiếng Việt qua trò chơi: tập viết nét, ghép vần, đánh vần lớp 1. Miễn phí, không cần đăng ký.',
    url: `${SITE}/hoc-chu-cai`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Học chữ cái cho bé – Bé Hay Học' }],
  },
};

const games = [
  { title: 'Câu Cá Chữ Cái', href: '/games/cau-ca-chu-cai', desc: 'Nhận biết và phân biệt các chữ cái qua trò chơi câu cá vui nhộn.' },
  { title: 'Tìm Chữ Bị Mất', href: '/games/tim-chu-bi-mat', desc: 'Luyện ghi nhớ mặt chữ bằng cách tìm ra chữ còn thiếu trong dãy.' },
  { title: 'Tập Viết Chữ', href: '/games/tap-viet-chu', desc: 'Tập tô theo nét chữ mẫu để bé làm quen với cách viết chuẩn.' },
  { title: 'Ghép Chữ Thành Vần', href: '/games/ghep-chu-thanh-van', desc: 'Kéo thả chữ cái để ghép thành vần và từ đơn giản.' },
];

const faqItems = [
  {
    q: 'Bé mấy tuổi thì học chữ cái được?',
    a: 'Hầu hết trẻ 4-5 tuổi đã sẵn sàng nhận biết chữ cái. Bé 3 tuổi có thể bắt đầu với các chữ cái đơn giản qua hình ảnh và âm thanh. Đừng ép — học qua trò chơi giúp bé tiếp cận tự nhiên hơn.',
  },
  {
    q: 'Thứ tự học chữ cái tiếng Việt như thế nào?',
    a: 'Bộ chữ cái tiếng Việt có 29 chữ. Nhiều phụ huynh bắt đầu với các chữ cơ bản: a, ă, â, b, c, d, đ... Quan trọng hơn thứ tự là bé nhận ra mặt chữ và liên kết được âm tương ứng.',
  },
  {
    q: 'Làm thế nào để bé nhớ mặt chữ lâu hơn?',
    a: 'Lặp lại qua trò chơi và hoạt động thực tế: chỉ vào chữ trên sách, bảng hiệu; viết chữ to bằng phấn; dùng đất nặn tạo hình chữ. Học qua nhiều giác quan giúp bé nhớ lâu hơn.',
  },
  {
    q: 'Tập viết chữ lớp 1 cần lưu ý gì?',
    a: 'Cần chú ý: tư thế ngồi thẳng, cầm bút đúng cách (ngón cái, trỏ, giữa), viết từ trái sang phải, từ trên xuống dưới. Luyện nét cơ bản trước (nét thẳng, nét cong) rồi mới ghép thành chữ.',
  },
  {
    q: 'Học đánh vần lớp 1 khó không?',
    a: 'Đánh vần tiếng Việt có quy tắc rõ ràng: âm đầu + vần + thanh điệu. Khi bé đã nhớ mặt chữ và biết âm, ghép vần sẽ đến tự nhiên. Trò chơi ghép vần giúp bé luyện tập mà không bị áp lực.',
  },
];

export default function HocChuCaiPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Học chữ cái cho bé – Tập viết chữ cái tiếng Việt lớp 1',
      url: `${SITE}/hoc-chu-cai`,
      description: 'Hướng dẫn bé học chữ cái tiếng Việt, tập viết, nhận biết mặt chữ và đánh vần qua trò chơi giáo dục.',
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
          <Link href="/">Trang chủ</Link> &rsaquo; <span className="text-gray-800">Học chữ cái</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Học chữ cái cho bé – Tập viết &amp; nhận biết chữ cái tiếng Việt
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bé học chữ cái tiếng Việt hiệu quả nhất khi được học qua trò chơi: tập viết theo nét, nhận biết mặt chữ, ghép vần và đánh vần lớp 1. Miễn phí, không cần tài khoản.
        </p>

        {/* Trò chơi liên quan */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trò chơi học chữ cái cho bé</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((g) => (
              <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:border-pink-400 hover:shadow-md transition">
                <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                <p className="text-sm text-gray-600">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/games" className="inline-block text-pink-600 font-semibold hover:underline">
              Xem tất cả trò chơi →
            </Link>
          </div>
        </section>

        {/* Nội dung SEO */}
        <article className="prose prose-gray max-w-none mb-10">
          <h2>Học chữ cái tiếng Việt — Bộ 29 chữ cái đầy đủ</h2>
          <p>
            Chương trình tiếng Việt lớp 1 bắt đầu bằng việc nhận biết 29 chữ cái: a, ă, â, b, c, d, đ, e, ê, g, h, i, k, l, m, n, o, ô, ơ, p, q, r, s, t, u, ư, v, x, y. Mỗi chữ có hình dạng, tên gọi và âm đọc riêng.
          </p>
          <p>
            Bé thường mất 2–4 tuần để nhớ hết mặt chữ nếu luyện đều đặn 10–15 phút mỗi ngày. Học qua trò chơi giúp bé giảm áp lực và nhớ lâu hơn học thuộc lòng.
          </p>

          <h2>Tập viết chữ lớp 1 — Từ nét đến chữ hoàn chỉnh</h2>
          <p>
            Tập viết chữ lớp 1 bắt đầu từ các <strong>nét cơ bản</strong>: nét thẳng, nét ngang, nét xiên, nét cong hở, nét cong kín, nét móc. Khi bé thành thạo nét, việc ghép thành chữ sẽ nhanh và đẹp hơn.
          </p>
          <p>
            Lưu ý quan trọng: <strong>tư thế ngồi và cách cầm bút</strong> ảnh hưởng lớn đến nét chữ lâu dài. Hãy sửa từ sớm để bé không hình thành thói quen sai khó bỏ.
          </p>

          <h2>Ghép vần và đánh vần tiếng Việt</h2>
          <p>
            Sau khi nhớ chữ cái, bé học ghép vần: âm đầu + vần = tiếng. Ví dụ: b + a = ba, m + e = me. Tiếng Việt có hơn 150 vần phổ biến, nhưng chỉ khoảng 30–40 vần xuất hiện thường xuyên trong sách lớp 1.
          </p>
          <p>
            Trò chơi <Link href="/games/ghep-chu-thanh-van">Ghép Chữ Thành Vần</Link> trên Bé Hay Học giúp bé luyện ghép vần qua hoạt động kéo thả vui nhộn, phù hợp bé 5–7 tuổi.
          </p>
        </article>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp về học chữ cái</h2>
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
            <Link href="/bai-tap-lop-1" className="text-pink-600 hover:underline">Bài tập lớp 1</Link>
            <Link href="/toan-lop-1" className="text-pink-600 hover:underline">Toán lớp 1</Link>
            <Link href="/tro-choi-giao-duc" className="text-pink-600 hover:underline">Trò chơi giáo dục</Link>
            <Link href="/tieng-anh-cho-be" className="text-pink-600 hover:underline">Tiếng Anh cho bé</Link>
            <Link href="/games" className="text-pink-600 hover:underline">Tất cả trò chơi</Link>
          </div>
        </nav>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
