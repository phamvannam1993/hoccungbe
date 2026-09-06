'use client';

import type { CSSProperties, ReactNode } from 'react';

// Bộ mảnh giao diện cho game "Ai Là Triệu Phú Nhí".
// Game có HAI tông nền: sân khấu xanh đêm (màn chính, màn chơi, kết quả) và
// nền trời sáng (màn chọn lớp) — tách ra đây để các màn không tự chế mỗi nơi
// một kiểu.

/** Nền sân khấu: xanh đêm, đèn hắt và các đốm sáng lấp lánh. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: 'radial-gradient(120% 90% at 50% 0%, #1e40af 0%, #10256e 45%, #071143 100%)' }}
    >
      <Sparkles />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-5 sm:py-7">{children}</div>
    </div>
  );
}

/** Nền trời sáng có mây và đồi cỏ — dùng cho màn chọn lớp. */
export function SkyStage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#8fd3fe 0%,#c9ecff 55%,#eaf8ff 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Mây */}
        {[[8, 12, 90], [70, 8, 120], [40, 22, 70], [85, 26, 80]].map(([l, t, w], i) => (
          <div key={i} className="absolute rounded-full bg-white/85 blur-[2px]"
            style={{ left: `${l}%`, top: `${t}%`, width: w, height: (w as number) * 0.42 }} />
        ))}
        {/* Đồi cỏ */}
        <div className="absolute inset-x-0 bottom-0 h-48"
          style={{ background: 'radial-gradient(60% 100% at 20% 100%, #5ec46a 0%, transparent 70%), radial-gradient(60% 100% at 80% 100%, #46b45c 0%, transparent 70%), linear-gradient(180deg,transparent 0%,#6ccb76 60%)' }} />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-4 py-5 sm:py-7">{children}</div>
    </div>
  );
}

/** Các đốm sáng nhỏ rải trên nền sân khấu. Vị trí cố định để không nhấp nháy khi render lại. */
function Sparkles() {
  const dots: [number, number, number][] = [
    [6, 14, 3], [18, 8, 2], [30, 20, 2], [44, 6, 3], [58, 16, 2],
    [72, 9, 3], [86, 18, 2], [94, 7, 2], [12, 42, 2], [88, 46, 3],
    [4, 68, 2], [96, 74, 2], [24, 88, 3], [76, 92, 2],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 left-1/4 h-[460px] w-[460px] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{ background: 'radial-gradient(circle,#3b82f6 0%,transparent 70%)' }} />
      <div className="absolute -top-32 right-1/4 h-[460px] w-[460px] translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{ background: 'radial-gradient(circle,#a855f7 0%,transparent 70%)' }} />
      {dots.map(([l, t, r], i) => (
        <span key={i} className="absolute rounded-full bg-white"
          style={{ left: `${l}%`, top: `${t}%`, width: r, height: r, opacity: 0.55, boxShadow: '0 0 6px 2px rgba(255,255,255,.5)' }} />
      ))}
    </div>
  );
}

/**
 * Chữ vàng khối — tên game và các mốc thưởng.
 * Dùng nhiều lớp bóng để chữ nổi lên như bảng hiệu sân khấu, thay vì phẳng.
 */
export function GoldText({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      className={`bg-clip-text font-black text-transparent ${className}`}
      style={{
        backgroundImage: 'linear-gradient(180deg,#FFFBEA 0%,#FFE27A 30%,#FFC42E 58%,#F09000 82%,#C86A00 100%)',
        WebkitTextStroke: '2px #4a2500',
        paintOrder: 'stroke fill',
        filter: 'drop-shadow(0 2px 0 #7a3f00) drop-shadow(0 5px 10px rgba(0,0,0,.45))',
        letterSpacing: '.02em',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type Variant = 'gold' | 'blue' | 'red' | 'ghost' | 'white';

const BTN: Record<Variant, { bg: string; shadow: string; text: string }> = {
  gold: { bg: 'linear-gradient(180deg,#FFE27A 0%,#FFC42E 50%,#F09000 100%)', shadow: '0 6px 0 #B96A00, 0 12px 24px rgba(240,144,0,.4)', text: 'text-[#5a2d00]' },
  blue: { bg: 'linear-gradient(180deg,#4f8dff 0%,#2563eb 100%)', shadow: '0 6px 0 #1740a8, 0 12px 24px rgba(37,99,235,.4)', text: 'text-white' },
  red: { bg: 'linear-gradient(180deg,#fb7185 0%,#e11d48 100%)', shadow: '0 6px 0 #9f1239, 0 12px 24px rgba(225,29,72,.4)', text: 'text-white' },
  ghost: { bg: 'linear-gradient(180deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,.08) 100%)', shadow: '0 4px 0 rgba(255,255,255,.14)', text: 'text-white' },
  white: { bg: 'linear-gradient(180deg,#ffffff 0%,#eef4ff 100%)', shadow: '0 5px 0 #c7d6f0', text: 'text-[#0a1a52]' },
};

/** Nút kiểu game: viên thuốc bo tròn có gờ nổi ở đáy. */
export function GameButton({
  children, onClick, variant = 'gold', className = '', disabled,
}: { children: ReactNode; onClick?: () => void; variant?: Variant; className?: string; disabled?: boolean }) {
  const v = BTN[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-6 py-3.5 text-base font-black transition active:translate-y-1 disabled:opacity-50 ${v.text} ${className}`}
      style={{ background: v.bg, boxShadow: v.shadow }}
    >
      {children}
    </button>
  );
}

/**
 * Đồng xu vẽ bằng CSS.
 * Không dùng emoji 🪙: mỗi hệ điều hành vẽ một kiểu, có máy ra hình xám trông
 * như mặt trăng. Vẽ tay thì luôn giống nhau và sắc nét ở mọi cỡ.
 */
export function Coin({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center rounded-full"
      style={{
        width: size, height: size,
        background: 'radial-gradient(circle at 32% 28%, #FFF6C8 0%, #FFD84A 42%, #F0A400 78%, #C77800 100%)',
        boxShadow: 'inset 0 -1px 2px rgba(120,60,0,.5), inset 0 1px 1px rgba(255,255,255,.85), 0 1px 2px rgba(0,0,0,.25)',
      }}
    >
      <span
        style={{
          width: size * 0.6, height: size * 0.6,
          borderRadius: '50%',
          border: `${Math.max(1, size * 0.07)}px solid rgba(196,120,0,.55)`,
          display: 'grid', placeItems: 'center',
          fontSize: size * 0.42, lineHeight: 1, fontWeight: 900, color: '#B26A00',
        }}
      >
        ₫
      </span>
    </span>
  );
}

/** Chip xu vàng. */
export function CoinChip({ coins }: { coins: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black text-[#5a2d00]"
      style={{ background: 'linear-gradient(180deg,#FFE27A,#FFC42E)', boxShadow: '0 3px 0 #B96A00' }}
    >
      <Coin size={18} />
      {coins.toLocaleString('vi-VN')}
    </span>
  );
}

/**
 * Icon ảnh từ bộ có sẵn trong /public/icons.
 * Dùng thay emoji: emoji mỗi hệ điều hành vẽ một kiểu, cỡ chữ khác nhau và
 * trông nhạt trên nền tối; bộ icon này phẳng, đồng bộ và sắc nét.
 */
export function Icon({ name, size = 28, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh trong /public
    <img
      src={`/icons/${name}`}
      alt=""
      draggable={false}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Thẻ trắng bo tròn cho các màn dạng bảng. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[26px] bg-white p-5 shadow-2xl sm:p-6 ${className}`}>{children}</div>;
}

/** Dải băng vàng dùng cho tiêu đề "CHÚC MỪNG!". */
export function Ribbon({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto inline-block rounded-2xl px-7 py-2.5"
      style={{ background: 'linear-gradient(180deg,#FFE27A,#F09000)', boxShadow: '0 6px 0 #B96A00, 0 14px 28px rgba(0,0,0,.35)' }}
    >
      <span className="text-2xl font-black tracking-wide text-white" style={{ WebkitTextStroke: '1.5px #8a4a00', paintOrder: 'stroke fill' }}>
        {children}
      </span>
    </div>
  );
}
