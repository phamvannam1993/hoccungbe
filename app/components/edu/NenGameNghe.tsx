// Khung nền dùng chung cho các game luyện nghe.
//
// Gom về một chỗ vì bốn trang game dùng đúng một bộ: nền chuyển sắc, hai quầng
// sáng mờ, vài hình trang trí trôi, tiêu đề đổ màu. Chép ra bốn bản là bốn chỗ
// phải sửa mỗi lần đổi giao diện — và trước đó đã có hai bản chép tay rồi.

import type { ReactNode } from 'react';

// Toạ độ hình trang trí đặt CỐ ĐỊNH (không random) để bản dựng ở máy chủ và ở
// trình duyệt giống hệt nhau — random ở đây từng gây lỗi lệch hydration.
const CHO_DUNG = [
  { trai: '5%', tren: '10%', co: 'text-4xl', tre: '0s' },
  { trai: '91%', tren: '14%', co: 'text-3xl', tre: '1.2s' },
  { trai: '88%', tren: '68%', co: 'text-3xl', tre: '2.4s' },
  { trai: '6%', tren: '74%', co: 'text-3xl', tre: '1.6s' },
];

export function NenGameNghe({
  nhan, tieuDe, moTa, nen, trangTri, children,
}: {
  nhan: string;
  tieuDe: string;
  moTa: string;
  /** Chuỗi CSS gradient cho nền trang. */
  nen: string;
  /** Bốn emoji trang trí, ẩn trên điện thoại cho khỏi rối. */
  trangTri: string[];
  children: ReactNode;
}) {
  return (
    // Nền phủ HAI chỗ: min-h-screen cho khớp <main> của SiteShell (cũng
    // min-h-screen), và -mb-24/pb-32 cho phần đệm chừa thanh nav dưới ở mobile.
    // Thiếu chỗ nào cũng lòi nền teal của <body> thành một vệt màu.
    <div className="relative -mb-24 min-h-screen overflow-hidden pb-32 lg:-mb-0 lg:pb-10" style={{ background: nen }}>
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 hidden select-none sm:block" aria-hidden>
        {trangTri.slice(0, CHO_DUNG.length).map((e, i) => (
          <span key={i} className={`nav-troi absolute ${CHO_DUNG[i].co} opacity-45`}
            style={{ left: CHO_DUNG[i].trai, top: CHO_DUNG[i].tren, animationDelay: CHO_DUNG[i].tre }}>{e}</span>
        ))}
      </div>

      <header className="relative mx-auto max-w-2xl px-4 pt-7 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-sky-600 shadow-sm backdrop-blur">
          {nhan}
        </span>
        <h1 className="chu-mau mt-2 bg-gradient-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
          {tieuDe}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm font-bold text-slate-500">{moTa}</p>
      </header>

      <div className="relative">{children}</div>
    </div>
  );
}
