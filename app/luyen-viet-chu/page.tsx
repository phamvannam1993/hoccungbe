import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidFaq, KidLinkList } from '../components/seo/kid';

export const revalidate = 604800;

const TITLE = 'Luyện viết chữ cho bé lớp 1 – tập viết chữ đẹp, đúng nét';
const DESCRIPTION =
  'Luyện viết chữ cho bé lớp 1: hướng dẫn tập viết chữ cái đúng nét, đúng ô li cùng trò chơi tô chữ tương tác và bài học Tiếng Việt lớp 1 miễn phí tại Bé Hay Học.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['luyện viết chữ', 'tập viết chữ đẹp', 'tập viết chữ lớp 1', 'luyện viết chữ cho bé', 'tô chữ cho bé', 'viết chữ cái'],
  alternates: { canonical: canonical('/luyen-viet-chu') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/luyen-viet-chu'),
    type: 'article',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const STEPS = [
  'Cầm bút đúng cách: ngón cái và ngón trỏ giữ bút, tựa nhẹ lên ngón giữa.',
  'Làm quen mặt chữ và độ cao từng nét trong ô li trước khi viết.',
  'Tô theo nét mờ, viết chậm và đều tay từ trên xuống, từ trái sang phải.',
  'Luyện từng chữ cái, rồi ghép vần và viết từ ngắn.',
  'Mỗi ngày 10–15 phút, khen ngợi để bé giữ hứng thú.',
];

const FAQ = [
  { q: 'Nên cho bé luyện viết chữ từ khi nào?', a: 'Bé thường bắt đầu tập tô và làm quen nét chữ từ mẫu giáo lớn (5 tuổi) và luyện viết chữ cái, chữ ghép chính thức khi vào lớp 1.' },
  { q: 'Làm sao để bé viết chữ đẹp và đúng nét?', a: 'Cho bé cầm bút đúng, viết trong ô li, tô theo nét mờ và luyện đều mỗi ngày một chút. Kết hợp trò chơi tô chữ để bé thấy vui và nhớ hình dạng chữ lâu hơn.' },
];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Luyện viết chữ', item: `${SITE_URL}/luyen-viet-chu` },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Luyện viết chữ' }]} />

      <KidHero emoji="✍️" eyebrow="Chuyên đề" title="Luyện viết chữ cho bé lớp 1" tone="green"
        description="Hướng dẫn luyện viết chữ đẹp, đúng nét cho bé lớp 1 kèm trò chơi tô chữ tương tác. Bé vừa chơi vừa nhớ hình dạng và thứ tự nét của từng chữ cái tiếng Việt.">
        <div className="mt-5">
          <Link
            href="/tro-choi/tap-viet-chu"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-black text-white kid-display kid-btn-3d"
            style={{ backgroundImage: 'linear-gradient(135deg,#6BCB77,#4ECDC4)', boxShadow: '0 6px 0 #0d7a74' }}
          >
            ✍️ Chơi trò tô chữ ngay
          </Link>
        </div>
      </KidHero>

      <div className="mt-6">
        <KidCard emoji="📝" title="5 bước giúp bé viết chữ đẹp" tone="orange">
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-black text-white" style={{ background: '#FF9F45' }}>{i + 1}</span>
                <span className="text-slate-700">{s}</span>
              </li>
            ))}
          </ol>
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <KidFaq items={FAQ} />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title="Học thêm" tone="sky">
          <KidLinkList
            tone="sky"
            items={[
              { href: '/tro-choi/tap-viet-chu', label: 'Trò chơi tập viết chữ', emoji: '🎮' },
              { href: '/bang-chu-cai', label: 'Bảng chữ cái tiếng Việt', emoji: '🔤' },
              { href: '/khoa-hoc/tieng-viet-lop-1', label: 'Khóa học Tiếng Việt lớp 1', emoji: '📚' },
              { href: '/bai-tap/tieng-viet-lop-1', label: 'Bài tập Tiếng Việt lớp 1', emoji: '✏️' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
