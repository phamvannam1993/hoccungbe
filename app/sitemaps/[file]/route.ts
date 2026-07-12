import { SITE_URL } from '../../lib/seo';
import {
  staticEntries,
  courseEntries,
  courseList,
  lessonEntriesByCourse,
  articleEntries,
  gameEntries,
  urlsetXml,
  sitemapIndexXml,
  xmlResponse,
} from '../../lib/sitemap';

// /sitemaps/<name>.xml
//   index               → SITEMAP INDEX (rewrite từ /sitemap.xml).
//   static/courses/...  → 1 sitemap con (urlset).
//   lessons-<courseSlug>→ bài học của riêng khóa đó.
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const name = file.replace(/\.xml$/i, '');

  // ── SITEMAP INDEX: tách lessons theo TỪNG KHÓA ──
  if (name === 'index') {
    const now = new Date();
    const courses = await courseList();
    const items = [
      { loc: `${SITE_URL}/sitemaps/static.xml`, lastmod: now },
      { loc: `${SITE_URL}/sitemaps/courses.xml`, lastmod: now },
      ...courses.map((c) => ({ loc: `${SITE_URL}/sitemaps/lessons-${c.slug}.xml`, lastmod: now })),
      { loc: `${SITE_URL}/sitemaps/games.xml`, lastmod: now },
      { loc: `${SITE_URL}/sitemaps/articles.xml`, lastmod: now },
    ];
    return xmlResponse(sitemapIndexXml(items));
  }

  if (name === 'static') return xmlResponse(urlsetXml(staticEntries()));
  if (name === 'courses') return xmlResponse(urlsetXml(await courseEntries()));
  if (name === 'articles') return xmlResponse(urlsetXml(await articleEntries()));
  if (name === 'games') return xmlResponse(urlsetXml(gameEntries()));

  // lessons-<courseSlug> → bài học của khóa đó
  if (name.startsWith('lessons-')) {
    const slug = name.slice('lessons-'.length);
    const course = (await courseList()).find((c) => c.slug === slug);
    if (!course) return new Response('Not found', { status: 404 });
    return xmlResponse(urlsetXml(await lessonEntriesByCourse(course.id)));
  }

  return new Response('Not found', { status: 404 });
}
