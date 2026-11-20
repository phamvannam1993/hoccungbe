'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Download, Heart, LogOut, Mail, MessageCircle, Search, ThumbsUp, X } from 'lucide-react';
import { CONTACT, zaloLink } from '../../lib/contact';
import { INSTALL_EVENT } from '../../lib/pwa';
import FramedAvatar from './FramedAvatar';
import { ACCOUNT_LINKS, NAV_MENU, PARENT_LINKS, useAccount } from './navData';
import { ALL_GRADES, gradeHref, gradeShort } from '../../lib/catalog';
import { useLopCuaBe } from '../../lib/lopCuaBe';

// Trang "Menu" trên điện thoại (mở từ nút ba gạch trên header), dựng theo tab Menu của app Facebook: nền xám nhạt, thẻ hồ sơ
// ở đầu, lưới lối tắt 2 cột, rồi các nhóm xổ xuống cho danh sách dài. Thay cho menu ba gạch cũ
// (một cột link dài, mục con chữ nhỏ khó bấm).

/** Lối tắt: các trang gom chính của menu mới. Màu nền = token theo môn (globals.css). */
const TILES = [
  { href: '/hoc-toan', emoji: '🔢', bg: 'var(--mon-toan-soft)', label: 'Toán' },
  { href: '/tieng-viet', emoji: '📖', bg: 'var(--mon-tv-soft)', label: 'Tiếng Việt' },
  { href: '/tu-vung-tieng-anh', emoji: '🌍', bg: 'var(--mon-ta-soft)', label: 'Tiếng Anh' },
  { href: '/de-thi', emoji: '📝', bg: 'var(--mon-thi-soft)', label: 'Đề thi' },
  { href: '/tro-choi', emoji: '🎮', bg: 'var(--mon-choi-soft)', label: 'Trò chơi' },
  { href: '/san-choi-tri-tue', emoji: '🏆', bg: 'var(--mon-tu-duy-soft)', label: 'Sân chơi Trí tuệ' },
  { href: '/tai-lieu-in', emoji: '🖨️', bg: 'var(--mon-in-soft)', label: 'Tài liệu in' },
  { href: '/khoa-hoc-iq', emoji: '💡', bg: 'var(--hue-purple-soft)', label: 'Toán IQ' },
];

const subscribeNoop = () => () => {};
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

type Section = { id: string; emoji: string; label: string; links: { href: string; label: string }[] };

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <Sheet onClose={onClose} />;
}

function Sheet({ onClose }: { onClose: () => void }) {
  const { user, guestChild, logout } = useAccount();
  const [lop] = useLopCuaBe();
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

  const sections: Section[] = [
    ...(hasAccount
      ? [{ id: 'cua-be', emoji: '🧒', label: 'Của bé', links: ACCOUNT_LINKS.map((l) => ({ href: l.href, label: `${l.emoji} ${l.label}` })) }]
      : []),
    { id: 'phu-huynh', emoji: '👨‍👩‍👧', label: 'Góc phụ huynh', links: PARENT_LINKS.map((l) => ({ href: l.href, label: `${l.emoji} ${l.label}` })) },
    ...NAV_MENU.filter((i) => i.id !== 'lop').flatMap((i) =>
      (i.groups ?? []).map((g) => ({
        id: `${i.id}-${g.title}`,
        emoji: g.emoji ?? i.emoji,
        label: g.title,
        links: g.links.map((l) => ({ href: l.href, label: `${l.emoji ? `${l.emoji} ` : ''}${l.label}` })),
      })),
    ),
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
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
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

        {/* Lớp của bé */}
        <h3 className="mb-2 mt-5 text-[15px] font-black text-slate-600">Lớp của bé</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {ALL_GRADES.map((g) => (
            <Link key={g} href={gradeHref(g)} aria-label={g === 0 ? 'Mẫu giáo' : `Lớp ${g}`}
              className={`kid-display grid h-12 place-items-center rounded-2xl text-base font-black shadow-sm ring-1 ring-black/5 ${lop === g ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 active:bg-pink-50'}`}>
              {gradeShort(g)}
            </Link>
          ))}
        </div>

        {/* Lối tắt */}
        <h3 className="mb-2 mt-5 text-[15px] font-black text-slate-600">Lối tắt</h3>
        <div className="grid grid-cols-2 gap-2">
          {hasAccount && <Tile href="/hoc-hom-nay" emoji="📅" bg="#ffedd5" label="Học hôm nay" />}
          {hasAccount && <Tile href="/bao-cao" emoji="📊" bg="#cffafe" label="Báo cáo tuần" />}
          {TILES.map((t) => (
            <Tile key={t.href} {...t} />
          ))}
        </div>

        {/* Hỗ trợ & liên hệ — trước đây là cụm nút nổi góc phải (FloatingActions), trên điện thoại cụm đó che
            nội dung và thanh tab nên chuyển hẳn vào đây. */}
        <h3 className="mb-2 mt-5 text-[15px] font-black text-slate-600">Hỗ trợ & liên hệ</h3>
        <HoTro onClose={onClose} />

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

function HoTro({ onClose }: { onClose: () => void }) {
  // Đã cài app (mở từ màn hình chính) thì không cần nút Cài App. Server luôn coi là chưa cài.
  const installed = useSyncExternalStore(subscribeNoop, isStandalone, () => false);
  const row = 'flex min-w-0 items-center gap-2.5 rounded-2xl bg-white p-2.5 text-left shadow-sm ring-1 ring-black/5 active:bg-slate-50';
  const chip = 'grid h-9 w-9 shrink-0 place-items-center rounded-full';
  const txt = 'min-w-0 truncate text-[14px] font-bold text-slate-800';
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href={CONTACT.donatePath} className={`${row} bg-gradient-to-r from-amber-400 to-orange-500 ring-orange-300/60`}>
        <span className={`${chip} bg-white/25 text-white`}><Heart size={18} className="fill-white" /></span>
        <span className="min-w-0 truncate text-[14px] font-bold text-white">Ủng hộ</span>
      </Link>
      {!installed && (
        <button
          type="button"
          className={row}
          // Đóng menu trước: lúc menu mở, banner cài app bị ẩn (body[data-menu-open]).
          onClick={() => {
            onClose();
            setTimeout(() => window.dispatchEvent(new Event(INSTALL_EVENT)), 0);
          }}
        >
          <span className={`${chip} bg-sky-50 text-sky-600`}><Download size={18} /></span>
          <span className={txt}>Cài App</span>
        </button>
      )}
      <Link href={CONTACT.guidePath} className={row}>
        <span className={`${chip} bg-violet-50 text-violet-600`}><BookOpen size={18} /></span>
        <span className={txt}>Hướng dẫn</span>
      </Link>
      <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className={row}>
        <span className={`${chip} bg-blue-600 text-[11px] font-black text-white`}>Zalo</span>
        <span className={txt}>Chat Zalo</span>
      </a>
      <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" className={row}>
        <span className={`${chip} bg-sky-50 text-sky-600`}><MessageCircle size={18} /></span>
        <span className={txt}>Messenger</span>
      </a>
      <a href={CONTACT.facebookPage} target="_blank" rel="noopener noreferrer" className={row}>
        <span className={`${chip} bg-indigo-50 text-indigo-600`}><ThumbsUp size={18} /></span>
        <span className={txt}>Fanpage</span>
      </a>
      <Link href={CONTACT.supportPath} className={row}>
        <span className={`${chip} bg-teal-50 text-teal-600`}><Mail size={18} /></span>
        <span className={txt}>Gửi liên hệ</span>
      </Link>
    </div>
  );
}
