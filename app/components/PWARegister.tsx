'use client';

import { useEffect, useState } from 'react';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// iOS Safari KHÔNG hỗ trợ beforeinstallprompt → không thể cài bằng 1 nút.
// Cách duy nhất trên iPhone/iPad là: Chia sẻ → "Thêm vào Màn hình chính".
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOSDevice = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ báo là "Macintosh" nhưng có cảm ứng → nhận thêm trường hợp này.
  const iPadOS = navigator.platform === 'MacIntel' && (navigator as unknown as { maxTouchPoints: number }).maxTouchPoints > 1;
  return iOSDevice || iPadOS;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Trình duyệt TRONG APP (Facebook/Zalo/Messenger/Instagram/TikTok/Line) — iOS ở đây
// KHÔNG có nút Chia sẻ của Safari → không thể "Thêm vào Màn hình chính".
function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|FB_IAB|Instagram|Messenger|Zalo|Line\/|MicroMessenger|TikTok|BytedanceWebview|GSA\//i.test(ua);
}

export default function PWARegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [mode, setMode] = useState<'android' | 'ios' | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // 1) Đăng ký service worker (offline + cài như app) — CHỈ ở production.
    if ('serviceWorker' in navigator) {
      const host = window.location.hostname;
      const isDev =
        host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local');
      if (isDev) {
        navigator.serviceWorker
          .getRegistrations()
          .then((rs) => rs.forEach((r) => r.unregister()))
          .catch(() => {});
        if ('caches' in window) {
          caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
        }
      } else {
        const onLoad = () =>
          navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {});
        if (document.readyState === 'complete') onLoad();
        else window.addEventListener('load', onLoad, { once: true });
      }
    }

    const dismissed = (() => {
      try {
        return localStorage.getItem('bhh-a2hs-dismissed') === '1';
      } catch {
        return false;
      }
    })();

    // 2) Android/Chrome: bắt sự kiện cài để hiện nút "Cài ngay".
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setMode('android');
      if (!dismissed) setHidden(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setHidden(true));

    // 3) iOS: không có sự kiện → nếu chưa cài & chưa tắt, hiện hướng dẫn thủ công.
    if (!dismissed && isIOS() && !isStandalone()) {
      const t = setTimeout(() => {
        setMode((m) => m ?? 'ios'); // nhường Android nếu vì lý do nào đó cả hai cùng có
        setHidden(false);
      }, 1200);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', onPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (hidden || !mode) return null;

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    setHidden(true);
  };

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem('bhh-a2hs-dismissed', '1');
    } catch {
      /* ignore */
    }
  };

  const shell: React.CSSProperties = {
    position: 'fixed',
    left: 12,
    right: 12,
    bottom: `calc(12px + env(safe-area-inset-bottom))`,
    zIndex: 60,
    margin: '0 auto',
    maxWidth: 440,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 18,
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,.18)',
    border: '2px solid #6ec6c6',
  };

  // iOS: hướng dẫn cài. Trong app (FB/Zalo…) thì phải mở Safari trước.
  if (mode === 'ios') {
    const inApp = isInAppBrowser();
    return (
      <div role="dialog" aria-label="Cài ứng dụng Bé Hay Học trên iPhone" style={shell}>
        <img src="/icon-192x192.png?v=20260828" alt="" width={44} height={44} style={{ borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Cài Bé Hay Học lên iPhone</div>
          {inApp ? (
            <div style={{ color: '#475569', fontSize: 12.5, lineHeight: 1.4 }}>
              Đang mở trong ứng dụng khác nên chưa cài được. Bấm dấu <b style={{ color: '#0f172a' }}>•••</b> (góc trên) →{' '}
              <b style={{ color: '#0f172a' }}>“Mở trong Safari”</b>, rồi cài từ đó.
            </div>
          ) : (
            <div style={{ color: '#475569', fontSize: 12.5, lineHeight: 1.4 }}>
              Bấm nút Chia sẻ{' '}
              <span aria-hidden style={{ display: 'inline-flex', verticalAlign: 'middle', color: '#0a84ff' }}>
                <svg width="14" height="16" viewBox="0 0 20 22" fill="none" style={{ margin: '0 1px' }}>
                  <path d="M10 2v11" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 6l4-4 4 4" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 10H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>{' '}
              <b style={{ color: '#0f172a' }}>ở thanh Safari</b>, kéo xuống chọn <b style={{ color: '#0f172a' }}>“Thêm vào MH chính”</b>.
            </div>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Đóng"
          style={{ flexShrink: 0, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    );
  }

  // Android/Chrome: nút cài trực tiếp
  return (
    <div role="dialog" aria-label="Cài ứng dụng Bé Hay Học" style={shell}>
      <img src="/icon-192x192.png?v=20260828" alt="" width={44} height={44} style={{ borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Cài Bé Hay Học lên máy</div>
        <div style={{ color: '#475569', fontSize: 12.5 }}>Mở nhanh như app, học được cả khi mất mạng.</div>
      </div>
      <button
        onClick={install}
        style={{
          flexShrink: 0,
          fontWeight: 800,
          color: '#fff',
          background: '#FF6B9D',
          border: 'none',
          borderRadius: 999,
          padding: '9px 16px',
          cursor: 'pointer',
        }}
      >
        Cài ngay
      </button>
      <button
        onClick={dismiss}
        aria-label="Đóng"
        style={{ flexShrink: 0, background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
