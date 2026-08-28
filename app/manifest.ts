import type { MetadataRoute } from 'next';
import { SITE_NAME } from './lib/seo';

// Đồng bộ với ICON_VER ở layout.tsx — tăng khi đổi icon để chống cache.
const ICON_VER = '20260828';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Học vui mỗi ngày`,
    short_name: SITE_NAME,
    description: 'Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#6ec6c6',
    theme_color: '#6ec6c6',
    orientation: 'portrait',
    icons: [
      { src: `/icon-16x16.png?v=${ICON_VER}`, sizes: '16x16', type: 'image/png' },
      { src: `/icon-32x32.png?v=${ICON_VER}`, sizes: '32x32', type: 'image/png' },
      { src: `/apple-touch-icon.png?v=${ICON_VER}`, sizes: '180x180', type: 'image/png' },
      { src: `/icon-192x192.png?v=${ICON_VER}`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `/icon-192x192.png?v=${ICON_VER}`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: `/icon-512x512.png?v=${ICON_VER}`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `/icon-512x512.png?v=${ICON_VER}`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['education', 'kids', 'games'],
    lang: 'vi',
  };
}
