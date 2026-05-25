import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Khóa học cho bé', href: '/courses' },
  { label: 'Kho trò chơi giáo dục', href: '/games' },
  { label: 'Tiến độ học tập', href: '/progress' },
];

const parentLinks = [
  { label: 'Góc phụ huynh', href: '/bai-viet' },
  { label: 'Cách bắt đầu', href: '/huong-dan' },
  { label: 'Câu hỏi thường gặp', href: '/cau-hoi-thuong-gap' },
  { label: 'Liên hệ', href: '/lien-he' },
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
    <footer className="bg-[#e8735a] border-t border-white/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Về trang chủ Bé Hay Học">
              <Image src="/assets/images/logo.png" alt="Bé Hay Học" width={180} height={65} className="object-contain mix-blend-multiply" unoptimized />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/90">
              Bé Hay Học là nền tảng học tập và trò chơi giáo dục cho bé từ
              3 đến 10 tuổi, giúp trẻ học chữ, toán, tiếng Anh và tư duy qua
              các bài học ngắn, trực quan, dễ tiếp thu.
            </p>

            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">
              Phụ huynh có thể đồng hành cùng con tại nhà, theo dõi tiến độ học
              tập và lựa chọn nội dung phù hợp với từng độ tuổi của bé.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Khám phá
            </h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Chủ đề học tập
            </h2>
            <ul className="mt-5 space-y-3">
              {seoLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Phụ huynh
            </h2>
            <ul className="mt-5 space-y-3">
              {[...parentLinks, ...legalLinks].map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Liên hệ
            </h2>
            <div className="mt-5 space-y-4 text-sm text-white/90">
              <p className="flex gap-3">
                <Mail size={18} className="mt-1 shrink-0 text-white/90" />
                <span>
                  Email hỗ trợ:<br />
                  <a href="mailto:support@behayhoc.com" className="font-semibold text-white transition hover:underline">
                    support@behayhoc.com
                  </a>
                </span>
              </p>
              <p className="flex gap-3">
                <Phone size={18} className="mt-1 shrink-0 text-white/90" />
                <span>
                  Hotline:<br />
                  <a href="tel:0123456789" className="font-semibold text-white transition hover:underline">
                    0123 456 789
                  </a>
                </span>
              </p>
              <p className="flex gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-white/90" />
                <span>
                  Website:<br />
                  <a href="https://behayhoc.com" className="font-semibold text-white transition hover:underline">
                    behayhoc.com
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6">
          <div className="flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Bé Hay Học. Nền tảng học tập và trò chơi giáo dục cho bé.</p>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/lien-he" className="transition hover:text-white">Liên hệ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
