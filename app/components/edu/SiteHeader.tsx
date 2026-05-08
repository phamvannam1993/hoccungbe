'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainMenu = useMemo<NavItem[]>(
    () => [
      { href: '/', label: 'Trang chủ' },
      { href: '/courses', label: 'Khóa học' },
      { href: '/games', label: 'Kho trò chơi' },
      { href: '/progress', label: 'Tiến độ bé' },
    ],
    []
  );

  const moreMenu = useMemo<NavItem[]>(
    () => [
      { href: '/lesson', label: 'Chi tiết bài học' },
      { href: '/dashboard', label: 'Dashboard' },
      // { href: '/pricing', label: 'Bảng giá' },
      { href: '/support', label: 'Hỗ trợ' },
    ],
    []
  );

  const authMenu = useMemo<NavItem[]>(
    () => [
      { href: '/login', label: 'Đăng nhập' },
      { href: '/register', label: 'Đăng ký' },
    ],
    []
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isMoreActive = moreMenu.some((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-50 to-violet-50 px-4 py-2.5 ring-1 ring-sky-100 transition hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-sm">
            <BookOpen size={20} />
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
          <nav className="flex items-center gap-1">
            {mainMenu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="group relative">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isMoreActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Thêm
              </button>

              <div className="invisible absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {moreMenu.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mb-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
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
          className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="grid gap-2">
              {[...mainMenu, ...moreMenu, ...authMenu].map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}