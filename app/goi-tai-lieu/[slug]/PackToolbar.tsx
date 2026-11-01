'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { getAccountUser } from '../../khoa-hoc-iq/lib/account';

const noop = () => () => {};

/** Thanh công cụ (không in): về danh sách gói, nút In / Lưu PDF; ghi email người mua ở chân trang in. */
export default function PackToolbar({ children }: { children?: React.ReactNode }) {
  const buyer = useSyncExternalStore(noop, () => getAccountUser()?.email ?? '', () => '');
  return (
    <>
      {buyer && <style>{`@page { @bottom-left { content: "Bản in dành cho: ${buyer.replace(/["\\]/g, '')}"; font: 9px sans-serif; color: #94a3b8; } }`}</style>}
      <div className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center gap-2 px-4 py-3">
          <Link href="/goi-tai-lieu" className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
            ← Các gói tài liệu
          </Link>
          {children}
          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto rounded-xl bg-blue-600 px-5 py-2 text-sm font-black text-white shadow hover:bg-blue-700"
          >
            🖨 In / Lưu PDF
          </button>
        </div>
        <p className="mx-auto max-w-[860px] px-4 pb-2 text-xs text-slate-500">
          Mẹo: trong hộp in chọn <b>Đích: Lưu dưới dạng PDF</b>, khổ <b>A4</b>, bật <b>Đồ họa nền</b> để giữ màu.
        </p>
      </div>
    </>
  );
}
