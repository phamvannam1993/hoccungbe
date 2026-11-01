'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, LogOut, Search, X } from 'lucide-react';
import FramedAvatar from './FramedAvatar';
import { ACCOUNT_LINKS, GRADES, NAV_MENU, SUBJECTS, useAccount, useCourseSlugs } from './navData';

// Trang "Menu" trên điện thoại (mở từ nút ba gạch trên header), dựng theo tab Menu của app Facebook: nền xám nhạt, thẻ hồ sơ
// ở đầu, lưới lối tắt 2 cột, rồi các nhóm xổ xuống cho danh sách dài. Thay cho menu ba gạch cũ
// (một cột link dài, mục con chữ nhỏ khó bấm).

/** Biểu tượng + màu nền cho từng ô lối tắt, theo href của mục cấp 1 trong NAV_MENU. */
const TILE: Record<string, { emoji: string; bg: string; label?: string }> = {
  '/khoa-hoc': { emoji: '📚', bg: '#e0f2fe' },
  '/hoc-toan': { emoji: '🔢', bg: '#ffe4e6', label: 'Công cụ Toán' },
  '/khoa-hoc-iq': { emoji: '🧠', bg: '#ede9fe' },
  '/tro-choi': { emoji: '🎮', bg: '#fce7f3', label: 'Trò chơi' },
  '/tu-vung-tieng-anh': { emoji: '🔤', bg: '#dcfce7' },
  '/thi-tai': { emoji: '🏆', bg: '#fef3c7' },
  '/de-thi': { emoji: '📝', bg: '#e0e7ff' },
  '/luyen-viet-chu-dep': { emoji: '✍️', bg: '#fef9c3' },
  '/gioi-thieu': { emoji: '🌈', bg: '#fce7f3' },
};

type Section = { id: string; emoji: string; label: string; links: { href: string; label: string }[] };

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <Sheet onClose={onClose} />;
}

function Sheet({ onClose }: { onClose: () => void }) {
  const { user, guestChild, logout } = useAccount();
  const courseSlugs = useCourseSlugs();
  const [expanded, setExpanded] = useState<string[]>([]);
  const hasAccount = Boolean(user || guestChild);
  const name = user?.fullName ?? guestChild?.nickname ?? guestChild?.fullName ?? '';

  // Khoá cuộn trang phía sau, đánh dấu body để ẩn banner cài app; Esc để đóng.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.menuOpen = '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.menuOpen;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const tiles = NAV_MENU.filter((i) => TILE[i.href]);
  const gradeLinks = GRADES.flatMap((g) =>
    SUBJECTS.flatMap((s) => {
      const slug = courseSlugs[`${s.slug}-${g}`];
      return slug ? [{ href: `/khoa-hoc/${slug}`, label: `${s.emoji} ${s.label} lớp ${g}` }] : [];
    }),
  );
  const sections: Section[] = [
    ...(hasAccount
      ? [{ id: 'phu-huynh', emoji: '👨‍👩‍👧', label: 'Khu vực phụ huynh', links: ACCOUNT_LINKS.map((l) => ({ href: l.href, label: `${l.emoji} ${l.label}` })) }]
      : []),
    ...(gradeLinks.length ? [{ id: 'lop', emoji: '🎒', label: 'Học theo lớp', links: gradeLinks }] : []),
    ...NAV_MENU.filter((i) => i.children?.length).map((i) => ({
      id: i.href,
      emoji: TILE[i.href]?.emoji ?? '📌',
      label: TILE[i.href]?.label ?? i.label,
      links: i.children!,
    })),
    {
      id: 'ho-tro',
      emoji: '❓',
      label: 'Trợ giúp & hỗ trợ',
      links: [
        { href: '/ho-tro', label: '💬 Câu hỏi thường gặp' },
        { href: '/ung-ho', label: '☕ Ủng hộ dự án' },
      ],
    },
  ];
  const toggle = (id: string) => setExpanded((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      // z-[55]: phủ cả thanh tab dưới, nút nổi và linh vật (z-40).
      className="fixed inset-0 z-[55] overflow-y-auto overscroll-contain bg-[#f0f2f5] animate-[menu-sheet-in_.18s_ease-out] lg:hidden"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      // Bấm vào bất kỳ link nào là đóng — kể cả link tới đúng trang đang xem (pathname không đổi).
      onClick={(e) => (e.target as HTMLElement).closest('a') && onClose()}
    >
      <div className="mx-auto max-w-lg px-4">
        <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between bg-[#f0f2f5]/95 px-4 pb-2 pt-3 backdrop-blur">
          <h2 className="text-2xl font-black text-slate-900">Menu</h2>
          <button type="button" onClick={onClose} aria-label="Đóng menu" className="grid h-9 w-9 place-items-center rounded-full bg-slate-200/80 text-slate-700 active:bg-slate-300">
            <X size={20} />
          </button>
        </div>

        <form action="/tim-kiem" className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input name="q" placeholder="Tìm bài học, trò chơi…" aria-label="Tìm kiếm" className="w-full min-w-0 bg-transparent text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400" />
        </form>

        {/* Thẻ hồ sơ */}
        {hasAccount ? (
          <Link href="/ho-so-be" className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 active:bg-slate-50">
            {user ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-xl">👋</span>
            ) : (
              <FramedAvatar child={guestChild ?? undefined} className="h-11 w-11 shrink-0" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-black text-slate-900">{name}</span>
              <span className="block text-sm font-semibold text-slate-500">Xem hồ sơ bé</span>
            </span>
            <ChevronRight size={20} className="shrink-0 text-slate-400" />
          </Link>
        ) : (
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <p className="font-black text-slate-900">Lưu tiến độ học của bé</p>
            <p className="mt-0.5 text-sm font-medium text-slate-500">Đăng nhập để xem báo cáo và học tiếp trên mọi máy.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/dang-nhap" className="rounded-xl bg-[#2563eb] py-2.5 text-center text-sm font-bold text-white active:brightness-95">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="rounded-xl bg-slate-100 py-2.5 text-center text-sm font-bold text-slate-800 active:bg-slate-200">
                Đăng ký
              </Link>
            </div>
          </div>
        )}

        {/* Lối tắt */}
        <h3 className="mb-2 mt-5 text-[15px] font-black text-slate-600">Lối tắt</h3>
        <div className="grid grid-cols-2 gap-2">
          {hasAccount && <Tile href="/hoc-hom-nay" emoji="📅" bg="#ffedd5" label="Học hôm nay" />}
          {hasAccount && <Tile href="/bao-cao" emoji="📊" bg="#cffafe" label="Báo cáo tuần" />}
          {tiles.map((i) => (
            <Tile key={i.href} href={i.href} emoji={TILE[i.href].emoji} bg={TILE[i.href].bg} label={TILE[i.href].label ?? i.label} />
          ))}
        </div>

        {/* Nhóm xổ xuống */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          {sections.map((s, idx) => {
            const isOpen = expanded.includes(s.id);
            return (
              <div key={s.id} className={idx ? 'border-t border-slate-100' : ''}>
                <button
                  type="button"
                  data-menu-section
                  onClick={() => toggle(s.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-lg">{s.emoji}</span>
                  <span className="flex-1 text-[15px] font-bold text-slate-800">{s.label}</span>
                  <ChevronDown size={20} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <ul className="grid grid-cols-1 gap-1 px-3 pb-3 min-[400px]:grid-cols-2">
                    {s.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="block rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {user ? (
          <button type="button" onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-200/80 py-3 text-[15px] font-bold text-slate-800 active:bg-slate-300">
            <LogOut size={18} /> Đăng xuất
          </button>
        ) : guestChild ? (
          <Link href="/dang-nhap" className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-200/80 py-3 text-[15px] font-bold text-slate-800 active:bg-slate-300">
            🔑 Đăng nhập để đồng bộ
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Tile({ href, emoji, bg, label }: { href: string; emoji: string; bg: string; label: string }) {
  return (
    <Link href={href} className="flex min-h-[76px] flex-col justify-between gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 active:bg-slate-50">
      <span className="grid h-9 w-9 place-items-center rounded-xl text-xl" style={{ background: bg }}>
        {emoji}
      </span>
      <span className="text-[15px] font-bold leading-tight text-slate-800">{label}</span>
    </Link>
  );
}
