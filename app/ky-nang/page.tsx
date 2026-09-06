import type { Metadata } from 'next';
import { getSkillCatalog, GRADES, SUBJECT_LABEL, SUBJECT_EMOJI, courseSlugOf, type SkillSubject } from '../lib/skillSeo';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard } from '../components/seo/kid';
import SkillGrid from '../components/edu/SkillGrid';

// Hub "Học theo kỹ năng": trục thứ hai của kho bài, bên cạnh "Học theo sách".
// Cùng một kho bài, nhìn theo nhu cầu ("phép chia", "toán có lời văn")
// thay vì theo thứ tự SGK.

export const revalidate = 86400;

const SUBJECTS: SkillSubject[] = ['math', 'language', 'english'];

const title = 'Học theo kỹ năng: Toán, Tiếng Việt, Tiếng Anh lớp 1–5';
const description =
  'Học theo kỹ năng thay vì theo thứ tự sách giáo khoa: chọn đúng thứ bé đang yếu như phép chia, toán có lời văn, hình học, luyện từ và câu — hệ thống gom bài từ nhiều bài SGK liên quan.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/ky-nang') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: canonical('/ky-nang'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default async function Page() {
  // Gom danh mục kỹ năng của cả 5 lớp để biết lớp nào có kỹ năng gì.
  const perGrade = await Promise.all(
    GRADES.map(async (grade) => ({ grade, skills: await getSkillCatalog({ grade }) })),
  );

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Học theo kỹ năng', item: `${SITE_URL}/ky-nang` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Học theo kỹ năng' }]} />

      <KidHero
        emoji="🎯"
        eyebrow="Một trong 3 cách học"
        title="Học theo kỹ năng"
        tone="purple"
        description="Bé không nhất thiết phải học lần lượt từ Bài 1 đến Bài 80. Nếu con đang vướng phép chia hay toán có lời văn, hãy vào thẳng kỹ năng đó và luyện một lượt tổng hợp — sai câu nào bé được giải thích cách làm rồi thử lại một câu tương tự."
      />

      <div className="mt-6 grid gap-5">
        {perGrade.map(({ grade, skills }) => {
          if (!skills.length) return null;
          const bySubject = SUBJECTS.map((s) => ({
            subject: s,
            items: skills.filter((k) => k.subject === s),
          })).filter((g) => g.items.length);

          return (
            <KidCard key={grade} emoji="🎒" title={`Kỹ năng lớp ${grade}`} tone="sky" badge={`${skills.length} kỹ năng`}>
              <div className="grid gap-4">
                {bySubject.map(({ subject, items }) => (
                  <div key={subject}>
                    <p className="mb-2 text-sm font-black text-slate-500">
                      {SUBJECT_EMOJI[subject]} {SUBJECT_LABEL[subject]} lớp {grade}
                    </p>
                    <SkillGrid
                      grade={grade}
                      courseSlug={courseSlugOf(subject, grade)}
                      skills={items.map((k) => ({ code: k.code, name: k.name, icon: k.icon }))}
                    />
                  </div>
                ))}
              </div>
            </KidCard>
          );
        })}
      </div>
    </KidShell>
  );
}
