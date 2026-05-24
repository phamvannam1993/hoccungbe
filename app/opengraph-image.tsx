import { ImageResponse } from 'next/og';

export const alt = 'Bé Hay Học - Nền tảng học tập và trò chơi giáo dục cho bé 3-10 tuổi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont() {
  const res = await fetch('https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2');
  return res.arrayBuffer();
}

export default async function Image() {
  const font = await loadFont().catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: 9999, background: 'rgba(255,255,255,0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', display: 'flex' }} />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
          }}>🎓</div>
          <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>Bé Hay Học</span>
        </div>

        {/* Main title */}
        <div style={{
          marginTop: 48,
          fontSize: 72,
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <span>Học vui mỗi ngày</span>
          <span style={{ color: '#fde68a' }}>cùng Bé Hay Học</span>
        </div>

        {/* Description */}
        <div style={{
          marginTop: 28,
          fontSize: 30,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.4,
          maxWidth: 800,
          display: 'flex',
        }}>
          Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi
        </div>

        {/* Feature pills */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 16 }}>
          {[['📚', 'Khóa học'], ['🎮', 'Trò chơi'], ['📊', 'Tiến độ'], ['🔊', 'Âm thanh']].map(([icon, label]) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 50, padding: '12px 24px',
              fontSize: 22, color: '#fff', fontWeight: 600,
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
