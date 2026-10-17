/* eslint-disable @next/next/no-img-element -- ảnh tờ tiền tĩnh, nhỏ */

// Ảnh tờ tiền thật dùng chung với trang "Tiền Việt Nam" (public/tien-viet/).
const ANH: Record<number, string> = {
  200: '/tien-viet/200đ.jpg',
  500: '/tien-viet/500đ.jpg',
  1000: '/tien-viet/1k.jpg',
  2000: '/tien-viet/2k.jpg',
  5000: '/tien-viet/5k.jpg',
  10000: '/tien-viet/10k.jpg',
  20000: '/tien-viet/20k.jpg',
  50000: '/tien-viet/50k.jpg',
  100000: '/tien-viet/100k.jpg',
  200000: '/tien-viet/200k.jpg',
  500000: '/tien-viet/500k.jpg',
};

export const moneyLabel = (value: number) => `${value.toLocaleString('vi-VN').replace(/\./g, ' ')} đồng`;

/** Một tờ tiền. Mệnh giá chưa có ảnh thì vẽ khung chữ thay thế để không vỡ giao diện. */
export function Banknote({ value, width = 120 }: { value: number; width?: number }) {
  const src = ANH[value];
  const height = Math.round(width * 0.47);
  return src ? (
    <img
      src={encodeURI(src)}
      alt={moneyLabel(value)}
      title={moneyLabel(value)}
      width={width}
      height={height}
      draggable={false}
      className="inline-block shrink-0 rounded-md bg-white object-contain align-middle shadow-[0_2px_0_rgba(0,0,0,0.15)] ring-1 ring-black/10"
      style={{ width, height }}
    />
  ) : (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#c8e6c9] align-middle text-xs font-black text-[#1f3d32] ring-1 ring-black/10"
      style={{ width, height }}
    >
      {moneyLabel(value)}
    </span>
  );
}

/** Một hàng tờ tiền; phần tử là chữ (vd "=", "+", "?") thì hiện thành ký hiệu ở giữa. */
export function MoneyRow({ items, width = 120 }: { items: (number | string)[]; width?: number }) {
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-2">
      {items.map((it, i) =>
        typeof it === 'number' ? (
          <Banknote key={i} value={it} width={width} />
        ) : (
          <span key={i} className="px-1 text-2xl font-black text-[#1b1b1b]">
            {it}
          </span>
        ),
      )}
    </span>
  );
}
