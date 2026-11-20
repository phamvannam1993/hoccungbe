'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ChevronDown, Coffee, Menu, X } from 'lucide-react';
import { ACCOUNT_LINKS, NAV_MENU, PARENT_LINKS, useAccount, type NavItem } from './navData';
import FramedAvatar from './FramedAvatar';
import NotificationBell from './NotificationBell';
import HeaderStreak from './HeaderStreak';
import StarWallet from './StarWallet';

export default function SiteHeader({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, guestChild, logout: handleLogout } = useAccount();
  const accountRef = useRef<HTMLDivElement>(null);
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
          <nav aria-label="Menu chính" className="relative flex min-w-0 flex-nowrap items-center gap-0.5">
            {NAV_MENU.map((item) => (
              <NavEntry
                key={item.id}
                item={item}
                pathname={pathname}
                open={openMenu === item.id}
                setOpen={(v) => setOpenMenu(v ? item.id : null)}
              />
            ))}

            {/* CTA Ủng hộ — nổi bật, tách khỏi các mục menu thường. Dưới 1400px đã có nút nổi Ủng hộ ở góc, ẩn ở đây để ví sao không đè lên. */}
            <Link
              href="/ung-ho"
              className="ml-1 hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-[12px] font-bold text-white shadow-sm transition-all duration-200 hover:brightness-105 min-[1400px]:flex"
            >
              <Coffee size={15} />
              Ủng hộ
            </Link>
          </nav>

          {/* Ô tìm kiếm — bản thiết kế có, và đây cũng là lối tắt duy nhất cho
              người đã biết mình cần gì, khỏi phải lần theo menu. */}
          {/* Bề ngang CỐ ĐỊNH và shrink-0. Để nó co giãn thì khi menu dài, ô bị
              bóp còn mấy chục pixel — chỉ đọc được chữ "Tì" và cái kính lúp. */}
          {/* Ô tìm kiếm chỉ hiện ở màn thật rộng (≥1680px; ở 1536px menu có Tập viết, Giới thiệu đè lên ô này). Từ khi menu có thêm
              nhóm "Toán", ở 1280px thanh menu chạm vào ô này và chữ đè lên nhau. */}
          <form action="/tim-kiem" className="ml-auto hidden w-[190px] shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3.5 py-2 min-[1600px]:flex">
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
            {/* 1024–1279px: thanh menu đã chiếm hết bề ngang, ví sao đè lên mục cuối → chỉ hiện từ 1280px. */}
            <div className="hidden items-center gap-2 xl:flex">
              <HeaderStreak />
              <StarWallet />
            </div>
            <NotificationBell />
            {(user || guestChild) ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#c0392b] text-sm font-bold shadow hover:bg-gray-50 transition">
                  {user ? <span className="text-base">👋</span> : <FramedAvatar child={guestChild} className="h-6 w-6" />}
                  <span className="max-w-[140px] truncate">{user?.fullName ?? guestChild?.fullName}</span>
                  <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 max-h-[min(80vh,640px)] w-64 overflow-y-auto rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onKeyDown={(e) => { if (e.key === 'Escape') setAccountOpen(false); }}>
                    <div className="px-4 pb-1.5 pt-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">Của bé</div>
                    {ACCOUNT_LINKS.map((l) => (
                      <Link key={l.href} href={l.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b] transition-colors">
                        <span className="text-base" aria-hidden>{l.emoji}</span>
                        {l.label}
                      </Link>
                    ))}
                    <div className="mt-1 border-t border-gray-100 px-4 pb-1.5 pt-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">Góc phụ huynh</div>
                    {PARENT_LINKS.map((l) => (
                      <Link key={l.href} href={l.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b] transition-colors">
                        <span className="text-base" aria-hidden>{l.emoji}</span>
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

/** Một mục menu cấp 1: link thẳng (Tài liệu in) hoặc nút mở bảng xổ xuống nhiều nhóm. Bàn phím: Enter/Space/↓
 *  mở và vào link đầu, ↑↓ đi giữa các link, Esc đóng và trả focus về nút, Tab ra ngoài là tự đóng. */
function NavEntry({ item, pathname, open, setOpen }: { item: NavItem; pathname: string; open: boolean; setOpen: (v: boolean) => void }) {
  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hrefs = item.groups?.flatMap((g) => [g.href, ...g.links.map((l) => l.href)]).filter(Boolean) as string[] | undefined;
  const isActive = (hrefs ?? [item.href]).some((h) => {
    const path = h.split(/[?#]/)[0];
    return path !== '/' && (pathname === path || pathname.startsWith(`${path}/`));
  });
  const base = `group relative flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-2 text-[14px] font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2563eb] ${
    isActive || open ? 'text-[#2563eb]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`;

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('[data-autofocus="1"]')?.focus();
  }, [open]);

  if (!item.groups) {
    return (
      <Link href={item.href} className={`${base} shrink-0`} aria-current={isActive ? 'page' : undefined}>
        <span aria-hidden className="text-base">{item.emoji}</span>
        {item.label}
      </Link>
    );
  }

  const links = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
  const onPanelKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const all = links();
    const i = all.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : e.key === 'ArrowDown' ? (i + 1) % all.length : (i - 1 + all.length) % all.length;
    all[next]?.focus();
  };
  const cols = item.groups.length;
  const width = item.id === 'mon' ? 'w-[min(760px,calc(100vw-2rem))]' : item.id === 'lop' ? 'w-[380px]' : cols > 1 ? 'w-[480px]' : 'w-64';
  const pos = item.align === 'end' ? 'right-0' : 'left-0';
  // 'nav': bảng neo vào thanh menu (div cha có position: relative) thay vì vào mục.
  const wrapperRel = item.align === 'nav' ? '' : 'relative';

  return (
    <div
      className={`${wrapperRel} shrink-0`}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (open) links()[0]?.focus();
            else setOpen(true);
          } else if (e.key === 'Escape') setOpen(false);
        }}
        className={base}
      >
        <span aria-hidden className="text-base">{item.emoji}</span>
        {item.label}
        <ChevronDown size={13} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          onKeyDown={onPanelKey}
          className={`absolute ${pos} top-full z-50 mt-2 ${width} rounded-2xl border border-gray-100 bg-white p-3 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150`}
        >
          <div className={`grid gap-3 ${item.id === 'mon' ? 'grid-cols-3' : cols > 1 ? 'grid-cols-2' : ''}`}>
            {item.groups.map((g, gi) => (
              <div key={g.title} className="min-w-0">
                <p className="px-2 pb-1 text-[11px] font-black uppercase tracking-wide text-slate-400">
                  {g.href ? (
                    <Link href={g.href} onClick={() => setOpen(false)} className="hover:text-[#c0392b]">
                      {g.emoji ? `${g.emoji} ` : ''}{g.title}
                    </Link>
                  ) : (
                    g.title
                  )}
                </p>
                <ul className={item.id === 'lop' ? 'grid grid-cols-2 gap-1.5' : 'grid gap-0.5'}>
                  {g.links.map((l, li) => {
                    const auto = gi === 0 && li === 0;
                    return (
                      <li key={l.href + l.label}>
                        <Link
                          href={l.href}
                          data-autofocus={auto ? '1' : undefined}
                          onClick={() => setOpen(false)}
                          className={
                            item.id === 'lop'
                              ? 'flex items-center gap-2.5 rounded-xl border-2 border-pink-100 px-3 py-2.5 text-sm font-black text-slate-800 hover:border-pink-300 hover:bg-pink-50 focus-visible:border-pink-400 focus-visible:outline-none'
                              : 'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13.5px] font-semibold text-gray-700 hover:bg-[#fdecea] hover:text-[#c0392b] focus-visible:bg-[#fdecea] focus-visible:outline-none'
                          }
                        >
                          {l.emoji && <span aria-hidden className={item.id === 'lop' ? 'text-xl' : 'w-5 shrink-0 text-center'}>{l.emoji}</span>}
                          <span className="min-w-0">
                            <span className="block truncate">{l.label}</span>
                            {l.desc && <span className="block text-[11px] font-bold text-slate-400">{l.desc}</span>}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          {item.id === 'lop' && (
            <Link href="/hoc-hom-nay" onClick={() => setOpen(false)} className="mt-3 block rounded-xl bg-slate-50 px-3 py-2 text-center text-xs font-bold text-slate-600 hover:bg-slate-100">
              Chưa biết học gì? Xem việc học hôm nay →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
