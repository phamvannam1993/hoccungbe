import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deTheoSlug, THI_LOP_3, TO_THEO_GOI_L3 } from '../de';
import { getPack } from '../../goi-tai-lieu/packs';
import PhieuThi from '../../thi-lop-1/PhieuThi';
import PackUpsell from '../../components/upsell/PackUpsell';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';
const MON: Record<string, string> = { toan: 'Toán', 'tieng-viet': 'Tiếng Việt' };

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return THI_LOP_3.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const de = deTheoSlug(slug);
  if (!de) return { title: 'Thi thử lớp 3' };
  const description = `${de.description} Làm bài ${MON[de.mon]} lớp 3 trực tuyến như tờ đề giấy, chấm điểm và xem đáp án ngay.`;
  const url = `${SITE}/thi-lop-3/${slug}`;
  return {
    title: de.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: de.title, description, url, type: 'article', siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: de.title }] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const de = deTheoSlug(slug);
  if (!de) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: de.title,
    description: de.description,
    url: `${SITE}/thi-lop-3/${slug}`,
    inLanguage: 'vi-VN',
    educationalLevel: 'Lớp 3',
    about: { '@type': 'Thing', name: MON[de.mon] },
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    timeRequired: de.thoiGian ? `PT${de.thoiGian}M` : undefined,
  };

  return (
    <div className="kid-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto w-full max-w-3xl px-4 pt-5">
        <nav className="mb-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/thi-lop-3" className="hover:text-sky-700">Thi thử lớp 3</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{de.title}</span>
        </nav>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{de.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{de.description}</p>
      </section>
      <PhieuThi phieu={de} />
      <div className="mx-auto -mt-20 w-full max-w-3xl px-4 pb-32">
        {(() => {
          // Mời đúng gói in chứa tờ đề này
          const goi = Object.keys(TO_THEO_GOI_L3).find((k) => TO_THEO_GOI_L3[k].some((p) => p.slug === de.slug));
          return goi ? <PackUpsell slug={goi} spot="thi-lop-3-lam-de" title={`In trọn ${getPack(goi)?.title.toLowerCase()}, kèm đáp án`} /> : null;
        })()}
      </div>
    </div>
  );
}
