import type { Metadata } from 'next';
import TtsPageClient from './TtsPageClient';

export const metadata: Metadata = {
  title: 'Công Cụ Chuyển Text ↔ Âm Thanh | TTS & STT',

  description:
    'Công cụ TTS & STT miễn phí: Chuyển văn bản thành giọng nói (50+ giọng Việt) và âm thanh thành text (10+ ngôn ngữ). Hỗ trợ trẻ em luyện phát âm và nghe hiểu.',

  keywords: [
    'TTS',
    'STT',
    'text to speech',
    'speech to text',
    'chuyển văn bản thành giọng nói',
    'chuyển giọng nói thành text',
    'giọng nói tiếng Việt',
    'nhận dạng giọng nói',
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
      'Công Cụ Text-to-Speech & Speech-to-Text | TTS & STT | Bé Hay Học',
    description:
      'TTS & STT miễn phí: Text→Âm thanh (50+ giọng Việt) + Âm thanh→Text (10+ ngôn ngữ). Luyện phát âm, nghe hiểu, tải MP3.',
    url: '/cong-cu/chuyen-van-ban-thanh-giong-noi',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-tts.jpg',
        width: 1200,
        height: 630,
        alt: 'Công Cụ Chuyển Text ↔ Âm Thanh - Bé Hay Học',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TTS & STT miễn phí | Bé Hay Học',
    description:
      'Chuyển text thành giọng nói (50+ giọng) & âm thanh thành text (10+ ngôn ngữ).',
    images: ['/og-tts.jpg'],
  },

  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
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
