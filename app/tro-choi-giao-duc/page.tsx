import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Trò chơi giáo dục cho bé – Game học toán, chữ, tư duy miễn phí',
  description:
    'Trò chơi giáo dục cho bé 3-10 tuổi: game học toán, học chữ, tiếng Anh, tư duy logic, ghi nhớ. Miễn phí, không quảng cáo, phụ huynh theo dõi tiến độ dễ dàng.',
  keywords: [
    'trò chơi giáo dục cho bé',
    'game giáo dục cho trẻ em',
    'trò chơi giáo dục miễn phí',
    'game học tập cho bé',
    'trò chơi tư duy cho bé',
    'game giáo dục cho bé 5 tuổi',
    'trò chơi phát triển trí tuệ cho bé',
    'game giáo dục lớp 1',
    'trò chơi học chữ cho bé',
    'game toán học cho trẻ',
    'trò chơi online cho bé',
    'game ghi nhớ cho bé',
  ],
  alternates: { canonical: `${SITE}/tro-choi-giao-duc` },
  openGraph: {
    title: 'Trò chơi giáo dục cho bé – Game học toán, chữ, tư duy miễn phí | Bé Hay Học',
    description:
      'Hơn 20 trò chơi giáo dục cho bé 3-10 tuổi: toán đếm số, học chữ cái, tiếng Anh, ghi nhớ và tư duy. Miễn phí, không quảng cáo.',
    url: `${SITE}/tro-choi-giao-duc`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Trò chơi giáo dục cho bé – Bé Hay Học' }],
  },
};

const categories = [
  {
    title: 'Trò chơi học chữ & ngôn ngữ',
    color: 'border-pink-400',
    games: [
      { title: 'Câu Cá Chữ Cái', href: '/games/cau-ca-chu-cai', desc: 'Nhận biết chữ cái qua trò chơi câu cá.' },
      { title: 'Ghép Chữ Thành Vần', href: '/games/ghep-chu-thanh-van', desc: 'Ghép âm thành vần và từ đơn giản.' },
      { title: 'Tập Viết Chữ', href: '/games/tap-viet-chu', desc: 'Tập tô theo nét chữ mẫu.' },
      { title: 'Tìm Chữ Bị Mất', href: '/games/tim-chu-bi-mat', desc: 'Tìm chữ còn thiếu trong dãy.' },
    ],
  },
  {
    title: 'Trò chơi toán học',
    color: 'border-blue-400',
    games: [
      { title: 'Đếm Chim', href: '/games/dem-chim', desc: 'Đếm và nhận biết số lượng cơ bản.' },
      { title: 'Táo Học Toán', href: '/games/hai-tao-hoc-toan', desc: 'Phép cộng trong phạm vi 10.' },
      { title: 'Thỏ Cắp Cà Rốt', href: '/games/tho-cap-ca-rot', desc: 'Luyện phép trừ qua hình ảnh trực quan.' },
      { title: 'Dãy Số', href: '/games/day-so', desc: 'Nhận biết quy luật và điền số còn thiếu.' },
    ],
  },
  {
    title: 'Trò chơi tiếng Anh',
    color: 'border-green-400',
    games: [
      { title: 'Bắt Bong Bóng Từ Vựng', href: '/games/bat-bong-tu-vung', desc: 'Học từ vựng tiếng Anh qua trò chơi bắn bóng.' },
    ],
  },
  {
    title: 'Trò chơi tư duy & ghi nhớ',
    color: 'border-amber-400',
    games: [
      { title: 'Ghép Hình Rừng', href: '/games/ghep-hinh-rung', desc: 'Rèn tư duy không gian qua trò chơi ghép hình.' },
      { title: 'Thỏ Vào Hang', href: '/games/tho-vao-hang', desc: 'Luyện phản xạ và quan sát nhanh.' },
    ],
  },
];

const faqItems = [
  {
    q: 'Trò chơi giáo dục có thực sự giúp bé học không?',
    a: 'Có — nhiều nghiên cứu cho thấy học qua chơi (play-based learning) hiệu quả với trẻ dưới 8 tuổi. Não bé ghi nhớ tốt hơn khi gắn với cảm xúc tích cực và phần thưởng ngay lập tức. Trò chơi tạo ra đúng điều kiện đó.',
  },
  {
    q: 'Bé mấy tuổi phù hợp với trò chơi giáo dục trên màn hình?',
    a: 'WHO khuyến nghị trẻ dưới 2 tuổi không dùng màn hình, 2-5 tuổi giới hạn 1 giờ/ngày với nội dung chất lượng cao. Từ 5 tuổi trở lên có thể linh hoạt hơn nếu nội dung có mục tiêu học rõ ràng và phụ huynh cùng tham gia.',
  },
  {
    q: 'Làm sao chọn trò chơi giáo dục tốt cho bé?',
    a: 'Chọn trò chơi có: (1) mục tiêu học cụ thể (học chữ, học số, v.v.); (2) phản hồi ngay khi bé trả lời; (3) độ khó tăng dần phù hợp; (4) không có quảng cáo hoặc mua hàng trong game; (5) bé có thể tự chơi mà không cần chờ.',
  },
  {
    q: 'Bé có thể chơi bao nhiêu phút mỗi ngày?',
    a: 'Hướng dẫn thực tế: 2-3 lần 10-15 phút mỗi ngày tốt hơn 1 lần 45 phút. Bé học tốt nhất khi tập trung, không mệt mỏi. Quan sát bé: nếu bé bắt đầu bấm bừa hoặc cáu, đó là lúc dừng.',
  },
];

export default function TroChoiGiaoDucPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Trò chơi giáo dục cho bé – Game học toán, chữ, tư duy miễn phí',
      url: `${SITE}/tro-choi-giao-duc`,
      description: 'Hơn 20 trò chơi giáo dục cho bé 3-10 tuổi: toán đếm số, học chữ cái, tiếng Anh, ghi nhớ và tư duy.',
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
          <Link href="/">Trang chủ</Link> &rsaquo; <span className="text-gray-800">Trò chơi giáo dục</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Trò chơi giáo dục cho bé – Game học toán, chữ &amp; tư duy miễn phí
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Hơn 20 trò chơi giáo dục cho trẻ 3–10 tuổi: học chữ cái, toán đếm số, tiếng Anh, tư duy logic và ghi nhớ. Tất cả miễn phí, không quảng cáo — bé chơi, bé học, phụ huynh an tâm.
        </p>

        {categories.map((cat) => (
          <section key={cat.title} className="mb-10">
            <h2 className={`text-xl font-bold text-gray-800 mb-4 border-l-4 ${cat.color} pl-3`}>{cat.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cat.games.map((g) => (
                <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                  <p className="text-sm text-gray-600">{g.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="text-center mb-10">
          <Link href="/games" className="inline-block bg-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition">
            Xem tất cả trò chơi giáo dục →
          </Link>
        </div>

        {/* Nội dung SEO */}
        <article className="prose prose-gray max-w-none mb-10">
          <h2>Tại sao trò chơi giáo dục tốt hơn bài tập thuần túy?</h2>
          <p>
            Trẻ em học tốt nhất khi chúng <strong>không biết mình đang học</strong>. Trò chơi giáo dục khai thác cơ chế này: bé tập trung vào việc thắng trò chơi, trong khi não đang xử lý khái niệm toán học hoặc ngôn ngữ một cách tự nhiên.
          </p>
          <p>
            So sánh: bé làm 20 bài phép cộng trên giấy thường xong trong 10 phút với nhiều thở dài. Trò chơi toán học cùng loại phép tính có thể khiến bé tự nguyện lặp lại 30-50 lần — gấp nhiều lần lượng luyện tập.
          </p>

          <h2>Trò chơi giáo dục trên Bé Hay Học phù hợp với ai?</h2>
          <p>
            Phù hợp nhất với bé <strong>4–8 tuổi</strong> đang học tiền tiểu học hoặc lớp 1. Mỗi trò chơi có mục tiêu học cụ thể, thiết kế ngắn (5–10 phút/lần), không cần đăng ký tài khoản để chơi thử.
          </p>
        </article>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp về trò chơi giáo dục</h2>
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
            <Link href="/hoc-chu-cai" className="text-purple-600 hover:underline">Học chữ cái</Link>
            <Link href="/toan-lop-1" className="text-purple-600 hover:underline">Toán lớp 1</Link>
            <Link href="/bai-tap-lop-1" className="text-purple-600 hover:underline">Bài tập lớp 1</Link>
            <Link href="/tieng-anh-cho-be" className="text-purple-600 hover:underline">Tiếng Anh cho bé</Link>
            <Link href="/khoa-hoc" className="text-purple-600 hover:underline">Khóa học</Link>
          </div>
        </nav>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
