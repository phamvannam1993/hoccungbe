import { ImageResponse } from 'next/og';

export const alt = 'Bài viết - Bé Hay Học';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

const CATEGORY_LABEL: Record<string, string> = {
  'kien-thuc': 'Kiến thức',
  'kinh-nghiem': 'Kinh nghiệm',
  'tin-tuc': 'Tin tức',
  'hoat-dong': 'Hoạt động',
};

async function loadFont() {
  try {
    const res = await fetch('https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2');
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) return null;
    return res.arrayBuffer();
  } catch { return null; }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [font, article] = await Promise.all([
    loadFont().catch(() => null),
    fetch(`${API}/api/articles/${slug}`, { next: { revalidate: 3600 } })
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null) as Promise<{ title?: string; excerpt?: string; category?: string; authorName?: string } | null>,
  ]);

  const title = article?.title || 'Bài viết';
  const excerpt = article?.excerpt || 'Kiến thức nuôi dạy con từ Bé Hay Học';
  const category = article?.category ? (CATEGORY_LABEL[article.category] || article.category) : null;

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)',
        padding: '60px 80px',
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: '#9ca3af' }}>
          <span style={{ color: '#c0392b', fontWeight: 700 }}>Bé Hay Học</span>
          <span>›</span>
          <span>Bài viết</span>
          {category && <><span>›</span><span style={{ color: '#c0392b' }}>{category}</span></>}
        </div>

        {/* Category badge */}
        {category && (
          <div style={{
            marginTop: 24,
            display: 'flex',
            background: '#fee2e2', borderRadius: 50,
            padding: '10px 24px', width: 'fit-content',
            fontSize: 22, fontWeight: 700, color: '#991b1b',
          }}>
            {category}
          </div>
        )}

        {/* Title */}
        <div style={{
          marginTop: 20,
          fontSize: title.length > 50 ? 52 : title.length > 30 ? 62 : 72,
          fontWeight: 900,
          color: '#1e293b',
          lineHeight: 1.15,
          display: 'flex',
          maxWidth: 960,
        }}>
          {title}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <div style={{
            marginTop: 20,
            fontSize: 26,
            color: '#64748b',
            lineHeight: 1.5,
            maxWidth: 840,
            display: 'flex',
          }}>
            {excerpt.length > 130 ? excerpt.slice(0, 130) + '...' : excerpt}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontSize: 22, fontWeight: 600, color: '#6b7280',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 9999,
              background: '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>✍️</div>
            <span>{article?.authorName || 'Bé Hay Học'}</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#c0392b' }}>behayhoc.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(font ? { fonts: [{ name: 'Be Vietnam Pro', data: font, weight: 800 }] } : {}),
    }
  );
}
