'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, BookOpen, ClipboardList, Trophy, CircleUser } from 'lucide-react';
import { gradeHref } from '../../lib/catalog';
import { useLopCuaBe } from '../../lib/lopCuaBe';

// Thanh tab dưới đáy (chỉ điện thoại/máy tính bảng): Hôm nay · Học · Thi · Chơi · Tôi.
// "Học" và "Thi" đi thẳng tới lớp của bé nếu đã chọn lớp; "Tôi" mở trang Menu (tài khoản, góc phụ huynh và
// toàn bộ menu) — thay cho danh sách ba gạch dài. Thanh nằm TRÊN trang Menu (z-60 > z-55) để luôn bấm được.

const PLAY = ['/tro-choi', '/games', '/san-choi-tri-tue', '/thu-thach-iq', '/thi-tai', '/trieu-phu-nhi', '/kham-pha'];
const EXAM = ['/de-thi', '/thi-lop-', '/bai-tap', '/on-tap-cau-sai', '/ky-nang'];
const LEARN = ['/lop', '/hoc-toan', '/tieng-viet', '/khoa-hoc', '/tu-vung-tieng-anh'];

export default function BottomNav({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const pathname = usePathname();
  const [lop] = useLopCuaBe();
  const starts = (list: string[]) => list.some((p) => pathname.startsWith(p));

  const items = [
    { key: 'today', href: '/', label: 'Hôm nay', icon: Sun, active: pathname === '/' || pathname.startsWith('/hoc-hom-nay') },
    { key: 'learn', href: lop != null ? gradeHref(lop) : '/#chon-lop', label: 'Học', icon: BookOpen, active: starts(LEARN) },
    { key: 'exam', href: lop != null && lop > 0 ? `/thi-lop-${lop}` : '/de-thi', label: 'Thi', icon: ClipboardList, active: starts(EXAM) },
    { key: 'play', href: '/tro-choi', label: 'Chơi', icon: Trophy, active: starts(PLAY) },
  ];

  const cls = (on: boolean) => `text-[11px] font-bold ${on ? 'text-pink-600' : 'text-slate-500'}`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-pink-100 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Điều hướng chính"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5 pb-1">
        {items.map(({ key, href, label, icon: Icon, active }) => {
          const on = active && !menuOpen;
          return (
            <li key={key}>
              <Link href={href} onClick={() => menuOpen && onMenu()} className="flex flex-col items-center gap-0.5 rounded-xl py-1" aria-current={on ? 'page' : undefined}>
                <Icon size={22} aria-hidden className={on ? 'text-pink-600' : 'text-slate-400'} />
                <span className={cls(on)}>{label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex w-full flex-col items-center gap-0.5 rounded-xl py-1"
          >
            <CircleUser size={22} aria-hidden className={menuOpen ? 'text-pink-600' : 'text-slate-400'} />
            <span className={cls(menuOpen)}>Tôi</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
