import Link from 'next/link';

const quickLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Khóa học', href: '/courses' },
  { label: 'Kho trò chơi', href: '/games' },
  { label: 'Tiến độ bé', href: '/progress' },
  { label: 'Bảng giá', href: '/pricing' },
];

const parentLinks = [
  { label: 'Góc phụ huynh', href: '/blog' },
  { label: 'Cách bắt đầu', href: '/how-it-works' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Chính sách bảo mật', href: '/privacy-policy' },
  { label: 'Điều khoản sử dụng', href: '/terms' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-2xl text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  Nền tảng học tập
                </p>
                <p className="text-2xl font-black text-slate-900">Học Cùng Bé</p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Học Cùng Bé là nền tảng học tập vui dành cho trẻ từ 3 đến 10 tuổi,
              kết hợp trò chơi giáo dục, bài học ngắn và theo dõi tiến độ rõ ràng
              để phụ huynh đồng hành cùng con dễ dàng hơn mỗi ngày.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Khám phá
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-sky-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Dành cho phụ huynh
            </h3>
            <ul className="mt-5 space-y-3">
              {parentLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-sky-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Liên hệ
            </h3>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p>
                Email hỗ trợ:
                <br />
                <a
                  href="mailto:support@hoccungbe.com"
                  className="font-semibold text-slate-800 transition hover:text-sky-700"
                >
                  support@hoccungbe.com
                </a>
              </p>

              <p>
                Hotline:
                <br />
                <a
                  href="tel:0123456789"
                  className="font-semibold text-slate-800 transition hover:text-sky-700"
                >
                  0123 456 789
                </a>
              </p>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                <p className="text-sm font-bold text-slate-900">
                  Nhận cập nhật mới
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Đăng ký để nhận bài viết mới, tài liệu hữu ích và gợi ý học tập
                  phù hợp cho bé.
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Học Cùng Bé. Tất cả quyền được bảo lưu.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="transition hover:text-sky-700">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="transition hover:text-sky-700">
                Điều khoản sử dụng
              </Link>
              <Link href="/contact" className="transition hover:text-sky-700">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}