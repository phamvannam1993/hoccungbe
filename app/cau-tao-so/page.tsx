import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { HANG, MUC_DO, docSo, phanTich, vietSo } from '../lib/cauTaoSo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidFaq } from '../components/seo/kid';
import CauTaoSoClient from './CauTaoSoClient';

export const revalidate = 86400;

const TITLE = 'Hàng và lớp, cấu tạo số và biểu thức chứa chữ — lớp 3 đến lớp 5';
const DESCRIPTION =
  'Bé nhìn bảng hàng để hiểu chữ số 5 trong 50 302 đáng 50 000, viết số thành tổng các hàng, đọc số thành lời và tính giá trị biểu thức chứa chữ. Miễn phí, không cần đăng nhập.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/cau-tao-so') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/cau-tao-so'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const VI_DU = 50302;

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Cấu tạo số', item: `${SITE_URL}/cau-tao-so` },
    ],
  };

  const faq = [
    {
      q: 'Hàng và lớp khác nhau thế nào?',
      a: 'Hàng là từng vị trí của chữ số: đơn vị, chục, trăm, nghìn… Lớp là nhóm ba hàng liền nhau: lớp đơn vị (đơn vị – chục – trăm), lớp nghìn, lớp triệu. Đọc số là đọc theo LỚP, nên nhóm ba chữ số một là đọc trôi.',
    },
    {
      q: 'Vì sao bé nhầm giá trị của chữ số?',
      a: `Vì bé trả lời luôn chữ số thay vì giá trị của nó. Trong ${vietSo(VI_DU)}, chữ số 5 không đáng 5 mà đáng 50 000, vì nó đứng ở hàng chục nghìn. Bảng hàng trong trang này cho thấy điều đó bằng mắt.`,
    },
    {
      q: 'Viết số thành tổng các hàng để làm gì?',
      a: `Đó là cách hiểu cấu tạo số: ${vietSo(VI_DU)} = ${phanTich(VI_DU)}. Nắm được thì đặt tính cộng trừ, so sánh số lớn và làm tròn số đều nhẹ đi.`,
    },
    {
      q: 'Biểu thức chứa chữ khó ở đâu?',
      a: 'Ở chỗ thứ tự phép tính. Với a = 3, b = 5 thì a + b × 2 bằng 13 chứ không phải 16 — phải nhân trước rồi mới cộng. Có ngoặc thì làm trong ngoặc trước. Đáp án sai trong trang này cố ý đặt đúng kiểu nhầm đó.',
    },
  ];

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Cấu tạo số' }]} />

      <KidHero
        emoji="🔢"
        eyebrow="Toán · Số học"
        title="Cấu tạo số – chữ số đứng đâu đáng bấy nhiêu"
        tone="blue"
        description={
          <>
            Ba việc: đọc <strong>hàng và lớp</strong> của từng chữ số, <strong>viết số thành tổng</strong> các hàng,
            và <strong>tính biểu thức chứa chữ</strong>. Trong {vietSo(VI_DU)}, chữ số 5 đáng 50 000 còn chữ số 2 chỉ
            đáng 2 — nhìn bảng hàng là thấy ngay.
          </>
        }
      />

      <CauTaoSoClient />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <KidCard emoji="📋" title="Các hàng, từ nhỏ tới lớn" tone="blue" badge={`${HANG.length} hàng`}>
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            {HANG.map((h) => (
              <li key={h.ma}>
                <b>Hàng {h.ten}</b> — mỗi đơn vị đáng {vietSo(h.gia)} · {h.lop.toLowerCase()}
              </li>
            ))}
          </ul>
        </KidCard>
        <KidCard emoji="🗣️" title="Đọc số cho đúng" tone="green">
          <ul className="space-y-1.5 text-sm leading-6 text-slate-700">
            <li><b>{vietSo(105)}</b> — {docSo(105)} (có “linh” vì hàng chục là 0)</li>
            <li><b>{vietSo(21)}</b> — {docSo(21)} (không đọc “hai mươi một”)</li>
            <li><b>{vietSo(25)}</b> — {docSo(25)} (không đọc “hai mươi năm”)</li>
            <li><b>{vietSo(1005)}</b> — {docSo(1005)}</li>
            <li><b>{vietSo(VI_DU)}</b> — {docSo(VI_DU)}</li>
          </ul>
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📶" title="Ba mức theo lớp" tone="purple" badge={`${MUC_DO.length} mức`}>
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
              { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🔢' },
              { href: '/dat-tinh', label: 'Đặt tính rồi tính', emoji: '🧮' },
              { href: '/so-thap-phan', label: 'Số thập phân trực quan', emoji: '🔟' },
              { href: '/tim-x', label: 'Tìm x – cân thăng bằng', emoji: '⚖️' },
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
