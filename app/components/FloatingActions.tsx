'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BookOpen, Download, Heart, Mail, Phone } from 'lucide-react';
import { CONTACT, zaloLink } from '../lib/contact';
import { INSTALL_EVENT } from '../lib/pwa';

const subscribeNoop = () => () => {};
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

// Cùng kiểu với site: nút trắng bo tròn, viền mảnh, icon trong ô tròn màu nhạt; các nút rộng bằng nhau.
const pill =
  'group relative flex items-center gap-2.5 rounded-full bg-white p-1.5 text-slate-700 shadow-md ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[148px] sm:pr-4';
const iconChip = 'grid h-9 w-9 shrink-0 place-items-center rounded-full';
const label = 'hidden text-[14px] font-bold sm:inline';

/**
 * Cụm nút nổi góc phải: Ủng hộ · Cài App · Hướng dẫn · Liên hệ (mở bảng Zalo / Messenger / Fanpage / Form).
 * Trên điện thoại chỉ hiện biểu tượng tròn, đặt cao hơn thanh điều hướng dưới.
 */
export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  // Đã cài app (mở từ màn hình chính) thì không cần nút Cài App. Server luôn coi là chưa cài.
  const installed = useSyncExternalStore(subscribeNoop, isStandalone, () => false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="fixed bottom-24 right-3 z-40 flex flex-col items-end gap-2.5 lg:bottom-6 lg:right-5">
      {open && (
        <div
          role="dialog"
          aria-label="Liên hệ Bé Hay Học"
          className="mb-1 w-[290px] rounded-[26px] border border-slate-100 bg-white p-2.5 shadow-2xl"
        >
          <ContactRow href={zaloLink()} external icon={<ZaloIcon />} iconBg="bg-blue-50" title="Chat qua Zalo" sub={CONTACT.zaloDisplay} />
          <ContactRow href={CONTACT.messenger} external icon={<MessengerIcon />} iconBg="bg-sky-50" title="Chat Messenger" sub="Inbox trực tiếp Admin" />
          <ContactRow href={CONTACT.facebookPage} external icon={<FacebookIcon />} iconBg="bg-indigo-50" title="Fanpage Facebook" sub="Bé Hay Học" />
          <ContactRow
            href={CONTACT.supportPath}
            icon={<Mail className="h-6 w-6 text-teal-600" />}
            iconBg="bg-teal-50"
            title="Gửi form liên hệ"
            sub="Hỗ trợ giải đáp 24/7"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Ủng hộ: cùng màu cam với nút Ủng hộ trên header. */}
      <Link
        href={CONTACT.donatePath}
        className={`${pill} bg-gradient-to-r from-amber-400 to-orange-500 text-white ring-orange-300/60`}
        aria-label="Ủng hộ"
      >
        <span className={`${iconChip} bg-white/25`}>
          <Heart className="h-[18px] w-[18px] fill-white" />
        </span>
        <span className={label}>Ủng hộ</span>
      </Link>

      {!installed && (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(INSTALL_EVENT))}
          className={pill}
          aria-label="Cài App"
        >
          <span className={`${iconChip} bg-sky-50 text-sky-600`}>
            <Download className="h-[18px] w-[18px]" />
          </span>
          <span className={label}>Cài App</span>
          <span className="absolute -right-1 -top-2 rounded-full bg-[#FF6B9D] px-1.5 text-[9px] font-black leading-4 text-white shadow-sm ring-2 ring-white">
            APP
          </span>
        </button>
      )}

      <Link href={CONTACT.guidePath} className={pill} aria-label="Hướng dẫn">
        <span className={`${iconChip} bg-violet-50 text-violet-600`}>
          <BookOpen className="h-[18px] w-[18px]" />
        </span>
        <span className={label}>Hướng dẫn</span>
      </Link>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${pill} ${open ? 'ring-2 ring-[#2563eb]' : ''}`}
        aria-label="Liên hệ"
      >
        <span className={`${iconChip} bg-blue-600 text-white`}>
          <Phone className="h-[18px] w-[18px]" />
        </span>
        <span className={label}>Liên hệ</span>
      </button>
    </div>
  );
}

function ContactRow({
  href,
  external,
  icon,
  iconBg,
  title,
  sub,
  onClick,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  sub: string;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconBg}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[15px] font-extrabold text-slate-900">{title}</span>
        <span className="block truncate text-[13px] font-semibold text-slate-500">{sub}</span>
      </span>
    </>
  );
  const cls = 'flex items-center gap-3 rounded-2xl px-2.5 py-2.5 transition hover:bg-slate-50';
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={onClick}>
      {body}
    </Link>
  );
}

function ZaloIcon() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0068ff] text-[9px] font-black text-white" aria-hidden>
      Zalo
    </span>
  );
}

function MessengerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <path
        fill="#0a7cff"
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.98-.87a.8.8 0 0 1 .53-.04c.91.25 1.88.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Z"
      />
      <path fill="#fff" d="m6 15.53 2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63l-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#1877f2" />
      <path fill="#fff" d="M15.12 15.47 15.6 12.3h-3.04v-2.06c0-.87.42-1.71 1.79-1.71h1.38V5.83s-1.25-.21-2.45-.21c-2.5 0-4.13 1.51-4.13 4.26v2.42H6.37v3.17h2.78V23a11.1 11.1 0 0 0 3.41 0v-7.53h2.56Z" />
    </svg>
  );
}
