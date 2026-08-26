'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '../../lib/api';
import Pagination from '../components/Pagination';
import { VOCAB_TOPICS } from '../../lib/vocab';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PAGE_SIZE = 24;

// Key ảnh của mỗi từ = "{slug}:{en}" (ổn định vì en không đổi).
function wordKey(slug: string, en: string) {
  return `${slug}:${en}`;
}

function isUrl(value: string | undefined): boolean {
  return !!value && /^https?:\/\//i.test(value);
}

type FlatWord = {
  id: string;
  en: string;
  vi: string;
  emoji: string;
  topicSlug: string;
  topicHeading: string;
};

// Làm phẳng toàn bộ từ của 48 chủ đề.
const ALL_WORDS: FlatWord[] = VOCAB_TOPICS.flatMap((t) =>
  t.words.map((w) => ({
    id: wordKey(t.slug, w.en),
    en: w.en,
    vi: w.vi,
    emoji: w.emoji,
    topicSlug: t.slug,
    topicHeading: t.heading,
  })),
);

export default function AdminVocabularyPage() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [topic, setTopic] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiFetch<Record<string, string>>('/vocab-images')
      .then((data) => setMap(data || {}))
      .catch(() => setMap({}))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [topic, query, onlyMissing]);

  const total = ALL_WORDS.length;
  const withImage = useMemo(() => ALL_WORDS.filter((w) => isUrl(map[w.id])).length, [map]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_WORDS.filter((item) => {
      if (topic !== 'all' && item.topicSlug !== topic) return false;
      if (onlyMissing && isUrl(map[item.id])) return false;
      if (q && !`${item.en} ${item.vi}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [topic, query, onlyMissing, map]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  async function uploadFor(id: string, file: File) {
    setBusy(id);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/image`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.url) throw new Error(data.message || 'Không nhận được URL ảnh');
      await apiFetch(`/vocab-images/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl: data.url }),
      });
      setMap((m) => ({ ...m, [id]: data.url }));
    } catch (e) {
      alert('Upload thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function removeFor(id: string) {
    if (!confirm('Gỡ ảnh của từ này? Từ sẽ hiển thị lại bằng emoji.')) return;
    setBusy(id);
    try {
      await apiFetch(`/vocab-images/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setMap((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
    } catch (e) {
      alert('Gỡ ảnh thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">🔤 Từ vựng tiếng Anh — Ảnh minh hoạ</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload ảnh cho từng từ trong {VOCAB_TOPICS.length} chủ đề. Có ảnh → trang từ vựng hiển thị ảnh thay emoji; chưa có → dùng emoji mặc định.
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-600">Đã có ảnh: {withImage}/{total} từ</p>
      </div>

      {/* Bộ lọc */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả chủ đề ({VOCAB_TOPICS.length})</option>
          {VOCAB_TOPICS.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.emoji} {t.heading} ({t.words.length})
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
          Chỉ từ chưa có ảnh
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm từ hoặc nghĩa…"
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
              const url = map[item.id];
              const hasImg = isUrl(url);
              return (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="relative mx-auto flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {hasImg ? (
                      <Image src={url} alt={item.en} fill className="object-contain" unoptimized />
                    ) : (
                      <span className="text-6xl">{item.emoji || '🔤'}</span>
                    )}
                    {hasImg && (
                      <span className="absolute left-1 top-1 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        Ảnh
                      </span>
                    )}
                    <span className="absolute right-1 top-1 rounded bg-gray-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {item.topicHeading}
                    </span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-black text-gray-900">{item.en}</div>
                    <div className="text-xs text-gray-500">{item.vi}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={busy === item.id}
                      onClick={() => inputs.current[item.id]?.click()}
                      className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {busy === item.id ? 'Đang tải…' : hasImg ? 'Đổi ảnh' : 'Chọn ảnh'}
                    </button>
                    {hasImg && (
                      <button
                        type="button"
                        disabled={busy === item.id}
                        onClick={() => removeFor(item.id)}
                        className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        Gỡ
                      </button>
                    )}
                  </div>
                  <input
                    ref={(el) => {
                      inputs.current[item.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadFor(item.id, f);
                      e.target.value = '';
                    }}
                  />
                </div>
              );
            })}
          </div>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}
