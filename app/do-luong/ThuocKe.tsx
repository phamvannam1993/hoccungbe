'use client';

// Thước kẻ 20cm vẽ bằng SVG, có đoạn thẳng đặt lên trên.
//
// Từ lớp 3 đoạn thẳng có thể KHÔNG bắt đầu ở vạch 0 — bé phải lấy vạch cuối
// trừ vạch đầu. Đây là bài hay ra trong đề và trẻ hay quên trừ, nên công cụ
// phải dựng được đúng tình huống đó chứ không chỉ đo từ 0.

const DAI_MM = 200;          // thước dài 20cm
const W = 640;
const LE = 16;
const TY_LE = (W - LE * 2) / DAI_MM;

// Làm tròn toạ độ: Math của máy chủ và trình duyệt lệch chữ số cuối, đủ để
// React báo HTML hai bên khác nhau.
const x = (mm: number) => Math.round((LE + mm * TY_LE) * 100) / 100;

export default function ThuocKe({ batDauMm, daiMm }: { batDauMm: number; daiMm: number }) {
  return (
    <svg viewBox={`0 0 ${W} 150`} className="w-full" role="img"
         aria-label={`Thước kẻ 20 xăng-ti-mét, đoạn thẳng từ vạch ${batDauMm / 10} đến vạch ${(batDauMm + daiMm) / 10}`}>
      {/* Đoạn thẳng cần đo, đặt PHÍA TRÊN thước cho dễ nhìn */}
      <g>
        <line x1={x(batDauMm)} y1="34" x2={x(batDauMm + daiMm)} y2="34" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
        <line x1={x(batDauMm)} y1="22" x2={x(batDauMm)} y2="46" stroke="#dc2626" strokeWidth="3" />
        <line x1={x(batDauMm + daiMm)} y1="22" x2={x(batDauMm + daiMm)} y2="46" stroke="#dc2626" strokeWidth="3" />
      </g>

      {/* Thân thước */}
      <rect x={LE - 10} y="60" width={W - LE * 2 + 20} height="72" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="2.5" />

      {/* Vạch chia: 1mm, 5mm dài hơn, 10mm dài nhất kèm số */}
      {Array.from({ length: DAI_MM + 1 }, (_, mm) => {
        const chan = mm % 10 === 0;
        const nua = mm % 5 === 0;
        const cao = chan ? 30 : nua ? 20 : 12;
        return (
          <g key={mm}>
            <line x1={x(mm)} y1="60" x2={x(mm)} y2={60 + cao} stroke="#92400e" strokeWidth={chan ? 2 : 1} />
            {chan && (
              <text x={x(mm)} y="108" textAnchor="middle" fontSize="13" fontWeight="800" fill="#78350f">
                {mm / 10}
              </text>
            )}
          </g>
        );
      })}
      <text x={W - LE} y="126" textAnchor="end" fontSize="11" fontWeight="700" fill="#92400e">cm</text>
    </svg>
  );
}
