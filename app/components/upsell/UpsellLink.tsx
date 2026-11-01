'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { trackUpsellClick, trackUpsellView } from '../../lib/analytics';

/** Khung lời mời nâng cấp: báo GA khi hiện ra màn hình (một lần) và khi bấm. */
export default function UpsellLink({ spot, href, className, children }: { spot: string; href: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackUpsellView(spot);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [spot]);

  return (
    <Link ref={ref} href={href} onClick={() => trackUpsellClick(spot)} className={className}>
      {children}
    </Link>
  );
}
