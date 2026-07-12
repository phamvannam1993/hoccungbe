'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface Props {
  html: string;
  className?: string;
}

// Regex chứa tất cả ký tự vô hình / format characters có thể gây ngắt từ
// Dùng \u escape để KHÔNG bị mất khi copy-paste source code
const INVISIBLE_CHARS_RE = new RegExp(
  '[' +
    '\\u00AD' +    // SOFT HYPHEN
    '\\u034F' +    // COMBINING GRAPHEME JOINER
    '\\u061C' +    // ARABIC LETTER MARK
    '\\u115F\\u1160' +  // HANGUL CHOSEONG/JUNGSEONG FILLER
    '\\u17B4\\u17B5' +  // KHMER VOWEL INHERENT
    '\\u180E' +    // MONGOLIAN VOWEL SEPARATOR
    '\\u200B-\\u200F' + // ZERO WIDTH SPACE / NON-JOINER / JOINER / LRM / RLM
    '\\u202A-\\u202E' + // BIDI controls
    '\\u2060-\\u2064' + // WORD JOINER and invisible operators
    '\\u2066-\\u206F' + // BIDI isolates / deprecated formatting
    '\\u3164' +    // HANGUL FILLER
    '\\uFEFF' +    // BOM / ZWNBSP
    '\\uFFA0' +    // HALFWIDTH HANGUL FILLER
  ']',
  'g'
);

export default function ArticleContent({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const [openAlt, setOpenAlt] = useState<string>('');
  const [zoom, setZoom] = useState(1);

  // Gắn handler click cho mọi <img> + ÉP CỨNG style chống ngắt từ
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // 1. Quét text node, loại bỏ ký tự ẩn còn sót (kể cả từ inline style)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) textNodes.push(n as Text);
    textNodes.forEach((tn) => {
      if (tn.nodeValue) {
        tn.nodeValue = tn.nodeValue
          .replace(/ /g, ' ')      // NBSP → space thường (cho phép ngắt dòng)
          .replace(INVISIBLE_CHARS_RE, '');
      }
    });

    // 2. Ép cứng style chống ngắt từ tiếng Việt trên MỌI element con
    root.querySelectorAll<HTMLElement>('*').forEach((el) => {
      // Bỏ qua pre/code (cần giữ định dạng)
      const tag = el.tagName.toLowerCase();
      if (tag === 'pre' || tag === 'code') {
        el.style.setProperty('white-space', 'pre-wrap', 'important');
        el.style.setProperty('overflow-wrap', 'anywhere', 'important');
        el.style.setProperty('word-break', 'normal', 'important');
        return;
      }
      el.style.setProperty('white-space', 'normal', 'important');
      el.style.setProperty('word-break', 'normal', 'important');
      el.style.setProperty('overflow-wrap', 'break-word', 'important');
      el.style.setProperty('hyphens', 'none', 'important');
      el.style.removeProperty('word-spacing');
    });

    // 3. Xóa <wbr>
    root.querySelectorAll('wbr').forEach((w) => w.remove());

    // 4. Gắn click handler cho ảnh (lightbox)
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

  useEffect(() => {
    if (!openSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSrc(null);
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(4, z + 0.25));
      if (e.key === '-') setZoom((z) => Math.max(0.5, z - 0.25));
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openSrc]);

  // Làm sạch HTML từ editor để không ngắt giữa từ tiếng Việt
  const cleanedHtml = html
    // QUAN TRỌNG: thay &nbsp; (U+00A0 - non-breaking space) bằng space thường
    // Editor (Word/Google Docs) thường để &nbsp; giữa từ → khiến cả câu là 1 "từ"
    // không có chỗ ngắt → browser cắt mid-word
    .replace(/&nbsp;/gi, ' ')
    .replace(/ /g, ' ')
    // Strip ký tự ẩn (soft hyphen, zero-width, word joiner, BOM, ...)
    .replace(INVISIBLE_CHARS_RE, '')
    // Strip <wbr> tag
    .replace(/<wbr\s*\/?>/gi, '')
    // Strip HTML entities tương đương
    .replace(/&(#x?(00AD|200B|200C|200D|2060|FEFF|173|8203|8204|8205|8288|65279)|shy|zwsp|zwnj|zwj);/gi, '')
    // Strip inline style nguy hiểm
    .replace(/white-space\s*:\s*(nowrap|pre)\s*;?/gi, '')
    .replace(/word-break\s*:\s*[^;"']+;?/gi, '')
    .replace(/\bwidth\s*:\s*\d{4,}px\s*;?/gi, '');

  return (
    <>
      <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: cleanedHtml }} />

      {openSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setOpenSrc(null)}
        >
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
