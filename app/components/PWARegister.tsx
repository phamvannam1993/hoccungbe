'use client';

import { useEffect, useState } from 'react';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function PWARegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // 1) Đăng ký service worker (offline + cài như app) — CHỈ ở production.
    // Ở localhost/dev, SW cache JS kiểu cache-first sẽ phục vụ bundle CŨ (stale) gây lỗi
    // hydration → nên gỡ SW + xoá mọi cache khi chạy dev.
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

    // 2) Bắt sự kiện cài đặt để hiện nút "Cài ứng dụng"
    const dismissed = (() => {
      try {
        return localStorage.getItem('bhh-a2hs-dismissed') === '1';
      } catch {
        return false;
      }
    })();

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      if (!dismissed) setHidden(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setHidden(true));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (hidden || !deferred) return null;

  const install = async () => {
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

  return (
    <div
      role="dialog"
      aria-label="Cài ứng dụng Bé Hay Học"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
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
      }}
    >
      <img src="/icon-192x192.png" alt="" width={44} height={44} style={{ borderRadius: 12, flexShrink: 0 }} />
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
