import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidFaq, KidLinkList, TONES, type Tone } from '../components/seo/kid';

// Trang chuyên đề evergreen: /bang-cuu-chuong — keyword "bảng cửu chương" traffic rất cao.

export const revalidate = 604800;

const TITLE = 'Bảng cửu chương từ 2 đến 9 đầy đủ – Bảng nhân cho bé (in được)';
const DESCRIPTION =
  'Bảng cửu chương (bảng nhân) từ 2 đến 9 đầy đủ, dễ đọc, in được cho bé học thuộc. Kèm mẹo ghi nhớ nhanh và bài tập, trò chơi nhân chia miễn phí tại Bé Hay Học.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['bảng cửu chương', 'bảng nhân', 'bảng cửu chương từ 2 đến 9', 'bảng cửu chương lớp 2', 'bảng nhân 2 3 4 5 6 7 8 9', 'học bảng cửu chương'],
  alternates: { canonical: canonical('/bang-cuu-chuong') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bang-cuu-chuong'),
    type: 'article',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const TABLE_TONES: Tone[] = ['pink', 'blue', 'orange', 'purple', 'green', 'sky', 'yellow', 'pink'];

const TIPS = [
  'Học theo thứ tự từ dễ đến khó: bảng 2, 5, 10 trước, rồi 3, 4, 6, 7, 8, 9.',
  'Đọc thành nhịp mỗi ngày 3–5 phút; ôn lại bảng cũ trước khi học bảng mới.',
  'Mẹo bảng 9: kết quả có tổng hai chữ số luôn bằng 9 (9×3=27 → 2+7=9).',
  'Nhân đổi chỗ cho kết quả như nhau (7×8 = 8×7) nên chỉ cần nhớ một nửa bảng.',
  'Luyện qua bài tập và trò chơi để nhớ lâu, tránh học vẹt.',
];

const FAQ = [
  { q: 'Bảng cửu chương là gì?', a: 'Bảng cửu chương (còn gọi là bảng nhân) là bảng liệt kê kết quả phép nhân của các số từ 2 đến 9 với các số từ 1 đến 10, giúp bé ghi nhớ nhanh kết quả phép nhân mà không cần tính lại mỗi lần.' },
  { q: 'Lớp mấy học bảng cửu chương?', a: 'Bé bắt đầu làm quen bảng nhân từ cuối lớp 2 và học đầy đủ, thành thạo bảng cửu chương từ 2 đến 9 ở lớp 3. Đây là nền tảng cho phép nhân, phép chia và toán có lời văn sau này.' },
  { q: 'Làm sao để học thuộc bảng cửu chương nhanh?', a: 'Học lần lượt từ bảng dễ (2, 5, 10) đến khó hơn; đọc thành nhịp mỗi ngày vài phút; dùng mẹo (nhân 9 thì tổng hai chữ số luôn bằng 9); và luyện qua bài tập, trò chơi để nhớ lâu thay vì học vẹt.' },
];

export default function Page() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bảng cửu chương', item: `${SITE_URL}/bang-cuu-chuong` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng cửu chương' }]} />

      <KidHero
        emoji="🔢"
        eyebrow="Chuyên đề"
        title="Bảng cửu chương từ 2 đến 9"
        tone="pink"
        description="Bảng cửu chương (bảng nhân) từ 2 đến 9 đầy đủ, trình bày rõ ràng, dễ đọc và in được để bé học thuộc mỗi ngày. Bên dưới có mẹo ghi nhớ nhanh cùng bài tập và trò chơi nhân chia miễn phí."
      />

      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TABLES.map((n, i) => {
            const t = TONES[TABLE_TONES[i]];
            return (
              <div key={n} className="overflow-hidden rounded-3xl border-2 bg-white kid-card-hover" style={{ borderColor: t.border, boxShadow: `0 5px 18px ${t.shadow}` }}>
                <div className="py-2 text-center text-base font-black text-white kid-display" style={{ backgroundImage: t.grad }}>
                  Bảng nhân {n}
                </div>
                <ul className="space-y-0.5 py-2 text-center text-sm text-slate-800 tabular-nums">
                  {ROWS.map((r) => (
                    <li key={r}>
                      {n} × {r} = <strong style={{ color: t.c }}>{n * r}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <KidCard emoji="💡" title="Mẹo học thuộc nhanh" tone="yellow">
          <ul className="space-y-2 text-slate-700">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span aria-hidden style={{ color: '#f59e0b' }}>★</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <KidFaq items={FAQ} />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title="Luyện tập thêm" tone="green">
          <KidLinkList
            tone="green"
            items={[
              { href: '/khoa-hoc/toan-lop-3', label: 'Khóa học Toán lớp 3', emoji: '📚' },
              { href: '/bai-tap/toan-lop-3', label: 'Bài tập Toán lớp 3', emoji: '✏️' },
              { href: '/phieu-bai-tap/lop/toan-lop-3', label: 'Phiếu bài tập Toán lớp 3', emoji: '📄' },
              { href: '/toan-tu-duy-lop-3', label: 'Toán tư duy lớp 3', emoji: '🧠' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
