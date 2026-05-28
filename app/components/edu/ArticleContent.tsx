'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  html: string;
  className?: string;
}

export default function ArticleContent({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [openAlt, setOpenAlt] = useState<string>('');
  const [zoom, setZoom] = useState(1);

  // Gắn handler click cho mọi <img> trong content
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll('img'));
    const handlers: { el: HTMLImageElement; fn: () => void }[] = [];
    imgs.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.style.transition = 'transform 0.15s ease';
      const fn = () => {
        setOpenSrc(img.currentSrc || img.src);
        setOpenAlt(img.alt || '');
        setZoom(1);
      };
      img.addEventListener('click', fn);
      handlers.push({ el: img, fn });
    });
    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    };
  }, [html]);

  // Đóng bằng phím Escape
  useEffect(() => {
    if (!openSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSrc(null);
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(4, z + 0.25));
      if (e.key === '-') setZoom((z) => Math.max(0.5, z - 0.25));
    };
    document.addEventListener('keydown', onKey);
    // Khóa scroll body
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openSrc]);

  return (
    <>
      <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />

      {openSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setOpenSrc(null)}
        >
          {/* Toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.25)); }}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-white/90 text-sm font-medium w-14 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.25)); }}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-colors"
              title="Phóng to"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpenSrc(null); }}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur transition-colors ml-2"
              title="Đóng (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Ảnh full */}
          <div
            className="relative max-w-[95vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={openSrc}
              alt={openAlt}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease',
                maxWidth: '95vw',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
              className="block select-none"
              draggable={false}
            />
          </div>

          {/* Caption */}
          {openAlt && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80vw] text-center">
              <p className="text-white/90 text-sm bg-black/40 backdrop-blur px-4 py-2 rounded-full truncate">
                {openAlt}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
