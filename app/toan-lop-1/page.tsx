import type { Metadata } from 'next';
import Link from 'next/link';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Toán lớp 1 – Học phép cộng, phép trừ, đếm số cho bé',
  description:
    'Toán lớp 1 cho bé: học đếm số từ 1-100, phép cộng, phép trừ trong phạm vi 10 và 20, so sánh số, hình học cơ bản. Bài tập toán lớp 1 qua trò chơi giúp bé học nhanh hơn.',
  keywords: [
    'toán lớp 1',
    'học toán lớp 1',
    'bài tập toán lớp 1',
    'phép cộng lớp 1',
    'phép trừ lớp 1',
    'đếm số lớp 1',
    'học toán cho bé',
    'toán lớp 1 online',
    'luyện toán lớp 1',
    'đề toán lớp 1',
    'so sánh số lớp 1',
    'toán tư duy lớp 1',
  ],
  alternates: { canonical: `${SITE}/toan-lop-1` },
  openGraph: {
    title: 'Toán lớp 1 – Học phép cộng, phép trừ, đếm số | Bé Hay Học',
    description:
      'Bé học toán lớp 1 qua trò chơi: đếm số, phép cộng trừ trong phạm vi 20, nhận biết hình dạng. Miễn phí, trực quan, bé học vui.',
    url: `${SITE}/toan-lop-1`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Toán lớp 1 – Bé Hay Học' }],
  },
};

const games = [
  { title: 'Đếm Chim', href: '/games/dem-chim', desc: 'Đếm số lượng và nhận biết con số tương ứng qua trò chơi đếm chim.' },
  { title: 'Thỏ Cắp Cà Rốt', href: '/games/tho-cap-ca-rot', desc: 'Luyện phép trừ đơn giản: bé đếm cà rốt còn lại sau khi thỏ lấy đi.' },
  { title: 'Cá Trong Hồ Bơi', href: '/games/ca-trong-ho-boi', desc: 'Nhận biết số lượng và so sánh nhiều - ít qua trò chơi đếm cá vui nhộn.' },
  { title: 'Táo Học Toán', href: '/games/hai-tao-hoc-toan', desc: 'Phép cộng trong phạm vi 10 qua hình ảnh táo trực quan, dễ hiểu.' },
  { title: 'Đoàn Tàu Toán Học', href: '/games/doan-tau-toan-hoc', desc: 'Sắp xếp số theo thứ tự và điền số còn thiếu trong dãy số.' },
  { title: 'Dãy Số', href: '/games/day-so', desc: 'Nhận biết quy luật và điền số tiếp theo trong các dãy số cơ bản.' },
];

const faqItems = [
  {
    q: 'Chương trình toán lớp 1 học những gì?',
    a: 'Toán lớp 1 gồm: đếm và viết số từ 0 đến 100; phép cộng và phép trừ trong phạm vi 10, rồi 20; so sánh số (lớn hơn, nhỏ hơn, bằng); nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật; giải toán có lời văn đơn giản.',
  },
  {
    q: 'Bé học phép cộng trừ lớp 1 như thế nào?',
    a: 'Bắt đầu bằng vật thật (đếm ngón tay, dùng que tính). Sau đó dùng số đường thẳng (number line) để cộng/trừ. Cuối cùng học thuộc các phép tính cơ bản trong phạm vi 10. Trò chơi trực quan giúp bé ghi nhớ mà không cần học vẹt.',
  },
  {
    q: 'Bé học toán lớp 1 bị yếu phải làm sao?',
    a: 'Quay về nền: kiểm tra bé có đếm xuôi/ngược từ 1-20 thành thạo chưa. Nếu chưa vững đếm, mọi phép tính đều sẽ khó. Dùng vật thật và trò chơi thay vì bắt bé làm nhiều đề — áp lực làm bé sợ toán hơn.',
  },
  {
    q: 'Học toán qua trò chơi có hiệu quả không?',
    a: 'Rất hiệu quả với trẻ 5-7 tuổi. Não bé ở giai đoạn này học tốt nhất qua trải nghiệm và lặp lại vui vẻ. Trò chơi tạo ra nhiều lần lặp lại mà bé không nhận ra đang "học" — đây chính là cơ chế ghi nhớ sâu nhất.',
  },
  {
    q: 'Mấy phút học toán mỗi ngày là đủ cho bé lớp 1?',
    a: 'Trẻ lớp 1 (6-7 tuổi) có thể tập trung tốt trong 15-20 phút. Tốt hơn là 2 lần 10 phút thay vì 1 lần 30 phút. Học đều đặn mỗi ngày hiệu quả hơn nhiều so với học dồn cuối tuần.',
  },
];

export default function ToanLop1Page() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Toán lớp 1 – Học phép cộng, phép trừ, đếm số cho bé',
      url: `${SITE}/toan-lop-1`,
      description: 'Bé học toán lớp 1 qua trò chơi: đếm số, phép cộng trừ trong phạm vi 20, nhận biết hình dạng.',
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
          <Link href="/">Trang chủ</Link> &rsaquo; <span className="text-gray-800">Toán lớp 1</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Toán lớp 1 – Học phép cộng, phép trừ &amp; đếm số cho bé
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Chương trình toán lớp 1 bao gồm đếm số, phép cộng và phép trừ trong phạm vi 20, so sánh số và hình học cơ bản. Bé học hiệu quả nhất khi được luyện qua trò chơi trực quan thay vì làm bài thuần túy.
        </p>

        {/* Trò chơi toán */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trò chơi toán lớp 1 miễn phí</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((g) => (
              <Link key={g.href} href={g.href} className="block border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition">
                <p className="font-bold text-gray-900 mb-1">{g.title}</p>
                <p className="text-sm text-gray-600">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/games" className="inline-block text-blue-600 font-semibold hover:underline">
              Xem tất cả trò chơi toán →
            </Link>
          </div>
        </section>

        {/* Nội dung SEO */}
        <article className="prose prose-gray max-w-none mb-10">
          <h2>Nội dung toán lớp 1 theo chương trình mới</h2>
          <p>
            Chương trình toán lớp 1 (GDPT 2018) chia thành các mảng chính:
          </p>
          <ul>
            <li><strong>Số và phép tính:</strong> Đọc, viết, so sánh số đến 100; phép cộng và trừ trong phạm vi 20 (không nhớ).</li>
            <li><strong>Đo lường:</strong> So sánh độ dài, khối lượng bằng đơn vị đo không chuẩn; đọc giờ chẵn trên đồng hồ.</li>
            <li><strong>Hình học:</strong> Nhận biết điểm, đoạn thẳng; hình vuông, hình chữ nhật, hình tam giác, hình tròn.</li>
            <li><strong>Thống kê:</strong> Thu thập dữ liệu đơn giản và đọc bảng biểu cơ bản.</li>
          </ul>

          <h2>Cách giúp bé học phép cộng trừ hiệu quả</h2>
          <p>
            Giai đoạn đầu, bé cần <strong>hiểu ý nghĩa</strong> của cộng (thêm vào) và trừ (lấy đi) trước khi tính toán. Dùng vật thật: 3 quả táo + 2 quả táo = 5 quả táo. Khi bé đã hiểu, chuyển sang que tính, rồi đến tính nhẩm.
          </p>
          <p>
            Trò chơi như <Link href="/games/hai-tao-hoc-toan">Táo Học Toán</Link> và <Link href="/games/tho-cap-ca-rot">Thỏ Cắp Cà Rốt</Link> giúp bé luyện phép tính qua hình ảnh trực quan — không áp lực, bé tự muốn chơi lại.
          </p>

          <h2>Luyện đếm số và nhận biết số lượng</h2>
          <p>
            Trước khi học cộng trừ, bé phải thành thạo đếm từ 1 đến 20 (cả xuôi lẫn ngược), và nhận ra ngay số lượng 1-5 mà không cần đếm từng cái (subitizing). Kỹ năng này là nền tảng cho toàn bộ chương trình toán.
          </p>
        </article>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi thường gặp về toán lớp 1</h2>
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
            <Link href="/bai-tap-lop-1" className="text-blue-600 hover:underline">Bài tập lớp 1</Link>
            <Link href="/hoc-chu-cai" className="text-blue-600 hover:underline">Học chữ cái</Link>
            <Link href="/tro-choi-giao-duc" className="text-blue-600 hover:underline">Trò chơi giáo dục</Link>
            <Link href="/de-thi" className="text-blue-600 hover:underline">Đề thi thử lớp 1</Link>
            <Link href="/games" className="text-blue-600 hover:underline">Tất cả trò chơi</Link>
          </div>
        </nav>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
