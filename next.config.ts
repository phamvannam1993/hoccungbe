import type { NextConfig } from "next";

const GAME_MAP: Record<string, string> = {
  // Toán học
  'sea-bubble-math': 'toan-bong-bong-bien',
  'bird-count': 'dem-chim',
  'bird-subtraction': 'chim-bay-mat',
  'rabbit-hole': 'tho-vao-hang',
  'rabbit-steal-quantity': 'tho-cap-ca-rot',
  'pool-fish-first-grade': 'ca-trong-ho-boi',
  'apple-picking-complete': 'hai-tao-hoc-toan',
  'train-complete-lessons': 'doan-tau-toan-hoc',
  'number-sequence': 'day-so',
  'column-lift-drag': 'keo-cot-so',

  // Ngôn ngữ
  'fishing-letters': 'cau-ca-chu-cai',
  'missing-letter': 'tim-chu-bi-mat',
  'letter-tracing': 'tap-viet-chu',
  'trace-sentence': 'to-theo-net-cau',
  'doc-van-ghep-chu': 'ghep-chu-thanh-van',
  'bubble-vocabulary': 'bat-bong-tu-vung',

  // Tư duy
  'puzzle-game': 'ghep-hinh-rung',
};

const VI_TO_EN = Object.fromEntries(Object.entries(GAME_MAP).map(([en, vi]) => [vi, en]));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },

  async rewrites() {
    const gameRewrites = Object.entries(VI_TO_EN).map(([vi, en]) => ({
      source: `/tro-choi/${vi}`,
      destination: `/games/${en}`,
    }));
    return [
      // /sitemap.xml = sitemap index (Next reserve tên sitemap.xml nên phải rewrite).
      { source: '/sitemap.xml', destination: '/sitemaps/index.xml' },
      { source: '/:lessonSlug/:exerciseFile.html', destination: '/:lessonSlug/:exerciseFile' },
      { source: '/tro-choi', destination: '/games' },
      { source: '/khoa-hoc', destination: '/courses' },
      { source: '/khoa-hoc/:slug', destination: '/courses/:slug' },
      { source: '/dang-ky', destination: '/register' },
      { source: '/dang-nhap', destination: '/login' },
      { source: '/tien-do', destination: '/progress' },
      { source: '/ho-tro', destination: '/support' },
      { source: '/chinh-sach-bao-mat', destination: '/privacy-policy' },
      { source: '/dieu-khoan', destination: '/terms' },
      { source: '/huong-dan', destination: '/how-it-works' },
      { source: '/cau-hoi-thuong-gap', destination: '/faq' },
      ...gameRewrites,
    ];
  },

  async redirects() {
    const gameRedirects = Object.entries(GAME_MAP).map(([en, vi]) => ({
      source: `/games/${en}`,
      destination: `/tro-choi/${vi}`,
      permanent: true,
    }));
    return [
      { source: '/games', destination: '/tro-choi', permanent: true },
      // Bài "9 cách dạy bé học Toán lớp 1..." đã xóa khỏi DB → 301 sang bài Toán lớp 1 còn sống (tránh 404 cho URL đã index).
      { source: '/bai-viet/9-cach-day-be-hoc-toan-lop-1-tai-nha-de-dang-va-hieu-qua', destination: '/bai-viet/toan-lop-1-hoc-nhung-gi-kinh-nghiem-giup-be-hoc-hieu-qua', permanent: true },
      // Sửa slug tiếng Việt bị mất chữ (đọc → oc) → 301 sang slug đúng
      { source: '/bai-viet/cach-luyen-oc-hieu-cho-hoc-sinh-lop-1', destination: '/bai-viet/cach-luyen-doc-hieu-cho-hoc-sinh-lop-1', permanent: true },
      { source: '/bai-viet/vi-sao-con-oc-uoc-nhung-khong-hieu-bai', destination: '/bai-viet/vi-sao-con-doc-duoc-nhung-khong-hieu-bai', permanent: true },
      // Chuẩn hóa slug khóa Toán: toan-hoc-lop-N → toan-lop-N (301, giữ SEO)
      { source: '/khoa-hoc/toan-hoc-lop-1', destination: '/khoa-hoc/toan-lop-1', permanent: true },
      { source: '/khoa-hoc/toan-hoc-lop-2', destination: '/khoa-hoc/toan-lop-2', permanent: true },
      { source: '/courses', destination: '/khoa-hoc', permanent: true },
      { source: '/courses/:slug', destination: '/khoa-hoc/:slug', permanent: true },
      { source: '/register', destination: '/dang-ky', permanent: true },
      { source: '/login', destination: '/dang-nhap', permanent: true },
      { source: '/progress', destination: '/tien-do', permanent: true },
      { source: '/support', destination: '/ho-tro', permanent: true },
      // Gộp về /bai-viet: bỏ hẳn khu góc phụ huynh tĩnh (app/blog) — 301 mọi URL cũ về hệ bài viết.
      { source: '/goc-phu-huynh', destination: '/bai-viet', permanent: true },
      { source: '/goc-phu-huynh/:path*', destination: '/bai-viet', permanent: true },
      { source: '/blog', destination: '/bai-viet', permanent: true },
      { source: '/blog/:path*', destination: '/bai-viet', permanent: true },
      { source: '/tro-choi/ghep-manh-hinh', destination: '/tro-choi/ghep-hinh-rung', permanent: true },
      { source: '/tro-choi/ca-trong-ho', destination: '/tro-choi/ca-trong-ho-boi', permanent: true },
      { source: '/tro-choi/hai-tao-hoc', destination: '/tro-choi/hai-tao-hoc-toan', permanent: true },
      { source: '/tro-choi/tau-hoc-toan', destination: '/tro-choi/doan-tau-toan-hoc', permanent: true },
      // Bỏ trang liên hệ riêng — gộp về trang hỗ trợ (301).
      { source: '/lien-he', destination: '/ho-tro', permanent: true },
      { source: '/contact', destination: '/ho-tro', permanent: true },
      { source: '/privacy-policy', destination: '/chinh-sach-bao-mat', permanent: true },
      { source: '/terms', destination: '/dieu-khoan', permanent: true },
      { source: '/how-it-works', destination: '/huong-dan', permanent: true },
      { source: '/faq', destination: '/cau-hoi-thuong-gap', permanent: true },
      { source: '/tts', destination: '/cong-cu/chuyen-van-ban-thanh-giong-noi', permanent: true },
      ...gameRedirects,
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
