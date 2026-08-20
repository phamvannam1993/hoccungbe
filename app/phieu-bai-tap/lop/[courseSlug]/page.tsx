import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourseTopics } from '../../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../../../components/seo/kid';

// Hub phiếu bài tập theo khoá: /phieu-bai-tap/lop/{courseSlug}.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }): Promise<Metadata> {
  const { courseSlug } = await params;
  const data = await getCourseTopics(courseSlug);
  if (!data) return { title: 'Phiếu bài tập', robots: { index: false, follow: false } };
  const title = `Phiếu bài tập ${data.course.title} – in PDF, có đáp án`;
  const description = `Trọn bộ phiếu bài tập ${data.course.title} theo từng bài, kèm đáp án. In trực tiếp hoặc tải PDF miễn phí cho bé luyện tập tại nhà.`;
  const path = `/phieu-bai-tap/lop/${courseSlug}`;
  return {
    title,
    description,
    alternates: { canonical: canonical(path) },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: canonical(path), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const data = await getCourseTopics(courseSlug);
  if (!data) notFound();

  const { course, topics } = data;
  const lessonCount = topics.reduce((n, t) => n + t.lessons.length, 0);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Phiếu bài tập', item: `${SITE_URL}/phieu-bai-tap` },
      { '@type': 'ListItem', position: 3, name: course.title, item: `${SITE_URL}/phieu-bai-tap/lop/${courseSlug}` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Phiếu bài tập', href: '/phieu-bai-tap' }, { label: course.title }]} />

      <KidHero emoji="📄" eyebrow="Phiếu bài tập PDF" title={`Phiếu bài tập ${course.title}`} tone="pink"
        description={`Trọn bộ ${lessonCount} phiếu bài tập ${course.title} theo từng bài, mỗi phiếu gồm đầy đủ câu hỏi kèm đáp án. Bấm vào bài để xem, in trực tiếp hoặc lưu PDF miễn phí cho bé luyện tập tại nhà.`} />

      <div className="mt-6 space-y-6">
        {topics.map((topic) => (
          <KidCard key={topic.id} emoji="📘" title={topic.label} tone="blue" badge={topic.lessons.length}>
            <KidLinkList
              tone="blue"
              items={topic.lessons.map((lesson) => ({ href: `/phieu-bai-tap/${lesson.slug}/ca-bai`, label: lesson.title, emoji: '📄' }))}
            />
          </KidCard>
        ))}
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title="Xem thêm" tone="green">
          <KidLinkList
            tone="green"
            items={[
              { href: `/khoa-hoc/${courseSlug}`, label: `Khoá học ${course.title}`, emoji: '📚' },
              { href: `/bai-tap/${courseSlug}`, label: `Bài tập ${course.title} (online)`, emoji: '✏️' },
              { href: '/phieu-bai-tap', label: 'Tất cả phiếu bài tập', emoji: '📄' },
              { href: '/de-thi', label: 'Đề thi & kiểm tra', emoji: '📝' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
