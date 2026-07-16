import { Metadata } from 'next';
import DocumentsListClient from './DocumentsListClient';
import { DEFAULT_OG_IMAGE } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Kho Tài Liệu PDF Học Tập',
  description: 'Thư viện tài liệu PDF miễn phí cho trẻ em: Toán học, Vật Lý, Hóa Học, Tiếng Anh, Văn học, Sinh học. Download tài liệu học tập chất lượng cao.',
  keywords: ['tài liệu PDF', 'học tập', 'toán học', 'vật lý', 'tiếng anh', 'tài liệu miễn phí'],
  alternates: { canonical: '/tai-lieu' },
  openGraph: {
    title: 'Kho Tài Liệu PDF Học Tập',
    description: 'Thư viện tài liệu PDF miễn phí cho trẻ em',
    url: '/tai-lieu',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Kho tài liệu PDF học tập - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kho Tài Liệu PDF Học Tập | Bé Hay Học',
    description: 'Thư viện tài liệu PDF miễn phí cho trẻ em.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function DocumentsPage() {
  return <DocumentsListClient />;
}
