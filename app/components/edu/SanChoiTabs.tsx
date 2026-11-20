'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Thanh tab chung của SÂN CHƠI TRÍ TUỆ — 5 kiểu thi đấu trước đây rời rạc ở 5 trang, giờ đi qua lại bằng
// một hàng tab. Trang và URL cũ giữ nguyên, chỉ thêm thanh này ở đầu mỗi trang.

export const SAN_CHOI_TABS = [
  { href: '/san-choi-tri-tue', label: 'Thử thách hôm nay', emoji: '🏆' },
  { href: '/thu-thach-iq', label: 'Thử thách IQ', emoji: '🧠' },
  { href: '/thi-tai', label: 'Thi Tài', emoji: '🥇' },
  { href: '/trieu-phu-nhi', label: 'Triệu Phú Nhí', emoji: '💎' },
  { href: '/kham-pha', label: 'Đố vui', emoji: '🔎' },
  { href: '/san-choi-tri-tue/phong', label: 'Thi với bạn', emoji: '👫' },
];

export default function SanChoiTabs({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  // Mục khớp dài nhất thắng: /san-choi-tri-tue/phong/ABC → "Thi với bạn", không phải "Thử thách hôm nay".
  const active = SAN_CHOI_TABS.filter((t) => pathname === t.href || pathname.startsWith(`${t.href}/`)).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  // Điện thoại: hàng tab cuộn ngang — kéo tab đang mở vào giữa (chỉ cuộn ngang, không đụng cuộn trang).
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = listRef.current;
    const el = ul?.querySelector<HTMLElement>('[aria-current="page"]');
    if (ul && el) ul.scrollLeft = el.offsetLeft - (ul.clientWidth - el.offsetWidth) / 2;
  }, [active]);

  return (
    <nav aria-label="Sân chơi Trí tuệ" className={`min-w-0 ${className}`}>
      <ul ref={listRef} className="relative flex gap-1.5 overflow-x-auto rounded-2xl bg-white/90 p-1.5 shadow-sm ring-1 ring-sky-100 [scrollbar-width:none]">
        {SAN_CHOI_TABS.map((t) => {
          const on = t.href === active;
          return (
            <li key={t.href} className="shrink-0">
              <Link
                href={t.href}
                aria-current={on ? 'page' : undefined}
                className={`kid-display flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-black transition ${
                  on ? 'bg-sky-600 text-white shadow' : 'text-slate-600 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                <span aria-hidden>{t.emoji}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
