'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { isGuest, listChildren } from '../../lib/childData';

type NavItem = { href: string; label: string; children?: NavItem[]; mega?: 'grades' };

const GRADES = [1, 2, 3, 4, 5] as const;
const SUBJECTS = [
  { slug: 'toan', label: 'Toán', emoji: '🔢', color: '#FF6B9D' },
  { slug: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖', color: '#4ECDC4' },
];

const NAV_MENU: NavItem[] = [
  { href: '/', label: 'TRANG CHỦ' },
  { href: '/khoa-hoc', label: 'LỚP HỌC', mega: 'grades' },
  { href: '/tro-choi', label: 'KHO TRÒ CHƠI' },
  // { href: '/tien-do', label: 'THI ĐẤU' },  // tạm ẩn
  { href: '/de-thi', label: 'ÔN THI' },
  { href: '/tai-lieu', label: 'KHO TÀI LIỆU' },
  { href: '/bai-viet', label: 'GÓC PHỤ HUYNH' },
  { href: '/ho-tro', label: 'HỖ TRỢ' },
];

// Khu vực phụ huynh — chỉ hiện khi đã đăng nhập.
const ACCOUNT_LINKS = [
  { href: '/dashboard', label: 'Bảng theo dõi', emoji: '📊' },
  { href: '/tien-do', label: 'Tiến độ học tập', emoji: '📈' },
  { href: '/ho-so-be', label: 'Hồ sơ bé', emoji: '👶' },
  { href: '/on-tap-cau-sai', label: 'Ôn câu sai', emoji: '🔁' },
  { href: '/chung-nhan', label: 'Chứng nhận', emoji: '🏆' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  // Khách (chưa đăng nhập) nhưng đã tạo bé → tên bé để mở menu phụ huynh.
  const [guestChild, setGuestChild] = useState<string | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  // Map: "subject-grade" → actual course slug (vd "toan-1" → "toan-hoc-lop-1")
  const [courseSlugs, setCourseSlugs] = useState<Record<string, string>>({});
  const navRef = useRef<HTMLDivElement>(null);

  // Fetch courses thật để link đúng slug, tránh 404
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API}/api/courses`)
      .then((r) => r.ok ? r.json() : [])
      .then((courses: { slug: string; title: string }[]) => {
        const map: Record<string, string> = {};
        for (const c of courses) {
          const s = c.slug.toLowerCase();
          const m = s.match(/lop-?(\d)/);
          if (!m) continue;
          const grade = m[1];
          if (s.includes('toan')) map[`toan-${grade}`] = c.slug;
          else if (s.includes('tieng-viet')) map[`tieng-viet-${grade}`] = c.slug;
        }
        setCourseSlugs(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('bhh_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
      setGuestChild(null);
      return;
    }
    setUser(null);
    // Khách: nếu đã tạo bé (local) → hiện menu phụ huynh theo tên bé đang chọn.
    if (isGuest()) {
      listChildren()
        .then((arr) => {
          if (!arr.length) { setGuestChild(null); return; }
          const stored = Number(localStorage.getItem('bhh_child_id') || '0');
          const cur = arr.find((c) => c.id === stored) ?? arr[0];
          setGuestChild(cur.fullName);
        })
        .catch(() => setGuestChild(null));
    }
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    function handler(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [accountOpen]);

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
            {(user || guestChild) ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#c0392b] text-sm font-bold shadow hover:bg-gray-50 transition">
                  <span className="max-w-[140px] truncate">{user ? '👋' : '👶'} {user?.fullName ?? guestChild}</span>
                  <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 pb-1.5 pt-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">Khu vực phụ huynh</div>
                    {ACCOUNT_LINKS.map((l) => (
                      <Link key={l.href} href={l.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b] transition-colors">
                        <span className="text-base">{l.emoji}</span>
                        {l.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      {user ? (
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                          <span className="text-base">🚪</span>
                          Đăng xuất
                        </button>
                      ) : (
                        <Link href="/dang-nhap" onClick={() => setAccountOpen(false)}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#c0392b] hover:bg-[#fdecea] transition-colors">
                          <span className="text-base">🔑</span>
                          Đăng nhập để đồng bộ
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
          <nav className="relative bg-gradient-to-r from-[#d04a3a] via-[#c0392b] to-[#a93226] rounded-full px-2 py-1.5 flex items-center justify-center gap-1 shadow-[0_6px_20px_-6px_rgba(192,57,43,0.6)] ring-1 ring-white/10">
            {NAV_MENU.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const hasChildren = (item.children && item.children.length > 0) || item.mega === 'grades';
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
                    className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                      ${isActive
                        ? 'bg-white text-[#c0392b] shadow-md scale-[1.03]'
                        : 'text-white hover:bg-white/20 hover:scale-[1.05]'}`}
                  >
                    <span className="transition-transform group-hover:scale-110">
                      <NavIcon label={item.label} />
                    </span>
                    {item.label}
                    {hasChildren && (
                      <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {item.mega === 'grades' && isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[420px] rounded-2xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      <div className="flex">
                        {/* Cột trái — danh sách lớp */}
                        <div className="w-[140px] bg-gray-50 border-r border-gray-100 py-2">
                          {GRADES.map((g) => (
                            <button
                              key={g}
                              onMouseEnter={() => setActiveGrade(g)}
                              onClick={() => setActiveGrade(g)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-left transition-colors
                                ${activeGrade === g
                                  ? 'bg-white text-[#c0392b] border-r-2 border-[#c0392b]'
                                  : 'text-gray-700 hover:bg-white hover:text-[#c0392b]'}`}
                            >
                              <span className="text-base">🎒</span>
                              Lớp {g}
                            </button>
                          ))}
                        </div>
                        {/* Cột phải — môn học của lớp đang chọn */}
                        <div className="flex-1 py-2">
                          <div className="px-4 pt-1 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                            Môn học – Lớp {activeGrade}
                          </div>
                          {SUBJECTS.map((s) => {
                            const realSlug = courseSlugs[`${s.slug}-${activeGrade}`];
                            const disabled = !realSlug;
                            return (
                              <Link
                                key={s.slug}
                                href={realSlug ? `/khoa-hoc/${realSlug}` : '/khoa-hoc'}
                                onClick={(e) => {
                                  if (disabled) e.preventDefault();
                                  setOpenMenu(null);
                                }}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                                  disabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b]'
                                }`}
                              >
                                <span
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                                  style={{ background: `${s.color}22`, opacity: disabled ? 0.4 : 1 }}
                                >
                                  {s.emoji}
                                </span>
                                <span>{s.label} lớp {activeGrade}</span>
                                {disabled && <span className="text-[10px] text-gray-400 ml-auto">Sắp có</span>}
                              </Link>
                            );
                          })}
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <Link
                              href="/khoa-hoc"
                              onClick={() => setOpenMenu(null)}
                              className="block px-4 py-2 text-xs font-medium text-[#c0392b] hover:bg-[#fdecea] transition-colors"
                            >
                              → Xem tất cả khóa học
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {item.children && isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-52 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          onClick={() => setOpenMenu(null)}
                          className="relative block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b] transition-colors">
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
              <div key={item.href}>
                <Link href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2
                    ${pathname === item.href ? 'bg-[#c0392b] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <NavIcon label={item.label} />
                  {item.label}
                </Link>
                {item.mega === 'grades' && (
                  <div className="ml-6 mt-1 mb-2 grid grid-cols-2 gap-1">
                    {GRADES.flatMap((g) => SUBJECTS.map((s) => {
                      const realSlug = courseSlugs[`${s.slug}-${g}`];
                      if (!realSlug) return null;
                      return (
                        <Link
                          key={`${g}-${s.slug}`}
                          href={`/khoa-hoc/${realSlug}`}
                          onClick={() => setMobileOpen(false)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-[#c0392b] hover:bg-[#fdecea] rounded"
                        >
                          {s.emoji} {s.label} L{g}
                        </Link>
                      );
                    }))}
                  </div>
                )}
              </div>
            ))}
            {(user || guestChild) && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="px-4 pb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Khu vực phụ huynh{!user && guestChild ? ` · 👶 ${guestChild}` : ''}
                </div>
                {ACCOUNT_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 text-gray-700 hover:bg-gray-100">
                    <span className="text-base">{l.emoji}</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
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
  if (label.includes('LỚP')) return <span className="text-base">📚</span>;
  if (label.includes('TRÒ CHƠI')) return <span className="text-base">🎮</span>;
  if (label.includes('THI ĐẤU')) return <span className="text-base">🏆</span>;
  if (label.includes('ÔN')) return <span className="text-base">📝</span>;
  if (label.includes('TÀI LIỆU')) return <span className="text-base">📄</span>;
  if (label.includes('GÓC')) return <span className="text-base">👨‍👩‍👧</span>;
  if (label.includes('HỖ')) return <span className="text-base">🎧</span>;
  return null;
}
