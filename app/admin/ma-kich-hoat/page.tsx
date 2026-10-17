'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import catalog from '../../khoa-hoc-iq/data/courses.json';

type CodeRow = {
  code: string;
  prefix: string;
  note: string | null;
  maxUses: number;
  useCount: number;
  status: 'active' | 'revoked';
  createdBy: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  redeemedBy: number | null;
  redeemedEmail: string | null;
  startsAt: string | null;
  expiresAt: string | null;
};
type ListResult = { items: CodeRow[]; total: number; page: number; limit: number };
type Stat = { prefix: string; total: number; active: number; used: number; revoked: number };
type Status = '' | 'active' | 'used' | 'revoked';

const LIMIT = 50;

/** Các gói bán được (combo cả lớp + từng khóa), nhóm theo lớp. */
const PACKAGES = catalog.grades.map((g) => ({
  grade: g.id,
  title: g.title,
  items: [
    ...catalog.combos
      .filter((c) => c.grade === g.id)
      .map((c) => ({ prefix: c.codePrefix, label: `⭐ Trọn ${g.title} — ${c.price.toLocaleString('vi-VN')}đ` })),
    ...catalog.courses
      .filter((c) => c.grade === g.id)
      .map((c) => ({
        prefix: c.codePrefix,
        label: `Khóa ${String(c.number).padStart(2, '0')}: ${c.title} — ${c.price.toLocaleString('vi-VN')}đ`,
      })),
  ],
}));
const LABELS: Record<string, string> = Object.fromEntries(
  PACKAGES.flatMap((g) => g.items.map((i) => [i.prefix, `${i.prefix} · ${i.label.replace(/ — .*$/, '')}`])),
);

function errMsg(e: unknown) {
  if (!(e instanceof Error)) return '';
  try {
    const j = JSON.parse(e.message);
    return Array.isArray(j.message) ? j.message.join(', ') : j.message || e.message;
  } catch {
    return e.message;
  }
}

function rowStatus(r: CodeRow): { label: string; cls: string } {
  if (r.status === 'revoked') return { label: 'Đã thu hồi', cls: 'bg-red-100 text-red-700' };
  if (r.redeemedBy) {
    if (r.expiresAt && new Date(r.expiresAt).getTime() < Date.now()) return { label: 'Đã hết hạn', cls: 'bg-slate-200 text-slate-700' };
    return { label: 'Đang học', cls: 'bg-sky-100 text-sky-700' };
  }
  return { label: 'Chưa dùng', cls: 'bg-emerald-100 text-emerald-700' };
}

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString('vi-VN') : '—');
const fmtDay = (s: string | null) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—');

function downloadCsv(name: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ActivationCodesAdminPage() {
  // Form tạo mã
  const [prefix, setPrefix] = useState(PACKAGES[0]?.items[0]?.prefix ?? '');
  const [count, setCount] = useState(10);
  const [note, setNote] = useState('');
  const [generating, setGenerating] = useState(false);
  const [created, setCreated] = useState<{ prefix: string; codes: string[] } | null>(null);

  // Danh sách
  const [filterPrefix, setFilterPrefix] = useState('');
  const [status, setStatus] = useState<Status>('');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ListResult | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const refresh = useCallback(() => setReload((n) => n + 1), []);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (filterPrefix) params.set('prefix', filterPrefix);
    if (status) params.set('status', status);
    if (search) params.set('q', search);
    let cancelled = false;
    Promise.all([apiFetch<ListResult>(`/iq-codes?${params}`), apiFetch<Stat[]>('/iq-codes/stats')])
      .then(([l, s]) => {
        if (cancelled) return;
        setList(l);
        setStats(s ?? []);
        setLoadError('');
      })
      .catch((e) => !cancelled && setLoadError(errMsg(e) || 'Không tải được danh sách mã'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, filterPrefix, status, search, reload]);

  const totals = useMemo(
    () =>
      stats.reduce(
        (t, s) => ({ total: t.total + s.total, active: t.active + s.active, used: t.used + s.used, revoked: t.revoked + s.revoked }),
        { total: 0, active: 0, used: 0, revoked: 0 },
      ),
    [stats],
  );
  const pages = list ? Math.max(1, Math.ceil(list.total / list.limit)) : 1;

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!prefix) return toast.error('Chọn khóa học');
    setGenerating(true);
    try {
      const res = await apiFetch<{ codes: string[] }>('/iq-codes/generate', {
        method: 'POST',
        body: JSON.stringify({ prefix, count, note: note.trim() || undefined }),
      });
      setCreated({ prefix, codes: res.codes });
      toast.success(`Đã tạo ${res.codes.length} mã`);
      setNote('');
      setPage(1);
      refresh();
    } catch (err) {
      toast.error('Tạo mã thất bại: ' + errMsg(err));
    } finally {
      setGenerating(false);
    }
  }

  async function patch(code: string, body: Partial<Pick<CodeRow, 'status' | 'note'>>, ok: string) {
    setBusy(code);
    try {
      await apiFetch(`/iq-codes/${encodeURIComponent(code)}`, { method: 'PATCH', body: JSON.stringify(body) });
      toast.success(ok);
      refresh();
    } catch (err) {
      toast.error('Cập nhật thất bại: ' + errMsg(err));
    } finally {
      setBusy(null);
    }
  }

  function editNote(r: CodeRow) {
    const v = prompt(`Ghi chú cho ${r.code} (tên phụ huynh, SĐT, mã đơn…)`, r.note ?? '');
    if (v === null) return;
    patch(r.code, { note: v }, 'Đã lưu ghi chú');
  }

  function toggleRevoke(r: CodeRow) {
    if (r.status === 'active') {
      const msg = r.redeemedBy
        ? `Thu hồi mã ${r.code}? Tài khoản ${r.redeemedEmail ?? r.redeemedBy} sẽ mất 1 tháng học của mã này.`
        : `Thu hồi mã ${r.code}? Mã sẽ không nhập được nữa.`;
      if (!confirm(msg)) return;
      patch(r.code, { status: 'revoked' }, 'Đã thu hồi mã');
    } else {
      patch(r.code, { status: 'active' }, 'Đã mở lại mã');
    }
  }

  async function copy(text: string, msg = 'Đã sao chép') {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(msg);
    } catch {
      toast.error('Trình duyệt chặn sao chép');
    }
  }

  function exportList() {
    if (!list?.items.length) return;
    downloadCsv(`ma-kich-hoat-trang-${page}.csv`, [
      ['Mã', 'Gói', 'Trạng thái', 'Tài khoản', 'Học từ', 'Học đến', 'Ghi chú', 'Người tạo', 'Ngày tạo', 'Ngày kích hoạt'],
      ...list.items.map((r) => [
        r.code,
        LABELS[r.prefix] ?? r.prefix,
        rowStatus(r).label,
        r.redeemedEmail ?? (r.redeemedBy ? `#${r.redeemedBy}` : ''),
        fmtDay(r.startsAt),
        fmtDay(r.expiresAt),
        r.note ?? '',
        r.createdBy ?? '',
        fmtDate(r.createdAt),
        fmtDate(r.lastUsedAt),
      ]),
    ]);
  }

  const input = 'rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none';

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">🔑 Mã kích hoạt Toán IQ</h1>
        <p className="text-sm text-slate-500">
          Tạo mã sau khi phụ huynh chuyển khoản, gửi mã qua Zalo. Phụ huynh đăng nhập rồi nhập mã ở /khoa-hoc-iq: mã gắn với tài khoản
          đó (1 mã = 1 tài khoản), học được 1 tháng kể từ lúc kích hoạt; mua tiếp khi còn hạn thì cộng nối thêm 1 tháng.
        </p>
      </div>

      {/* Thống kê */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Tổng số mã', totals.total, 'text-slate-800'],
          ['Chưa dùng', totals.active, 'text-emerald-600'],
          ['Đã kích hoạt', totals.used, 'text-sky-600'],
          ['Đã thu hồi', totals.revoked, 'text-red-600'],
        ].map(([label, n, cls]) => (
          <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
            <p className={`text-2xl font-black ${cls}`}>{(n as number).toLocaleString('vi-VN')}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Tạo mã */}
        <div className="space-y-4">
          <form onSubmit={generate} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="font-bold text-slate-800">Tạo mã mới</h2>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-600">Gói / khóa học</span>
              <select value={prefix} onChange={(e) => setPrefix(e.target.value)} className={`${input} w-full`}>
                {PACKAGES.map((g) => (
                  <optgroup key={g.grade} label={g.title}>
                    {g.items.map((i) => (
                      <option key={i.prefix} value={i.prefix}>
                        {i.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-600">Số lượng mã (mỗi mã = 1 tài khoản × 1 tháng)</span>
              <input
                type="number"
                min={1}
                max={500}
                value={count}
                onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
                className={`${input} w-full`}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-600">Ghi chú (tùy chọn)</span>
              <input
                value={note}
                maxLength={255}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Chị Lan 09xx – đơn 16/10"
                className={`${input} w-full`}
              />
            </label>
            <button
              disabled={generating}
              className="w-full rounded-lg bg-sky-600 py-2.5 font-bold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {generating ? 'Đang tạo…' : `Tạo ${count} mã`}
            </button>
          </form>

          {created && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-bold text-emerald-800">Vừa tạo {created.codes.length} mã</h3>
                <button onClick={() => setCreated(null)} className="text-sm text-slate-500 hover:text-slate-700">
                  Đóng
                </button>
              </div>
              <p className="mb-2 text-xs text-emerald-700">{LABELS[created.prefix] ?? created.prefix}</p>
              <div className="max-h-60 overflow-auto rounded-lg bg-white p-2 font-mono text-sm">
                {created.codes.map((c) => (
                  <button key={c} onClick={() => copy(c)} className="block w-full rounded px-1 text-left hover:bg-slate-100">
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copy(created.codes.join('\n'), `Đã sao chép ${created.codes.length} mã`)}
                  className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Sao chép tất cả
                </button>
                <button
                  onClick={() =>
                    downloadCsv(`ma-${created.prefix}-${Date.now()}.csv`, [
                      ['Mã', 'Gói'],
                      ...created.codes.map((c) => [c, LABELS[created.prefix] ?? created.prefix]),
                    ])
                  }
                  className="flex-1 rounded-lg border border-emerald-600 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  Tải CSV
                </button>
              </div>
            </div>
          )}

          {stats.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 font-bold text-slate-800">Theo gói</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-slate-500">
                  <tr>
                    <th className="py-1">Gói</th>
                    <th className="text-right">Chưa dùng</th>
                    <th className="text-right">Đã KH</th>
                    <th className="text-right">Thu hồi</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats]
                    .sort((a, b) => a.prefix.localeCompare(b.prefix))
                    .map((s) => (
                      <tr
                        key={s.prefix}
                        onClick={() => {
                          setFilterPrefix(s.prefix);
                          setPage(1);
                        }}
                        className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                        title={LABELS[s.prefix]}
                      >
                        <td className="py-1 font-mono">{s.prefix}</td>
                        <td className="text-right text-emerald-600">{s.active}</td>
                        <td className="text-right text-sky-600">{s.used}</td>
                        <td className="text-right text-red-600">{s.revoked}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Danh sách */}
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              value={filterPrefix}
              onChange={(e) => {
                setFilterPrefix(e.target.value);
                setPage(1);
              }}
              className={input}
            >
              <option value="">Tất cả gói</option>
              {PACKAGES.map((g) => (
                <optgroup key={g.grade} label={g.title}>
                  {g.items.map((i) => (
                    <option key={i.prefix} value={i.prefix}>
                      {LABELS[i.prefix]}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as Status);
                setPage(1);
              }}
              className={input}
            >
              <option value="">Mọi trạng thái</option>
              <option value="active">Chưa dùng</option>
              <option value="used">Đã kích hoạt</option>
              <option value="revoked">Đã thu hồi</option>
            </select>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSearch(q.trim());
                setPage(1);
              }}
              className="flex flex-1 gap-2"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm mã, email hoặc ghi chú…"
                className={`${input} min-w-40 flex-1`}
              />
              <button className="rounded-lg bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-900">Tìm</button>
            </form>
            <button onClick={exportList} className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
              Xuất CSV
            </button>
          </div>

          {loadError ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {loadError}
              <button onClick={refresh} className="ml-3 font-bold underline">
                Thử lại
              </button>
            </div>
          ) : loading && !list ? (
            <p className="py-10 text-center text-slate-500">Đang tải…</p>
          ) : !list?.items.length ? (
            <p className="py-10 text-center text-slate-500">Chưa có mã nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-3">Mã</th>
                    <th className="pr-3">Gói</th>
                    <th className="pr-3">Trạng thái</th>
                    <th className="pr-3">Tài khoản</th>
                    <th className="pr-3">Thời hạn học</th>
                    <th className="pr-3">Ghi chú</th>
                    <th className="pr-3">Ngày tạo</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map((r) => {
                    const st = rowStatus(r);
                    return (
                      <tr key={r.code} className="border-b border-slate-100 align-top">
                        <td className="py-2 pr-3">
                          <button onClick={() => copy(r.code)} className="font-mono font-semibold hover:text-sky-600" title="Sao chép">
                            {r.code}
                          </button>
                        </td>
                        <td className="pr-3 text-xs text-slate-600" title={LABELS[r.prefix]}>
                          {r.prefix}
                        </td>
                        <td className="pr-3">
                          <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="pr-3 text-xs text-slate-600">{r.redeemedEmail ?? (r.redeemedBy ? `#${r.redeemedBy}` : '—')}</td>
                        <td className="whitespace-nowrap pr-3 text-xs text-slate-600">
                          {r.expiresAt ? `${fmtDay(r.startsAt)} → ${fmtDay(r.expiresAt)}` : r.redeemedBy ? 'Đã thu hồi' : '—'}
                        </td>
                        <td className="max-w-56 pr-3">
                          <button onClick={() => editNote(r)} className="text-left text-slate-600 hover:text-sky-600">
                            {r.note || <span className="text-slate-400">+ thêm</span>}
                          </button>
                        </td>
                        <td className="whitespace-nowrap pr-3 text-xs text-slate-500">{fmtDate(r.createdAt)}</td>
                        <td className="text-right">
                          <button
                            disabled={busy === r.code}
                            onClick={() => toggleRevoke(r)}
                            className={`whitespace-nowrap rounded-lg px-3 py-1 text-xs font-bold disabled:opacity-50 ${
                              r.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {r.status === 'active' ? 'Thu hồi' : 'Mở lại'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {list && list.total > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                {list.total.toLocaleString('vi-VN')} mã · trang {page}/{pages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
                >
                  ← Trước
                </button>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
