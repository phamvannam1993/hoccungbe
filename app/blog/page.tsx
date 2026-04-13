import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog phụ huynh | Học Cùng Bé',
  description:
    'Góc phụ huynh của Học Cùng Bé chia sẻ mẹo học tại nhà, cách giúp bé tập trung, xây góc học tập và đồng hành cùng trẻ 3 đến 10 tuổi.',
  keywords: [
    'blog phụ huynh',
    'học cùng bé blog',
    'mẹo học tại nhà cho trẻ',
    'cách giúp bé tập trung',
    'góc học tập cho bé',
    'dạy con học tại nhà',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog phụ huynh | Học Cùng Bé',
    description:
      'Những bài viết ngắn, dễ áp dụng giúp phụ huynh đồng hành cùng con học tập tốt hơn mỗi ngày.',
    url: '/blog',
    type: 'website',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog phụ huynh - Học Cùng Bé',
      },
    ],
  },
};

const categories = [
  'Tất cả',
  'Tập trung học tập',
  'Thói quen học',
  'Góc học tập',
  'Dành cho phụ huynh',
];

const featuredPost = {
  title: '5 cách giúp bé tập trung hơn khi học tại nhà',
  desc: 'Những thay đổi nhỏ nhưng rất hiệu quả để bé vào nhịp học tốt hơn mỗi ngày.',
  href: '/blog/giup-be-tap-trung-khi-hoc',
  category: 'Tập trung học tập',
  readTime: '5 phút đọc',
};

const blogPosts = [
  {
    title: '5 cách giúp bé tập trung hơn khi học tại nhà',
    desc: 'Gợi ý đơn giản giúp trẻ giảm xao nhãng và duy trì sự chú ý tốt hơn khi học ở nhà.',
    href: '/blog/giup-be-tap-trung-khi-hoc',
    category: 'Tập trung học tập',
    readTime: '5 phút đọc',
    badgeColor: 'bg-sky-100 text-sky-700',
  },
  {
    title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
    desc: 'Xác định thời lượng học phù hợp để bé không bị quá tải và vẫn giữ được hứng thú.',
    href: '/blog/thoi-luong-hoc-phu-hop-cho-tre',
    category: 'Thói quen học',
    readTime: '4 phút đọc',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    title: 'Gợi ý góc học tập đơn giản cho bé tại nhà',
    desc: 'Một vài điều chỉnh nhỏ giúp bé ít xao nhãng hơn và dễ vào nhịp học hơn.',
    href: '/blog/goc-hoc-tap-cho-be',
    category: 'Góc học tập',
    readTime: '4 phút đọc',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: '3 sai lầm phụ huynh hay mắc khi dạy con học ở nhà',
    desc: 'Những lỗi phổ biến khiến trẻ chán học và cách điều chỉnh để việc học nhẹ nhàng hơn.',
    href: '/blog/sai-lam-day-con-hoc-tai-nha',
    category: 'Dành cho phụ huynh',
    readTime: '4 phút đọc',
    badgeColor: 'bg-pink-100 text-pink-700',
  },
];

export default function BlogPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Góc phụ huynh
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Bài viết ngắn, dễ áp dụng để đồng hành cùng bé tốt hơn mỗi ngày
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Từ cách giúp bé tập trung hơn, xây góc học tập phù hợp đến những sai lầm
              phụ huynh thường gặp khi dạy con tại nhà. Tất cả đều được viết ngắn gọn,
              rõ ràng và thực tế.
            </p>
          </div>

          {/* Search + filter UI mock */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg text-slate-400">🔎</span>
                <input
                  type="text"
                  placeholder="Tìm bài viết phù hợp cho bạn..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    item === 'Tất cả'
                      ? 'bg-sky-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-500 via-cyan-500 to-violet-500 p-[1px] shadow-lg">
            <div className="h-full rounded-[31px] bg-white p-6 sm:p-8">
              <div className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                Bài nổi bật
              </div>

              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-sky-600">
                {featuredPost.category}
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {featuredPost.title}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                {featuredPost.desc}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>{featuredPost.readTime}</span>
                <span>•</span>
                <span>Dành cho phụ huynh có con 3–10 tuổi</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={featuredPost.href}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                >
                  Đọc bài viết
                </Link>
                <Link
                  href="/games"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  Khám phá trò chơi
                </Link>
              </div>
            </div>
          </article>

          <aside className="rounded-[32px] border border-slate-100 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">Chủ đề được quan tâm</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.slice(1).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-white p-5 ring-1 ring-slate-100">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Gợi ý
              </p>
              <h4 className="mt-3 text-lg font-black text-slate-900">
                Bắt đầu từ những bài ngắn, dễ áp dụng
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Nếu bạn mới vào blog, hãy đọc các bài về tập trung học tập, thời lượng
                học và góc học tập. Đây là 3 nền tảng giúp việc học tại nhà nhẹ nhàng hơn.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Grid posts */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Tất cả bài viết
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Nội dung mới dành cho phụ huynh
            </h2>
          </div>

          <div className="hidden text-sm text-slate-500 sm:block">
            {blogPosts.length} bài viết
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="group flex h-full flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${post.badgeColor}`}
                >
                  {post.category}
                </span>
                <span className="text-xs font-medium text-slate-400">{post.readTime}</span>
              </div>

              <div className="mt-5 flex h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-50 via-white to-violet-50 text-5xl">
                📘
              </div>

              <h3 className="mt-5 text-xl font-black leading-tight text-slate-900 transition group-hover:text-sky-700">
                {post.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.desc}</p>

              <Link
                href={post.href}
                className="mt-5 inline-flex items-center font-bold text-sky-700 transition hover:text-sky-800"
              >
                Đọc tiếp →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] bg-slate-50 px-6 py-10 ring-1 ring-slate-100 sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Đồng hành cùng bé mỗi ngày
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Đọc bài viết xong, hãy để bé bắt đầu bằng những hoạt động ngắn và vui
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Những trò chơi giáo dục trực quan sẽ giúp bé dễ vào nhịp học hơn và giúp
              phụ huynh áp dụng ngay những gì vừa đọc.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Khám phá trò chơi
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
