import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedCourses } from '../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, KidLinkList, TONES, type Tone } from '../../components/seo/kid';

// Hub theo LỚP: /lop-1 … /lop-5 (rewrite /lop-:grade → /lop/:grade). Gom cả 3 môn.

export const revalidate = 86400;

const GRADES = ['1', '2', '3', '4', '5'];
const SUBJECT_ORDER = ['math', 'language', 'english'];
const SUBJECT_LABEL: Record<string, string> = { math: 'Toán', language: 'Tiếng Việt', english: 'Tiếng Anh' };
const SUBJECT_TONE: Record<string, Tone> = { math: 'pink', language: 'blue', english: 'green' };
const SUBJECT_EMOJI: Record<string, string> = { math: '🔢', language: '📖', english: '🌍' };

function parseGrade(g: string): number | null {
  return GRADES.includes(g) ? Number(g) : null;
}

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const title = `Học lớp ${g}: Toán, Tiếng Việt, Tiếng Anh – bài học, bài tập, đề thi`;
  const description = `Tổng hợp học lớp ${g} miễn phí: khóa học Toán, Tiếng Việt, Tiếng Anh lớp ${g} kèm bài tập theo chủ đề, phiếu bài tập PDF, đề thi có chấm điểm và trò chơi giáo dục cho bé.`;
  const path = `/lop-${g}`;
  return {
    title,
    description,
    alternates: { canonical: canonical(path) },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: canonical(path), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) notFound();

  const courses = (await getPublishedCourses())
    .filter((c) => c.slug.endsWith(`-lop-${g}`))
    .sort((a, b) => SUBJECT_ORDER.indexOf(a.courseType ?? 'math') - SUBJECT_ORDER.indexOf(b.courseType ?? 'math'));
  if (courses.length === 0) notFound();

  const path = `/lop-${g}`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `Lớp ${g}`, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: `Lớp ${g}` }]} />

      <KidHero emoji="🎒" eyebrow="Học theo lớp" title={`Học lớp ${g}: Toán, Tiếng Việt, Tiếng Anh`} tone="purple"
        description={`Tổng hợp tài nguyên học lớp ${g} miễn phí cho bé: bài học, bài tập theo chủ đề, phiếu bài tập in/PDF, đề thi có chấm điểm và trò chơi giáo dục — đầy đủ 3 môn Toán, Tiếng Việt và Tiếng Anh.`} />

      <div className="mt-6 grid gap-5">
        {courses.map((c) => {
          const type = c.courseType ?? 'math';
          const isMath = type === 'math';
          const t = TONES[SUBJECT_TONE[type] ?? 'pink'];
          const items = [
            { href: `/khoa-hoc/${c.slug}`, label: 'Khóa học', emoji: '📚' },
            { href: `/bai-tap/${c.slug}`, label: 'Bài tập', emoji: '✏️' },
            ...(isMath ? [{ href: `/phieu-bai-tap/lop/${c.slug}`, label: 'Phiếu bài tập PDF', emoji: '📄' }] : []),
          ];
          return (
            <KidCard key={c.id} emoji={SUBJECT_EMOJI[type]} title={`${SUBJECT_LABEL[type]} lớp ${g}`} tone={SUBJECT_TONE[type] ?? 'pink'}>
              <KidLinkList tone={SUBJECT_TONE[type] ?? 'pink'} items={items} />
            </KidCard>
          );
        })}
      </div>

      <div className="mt-6">
        <KidCard emoji="✨" title={`Thêm cho lớp ${g}`} tone="orange">
          <KidLinkList
            tone="orange"
            items={[
              { href: `/de-thi-lop-${g}`, label: `Đề thi lớp ${g} có chấm điểm`, emoji: '📝' },
              { href: `/toan-tu-duy-lop-${g}`, label: `Toán tư duy lớp ${g}`, emoji: '🧠' },
              { href: '/phieu-bai-tap', label: 'Tất cả phiếu bài tập', emoji: '📄' },
              { href: '/tro-choi', label: 'Trò chơi học tập', emoji: '🎮' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard title="Các lớp khác" tone="sky">
          <KidPills items={GRADES.map((gr) => ({ href: `/lop-${gr}`, label: `Lớp ${gr}` }))} />
        </KidCard>
      </div>
    </KidShell>
  );
}
