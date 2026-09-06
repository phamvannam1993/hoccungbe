import type { Metadata } from 'next';
import TrieuPhuClient from './TrieuPhuClient';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

// Game "Ai Là Triệu Phú Nhí" — thi kiến thức theo lớp, dùng chung ngân hàng câu
// hỏi của phần luyện kỹ năng nên nội dung đã được soát cùng một quy trình.

const title = 'Ai Là Triệu Phú Nhí — game đố vui kiến thức cho học sinh lớp 1–5';
const description =
  'Chơi Ai Là Triệu Phú Nhí miễn phí: leo thang 15 mốc thưởng, thử thách 60 giây và thử thách Boss. Câu hỏi theo đúng chương trình từng lớp, có trợ giúp và phân tích năng lực sau mỗi ván.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonical('/trieu-phu-nhi') },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: canonical('/trieu-phu-nhi'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  return <TrieuPhuClient />;
}
