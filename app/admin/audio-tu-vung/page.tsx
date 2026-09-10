'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../../lib/api';
import Pagination from '../components/Pagination';

// Trang quản lý giọng đọc tiếng Việt của phần từ vựng.
//
// Mỗi dòng là một bản ghi trong bảng `tts_cache`: một đoạn chữ ↔ một tệp mp3
// trên S3. Trang web tra theo đoạn chữ, nên KHÔNG được đổi chữ ở đây — chỉ
// đổi tiếng đọc. Vì vậy chỉ có ba việc: nghe thử, thay tệp khác, xoá.
//
// Xoá là an toàn: lần sau trang web gặp đoạn chữ đó sẽ tự đọc bằng giọng dự
// phòng của trình duyệt, không vỡ gì cả.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PAGE_SIZE = 40;
const GIOI_HAN = 20 * 1024 * 1024;

type Dong = {
  cacheKey: string;
  text: string;
  audioUrl: string | null;
  durationMs: number | null;
  fileSize: number | null;
  updatedAt: string;
};

const giay = (ms: number | null) => (ms ? `${(ms / 1000).toFixed(2)}s` : '—');
const kb = (b: number | null) => (b ? `${Math.round(b / 1024)} KB` : '—');

export default function AdminAudioTuVungPage() {
  const [rows, setRows] = useState<Dong[]>([]);
  const [tong, setTong] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Ô tìm gõ tới đâu lọc tới đó sẽ gọi máy chủ liên tục, nên tách hai state:
  // `oTim` là chữ đang gõ, `tim` là chữ đã chốt để gọi API.
  const [oTim, setOTim] = useState('');
  const [tim, setTim] = useState('');

  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const nap = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({
      q: tim,
      limit: String(PAGE_SIZE),
      offset: String((page - 1) * PAGE_SIZE),
    });
    apiFetch<{ tong: number; rows: Dong[] }>(`/tts/admin/list?${qs}`)
      .then((d) => { setRows(d.rows || []); setTong(d.tong || 0); })
      .catch(() => { setRows([]); setTong(0); })
      .finally(() => setLoading(false));
  }, [tim, page]);

  useEffect(() => { nap(); }, [nap]);

  const soTrang = Math.max(1, Math.ceil(tong / PAGE_SIZE));

  async function thayTep(d: Dong, file: File) {
    if (!file.type.startsWith('audio/')) {
      alert('Chỉ nhận tệp âm thanh (mp3, m4a, wav…).');
      return;
    }
    if (file.size > GIOI_HAN) {
      alert(`Tệp nặng ${(file.size / 1024 / 1024).toFixed(1)}MB, vượt mức 20MB.`);
      return;
    }
    setBusy(d.cacheKey);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/audio`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.url) throw new Error(data.message || 'Không nhận được URL tệp');
      await apiFetch('/tts/admin/replace', {
        method: 'POST',
        body: JSON.stringify({ cacheKey: d.cacheKey, audioUrl: data.url }),
      });
      setRows((ds) => ds.map((x) => (x.cacheKey === d.cacheKey
        ? { ...x, audioUrl: data.url, fileSize: file.size, durationMs: null } : x)));
    } catch (e) {
      alert('Thay tệp thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function docLai(d: Dong) {
    setBusy(d.cacheKey);
    try {
      const kq = await apiFetch<{ audioUrl: string; durationMs: number }>('/tts/admin/regenerate', {
        method: 'POST',
        body: JSON.stringify({ cacheKey: d.cacheKey }),
      });
      setRows((ds) => ds.map((x) => (x.cacheKey === d.cacheKey
        ? { ...x, audioUrl: kq.audioUrl, durationMs: kq.durationMs } : x)));
    } catch (e) {
      alert('Đọc lại thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function xoa(d: Dong) {
    if (!confirm(`Xoá giọng đọc của “${d.text}”?\n\nTrang web sẽ quay về giọng máy của trình duyệt cho đoạn này.`)) return;
    setBusy(d.cacheKey);
    try {
      await apiFetch(`/tts/admin/${encodeURIComponent(d.cacheKey)}`, { method: 'DELETE' });
      setRows((ds) => ds.filter((x) => x.cacheKey !== d.cacheKey));
      setTong((t) => Math.max(0, t - 1));
    } catch (e) {
      alert('Xoá thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Giọng đọc tiếng Việt (từ vựng)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Nghe thử từng đoạn, đọc lại bằng máy chủ giọng đọc, thay tệp khác hoặc xoá.
          Hiện có <b>{tong}</b> đoạn. Xoá xong trang web dùng giọng máy của trình duyệt.
        </p>
      </div>

      <form
        className="mb-4 flex flex-wrap items-center gap-2"
        onSubmit={(e) => { e.preventDefault(); setPage(1); setTim(oTim.trim()); }}
      >
        <input
          value={oTim}
          onChange={(e) => setOTim(e.target.value)}
          placeholder="Tìm theo chữ, ví dụ: con mèo"
          className="w-72 rounded-lg border px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Tìm
        </button>
        {tim && (
          <button
            type="button"
            onClick={() => { setOTim(''); setTim(''); setPage(1); }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Bỏ lọc
          </button>
        )}
      </form>

      {loading ? (
        <p className="py-10 text-center text-gray-500">Đang tải…</p>
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-gray-500">Không có đoạn nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Đoạn chữ</th>
                <th className="px-4 py-3">Nghe</th>
                <th className="px-4 py-3 whitespace-nowrap">Dài</th>
                <th className="px-4 py-3 whitespace-nowrap">Nặng</th>
                <th className="px-4 py-3 text-right">Việc</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((d) => (
                <tr key={d.cacheKey} className={busy === d.cacheKey ? 'opacity-50' : ''}>
                  <td className="px-4 py-3 font-medium">{d.text}</td>
                  <td className="px-4 py-3">
                    {d.audioUrl
                      ? <audio controls preload="none" src={d.audioUrl} className="h-9 w-56" />
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{giay(d.durationMs)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{kb(d.fileSize)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        disabled={busy === d.cacheKey}
                        onClick={() => docLai(d)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                      >
                        Đọc lại
                      </button>
                      <button
                        disabled={busy === d.cacheKey}
                        onClick={() => inputs.current[d.cacheKey]?.click()}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                      >
                        Thay tệp
                      </button>
                      <button
                        disabled={busy === d.cacheKey}
                        onClick={() => xoa(d)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Xoá
                      </button>
                      <input
                        ref={(el) => { inputs.current[d.cacheKey] = el; }}
                        type="file"
                        accept="audio/*"
                        hidden
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (f) thayTep(d, f);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Pagination page={page} totalPages={soTrang} onPageChange={setPage} total={tong} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
