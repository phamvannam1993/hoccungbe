'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStars, STARS_EVENT } from '../../lib/stars';
import { getCurrentChildId } from '../../lib/childData';

/**
 * Badge ví sao ⭐ trên header. Cập nhật tức thì khi bé kiếm/tiêu sao (nghe STARS_EVENT).
 * Bấm vào → trang Bộ sưu tập để đổi sao lấy nhãn dán/thú cưng.
 */
export default function StarWallet({ className = '' }: { className?: string }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => {
      try {
        const id = getCurrentChildId();
        setStars(id ? getStars(id) : 0);
      } catch {
        setStars(0);
      }
    };
    sync();
    window.addEventListener(STARS_EVENT, sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(STARS_EVENT, sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  if (stars === null) return null;

  return (
    <Link
      href="/bo-suu-tap"
      title="Ví sao của bé — bấm để đổi quà trong Bộ sưu tập"
      className={`flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-1 text-sm font-black text-white shadow-sm transition hover:scale-105 ${className}`}
    >
      <span className="text-base leading-none">⭐</span>
      {stars}
    </Link>
  );
}
