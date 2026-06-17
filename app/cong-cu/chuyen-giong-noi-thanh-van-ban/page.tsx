import type { Metadata } from 'next';
import SttPageClient from './SttPageClient';

export const metadata: Metadata = {
  title: 'Công Cụ Chuyển Giọng Nói Thành Text | Nhận Dạng Giọng Nói | Bé Hay Học',

  description:
    'Công cụ STT miễn phí chuyển giọng nói thành văn bản. Hỗ trợ 10+ ngôn ngữ, tất cả định dạng âm thanh. Hỗ trợ trẻ em luyện nghe và hiểu lời nói.',

  keywords: [
    'STT',
    'speech to text',
    'chuyển giọng nói thành text',
    'nhận dạng giọng nói',
    'speech recognition',
    'giọng nói tiếng Việt',
    'chuyển đổi giọng nói',
    'công cụ nhận dạng',
    'luyện nghe cho bé',
    'hiểu lời nói',
    'phiên âm tiếng Việt',
    'công cụ giáo dục',
    'bé hay học',
  ],

  authors: [{ name: 'Bé Hay Học' }],

  alternates: {
    canonical: '/cong-cu/chuyen-giong-noi-thanh-van-ban',
  },

  openGraph: {
    title:
      'Công Cụ Chuyển Giọng Nói Thành Text | Bé Hay Học - Hỗ Trợ 10+ Ngôn Ngữ',
    description:
      'STT miễn phí chuyển giọng nói thành văn bản. Hỗ trợ 10+ ngôn ngữ, tất cả định dạng âm thanh (MP3, WAV, FLAC...). Luyện nghe và hiểu lời nói cho bé.',
    url: '/cong-cu/chuyen-giong-noi-thanh-van-ban',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-stt.jpg',
        width: 1200,
        height: 630,
        alt: 'Công Cụ Chuyển Giọng Nói Thành Text - Bé Hay Học',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Công Cụ Chuyển Giọng Nối Thành Text | Bé Hay Học',
    description:
      'STT miễn phí, 10+ ngôn ngữ, hỗ trợ MP3/WAV/FLAC, luyện nghe cho bé.',
    images: ['/og-stt.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function SttPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Công Cụ Chuyển Giọng Nói Thành Text',
    applicationCategory: 'EducationalApplication',
    description:
      'Công cụ STT miễn phí chuyển giọng nói thành văn bản với hỗ trợ 10+ ngôn ngữ',
    url: 'https://behayhoc.com/cong-cu/chuyen-giong-noi-thanh-van-ban',
    image: 'https://behayhoc.com/logo.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    featureList: [
      'Hỗ trợ 10+ ngôn ngữ',
      'Nhận dạng giọng nói tự nhiên',
      'Hỗ trợ MP3, WAV, FLAC, M4A, OGG',
      'Tự động chuyển đổi định dạng âm thanh',
      'Tối đa 50MB mỗi file',
      'Không yêu cầu đăng ký',
    ],
    inLanguage: 'vi-VN',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SttPageClient />
    </>
  );
}
