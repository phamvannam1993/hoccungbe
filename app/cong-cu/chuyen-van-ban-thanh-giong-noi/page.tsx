import type { Metadata } from 'next';
import TtsPageClient from './TtsPageClient';

export const metadata: Metadata = {
  title: 'Công Cụ Chuyển Text Thành Giọng Nói | Bé Hay Học',

  description:
    'Công cụ TTS miễn phí chuyển văn bản thành giọng nói tiếng Việt. 50+ giọng, tốc độ và cao độ tuỳ chỉnh. Hỗ trợ trẻ em luyện phát âm và nghe lại bài học.',

  keywords: [
    'TTS',
    'text to speech',
    'chuyển văn bản thành giọng nói',
    'giọng nói tiếng Việt',
    'tts tiếng Việt',
    'công cụ phát âm',
    'luyện phát âm cho bé',
    'nghe bài học',
    'âm thanh tổng hợp',
    'đọc văn bản tự động',
    'công cụ giáo dục',
    'bé hay học',
  ],

  authors: [{ name: 'Bé Hay Học' }],

  alternates: {
    canonical: '/cong-cu/chuyen-van-ban-thanh-giong-noi',
  },

  openGraph: {
    title:
      'Công Cụ Chuyển Text Thành Giọng Nói | Bé Hay Học - 50+ Giọng Nói Tiếng Việt',
    description:
      'TTS miễn phí chuyển văn bản thành giọng nói tiếng Việt. Điều chỉnh tốc độ, cao độ. Luyện phát âm cho bé. Tải âm thanh MP3.',
    url: '/cong-cu/chuyen-van-ban-thanh-giong-noi',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-tts.jpg',
        width: 1200,
        height: 630,
        alt: 'Công Cụ Chuyển Text Thành Giọng Nói - Bé Hay Học',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Công Cụ Chuyển Text Thành Giọng Nói | Bé Hay Học',
    description:
      'TTS miễn phí, 50+ giọng nói tiếng Việt, điều chỉnh tốc độ & cao độ, tải MP3.',
    images: ['/og-tts.jpg'],
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

export default function TtsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Công Cụ Chuyển Text Thành Giọng Nói',
    applicationCategory: 'EducationalApplication',
    description:
      'Công cụ TTS miễn phí chuyển văn bản thành giọng nói tiếng Việt với 50+ giọng nói tự nhiên',
    url: 'https://behayhoc.com/cong-cu/chuyen-van-ban-thanh-giong-noi',
    image: 'https://behayhoc.com/logo.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    featureList: [
      '50+ giọng nói tiếng Việt',
      'Điều chỉnh tốc độ phát âm',
      'Điều chỉnh cao độ giọng',
      'Tải xuống dưới dạng MP3',
      'Hỗ trợ tối đa 500 ký tự',
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
      <TtsPageClient />
    </>
  );
}
