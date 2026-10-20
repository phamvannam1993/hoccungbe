'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { getAccountUser } from '../../lib/account';

const noop = () => () => {};

/** Thanh công cụ (không in): chọn bản in, chọn bài, nút In / Tải PDF. Ghi tên người mua vào chân trang. */
export default function PrintToolbar({
  slug,
  lessons,
  current,
  withAnswers,
  locked,
}: {
  slug: string;
  lessons: { id: string; label: string; free: boolean }[];
  current: string | null;
  withAnswers: boolean;
  locked: boolean;
}) {
  const buyer = useSyncExternalStore(noop, () => getAccountUser()?.email ?? '', () => '');
  const q = (o: { bai?: string | null; dapan?: boolean }) => {
    const p = new URLSearchParams();
    const bai = o.bai === undefined ? current : o.bai;
    if (bai) p.set('bai', bai);
    if (o.dapan ?? withAnswers) p.set('dap-an', '1');
    const s = p.toString();
    return `/khoa-hoc-iq/in/${slug}${s ? `?${s}` : ''}`;
  };

  return (
    <>
      {/* Chân trang in: tên người mua (Chrome in theo @page; chữ này nằm trong CSS biến). */}
      {buyer && <style>{`@page { @bottom-left { content: "Bản in dành cho: ${buyer.replace(/["\\]/g, '')}"; font: 9px sans-serif; color: #94a3b8; } }`}</style>}
      <div className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[860px] flex-wrap items-center gap-2 px-4 py-3">
          <Link href={`/khoa-hoc-iq/${slug}`} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">
            ← Về khóa học
          </Link>
          <select
            value={current ?? ''}
            onChange={(e) => (window.location.href = q({ bai: e.target.value || null }))}
            className="rounded-xl border-2 border-slate-200 px-2 py-2 text-sm font-bold"
          >
            <option value="">Cả quyển</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id} disabled={locked && !l.free}>
                {l.label}
                {locked && !l.free ? ' 🔒' : ''}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={withAnswers} onChange={(e) => (window.location.href = q({ dapan: e.target.checked }))} />
            Kèm đáp án & lời giải
          </label>
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
