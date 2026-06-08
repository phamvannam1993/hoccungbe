import { Metadata } from 'next';
import DocumentsListClient from './DocumentsListClient';

export const metadata: Metadata = {
  title: 'Kho Tài Liệu PDF Học Tập | Bé Hay Học',
  description: 'Thư viện tài liệu PDF miễn phí cho trẻ em: Toán học, Vật Lý, Hóa Học, Tiếng Anh, Văn học, Sinh học. Download tài liệu học tập chất lượng cao.',
  keywords: ['tài liệu PDF', 'học tập', 'toán học', 'vật lý', 'tiếng anh', 'tài liệu miễn phí'],
  openGraph: {
    title: 'Kho Tài Liệu PDF Học Tập',
    description: 'Thư viện tài liệu PDF miễn phí cho trẻ em',
    url: '/tai-lieu',
    type: 'website',
  },
};

export default function DocumentsPage() {
  return <DocumentsListClient />;
}
