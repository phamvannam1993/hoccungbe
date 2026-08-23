import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import LuyenTinhNhamClient from './LuyenTinhNhamClient';
import TinhNhanhClient from './TinhNhanhClient';

export const revalidate = 86400;

const TITLE = 'Luyện tính nhẩm nhanh cho bé (cộng trừ nhân chia)';
const DESCRIPTION =
  'Luyện tính nhẩm nhanh cho bé tiểu học: cộng, trừ trong 10/20/100, bảng nhân, bảng chia và hỗn hợp. Có bàn phím số, chế độ Tính nhanh 60 giây ghi kỷ lục. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/luyen-tinh-nham') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/luyen-tinh-nham'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Luyện tính nhẩm', item: `${SITE_URL}/luyen-tinh-nham` },
    ],
  };

  return (
    <KidShell max="3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Luyện tính nhẩm' }]} />

      <KidHero
        emoji="⚡"
        eyebrow="Toán · Tính nhẩm"
        title="Luyện tính nhẩm nhanh"
        tone="blue"
        description={
          <>
            Bé luyện <strong>cộng, trừ, nhân, chia</strong> theo từng mức (trong 10/20/100, bảng nhân, bảng chia). Có{' '}
            <strong>bàn phím số</strong> dễ bấm và chế độ <strong>Tính nhanh 60 giây</strong> ghi kỷ lục — vừa học vừa thi đua.
          </>
        }
      />

      <LuyenTinhNhamClient />

      <div className="mt-10">
        <h2 className="text-xl font-black text-slate-900 kid-display">🧠 Tính nhanh có mẹo (lớp 1–5)</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Các bài tính nhanh dùng mẹo thông minh, có giải thích và nghe đọc — chọn đúng lớp của bé.</p>
        <TinhNhanhClient />
      </div>

      <div className="mt-8">
        <KidCard emoji="📗" title="Quy tắc cơ bản bé cần thuộc" tone="green">
          <ul className="space-y-2 leading-7 text-slate-700">
            <li><strong>Cộng/trừ với 0:</strong> số nào cộng hoặc trừ 0 cũng bằng chính nó. Ví dụ 5 + 0 = <b>5</b>; 8 − 0 = <b>8</b>.</li>
            <li><strong>Nhân với 1:</strong> số nào nhân 1 cũng bằng chính nó. Ví dụ 7 × 1 = <b>7</b>.</li>
            <li><strong>Nhân với 0:</strong> số nào nhân 0 cũng bằng 0. Ví dụ 9 × 0 = <b>0</b>.</li>
            <li><strong>Nhân với 10:</strong> viết thêm một số 0 vào cuối. Ví dụ 6 × 10 = <b>60</b>.</li>
            <li><strong>Chia cho 1:</strong> bằng chính nó (6 ÷ 1 = 6). <strong>Chia cho chính nó:</strong> bằng 1 (6 ÷ 6 = 1).</li>
            <li><strong>Đổi chỗ (giao hoán):</strong> 3 + 5 = 5 + 3; 4 × 6 = 6 × 4 → chỉ cần nhớ một nửa bảng nhân là đủ.</li>
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="💡" title="Mẹo tính nhẩm nhanh" tone="yellow">
          <ul className="space-y-2 leading-7 text-slate-700">
            <li><strong>Cộng — làm tròn chục:</strong> 8 + 5 = 8 + <b>2</b> + 3 = 10 + 3 = <b>13</b>. Cộng cho đủ chục trước rồi cộng phần còn lại.</li>
            <li><strong>Trừ — về tròn chục:</strong> 13 − 5 = 13 − <b>3</b> − 2 = 10 − 2 = <b>8</b>. Bớt cho về chục tròn rồi bớt tiếp.</li>
            <li><strong>Nhân 2 (gấp đôi):</strong> lấy số đó cộng với chính nó. Ví dụ 2 × 7 = 7 + 7 = <b>14</b>.</li>
            <li><strong>Nhân 4:</strong> nhân đôi hai lần. Ví dụ 4 × 6 = (6 + 6) + (6 + 6) = 12 + 12 = <b>24</b>.</li>
            <li><strong>Nhân 5:</strong> bằng một nửa của nhân 10. Ví dụ 5 × 8 = 80 ÷ 2 = <b>40</b>.</li>
            <li><strong>Nhân 9:</strong> 9 × n = 10 × n − n. Ví dụ 9 × 7 = 70 − 7 = <b>63</b>. (Mẹo: tổng hai chữ số kết quả bảng 9 luôn bằng 9.)</li>
            <li><strong>Chia là phép ngược của nhân:</strong> 56 ÷ 8 = 7 vì 8 × 7 = 56. Thuộc bảng nhân là chia được ngay.</li>
            <li><strong>Luyện mỗi ngày 5–10 phút</strong> ở chế độ Tính nhanh để phản xạ với con số tốt hơn.</li>
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học Toán tiếp" tone="pink">
          <KidLinkList
            tone="pink"
            items={[
              { href: '/bang-cuu-chuong', label: 'Bảng cửu chương', emoji: '✖️' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
              { href: '/bai-tap/toan-lop-1', label: 'Bài tập Toán lớp 1', emoji: '📝' },
              { href: '/de-thi', label: 'Đề thi Toán có chấm điểm', emoji: '🏆' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
