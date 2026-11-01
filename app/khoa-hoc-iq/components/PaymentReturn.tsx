'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { checkOrder, syncAccess } from '../actions';
import { getAccountToken } from '../lib/account';

type Phase = 'checking' | 'done' | 'slow' | 'cancelled' | null;

/**
 * payOS chuyển phụ huynh về `/khoa-hoc-iq?thanh-toan=xong&ma=<mã>` sau khi thanh toán (hoặc `=huy`).
 * Hỏi lại trạng thái đơn vài lần (webhook có thể đến chậm), mở khóa xong thì tải lại trang.
 */
export default function PaymentReturn() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const kind = sp.get('thanh-toan');
  const code = sp.get('ma');
  const [phase, setPhase] = useState<Phase>(kind === 'huy' ? 'cancelled' : kind === 'xong' ? 'checking' : null);

  useEffect(() => {
    if (kind !== 'xong' || !code) return;
    let alive = true;
    let tries = 0;
    const tick = async () => {
      tries += 1;
      const token = getAccountToken();
      const r = await checkOrder(code, token).catch(() => null);
      if (!alive) return;
      if (r?.order?.status === 'approved') {
        await syncAccess(token, true).catch(() => {});
        if (!alive) return;
        setPhase('done');
        router.refresh();
        return;
      }
      if (tries >= 10) return setPhase('slow');
      timer = setTimeout(tick, 3000);
    };
    let timer = setTimeout(tick, 800);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [kind, code, router]);

  if (!phase) return null;
  const close = () => {
    setPhase(null);
    router.replace(pathname);
  };
  const box =
    phase === 'done'
      ? 'bg-emerald-600'
      : phase === 'cancelled'
        ? 'bg-slate-700'
        : phase === 'slow'
          ? 'bg-amber-600'
          : 'bg-sky-600';
  return (
    <div className={`fixed inset-x-3 top-3 z-[60] mx-auto flex max-w-xl items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-2xl ${box}`}>
      <span className="text-2xl">{phase === 'done' ? '🎉' : phase === 'cancelled' ? '↩️' : phase === 'slow' ? '⏳' : '⏱️'}</span>
      <p className="flex-1 text-sm font-bold">
        {phase === 'checking' && 'Đang xác nhận thanh toán… chờ bé vài giây nhé!'}
        {phase === 'done' && 'Thanh toán thành công — khóa học đã mở. Chúc bé học vui!'}
        {phase === 'slow' &&
          'Ngân hàng đang xử lý chậm. Khóa học sẽ tự mở khi tiền về — bố mẹ tải lại trang sau ít phút, hoặc nhắn Zalo để được hỗ trợ.'}
        {phase === 'cancelled' && 'Bố mẹ đã hủy thanh toán. Có thể bấm Mua lại bất cứ lúc nào.'}
      </p>
      {phase !== 'checking' && (
        <button type="button" onClick={close} className="text-xl leading-none opacity-80 hover:opacity-100" aria-label="Đóng">
          ×
        </button>
      )}
    </div>
  );
}
