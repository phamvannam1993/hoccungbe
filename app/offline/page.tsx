import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đang ngoại tuyến',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: '100%',
          textAlign: 'center',
          background: '#fff',
          borderRadius: 28,
          padding: '32px 24px',
          boxShadow: '0 12px 40px rgba(0,0,0,.12)',
          border: '3px solid #FFD93D',
        }}
      >
        <img src="/icon-192x192.png" alt="Bé Hay Học" width={96} height={96} style={{ borderRadius: 22, margin: '0 auto 12px' }} />
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '4px 0 8px' }}>
          Bé đang ngoại tuyến 📶
        </h1>
        <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>
          Có vẻ mạng đang chập chờn. Bé hãy kiểm tra kết nối rồi thử lại nhé. Những trang đã học sẽ vẫn xem được khi ngoại tuyến.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            fontWeight: 800,
            color: '#fff',
            background: '#FF6B9D',
            borderRadius: 999,
            padding: '12px 26px',
            textDecoration: 'none',
          }}
        >
          Thử lại
        </a>
      </div>
    </main>
  );
}
