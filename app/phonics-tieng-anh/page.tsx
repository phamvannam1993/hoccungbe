import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { PHONICS_GROUPS, totalPhonicsWords } from '../lib/phonics';
import { WORD_FAMILIES } from '../lib/wordFamilies';
import { DIGRAPHS } from '../lib/digraphs';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import PhonicsClient from './PhonicsClient';
import { VOCAB_TOPICS } from '../lib/vocab';
import { buildVocabFallback } from '../lib/phonicsWords';

// Dựng ở server: trang Phonics dùng ảnh của trang Từ vựng cho từ trùng (cat, dog…) mà không
// phải gửi cả dữ liệu từ vựng ~100KB xuống trình duyệt.
const IMAGE_FALLBACK = buildVocabFallback(VOCAB_TOPICS);

export const revalidate = 86400;

const TITLE = 'Phonics – Ghép vần đọc tiếng Anh cho bé';
const DESCRIPTION =
  `Học phonics tiếng Anh cho bé: âm 26 chữ cái A–Z và ${totalPhonicsWords()} từ CVC (cat, dog, sun) theo 5 nhóm nguyên âm ngắn, ${WORD_FAMILIES.length} thẻ họ từ (word family -at, -ed, -ock…) và ${DIGRAPHS.length} âm ghép & nhóm âm (sh, ai, ar, bl…) in được, có mini quiz. Nghe đọc chậm, giúp bé tự đọc. Miễn phí.`;

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
    { q: 'Word family (họ từ) là gì?', a: 'Là nhóm từ có chung vần cuối, ví dụ bed, red, fed, sled, shed cùng họ -ed. Bé chỉ cần đổi chữ đầu là đọc được từ mới, nên học theo họ từ giúp bé đọc nhanh hơn từng từ riêng lẻ.' },
    { q: 'Âm ghép (digraph) là gì?', a: 'Là 2 chữ cái đứng cạnh nhau nhưng đọc thành MỘT âm, ví dụ sh trong ship, ch trong chair, wh trong whale, ph trong phone. Bé cần nhận ra âm ghép để không đánh vần tách từng chữ.' },
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
            (cat, dog, sun…) theo 5 nhóm nguyên âm ngắn, cùng <strong>{WORD_FAMILIES.length} thẻ họ từ (word family)</strong> hình bông hoa và
            thẻ hình <strong>{DIGRAPHS.length} âm ghép &amp; nhóm âm</strong> (phụ âm ghép, nguyên âm ghép, âm có R, blends) in được.
            Phiên âm theo giọng Anh-Mỹ, mỗi nhóm nguyên âm có mini quiz cuối bài. Bấm 🐢 để nghe <strong>đánh vần chậm</strong> rồi đọc thường — bé
            dần tự đọc được từ mới.
          </>
        }
      />

      <PhonicsClient imageFallback={IMAGE_FALLBACK} />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình đọc tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/bang-phien-am-ipa', label: 'Bảng phiên âm IPA – 44 âm', emoji: '🗣️' },
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
