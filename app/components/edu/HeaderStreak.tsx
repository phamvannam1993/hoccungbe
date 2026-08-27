'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { childStreak, getCurrentChildId } from '../../lib/childData';

/**
 * Badge chuỗi ngày học 🔥 luôn hiển thị trên header → nhắc bé giữ thói quen mỗi ngày.
 * Chỉ hiện khi bé đang có chuỗi (>=1 ngày). Dữ liệu lấy từ childStreak (backend nếu
 * đã đăng nhập, tự tính từ lịch sử local nếu là khách). Render sau khi mount để tránh
 * lệch hydration.
 */
export default function HeaderStreak({ className = '' }: { className?: string }) {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const id = getCurrentChildId();
        if (!id) return;
        const s = await childStreak(id);
        if (alive && s && s.currentStreak > 0) setStreak(s.currentStreak);
      } catch {
        /* im lặng — badge chỉ là điểm nhấn động lực, lỗi không được phá header */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!streak) return null;

  return (
    <Link
      href="/hoc-hom-nay"
      title={`Bé đã học ${streak} ngày liên tiếp — cố giữ chuỗi nhé!`}
      className={`flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-sm font-black text-white shadow-sm transition hover:scale-105 ${className}`}
    >
      <span className="text-base leading-none">🔥</span>
      {streak}
    </Link>
  );
}
