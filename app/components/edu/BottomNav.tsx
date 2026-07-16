'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Gamepad2, ClipboardList, CircleUser } from 'lucide-react';

// Thanh điều hướng dưới đáy — chỉ hiện trên mobile.
const ITEMS = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/khoa-hoc', label: 'Lớp học', icon: BookOpen },
  { href: '/tro-choi', label: 'Trò chơi', icon: Gamepad2, center: true },
  { href: '/de-thi', label: 'Ôn thi', icon: ClipboardList },
  { href: '/ho-so-be', label: 'Tài khoản', icon: CircleUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-pink-100 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Điều hướng chính"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-around px-2 pt-1.5 pb-1">
        {ITEMS.map(({ href, label, icon: Icon, center }) => {
          const active = isActive(href);

          // Nút Trò chơi nổi ở giữa
          if (center) {
            return (
              <li key={href} className="-mt-7">
                <Link href={href} className="flex flex-col items-center gap-1" aria-current={active ? 'page' : undefined}>
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white transition active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#FF6B9D,#ff4f8b)' }}
                  >
                    <Icon size={26} />
                  </span>
                  <span className={`text-[11px] font-bold ${active ? 'text-pink-500' : 'text-slate-500'}`}>{label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-0.5 py-1"
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={22} className={active ? 'text-pink-500' : 'text-slate-400'} />
                <span className={`text-[11px] font-bold ${active ? 'text-pink-500' : 'text-slate-500'}`}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
