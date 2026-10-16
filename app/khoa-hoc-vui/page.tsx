import ShopView, { type ShopCourse } from './components/ShopView';
import { getUnlockedSlugs } from './lib/access';
import { combos, getCoursesByGrade, getLessons, grades } from './lib/catalog';

const QUESTION_TYPE_COUNT = 11;

type Props = { searchParams: Promise<{ lop?: string }> };

export default async function KhoaHocVuiPage({ searchParams }: Props) {
  const { lop } = await searchParams;
  const available = grades.filter((g) => g.available);
  const grade = available.find((g) => g.id === lop) ?? available[0];

  const unlocked = await getUnlockedSlugs();
  const courses: ShopCourse[] = getCoursesByGrade(grade.id).map((c) => {
    const lessons = getLessons(c.slug);
    return {
      ...c,
      unlocked: unlocked.includes(c.slug),
      lessonIds: lessons.map((l) => l.id),
      questionCount: lessons.reduce((n, l) => n + l.questions.length, 0),
    };
  });

  return (
    <ShopView
      grades={grades}
      activeGrade={grade.id}
      courses={courses}
      combo={combos.find((c) => c.grade === grade.id)}
      typeCount={QUESTION_TYPE_COUNT}
    />
  );
}
