import { Fragment, type ReactNode } from 'react';

/** Đồng hồ kim vẽ bằng SVG: đủ 12 số, vạch phút, kim giờ đặt đúng theo cả số phút. */
export function Clock({ hour, minute = 0, size = 56 }: { hour: number; minute?: number; size?: number }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const showNumbers = size >= 44;
  const label = `${hour} giờ${minute ? ` ${minute} phút` : ''}`;

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
      <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#1093b7" strokeWidth="5" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const a = (i * 6 * Math.PI) / 180;
        const r1 = big ? 37 : 40.5;
        return (
          <line
            key={i}
            x1={50 + r1 * Math.sin(a)}
            y1={50 - r1 * Math.cos(a)}
            x2={50 + 43 * Math.sin(a)}
            y2={50 - 43 * Math.cos(a)}
            stroke={big ? '#1b1b1b' : '#9ca3af'}
            strokeWidth={big ? 2.4 : 1}
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
              x={50 + 30 * Math.sin(a)}
              y={50 - 30 * Math.cos(a)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontWeight="900"
              fill="#1b1b1b"
              fontFamily="var(--font-nunito), Nunito, sans-serif"
            >
              {n}
            </text>
          );
        })}
      {/* kim giờ: ngắn, dày */}
      <line x1="50" y1="50" x2="50" y2="30" stroke="#1b1b1b" strokeWidth="7" strokeLinecap="round" transform={`rotate(${hourAngle} 50 50)`} />
      {/* kim phút: dài, mảnh */}
      <line x1="50" y1="50" x2="50" y2="14" stroke="#e64a4a" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minuteAngle} 50 50)`} />
      <circle cx="50" cy="50" r="4" fill="#1b1b1b" />
      <circle cx="50" cy="50" r="1.6" fill="#ffffff" />
    </svg>
  );
}

const CLOCK_RE = /([\u{1F550}-\u{1F567}])\uFE0F?/u;

/** Emoji đồng hồ 🕐…🕛 (giờ đúng), 🕜…🕧 (giờ rưỡi) → giờ, phút. */
export function clockFromEmoji(ch: string): { hour: number; minute: number } | null {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp >= 0x1f550 && cp <= 0x1f55b) return { hour: cp - 0x1f550 + 1, minute: 0 };
  if (cp >= 0x1f55c && cp <= 0x1f567) return { hour: cp - 0x1f55c + 1, minute: 30 };
  return null;
}

/** Thay mọi emoji đồng hồ trong chuỗi bằng đồng hồ vẽ chuẩn; phần chữ còn lại giữ nguyên. */
export function withClocks(text: string, size = 56): ReactNode {
  if (!CLOCK_RE.test(text)) return text;
  return text.split(new RegExp(CLOCK_RE.source, 'gu')).map((part, i) => {
    const t = i % 2 === 1 ? clockFromEmoji(part) : null;
    return t ? <Clock key={i} hour={t.hour} minute={t.minute} size={size} /> : <Fragment key={i}>{part}</Fragment>;
  });
}

/** "7:15" / "7 giờ 15" → giờ, phút (dùng cho visual.clock). */
export function parseTime(s: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2})\s*(?::|giờ)\s*(\d{1,2})?/.exec(s.trim());
  return m ? { hour: Number(m[1]), minute: Number(m[2] ?? 0) } : null;
}
