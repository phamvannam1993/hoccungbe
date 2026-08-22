import type { Metadata } from 'next';
import Link from 'next/link';
import { GRADES, TOAN_TU_DUY } from './data';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, TONES, type Tone } from '../components/seo/kid';

export const revalidate = 86400;

const TITLE = 'Toán tư duy lớp 1–5 – rèn suy luận cho bé';
const DESCRIPTION =
  'Toán tư duy cho bé lớp 1 đến lớp 5: các dạng bài rèn suy luận, tư duy logic kèm lời giải chi tiết. Luyện tập miễn phí, bám sát từng lớp tại Bé Hay Học.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['toán tư duy', 'toán tư duy cho bé', 'toán tư duy lớp 1', 'toán tư duy lớp 2', 'toán tư duy lớp 3', 'toán tư duy lớp 4', 'toán tư duy lớp 5', 'toán suy luận'],
  alternates: { canonical: canonical('/toan-tu-duy') },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical('/toan-tu-duy'), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const GRADE_TONES: Tone[] = ['pink', 'blue', 'orange', 'purple', 'green'];

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Toán tư duy', item: `${SITE_URL}/toan-tu-duy` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Toán tư duy' }]} />

      <KidHero emoji="🧠" eyebrow="Chuyên đề" title="Toán tư duy lớp 1–5" tone="purple" description={DESCRIPTION} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {GRADES.map((g, i) => {
          const d = TOAN_TU_DUY[g];
          const t = TONES[GRADE_TONES[i % GRADE_TONES.length]];
          return (
            <Link
              key={g}
              href={`/toan-tu-duy-lop-${g}`}
              className="group flex h-full flex-col rounded-3xl border-2 bg-white p-5 kid-card-hover"
              style={{ borderColor: t.border, boxShadow: `0 6px 20px ${t.shadow}` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl text-xl font-black text-white kid-display" style={{ backgroundImage: t.grad }}>{g}</span>
                <span className="text-lg font-black text-slate-900 kid-display">Toán tư duy lớp {g}</span>
                <span className="ml-auto text-lg transition group-hover:translate-x-0.5" style={{ color: t.c }} aria-hidden>→</span>
              </div>
              <span className="mt-3 text-sm text-slate-500">{d.topics.slice(0, 3).join(' · ')}…</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <KidCard emoji="💭" title="Toán tư duy là gì?" tone="blue">
          <p className="leading-7 text-slate-600">
            Toán tư duy là cách học toán chú trọng vào suy luận, phân tích và tìm quy luật thay vì chỉ ghi nhớ công
            thức. Qua các bài toán logic, dãy số, hình học và bài toán có lời văn, bé phát triển khả năng quan sát,
            lập luận và giải quyết vấn đề — nền tảng quan trọng cho việc học toán ở mọi cấp.
          </p>
        </KidCard>
      </div>
    </KidShell>
  );
}
