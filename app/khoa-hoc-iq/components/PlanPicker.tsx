'use client';

import { useEffect } from 'react';
import type { Combo, Course } from '../lib/types';
import { formatVnd, useShop, type BuyTarget } from './ShopProvider';
import { gaItem, trackViewPricing } from '../../lib/analytics';

/** Đuôi mã gói năm — khớp YEARLY_SUFFIX (lib/catalog.ts) và planOf ở api-hoccungbe. */
const YEARLY = 'Y';

type Plan = BuyTarget & { key: string; label: string; per: string; note?: string; oldPrice?: number; best?: boolean };

export function plansFor(combo?: Combo, course?: Course): Plan[] {
  const out: Plan[] = [];
  if (combo?.yearlyPrice) {
    const monthly12 = combo.price * 12;
    const save = Math.round((1 - combo.yearlyPrice / monthly12) * 100);
    out.push({
      key: 'year',
      label: 'Trọn lớp · 12 tháng',
      per: '12 tháng',
      note: `Chỉ ${formatVnd(Math.round(combo.yearlyPrice / 12 / 1000) * 1000)}/tháng · tiết kiệm ${save}%`,
      title: `${combo.title} · gói 12 tháng`,
      price: combo.yearlyPrice,
      oldPrice: combo.yearlyOldPrice ?? monthly12,
      codePrefix: combo.codePrefix + YEARLY,
      months: 12,
      best: true,
    });
  }
  if (combo) {
    out.push({
      key: 'month',
      label: 'Trọn lớp · 1 tháng',
      per: '1 tháng',
      note: 'Cả 12 khóa của lớp',
      title: combo.title,
      price: combo.price,
      oldPrice: combo.oldPrice,
      codePrefix: combo.codePrefix,
      months: 1,
    });
  }
  if (course) {
    const grade = course.subject.split('|')[1] ?? '';
    out.push({
      key: 'course',
      label: 'Riêng khóa này',
      per: '1 tháng',
      note: `Khóa ${course.number}: ${course.title}`,
      title: `Khóa ${course.number} ${grade.toLowerCase()}: ${course.title}`,
      price: course.price,
      codePrefix: course.codePrefix,
      months: 1,
    });
  }
  return out;
}

/** Bảng chọn gói (năm / tháng / khóa lẻ). `list` = tên vị trí gửi GA (view_item_list). */
export default function PlanPicker({ combo, course, list, className = '' }: { combo?: Combo; course?: Course; list: string; className?: string }) {
  const { openBuy, openActivate } = useShop();
  const plans = plansFor(combo, course);
  const ids = plans.map((p) => p.codePrefix).join(',');

  useEffect(() => {
    if (!plans.length) return;
    trackViewPricing(list, plans.map((p) => gaItem(p.codePrefix, p.title, p.price)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- gửi lại khi đổi lớp / khóa (ids), không theo từng lần render
  }, [list, ids]);

  return (
    <div className={className}>
      <div className="grid gap-3">
        {plans.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => openBuy(p)}
            className={`relative flex items-center gap-3 rounded-2xl border-[3px] bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 ${
              p.best ? 'border-[#ff9f1c] shadow-[0_4px_0_#e08600]' : 'border-[#d7eef6] shadow-[0_3px_0_#c3e3ee]'
            }`}
          >
            {p.best && (
              <span className="absolute -top-3 left-4 rounded-full bg-[#ff6b3d] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-white">
                Bố mẹ chọn nhiều nhất
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-black text-slate-800">{p.label}</span>
              {p.note && <span className="block truncate text-xs font-bold text-slate-500">{p.note}</span>}
            </span>
            <span className="shrink-0 text-right">
              {p.oldPrice && <span className="block text-xs text-slate-400 line-through">{formatVnd(p.oldPrice)}</span>}
              <span className="block text-lg font-black text-[#e34a4a]">{formatVnd(p.price)}</span>
              <span className="block text-[11px] font-bold text-slate-500">/ {p.per}</span>
            </span>
          </button>
        ))}
      </div>
      <button type="button" onClick={openActivate} className="mt-3 w-full text-center text-sm font-extrabold text-[#1d9bbd] underline">
        Đã có mã kích hoạt? Nhập mã
      </button>
    </div>
  );
}
