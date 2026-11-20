import type { ReactNode } from 'react';
import { KidCrumb } from '../components/seo/kid';
import SanChoiTabs from '../components/edu/SanChoiTabs';

/** Nền "sân vận động" dùng chung cho các trang Sân chơi Trí tuệ: trời xanh ở trên, cỏ ở dưới, chỉ bằng gradient. */
export default function StadiumFrame({ crumb, max = 'max-w-6xl', children }: { crumb: { label: string; href?: string }[]; max?: string; children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(90% 45% at 50% 0%, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg,#a5dcff 0%,#d6f1ff 30%,#effbe6 62%,#bfe6a0 100%)',
      }}
    >
      {/* Sọc cỏ sân bóng ở nửa dưới */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,.16) 0 70px, rgba(255,255,255,0) 70px 140px)',
          maskImage: 'linear-gradient(180deg, transparent, #000 40%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 40%)',
        }}
      />
      {/* Mây */}
      <div aria-hidden className="pointer-events-none absolute left-[6%] top-16 h-10 w-36 rounded-full bg-white/70 blur-[2px]" />
      <div aria-hidden className="pointer-events-none absolute right-[8%] top-28 h-8 w-28 rounded-full bg-white/60 blur-[2px]" />

      <div className={`relative mx-auto ${max} px-4 py-6 sm:py-8`}>
        <KidCrumb items={crumb} />
        <SanChoiTabs className="mb-5" />
        {children}
      </div>
    </div>
  );
}
