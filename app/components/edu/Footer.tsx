import Link from 'next/link';
import { BookOpen } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-2xl text-white shadow-md">
                <BookOpen size={20} />
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
