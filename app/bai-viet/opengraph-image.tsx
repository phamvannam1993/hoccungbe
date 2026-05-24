import { ImageResponse } from 'next/og';

export const alt = 'Góc phụ huynh - Kiến thức nuôi dạy con - Bé Hay Học';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont() {
  const res = await fetch('https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2');
  return res.arrayBuffer();
}

export default async function Image() {
  const font = await loadFont().catch(() => null);

  const topics = [
    { icon: '📖', label: 'Kiến thức', bg: '#fef3c7' },
    { icon: '💡', label: 'Kinh nghiệm', bg: '#dbeafe' },
    { icon: '📰', label: 'Tin tức', bg: '#dcfce7' },
    { icon: '🎯', label: 'Hoạt động', bg: '#fce7f3' },
  ];

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fff1f2 100%)',
        padding: '60px 80px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#c0392b' }}>Bé Hay Học</span>
          <span style={{ fontSize: 20, color: '#d1d5db' }}>›</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#6b7280' }}>Bài viết</span>
        </div>

        {/* Title */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 76, fontWeight: 900, color: '#1e293b', lineHeight: 1.05 }}>Góc phụ huynh</span>
          <span style={{ fontSize: 32, fontWeight: 600, color: '#c0392b', marginTop: 12 }}>
            Kiến thức & kinh nghiệm nuôi dạy con
          </span>
        </div>

        {/* Topic pills */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 20 }}>
          {topics.map(({ icon, label, bg }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: bg, borderRadius: 50, padding: '16px 28px',
              fontSize: 24, fontWeight: 700, color: '#1e293b',
            }}>
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      ...(font ? { fonts: [{ name: 'Be Vietnam Pro', data: font, weight: 800 }] } : {}),
    }
  );
}
