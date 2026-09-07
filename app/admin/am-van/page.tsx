'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '../../lib/api';
import Pagination from '../components/Pagination';
import { VONG_AM } from '../../lib/vongTronAm';
import { khoaAnh, khoaAnhCu } from '../../lib/hinhTu';

// Trang admin gán ảnh cho các từ trong Vòng tròn âm vần / Game nối âm vần.
//
// Dùng chung bảng `vocab_images` với ảnh từ vựng tiếng Anh — cấu trúc y hệt (một
// khoá chữ → một URL ảnh), nên không phải tạo bảng mới. Khoá mang tiền tố
// "am-van:" để hai loại không đụng nhau.
//
// Một từ có thể nằm ở nhiều vòng ("chăn" vừa ở vòng ch vừa ở vòng ă). Khoá tính
// theo TỪ chứ không theo vòng, nên gán một lần là mọi chỗ cùng đổi — đúng ý muốn.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const PAGE_SIZE = 24;

const isUrl = (v: string | undefined) => !!v && /^https?:\/\//i.test(v);

type TuPhang = { khoa: string; tu: string; emoji: string; vongDs: string[] };

/** Gộp các từ trùng nhau giữa các vòng thành một dòng. */
const MOI_TU: TuPhang[] = (() => {
  const m = new Map<string, TuPhang>();
  for (const v of VONG_AM)
    for (const w of v.tu) {
      const khoa = khoaAnh(w.tu);
      const co = m.get(khoa);
      if (co) { if (!co.vongDs.includes(v.am)) co.vongDs.push(v.am); }
      else m.set(khoa, { khoa, tu: w.tu, emoji: w.emoji, vongDs: [v.am] });
    }
  return [...m.values()].sort((a, b) => a.tu.localeCompare(b.tu, 'vi'));
})();

/**
 * Ảnh còn nằm dưới KHOÁ CŨ (khoá bỏ hết dấu). Khoá cũ dính nhau — "bé" và "bê"
 * cùng ra "am-van:be" — nên máy không đoán được ảnh thuộc từ nào. Hiện ra để
 * admin bấm gán đúng từ, thay vì bắt tải lại từ đầu.
 */
function nhomKhoaCu(): Map<string, TuPhang[]> {
  const m = new Map<string, TuPhang[]>();
  for (const w of MOI_TU) {
    const cu = khoaAnhCu(w.tu);
    m.set(cu, [...(m.get(cu) ?? []), w]);
  }
  return m;
}
const KHOA_CU = nhomKhoaCu();

export default function AdminAmVanPage() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [vong, setVong] = useState('all');
  const [query, setQuery] = useState('');
  const [chuaCo, setChuaCo] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiFetch<Record<string, string>>('/vocab-images')
      .then((d) => setMap(d || {}))
      .catch(() => setMap({}))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [vong, query, chuaCo]);

  const coAnh = useMemo(() => MOI_TU.filter((w) => isUrl(map[w.khoa])).length, [map]);

  const loc = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOI_TU.filter((w) => {
      if (vong !== 'all' && !w.vongDs.includes(vong)) return false;
      if (chuaCo && isUrl(map[w.khoa])) return false;
      if (q && !w.tu.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [vong, query, chuaCo, map]);

  const soTrang = Math.max(1, Math.ceil(loc.length / PAGE_SIZE));
  const trang = Math.min(page, soTrang);
  const dsTrang = loc.slice((trang - 1) * PAGE_SIZE, trang * PAGE_SIZE);

  // Máy chủ chặn ảnh trên 10MB. Kiểm ngay ở đây để báo bằng tiếng người, thay vì
  // để người dùng chờ tải xong rồi nhận một lỗi khó hiểu.
  const GIOI_HAN = 10 * 1024 * 1024;

  async function taiLen(khoa: string, file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Chỉ nhận file ảnh (jpg, png, webp…).');
      return;
    }
    if (file.size > GIOI_HAN) {
      alert(`Ảnh nặng ${(file.size / 1024 / 1024).toFixed(1)}MB, vượt mức 10MB. Nhờ bạn giảm dung lượng rồi tải lại.`);
      return;
    }
    setBusy(khoa);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/upload/image`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.url) throw new Error(data.message || 'Không nhận được URL ảnh');
      await apiFetch(`/vocab-images/${encodeURIComponent(khoa)}`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl: data.url }),
      });
      setMap((m) => ({ ...m, [khoa]: data.url }));
    } catch (e) {
      alert('Tải ảnh thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  /** Gán một ảnh đang nằm dưới khoá cũ sang đúng từ (khoá mới). */
  async function ganCu(khoaCu: string, w: TuPhang) {
    setBusy(w.khoa);
    try {
      const url = map[khoaCu];
      await apiFetch(`/vocab-images/${encodeURIComponent(w.khoa)}`, {
        method: 'PUT',
        body: JSON.stringify({ imageUrl: url }),
      });
      await apiFetch(`/vocab-images/${encodeURIComponent(khoaCu)}`, { method: 'DELETE' });
      setMap((m) => { const n = { ...m, [w.khoa]: url }; delete n[khoaCu]; return n; });
    } catch (e) {
      alert('Gán ảnh thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  async function goAnh(khoa: string) {
    if (!confirm('Gỡ ảnh của từ này? Từ sẽ hiển thị lại bằng emoji.')) return;
    setBusy(khoa);
    try {
      await apiFetch(`/vocab-images/${encodeURIComponent(khoa)}`, { method: 'DELETE' });
      setMap((m) => { const n = { ...m }; delete n[khoa]; return n; });
    } catch (e) {
      alert('Gỡ ảnh thất bại: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Ảnh cho Vòng tròn âm vần</h1>
        <p className="mt-1 text-sm text-gray-500">
          Từ nào có ảnh thì hiển thị ảnh, chưa có thì dùng emoji. Đã có{' '}
          <b>{coAnh}</b>/{MOI_TU.length} từ. Ảnh vuông, nền trong hoặc nền trắng, tối đa 10MB.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={vong} onChange={(e) => setVong(e.target.value)} className="rounded border px-3 py-2 text-sm">
          <option value="all">Tất cả vòng ({MOI_TU.length} từ)</option>
          {VONG_AM.map((v) => (
            <option key={v.am} value={v.am}>
              {v.nhom === 'nguyenam' ? 'Nguyên âm' : 'Âm đầu'} {v.am}
            </option>
          ))}
        </select>
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm từ…" className="rounded border px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={chuaCo} onChange={(e) => setChuaCo(e.target.checked)} />
          Chỉ hiện từ chưa có ảnh
        </label>
      </div>

      {!loading && (() => {
        const moCoi = [...KHOA_CU.entries()].filter(([cu]) => isUrl(map[cu]));
        if (!moCoi.length) return null;
        return (
          <div className="mb-5 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
            <p className="font-bold text-amber-800">
              {moCoi.length} ảnh chưa gán đúng từ
            </p>
            <p className="mt-1 text-sm text-amber-700">
              Những ảnh này tải lên hồi khoá ảnh còn bỏ dấu, nên máy không biết là của từ nào.
              Bấm đúng từ để gán — không phải tải lại.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {moCoi.map(([cu, ds]) => (
                <div key={cu} className="flex items-center gap-3 rounded-lg bg-white p-2">
                  <Image src={map[cu]} alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                  <div className="flex flex-wrap gap-1.5">
                    {ds.map((w) => (
                      <button
                        key={w.khoa}
                        onClick={() => ganCu(cu, w)}
                        disabled={busy === w.khoa}
                        className="rounded border border-amber-400 bg-white px-2.5 py-1 text-sm font-bold text-amber-700 disabled:opacity-50"
                      >
                        {w.tu}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {loading ? (
        <p className="py-10 text-center text-gray-400">Đang tải…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {dsTrang.map((w) => {
              const url = map[w.khoa];
              const dangBan = busy === w.khoa;
              return (
                <div key={w.khoa} className="rounded-xl border bg-white p-3">
                  <div className="grid h-28 place-items-center overflow-hidden rounded-lg bg-gray-50">
                    {isUrl(url)
                      ? <Image src={url} alt={w.tu} width={112} height={112} className="h-28 w-auto object-contain" />
                      : <span className="text-5xl" aria-hidden>{w.emoji}</span>}
                  </div>
                  <p className="mt-2 truncate font-bold">{w.tu}</p>
                  <p className="truncate text-xs text-gray-400">vòng {w.vongDs.join(', ')}</p>

                  <input
                    ref={(el) => { inputs.current[w.khoa] = el; }}
                    type="file" accept="image/*" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) taiLen(w.khoa, f); e.target.value = ''; }}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => inputs.current[w.khoa]?.click()}
                      disabled={dangBan}
                      className="flex-1 rounded bg-blue-600 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {dangBan ? 'Đang tải…' : isUrl(url) ? 'Đổi ảnh' : 'Tải ảnh'}
                    </button>
                    {isUrl(url) && (
                      <button
                        onClick={() => goAnh(w.khoa)} disabled={dangBan}
                        className="rounded border px-2 py-1.5 text-xs text-red-600 disabled:opacity-50"
                      >
                        Gỡ
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!loc.length && <p className="py-10 text-center text-gray-400">Không có từ nào khớp.</p>}
          <Pagination page={trang} totalPages={soTrang} onPageChange={setPage} total={loc.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
