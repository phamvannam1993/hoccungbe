import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { VOCAB_TOPICS, publishableVocabTopics, totalVocabWords } from '../lib/vocab';
import { byHref, type CatalogItem } from '../lib/catalog';
import { PageHeader, HocTiep } from '../components/khung';
import { ItemGrid } from '../components/catalog/CatalogCards';

/** Lộ trình học đọc: chữ cái → ghép vần → mẫu câu (thẻ chung, dữ liệu từ sổ đăng ký). */
const LO_TRINH = ['/vong-tu-vung', '/luyen-nghe', '/bang-chu-cai-tieng-anh', '/phonics-tieng-anh', '/mau-cau-tieng-anh']
  .map((h) => byHref(h))
  .filter((x): x is CatalogItem => Boolean(x));

const TITLE = 'Từ vựng tiếng Anh cho bé theo chủ đề';
const DESCRIPTION =
  `Học ${totalVocabWords()}+ từ vựng tiếng Anh cho bé theo ${VOCAB_TOPICS.length} chủ đề: động vật, màu sắc, gia đình… Có phiên âm, hình minh hoạ và nghe phát âm. Miễn phí.`;

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

      <PageHeader
        href="/tu-vung-tieng-anh"
        crumbLabel="Từ vựng tiếng Anh"
        emoji="🔤"
        eyebrow="Tiếng Anh · Từ vựng theo chủ đề"
        title="Từ vựng tiếng Anh cho bé"
        description={
          <>
            Bộ từ vựng chia theo <strong>{topics.length} chủ đề</strong> quen thuộc, tổng cộng <strong>{totalVocabWords()}+ từ</strong>.
            Mỗi từ có phiên âm, nghĩa tiếng Việt, hình minh hoạ và nút nghe phát âm chuẩn. Chọn một chủ đề để bắt đầu!
          </>
        }
      />

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

      <section className="mt-12">
        <h2 className="kid-display text-h2 font-black text-ink">🚀 Lộ trình học đọc tiếng Anh</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Không chỉ học từ — bé học đọc và ghép câu theo thứ tự: chữ cái → ghép vần → mẫu câu.</p>
        <div className="mt-4">
          <ItemGrid items={LO_TRINH} />
        </div>
      </section>

      <HocTiep
        href="/tu-vung-tieng-anh"
        links={[
          { href: '/tro-choi', label: 'Trò chơi học tập', emoji: '🎮' },
          { href: '/bai-tap', label: 'Bài tập theo chủ đề', emoji: '✏️' },
          { href: '/cong-cu', label: 'Công cụ miễn phí', emoji: '🧰' },
          { href: '/bai-viet', label: 'Bài viết cho phụ huynh', emoji: '📰' },
        ]}
      />
    </div>
  );
}
