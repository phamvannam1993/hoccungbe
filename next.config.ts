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
  'knowledge-race': 'dua-xe-kien-thuc',

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
      // Sửa slug tiếng Việt bị mất chữ (đọc → oc, đừng → ung, đẹp → ep) → 301 sang slug đúng
      { source: '/bai-viet/cach-luyen-oc-hieu-cho-hoc-sinh-lop-1', destination: '/bai-viet/cach-luyen-doc-hieu-cho-hoc-sinh-lop-1', permanent: true },
      { source: '/bai-viet/vi-sao-con-oc-uoc-nhung-khong-hieu-bai', destination: '/bai-viet/vi-sao-con-doc-duoc-nhung-khong-hieu-bai', permanent: true },
      { source: '/bai-viet/muon-con-viet-tot-tieng-viet-lop-1-ung-chi-luyen-chu-ep', destination: '/bai-viet/muon-con-viet-tot-tieng-viet-lop-1-dung-chi-luyen-chu-dep', permanent: true },
      { source: '/bai-viet/cach-luyen-chu-ep-ma-khong-ep-con', destination: '/bai-viet/cach-luyen-chu-dep-ma-khong-ep-con', permanent: true },
      // Đề thi trùng "cuối học kỳ I" (bản mẫu) → 301 về bản chính "cuối học kỳ 1".
      { source: '/de-thi/kiem-tra-cuoi-hk1-toan-lop1-mau', destination: '/de-thi/kiem-tra-cuoi-hk1-toan-lop1', permanent: true },
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
      // 301: slug Toán lớp 1 cũ (lặp tiền tố "toan-lop-1-bai-N") → slug mô tả chuẩn SEO.
      { source: '/toan-lop-1/toan-lop-1-bai-1', destination: '/toan-lop-1/bai-1-cac-so-0-1-2-3-4-5', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-2', destination: '/toan-lop-1/bai-2-cac-so-6-7-8-9-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-3', destination: '/toan-lop-1/bai-3-nhieu-hon-it-hon-bang-nhau', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-4', destination: '/toan-lop-1/bai-4-so-sanh-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-5', destination: '/toan-lop-1/bai-5-may-va-may', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-6', destination: '/toan-lop-1/bai-6-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-7', destination: '/toan-lop-1/bai-7-hinh-vuong-hinh-tron-hinh-tam-giac-hinh-chu-nhat', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-8', destination: '/toan-lop-1/bai-8-thuc-hanh-lap-ghep-xep-hinh', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-9', destination: '/toan-lop-1/bai-9-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-10', destination: '/toan-lop-1/bai-10-phep-cong-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-11', destination: '/toan-lop-1/bai-11-phep-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-12', destination: '/toan-lop-1/bai-12-bang-cong-bang-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-13', destination: '/toan-lop-1/bai-13-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-14', destination: '/toan-lop-1/bai-14-khoi-lap-phuong-khoi-hop-chu-nhat', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-15', destination: '/toan-lop-1/bai-15-vi-tri-dinh-huong-trong-khong-gian', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-16', destination: '/toan-lop-1/bai-16-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-17', destination: '/toan-lop-1/bai-17-on-tap-cac-so-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-18', destination: '/toan-lop-1/bai-18-on-tap-phep-cong-phep-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-19', destination: '/toan-lop-1/bai-19-on-tap-hinh-hoc', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-20', destination: '/toan-lop-1/bai-20-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-21', destination: '/toan-lop-1/bai-21-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-22', destination: '/toan-lop-1/bai-22-so-sanh-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-23', destination: '/toan-lop-1/bai-23-bang-cac-so-tu-1-den-100', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-24', destination: '/toan-lop-1/bai-24-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-25', destination: '/toan-lop-1/bai-25-dai-hon-ngan-hon', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-26', destination: '/toan-lop-1/bai-26-don-vi-do-do-dai', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-27', destination: '/toan-lop-1/bai-27-thuc-hanh-uoc-luong-va-do-do-dai', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-28', destination: '/toan-lop-1/bai-28-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-29', destination: '/toan-lop-1/bai-29-phep-cong-so-co-hai-chu-so-voi-so-co-mot-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-30', destination: '/toan-lop-1/bai-30-phep-cong-so-co-hai-chu-so-voi-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-31', destination: '/toan-lop-1/bai-31-phep-tru-so-co-hai-chu-so-cho-so-co-mot-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-32', destination: '/toan-lop-1/bai-32-phep-tru-so-co-hai-chu-so-cho-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-33', destination: '/toan-lop-1/bai-33-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-34', destination: '/toan-lop-1/bai-34-xem-gio-dung-tren-dong-ho', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-35', destination: '/toan-lop-1/bai-35-cac-ngay-trong-tuan', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-36', destination: '/toan-lop-1/bai-36-thuc-hanh-xem-lich-va-gio', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-37', destination: '/toan-lop-1/bai-37-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-38', destination: '/toan-lop-1/bai-38-on-tap-cac-so-va-phep-tinh-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-39', destination: '/toan-lop-1/bai-39-on-tap-cac-so-va-phep-tinh-trong-pham-vi-100', permanent: true },
      { source: '/toan-lop-1/toan-lop-1-bai-40', destination: '/toan-lop-1/bai-40-luyen-tap-cuoi-nam', permanent: true },
      // 301: URL phẳng CŨ (1 cấp) của Toán lớp 1 → slug mô tả mới (giữ nguyên chuỗi redirect).
      { source: '/toan-lop-1-bai-1', destination: '/toan-lop-1/bai-1-cac-so-0-1-2-3-4-5', permanent: true },
      { source: '/toan-lop-1-bai-2', destination: '/toan-lop-1/bai-2-cac-so-6-7-8-9-10', permanent: true },
      { source: '/toan-lop-1-bai-3', destination: '/toan-lop-1/bai-3-nhieu-hon-it-hon-bang-nhau', permanent: true },
      { source: '/toan-lop-1-bai-4', destination: '/toan-lop-1/bai-4-so-sanh-so', permanent: true },
      { source: '/toan-lop-1-bai-5', destination: '/toan-lop-1/bai-5-may-va-may', permanent: true },
      { source: '/toan-lop-1-bai-6', destination: '/toan-lop-1/bai-6-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-7', destination: '/toan-lop-1/bai-7-hinh-vuong-hinh-tron-hinh-tam-giac-hinh-chu-nhat', permanent: true },
      { source: '/toan-lop-1-bai-8', destination: '/toan-lop-1/bai-8-thuc-hanh-lap-ghep-xep-hinh', permanent: true },
      { source: '/toan-lop-1-bai-9', destination: '/toan-lop-1/bai-9-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-10', destination: '/toan-lop-1/bai-10-phep-cong-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-11', destination: '/toan-lop-1/bai-11-phep-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-12', destination: '/toan-lop-1/bai-12-bang-cong-bang-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-13', destination: '/toan-lop-1/bai-13-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-14', destination: '/toan-lop-1/bai-14-khoi-lap-phuong-khoi-hop-chu-nhat', permanent: true },
      { source: '/toan-lop-1-bai-15', destination: '/toan-lop-1/bai-15-vi-tri-dinh-huong-trong-khong-gian', permanent: true },
      { source: '/toan-lop-1-bai-16', destination: '/toan-lop-1/bai-16-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-17', destination: '/toan-lop-1/bai-17-on-tap-cac-so-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-18', destination: '/toan-lop-1/bai-18-on-tap-phep-cong-phep-tru-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-19', destination: '/toan-lop-1/bai-19-on-tap-hinh-hoc', permanent: true },
      { source: '/toan-lop-1-bai-20', destination: '/toan-lop-1/bai-20-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-21', destination: '/toan-lop-1/bai-21-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-22', destination: '/toan-lop-1/bai-22-so-sanh-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-23', destination: '/toan-lop-1/bai-23-bang-cac-so-tu-1-den-100', permanent: true },
      { source: '/toan-lop-1-bai-24', destination: '/toan-lop-1/bai-24-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-25', destination: '/toan-lop-1/bai-25-dai-hon-ngan-hon', permanent: true },
      { source: '/toan-lop-1-bai-26', destination: '/toan-lop-1/bai-26-don-vi-do-do-dai', permanent: true },
      { source: '/toan-lop-1-bai-27', destination: '/toan-lop-1/bai-27-thuc-hanh-uoc-luong-va-do-do-dai', permanent: true },
      { source: '/toan-lop-1-bai-28', destination: '/toan-lop-1/bai-28-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-29', destination: '/toan-lop-1/bai-29-phep-cong-so-co-hai-chu-so-voi-so-co-mot-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-30', destination: '/toan-lop-1/bai-30-phep-cong-so-co-hai-chu-so-voi-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-31', destination: '/toan-lop-1/bai-31-phep-tru-so-co-hai-chu-so-cho-so-co-mot-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-32', destination: '/toan-lop-1/bai-32-phep-tru-so-co-hai-chu-so-cho-so-co-hai-chu-so', permanent: true },
      { source: '/toan-lop-1-bai-33', destination: '/toan-lop-1/bai-33-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-34', destination: '/toan-lop-1/bai-34-xem-gio-dung-tren-dong-ho', permanent: true },
      { source: '/toan-lop-1-bai-35', destination: '/toan-lop-1/bai-35-cac-ngay-trong-tuan', permanent: true },
      { source: '/toan-lop-1-bai-36', destination: '/toan-lop-1/bai-36-thuc-hanh-xem-lich-va-gio', permanent: true },
      { source: '/toan-lop-1-bai-37', destination: '/toan-lop-1/bai-37-luyen-tap-chung', permanent: true },
      { source: '/toan-lop-1-bai-38', destination: '/toan-lop-1/bai-38-on-tap-cac-so-va-phep-tinh-trong-pham-vi-10', permanent: true },
      { source: '/toan-lop-1-bai-39', destination: '/toan-lop-1/bai-39-on-tap-cac-so-va-phep-tinh-trong-pham-vi-100', permanent: true },
      { source: '/toan-lop-1-bai-40', destination: '/toan-lop-1/bai-40-luyen-tap-cuoi-nam', permanent: true },
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
