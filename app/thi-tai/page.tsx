import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import Link from 'next/link';
import { KidShell, KidCrumb } from '../components/seo/kid';
import ThiTaiClient from './ThiTaiClient';

export const revalidate = 86400;

const TITLE = 'Thi Tài — sân thi đấu kiến thức cho bé';
const DESCRIPTION =
  'Thi Tài Bé Hay Học: thi đấu Toán, Tiếng Anh và Khám phá tính giờ, có combo điểm, huy chương Vàng–Bạc–Đồng và hạng mùa. Bé vừa thi vừa nhận sao và khoe thành tích.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/thi-tai') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/thi-tai'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <KidShell max="5xl">
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đấu Trường' }]} />
      <ThiTaiClient />

      {/*
        Liên kết chéo sang sân chơi thi đấu còn lại. Mục menu "Thi Tài" có dropdown
        chứa link này, nhưng dropdown chỉ render khi người dùng bấm mở nên không
        nằm trong HTML — Google không thấy. Link đặt thẳng trong trang mới có giá trị.
      */}
      <section className="mx-auto mt-8 max-w-3xl px-1">
        <Link
          href="/trieu-phu-nhi"
          className="flex items-center gap-4 rounded-3xl p-4 text-white transition hover:-translate-y-1"
          style={{
            background: 'radial-gradient(120% 100% at 50% 0%, #1e40af 0%, #10256e 55%, #071143 100%)',
            boxShadow: '0 8px 0 #050d33, 0 16px 28px rgba(7,17,67,.3)',
          }}
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-3xl" aria-hidden>👑</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-black uppercase tracking-widest text-[#FFD54A]">Thử sức tiếp</span>
            <span className="block text-lg font-black">Ai Là Triệu Phú Nhí</span>
            <span className="mt-0.5 block text-xs font-bold text-white/70">
              Leo 15 mốc thưởng, có trợ giúp và phân tích năng lực sau mỗi ván
            </span>
          </span>
          <span className="hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-black text-[#5a2d00] sm:block"
            style={{ background: 'linear-gradient(180deg,#FFE27A,#F0A400)', boxShadow: '0 4px 0 #B96A00' }}>
            Chơi ngay
          </span>
        </Link>
      </section>
    </KidShell>
  );
}
