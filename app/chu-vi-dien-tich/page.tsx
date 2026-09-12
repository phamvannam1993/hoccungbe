import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { MUC_DO, TEN_HINH, congThuc } from '../lib/chuViDienTich';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import ChuViClient from './ChuViClient';

export const revalidate = 86400;

const TITLE = 'Chu vi và diện tích – kéo hình để hiểu, cho bé lớp 3 đến lớp 5';
const DESCRIPTION =
  'Bé kéo cạnh hình chữ nhật trên lưới ô vuông và thấy chu vi, diện tích đổi theo; sau đó tính chu vi – diện tích hình vuông, chữ nhật, bình hành, tam giác, hình thang. Có công thức và lời giải từng bước. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/chu-vi-dien-tich') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/chu-vi-dien-tich'),
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
      { '@type': 'ListItem', position: 2, name: 'Chu vi và diện tích', item: `${SITE_URL}/chu-vi-dien-tich` },
    ],
  };

  const faq = [
    {
      q: 'Chu vi và diện tích khác nhau chỗ nào?',
      a: 'Chu vi là độ dài đi quanh mép hình, đo bằng cm. Diện tích là phần phủ kín bên trong, đo bằng cm². Kéo hình trong trang này là thấy ngay: kéo dài ra thì diện tích tăng nhanh hơn chu vi nhiều.',
    },
    {
      q: 'Hai hình cùng chu vi có cùng diện tích không?',
      a: 'Không. Hình 4 × 2 và hình 5 × 1 đều có chu vi 12, nhưng diện tích là 8 và 5. Đây chính là chỗ dạng "kéo hình" cho bé tự phát hiện, vì mỗi yêu cầu có nhiều cách dựng đúng.',
    },
    {
      q: 'Vì sao diện tích tam giác phải chia 2?',
      a: 'Vì tam giác chỉ bằng một nửa hình chữ nhật có cùng đáy và cùng chiều cao. Ghép hai tam giác giống nhau là được một hình chữ nhật — nên lấy đáy nhân chiều cao rồi chia đôi.',
    },
    {
      q: 'Chiều cao của hình bình hành đo ở đâu?',
      a: 'Là đoạn vuông góc từ đỉnh xuống đáy, không phải cạnh xiên. Trong hình minh hoạ, chiều cao được vẽ bằng nét đứt để bé phân biệt với cạnh bên.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Chu vi và diện tích' }]} />

      <KidHero
        emoji="📏"
        eyebrow="Toán · Hình học đo lường"
        title="Chu vi và diện tích – kéo để thấy"
        tone="green"
        description={
          <>
            Bé <strong>kéo cạnh hình chữ nhật</strong> trên lưới ô vuông, chu vi và diện tích đổi theo tay kéo — hiểu
            ngay vì sao hai hình cùng chu vi lại khác diện tích. Sau đó chuyển sang{' '}
            <strong>tính theo công thức</strong> với năm loại hình.
          </>
        }
      />

      <ChuViClient />

      <div className="mt-8">
        <KidCard emoji="🧮" title="Bảng công thức" tone="green">
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            {(Object.keys(congThuc) as (keyof typeof congThuc)[]).map((k) => (
              <li key={k}>
                <b className="capitalize">{TEN_HINH[k]}</b>: diện tích = {congThuc[k].dt}
                {congThuc[k].cv && <> · chu vi = {congThuc[k].cv}</>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Chu vi tam giác, bình hành và hình thang cần biết độ dài các cạnh xiên, nên phần này chỉ hỏi diện tích.
          </p>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Ba mức theo lớp" tone="blue" badge={`${MUC_DO.length} mức`}>
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {MUC_DO.map((m) => (<li key={m.lop}><b>{m.ten}</b> — {m.moTa}</li>))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="orange">
          <KidLinkList
            tone="orange"
            items={[
              { href: '/hinh-hoc', label: 'Hình học – nhận hình, đối xứng, khối 3D', emoji: '🔷' },
              { href: '/do-luong', label: 'Đo lường – thước, cân, đổi đơn vị', emoji: '📐' },
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/toan-tu-duy', label: 'Toán tư duy lớp 1–5', emoji: '🧠' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <KidFaq items={faq} tone="purple" />
        </KidCard>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
    </KidShell>
  );
}
