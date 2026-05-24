import { ImageResponse } from 'next/og';

export const alt = 'Kho trò chơi giáo dục cho bé 3-10 tuổi - Bé Hay Học';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont() {
  try {
    const res = await fetch('https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2');
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) return null;
    return res.arrayBuffer();
  } catch { return null; }
}

export default async function Image() {
  const font = await loadFont().catch(() => null);

  const games = ['🧩', '🎯', '🔢', '🔤', '🎪', '🌈', '🎵', '⚡'];

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        padding: '60px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Stars bg */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${[10, 20, 60, 70, 30, 80][i]}%`,
            left: `${[5, 85, 15, 75, 45, 55][i]}%`,
            fontSize: 24, opacity: 0.3, display: 'flex',
          }}>✦</div>
        ))}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#c4b5fd' }}>Bé Hay Học</span>
          <span style={{ fontSize: 20, color: '#6d28d9' }}>›</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#8b5cf6' }}>Trò chơi</span>
        </div>

        {/* Title */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 74, fontWeight: 900, color: '#fff', lineHeight: 1.05 }}>Kho trò chơi</span>
          <span style={{ fontSize: 74, fontWeight: 900, color: '#fde68a', lineHeight: 1.05 }}>giáo dục</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: '#c4b5fd' }}>
          Hơn 30 game học tập cho bé 3-10 tuổi
        </div>

        {/* Game icons grid */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 16 }}>
          {games.map((emoji, i) => (
            <div key={i} style={{
              width: 96, height: 96,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 52,
              border: '2px solid rgba(255,255,255,0.15)',
            }}>
              {emoji}
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
