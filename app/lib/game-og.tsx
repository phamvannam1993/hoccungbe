import { ImageResponse } from 'next/og';
import { resolveGame } from '../components/edu/GameStructuredData';

export const OG_SIZE = { width: 1200, height: 630 };

async function loadFont() {
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2',
    );
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

/** Sinh ảnh Open Graph riêng cho từng trò chơi từ dữ liệu game (emoji, tên, tuổi, kỹ năng). */
export async function renderGameOgImage(slug: string) {
  const font = await loadFont().catch(() => null);
  const game = resolveGame(slug);

  const title = game?.title ?? 'Trò chơi giáo dục';
  const emoji = game?.emoji ?? '🎮';
  const age = game?.age ?? '3-10 tuổi';
  const category = game?.category ?? 'Trò chơi';
  const skills = (game?.skills ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)',
          padding: '60px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#c4b5fd' }}>
          <span style={{ fontWeight: 800 }}>Bé Hay Học</span>
          <span style={{ color: '#8b5cf6' }}>›</span>
          <span>Trò chơi giáo dục</span>
        </div>

        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ fontSize: 120, display: 'flex' }}>{emoji}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                background: '#4338ca',
                color: '#fde68a',
                borderRadius: 50,
                padding: '8px 22px',
                fontSize: 22,
                fontWeight: 700,
                width: 'fit-content',
                display: 'flex',
              }}
            >
              👶 {age} · {category}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: title.length > 22 ? 58 : 74,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.05,
                display: 'flex',
                maxWidth: 720,
              }}
            >
              {title}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {skills.map((s) => (
            <div
              key={s}
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '2px solid #6d28d9',
                borderRadius: 50,
                padding: '10px 22px',
                fontSize: 24,
                color: '#e9d5ff',
                fontWeight: 600,
                display: 'flex',
              }}
            >
              ✅ {s}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 26, color: '#c4b5fd' }}>Chơi miễn phí trên trình duyệt</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#fde68a' }}>behayhoc.com</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      ...(font ? { fonts: [{ name: 'Be Vietnam Pro', data: font, weight: 800 as const }] } : {}),
    },
  );
}
