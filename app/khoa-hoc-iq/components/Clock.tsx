import { Fragment, type ReactNode } from 'react';
import { emojiRegex } from '../lib/emoji';
import { emojiImg } from '../lib/assets';

/* Làm tròn toạ độ trước khi ghi vào SVG.
 *
 * `Math.sin`/`Math.cos` KHÔNG bắt buộc giống nhau từng bit giữa các máy JS. Node
 * dựng trang ra `y1="33.730534276967994"`, Chrome tính lại thành `33.73053427696799`
 * — React so thấy lệch và báo hydration mismatch, kèm câu "đừng dùng Math.random()"
 * làm lạc hướng hẳn, vì đây không phải chuyện ngẫu nhiên.
 *
 * Ba chữ số sau dấu phẩy trên khung 100 đơn vị là 1/100.000 bề ngang đồng hồ: mắt
 * không thấy được, mà hai bên thì ghi ra y hệt nhau. */
const lam = (v: number) => Math.round(v * 1000) / 1000;

/* Tả VỊ TRÍ HAI KIM, không nói ra giờ.
 *
 * `<title>` của SVG hiện lên khi rê chuột, và máy đọc màn hình đọc `aria-label`.
 * Với câu "Đồng hồ chỉ mấy giờ?" thì nhãn "4 giờ 35 phút" chính là ĐÁP ÁN — rê
 * chuột một cái là xong bài, còn bé dùng máy đọc thì được đọc thẳng đáp án.
 *
 * Tả vị trí kim thì đúng ở mọi chỗ dùng mà không lộ gì: bé vẫn phải tự đọc giờ,
 * y như bé nhìn bằng mắt. */
export function taKim(hour: number, minute: number): string {
  const h = ((Math.trunc(hour) % 12) + 12) % 12 || 12;
  const sau = h === 12 ? 1 : h + 1;
  const ngan = minute === 0 ? `kim ngắn chỉ số ${h}` : `kim ngắn nằm giữa số ${h} và số ${sau}`;
  const nam = minute / 5;
  const dai = Number.isInteger(nam)
    ? `kim dài chỉ số ${nam === 0 ? 12 : nam}`
    : `kim dài chỉ vạch nhỏ thứ ${minute % 5} sau số ${Math.floor(nam) === 0 ? 12 : Math.floor(nam)}`;
  return `Đồng hồ kim: ${ngan}, ${dai}`;
}

/** Đồng hồ kim vẽ bằng SVG: đủ 12 số, vạch phút, kim giờ đặt đúng theo cả số phút.
 */
export function Clock({ hour, minute = 0, size = 56 }: { hour: number; minute?: number; size?: number }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  /* Dưới cỡ này thì chữ số chỉ còn khoảng 5px — không đọc được mà vẫn làm bẩn mặt
     đồng hồ. Bỏ số đi, chỉ để vạch giờ: nhỏ mà vẫn nhìn ra kim chỉ đâu. */
  const showNumbers = size >= 56;
  const label = taKim(hour, minute);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className="inline-block shrink-0 align-middle drop-shadow-[0_2px_0_rgba(0,0,0,0.12)]"
    >
      <title>{label}</title>
      <circle cx="50" cy="50" r="45.5" fill="#ffffff" stroke="#1093b7" strokeWidth="5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#eef4f7" strokeWidth="1.2" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const a = (i * 6 * Math.PI) / 180;
        const r1 = big ? 37.5 : 40;
        return (
          <line
            key={i}
            x1={lam(50 + r1 * Math.sin(a))}
            y1={lam(50 - r1 * Math.cos(a))}
            x2={lam(50 + 42.2 * Math.sin(a))}
            y2={lam(50 - 42.2 * Math.cos(a))}
            stroke={big ? '#1b1b1b' : '#c3ccd4'}
            strokeWidth={big ? 2.6 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {showNumbers &&
        Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const a = (n * 30 * Math.PI) / 180;
          return (
            <text
              key={n}
              x={lam(50 + 30 * Math.sin(a))}
              y={lam(50 - 30 * Math.cos(a))}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10.5"
              fontWeight="800"
              fill="#1b1b1b"
              fontFamily="var(--font-nunito), Nunito, sans-serif"
            >
              {n}
            </text>
          );
        })}
      {/* Kim vẽ bằng hình thon (gốc to, mũi nhỏ) chứ không phải đoạn thẳng dày đều:
          đoạn thẳng dày 7 trông như cái que, và ở mũi kim khó thấy nó chỉ vào đâu. */}
      <polygon
        points="46.9,56 53.1,56 51.7,31 48.3,31"
        fill="#1b1b1b"
        stroke="#1b1b1b"
        strokeWidth="1.8"
        strokeLinejoin="round"
        transform={`rotate(${lam(hourAngle)} 50 50)`}
      />
      <polygon
        points="48.3,57 51.7,57 50.9,15 49.1,15"
        fill="#e64a4a"
        stroke="#e64a4a"
        strokeWidth="1.4"
        strokeLinejoin="round"
        transform={`rotate(${lam(minuteAngle)} 50 50)`}
      />
      <circle cx="50" cy="50" r="3.8" fill="#1b1b1b" />
      <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
    </svg>
  );
}

/** Emoji đồng hồ 🕐…🕛 (giờ đúng), 🕜…🕧 (giờ rưỡi) → giờ, phút. */
export function clockFromEmoji(ch: string): { hour: number; minute: number } | null {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp >= 0x1f550 && cp <= 0x1f55b) return { hour: cp - 0x1f550 + 1, minute: 0 };
  if (cp >= 0x1f55c && cp <= 0x1f567) return { hour: cp - 0x1f55c + 1, minute: 30 };
  return null;
}

/**
 * Hiển thị chữ trong bài: emoji đồng hồ → đồng hồ vẽ chuẩn; emoji admin đã thay ảnh
 * (/admin/iq-emoji) → ảnh, cao bằng chữ xung quanh; phần còn lại giữ nguyên.
 */
export function withClocks(text: string, size = 56): ReactNode {
  if (!text) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(emojiRegex())) {
    const ch = m[0];
    const t = clockFromEmoji(ch);
    const src = t ? undefined : emojiImg(ch);
    if (!t && !src) continue;
    if (m.index > last) parts.push(<Fragment key={last}>{text.slice(last, m.index)}</Fragment>);
    parts.push(
      t ? (
        <Clock key={m.index} hour={t.hour} minute={t.minute} size={size} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- ảnh emoji admin upload (S3), kích thước theo cỡ chữ
        <img key={m.index} src={src} alt={ch} draggable={false} className="inline-block h-[1.15em] w-[1.15em] object-contain align-[-0.2em]" />
      ),
    );
    last = m.index + ch.length;
  }
  if (last === 0) return text;
  if (last < text.length) parts.push(<Fragment key={last}>{text.slice(last)}</Fragment>);
  return parts;
}

/** "7:15" / "7 giờ 15" → giờ, phút (dùng cho visual.clock). */
export function parseTime(s: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2})\s*(?::|giờ)\s*(\d{1,2})?/.exec(s.trim());
  return m ? { hour: Number(m[1]), minute: Number(m[2] ?? 0) } : null;
}
