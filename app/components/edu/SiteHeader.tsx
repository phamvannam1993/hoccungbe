'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, ChevronDown, Menu, X } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
};

const MAIN_MENU: readonly NavItem[] = [
  { href: '/', label: 'Trang chủ' },
  { href: '/courses', label: 'Khóa học' },
  { href: '/games', label: 'Kho trò chơi' },
  { href: '/progress', label: 'Tiến độ bé' },
];

const MORE_MENU: readonly NavItem[] = [
  { href: '/lesson', label: 'Chi tiết bài học' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/support', label: 'Hỗ trợ' },
];

const AUTH_MENU: readonly NavItem[] = [
  { href: '/login', label: 'Đăng nhập' },
  { href: '/register', label: 'Đăng ký' },
];

function NavLink({
  item,
  active,
  variant = 'primary',
  onClick,
}: {
  item: NavItem;
  active: boolean;
  variant?: 'primary' | 'dropdown' | 'mobile';
  onClick?: () => void;
}) {
  const base =
    variant === 'mobile'
      ? `rounded-xl px-4 py-3 text-left text-sm font-semibold ${
          active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
        }`
      : variant === 'dropdown'
      ? `block w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${
          active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
        }`
      : `rounded-full px-4 py-2 text-sm font-semibold transition ${
          active
            ? 'bg-sky-600 text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`;

  return (
    <Link href={item.href} onClick={onClick} className={base} aria-current={active ? 'page' : undefined}>
      {item.label}
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  const isMoreActive = MORE_MENU.some((item) => item.href === pathname);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMoreMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [moreMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-50 to-violet-50 px-4 py-2.5 ring-1 ring-sky-100 transition hover:shadow-md"
          aria-label="Học Cùng Bé - Trang chủ"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-sm">
            <BookOpen size={20} aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600">
              Nền tảng học tập
            </span>
            <span className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:text-xl">
              Học Cùng Bé
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1" aria-label="Menu chính">
            {MAIN_MENU.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}

            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreMenuOpen}
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isMoreActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Thêm
                <ChevronDown
                  size={14}
                  className={`transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {moreMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  {MORE_MENU.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={pathname === item.href}
                      variant="dropdown"
                      onClick={() => setMoreMenuOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-3 flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden" id="mobile-menu">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="grid gap-2" aria-label="Menu di động">
              {[...MAIN_MENU, ...MORE_MENU, ...AUTH_MENU].map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={pathname === item.href}
                  variant="mobile"
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
