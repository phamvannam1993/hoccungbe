import { ImageResponse } from 'next/og';

export const alt = 'Khóa học - Bé Hay Học';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

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
  const [font, course] = await Promise.all([
    loadFont().catch(() => null),
    fetch(`${API}/courses/slug/${slug}`, { next: { revalidate: 3600 } })
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null) as Promise<{ title?: string; description?: string; ageRange?: string } | null>,
  ]);

  const title = course?.title || 'Khóa học';
  const description = course?.description || 'Bài học & trò chơi giáo dục tương tác dành cho bé';
  const ageRange = course?.ageRange || '3-10 tuổi';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)',
        padding: '60px 80px',
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: '#9ca3af' }}>
          <span style={{ color: '#f97316', fontWeight: 700 }}>Bé Hay Học</span>
          <span>›</span>
          <span>Khóa học</span>
        </div>

        {/* Age badge */}
        <div style={{
          marginTop: 28,
          display: 'flex', alignItems: 'center',
          background: '#fef3c7', borderRadius: 50,
          padding: '10px 24px', width: 'fit-content',
          fontSize: 22, fontWeight: 700, color: '#92400e',
        }}>
          👶 {ageRange}
        </div>

        {/* Title */}
        <div style={{
          marginTop: 20,
          fontSize: title.length > 30 ? 60 : 76,
          fontWeight: 900,
          color: '#1e293b',
          lineHeight: 1.1,
          display: 'flex',
          maxWidth: 900,
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{
          marginTop: 20,
          fontSize: 26,
          color: '#64748b',
          lineHeight: 1.5,
          maxWidth: 840,
          display: 'flex',
        }}>
          {description.length > 120 ? description.slice(0, 120) + '...' : description}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {['📚 Bài học tương tác', '🎮 Trò chơi học', '📊 Theo dõi tiến độ'].map((t) => (
              <div key={t} style={{
                background: '#fff',
                border: '2px solid #fed7aa',
                borderRadius: 50, padding: '10px 20px',
                fontSize: 20, color: '#c2410c', fontWeight: 600,
              }}>{t}</div>
            ))}
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#f97316' }}>behayhoc.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(font ? { fonts: [{ name: 'Be Vietnam Pro', data: font, weight: 800 }] } : {}),
    }
  );
}
