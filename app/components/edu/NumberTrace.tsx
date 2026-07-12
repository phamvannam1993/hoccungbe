'use client';

import { useEffect, useRef, useState } from 'react';

// SVG viewBox paths for digits 0-9 (outline style, stroke-only)
const DIGIT_PATHS: Record<string, string> = {
  '0': 'M50,10 C20,10 10,30 10,55 C10,80 20,95 50,95 C80,95 90,80 90,55 C90,30 80,10 50,10 Z',
  '1': 'M35,25 L50,15 L50,90 M35,90 L65,90',
  '2': 'M20,30 C20,15 35,10 50,10 C65,10 80,20 80,35 C80,55 20,70 15,90 L85,90',
  '3': 'M20,15 L75,15 L45,50 C65,50 85,60 85,75 C85,90 70,95 50,95 C30,95 15,85 15,75',
  '4': 'M65,90 L65,10 L10,65 L85,65',
  '5': 'M75,15 L25,15 L20,50 C30,42 42,40 52,42 C68,44 82,56 82,72 C82,88 68,95 50,95 C32,95 18,86 16,74',
  '6': 'M70,15 C55,8 20,20 15,55 C10,80 25,95 50,95 C72,95 85,80 85,65 C85,50 72,40 50,40 C28,40 15,52 15,65',
  '7': 'M15,15 L85,15 L40,95',
  '8': 'M50,50 C28,50 18,38 18,27 C18,16 28,10 50,10 C72,10 82,16 82,27 C82,38 72,50 50,50 C24,50 14,62 14,74 C14,86 26,95 50,95 C74,95 86,86 86,74 C86,62 76,50 50,50',
  '9': 'M85,40 C85,22 70,10 50,10 C30,10 15,22 15,40 C15,58 30,65 50,65 C70,65 85,58 85,40 Z M85,40 C88,65 78,90 55,95',
};

interface Props {
  number: string;       // "5" or "3"
  onDone: (score: number) => void;  // score 0..1 (0=trượt, 1=hoàn hảo)
}

export default function NumberTrace({ number, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [scoreLabel, setScoreLabel] = useState<string>('');
  // Vị trí bút (theo tọa độ DISPLAY, không phải canvas pixel) — để hiển thị icon bút
  const [penPos, setPenPos] = useState<{ x: number; y: number } | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Lấy tọa độ display (px trên màn hình, không scale)
  function getDisplayPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      if (!t) return null;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  const digit = String(number).trim()[0] ?? '0';

  // Draw guide number on canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Guide digit — large, light gray
    ctx.save();
    ctx.font = `bold ${Math.floor(H * 0.75)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(200,210,230,0.6)';
    ctx.fillText(digit, W / 2, H / 2);

    // Dashed border outline of the digit for tracing
    ctx.strokeStyle = 'rgba(150,170,210,0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeText(digit, W / 2, H / 2);
    ctx.restore();
  }, [digit]);

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      if (!t) return null;
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setDrawing(true);
    setHasDrawn(true);
    const pos = getPos(e);
    lastPos.current = pos;
    setPenPos(getDisplayPos(e));
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setPenPos(getDisplayPos(e));
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    const pos = getPos(e);
    if (!pos) return;
    const from = lastPos.current ?? pos;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1d4ed8'; // xanh đậm hơn
    ctx.lineWidth = 22;           // nét đậm hơn → dễ tô
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    ctx.stroke();

    lastPos.current = pos;
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setDrawing(false);
    lastPos.current = null;
    // Giữ vị trí bút khi nhấc tay
  }

  // ─── Chấm điểm chính xác cho câu tô số ────────────────────────────────────
  // Cách tiếp cận:
  // 1. Tạo "vùng tô hợp lệ" = chữ số mẫu dày lên thành DẢI ~ độ rộng nét user
  // 2. accuracy = % pixel nét user nằm trong dải
  // 3. coverage = % dải được nét user phủ
  // 4. Phạt nếu nét quá ít (vẽ qua loa) hoặc quá nhiều (bôi đầy canvas)
  function computeScore(): number {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    const W = canvas.width;
    const H = canvas.height;

    // 1. Render chữ số mẫu dạng STROKE dày (tạo dải tô hợp lệ)
    const tCanvas = document.createElement('canvas');
    tCanvas.width = W;
    tCanvas.height = H;
    const tctx = tCanvas.getContext('2d');
    if (!tctx) return 0;
    tctx.font = `bold ${Math.floor(H * 0.75)}px Arial`;
    tctx.textAlign = 'center';
    tctx.textBaseline = 'middle';
    // Stroke dày 36px → tạo dải đủ rộng để bé tô lệch ±12px vẫn được tính
    // (lớn hơn nét user 22px để có dung sai)
    tctx.lineWidth = 36;
    tctx.lineJoin = 'round';
    tctx.lineCap = 'round';
    tctx.strokeStyle = 'black';
    tctx.strokeText(digit, W / 2, H / 2);
    // Fill thêm để bao cả phần trong (nhất là các nét trong/lỗ thủng số 0, 8)
    tctx.fillStyle = 'black';
    tctx.fillText(digit, W / 2, H / 2);
    const targetData = tctx.getImageData(0, 0, W, H).data;

    // 2. Nét user
    const userData = ctx.getImageData(0, 0, W, H).data;

    let targetPx = 0;
    let userOnTarget = 0;
    let userTotal = 0;

    for (let i = 0; i < userData.length; i += 4) {
      const isTarget = targetData[i + 3] > 64;
      if (isTarget) targetPx++;

      // Nét vẽ #1d4ed8 → R~29, G~78, B~216 (xanh đậm)
      const r = userData[i], g = userData[i + 1], b = userData[i + 2];
      const isUserStroke = r < 100 && g < 130 && b > 180;
      if (isUserStroke) {
        userTotal++;
        if (isTarget) userOnTarget++;
      }
    }

    if (targetPx === 0 || userTotal === 0) return 0;

    const totalCanvasPx = W * H;
    const accuracy = userOnTarget / userTotal;        // % nét trúng dải
    const coverage = userOnTarget / targetPx;          // % dải được phủ

    // Phạt nếu vẽ quá ít (< 15% diện tích chữ mẫu) — vẽ qua loa
    const userRatio = userTotal / targetPx;
    let effortPenalty = 1;
    if (userRatio < 0.15) effortPenalty = 0.4;          // vẽ quá ít
    else if (userRatio < 0.3) effortPenalty = 0.7;
    // Phạt nếu vẽ tràn lan ra cả canvas (> 80% canvas)
    if (userTotal / totalCanvasPx > 0.5) effortPenalty *= 0.5;

    // Trọng số: accuracy quan trọng hơn coverage (bé chỉ cần tô đúng vùng, không cần kín hoàn toàn)
    const raw = accuracy * 0.65 + Math.min(1, coverage * 1.5) * 0.35;
    return Math.max(0, Math.min(1, raw * effortPenalty));
  }

  function handleDone() {
    const raw = computeScore();
    // Ngưỡng dễ hơn cho bé:
    // ≥ 0.7 → tuyệt vời (1.0 điểm)
    // ≥ 0.5 → tốt (0.8)
    // ≥ 0.3 → khá (0.5)
    // < 0.3 → cần luyện thêm (0.2)
    let final: number;
    if (raw >= 0.7) { final = 1; setScoreLabel(`🌟 Tuyệt vời! (${Math.round(raw * 100)}%)`); }
    else if (raw >= 0.5) { final = 0.8; setScoreLabel(`😊 Tốt lắm! (${Math.round(raw * 100)}%)`); }
    else if (raw >= 0.3) { final = 0.5; setScoreLabel(`👍 Khá rồi! (${Math.round(raw * 100)}%)`); }
    else { final = 0.2; setScoreLabel(`💪 Cần tô kỹ hơn (${Math.round(raw * 100)}%)`); }
    onDone(final);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    setHasDrawn(false);
    setPenPos(null);
    setScoreLabel('');
    // Redraw guide
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.font = `bold ${Math.floor(H * 0.75)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(200,210,230,0.6)';
    ctx.fillText(digit, W / 2, H / 2);
    ctx.strokeStyle = 'rgba(150,170,210,0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeText(digit, W / 2, H / 2);
    ctx.restore();
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <p className="text-sm text-gray-500">Dùng ngón tay tô theo số bên dưới</p>

      <div className="relative rounded-2xl overflow-hidden border-4 border-blue-200 bg-white shadow-lg"
           style={{ width: 240, height: 240 }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full h-full touch-none"
          style={{ cursor: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={(e) => { endDraw(e); setPenPos(null); }}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Bút SVG theo dõi ngón tay/chuột — mũi bút ở (50%, 100%) căn chính xác */}
        {penPos && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: penPos.x,
              top: penPos.y,
              width: 44,
              height: 56,
              // Mũi bút ở giữa-đáy → translate(-50%, -100%) đặt mũi tại con trỏ
              transform: `translate(-50%, -100%) ${drawing ? 'rotate(-8deg)' : 'rotate(0deg)'}`,
              transformOrigin: '50% 100%',
              transition: 'transform 80ms ease-out',
              filter: drawing
                ? 'drop-shadow(0 4px 6px rgba(29,78,216,0.5))'
                : 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))',
              zIndex: 10,
            }}
          >
            <svg viewBox="0 0 44 56" width="44" height="56">
              {/* Cục tẩy hồng */}
              <rect x="14" y="2" width="16" height="8" rx="2" fill="#FF9DB3" />
              {/* Vành kim loại */}
              <rect x="14" y="9" width="16" height="3" fill="#C0C0C0" />
              {/* Thân bút gỗ */}
              <rect x="14" y="11" width="16" height="32" fill="#FFC83D" />
              <line x1="18" y1="11" x2="18" y2="43" stroke="#E8A82A" strokeWidth="0.5" />
              <line x1="26" y1="11" x2="26" y2="43" stroke="#E8A82A" strokeWidth="0.5" />
              {/* Đầu bằng gỗ */}
              <polygon points="14,43 30,43 22,52" fill="#FFE0A0" stroke="#C8956A" strokeWidth="0.5" />
              {/* Mũi nhọn (graphite) — mũi tại (22, 56) */}
              <polygon points="20,49 24,49 22,56" fill="#1d4ed8" />
            </svg>
          </div>
        )}
        {/* Gợi ý ban đầu */}
        {!hasDrawn && !penPos && (
          <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-xs text-blue-600 font-bold">
            ✏️ Bấm và kéo để tô
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-1">
        <button
          onClick={handleClear}
          className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all"
        >
          Xóa
        </button>
        <button
          onClick={handleDone}
          disabled={!hasDrawn}
          className="px-8 py-2.5 rounded-full font-black text-white text-base shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-105 hover:-translate-y-0.5 active:scale-95"
          style={{
            background: hasDrawn ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#d1d5db',
            boxShadow: hasDrawn ? '0 4px 0 #15803d' : 'none',
          }}
        >
          Xong ✓
        </button>
      </div>
      {scoreLabel && (
        <p className="text-base font-bold text-center" style={{ color: '#16a34a' }}>{scoreLabel}</p>
      )}
    </div>
  );
}
