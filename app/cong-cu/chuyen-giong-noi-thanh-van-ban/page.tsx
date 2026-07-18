import type { Metadata } from 'next';
import SttPageClient from './SttPageClient';

const pageUrl = 'https://behayhoc.com/cong-cu/chuyen-giong-noi-thanh-van-ban';
const ogImage = 'https://behayhoc.com/og-home.jpg';

export const metadata: Metadata = {
  title: 'Chuyển Giọng Nói Thành Văn Bản Online Miễn Phí',

  description:
    'Công cụ chuyển giọng nói thành văn bản online miễn phí. Hỗ trợ tiếng Việt, nhiều ngôn ngữ và các định dạng âm thanh phổ biến như MP3, WAV, FLAC, M4A.',

  keywords: [
    'chuyển giọng nói thành văn bản',
    'chuyển giọng nói thành text',
    'speech to text',
    'STT tiếng Việt',
    'nhận dạng giọng nói',
    'phiên âm tiếng Việt',
    'chuyển audio thành text',
    'công cụ speech to text',
    'chuyển file âm thanh thành văn bản',
    'bé hay học',
  ],

  authors: [{ name: 'Bé Hay Học' }],
  creator: 'Bé Hay Học',
  publisher: 'Bé Hay Học',

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: 'Chuyển Giọng Nói Thành Văn Bản Online Miễn Phí',
    description:
      'Công cụ STT miễn phí giúp chuyển giọng nói, file audio thành văn bản. Hỗ trợ tiếng Việt, nhiều ngôn ngữ và các định dạng âm thanh phổ biến.',
    url: pageUrl,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Công cụ chuyển giọng nói thành văn bản - Bé Hay Học',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Giọng Nói Thành Văn Bản | Bé Hay Học',
    description:
      'Công cụ STT miễn phí, hỗ trợ tiếng Việt, nhiều ngôn ngữ và các định dạng âm thanh phổ biến.',
    images: [ogImage],
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
    '@id': `${pageUrl}#software`,
    name: 'Công Cụ Chuyển Giọng Nói Thành Văn Bản',
    alternateName: 'Speech to Text Bé Hay Học',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    inLanguage: 'vi-VN',
    url: pageUrl,
    image: ogImage,
    description:
      'Công cụ chuyển giọng nói thành văn bản online miễn phí, hỗ trợ tiếng Việt, nhiều ngôn ngữ và các định dạng âm thanh phổ biến.',
    publisher: {
      '@type': 'Organization',
      name: 'Bé Hay Học',
      url: 'https://behayhoc.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://behayhoc.com/logo.png',
      },
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    featureList: [
      'Chuyển giọng nói thành văn bản',
      'Hỗ trợ tiếng Việt',
      'Hỗ trợ nhiều ngôn ngữ',
      'Hỗ trợ MP3, WAV, FLAC, M4A, OGG',
      'Tự động xử lý file âm thanh',
      'Không yêu cầu đăng ký',
    ],
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
