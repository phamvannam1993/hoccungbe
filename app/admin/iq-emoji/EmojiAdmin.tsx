'use client';

/* eslint-disable @next/next/no-img-element -- xem trước ảnh emoji đã upload (S3) */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, getToken } from '../lib/api';
import { refreshIqIcons } from '../iq-icons/actions';

export type EmojiUsage = { key: string; emoji: string; count: number; places: string[]; sample: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_SIZE = 2 * 1024 * 1024;
type Filter = 'all' | 'changed' | 'default';

export default function EmojiAdmin({ items }: { items: EmojiUsage[] }) {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    apiFetch<Record<string, string>>('/iq-icons')
      .then((m) => setMap(m ?? {}))
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Không tải được danh sách'))
      .finally(() => setLoading(false));
  }, []);

  const changed = items.filter((i) => map[i.key]).length;
  const q = query.trim().toLowerCase();
  const shown = items.filter((i) => {
    if (filter === 'changed' && !map[i.key]) return false;
    if (filter === 'default' && map[i.key]) return false;
    if (!q) return true;
    return i.emoji.includes(query.trim()) || i.key.includes(q) || i.places.some((p) => p.toLowerCase().includes(q)) || i.sample.toLowerCase().includes(q);
  });

  async function uploadFor(key: string, file: File) {
    if (!file.type.startsWith('image/')) return toast.error('Chỉ nhận tệp ảnh');
    if (file.size > MAX_SIZE) return toast.error('Ảnh tối đa 2 MB');
    setBusy(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const token = getToken();
      const res = await fetch(`${API_URL}/api/iq-icons/${encodeURIComponent(key)}/upload`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) throw new Error('Phiên đăng nhập hết hạn hoặc không có quyền admin');
      if (!res.ok || !data.imageUrl) throw new Error(data.message || `Lỗi ${res.status}`);
      setMap((m) => ({ ...m, [key]: data.imageUrl }));
      await refreshIqIcons();
      toast.success('Đã thay emoji bằng ảnh');
    } catch (e) {
      toast.error('Upload thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function resetFor(key: string) {
    if (!confirm('Bỏ ảnh, dùng lại emoji gốc?')) return;
    setBusy(key);
    try {
      await apiFetch(`/iq-icons/${encodeURIComponent(key)}`, { method: 'DELETE' });
      setMap((m) => {
        const next = { ...m };
        delete next[key];
        return next;
      });
      await refreshIqIcons();
      toast.success('Đã dùng lại emoji gốc');
    } catch (e) {
      toast.error('Khôi phục thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">🟥 Emoji trong bài Toán IQ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Các emoji đang dùng trong câu hỏi, đáp án và lý thuyết của khu <b>/khoa-hoc-iq</b>. Upload ảnh thì emoji đó được thay bằng ảnh ở
            mọi chỗ xuất hiện. Nên dùng ảnh vuông, nền trong suốt, tối đa 2 MB. Emoji đồng hồ đã được vẽ sẵn nên không có ở đây.
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            Đã thay: {changed}/{items.length} emoji
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="changed">Đã thay ảnh</option>
            <option value="default">Chưa thay</option>
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dán emoji hoặc tìm theo khóa (L2K01)…"
            className="w-72 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Chưa tải được danh sách ảnh đã thay từ API ({loadError}). Kiểm tra backend đã có API <code>/api/iq-icons</code> chưa.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải…</p>
      ) : shown.length === 0 ? (
        <p className="text-gray-500">Không có emoji nào khớp.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {shown.map((it) => {
            const custom = map[it.key];
            return (
              <div key={it.key} className="flex flex-col rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm">
                <div className="relative flex h-24 items-center justify-center gap-2 rounded-lg bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
                  {custom ? (
                    <>
                      <img src={custom} alt={it.emoji} className="h-16 w-16 object-contain" />
                      <span className="absolute bottom-1 right-1 rounded bg-white px-1 text-xl leading-none ring-1 ring-gray-200" title="Emoji gốc">
                        {it.emoji}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl leading-none">{it.emoji}</span>
                  )}
                  <span className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${custom ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                    {custom ? 'Đã thay' : 'Emoji'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(open === it.key ? null : it.key)}
                  className="mt-2 flex-1 text-left text-xs text-gray-600 hover:text-blue-600"
                  title="Xem chỗ dùng"
                >
                  <b className="text-gray-900">{it.count} lần</b> · {it.places.length} chỗ
                  <code className="block truncate text-[10px] text-gray-400">{it.key}</code>
                </button>
                {open === it.key && (
                  <div className="mt-1 max-h-40 overflow-auto rounded bg-gray-50 p-1.5 text-[11px] text-gray-600">
                    <p className="mb-1 italic">VD: {it.sample}</p>
                    {it.places.map((p) => (
                      <div key={p}>{p}</div>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    disabled={busy === it.key}
                    onClick={() => inputs.current[it.key]?.click()}
                    className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {busy === it.key ? 'Đang tải…' : custom ? 'Đổi ảnh' : 'Upload'}
                  </button>
                  {custom && (
                    <button
                      type="button"
                      disabled={busy === it.key}
                      onClick={() => resetFor(it.key)}
                      className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      title="Dùng lại emoji gốc"
                    >
                      Bỏ
                    </button>
                  )}
                </div>
                <input
                  ref={(el) => {
                    inputs.current[it.key] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFor(it.key, f);
                    e.target.value = '';
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
