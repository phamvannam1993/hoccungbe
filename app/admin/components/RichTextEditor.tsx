'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table as TableExtension, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_URL}/api/upload/image`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!data.url) throw new Error(data.message || 'Upload failed');
  return data.url;
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  const btn = (label: string, action: () => void, active = false, title = '') => (
    <button
      key={label}
      type="button"
      title={title || label}
      onMouseDown={(e) => { e.preventDefault(); action(); }}
      className={`px-2 py-1 rounded text-sm transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      {label}
    </button>
  );

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch { alert('Upload ảnh thất bại'); }
  };

  return (
    <div className="flex flex-wrap gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
      {/* Heading */}
      <select
        value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : '0'}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: v as 1|2|3 }).run();
        }}
        className="text-sm px-2 py-1 border border-gray-200 rounded bg-white text-gray-700 mr-1"
      >
        <option value="0">Normal</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>

      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
      {btn('S', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}

      <span className="w-px bg-gray-200 mx-1 self-stretch" />

      {btn('≡', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Danh sách')}
      {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Danh sách số')}
      {btn('"', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'Trích dẫn')}
      {btn('<>', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), 'Code')}

      <span className="w-px bg-gray-200 mx-1 self-stretch" />

      {btn('⬤L', () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Căn trái')}
      {btn('⬤C', () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Căn giữa')}
      {btn('⬤R', () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Căn phải')}

      <span className="w-px bg-gray-200 mx-1 self-stretch" />

      {/* Image */}
      <button type="button" title="Chèn ảnh" onMouseDown={(e) => { e.preventDefault(); fileRef.current?.click(); }}
        className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100">🖼</button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }} />

      {/* Link */}
      {btn('🔗', () => {
        const url = window.prompt('URL:', editor.getAttributes('link').href || 'https://');
        if (url === null) return;
        if (url === '') editor.chain().focus().unsetLink().run();
        else editor.chain().focus().setLink({ href: url }).run();
      }, editor.isActive('link'), 'Chèn link')}

      <span className="w-px bg-gray-200 mx-1 self-stretch" />

      {/* Table */}
      <button type="button" title="Chèn bảng" onMouseDown={(e) => {
        e.preventDefault();
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      }} className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100">⊞</button>

      {editor.isActive('table') && (<>
        {btn('+Cột', () => editor.chain().focus().addColumnAfter().run(), false, 'Thêm cột')}
        {btn('-Cột', () => editor.chain().focus().deleteColumn().run(), false, 'Xóa cột')}
        {btn('+Hàng', () => editor.chain().focus().addRowAfter().run(), false, 'Thêm hàng')}
        {btn('-Hàng', () => editor.chain().focus().deleteRow().run(), false, 'Xóa hàng')}
        {btn('Xóa bảng', () => editor.chain().focus().deleteTable().run(), false, 'Xóa bảng')}
      </>)}

      <span className="w-px bg-gray-200 mx-1 self-stretch" />
      {btn('✕', () => editor.chain().focus().unsetAllMarks().clearNodes().run(), false, 'Xóa định dạng')}
    </div>
  );
}

function RichTextEditor({ value, onChange, placeholder, height = 320 }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [codeValue, setCodeValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUpdatingRef = useRef(false);

  const propagate = useCallback((val: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), 400);
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({ allowBase64: false }),
      TableExtension.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: placeholder || 'Nhập nội dung bài viết...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (isUpdatingRef.current) return;
      const html = editor.getHTML();
      setCodeValue(html);
      propagate(html);
    },
    editorProps: {
      handlePaste: (view, event) => {
        // Allow paste with full HTML (tables, inline styles)
        const html = event.clipboardData?.getData('text/html');
        if (!html) return false;
        event.preventDefault();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // Fix image sizes from external paste
        doc.querySelectorAll('img').forEach((img) => {
          img.style.removeProperty('width');
          img.style.removeProperty('height');
          img.style.maxWidth = '100%';
        });
        view.dispatch(
          view.state.tr.insertText('') // focus
        );
        setTimeout(() => {
          if (editor) {
            isUpdatingRef.current = true;
            editor.commands.insertContent(doc.body.innerHTML, {
              parseOptions: { preserveWhitespace: 'full' },
            });
            isUpdatingRef.current = false;
            const html2 = editor.getHTML();
            setCodeValue(html2);
            propagate(html2);
          }
        }, 0);
        return true;
      },
    },
  }, []);

  // Sync external value changes into editor
  useEffect(() => {
    if (!editor || isUpdatingRef.current) return;
    const current = editor.getHTML();
    if (current !== value) {
      isUpdatingRef.current = true;
      editor.commands.setContent(value, false);
      setCodeValue(value);
      isUpdatingRef.current = false;
    }
  }, [value, editor]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeValue(val);
    propagate(val);
  };

  const handleSwitchToVisual = () => {
    if (editor) {
      isUpdatingRef.current = true;
      editor.commands.setContent(codeValue, false);
      isUpdatingRef.current = false;
    }
    setMode('visual');
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <style>{`
        .tiptap-editor { outline: none; min-height: ${height}px; padding: 12px 16px; font-size: 14px; line-height: 1.7; color: #111827; }
        .tiptap-editor p { margin-bottom: 0.75rem; }
        .tiptap-editor h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .tiptap-editor h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .tiptap-editor h3 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.4rem; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .tiptap-editor blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #6b7280; margin: 0.75rem 0; }
        .tiptap-editor img { max-width: 100% !important; height: auto; border-radius: 6px; margin: 8px auto; display: block; }
        .tiptap-editor a { color: #c0392b; text-decoration: underline; }
        .tiptap-editor table { border-collapse: collapse; width: 100%; margin: 12px 0; table-layout: auto; }
        .tiptap-editor td, .tiptap-editor th { border: 1px solid #d1d5db; padding: 8px 12px; min-width: 60px; vertical-align: top; }
        .tiptap-editor th { background: #f3f4f6; font-weight: 600; }
        .tiptap-editor .selectedCell:after { background: rgba(37,99,235,0.1); content: ''; position: absolute; inset: 0; pointer-events: none; }
        .tiptap-editor p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; float: left; height: 0; }
        .tiptap-editor pre { background: #1f2937; color: #f9fafb; padding: 1rem; border-radius: 8px; overflow-x: auto; }
        .tiptap-editor code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        .tiptap-editor pre code { background: none; padding: 0; }
      `}</style>

      {/* Tab bar */}
      <div className="flex justify-end border-b border-gray-200 bg-gray-50">
        {(['visual', 'code'] as const).map((tab) => (
          <button key={tab} type="button"
            onClick={() => tab === 'visual' ? handleSwitchToVisual() : setMode('code')}
            className={`px-4 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              mode === tab ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab === 'visual' ? 'Trực quan' : 'HTML'}
          </button>
        ))}
      </div>

      {mode === 'visual' ? (
        <div>
          <MenuBar editor={editor} />
          <div style={{ minHeight: height, maxHeight: height * 2, overflowY: 'auto' }}>
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
        </div>
      ) : (
        <textarea
          value={codeValue}
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
