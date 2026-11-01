'use client';

import Link from 'next/link';
import { trackUpsellClick } from '../lib/analytics';

/** Đường dẫn gói tải card (khớp slug 'the-phonics' trong app/goi-tai-lieu/packs.ts). */
export const PHONICS_PACK_HREF = '/goi-tai-lieu/the-phonics';

/**
 * Nhóm không phải nhóm in thử: nút in dẫn sang gói tải trọn bộ card.
 * `spot` gửi GA (select_promotion) để biết phụ huynh bấm từ tab nào.
 */
export default function PackPrintLink({ label, spot }: { label: string; spot: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <Link
        href={PHONICS_PACK_HREF}
        onClick={() => trackUpsellClick(spot)}
        className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95"
      >
        🔒 {label} · trong gói tải trọn bộ card
      </Link>
      <span className="text-xs font-semibold text-slate-500">Nhóm mẫu đang mở in miễn phí; trọn bộ in một lần cả 4 phần.</span>
    </span>
  );
}
