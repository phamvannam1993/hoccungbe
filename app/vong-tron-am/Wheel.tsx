'use client';

import type { VongAm } from '../lib/vongTronAm';
import { khoaAnh } from '../lib/hinhTu';
import { useVocabImages, isImageUrl } from '../components/edu/utils/vocabImages';

// Vòng tròn âm vần: 10 từ xếp quanh một âm ở giữa.
//
// Vẽ bằng SVG chứ không phải nhiều thẻ div xoay bằng CSS: múi bánh xe là hình
// quạt, div không cắt được hình đó nếu không dùng mặt nạ phức tạp. SVG cũng co
// giãn theo màn hình mà không vỡ nét.

/** Cạnh ô hình trong mỗi múi. */
const CO_HINH = 38;

const R_NGOAI = 188;
const R_TRONG = 82;
const KHE = 1.4;        // khe hở giữa hai múi (độ)

/**
 * Làm tròn 3 chữ số thập phân.
 *
 * BẮT BUỘC phải làm tròn trước khi đưa số vào thuộc tính SVG: `Math.cos`/`Math.sin`
 * là hàm do từng môi trường tự cài, Node (lúc dựng trang ở máy chủ) và trình
 * duyệt có thể lệch nhau ở chữ số cuối. Chỉ cần lệch một chữ số là chuỗi `d`
 * khác nhau và React báo lỗi "hydrated but some attributes didn't match".
 */
const lamTron = (n: number) => Math.round(n * 1000) / 1000;

/** Điểm trên đường tròn theo góc (độ); 0° ở đỉnh, quay theo chiều kim đồng hồ. */
function diem(goc: number, r: number) {
  const rad = ((goc - 90) * Math.PI) / 180;
  return [lamTron(Math.cos(rad) * r), lamTron(Math.sin(rad) * r)] as const;
}

function duongMui(tu: number, den: number, rTrong: number, rNgoai: number) {
  const [x1, y1] = diem(tu, rNgoai);
  const [x2, y2] = diem(den, rNgoai);
  const [x3, y3] = diem(den, rTrong);
  const [x4, y4] = diem(tu, rTrong);
  const lon = den - tu > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${rNgoai} ${rNgoai} 0 ${lon} 1 ${x2} ${y2}
          L ${x3} ${y3} A ${rTrong} ${rTrong} 0 ${lon} 0 ${x4} ${y4} Z`;
}

/**
 * Mỗi múi một sắc pastel riêng, xoay đều quanh vòng màu.
 * Để cả mười múi cùng một màu thì nhìn rất phẳng và bé khó phân biệt ô nào với
 * ô nào; đổi sắc độ giúp mỗi ô có "chỗ đứng" riêng mà tổng thể vẫn hài hoà.
 */
function sacMui(i: number, tong: number) {
  const hue = Math.round((i / tong) * 360);
  return { nen: `hsl(${hue} 78% 94%)`, vien: `hsl(${hue} 62% 80%)`, dam: `hsl(${hue} 62% 45%)` };
}

/** Hoa lá trang trí rải quanh vành — vị trí cố định để không nhảy khi render lại. */
const TRANG_TRI: [number, number, string][] = [
  [-228, -126, '⭐'], [212, -148, '🌸'], [232, 24, '💗'],
  [-238, 48, '✨'], [-148, 212, '🎈'], [174, 198, '🌼'],
];

export default function Wheel({
  vong, chon, daHoc, onChonTu, onDocAm,
  nhanXong = '✓ Đã đánh vần',
  nhanChua = '🔊 Đánh vần',
  chuGiua,
  nhanGiua,
  khoaAnhCuaTu = khoaAnh,
}: {
  vong: VongAm;
  chon: number | null;
  daHoc: Set<string>;
  onChonTu: (i: number) => void;
  onDocAm: () => void;
  /** Nhãn trong múi khi từ đã học / chưa học. */
  nhanXong?: string;
  nhanChua?: string;
  /** Chữ lớn ở giữa; mặc định là mã âm của vòng. */
  chuGiua?: string;
  /** Nhãn nhỏ dưới chữ giữa; mặc định là "Âm <đọc>". */
  nhanGiua?: string;
  /** Cách tra ảnh — vòng từ vựng dùng khoá khác vòng âm vần. */
  khoaAnhCuaTu?: (tu: string) => string;
}) {
  // Ảnh admin tải lên; từ nào chưa có thì rơi về emoji.
  const map = useVocabImages();
  const anh: Record<string, string> = {};
  for (const w of vong.tu) {
    const url = map[khoaAnhCuaTu(w.tu)];
    if (isImageUrl(url)) anh[w.tu] = url;
  }

  const n = vong.tu.length;
  const buoc = 360 / n;
  const xoay = chon == null ? 0 : lamTron(-(chon * buoc));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      {/* Khung nhìn để dư viền cho trang trí nằm GỌN BÊN TRONG.
          Trước đây dùng overflow-visible và đặt trang trí ra ngoài khung nên
          trên điện thoại chúng tràn khỏi màn hình, làm trang trượt ngang. */}
      <svg viewBox="-262 -262 524 524" className="h-full w-full">
        <defs>
          <filter id="bongMui" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.16" />
          </filter>
          {/* Bo góc ô ảnh. clipPath dùng toạ độ của chính phần tử được cắt, mà ô
              ảnh đặt ở tâm nên hình vuông cắt cũng phải nằm quanh tâm. */}
          <clipPath id="boGocHinh">
            <rect
              x={-CO_HINH / 2} y={8 - CO_HINH * 0.72}
              width={CO_HINH} height={CO_HINH} rx={9}
            />
          </clipPath>
          <radialGradient id="loiGiua" cx="38%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={`${vong.mau}18`} />
          </radialGradient>
        </defs>

        {/* Trang trí quanh vành */}
        {TRANG_TRI.map(([x, y, e], i) => (
          <text key={i} x={x} y={y} fontSize="26" textAnchor="middle" opacity="0.9">{e}</text>
        ))}

        {/* Hai vành ngoài: một vành đặc mờ, một vành nét đứt đậm */}
        <circle r={R_NGOAI + 14} fill="none" stroke={vong.mau} strokeWidth="14" opacity="0.16" />
        <circle r={R_NGOAI + 14} fill="none" stroke={vong.mau} strokeWidth="5"
          strokeDasharray="3 11" strokeLinecap="round" opacity="0.95" />

        <g style={{ transform: `rotate(${xoay}deg)`, transition: 'transform .6s cubic-bezier(.22,1,.36,1)' }}>
          {vong.tu.map((w, i) => {
            const tu = i * buoc + KHE / 2;
            const den = (i + 1) * buoc - KHE / 2;
            const giua = (tu + den) / 2;
            const [tx, ty] = diem(giua, (R_TRONG + R_NGOAI) / 2);
            const sac = sacMui(i, n);
            const xong = daHoc.has(w.tu);
            const dangChon = chon === i;

            return (
              <g key={w.tu} onClick={() => onChonTu(i)} style={{ cursor: 'pointer' }}>
                <path
                  d={duongMui(tu, den, R_TRONG, R_NGOAI)}
                  fill={dangChon ? vong.mau : sac.nen}
                  stroke={dangChon ? vong.mau : sac.vien}
                  strokeWidth={dangChon ? 3 : 2}
                  filter={dangChon ? 'url(#bongMui)' : undefined}
                  style={{ transition: 'fill .35s, stroke .35s' }}
                />

                {/* Nội dung xoay ngược lại để chữ luôn đứng thẳng, không lộn đầu */}
                <g transform={`translate(${tx} ${ty}) rotate(${-xoay})`}>
                  {/* Từ đặt trong viên thuốc trắng cho dễ đọc trên mọi nền */}
                  <rect
                    x={-lamTron(Math.max(30, w.tu.length * 5.2))} y={-42}
                    width={lamTron(Math.max(60, w.tu.length * 10.4))} height={24} rx={12}
                    fill="#fff" stroke={dangChon ? '#fff' : sac.vien} strokeWidth="1.5"
                    filter="url(#bongMui)"
                  />
                  <text className="chu-mau" y={-25} textAnchor="middle" fontSize="14" fontWeight="700" fill={sac.dam}>
                    {w.tu}
                  </text>

                  {/* Có ảnh thì dùng ảnh, không thì emoji — giống thẻ từ và game nối.
                      Trong SVG phải dùng <image> chứ không dùng được next/image. */}
                  {anh[w.tu] ? (
                    <image
                      href={anh[w.tu]}
                      x={-CO_HINH / 2} y={8 - CO_HINH * 0.72}
                      width={CO_HINH} height={CO_HINH}
                      preserveAspectRatio="xMidYMid meet"
                      clipPath="url(#boGocHinh)"
                    />
                  ) : (
                    <text y={8} textAnchor="middle" fontSize="30">{w.emoji}</text>
                  )}

                  {/* Nhãn trạng thái, giống thẻ "Đã đánh vần" trong bản thiết kế */}
                  <rect
                    x={-38} y={20} width={76} height={19} rx={9.5}
                    fill="#fff" opacity={dangChon ? 0.95 : 0.85}
                  />
                  <text y={33} textAnchor="middle" fontSize="10.5" fontWeight="700"
                    fill={xong ? '#16a34a' : sac.dam}>
                    {xong ? nhanXong : nhanChua}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Lõi giữa: bấm để nghe âm */}
        <g onClick={onDocAm} style={{ cursor: 'pointer' }}>
          <circle r={R_TRONG} fill="url(#loiGiua)" stroke={vong.mau} strokeWidth="6" filter="url(#bongMui)" />
          <circle r={R_TRONG - 10} fill="none" stroke={vong.mau} strokeWidth="2"
            strokeDasharray="2 8" strokeLinecap="round" opacity="0.55" />
          {/* Hai chấm nhỏ như hai con mắt, cho lõi trông có "gương mặt" */}
          <circle cx={-24} cy={-34} r="4.5" fill="#ef4444" opacity="0.85" />
          <circle cx={24} cy={-34} r="4.5" fill="#3b82f6" opacity="0.85" />

          <text className="chu-mau" y="8" textAnchor="middle"
            fontSize={(chuGiua ?? vong.am).length > 3 ? 30 : 52} fontWeight="700" fill={vong.mau}>
            {chuGiua ?? vong.am}
          </text>
          <rect x={-62} y={24} width={124} height={24} rx={12} fill={`${vong.mau}1a`} />
          <text y={40} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={vong.mau}>
            {nhanGiua ?? `🔊 Âm ${vong.doc}`}
          </text>
        </g>
      </svg>
    </div>
  );
}
