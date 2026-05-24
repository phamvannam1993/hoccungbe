import { ImageResponse } from 'next/og';

export const alt = 'Khóa học cho bé - Bé Hay Học';
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

  const subjects = [
    { icon: '🔤', label: 'Ngôn ngữ', color: '#fef3c7', text: '#92400e' },
    { icon: '🔢', label: 'Toán học', color: '#dbeafe', text: '#1e40af' },
    { icon: '🧠', label: 'Tư duy', color: '#f3e8ff', text: '#6b21a8' },
    { icon: '🌍', label: 'Tiếng Anh', color: '#dcfce7', text: '#166534' },
  ];

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #fef9f0 0%, #fff7ed 100%)',
        padding: '60px 80px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#f97316' }}>Bé Hay Học</span>
          <span style={{ fontSize: 20, color: '#d1d5db' }}>›</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#6b7280' }}>Khóa học</span>
        </div>

        {/* Title */}
        <div style={{ marginTop: 32, fontSize: 76, fontWeight: 900, color: '#1e293b', lineHeight: 1.05, display: 'flex' }}>
          Thư viện khóa học
        </div>
        <div style={{ marginTop: 8, fontSize: 76, fontWeight: 900, lineHeight: 1.05, display: 'flex' }}>
          <span style={{ color: '#f97316' }}>cho bé</span>
          <span style={{ color: '#1e293b' }}>&nbsp;3-10 tuổi</span>
        </div>

        {/* Subject cards */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 20 }}>
          {subjects.map(({ icon, label, color, text }) => (
            <div key={label} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: color, borderRadius: 24, padding: '24px 16px', gap: 12,
            }}>
              <span style={{ fontSize: 52 }}>{icon}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: text }}>{label}</span>
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
