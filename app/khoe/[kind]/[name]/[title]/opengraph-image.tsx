import { ImageResponse } from 'next/og';
import { SHARE_META, type ShareKind } from '../../../../lib/share';

export const alt = 'Thành tích của bé trên Bé Hay Học';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadFont() {
  try {
    const res = await fetch('https://fonts.gstatic.com/s/bevietnampro/v11/QdVNSTAyLFyeg_IDWvOJmVES_HwyPR8.woff2');
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

function dec(s?: string) {
  if (!s) return '';
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function Image({ params }: { params: Promise<{ kind: string; name: string; title: string }> }) {
  const p = await params;
  const kind = (SHARE_META[p.kind as ShareKind] ? p.kind : 'huy-hieu') as ShareKind;
  const meta = SHARE_META[kind];
  const name = dec(p.name) || 'Bé';
  const title = dec(p.title) || 'thành tích mới';
  const font = await loadFont().catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
          color: '#ffffff',
          fontFamily: font ? 'Be Vietnam Pro' : 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.95, display: 'flex' }}>Bé Hay Học</div>
        <div style={{ fontSize: 150, marginTop: 6, display: 'flex' }}>{meta.emoji}</div>
        <div style={{ fontSize: 46, fontWeight: 800, marginTop: 10, display: 'flex' }}>
          {name} vừa {meta.label}
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, marginTop: 8, display: 'flex', maxWidth: 1040, lineHeight: 1.1 }}>“{title}”</div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 24, opacity: 0.95, display: 'flex' }}>
          Học Toán · Tiếng Việt · Tiếng Anh miễn phí cho bé
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Be Vietnam Pro', data: font, style: 'normal', weight: 700 }] : undefined,
    },
  );
}
