// Lời mời mua gói Toán IQ, đặt ở chỗ phụ huynh vừa thấy giá trị (cuối bài học, báo cáo tuần, cuối trò chơi).
// Server component: giá đọc từ bảng giá khoa-hoc-iq ngay lúc render, không đưa JSON xuống trình duyệt.

import catalog from '../../khoa-hoc-iq/data/courses.json';
import UpsellLink from './UpsellLink';

const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

/** Giá/tháng thấp nhất (gói năm chia 12, làm tròn nghìn). */
function fromPerMonth() {
  const per = catalog.combos.map((c) => (c.yearlyPrice ? Math.round(c.yearlyPrice / 12 / 1000) * 1000 : c.price));
  return Math.min(...per);
}

type Props = {
  /** Vị trí đặt — gửi GA (promotion_id) và gắn vào link để đo. */
  spot: string;
  title?: string;
  body?: string;
  /** Lớp gợi ý ('lop-1'…); không có thì về trang cửa hàng. */
  grade?: string;
  /** Link riêng (vd bảng mở khóa của khóa đang học). */
  href?: string;
  cta?: string;
  className?: string;
};

export default function IqUpsell({ spot, title, body, grade, href, cta = 'Xem các gói học', className = '' }: Props) {
  const to = href ?? `/khoa-hoc-iq${grade ? `?lop=${grade}` : ''}`;
  return (
    <UpsellLink
      spot={spot}
      href={to}
      className={`group flex items-center gap-4 rounded-3xl border-[3px] border-[#ffc936] bg-gradient-to-r from-[#fffbea] to-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${className}`}
    >
      <span className="text-4xl sm:text-5xl" aria-hidden>
        🧠
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold uppercase tracking-widest text-[#e19a21]">Dành cho bố mẹ</span>
        <span className="mt-0.5 block text-base font-black text-slate-800 sm:text-lg">{title ?? 'Toán IQ trọn lớp: 12 khóa, 60 bài thử thách'}</span>
        <span className="mt-1 block text-sm text-slate-600">
          {body ?? 'Rèn tư duy logic qua game có đếm ngược, gợi ý và lời giải từng bước. Kèm phiếu bài tập in PDF.'}{' '}
          <b className="text-[#e34a4a]">Chỉ từ {vnd(fromPerMonth())}/tháng.</b>
        </span>
      </span>
      <span className="hidden shrink-0 rounded-full bg-[#ff9f1c] px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#e08600] group-hover:bg-[#ff8c00] sm:block">
        {cta} →
      </span>
    </UpsellLink>
  );
}
