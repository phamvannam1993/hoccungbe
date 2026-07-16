import { Metadata } from 'next';
import DocumentDetailClient from './DocumentDetailClient';
import { DEFAULT_OG_IMAGE, SITE_URL } from '../../lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getDocument(slug: string) {
  try {
    // For server-side fetch in Next.js, use explicit localhost with timeout
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
    const url = `${apiUrl}/api/documents/slug/${slug}`;
    console.log(`[getDocument] Fetching from: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`[getDocument] Failed: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(`[getDocument] Response body: ${text.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    console.log(`[getDocument] ✓ Loaded: "${data.title}"`);
    return data;
  } catch (err) {
    console.error(`[getDocument] Error:`, err instanceof Error ? err.message : err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const document = await getDocument(slug);

  if (!document) {
    return {
      title: 'Tài Liệu Không Tìm Thấy',
      description: 'Tài liệu bạn tìm kiếm không tồn tại.',
    };
  }

  return {
    title: document.title,
    description: document.description || `Tải ${document.title} - Tài liệu PDF học tập chất lượng cao`,
    keywords: [document.title, 'tài liệu', 'PDF', 'học tập'],
    alternates: { canonical: `${SITE_URL}/tai-lieu/${document.slug}` },
    openGraph: {
      title: document.title,
      description: document.description || `Tải ${document.title} - Tài liệu PDF học tập chất lượng cao`,
      url: `${SITE_URL}/tai-lieu/${document.slug}`,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: document.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: document.title,
      description: document.description || `Tải ${document.title} - Tài liệu PDF học tập chất lượng cao`,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function DocumentDetailPage({ params }: Props) {
  const { slug } = await params;
  const document = await getDocument(slug);

  if (!document) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Tài Liệu Không Tìm Thấy</h1>
        <p>Tài liệu bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  return <DocumentDetailClient document={document} />;
}
