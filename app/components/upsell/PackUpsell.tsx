// Lời mời mua một gói tài liệu in (bộ đề HK1, card Phonics). Server component: giá đọc từ packs.ts.

import { getPack } from '../../goi-tai-lieu/packs';
import UpsellLink from './UpsellLink';

const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

export default function PackUpsell({ slug, spot, title, className = '' }: { slug: string; spot: string; title?: string; className?: string }) {
  const pack = getPack(slug);
  if (!pack) return null;
  return (
    <UpsellLink
      spot={spot}
      href={`/goi-tai-lieu/${pack.slug}`}
      className={`group flex items-center gap-4 rounded-3xl border-[3px] border-[#ffc936] bg-gradient-to-r from-[#fffbea] to-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${className}`}
    >
      <span className="text-4xl sm:text-5xl" aria-hidden>
        {pack.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold uppercase tracking-widest text-[#e19a21]">Bản in cho bố mẹ</span>
        <span className="mt-0.5 block text-base font-black text-slate-800 sm:text-lg">{title ?? pack.title}</span>
        <span className="mt-1 block text-sm text-slate-600">
          {pack.subtitle}.{' '}
          <b className="text-[#e34a4a]">
            {vnd(pack.price)}
            {pack.oldPrice ? <s className="ml-1 font-semibold text-slate-400">{vnd(pack.oldPrice)}</s> : null}
          </b>
        </span>
      </span>
      <span className="hidden shrink-0 rounded-full bg-[#ff9f1c] px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#e08600] group-hover:bg-[#ff8c00] sm:block">
        Xem thử →
      </span>
    </UpsellLink>
  );
}
