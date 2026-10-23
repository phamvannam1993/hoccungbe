'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '../../lib/api';
import Pagination from '../components/Pagination';
import { PHONICS_IMAGE_WORDS, PHONICS_SECTIONS, buildVocabFallback, resolvePhonicsImage, type PhonicsSection } from '../../lib/phonicsWords';
import { VOCAB_TOPICS } from '../../lib/vocab';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PAGE_SIZE = 24;

// Ảnh lưu chung bảng vocab_images (/api/vocab-images) với khóa "phonics:<từ>" — xem lib/phonicsWords.ts.
// Từ chưa có ảnh riêng thì trang Phonics tự lấy ảnh trang Từ vựng cùng từ (cat → dong-vat:cat).
const FALLBACK = buildVocabFallback(VOCAB_TOPICS);
const TOPIC_NAME = Object.fromEntries(VOCAB_TOPICS.map((t) => [t.slug, t.heading]));

export default function AdminPhonicsImagesPage() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [section, setSection] = useState<PhonicsSection | 'all'>('all');
  const [query, setQuery] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiFetch<Record<string, string>>('/vocab-images')
      .then((data) => setMap(data || {}))
      .catch(() => setMap({}))
      .finally(() => setLoading(false));
  }, []);

  const total = PHONICS_IMAGE_WORDS.length;
  const resolved = useMemo(
    () => Object.fromEntries(PHONICS_IMAGE_WORDS.map((w) => [w.key, resolvePhonicsImage(w.key, map, FALLBACK)])),
    [map],
  );
  const own = PHONICS_IMAGE_WORDS.filter((w) => resolved[w.key]?.from === 'phonics').length;
  const fromVocab = PHONICS_IMAGE_WORDS.filter((w) => resolved[w.key]?.from === 'vocab').length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PHONICS_IMAGE_WORDS.filter((item) => {
      if (section !== 'all' && !item.sections.includes(section)) return false;
      if (onlyMissing && resolved[item.key]) return false;
      if (q && !`${item.word} ${item.vi} ${item.places.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [section, query, onlyMissing, resolved]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function uploadFor(key: string, file: File) {
    setBusy(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/image`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.url) throw new Error(data.message || 'Không nhận được URL ảnh');
      await apiFetch(`/vocab-images/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl: data.url }),
      });
      setMap((m) => ({ ...m, [key]: data.url }));
    } catch (e) {
      alert('Upload thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function removeFor(key: string) {
    if (!confirm('Gỡ ảnh riêng của từ này? Từ sẽ dùng lại ảnh trang Từ vựng (nếu có) hoặc emoji.')) return;
    setBusy(key);
    try {
      await apiFetch(`/vocab-images/${encodeURIComponent(key)}`, { method: 'DELETE' });
      setMap((m) => {
        const next = { ...m };
        delete next[key];
        return next;
      });
    } catch (e) {
      alert('Gỡ ảnh thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  const resetPage = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">🔉 Phonics — Ảnh minh hoạ</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload ảnh cho từng từ của trang{' '}
          <a href="/phonics-tieng-anh" target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:underline">
            Phonics tiếng Anh
          </a>{' '}
          (âm chữ cái, ghép vần CVC, họ từ, âm ghép). Có ảnh → thẻ, bông hoa, quiz và bản in hiển thị ảnh thay emoji; chưa có → dùng emoji.
          Mỗi từ một ảnh, dùng chung ở mọi mục có từ đó. Từ chưa có ảnh riêng sẽ <b>tự lấy ảnh của trang Từ vựng</b> cùng từ (nếu có);
          upload ảnh riêng ở đây sẽ thay ảnh đó chỉ trên trang Phonics.
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-600">
          Đã có ảnh: {own + fromVocab}/{total} từ <span className="font-medium text-gray-500">(ảnh riêng {own} · lấy từ Từ vựng {fromVocab})</span>
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={section}
          onChange={(e) => resetPage(setSection)(e.target.value as PhonicsSection | 'all')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả mục ({total})</option>
          {PHONICS_SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} ({PHONICS_IMAGE_WORDS.filter((w) => w.sections.includes(s.id)).length})
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <input type="checkbox" checked={onlyMissing} onChange={(e) => resetPage(setOnlyMissing)(e.target.checked)} />
          Chỉ từ chưa có ảnh
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => resetPage(setQuery)(e.target.value)}
          placeholder="Tìm từ, nghĩa hoặc nhóm (vd -at, sh)…"
          className="ml-auto w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải…</p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-gray-400">Không có từ nào khớp bộ lọc.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((item) => {
              const res = resolved[item.key];
              const url = res?.url;
              const hasImg = !!url;
              const ownImg = res?.from === 'phonics';
              const vocabTopic = res?.vocabKey ? TOPIC_NAME[res.vocabKey.split(':')[0]] : undefined;
              return (
                <div key={item.key} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="relative mx-auto flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {url ? (
                      <Image src={url} alt={item.word} fill className="object-contain" unoptimized />
                    ) : (
                      <span className="text-6xl">{item.emoji || '🔤'}</span>
                    )}
                    {ownImg && (
                      <span className="absolute left-1 top-1 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Ảnh riêng</span>
                    )}
                    {res?.from === 'vocab' && (
                      <span
                        className="absolute left-1 top-1 rounded bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
                        title={`Lấy từ trang Từ vựng: ${res.vocabKey}`}
                      >
                        Từ vựng · {vocabTopic ?? res.vocabKey}
                      </span>
                    )}
                    {hasImg && <span className="absolute bottom-1 right-1 text-2xl" title="Emoji mặc định">{item.emoji}</span>}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-black text-gray-900">{item.word}</div>
                    <div className="text-xs text-gray-500">{item.vi}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {item.places.slice(0, 4).map((p) => (
                      <span key={p} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                        {p}
                      </span>
                    ))}
                    {item.places.length > 4 && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400" title={item.places.join(', ')}>
                        +{item.places.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy === item.key}
                      onClick={() => inputs.current[item.key]?.click()}
                      className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {busy === item.key ? 'Đang tải…' : ownImg ? 'Đổi ảnh' : hasImg ? 'Dùng ảnh khác' : 'Chọn ảnh'}
                    </button>
                    {ownImg && (
                      <button
                        type="button"
                        disabled={busy === item.key}
                        onClick={() => removeFor(item.key)}
                        className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Gỡ
                      </button>
                    )}
                  </div>
                  <input
                    ref={(el) => {
                      inputs.current[item.key] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadFor(item.key, f);
                      e.target.value = '';
                    }}
                  />
                </div>
              );
            })}
          </div>

          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
