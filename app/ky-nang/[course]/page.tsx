import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getSkillCatalog, parseCourseSlug, courseSlugOf, GRADES,
  SUBJECT_LABEL, SUBJECT_EMOJI, type SkillSubject,
} from '../../lib/skillSeo';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, type Tone } from '../../components/seo/kid';
import SkillGrid from '../../components/edu/SkillGrid';

// Danh mục kỹ năng của MỘT khoá, vd /ky-nang/toan-lop-3.

export const revalidate = 86400;

const SUBJECTS: SkillSubject[] = ['math', 'language', 'english'];
const SUBJECT_TONE: Record<string, Tone> = { math: 'pink', language: 'blue', english: 'green' };

type Props = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return SUBJECTS.flatMap((s) => GRADES.map((g) => ({ course: courseSlugOf(s, g) })));
}

function titleFor(subject: SkillSubject, grade: string) {
  return `Kỹ năng ${SUBJECT_LABEL[subject]} lớp ${grade}: học theo kỹ năng, không theo thứ tự sách`;
}

function descFor(subject: SkillSubject, grade: string) {
  return `Danh mục kỹ năng ${SUBJECT_LABEL[subject]} lớp ${grade}: chọn đúng kỹ năng bé đang yếu và luyện tập với các bài trong sách giáo khoa có liên quan, kèm giải thích sau mỗi câu.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course } = await params;
  const parsed = parseCourseSlug(course);
  if (!parsed) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const { subject, grade } = parsed;
  const title = titleFor(subject, grade);
  const description = descFor(subject, grade);
  const path = `/ky-nang/${course}`;
  return {
    title,
    description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`, description, url: canonical(path),
      type: 'website', siteName: SITE_NAME, locale: 'vi_VN',
      images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({ params }: Props) {
  const { course } = await params;
  const parsed = parseCourseSlug(course);
  if (!parsed) notFound();
  const { subject, grade } = parsed;

  const skills = await getSkillCatalog({ grade, subject });
  if (!skills.length) notFound();

  const path = `/ky-nang/${course}`;
  const label = `${SUBJECT_LABEL[subject]} lớp ${grade}`;
  const tone = SUBJECT_TONE[subject] ?? 'pink';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Học theo kỹ năng', item: `${SITE_URL}/ky-nang` },
      { '@type': 'ListItem', position: 3, name: `Kỹ năng ${label}`, item: `${SITE_URL}${path}` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Kỹ năng ${label}`,
    itemListElement: skills.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: k.name,
      url: `${SITE_URL}${path}/${k.code}`,
    })),
  };

  // Các lớp khác cùng môn — liên kết ngang cho SEO và cho phụ huynh học vượt/ôn lại.
  const otherGrades = GRADES.filter((g) => g !== grade);

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <KidCrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Học theo kỹ năng', href: '/ky-nang' },
          { label: `Kỹ năng ${label}` },
        ]}
      />

      <KidHero
        emoji={SUBJECT_EMOJI[subject]}
        eyebrow="Học theo kỹ năng"
        title={`Kỹ năng ${label}`}
        tone={tone}
        description={`Thay vì học lần lượt từng bài trong sách, bé có thể chọn đúng kỹ năng đang cần luyện. Mỗi kỹ năng gom sẵn các bài ${label} trong sách giáo khoa có luyện kỹ năng đó.`}
      />

      <div className="mt-6 grid gap-5">
        <KidCard emoji="🎯" title={`Chọn kỹ năng ${label}`} tone={tone} badge={`${skills.length} kỹ năng`}>
          <SkillGrid
            grade={grade}
            courseSlug={course}
            skills={skills.map((k) => ({ code: k.code, name: k.name, icon: k.icon }))}
          />
        </KidCard>

        <KidCard emoji="📚" title="Hoặc học theo sách" tone="orange">
          <p className="mb-3 leading-7 text-slate-600">
            Nếu bé đang bám sát chương trình trên lớp, hãy học theo đúng thứ tự sách giáo khoa.
          </p>
          <KidPills
            items={[
              { href: `/khoa-hoc/${course}`, label: `Khóa học ${label}` },
              { href: `/bai-tap/${course}`, label: `Bài tập ${label}` },
              { href: `/lop-${grade}`, label: `Tất cả môn lớp ${grade}` },
            ]}
          />
        </KidCard>

        <KidCard emoji="🎒" title={`Kỹ năng ${SUBJECT_LABEL[subject]} các lớp khác`} tone="sky">
          <KidPills
            items={otherGrades.map((g) => ({
              href: `/ky-nang/${courseSlugOf(subject, g)}`,
              label: `${SUBJECT_LABEL[subject]} lớp ${g}`,
            }))}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
