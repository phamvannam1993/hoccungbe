import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VOCAB_TOPICS, publishableVocabTopics, totalVocabWords } from '../lib/vocab';

const TITLE = 'Từ vựng tiếng Anh cho bé theo chủ đề';
const DESCRIPTION =
  `Học ${totalVocabWords()}+ từ vựng tiếng Anh cho trẻ em theo ${VOCAB_TOPICS.length} chủ đề: động vật, màu sắc, con số, gia đình, trái cây… Có phiên âm, nghĩa tiếng Việt, hình minh hoạ và nghe phát âm chuẩn. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/tu-vung-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/tu-vung-tieng-anh'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const topics = publishableVocabTopics();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Từ vựng tiếng Anh', item: `${SITE_URL}/tu-vung-tieng-anh` },
    ],
  };
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    numberOfItems: topics.length,
    itemListElement: topics.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.heading,
      url: `${SITE_URL}/tu-vung-tieng-anh/${t.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">Từ vựng tiếng Anh</li>
        </ol>
      </nav>

      <header className="relative mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 p-6 text-white shadow-lg sm:p-8">
        <span className="pointer-events-none absolute -right-2 -top-8 text-[10rem] opacity-20 sm:text-[13rem]" aria-hidden>🔤</span>
        <div className="relative">
          <h1 className="text-2xl font-black drop-shadow sm:text-4xl">🔤 Từ vựng tiếng Anh cho bé</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-white/90 sm:text-base">
            Bộ từ vựng chia theo <strong>{topics.length} chủ đề</strong> quen thuộc, tổng cộng <strong>{totalVocabWords()}+ từ</strong>.
            Mỗi từ có phiên âm, nghĩa tiếng Việt, hình minh hoạ và nút nghe phát âm chuẩn. Chọn một chủ đề để bắt đầu!
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">{topics.length} chủ đề</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">{totalVocabWords()}+ từ vựng</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">🔊 Có phát âm</span>
          </div>
        </div>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => {
          const c = [
            'from-pink-400 to-rose-400', 'from-sky-400 to-cyan-400', 'from-amber-400 to-orange-400',
            'from-emerald-400 to-teal-400', 'from-violet-400 to-fuchsia-400', 'from-orange-400 to-red-400',
          ][i % 6];
          return (
            <li key={t.slug}>
              <Link
                href={`/tu-vung-tieng-anh/${t.slug}`}
                className="group flex h-full items-center gap-4 rounded-3xl border-2 border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
              >
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-4xl shadow-inner transition group-hover:scale-110 ${c}`} aria-hidden>
                  {t.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-black text-slate-900">{t.heading}</span>
                  <span className="block text-sm font-semibold text-slate-400">{t.words.length} từ vựng →</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Có thể bé thích</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li><Link href="/tro-choi" className="text-sky-700 hover:underline">Trò chơi học tập</Link></li>
          <li><Link href="/bai-tap" className="text-sky-700 hover:underline">Bài tập theo chủ đề</Link></li>
          <li><Link href="/cong-cu" className="text-sky-700 hover:underline">Công cụ miễn phí</Link></li>
          <li><Link href="/bai-viet" className="text-sky-700 hover:underline">Bài viết cho phụ huynh</Link></li>
        </ul>
      </section>
    </div>
  );
}
