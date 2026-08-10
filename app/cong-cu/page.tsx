import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

// Hub công cụ. Trước đây /cong-cu trả 404 dù hai công cụ con đã nằm trong sitemap,
// nên chúng không có trang cha nào trỏ tới — Google phải tự tìm.

const TITLE = 'Công cụ miễn phí cho phụ huynh và giáo viên tiểu học';
const DESCRIPTION =
  'Bộ công cụ miễn phí của Bé Hay Học: tạo phiếu bài tập toán in được, chuyển văn bản thành giọng nói và chuyển giọng nói thành văn bản. Không cần đăng ký.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/cong-cu') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/cong-cu'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const TOOLS = [
  {
    href: '/cong-cu/tao-bai-tap-cong-tru',
    emoji: '🧮',
    name: 'Tạo bài tập cộng trừ nhân chia',
    desc: 'Chọn phép tính, phạm vi số và số câu → in ngay hoặc lưu PDF. Có kèm đáp án.',
  },
  {
    href: '/cong-cu/chuyen-van-ban-thanh-giong-noi',
    emoji: '🔊',
    name: 'Chuyển văn bản thành giọng nói',
    desc: 'Dán đoạn văn, nghe đọc mẫu bằng giọng tiếng Việt — tiện cho bé tập đọc theo.',
  },
  {
    href: '/cong-cu/chuyen-giong-noi-thanh-van-ban',
    emoji: '🎙️',
    name: 'Chuyển giọng nói thành văn bản',
    desc: 'Nói vào micro và nhận lại văn bản tiếng Việt, dùng để soạn nhanh đề bài hoặc ghi chú.',
  },
];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Công cụ', item: `${SITE_URL}/cong-cu` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Công cụ miễn phí cho phụ huynh và giáo viên',
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `${SITE_URL}${t.href}`,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">Công cụ</li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{TITLE}</h1>
        <p className="mt-3 text-slate-600">
          Những công cụ nhỏ dùng được ngay trên trình duyệt, không cần cài đặt và không cần tài khoản. Tất cả đều miễn
          phí, dành cho ba mẹ kèm con học ở nhà và thầy cô cần soạn nhanh phiếu luyện tập.
        </p>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="flex h-full flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:shadow"
            >
              <span className="text-2xl" aria-hidden>{t.emoji}</span>
              <span className="mt-1 font-bold text-slate-900">{t.name}</span>
              <span className="mt-1 text-sm text-slate-600">{t.desc}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Có thể bé thích</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li><Link href="/bai-tap" className="text-sky-700 hover:underline">Bài tập theo chủ đề</Link></li>
          <li><Link href="/de-thi" className="text-sky-700 hover:underline">Đề thi &amp; kiểm tra</Link></li>
          <li><Link href="/tro-choi" className="text-sky-700 hover:underline">Trò chơi học tập</Link></li>
          <li><Link href="/bai-viet" className="text-sky-700 hover:underline">Bài viết cho phụ huynh</Link></li>
        </ul>
      </section>
    </div>
  );
}
