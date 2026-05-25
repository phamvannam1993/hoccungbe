'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

type NavItem = { href: string; label: string; children?: NavItem[] };

const NAV_MENU: NavItem[] = [
  { href: '/', label: 'TRANG CHỦ' },
  {
    href: '/khoa-hoc', label: 'KHÓA HỌC',
    children: [
      { href: '/khoa-hoc', label: 'Tất cả khóa học' },
      { href: '/khoa-hoc?type=math', label: 'Toán học' },
      { href: '/khoa-hoc?type=language', label: 'Ngôn ngữ' },
    ],
  },
  { href: '/tro-choi', label: 'KHO TRÒ CHƠI' },
  { href: '/tien-do', label: 'THI ĐẤU' },
  { href: '/de-thi', label: 'ÔN THI' },
  { href: '/bai-viet', label: 'GÓC PHỤ HUYNH' },
  { href: '/ho-tro', label: 'HỖ TRỢ' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('bhh_user');
    if (raw) { try { setUser(JSON.parse(raw)); } catch { /* ignore */ } }
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const handleLogout = () => {
    localStorage.removeItem('bhh_token');
    localStorage.removeItem('bhh_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-[#6ec6c6]">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2 gap-3">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/assets/images/logo.png" alt="Bé Hay Học" width={180} height={65} className="object-contain mix-blend-multiply h-10 w-auto sm:h-14" unoptimized />
        </Link>

        {/* Desktop: utility links + auth */}
        <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-3 text-xs text-gray-700">
            <Link href="/ho-tro" className="hover:underline whitespace-nowrap">Câu hỏi thường gặp</Link>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm font-semibold text-gray-700 max-w-[140px] truncate">👋 {user.fullName}</span>
                <button onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/dang-nhap"
                  className="px-5 py-1.5 rounded-full bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition shadow">
                  Đăng nhập
                </Link>
                <Link href="/dang-ky"
                  className="px-5 py-1.5 rounded-full bg-[#e67e22] text-white text-sm font-bold hover:bg-[#ca6f1e] transition shadow">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <>
              <Link href="/dang-nhap" className="px-3 py-1 rounded-full bg-[#c0392b] text-white text-xs font-bold whitespace-nowrap">Đăng nhập</Link>
              <Link href="/dang-ky" className="px-3 py-1 rounded-full bg-[#e67e22] text-white text-xs font-bold whitespace-nowrap">Đăng ký</Link>
            </>
          )}
          {user && (
            <button onClick={handleLogout} className="px-3 py-1 rounded-full bg-[#c0392b] text-white text-xs font-bold whitespace-nowrap">Đăng xuất</button>
          )}
          <button
            className="p-2 rounded-lg text-gray-700 hover:bg-white/20"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop Nav bar */}
      <div className="hidden md:block" ref={navRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <nav className="bg-[#c0392b] rounded-full px-2 py-1 flex items-center justify-center gap-1">
            {NAV_MENU.map((item) => {
              const isActive = pathname === item.href;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenu === item.href;

              return (
                <div key={item.href} className="relative">
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        setOpenMenu(isOpen ? null : item.href);
                      } else {
                        window.location.href = item.href;
                      }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition
                      ${isActive ? 'bg-white/20' : 'hover:bg-white/15'}`}
                  >
                    <NavIcon label={item.label} />
                    {item.label}
                    {hasChildren && (
                      <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {hasChildren && isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-44 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50">
                      {item.children!.map((child) => (
                        <Link key={child.href} href={child.href}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#c0392b]">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-white/20 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            {NAV_MENU.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2
                  ${pathname === item.href ? 'bg-[#c0392b] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <NavIcon label={item.label} />
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 flex gap-2 text-xs text-gray-500">
              <Link href="/ho-tro" className="hover:underline">Câu hỏi thường gặp</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavIcon({ label }: { label: string }) {
  if (label.includes('TRANG')) return <span className="text-base">🏠</span>;
  if (label.includes('KHÓA')) return <span className="text-base">📚</span>;
  if (label.includes('KHO')) return <span className="text-base">🎮</span>;
  if (label.includes('THI ĐẤU')) return <span className="text-base">🏆</span>;
  if (label.includes('ÔN')) return <span className="text-base">📝</span>;
  if (label.includes('GÓC')) return <span className="text-base">👨‍👩‍👧</span>;
  if (label.includes('HỖ')) return <span className="text-base">🎧</span>;
  return null;
}
