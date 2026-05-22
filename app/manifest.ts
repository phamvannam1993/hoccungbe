import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bé Hay Học',
    short_name: 'Bé Hay Học',
    description: 'Nền tảng học tập & trò chơi giáo dục cho bé 3-10 tuổi',
    start_url: '/',
    display: 'standalone',
    background_color: '#6ec6c6',
    theme_color: '#6ec6c6',
    orientation: 'portrait',
    icons: [
      { src: '/icon-16x16.png',   sizes: '16x16',   type: 'image/png' },
      { src: '/icon-32x32.png',   sizes: '32x32',   type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    categories: ['education', 'kids'],
    lang: 'vi',
  };
}
