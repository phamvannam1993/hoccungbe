'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X, Coffee } from 'lucide-react';
import { isGuest, listChildren, type Child } from '../../lib/childData';
import { ChildAvatar } from './KidIcon';
import FramedAvatar from './FramedAvatar';
import NotificationBell from './NotificationBell';
import HeaderStreak from './HeaderStreak';
import StarWallet from './StarWallet';

type NavItem = { href: string; label: string; children?: NavItem[]; mega?: 'grades' };

const GRADES = [1, 2, 3, 4, 5] as const;
const SUBJECTS = [
  { slug: 'toan', label: 'Toán', emoji: '🔢', color: '#FF6B9D' },
  { slug: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖', color: '#4ECDC4' },
];

const NAV_MENU: NavItem[] = [
  { href: '/', label: 'Trang chủ' },
  { href: '/khoa-hoc', label: 'Lớp học', mega: 'grades' },
  { href: '/tro-choi', label: 'Game' },
  {
    href: '/tu-vung-tieng-anh',
    label: 'Tiếng Anh',
    children: [
      { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề' },
      { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái A–Z' },
      { href: '/phonics-tieng-anh', label: 'Phonics – Ghép vần đọc' },
      { href: '/bang-phien-am-ipa', label: 'Bảng phiên âm IPA' },
      { href: '/sight-words-tieng-anh', label: 'Sight words – Từ thông dụng' },
      { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp' },
      { href: '/hoi-thoai-tieng-anh', label: 'Hội thoại tình huống' },
      { href: '/bai-hat-tieng-anh', label: 'Bài hát tiếng Anh' },
      { href: '/ngu-phap-tieng-anh', label: 'Ngữ pháp qua trò chơi' },
    ],
  },
  {
    // Gom các sân chơi thi đấu vào một nhóm — thêm mục cấp 1 nữa thì thanh menu
    // quá chật trên màn hình vừa.
    href: '/thi-tai',
    label: 'Thi tài',
    children: [
      { href: '/thi-tai', label: 'Thi Tài giành huy chương' },
      { href: '/trieu-phu-nhi', label: 'Ai Là Triệu Phú Nhí' },
      { href: '/kham-pha', label: 'Đố vui khám phá' },
    ],
  },
  { href: '/de-thi', label: 'Ôn thi' },
  // { href: '/tai-lieu', label: 'KHO TÀI LIỆU' },  // tạm ẩn
  { href: '/bai-viet', label: 'Blog' },
];

// Khu vực phụ huynh — chỉ hiện khi đã đăng nhập.
const ACCOUNT_LINKS = [
  { href: '/hoc-hom-nay', label: 'Học hôm nay', emoji: '📅' },
  { href: '/bo-suu-tap', label: 'Bộ sưu tập', emoji: '⭐' },
  { href: '/bao-cao', label: 'Báo cáo tuần', emoji: '📊' },
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
  // Khách (chưa đăng nhập) nhưng đã tạo bé → hồ sơ bé để mở menu phụ huynh.
  const [guestChild, setGuestChild] = useState<Child | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
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
          setGuestChild(cur);
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
      const t = e.target as Node;
      const inDesktop = accountRef.current?.contains(t);
      const inMobile = mobileAccountRef.current?.contains(t);
      if (!inDesktop && !inMobile) setAccountOpen(false);
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
    <header className="border-b border-slate-100 bg-white">
      {/* Top bar */}
      <div className="flex w-full items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          {/* mix-blend-multiply cắt nền trắng của file logo cho hoà vào nền header */}
          <Image src="/assets/images/logo.png" alt="Bé Hay Học" width={180} height={65} className="object-contain mix-blend-multiply h-10 w-auto sm:h-14" unoptimized />
        </Link>

        {/* Nav nằm CÙNG HÀNG với logo và nút đăng nhập, đúng bản thiết kế.
            Trước đây nav là một hàng riêng bên dưới, làm header cao gấp đôi. */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex" ref={navRef}>
          {/* Nav chữ trên nền trắng thay cho thanh gradient đỏ: nhẹ mắt hơn, và
              để mục đang xem nổi lên bằng màu chứ không phải bằng khối nền đậm. */}
          <nav className="relative flex min-w-0 flex-nowrap items-center gap-0.5">
            {NAV_MENU.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const hasChildren = (item.children && item.children.length > 0) || item.mega === 'grades';
              const isOpen = openMenu === item.href;

              return (
                <div key={item.href} className="relative shrink-0">
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        setOpenMenu(isOpen ? null : item.href);
                      } else {
                        window.location.href = item.href;
                      }
                    }}
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-bold transition-all duration-200
                      ${isActive
                        ? 'text-[#2563eb]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
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

            {/* CTA Ủng hộ — nổi bật, tách khỏi các mục menu thường */}
            <Link
              href="/ung-ho"
              className="ml-1 flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-[12px] font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105"
            >
              <Coffee size={15} />
              Ủng hộ
            </Link>
          </nav>

          {/* Ô tìm kiếm — bản thiết kế có, và đây cũng là lối tắt duy nhất cho
              người đã biết mình cần gì, khỏi phải lần theo menu. */}
          {/* Bề ngang CỐ ĐỊNH và shrink-0. Để nó co giãn thì khi menu dài, ô bị
              bóp còn mấy chục pixel — chỉ đọc được chữ "Tì" và cái kính lúp. */}
          <form action="/tim-kiem" className="ml-auto hidden w-[200px] shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 xl:flex">
            <input name="q" placeholder="Tìm kiếm bài học…" aria-label="Tìm kiếm bài học"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400" />
            <button type="submit" aria-label="Tìm" className="shrink-0 text-slate-500">🔍</button>
          </form>
        </div>

        {/* Phần bên phải — MỘT HÀNG NGANG.
            Trước đây xếp dọc: "Câu hỏi thường gặp" một dòng, hàng widget một
            dòng. Khi nav dồn về cùng hàng thì kiểu xếp dọc này đội lên trên và
            đè vào ô tìm kiếm. Liên kết "Câu hỏi thường gặp" đã có sẵn ở chân
            trang và trong menu Hỗ trợ nên bỏ khỏi đây, không mất đường vào. */}
        <div className="hidden shrink-0 items-center md:flex">
          <div className="flex items-center gap-2">
            <HeaderStreak />
            <StarWallet />
            <NotificationBell />
            {(user || guestChild) ? (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#c0392b] text-sm font-bold shadow hover:bg-gray-50 transition">
                  {user ? <span className="text-base">👋</span> : <FramedAvatar child={guestChild} className="h-6 w-6" />}
                  <span className="max-w-[140px] truncate">{user?.fullName ?? guestChild?.fullName}</span>
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
                  className="rounded-full border-2 border-[#2563eb] px-5 py-1.5 text-sm font-bold text-[#2563eb] transition hover:bg-blue-50">
                  Đăng nhập
                </Link>
                <Link href="/dang-ky"
                  className="rounded-full bg-[#2563eb] px-5 py-1.5 text-sm font-bold text-white shadow transition hover:bg-blue-700">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <HeaderStreak />
          <StarWallet />
          <NotificationBell compact />
          {(user || guestChild) ? (
            <div className="relative shrink-0" ref={mobileAccountRef}>
              {/*
                Trên điện thoại KHÔNG hiện tên. Hàng này đã có streak, ví sao và
                chuông thông báo chen nhau, nút bị ép lại nên tên dài bao nhiêu
                cũng cụt thành "B…" — nới max-width không cứu được vì flex vẫn
                co. Ảnh đại diện đã đủ nhận ra là bé nào, tên đầy đủ hiện trong
                menu khi bấm mở.
              */}
              <button
                onClick={() => setAccountOpen((v) => !v)}
                aria-label={`Tài khoản của ${user?.fullName ?? guestChild?.nickname ?? guestChild?.fullName ?? 'bé'}`}
                className="flex shrink-0 items-center gap-0.5 rounded-full bg-white py-1 pl-1 pr-1.5 shadow-md ring-1 ring-black/5"
              >
                {user ? (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdecea] text-sm">👋</span>
                ) : (
                  <FramedAvatar child={guestChild} className="h-7 w-7" />
                )}
                <ChevronDown size={13} className={`shrink-0 text-[#c0392b] transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Tên hiện ở đây thay cho chỗ trên nút — có đủ chỗ để không cắt. */}
                  <div className="flex items-center gap-2 px-4 pb-2 pt-1">
                    {user ? (
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fdecea] text-base">👋</span>
                    ) : (
                      <FramedAvatar child={guestChild} className="h-8 w-8" />
                    )}
                    <span className="min-w-0 truncate text-sm font-bold text-gray-800">
                      {user?.fullName ?? guestChild?.nickname ?? guestChild?.fullName}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 px-4 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">Khu vực phụ huynh</div>
                  {ACCOUNT_LINKS.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setAccountOpen(false)}
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
            <Link href="/dang-nhap" className="whitespace-nowrap rounded-full bg-[#2563eb] px-3 py-1 text-xs font-bold text-white">Đăng nhập</Link>
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


      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-white/20 shadow-lg">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
            {/* CTA Ủng hộ — nổi bật ở đầu menu mobile */}
            <Link
              href="/ung-ho"
              onClick={() => setMobileOpen(false)}
              className="mb-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
            >
              <Coffee size={16} /> Ủng hộ dự án
            </Link>
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
                {item.children && item.children.length > 0 && (
                  <div className="ml-6 mt-1 mb-2 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-[#c0392b] hover:bg-[#fdecea] rounded"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(user || guestChild) && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 px-4 pb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Khu vực phụ huynh
                  {!user && guestChild && <><span>·</span><ChildAvatar child={guestChild} className="h-4 w-4" /><span className="normal-case">{guestChild.fullName}</span></>}
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
  if (label.includes('ANH') || label.includes('VỰNG')) return <span className="text-base">🔤</span>;
  if (label.includes('THI ĐẤU')) return <span className="text-base">🏆</span>;
  if (label.includes('ÔN')) return <span className="text-base">📝</span>;
  if (label.includes('TÀI LIỆU')) return <span className="text-base">📄</span>;
  if (label.includes('GÓC')) return <span className="text-base">👨‍👩‍👧</span>;
  if (label.includes('HỖ')) return <span className="text-base">🎧</span>;
  return null;
}
