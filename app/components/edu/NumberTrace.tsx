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
  onDone: () => void;
}

export default function NumberTrace({ number, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
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
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 12;
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
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    setHasDrawn(false);
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
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      <div className="flex gap-3 mt-1">
        <button
          onClick={handleClear}
          className="px-6 py-2.5 rounded-full border-2 border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all"
        >
          Xóa
        </button>
        <button
          onClick={onDone}
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
    </div>
  );
}
