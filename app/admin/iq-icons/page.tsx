'use client';

/* eslint-disable @next/next/no-img-element -- xem trước ảnh icon (ảnh mặc định cục bộ hoặc ảnh S3) */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, getToken } from '../lib/api';
import { ICON_GROUPS } from '../../khoa-hoc-iq/lib/iconRegistry';
import { defaultImg } from '../../khoa-hoc-iq/lib/assets';
import { refreshIqIcons } from './actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_SIZE = 2 * 1024 * 1024;

export default function IqIconsAdminPage() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    apiFetch<Record<string, string>>('/iq-icons')
      .then((m) => setMap(m ?? {}))
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Không tải được danh sách icon'))
      .finally(() => setLoading(false));
  }, []);

  const total = ICON_GROUPS.reduce((n, g) => n + g.icons.length, 0);
  const changed = ICON_GROUPS.reduce((n, g) => n + g.icons.filter((i) => map[i.key]).length, 0);
  const q = query.trim().toLowerCase();

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
      toast.success('Đã thay icon');
    } catch (e) {
      toast.error('Upload thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function resetFor(key: string) {
    if (!confirm('Khôi phục ảnh mặc định cho icon này?')) return;
    setBusy(key);
    try {
      await apiFetch(`/iq-icons/${encodeURIComponent(key)}`, { method: 'DELETE' });
      setMap((m) => {
        const next = { ...m };
        delete next[key];
        return next;
      });
      await refreshIqIcons();
      toast.success('Đã khôi phục ảnh mặc định');
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
          <h1 className="text-2xl font-bold text-gray-900">🧠 Icon khu Toán IQ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload ảnh để thay icon tương ứng trên trang <b>/khoa-hoc-iq</b>. Chưa upload thì dùng ảnh mặc định. Ảnh PNG nền trong suốt, tối đa 2 MB,
            nên cùng tỉ lệ với ảnh mặc định.
          </p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            Đã thay: {changed}/{total} icon
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm icon…"
          className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loadError && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Chưa tải được danh sách icon đã thay từ API ({loadError}). Kiểm tra backend đã có API <code>/api/iq-icons</code> chưa.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải…</p>
      ) : (
        ICON_GROUPS.map((group) => {
          const icons = group.icons.filter((i) => !q || `${i.key} ${i.label} ${i.where}`.toLowerCase().includes(q));
          if (icons.length === 0) return null;
          return (
            <section key={group.title} className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-gray-800">{group.title}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {icons.map((icon) => {
                  const custom = map[icon.key];
                  return (
                    <div key={icon.key} className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
                        <img src={custom || defaultImg(icon.key)} alt={icon.label} className="max-h-24 max-w-full object-contain" />
                        <span
                          className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${custom ? 'bg-emerald-500' : 'bg-gray-400'}`}
                        >
                          {custom ? 'Đã thay' : 'Mặc định'}
                        </span>
                        {custom && (
                          <img
                            src={defaultImg(icon.key)}
                            alt="Ảnh mặc định"
                            title="Ảnh mặc định"
                            className="absolute bottom-1 right-1 h-8 w-8 rounded bg-white object-contain p-0.5 ring-1 ring-gray-200"
                          />
                        )}
                      </div>
                      <div className="mt-2 flex-1">
                        <div className="text-sm font-bold text-gray-900">{icon.label}</div>
                        <div className="text-xs text-gray-500">{icon.where}</div>
                        <code className="text-[10px] text-gray-400">{icon.key}</code>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          disabled={busy === icon.key}
                          onClick={() => inputs.current[icon.key]?.click()}
                          className="flex-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          {busy === icon.key ? 'Đang tải…' : custom ? 'Đổi ảnh' : 'Upload ảnh'}
                        </button>
                        {custom && (
                          <button
                            type="button"
                            disabled={busy === icon.key}
                            onClick={() => resetFor(icon.key)}
                            className="rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                          >
                            Mặc định
                          </button>
                        )}
                      </div>
                      <input
                        ref={(el) => {
                          inputs.current[icon.key] = el;
                        }}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadFor(icon.key, f);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
