'use client';

// Cân đĩa hai bên: vật ở đĩa trái, quả cân bé đặt ở đĩa phải. Cán cân NGHIÊNG
// về bên nặng hơn, thăng bằng thì nằm ngang — bé nhìn là biết còn thiếu hay
// đã thừa, không cần máy nói.

export default function CanDia({
  gamTrai, gamPhai, ten, emoji,
}: { gamTrai: number; gamPhai: number; ten: string; emoji: string }) {
  const lech = gamPhai - gamTrai;
  // Góc nghiêng tối đa 12 độ, tỉ lệ theo mức lệch nhưng có chặn trên để cán
  // cân không quay lộn nhào khi bé đặt thừa thật nhiều.
  const goc = Math.max(-12, Math.min(12, (lech / Math.max(gamTrai, 1)) * 24));
  const canBang = lech === 0;

  return (
    <svg viewBox="0 0 420 230" className="w-full max-w-[420px]" role="img"
         aria-label={canBang ? 'Cân thăng bằng' : lech < 0 ? 'Đĩa bên trái nặng hơn' : 'Đĩa bên phải nặng hơn'}>
      {/* Trụ và đế */}
      <rect x="200" y="70" width="20" height="120" rx="4" fill="#94a3b8" />
      <rect x="140" y="188" width="140" height="16" rx="8" fill="#64748b" />

      {/* Cán cân xoay quanh đỉnh trụ */}
      <g transform={`rotate(${Math.round(goc * 100) / 100} 210 72)`} style={{ transition: 'transform 500ms cubic-bezier(.4,0,.2,1)' }}>
        <rect x="40" y="66" width="340" height="12" rx="6" fill="#475569" />
        {/* Đĩa trái */}
        <g>
          <line x1="70" y1="72" x2="70" y2="112" stroke="#475569" strokeWidth="3" />
          <path d="M 20 112 L 120 112 L 104 138 L 36 138 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
          <text x="70" y="104" textAnchor="middle" fontSize="30">{emoji}</text>
        </g>
        {/* Đĩa phải */}
        <g>
          <line x1="350" y1="72" x2="350" y2="112" stroke="#475569" strokeWidth="3" />
          <path d="M 300 112 L 400 112 L 384 138 L 316 138 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
          <text x="350" y="104" textAnchor="middle" fontSize="17" fontWeight="800" fill="#334155">
            {gamPhai > 0 ? `${gamPhai >= 1000 ? `${gamPhai / 1000}kg` : `${gamPhai}g`}` : '—'}
          </text>
        </g>
      </g>

      {/* Nhãn kết quả */}
      <text x="210" y="222" textAnchor="middle" fontSize="14" fontWeight="800"
            fill={canBang ? '#16a34a' : '#b45309'}>
        {canBang ? '⚖️ Thăng bằng!' : lech < 0 ? `${ten} còn nặng hơn` : 'Quả cân đang nặng hơn'}
      </text>
    </svg>
  );
}
