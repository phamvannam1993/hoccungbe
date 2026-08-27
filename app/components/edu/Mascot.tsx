'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { childStreak, getCurrentChildId } from '../../lib/childData';

/**
 * Linh vật "Hổ Con" — bạn đồng hành cổ vũ bé. Nổi ở góc, có bong bóng thoại theo
 * ngữ cảnh (chào ở trang chủ, nhắc chuỗi ngày…), chạm để đổi lời. Cố ý NHẸ: nhỏ,
 * không chặn màn hình, bong bóng tự thu lại — tránh gây phiền như modal.
 */

const GENERAL: string[] = [
  'Học một chút mỗi ngày, bé sẽ giỏi lên nhanh lắm! 💪',
  'Làm xong bài là có sao ⭐ đó, cố lên nào!',
  'Gom đủ sao để mở khoá thú cưng trong Bộ sưu tập nha! 🐾',
  'Bé làm tốt lắm! Mình tự hào về bé 😊',
  'Sai một chút không sao đâu, thử lại là được mà!',
  'Nghỉ chút cho đỡ mỏi mắt rồi mình học tiếp nhé 👀',
];

function pickOther(list: string[], current: string): string {
  const others = list.filter((m) => m !== current);
  const pool = others.length ? others : list;
  // Xoay vòng ổn định theo độ dài chuỗi để tránh Math.random khi render.
  return pool[(current.length + 1) % pool.length];
}

export default function Mascot() {
  const pathname = usePathname();
  const [msg, setMsg] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      if (!alive) return;
      let greeting =
        pathname === '/'
          ? 'Chào bé! Mình là Hổ Con. Hôm nay mình học gì nào? 😄'
          : GENERAL[0];
      try {
        const id = getCurrentChildId();
        if (id) {
          const s = await childStreak(id);
          if (s && s.currentStreak >= 2) {
            greeting = `Bé đang có chuỗi ${s.currentStreak} ngày 🔥 — giữ vững nhé!`;
          }
        }
      } catch {
        /* ignore */
      }
      if (!alive) return;
      setShown(true);
      setMsg(greeting);
      // Tự thu bong bóng sau 8s (linh vật vẫn ở lại, nhỏ gọn).
      setTimeout(() => alive && setMsg(null), 8000);
    }, 1200);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [pathname]);

  if (!shown) return null;

  const tap = () => setMsg((cur) => pickOther(GENERAL, cur ?? GENERAL[0]));

  return (
    <div className="pointer-events-none fixed bottom-20 left-3 z-40 flex items-end gap-2 lg:bottom-6">
      <button
        type="button"
        onClick={tap}
        aria-label="Nói chuyện với Hổ Con"
        className="pointer-events-auto bhh-float shrink-0 transition hover:scale-110 active:scale-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/01-mascot-tiger-trophy.webp"
          alt="Hổ Con — bạn đồng hành của bé"
          className="h-14 w-14 drop-shadow-md sm:h-16 sm:w-16"
          draggable={false}
        />
      </button>

      {msg && (
        <div className="pointer-events-auto relative mb-2 max-w-[220px] rounded-2xl rounded-bl-sm border-2 border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg animate-in fade-in slide-in-from-left-2 duration-200">
          {msg}
          <button
            type="button"
            onClick={() => setMsg(null)}
            aria-label="Đóng"
            className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-slate-200 text-xs text-slate-500 hover:bg-slate-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
