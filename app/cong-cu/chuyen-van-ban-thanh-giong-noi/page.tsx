import type { Metadata } from 'next';
import TtsPageClient from './TtsPageClient';

const pageUrl = 'https://behayhoc.com/cong-cu/chuyen-van-ban-thanh-giong-noi';
const ogImage = 'https://behayhoc.com/og-tts.jpg';

export const metadata: Metadata = {
  title: 'Chuyển Văn Bản Thành Giọng Nói Tiếng Việt',

  description:
    'Công cụ chuyển văn bản thành giọng nói tiếng Việt online miễn phí. Tạo giọng đọc tự nhiên, điều chỉnh tốc độ và tải file MP3 cho bài học, video, luyện nghe.',

  keywords: [
    'chuyển văn bản thành giọng nói',
    'chuyển text thành giọng nói',
    'text to speech tiếng Việt',
    'tts tiếng Việt',
    'tạo giọng đọc tiếng Việt',
    'công cụ đọc văn bản',
    'đọc văn bản thành tiếng',
    'chuyển chữ thành giọng nói',
    'tạo file mp3 từ văn bản',
    'luyện nghe cho bé',
    'luyện phát âm tiếng Việt',
    'đọc bài học cho bé',
    'bé hay học',
  ],

  authors: [{ name: 'Bé Hay Học' }],
  creator: 'Bé Hay Học',
  publisher: 'Bé Hay Học',

  alternates: {
    canonical: pageUrl,
  },

  openGraph: {
    title: 'Chuyển Văn Bản Thành Giọng Nói Tiếng Việt Online',
    description:
      'Công cụ TTS miễn phí giúp chuyển văn bản thành giọng nói tiếng Việt. Phù hợp tạo bài học, video thuyết minh, luyện nghe và luyện phát âm cho bé.',
    url: pageUrl,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Công cụ chuyển văn bản thành giọng nói tiếng Việt - Bé Hay Học',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Văn Bản Thành Giọng Nói | Bé Hay Học',
    description:
      'Tạo giọng đọc tiếng Việt từ văn bản, hỗ trợ luyện nghe, luyện phát âm, bài học và video.',
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

export default function TtsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: 'Chuyển Văn Bản Thành Giọng Nói Tiếng Việt',
        description:
          'Công cụ chuyển văn bản thành giọng nói tiếng Việt online miễn phí, hỗ trợ tạo giọng đọc cho bài học, video và luyện nghe.',
        inLanguage: 'vi-VN',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Bé Hay Học',
          url: 'https://behayhoc.com',
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: ogImage,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'Công Cụ Chuyển Văn Bản Thành Giọng Nói',
        alternateName: 'Text to Speech Tiếng Việt Bé Hay Học',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        inLanguage: 'vi-VN',
        url: pageUrl,
        image: ogImage,
        description:
          'Công cụ TTS miễn phí giúp chuyển văn bản thành giọng nói tiếng Việt, hỗ trợ tạo âm thanh cho bài học, video, luyện nghe và luyện phát âm.',
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
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
        },
        featureList: [
          'Chuyển văn bản thành giọng nói tiếng Việt',
          'Tạo giọng đọc tự nhiên từ văn bản',
          'Hỗ trợ nhiều giọng đọc',
          'Điều chỉnh tốc độ đọc',
          'Tải xuống dưới dạng MP3',
          'Phù hợp cho bài học, video và luyện nghe',
          'Miễn phí, không cần đăng ký',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Công cụ chuyển văn bản thành giọng nói dùng để làm gì?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Công cụ giúp chuyển nội dung chữ viết thành giọng đọc tiếng Việt, phù hợp để tạo bài học, video thuyết minh, luyện nghe và luyện phát âm.',
            },
          },
          {
            '@type': 'Question',
            name: 'Có thể tải file âm thanh sau khi tạo không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Có. Sau khi tạo giọng đọc, người dùng có thể nghe lại và tải file âm thanh để sử dụng cho học tập hoặc nội dung số.',
            },
          },
          {
            '@type': 'Question',
            name: 'Công cụ có phù hợp cho trẻ em không?',
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                'Có. Công cụ phù hợp để tạo giọng đọc cho bài học, câu chuyện, nội dung luyện nghe và luyện phát âm tiếng Việt cho trẻ em.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item: 'https://behayhoc.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Công cụ',
            item: 'https://behayhoc.com/cong-cu',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Chuyển văn bản thành giọng nói',
            item: pageUrl,
          },
        ],
      },
    ],
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

