'use client';

import Link from 'next/link';

export default function ThanhIn({ ten, soTrang, mau }: { ten: string; soTrang: number; mau: string }) {
  return (
    <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <Link href="/luyen-viet-chu-dep" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
        ← Tất cả bộ tập viết
      </Link>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-bold text-slate-500 sm:inline">
          {ten} · {soTrang} trang
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl px-4 py-2 text-sm font-black text-white"
          style={{ background: mau }}
        >
          🖨 In / Tải PDF
        </button>
      </div>
    </div>
  );
}
