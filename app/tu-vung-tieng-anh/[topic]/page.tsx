import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import { findVocabTopic, publishableVocabTopics, VOCAB_TOPICS } from '../../lib/vocab';
import { VocabTopicClient } from './VocabTopicClient';

export const revalidate = 86400;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return publishableVocabTopics().map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const t = findVocabTopic(topic);
  if (!t) return { title: 'Không tìm thấy chủ đề', robots: { index: false, follow: false } };
  const url = canonical(`/tu-vung-tieng-anh/${t.slug}`);
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${t.title} | ${SITE_NAME}`,
      description: t.description,
      url,
      type: 'article',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: t.title }],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({ params }: Props) {
  const { topic } = await params;
  const t = findVocabTopic(topic);
  if (!t || t.words.length < 8) notFound();

  const others = VOCAB_TOPICS.filter((x) => x.slug !== t.slug).slice(0, 8);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Từ vựng tiếng Anh', item: `${SITE_URL}/tu-vung-tieng-anh` },
      { '@type': 'ListItem', position: 3, name: t.heading, item: `${SITE_URL}/tu-vung-tieng-anh/${t.slug}` },
    ],
  };
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.title,
    numberOfItems: t.words.length,
    itemListElement: t.words.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${w.en} — ${w.vi}`,
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
          <li><Link href="/tu-vung-tieng-anh" className="hover:text-sky-700">Từ vựng tiếng Anh</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">{t.heading}</li>
        </ol>
      </nav>

      <header className="relative mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 via-rose-400 to-orange-400 p-6 text-white shadow-lg sm:p-8">
        <span className="pointer-events-none absolute -right-4 -top-6 text-[9rem] opacity-20 sm:text-[12rem]" aria-hidden>{t.emoji}</span>
        <div className="relative">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-black backdrop-blur">
            🔤 TỪ VỰNG TIẾNG ANH
          </span>
          <h1 className="mt-3 flex items-center gap-3 text-2xl font-black drop-shadow sm:text-4xl">
            <span aria-hidden>{t.emoji}</span> Chủ đề {t.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-white/90 sm:text-base">{t.intro}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">{t.words.length} từ vựng</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">🔊 Nghe phát âm chuẩn</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold backdrop-blur">🃏 Thẻ ghi nhớ</span>
          </div>
        </div>
      </header>

      <VocabTopicClient words={t.words} heading={t.heading} />

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Cách học từ vựng hiệu quả cho bé</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
          <li>Cho bé <strong>nghe phát âm</strong> và đọc theo 2–3 lần mỗi từ.</li>
          <li>Dùng chế độ <strong>Thẻ ghi nhớ</strong> để bé đoán nghĩa rồi lật thẻ kiểm tra.</li>
          <li>Chỉ vào đồ vật thật trong nhà và gọi tên bằng tiếng Anh.</li>
          <li>Mỗi ngày học 5–7 từ, ôn lại từ hôm trước để nhớ lâu.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-black text-slate-900">🌈 Chủ đề từ vựng khác</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o, i) => {
            const bg = ['bg-pink-50 border-pink-200', 'bg-sky-50 border-sky-200', 'bg-amber-50 border-amber-200', 'bg-emerald-50 border-emerald-200'][i % 4];
            return (
              <li key={o.slug}>
                <Link
                  href={`/tu-vung-tieng-anh/${o.slug}`}
                  className={`flex h-full items-center gap-3 rounded-2xl border-2 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${bg}`}
                >
                  <span className="text-3xl" aria-hidden>{o.emoji}</span>
                  <span className="font-black text-slate-800">{o.heading}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-5">
          <Link href="/tu-vung-tieng-anh" className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-4 py-2 font-black text-sky-700 transition hover:bg-sky-200">← Xem tất cả chủ đề từ vựng</Link>
        </p>
      </section>
    </div>
  );
}
