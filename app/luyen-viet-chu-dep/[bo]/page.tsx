import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import { CAC_BO, taoTrang, timBo } from '../../lib/luyenViet';
import TrangViet, { PRINT_VIET_CSS } from '../TrangViet';
import ThanhIn from '../ThanhIn';

export const revalidate = 86400;

export function generateStaticParams() {
  return CAC_BO.map((b) => ({ bo: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ bo: string }> }): Promise<Metadata> {
  const { bo } = await params;
  const b = timBo(bo);
  if (!b) return {};
  const soTrang = taoTrang(b.slug).length;
  const title = `${b.ten} – Phiếu luyện viết chữ đẹp ô li (${soTrang} trang, in PDF)`;
  const description = `${b.gioiThieu} ${soTrang} trang A4 khung ô li 5mm, có chữ mẫu và nét mờ để bé tô. In hoặc tải PDF miễn phí.`;
  return {
    title,
    description,
    alternates: { canonical: canonical(`/luyen-viet-chu-dep/${b.slug}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical(`/luyen-viet-chu-dep/${b.slug}`),
      type: 'article',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ bo: string }> }) {
  const { bo } = await params;
  const b = timBo(bo);
  if (!b) notFound();

  const trangs = taoTrang(b.slug);
  if (!trangs.length) notFound();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Luyện viết chữ đẹp', item: `${SITE_URL}/luyen-viet-chu-dep` },
      { '@type': 'ListItem', position: 3, name: b.ten, item: `${SITE_URL}/luyen-viet-chu-dep/${b.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <style>{PRINT_VIET_CSS}</style>
      <ThanhIn ten={b.ten} soTrang={trangs.length} mau={b.mau} />

      {/* Lời dẫn chỉ hiện trên màn hình — in ra giấy thì thừa */}
      <div className="no-print mx-auto max-w-3xl px-4 pb-2 pt-4 text-center">
        <h1 className="text-2xl font-black text-slate-800">
          {b.emoji} {b.ten}
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">{b.gioiThieu}</p>
        <p className="mt-2 text-xs font-bold text-slate-400">
          {trangs.length} trang A4 · Khi in nhớ chọn tỉ lệ 100% để ô li đúng 5mm
        </p>
      </div>

      <div className="px-2 py-4">
        {trangs.map((t, i) => (
          <div className="to-giay" key={i}>
            <TrangViet trang={t} boSlug={b.slug} tenBo={b.ten} mau={b.mau} soTrang={i + 1} tongTrang={trangs.length} />
          </div>
        ))}
      </div>
    </div>
  );
}
