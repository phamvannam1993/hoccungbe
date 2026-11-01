'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Coffee, Menu, X } from 'lucide-react';
import { ACCOUNT_LINKS, GRADES, NAV_MENU, SUBJECTS, useAccount, useCourseSlugs } from './navData';
import FramedAvatar from './FramedAvatar';
import NotificationBell from './NotificationBell';
import HeaderStreak from './HeaderStreak';
import StarWallet from './StarWallet';

export default function SiteHeader({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const { user, guestChild, logout: handleLogout } = useAccount();
  const accountRef = useRef<HTMLDivElement>(null);
  const courseSlugs = useCourseSlugs();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpenMenu(null);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    function handler(e: MouseEvent) {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
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
        {/* Menu ngang chỉ bật từ 1024px. Ở 768px (iPad dựng đứng) menu đầy đủ
            cộng nhóm nút bên phải vượt quá bề ngang màn hình — đo được trang
            tràn tới 939px — nên dưới mốc đó dùng nút ba gạch. */}
        <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex" ref={navRef}>
          {/* Nav chữ trên nền trắng thay cho thanh gradient đỏ: nhẹ mắt hơn, và
              để mục đang xem nổi lên bằng màu chứ không phải bằng khối nền đậm. */}
          <nav className="relative flex min-w-0 flex-nowrap items-center gap-0.5">
            {NAV_MENU.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const hasChildren = (item.children && item.children.length > 0) || item.mega === 'grades';
              const isOpen = openMenu === item.href;

              return (
                <div key={item.href} className={`relative shrink-0 ${item.wideOnly ? 'hidden xl:block' : ''}`}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        setOpenMenu(isOpen ? null : item.href);
                      } else {
                        window.location.href = item.href;
                      }
                    }}
                    className={`group relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-bold transition-all duration-200
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
              className="ml-1 hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-[12px] font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105 xl:flex"
            >
              <Coffee size={15} />
              Ủng hộ
            </Link>
          </nav>

          {/* Ô tìm kiếm — bản thiết kế có, và đây cũng là lối tắt duy nhất cho
              người đã biết mình cần gì, khỏi phải lần theo menu. */}
          {/* Bề ngang CỐ ĐỊNH và shrink-0. Để nó co giãn thì khi menu dài, ô bị
              bóp còn mấy chục pixel — chỉ đọc được chữ "Tì" và cái kính lúp. */}
          {/* Ô tìm kiếm chỉ hiện ở màn thật rộng (≥1536px). Từ khi menu có thêm
              nhóm "Toán", ở 1280px thanh menu chạm vào ô này và chữ đè lên nhau. */}
          <form action="/tim-kiem" className="ml-auto hidden w-[190px] shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 2xl:flex">
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
        <div className="hidden shrink-0 items-center lg:flex">
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
                {/* Ở 1024–1279px chỉ còn chỗ cho MỘT nút: giữ "Đăng ký" vì đó
                    là việc muốn người dùng làm; "Đăng nhập" vẫn có trong menu
                    ba gạch và ở chân trang. Đệm hai bên cũng hẹp lại một chút
                    để hàng nút không đẩy menu tràn ra ngoài. */}
                <Link href="/dang-nhap"
                  className="hidden rounded-full border-2 border-[#2563eb] px-4 py-1.5 text-sm font-bold text-[#2563eb] transition hover:bg-blue-50 xl:inline-flex">
                  Đăng nhập
                </Link>
                <Link href="/dang-ky"
                  className="rounded-full bg-[#2563eb] px-4 py-1.5 text-sm font-bold text-white shadow transition hover:bg-blue-700">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Điện thoại: kiểu thanh trên của app Facebook — huy hiệu, Đăng nhập, rồi nút Menu (ảnh đại diện
            kèm huy hiệu ba gạch nếu đã có tài khoản). Tài khoản, khu phụ huynh và mọi mục menu nằm trong
            trang Menu toàn màn hình (MobileMenu) thay cho danh sách dài xổ xuống trước đây. */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <HeaderStreak />
          <StarWallet />
          <NotificationBell compact />
          {!user && !guestChild && (
            <Link href="/dang-nhap" className="whitespace-nowrap rounded-full bg-[#2563eb] px-3.5 py-1.5 text-xs font-bold text-white">
              Đăng nhập
            </Link>
          )}
          <button
            type="button"
            data-menu-tab
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-800 transition active:scale-95 active:bg-slate-200"
          >
            {menuOpen ? (
              <X size={20} />
            ) : user || guestChild ? (
              <>
                {user ? (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-base">👋</span>
                ) : (
                  <FramedAvatar child={guestChild ?? undefined} className="h-9 w-9" />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-white text-slate-700 shadow ring-1 ring-slate-200">
                  <Menu size={10} strokeWidth={3} />
                </span>
              </>
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>
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
