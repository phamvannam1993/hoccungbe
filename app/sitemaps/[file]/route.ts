import { SITE_URL } from '../../lib/seo';
import {
  staticEntries,
  courseEntries,
  courseList,
  lessonEntriesByCourse,
  worksheetEntriesByCourse,
  practiceEntriesByCourse,
  articleEntries,
  examEntries,
  gameEntries,
  urlsetXml,
  sitemapIndexXml,
  xmlResponse,
} from '../../lib/sitemapData';

// /sitemaps/<name>.xml
//   index               → SITEMAP INDEX (rewrite từ /sitemap.xml).
//   static/courses/...  → 1 sitemap con (urlset).
//   lessons-<courseSlug>→ bài học của riêng khóa đó (URL /{courseSlug}/{lessonSlug}).
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const name = file.replace(/\.xml$/i, '');

  // ── SITEMAP INDEX: tách lessons theo TỪNG KHÓA ──
  if (name === 'index') {
    // KHÔNG gắn lastmod cho sitemap index: trước đây dùng new Date() mỗi request →
    // "lastmod churn" khiến Google mất tin tưởng. lastmod ở sitemap index là tùy chọn,
    // bỏ đi để Google tự crawl theo lastmod THẬT trong từng sitemap con.
    const courses = await courseList();
    const items = [
      { loc: `${SITE_URL}/sitemaps/static.xml` },
      { loc: `${SITE_URL}/sitemaps/courses.xml` },
      ...courses.map((c) => ({ loc: `${SITE_URL}/sitemaps/lessons-${c.slug}.xml` })),
      // Phiếu bài tập chỉ cho khóa Toán (mọi bài đều có đủ 3 mức + bản cả bài).
      ...courses
        .filter((c) => c.courseType === 'math')
        .map((c) => ({ loc: `${SITE_URL}/sitemaps/worksheets-${c.slug}.xml` })),
      // Bài tập theo chủ đề — mọi khóa đều có (chủ đề lấy từ topicId của bài học).
      ...courses.map((c) => ({ loc: `${SITE_URL}/sitemaps/practice-${c.slug}.xml` })),
      { loc: `${SITE_URL}/sitemaps/exams.xml` },
      { loc: `${SITE_URL}/sitemaps/games.xml` },
      { loc: `${SITE_URL}/sitemaps/articles.xml` },
    ];
    return xmlResponse(sitemapIndexXml(items));
  }

  if (name === 'static') return xmlResponse(urlsetXml(staticEntries()));
  if (name === 'courses') return xmlResponse(urlsetXml(await courseEntries()));
  if (name === 'articles') return xmlResponse(urlsetXml(await articleEntries()));
  if (name === 'exams') return xmlResponse(urlsetXml(await examEntries()));
  if (name === 'games') return xmlResponse(urlsetXml(gameEntries()));

  // lessons-<courseSlug> → bài học của khóa đó
  if (name.startsWith('lessons-')) {
    const slug = name.slice('lessons-'.length);
    const course = (await courseList()).find((c) => c.slug === slug);
    if (!course) return new Response('Not found', { status: 404 });
    return xmlResponse(urlsetXml(await lessonEntriesByCourse(course.id, course.slug)));
  }

  // worksheets-<courseSlug> → phiếu bài tập (4 mức/bài) của khóa Toán đó
  if (name.startsWith('worksheets-')) {
    const slug = name.slice('worksheets-'.length);
    const course = (await courseList()).find((c) => c.slug === slug && c.courseType === 'math');
    if (!course) return new Response('Not found', { status: 404 });
    return xmlResponse(urlsetXml(await worksheetEntriesByCourse(course.id, course.slug)));
  }

  // practice-<courseSlug> → hub bài tập + từng chủ đề của khóa đó
  if (name.startsWith('practice-')) {
    const slug = name.slice('practice-'.length);
    const course = (await courseList()).find((c) => c.slug === slug);
    if (!course) return new Response('Not found', { status: 404 });
    return xmlResponse(urlsetXml(await practiceEntriesByCourse(course.slug)));
  }

  return new Response('Not found', { status: 404 });
}
