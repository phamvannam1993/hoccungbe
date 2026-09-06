import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getSkillCatalog, parseCourseSlug, courseSlugOf, GRADES,
  SUBJECT_LABEL, SUBJECT_EMOJI, type SkillSubject,
} from '../../../lib/skillSeo';
import { SITE_NAME, SITE_URL, canonical } from '../../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, type Tone } from '../../../components/seo/kid';
import LuyenKyNangClient from './LuyenKyNangClient';

// Trang một KỸ NĂNG, vd /ky-nang/toan-lop-3/phep-chia.
//
// Đây là luồng RIÊNG, tách hẳn khỏi phần học theo sách giáo khoa: câu hỏi lấy từ
// kho riêng (bảng skill_questions) chứ không phải bài SGK, và tiến độ được ghi
// nhận riêng. Vì vậy trang này KHÔNG liệt kê bài SGK — trộn hai luồng vào một
// chỗ chỉ làm bé phân vân nên bấm vào đâu.

export const revalidate = 86400;

const SUBJECT_TONE: Record<string, Tone> = { math: 'pink', language: 'blue', english: 'green' };

type Props = { params: Promise<{ course: string; skill: string }> };

async function load(course: string, skill: string) {
  const parsed = parseCourseSlug(course);
  if (!parsed) return null;
  const { subject, grade } = parsed;
  const catalog = await getSkillCatalog({ grade, subject });
  const current = catalog.find((k) => k.code === skill);
  if (!current) return null;
  return { subject, grade, catalog, current };
}

/** Prerender mọi (khóa × kỹ năng) thực sự có bài, để trang kỹ năng được index. */
export async function generateStaticParams() {
  const subjects: SkillSubject[] = ['math', 'language', 'english'];
  const combos = subjects.flatMap((subject) => GRADES.map((grade) => ({ subject, grade })));
  const perCourse = await Promise.all(
    combos.map(async ({ subject, grade }) => {
      const skills = await getSkillCatalog({ grade, subject });
      const course = courseSlugOf(subject, grade);
      return skills.map((k) => ({ course, skill: k.code }));
    }),
  );
  return perCourse.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, skill } = await params;
  const data = await load(course, skill);
  if (!data) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const { subject, grade, current } = data;

  const label = `${SUBJECT_LABEL[subject]} lớp ${grade}`;
  const title = `${current.name} ${label}: luyện tập có giải thích cách làm`;
  const description = `Luyện kỹ năng ${current.name.toLowerCase()} ${label} trong một lượt tổng hợp, không phải học lần lượt từng bài. Mỗi câu sai đều có lời giải thích cách làm và một câu tương tự để bé làm lại ngay.`;
  const path = `/ky-nang/${course}/${skill}`;

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
  const { course, skill } = await params;
  const data = await load(course, skill);
  if (!data) notFound();
  const { subject, grade, catalog, current } = data;

  const label = `${SUBJECT_LABEL[subject]} lớp ${grade}`;
  const tone = SUBJECT_TONE[subject] ?? 'pink';
  const path = `/ky-nang/${course}/${skill}`;
  const siblings = catalog.filter((k) => k.code !== skill).slice(0, 8);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Học theo kỹ năng', item: `${SITE_URL}/ky-nang` },
      { '@type': 'ListItem', position: 3, name: `Kỹ năng ${label}`, item: `${SITE_URL}/ky-nang/${course}` },
      { '@type': 'ListItem', position: 4, name: current.name, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Học theo kỹ năng', href: '/ky-nang' },
          { label: `Kỹ năng ${label}`, href: `/ky-nang/${course}` },
          { label: current.name },
        ]}
      />

      <KidHero
        emoji={current.icon ?? SUBJECT_EMOJI[subject]}
        eyebrow={`Kỹ năng · ${label}`}
        title={`${current.name} ${label}`}
        tone={tone}
        description={`Luyện thẳng kỹ năng "${current.name.toLowerCase()}" trong một lượt tổng hợp, không phải học lần lượt từng bài. Sai câu nào bé được giải thích cách làm rồi thử lại một câu tương tự.`}
      />

      <div className="mt-6 grid gap-5">
        {/* Luyện TỔNG HỢP là hành động chính — bé không phải chọn bài nào trước. */}
        <LuyenKyNangClient skillCode={current.code} skillName={current.name} icon={current.icon} grade={grade} subject={subject} />

        {siblings.length > 0 && (
          <KidCard emoji="🎯" title={`Kỹ năng ${label} khác`} tone="sky">
            <KidPills
              items={siblings.map((k) => ({
                href: `/ky-nang/${course}/${k.code}`,
                label: `${k.icon ?? ''} ${k.name}`.trim(),
              }))}
            />
          </KidCard>
        )}

        <KidCard emoji="🚀" title="Chưa biết bé cần luyện gì?" tone="orange">
          <p className="mb-3 leading-7 text-slate-600">
            Làm bài khảo sát đầu vào để hệ thống chỉ ra kỹ năng bé còn yếu, rồi tự chọn bài học mỗi ngày cho bé.
          </p>
          <KidPills
            items={[
              { href: '/khao-sat-dau-vao', label: '📝 Khảo sát đầu vào' },
              { href: '/hoc-hom-nay', label: '🚀 Hôm nay học gì?' },
              { href: `/ky-nang/${courseSlugOf(subject, grade)}`, label: `🎯 Tất cả kỹ năng ${label}` },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
