import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Khóa học cho bé', href: '/courses' },
  { label: 'Kho trò chơi giáo dục', href: '/games' },
  { label: 'Tiến độ học tập', href: '/progress' },
];

const parentLinks = [
  { label: 'Góc phụ huynh', href: '/blog' },
  { label: 'Cách bắt đầu', href: '/how-it-works' },
  { label: 'Câu hỏi thường gặp', href: '/faq' },
  { label: 'Liên hệ', href: '/contact' },
];

const seoLinks = [
  { label: 'Học chữ cái cho bé', href: '/courses' },
  { label: 'Học toán vui cho bé', href: '/courses' },
  { label: 'Học tiếng Anh cho bé', href: '/courses' },
  { label: 'Trò chơi tư duy cho trẻ em', href: '/games' },
];

const legalLinks = [
  { label: 'Chính sách bảo mật', href: '/privacy-policy' },
  { label: 'Điều khoản sử dụng', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Về trang chủ Học Cùng Bé"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-md">
                <BookOpen size={22} aria-hidden="true" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  Bé Hay Học
                </p>
                <p className="text-2xl font-black text-slate-900">
                  Học Cùng Bé
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Học Cùng Bé là nền tảng học tập và trò chơi giáo dục cho bé từ
              3 đến 10 tuổi, giúp trẻ học chữ, toán, tiếng Anh và tư duy qua
              các bài học ngắn, trực quan, dễ tiếp thu.
            </p>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
              Phụ huynh có thể đồng hành cùng con tại nhà, theo dõi tiến độ học
              tập và lựa chọn nội dung phù hợp với từng độ tuổi của bé.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Khám phá
            </h2>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
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

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Chủ đề học tập
            </h2>

            <ul className="mt-5 space-y-3">
              {seoLinks.map((item) => (
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

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Phụ huynh
            </h2>

            <ul className="mt-5 space-y-3">
              {parentLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-sky-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {legalLinks.map((item) => (
                <li key={item.href}>
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

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-900">
              Liên hệ
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="flex gap-3">
                <Mail
                  size={18}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <span>
                  Email hỗ trợ:
                  <br />
                  <a
                    href="mailto:support@behayhoc.com"
                    className="font-semibold text-slate-800 transition hover:text-sky-700"
                  >
                    support@behayhoc.com
                  </a>
                </span>
              </p>

              <p className="flex gap-3">
                <Phone
                  size={18}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <span>
                  Hotline:
                  <br />
                  <a
                    href="tel:0123456789"
                    className="font-semibold text-slate-800 transition hover:text-sky-700"
                  >
                    0123 456 789
                  </a>
                </span>
              </p>

              <p className="flex gap-3">
                <MapPin
                  size={18}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />
                <span>
                  Website:
                  <br />
                  <a
                    href="https://behayhoc.com"
                    className="font-semibold text-slate-800 transition hover:text-sky-700"
                  >
                    behayhoc.com
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 Học Cùng Bé. Nền tảng học tập và trò chơi giáo dục cho bé.
            </p>

            <div className="flex flex-wrap gap-4">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-sky-700"
                >
                  {item.label}
                </Link>
              ))}

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
