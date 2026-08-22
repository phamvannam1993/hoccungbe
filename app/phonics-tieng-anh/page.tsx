import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { PHONICS_GROUPS, totalPhonicsWords } from '../lib/phonics';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import PhonicsClient from './PhonicsClient';

export const revalidate = 86400;

const TITLE = 'Phonics – Ghép vần đọc tiếng Anh cho bé';
const DESCRIPTION =
  `Học phonics tiếng Anh cho bé: âm 26 chữ cái A–Z và ${totalPhonicsWords()} từ CVC (cat, dog, sun) theo 5 nhóm nguyên âm ngắn. Nghe đọc chậm, giúp bé tự đọc. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/phonics-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/phonics-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Phonics tiếng Anh', item: `${SITE_URL}/phonics-tieng-anh` },
    ],
  };

  const faq = [
    { q: 'Phonics là gì?', a: 'Phonics là phương pháp dạy đọc bằng cách gắn CHỮ với ÂM: bé học âm của từng chữ rồi ghép lại thành từ (c–a–t → cat). Đây là cách trẻ em các nước nói tiếng Anh học đọc.' },
    { q: 'Từ CVC là gì?', a: 'CVC = phụ âm + nguyên âm + phụ âm (consonant–vowel–consonant), ví dụ cat, dog, sun. Đây là dạng từ đơn giản nhất để bắt đầu tập đọc.' },
    { q: 'Nên học phonics khi nào?', a: 'Sau khi bé thuộc mặt chữ (bảng chữ cái) và biết âm cơ bản của mỗi chữ, bé có thể bắt đầu ghép vần đọc từ CVC.' },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Phonics tiếng Anh' }]} />

      <KidHero
        emoji="🔉"
        eyebrow="Tiếng Anh · Tập đọc"
        title="Phonics – Ghép vần đọc tiếng Anh"
        tone="purple"
        description={
          <>
            Học <strong>âm của cả 26 chữ cái A–Z</strong> rồi tập đọc <strong>{totalPhonicsWords()} từ CVC</strong>{' '}
            (cat, dog, sun…) theo 5 nhóm nguyên âm ngắn. Bấm 🐢 để nghe <strong>đánh vần chậm</strong> rồi đọc thường — bé
            dần tự đọc được từ mới.
          </>
        }
      />

      <PhonicsClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình đọc tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp tiếng Anh', emoji: '💬' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp về Phonics" tone="orange">
          <KidFaq items={faq} tone="orange" />
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
      {/* nhóm hiện có: {PHONICS_GROUPS.length} nguyên âm ngắn */}
      <span className="sr-only">{PHONICS_GROUPS.length} nhóm nguyên âm ngắn</span>
    </KidShell>
  );
}
