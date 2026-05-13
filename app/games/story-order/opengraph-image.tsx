import { ImageResponse } from 'next/og';

export const alt = 'Sap xep truoc - sau - Tro choi tu duy thoi gian cho be';
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
            'linear-gradient(135deg, #ede9fe 0%, #fce7f3 50%, #fef3c7 100%)',
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
            color: '#7c3aed',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
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
          Sap xep truoc - sau
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
          Tu duy trinh tu thoi gian va nguyen nhan - ket qua - Be 5-8 tuoi
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {['🌰', '🌱', '🌿', '🌳'].map((emoji, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 32,
                  background: 'linear-gradient(135deg, #a78bfa, #f9a8d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 96,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                }}
              >
                {emoji}
              </div>
              {idx < 3 && (
                <div style={{ fontSize: 56, color: '#a78bfa', display: 'flex' }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
