import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell } from '../components/seo/kid';
import { PageHeader, HocTiep } from '../components/khung';
import LessonClient from './LessonClient';

export const revalidate = 86400;

const TITLE = 'Học tiếng Anh cho bé — Game bài học vui';
const DESCRIPTION =
  'Game học tiếng Anh cho bé kiểu bài học ngắn: nghe chọn tranh, chọn nghĩa, ghép cặp, chọn từ. Có tim, điểm sao và phản hồi tức thì — vừa chơi vừa nhớ từ vựng.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/hoc-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/hoc-tieng-anh'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return (
    <KidShell max="3xl">
      <PageHeader
        href="/hoc-tieng-anh"
        crumbLabel="Học tiếng Anh (game)"
        emoji="🦉"
        eyebrow="Tiếng Anh · Game bài học"
        title="Học tiếng Anh vui như chơi game"
        description={
          <>
            Bài học ngắn kiểu <strong>Duolingo</strong>: nghe chọn tranh, chọn nghĩa, ghép cặp, chọn từ đúng. Có <strong>tim ❤️</strong>,
            <strong> điểm sao ⭐</strong> và phản hồi ngay — bé vừa chơi vừa nhớ từ.
          </>
        }
      />
      <LessonClient />

      <HocTiep href="/hoc-tieng-anh" />
    </KidShell>
  );
}
