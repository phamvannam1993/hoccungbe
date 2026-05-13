import { ImageResponse } from 'next/og';

export const alt = 'Đồ vật ở đâu? - Trò chơi tư duy phân loại cho bé';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage:
            'linear-gradient(135deg, #d1fae5 0%, #e0f2fe 45%, #ede9fe 100%)',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 800,
            color: '#0369a1',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 30,
            }}
          >
            HCB
          </div>
          <span>HOC CUNG BE</span>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 84,
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.05,
            display: 'flex',
          }}
        >
          Do vat o dau?
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            color: '#334155',
            lineHeight: 1.4,
            maxWidth: 900,
            display: 'flex',
          }}
        >
          Tro choi tu duy phan loai theo boi canh - Be 4-7 tuoi
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            gap: 28,
            fontSize: 96,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              background: 'linear-gradient(135deg, #fb923c, #f43f5e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            }}
          >
            🍳
          </div>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            }}
          >
            🏫
          </div>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            }}
          >
            🏖️
          </div>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              background: 'linear-gradient(135deg, #fbbf24, #fb923c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            }}
          >
            🦁
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
