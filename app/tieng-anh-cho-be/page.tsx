import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Tiếng Anh cho bé – Học từ vựng, nghe, nói tiếng Anh lớp 1 miễn phí',
  description:
    'Tiếng Anh cho bé 3-8 tuổi: học từ vựng qua hình ảnh, nghe và nói tiếng Anh lớp 1, trò chơi tiếng Anh miễn phí. Phương pháp phù hợp lứa tuổi, bé học tự nhiên và nhớ lâu.',
  keywords: [
    'tiếng Anh cho bé',
    'học tiếng Anh lớp 1',
    'tiếng Anh cho trẻ em',
    'học tiếng Anh mầm non',
    'từ vựng tiếng Anh cho bé',
    'tiếng Anh cho bé 5 tuổi',
    'game tiếng Anh cho bé',
    'học tiếng Anh online cho bé',
    'tiếng Anh trẻ em miễn phí',
    'học tiếng Anh qua trò chơi',
    'tiếng Anh lớp 1 miễn phí',
    'bé học tiếng Anh',
  ],
  alternates: { canonical: `${SITE}/tieng-anh-cho-be` },
  openGraph: {
    title: 'Tiếng Anh cho bé – Học từ vựng, nghe, nói lớp 1 miễn phí | Bé Hay Học',
    description:
      'Bé học tiếng Anh qua trò chơi hình ảnh, âm thanh và từ vựng. Phù hợp bé 3-8 tuổi. Miễn phí, không quảng cáo.',
    url: `${SITE}/tieng-anh-cho-be`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Tiếng Anh cho bé – Bé Hay Học' }],
  },
};

const games = [
  { title: 'Bắt Bong Bóng Từ Vựng', href: '/games/bat-bong-tu-vung', desc: 'Học từ vựng tiếng Anh qua trò chơi bắt bóng — nhìn, nghe, nhớ từ cùng lúc.' },
];

const faqItems = [
  {
    q: 'Bé mấy tuổi nên bắt đầu học tiếng Anh?',
    a: 'Não trẻ em tiếp thu ngôn ngữ dễ nhất từ 0-7 tuổi (giai đoạn "cửa sổ ngôn ngữ"). Không cần chờ vào lớp 1 — bé 3-4 tuổi có thể làm quen với tiếng Anh qua bài hát, hình ảnh và trò chơi đơn giản.',
  },
  {
    q: 'Nên dạy tiếng Anh cho bé theo phương pháp nào?',
    a: 'Phương pháp hiệu quả nhất cho trẻ nhỏ là: (1) nghe nhiều trước, nói sau; (2) học qua ngữ cảnh thực tế (hình ảnh, đồ vật, câu chuyện); (3) lặp lại tự nhiên thay vì học thuộc; (4) không dịch mọi thứ sang tiếng Việt.',
  },
  {
    q: 'Bé lớp 1 học tiếng Anh những gì?',
    a: 'Chương trình tiếng Anh lớp 1 (tiểu học) tập trung vào: chào hỏi cơ bản, màu sắc, con số 1-10, động vật, đồ vật trong lớp học, các câu lệnh đơn giản (Stand up, Sit down). Mục tiêu là nghe hiểu và nói được các mẫu câu đơn giản.',
  },
  {
    q: 'Học tiếng Anh qua trò chơi có hiệu quả không?',
    a: 'Rất hiệu quả với trẻ dưới 8 tuổi. Trò chơi giúp bé tiếp xúc với từ vựng nhiều lần mà không cảm thấy nhàm. Não bé ghi nhớ tốt hơn khi từ vựng gắn với hình ảnh, âm thanh và trải nghiệm vui vẻ.',
  },
  {
    q: 'Bao nhiêu phút học tiếng Anh mỗi ngày là đủ cho bé?',
    a: 'Ngắn và thường xuyên tốt hơn dài và thưa. 10-15 phút mỗi ngày đều đặn tốt hơn 1 tiếng cuối tuần. Xen kẽ giữa xem video, nghe nhạc tiếng Anh và trò chơi từ vựng để bé không bị chán.',
  },
];

export default function TiengAnhChoBePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Tiếng Anh cho bé – Học từ vựng, nghe, nói tiếng Anh lớp 1 miễn phí',
      url: `${SITE}/tieng-anh-cho-be`,
      description: 'Bé học tiếng Anh qua trò chơi hình ảnh, âm thanh và từ vựng. Phù hợp bé 3-8 tuổi. Miễn phí.',
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
          <Link href="/">Trang chủ</Link> &rsaquo; <span className="text-gray-800">Tiếng Anh cho bé</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Tiếng Anh cho bé – Học từ vựng, nghe &amp; nói tiếng Anh lớp 1
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bé học tiếng Anh hiệu quả nhất qua hình ảnh, âm thanh và trò chơi — không học vẹt, không áp lực. Phù hợp với bé 3–8 tuổi đang học mầm non hoặc chuẩn bị vào lớp 1.
        </p>

        {/* Trò chơi tiếng Anh */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trò chơi tiếng Anh cho bé</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((g) => (
              <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition">
                <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                <p className="text-sm text-gray-600">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Sắp ra mắt:</strong> Thêm nhiều trò chơi tiếng Anh cho bé đang được phát triển. Các chủ đề: động vật, màu sắc, đếm số bằng tiếng Anh, câu hỏi cơ bản.
            </p>
          </div>
          <div className="mt-4">
            <Link href="/games" className="inline-block text-green-600 font-semibold hover:underline">
              Xem tất cả trò chơi →
            </Link>
          </div>
        </section>

        {/* Nội dung SEO */}
        <article className="prose prose-gray max-w-none mb-10">
          <h2>Tại sao nên cho bé học tiếng Anh sớm?</h2>
          <p>
            Trẻ em có khả năng tiếp thu ngôn ngữ vượt trội từ 0 đến 7 tuổi — giai đoạn não phát triển nhanh nhất. Bé học ngôn ngữ thứ hai trong giai đoạn này không làm ảnh hưởng đến tiếng Việt, mà ngược lại có thể <strong>hỗ trợ phát triển nhận thức tổng thể</strong>.
          </p>

          <h2>Từ vựng tiếng Anh lớp 1 — Những chủ đề nào quan trọng nhất?</h2>
          <p>Chương trình tiếng Anh lớp 1 tại Việt Nam thường bao gồm các chủ đề:</p>
          <ul>
            <li><strong>Chào hỏi:</strong> Hello, Hi, Good morning, What's your name?, How are you?</li>
            <li><strong>Số đếm:</strong> One to ten (và thêm lên đến twenty)</li>
            <li><strong>Màu sắc:</strong> Red, blue, yellow, green, black, white, orange, pink</li>
            <li><strong>Động vật:</strong> Cat, dog, fish, bird, rabbit, elephant, lion</li>
            <li><strong>Đồ dùng học tập:</strong> Book, pen, pencil, ruler, bag, eraser</li>
            <li><strong>Gia đình:</strong> Mom, dad, brother, sister, grandma, grandpa</li>
          </ul>

          <h2>Gợi ý học tiếng Anh cho bé tại nhà</h2>
          <p>
            Không cần phụ huynh giỏi tiếng Anh để dạy bé học sớm. Một số cách đơn giản và hiệu quả:
          </p>
          <ul>
            <li><strong>Nhạc tiếng Anh cho bé:</strong> Nghe Wheels on the Bus, ABC Song, Baby Shark mỗi ngày trong khi chơi hoặc ăn.</li>
            <li><strong>Dán nhãn đồ vật:</strong> Dán sticker ghi tên tiếng Anh lên đồ vật trong nhà (door, table, chair, window).</li>
            <li><strong>Sách tranh tiếng Anh:</strong> Chọn sách có hình ảnh to, từ ngữ đơn giản — bé xem tranh và nghe phát âm.</li>
            <li><strong>Trò chơi từ vựng online:</strong> 10 phút mỗi ngày với trò chơi tiếng Anh giúp bé tiếp xúc từ nhiều lần.</li>
          </ul>
        </article>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp về tiếng Anh cho bé</h2>
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
            <Link href="/hoc-chu-cai" className="text-green-600 hover:underline">Học chữ cái tiếng Việt</Link>
            <Link href="/toan-lop-1" className="text-green-600 hover:underline">Toán lớp 1</Link>
            <Link href="/tro-choi-giao-duc" className="text-green-600 hover:underline">Trò chơi giáo dục</Link>
            <Link href="/bai-tap-lop-1" className="text-green-600 hover:underline">Bài tập lớp 1</Link>
            <Link href="/khoa-hoc" className="text-green-600 hover:underline">Khóa học</Link>
          </div>
        </nav>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
