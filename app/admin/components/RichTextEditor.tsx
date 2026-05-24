'use client';

import dynamic from 'next/dynamic';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import('react-quill-new');
    const { default: ImageResize } = await import('quill-image-resize-module-react');
    const flag = '__imageResizeRegistered';
    if (!(Quill as unknown as Record<string, unknown>)[flag]) {
      Quill.register('modules/imageResize', ImageResize);
      (Quill as unknown as Record<string, unknown>)[flag] = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function Comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

async function uploadImageToS3(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/upload/image`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!data.url) throw new Error(data.message || 'Upload failed');
  return data.url;
}

function RichTextEditor({ value, onChange, placeholder, height = 320 }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [localValue, setLocalValue] = useState(value);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const initialValueRef = useRef(value);
  const isFirstChangeRef = useRef(true);

  const isEffectivelyEmpty = useCallback((html: string) => {
    if (!html) return true;
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length === 0;
  }, []);

  const propagate = useCallback((val: string) => {
    isTypingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { isTypingRef.current = false; onChange(val); }, 400);
  }, [onChange]);

  useEffect(() => {
    if (!isTypingRef.current) setLocalValue(value);
  }, [value]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleVisualChange = useCallback((content: string) => {
    setLocalValue(content);
    if (isFirstChangeRef.current) {
      isFirstChangeRef.current = false;
      if (isEffectivelyEmpty(initialValueRef.current) && isEffectivelyEmpty(content)) return;
    }
    propagate(content);
  }, [propagate, isEffectivelyEmpty]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    propagate(val);
  }, [propagate]);

  // Custom image handler: open file picker → upload to S3 → insert URL
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImageToS3(file);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const quill = (quillRef.current as any)?.getEditor?.();
        if (!quill) return;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      } catch {
        alert('Upload ảnh thất bại');
      }
    };
    input.click();
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
    // 'Toolbar' sub-module causes Attributor errors — use Resize + DisplaySize only
    imageResize: {
      modules: ['Resize', 'DisplaySize'],
    },
  }), [imageHandler]);

  const FORMATS = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'blockquote', 'code-block', 'align', 'link', 'image',
  ];

  // Add click handler on images to show delete button
  useEffect(() => {
    if (mode !== 'visual') return;
    const container = document.querySelector('.bhh-quill .ql-editor');
    if (!container) return;

    let deleteBtn: HTMLButtonElement | null = null;

    const removeBtn = () => { deleteBtn?.remove(); deleteBtn = null; };

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG') { removeBtn(); return; }

      removeBtn();
      const img = target as HTMLImageElement;
      const rect = img.getBoundingClientRect();
      const containerRect = (container as HTMLElement).getBoundingClientRect();

      deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.title = 'Xóa ảnh';
      deleteBtn.style.cssText = `
        position: fixed;
        top: ${rect.top - 14}px;
        left: ${rect.right - 14}px;
        z-index: 9999;
        width: 24px; height: 24px;
        background: #ef4444; color: white;
        border: none; border-radius: 50%;
        font-size: 16px; line-height: 1;
        cursor: pointer; display: flex;
        align-items: center; justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      `;
      // suppress unused variable warning
      void containerRect;
      deleteBtn.onmousedown = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const quill = (quillRef.current as any)?.getEditor?.();
        img.remove();
        if (quill) {
          const newHtml = quill.root.innerHTML;
          quill.clipboard.dangerouslyPasteHTML(newHtml);
        }
        removeBtn();
      };
      document.body.appendChild(deleteBtn);
    };

    container.addEventListener('click', handleClick);
    document.addEventListener('scroll', removeBtn, true);
    return () => {
      container.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', removeBtn, true);
      removeBtn();
    };
  }, [mode, localValue]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex justify-end border-b border-gray-200 bg-gray-50">
        {(['visual', 'code'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={`px-4 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              mode === tab
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'visual' ? 'Trực quan' : 'HTML'}
          </button>
        ))}
      </div>

      {mode === 'visual' ? (
        <div>
          <style>{`
            .bhh-quill .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #E5E7EB; padding: 8px; }
            .bhh-quill .ql-container.ql-snow { border: none; font-size: 14px; font-family: inherit; }
            .bhh-quill .ql-editor { height: ${height}px; overflow-y: auto; resize: vertical; padding: 12px; color: #111827; line-height: 1.7; }
            .bhh-quill .ql-editor.ql-blank::before { color: #9CA3AF; font-style: normal; }
            .bhh-quill .ql-editor img { max-width: 100%; height: auto; display: block; margin: 8px auto; border-radius: 4px; cursor: pointer; }
            .bhh-quill .ql-snow .ql-stroke { stroke: #6B7280; }
            .bhh-quill .ql-snow button:hover .ql-stroke, .bhh-quill .ql-snow button.ql-active .ql-stroke { stroke: #2563EB; }
            .bhh-quill .ql-snow .ql-fill { fill: #6B7280; }
            .bhh-quill .ql-snow button:hover .ql-fill, .bhh-quill .ql-snow button.ql-active .ql-fill { fill: #2563EB; }
          `}</style>
          <div className="bhh-quill">
            <ReactQuill
              forwardedRef={quillRef}
              theme="snow"
              value={localValue}
              onChange={handleVisualChange}
              modules={modules}
              formats={FORMATS}
              placeholder={placeholder}
            />
          </div>
        </div>
      ) : (
        <textarea
          value={localValue}
          onChange={handleCodeChange}
          placeholder={placeholder}
          style={{ height: `${height + 42}px` }}
          className="w-full p-3 font-mono text-xs text-gray-700 bg-gray-50 resize-y outline-none leading-relaxed"
        />
      )}
    </div>
  );
}

export default React.memo(RichTextEditor);
