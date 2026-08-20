import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type ExamItem, SUBJECT_LABEL } from '../../examConstants';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, KidLinkList } from '../../../components/seo/kid';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

// Hub đề thi theo LỚP: /de-thi-lop-1 … /de-thi-lop-5 (rewrite → /de-thi/lop/[grade]).
export const revalidate = 300;

const GRADES = ['1', '2', '3', '4', '5'];

function parseGrade(g: string): number | null {
  return GRADES.includes(g) ? Number(g) : null;
}

async function fetchExams(): Promise<ExamItem[]> {
  try {
    const res = await fetch(`${API}/api/exams`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch { return []; }
}

function subjectPhrase(exams: ExamItem[]): string {
  const subs = Array.from(new Set(exams.map((e) => SUBJECT_LABEL[e.subject] ?? e.subject)));
  return subs.length === 1 ? subs[0] : '';
}

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const exams = (await fetchExams()).filter((e) => e.grade === g);
  if (exams.length === 0) return { title: 'Đề thi', robots: { index: false, follow: false } };
  const subj = subjectPhrase(exams);
  const title = `Đề thi ${subj ? subj + ' ' : ''}lớp ${g} có chấm điểm – giữa kỳ & cuối kỳ`;
  const description = `Bộ ${exams.length} đề thi, bài kiểm tra ${subj ? subj + ' ' : ''}lớp ${g} (giữa kỳ, cuối kỳ) làm trực tuyến, chấm điểm và hiện đáp án ngay. Miễn phí, làm lại nhiều lần tại Bé Hay Học.`;
  const url = `${SITE}/de-thi-lop-${g}`;
  return {
    title: { absolute: `${title} | Bé Hay Học` },
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Bé Hay Học`, description, url, type: 'website', siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-home.jpg`] },
  };
}

export default async function Page({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) notFound();

  const exams = (await fetchExams()).filter((e) => e.grade === g).sort((a, b) => a.semester - b.semester || a.id - b.id);
  if (exams.length === 0) notFound();

  const subj = subjectPhrase(exams);
  const url = `${SITE}/de-thi-lop-${g}`;
  const bySemester = [1, 2].map((sem) => ({ sem, items: exams.filter((e) => e.semester === sem) })).filter((s) => s.items.length > 0);

  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Đề thi', item: `${SITE}/de-thi` },
      { '@type': 'ListItem', position: 3, name: `Lớp ${g}`, item: url },
    ],
  };
  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Đề thi ${subj ? subj + ' ' : ''}lớp ${g}`,
    numberOfItems: exams.length,
    itemListElement: exams.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.title, url: `${SITE}/de-thi/${e.slug}` })),
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đề thi', href: '/de-thi' }, { label: `Lớp ${g}` }]} />

      <KidHero emoji="📝" eyebrow="Đề thi & kiểm tra" title={`Đề thi ${subj ? `${subj} ` : ''}lớp ${g} có chấm điểm`} tone="pink"
        description={`Tổng hợp ${exams.length} đề thi & bài kiểm tra ${subj ? `${subj} ` : ''}lớp ${g} (giữa kỳ, cuối kỳ), làm trực tuyến và chấm điểm ngay kèm đáp án. Miễn phí, cho bé làm lại nhiều lần để ôn tập.`} />

      <div className="mt-6 space-y-6">
        {bySemester.map(({ sem, items }) => (
          <KidCard key={sem} emoji={sem === 1 ? '📗' : '📘'} title={`Học kỳ ${sem}`} tone={sem === 1 ? 'green' : 'blue'} badge={items.length}>
            <KidLinkList tone={sem === 1 ? 'green' : 'blue'} items={items.map((e) => ({ href: `/de-thi/${e.slug}`, label: e.title, emoji: '📝' }))} />
          </KidCard>
        ))}
      </div>

      <div className="mt-6">
        <KidCard emoji="🎯" title="Đề thi các lớp khác" tone="purple">
          <KidPills tone="purple" items={GRADES.map((gr) => ({ href: `/de-thi-lop-${gr}`, label: `Đề thi lớp ${gr}` }))} />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title={`Ôn tập thêm cho lớp ${g}`} tone="orange">
          <KidLinkList
            tone="orange"
            items={[
              { href: `/lop-${g}`, label: `Tổng hợp học lớp ${g}`, emoji: '🎒' },
              { href: `/toan-tu-duy-lop-${g}`, label: `Toán tư duy lớp ${g}`, emoji: '🧠' },
              ...(subj === 'Toán' ? [{ href: `/phieu-bai-tap/lop/toan-lop-${g}`, label: `Phiếu bài tập Toán lớp ${g}`, emoji: '📄' }] : []),
              ...(subj === 'Toán' ? [{ href: `/bai-tap/toan-lop-${g}`, label: `Bài tập Toán lớp ${g}`, emoji: '✏️' }] : []),
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
