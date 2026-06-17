import type { Metadata } from 'next';
import TtsPageClient from './TtsPageClient';

export const metadata: Metadata = {
  title: 'Luyện Phát Âm Tiếng Việt - Công Cụ TTS Cho Bé | Bé Hay Học',

  description:
    'Công cụ TTS miễn phí giúp bé luyện phát âm tiếng Việt. Nghe bài học qua 11 giọng nói tự nhiên, điều chỉnh tốc độ & cao độ. Tải MP3 cho bé 3-8 tuổi.',

  keywords: [
    'luyện phát âm cho bé',
    'tts tiếng việt',
    'công cụ nghe bài học',
    'giọng nói tự nhiên',
    'đọc văn bản cho bé',
    'nghe lại bài học',
    'text to speech',
    'chuyển văn bản thành giọng nói',
    'công cụ giáo dục',
    'bé hay học',
    'học tiếng việt',
    'kỹ năng nghe cho bé',
  ],

  authors: [{ name: 'Bé Hay Học' }],

  alternates: {
    canonical: '/cong-cu/chuyen-van-ban-thanh-giong-noi',
  },

  openGraph: {
    title:
      'Luyện Phát Âm Tiếng Việt - Công Cụ TTS Cho Bé | Bé Hay Học',
    description:
      'Công cụ TTS giúp bé luyện phát âm tiếng Việt với 11 giọng nói tự nhiên. Điều chỉnh tốc độ, cao độ. Tải MP3 miễn phí.',
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
    title: 'Luyện Phát Âm Tiếng Việt - Công Cụ TTS Cho Bé',
    description:
      'Giúp bé luyện phát âm qua giọng nói tự nhiên. 11 giọng nói, điều chỉnh tốc độ & cao độ, tải MP3 miễn phí.',
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
    name: 'Công Cụ Luyện Phát Âm - TTS Tiếng Việt',
    applicationCategory: 'EducationalApplication',
    description:
      'Công cụ TTS miễn phí giúp bé luyện phát âm tiếng Việt với 11 giọng nói tự nhiên, điều chỉnh tốc độ và cao độ',
    url: 'https://behayhoc.com/cong-cu/chuyen-van-ban-thanh-giong-noi',
    image: 'https://behayhoc.com/logo.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    featureList: [
      '11 giọng nói tiếng Việt tự nhiên',
      'Luyện phát âm và kỹ năng nghe',
      'Điều chỉnh tốc độ phát âm',
      'Điều chỉnh cao độ giọng',
      'Tải xuống dưới dạng MP3',
      'Miễn phí, không cần đăng ký',
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
