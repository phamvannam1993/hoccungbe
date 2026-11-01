'use client';

import { useEffect } from 'react';
import { useShop, formatVnd } from '../../khoa-hoc-iq/components/ShopProvider';
import { gaItem, trackViewPricing } from '../../lib/analytics';
import { PACK_MONTHS, type Pack } from '../packs';

/** Nút mua một gói tài liệu (mở hộp thanh toán payOS / chuyển khoản dùng chung với Toán IQ). */
export default function BuyPack({ pack, list, compact = false }: { pack: Pick<Pack, 'codePrefix' | 'title' | 'price' | 'oldPrice'>; list: string; compact?: boolean }) {
  const { openBuy, openActivate } = useShop();

  useEffect(() => {
    trackViewPricing(list, [gaItem(pack.codePrefix, pack.title, pack.price)]);
  }, [list, pack.codePrefix, pack.title, pack.price]);

  return (
    <div className={compact ? '' : 'text-center'}>
      <p className={`flex items-baseline gap-2 ${compact ? '' : 'justify-center'}`}>
        {pack.oldPrice && <span className="text-sm text-slate-400 line-through">{formatVnd(pack.oldPrice)}</span>}
        <span className="text-2xl font-black text-[#e34a4a]">{formatVnd(pack.price)}</span>
        <span className="text-xs font-bold text-slate-500">· dùng {PACK_MONTHS} tháng</span>
      </p>
      <div className={`mt-2 flex gap-2 ${compact ? '' : 'justify-center'}`}>
        <button
          type="button"
          onClick={() => openBuy({ title: pack.title, price: pack.price, codePrefix: pack.codePrefix, months: PACK_MONTHS })}
          className="khv-btn-buy px-6"
        >
          Mua gói
        </button>
        <button type="button" onClick={openActivate} className="khv-btn-active px-4">
          Nhập mã
        </button>
      </div>
    </div>
  );
}
