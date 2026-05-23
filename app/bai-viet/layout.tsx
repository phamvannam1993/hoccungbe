import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bài viết - Bé Hay Học',
  description: 'Kiến thức, kinh nghiệm và tin tức giáo dục trẻ em từ Bé Hay Học.',
};

export default function BaiVietLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
