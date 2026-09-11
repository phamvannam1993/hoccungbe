'use client';

import { useEffect, useState } from 'react';

// Pháo giấy bắn ra khi bé trả lời đúng.
//
// Dựng ở phía trình duyệt sau khi bé bấm, nên dùng số ngẫu nhiên thoải mái —
// không đụng gì tới lần dựng HTML đầu tiên của máy chủ.

const HINH = ['⭐', '🎉', '✨', '🌟', '🎈', '💫'];

export default function PhaoAnMung({ khoa }: { khoa: number | string }) {
  const [manh, setManh] = useState<{ id: number; hinh: string; x: number; y: number; xoay: number; tre: number }[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setManh(Array.from({ length: 14 }, (_, i) => ({
      id: i,
      hinh: HINH[Math.floor(Math.random() * HINH.length)],
      x: Math.round((Math.random() - 0.5) * 260),
      y: Math.round(-40 - Math.random() * 90),
      xoay: Math.round((Math.random() - 0.5) * 360),
      tre: Math.round(Math.random() * 120),
    })));
  }, [khoa]);

  if (!manh.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {manh.map((m) => (
        <span
          key={m.id}
          className="toan-phao-manh"
          style={{
            ['--x' as string]: `${m.x}px`,
            ['--y' as string]: `${m.y}px`,
            ['--xoay' as string]: `${m.xoay}deg`,
            animationDelay: `${m.tre}ms`,
          }}
        >
          {m.hinh}
        </span>
      ))}
    </div>
  );
}
