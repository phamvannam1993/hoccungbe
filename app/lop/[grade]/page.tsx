import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedCourses } from '../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../../lib/seo';
import { KidShell, KidCrumb, KidPills } from '../../components/seo/kid';
import { ItemGrid, Section } from '../../components/catalog/CatalogCards';
import { ALL_GRADES, GRADE_AGE, KIND_META, PALETTE, SUBJECT_META, gradeFromKey, gradeHref, gradeName, type Grade } from '../../lib/catalog';
import { examSummary, queryCatalog, upcomingTerm } from '../../lib/catalogFull';

// Trang LỚP: /lop-1 … /lop-5 (rewrite /lop-:grade → /lop/:grade) và /lop/mau-giao.
// Gom mọi thứ của một lớp vào một chỗ — đọc từ sổ đăng ký app/lib/catalog.ts.

export const revalidate = 86400;

const SUBJECT_ORDER = ['math', 'language', 'english'];
const COURSE_LABEL: Record<string, string> = { math: 'Toán', language: 'Tiếng Việt', english: 'Tiếng Anh' };

/** Nhận '1'…'5', 'lop-1'…'lop-5' và 'mau-giao'. */
const parseGrade = (g: string): Grade | null => gradeFromKey(g);

export function generateStaticParams() {
  return [...['1', '2', '3', '4', '5'].map((grade) => ({ grade })), { grade: 'mau-giao' }];
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (g == null) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const title =
    g === 0
      ? 'Học mẫu giáo 4–5 tuổi: chữ cái, đếm số, tiếng Anh và trò chơi'
      : `Học lớp ${g}: Toán, Tiếng Việt, Tiếng Anh – bài học, đề thi, phiếu in`;
  const description =
    g === 0
      ? 'Cho bé mẫu giáo làm quen chữ cái, đánh vần, đếm số, tiếng Anh qua trò chơi ngắn và phiếu tập viết in miễn phí.'
      : `Mọi thứ bé lớp ${g} cần ở một chỗ: công cụ Toán, Tiếng Việt, Tiếng Anh, đề thi có chấm điểm, trò chơi hợp lớp và phiếu bài tập in được.`;
  const path = gradeHref(g);
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
  if (g == null) notFound();

  // Khóa học theo sách (API). API lỗi/không có khóa thì trang vẫn đủ nội dung từ sổ đăng ký.
  const courses =
    g === 0
      ? []
      : (await getPublishedCourses().catch(() => []))
          .filter((c) => c.slug.endsWith(`-lop-${g}`))
          .sort((a, b) => SUBJECT_ORDER.indexOf(a.courseType ?? 'math') - SUBJECT_ORDER.indexOf(b.courseType ?? 'math'));

  const toan = queryCatalog({ grade: g, subject: ['toan', 'tu-duy'], kind: ['cong-cu', 'khoa-hoc'] });
  const tv = queryCatalog({ grade: g, subject: 'tieng-viet', kind: 'cong-cu' });
  const ta = queryCatalog({ grade: g, subject: 'tieng-anh', kind: 'cong-cu' });
  const onTap = queryCatalog({ grade: g, kind: ['de-thi', 'on-tap'] });
  const games = queryCatalog({ grade: g, kind: 'tro-choi' });
  const thiDau = queryCatalog({ grade: g, kind: 'thi-dau' });
  const phieu = queryCatalog({ grade: g, kind: 'tai-lieu' });
  const exam = examSummary(g);
  const name = gradeName(g);
  const path = gradeHref(g);

  const jumps = [
    { id: 'toan', label: 'Toán', show: toan.length > 0 },
    { id: 'tieng-viet', label: 'Tiếng Việt', show: tv.length > 0 },
    { id: 'tieng-anh', label: 'Tiếng Anh', show: ta.length > 0 },
    { id: 'de-thi', label: g === 0 ? 'Ôn tập' : 'Đề thi', show: onTap.length > 0 },
    { id: 'tro-choi', label: 'Trò chơi', show: games.length > 0 },
    { id: 'phieu-in', label: 'Phiếu in', show: phieu.length > 0 },
  ].filter((j) => j.show);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: name }]} />

      <header className="rounded-[28px] border-2 bg-white p-5 sm:p-7" style={{ borderColor: PALETTE.pink.border }}>
        <p className="kid-display text-xs font-black uppercase tracking-widest" style={{ color: PALETTE.pink.c }}>
          Học theo lớp · {GRADE_AGE[g]}
        </p>
        <h1 className="kid-display mt-1 text-3xl font-black text-slate-900 sm:text-4xl">{g === 0 ? 'Mẫu giáo' : `Lớp ${g}`}</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          {g === 0
            ? 'Bé làm quen chữ cái, đếm số và tiếng Anh qua trò chơi ngắn, cộng phiếu tập viết in được.'
            : `Mọi thứ bé lớp ${g} cần, một chỗ: công cụ học, đề thi có chấm điểm, trò chơi và phiếu in.`}
        </p>
        <nav aria-label="Đi tới mục" className="mt-4 flex flex-wrap gap-2">
          {jumps.map((j) => (
            <a key={j.id} href={`#${j.id}`} className="kid-display rounded-full border-2 bg-white px-3.5 py-1.5 text-sm font-black text-slate-700 hover:bg-slate-50" style={{ borderColor: PALETTE.pink.border }}>
              {j.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-5 grid gap-5">
        {courses.length > 0 && (
          <Section emoji="📚" title={`Khóa học theo sách lớp ${g}`} palette={PALETTE.pink} desc="Học theo từng bài trên lớp, có bài tập và phiếu in.">
            <div className="grid gap-3 sm:grid-cols-3">
              {courses.map((c) => {
                const type = c.courseType ?? 'math';
                const pal = type === 'math' ? SUBJECT_META.toan.palette : type === 'language' ? SUBJECT_META['tieng-viet'].palette : SUBJECT_META['tieng-anh'].palette;
                const items = [
                  { href: `/bai-tap/${c.slug}`, label: 'Bài tập theo chủ đề', emoji: '✏️' },
                  ...(type === 'math' ? [{ href: `/phieu-bai-tap/lop/${c.slug}`, label: 'Phiếu bài tập PDF', emoji: '📄' }] : []),
                ];
                return (
                  <div key={c.id} className="min-w-0 rounded-3xl border-2 p-3" style={{ borderColor: pal.border, background: pal.soft }}>
                    <Link href={`/khoa-hoc/${c.slug}`} className="kid-display block text-base font-black hover:underline" style={{ color: pal.c }}>
                      📚 {COURSE_LABEL[type] ?? c.title} lớp {g} →
                    </Link>
                    <ul className="mt-2 grid gap-1.5">
                      {items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:underline">
                            <span aria-hidden>{it.emoji}</span>{it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {toan.length > 0 && (
          <Section id="toan" emoji={SUBJECT_META.toan.emoji} title={`Toán ${name.toLowerCase()}`} palette={SUBJECT_META.toan.palette} more={{ href: '/hoc-toan', label: 'Mọi công cụ Toán' }}>
            <ItemGrid items={toan} />
          </Section>
        )}
        {tv.length > 0 && (
          <Section id="tieng-viet" emoji={SUBJECT_META['tieng-viet'].emoji} title={`Tiếng Việt ${name.toLowerCase()}`} palette={SUBJECT_META['tieng-viet'].palette} more={{ href: '/tieng-viet', label: 'Mọi trang Tiếng Việt' }}>
            <ItemGrid items={tv} />
          </Section>
        )}
        {ta.length > 0 && (
          <Section id="tieng-anh" emoji={SUBJECT_META['tieng-anh'].emoji} title="Tiếng Anh" palette={SUBJECT_META['tieng-anh'].palette} desc="Tiếng Anh dùng chung nhiều lứa — chọn mục hợp với bé.">
            <ItemGrid items={ta} />
          </Section>
        )}
        {onTap.length > 0 && (
          <Section id="de-thi" emoji="📝" title={g === 0 ? 'Ôn tập' : `Đề thi & ôn tập lớp ${g}`} palette={KIND_META['de-thi'].palette}
            desc={exam ? `Sắp thi ${upcomingTerm()}: ${exam.total} đề lớp ${g} (${exam.toan} Toán${exam.tiengViet ? `, ${exam.tiengViet} Tiếng Việt` : ''}), chấm điểm ngay trên trang.` : undefined}>
            <ItemGrid items={onTap} />
          </Section>
        )}
        {games.length > 0 && (
          <Section id="tro-choi" emoji="🎮" title={`Trò chơi hợp ${name.toLowerCase()}`} palette={KIND_META['tro-choi'].palette} more={{ href: '/tro-choi', label: 'Kho trò chơi' }}>
            <ItemGrid items={games} compact cols={4} />
          </Section>
        )}
        {thiDau.length > 0 && (
          <Section emoji="🏆" title="Sân chơi Trí tuệ" palette={KIND_META['thi-dau'].palette} more={{ href: '/san-choi-tri-tue', label: 'Vào sân chơi' }}>
            <ItemGrid items={thiDau} compact cols={3} />
          </Section>
        )}
        {phieu.length > 0 && (
          <Section id="phieu-in" emoji="🖨️" title={`Phiếu in ${name.toLowerCase()}`} palette={KIND_META['tai-lieu'].palette} more={{ href: '/tai-lieu-in', label: 'Tất cả tài liệu in' }}>
            <ItemGrid items={phieu} />
          </Section>
        )}

        <Section emoji="🎒" title="Các lớp khác" palette={PALETTE.slate}>
          <KidPills items={ALL_GRADES.filter((x) => x !== g).map((x) => ({ href: gradeHref(x), label: gradeName(x) }))} />
          <p className="mt-3 text-sm text-slate-500">
            Chưa biết bắt đầu từ đâu? <Link href="/hoc-hom-nay" className="font-bold text-[#c81e5b] hover:underline">Xem việc học hôm nay</Link>.
          </p>
        </Section>
      </div>
    </KidShell>
  );
}
