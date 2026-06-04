import type { NextConfig } from "next";

const GAME_MAP: Record<string, string> = {
  'match-word': 'ghep-tu',
  'math-fun': 'toan-vui',
  'memory-hunt': 'san-hinh-ghi-nho',
  'english-vocab': 'tu-vung-tieng-anh',
  'sound-match': 'ghep-am-thanh',
  'quick-pick': 'chon-nhanh',
  'missing-number': 'tim-so-thieu',
  'shadow-match': 'ghep-bong',
  'color-sort': 'sap-xep-mau',
  'count-animals': 'dem-dong-vat',
  'first-letter': 'chu-cai-dau',
  'group-match': 'ghep-nhom',
  'opposite-pairs': 'cap-doi-trai-nghia',
  'sequence-sort': 'sap-xep-thu-tu',
  'odd-one-out': 'tim-ke-le',
  'initial-sound': 'am-dau',
  'number-quantity-match': 'so-va-so-luong',
  'pattern-complete': 'hoan-thanh-quy-luat',
  'listen-and-do': 'nghe-va-lam',
  'mini-maze': 'me-cung-nho',
  'half-match': 'ghep-doi',
  'sequence-memory': 'nho-thu-tu',
  'rhyme-match': 'ghep-van',
  'connect-numbers': 'noi-so',
  'apple-pick': 'hai-tao',
  'animal-feed': 'cho-vat-an',
  'bubble-math': 'toan-bong-bong',
  'number-line-addition': 'cong-tren-so-do',
  'compare-numbers': 'so-sanh-so',
  'number-sequence-write': 'viet-day-so',
  'falling-number': 'so-roi',
  'where-belongs': 'tim-cho-cho-vat',
  'story-order': 'sap-xep-truyen',
  'bird-count': 'dem-chim',
  'bird-subtraction': 'chim-bay-mat',
  'rabbit-hole': 'tho-vao-hang',
  'rabbit-steal-quantity': 'tho-cap-ca-rot',
  'pool-fish-first-grade': 'ca-trong-ho',
  'apple-picking-complete': 'hai-tao-hoc',
  'train-complete-lessons': 'tau-hoc-toan',
  'number-sequence': 'day-so',
  'column-lift-drag': 'keo-cot-so',
  'forest-match': 'ghep-hinh-rung',
  'puzzle-game': 'ghep-manh-hinh',
  'sea-bubble-math': 'toan-bong-bong-bien',
  'fishing-letters': 'cau-ca-chu-cai',
  'missing-letter': 'tim-chu-bi-mat',
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
      { source: '/:lessonSlug/:exerciseFile.html', destination: '/:lessonSlug/:exerciseFile' },
      { source: '/tro-choi', destination: '/games' },
      { source: '/khoa-hoc', destination: '/courses' },
      { source: '/khoa-hoc/:slug', destination: '/courses/:slug' },
      { source: '/dang-ky', destination: '/register' },
      { source: '/dang-nhap', destination: '/login' },
      { source: '/tien-do', destination: '/progress' },
      { source: '/ho-tro', destination: '/support' },
      { source: '/goc-phu-huynh', destination: '/blog' },
      { source: '/lien-he', destination: '/contact' },
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
      { source: '/courses', destination: '/khoa-hoc', permanent: true },
      { source: '/courses/:slug', destination: '/khoa-hoc/:slug', permanent: true },
      { source: '/register', destination: '/dang-ky', permanent: true },
      { source: '/login', destination: '/dang-nhap', permanent: true },
      { source: '/progress', destination: '/tien-do', permanent: true },
      { source: '/support', destination: '/ho-tro', permanent: true },
      { source: '/blog', destination: '/goc-phu-huynh', permanent: true },
      { source: '/contact', destination: '/lien-he', permanent: true },
      { source: '/privacy-policy', destination: '/chinh-sach-bao-mat', permanent: true },
      { source: '/terms', destination: '/dieu-khoan', permanent: true },
      { source: '/how-it-works', destination: '/huong-dan', permanent: true },
      { source: '/faq', destination: '/cau-hoi-thuong-gap', permanent: true },
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
