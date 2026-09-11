import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { IPA, NHOM_IPA, CAP_THANH, amTheoNhom } from '../lib/ipa';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import IpaClient from './IpaClient';

export const revalidate = 86400;

const TITLE = 'Bảng phiên âm IPA tiếng Anh – 44 âm đầy đủ';
const DESCRIPTION =
  'Bảng phiên âm quốc tế IPA đầy đủ 44 âm tiếng Anh: 12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm. Mỗi âm có cách đọc, khẩu hình, vị trí lưỡi, từ ví dụ nghe được và lỗi người Việt hay mắc.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bang-phien-am-ipa') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bang-phien-am-ipa'),
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
      { '@type': 'ListItem', position: 2, name: 'Bảng phiên âm IPA', item: `${SITE_URL}/bang-phien-am-ipa` },
    ],
  };

  const faq = [
    {
      q: 'IPA là gì?',
      a: 'IPA (International Phonetic Alphabet) là bảng ký hiệu ngữ âm quốc tế. Mỗi ký hiệu ứng với đúng một âm, nên nhìn phiên âm là đọc được từ mới mà không cần nghe trước.',
    },
    {
      q: 'Tiếng Anh có bao nhiêu âm IPA?',
      a: 'Có 44 âm: 12 nguyên âm đơn, 8 nguyên âm đôi và 24 phụ âm. Trang này liệt kê đủ cả 44 âm, mỗi âm kèm khẩu hình, vị trí lưỡi và từ ví dụ nghe được.',
    },
    {
      q: 'Người Việt hay phát âm sai những âm nào?',
      a: 'Hay sai nhất là /θ/ và /ð/ (phải đặt lưỡi giữa hai hàm răng), /æ/ (không có trong tiếng Việt), /v/ (phải chạm răng vào môi dưới), /z/ và /s/ ở cuối từ, cùng các phụ âm cuối thường bị nuốt mất.',
    },
    {
      q: 'Hữu thanh và vô thanh khác nhau thế nào?',
      a: `Đặt tay lên cổ họng: âm hữu thanh làm dây thanh rung, âm vô thanh thì không. Tiếng Anh có ${CAP_THANH.length} cặp chỉ khác nhau đúng ở điểm này, ví dụ /p/–/b/ hay /s/–/z/.`,
    },
    {
      q: 'Nên học IPA theo thứ tự nào?',
      a: 'Bắt đầu từ 12 nguyên âm đơn (nền của mọi từ), rồi 8 nguyên âm đôi, cuối cùng là 24 phụ âm — học phụ âm theo cặp hữu thanh / vô thanh sẽ nhanh thuộc hơn.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng phiên âm IPA' }]} />

      <KidHero
        emoji="🔤"
        eyebrow="Tiếng Anh · Phát âm"
        title="Bảng phiên âm IPA – 44 âm tiếng Anh"
        tone="sky"
        description={
          <>
            Đầy đủ <strong>{IPA.length} âm</strong>: {amTheoNhom('don').length} nguyên âm đơn,{' '}
            {amTheoNhom('doi').length} nguyên âm đôi và {amTheoNhom('phuam').length} phụ âm. Bấm vào một âm để xem{' '}
            <strong>khẩu hình, vị trí lưỡi</strong>, nghe từ ví dụ (có nút 🐢 đọc chậm) và biết{' '}
            <strong>lỗi người Việt hay mắc</strong> ở âm đó.
          </>
        }
      />

      {/* Nói rõ đang dùng bộ ký hiệu nào: cùng một từ, Anh và Mỹ ghi khác nhau
          (car /kɑː/ – /kɑːr/), nên không nói trước là bé tưởng trang này sai. */}
      <p className="mt-4 rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
        <b>Bộ ký hiệu Anh – Anh (RP)</b> — đúng bộ 44 âm mà sách giáo khoa và từ điển Oxford, Cambridge bản Anh dùng.
        Giọng Mỹ ghi khác một chút, chủ yếu ở âm <b>/r/</b> cuối từ (<i>car</i> /kɑː/ ở Anh, /kɑːr/ ở Mỹ) và ở{' '}
        <b>/ɒ/</b> (<i>hot</i> /hɒt/ ở Anh, /hɑːt/ ở Mỹ). Hai cách đều đúng, bé chọn một cách rồi theo cho quen.
      </p>

      <IpaClient />

      {/* Ba nhóm âm — phần chữ này để máy tìm kiếm đọc được, không phụ thuộc JS. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {NHOM_IPA.map((n) => (
          <KidCard key={n.id} emoji={n.emoji} title={n.ten} tone={n.id === 'don' ? 'orange' : n.id === 'doi' ? 'purple' : 'blue'} badge={`${amTheoNhom(n.id).length} âm`}>
            <p className="text-sm leading-6 text-slate-600">{n.moTa}</p>
            <p className="mt-3 text-sm font-bold text-slate-700">
              {amTheoNhom(n.id).map((a) => `/${a.am}/`).join(' · ')}
            </p>
          </KidCard>
        ))}
      </div>

      <div className="mt-8">
        <KidCard emoji="🫱" title={`${CAP_THANH.length} cặp phụ âm chỉ khác nhau ở chỗ rung cổ`} tone="green">
          <p className="text-sm leading-6 text-slate-600">
            Đặt tay lên cổ họng khi đọc: vế sau làm cổ rung, vế trước thì không. Khẩu hình hai âm giống hệt nhau, nên
            học theo cặp là nhớ được một nửa bảng phụ âm.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CAP_THANH.map(([a, b]) => (
              <span key={a} className="rounded-full border-2 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-800">
                /{a}/ – /{b}/
              </span>
            ))}
          </div>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp phần nào?" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/phonics-tieng-anh', label: 'Phonics – ghép vần đọc tiếng Anh', emoji: '🔉' },
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/vong-tu-vung', label: 'Vòng tròn từ vựng tiếng Anh', emoji: '🎡' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="❓" title="Câu hỏi thường gặp về IPA" tone="orange">
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
    </KidShell>
  );
}
