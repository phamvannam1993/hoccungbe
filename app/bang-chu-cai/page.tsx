import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidFaq, KidLinkList, TONES, type Tone } from '../components/seo/kid';

export const revalidate = 604800;

const TITLE = 'Bảng chữ cái tiếng Việt đầy đủ 29 chữ – cho bé lớp 1';
const DESCRIPTION =
  'Bảng chữ cái tiếng Việt đầy đủ 29 chữ (thường và hoa), nguyên âm, phụ âm và dấu thanh, giúp bé lớp 1 làm quen mặt chữ. Kèm bài học đánh vần miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['bảng chữ cái tiếng việt', 'bảng chữ cái', '29 chữ cái tiếng việt', 'bảng chữ cái lớp 1', 'nguyên âm phụ âm tiếng việt', 'bảng chữ cái cho bé'],
  alternates: { canonical: canonical('/bang-chu-cai') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bang-chu-cai'),
    type: 'article',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const LETTERS = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'];
const VOWELS = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y'];
const TONES_VN = ['ngang (không dấu)', 'huyền (`)', 'sắc (´)', 'hỏi (?)', 'ngã (~)', 'nặng (.)'];
const LETTER_TONES: Tone[] = ['pink', 'blue', 'orange', 'purple', 'green', 'sky', 'yellow'];

const FAQ = [
  { q: 'Bảng chữ cái tiếng Việt có bao nhiêu chữ?', a: 'Bảng chữ cái tiếng Việt hiện hành có 29 chữ cái: a, ă, â, b, c, d, đ, e, ê, g, h, i, k, l, m, n, o, ô, ơ, p, q, r, s, t, u, ư, v, x, y.' },
  { q: 'Tiếng Việt có bao nhiêu nguyên âm?', a: 'Tiếng Việt có 12 nguyên âm đơn: a, ă, â, e, ê, i, o, ô, ơ, u, ư, y. Các chữ còn lại là phụ âm.' },
  { q: 'Tiếng Việt có mấy dấu thanh?', a: 'Tiếng Việt có 6 thanh: ngang (không dấu), huyền, sắc, hỏi, ngã, nặng.' },
];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bảng chữ cái', item: `${SITE_URL}/bang-chu-cai` },
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

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng chữ cái' }]} />

      <KidHero
        emoji="🔤"
        eyebrow="Chuyên đề"
        title="Bảng chữ cái tiếng Việt 29 chữ"
        tone="blue"
        description="Bảng chữ cái tiếng Việt gồm 29 chữ cái, kèm nguyên âm, phụ âm và 6 dấu thanh — giúp bé lớp 1 làm quen mặt chữ và bắt đầu đánh vần. Bên dưới có bài học và trò chơi luyện chữ miễn phí."
      />

      <div className="mt-6">
        <KidCard emoji="🔡" title="29 chữ cái tiếng Việt" tone="pink" badge={LETTERS.length}>
          <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8">
            {LETTERS.map((l, i) => {
              const t = TONES[LETTER_TONES[i % LETTER_TONES.length]];
              return (
                <div key={l} className="rounded-2xl border-2 bg-white py-2 text-center kid-card-hover" style={{ borderColor: t.border, boxShadow: `0 3px 0 ${t.border}` }}>
                  <div className="text-lg font-black uppercase kid-display" style={{ color: t.c }}>{l}</div>
                  <div className="text-sm text-slate-400">{l}</div>
                </div>
              );
            })}
          </div>
        </KidCard>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <KidCard emoji="🅰️" title="Nguyên âm (12)" tone="orange">
          <p className="text-lg font-bold tracking-wide text-slate-700">{VOWELS.join(' · ')}</p>
        </KidCard>
        <KidCard emoji="🎵" title="6 dấu thanh" tone="green">
          <p className="leading-8 text-slate-700">{TONES_VN.join(', ')}</p>
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <KidFaq items={FAQ} />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title="Học thêm cho bé lớp 1" tone="sky">
          <KidLinkList
            tone="sky"
            items={[
              { href: '/khoa-hoc/tieng-viet-lop-1', label: 'Khóa học Tiếng Việt lớp 1', emoji: '📚' },
              { href: '/luyen-viet-chu', label: 'Luyện viết chữ cho bé', emoji: '✍️' },
              { href: '/bai-tap/tieng-viet-lop-1', label: 'Bài tập Tiếng Việt lớp 1', emoji: '✏️' },
              { href: '/tro-choi', label: 'Trò chơi học chữ', emoji: '🎮' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
