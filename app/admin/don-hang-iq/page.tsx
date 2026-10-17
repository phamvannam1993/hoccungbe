'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';

type OrderStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
type Order = {
  id: number;
  code: string;
  userId: number;
  userEmail: string | null;
  userName: string | null;
  prefix: string;
  title: string;
  amount: number;
  status: OrderStatus;
  adminNote: string | null;
  expiresAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
};
type ListResult = { items: Order[]; total: number; page: number; limit: number; pending: number };

const LIMIT = 50;
const REFRESH_MS = 30_000;

const TABS: { value: OrderStatus | ''; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: '', label: 'Tất cả' },
];

const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Từ chối', cls: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Đã hủy', cls: 'bg-slate-200 text-slate-600' },
};

const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;
const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleString('vi-VN') : '—');
const fmtDay = (s: string | null) => (s ? new Date(s).toLocaleDateString('vi-VN') : '—');
/** Nội dung chuyển khoản phụ huynh thấy (mã kích hoạt, dấu cách thay gạch nối). */
const transferNote = (code: string) => code.replace(/-/g, ' ');

function errMsg(e: unknown) {
  if (!(e instanceof Error)) return '';
  try {
    const j = JSON.parse(e.message);
    return Array.isArray(j.message) ? j.message.join(', ') : j.message || e.message;
  } catch {
    return e.message;
  }
}

export default function IqOrdersAdminPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('pending');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState<ListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [reload, setReload] = useState(0);

  const refresh = useCallback(() => setReload((n) => n + 1), []);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (status) params.set('status', status);
    if (search) params.set('q', search);
    let cancelled = false;
    apiFetch<ListResult>(`/iq-orders?${params}`)
      .then((l) => {
        if (cancelled) return;
        setList(l);
        setLoadError('');
      })
      .catch((e) => !cancelled && setLoadError(errMsg(e) || 'Không tải được danh sách đơn'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [status, search, page, reload]);

  // Tự tải lại để thấy đơn mới.
  useEffect(() => {
    const t = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(t);
  }, [refresh]);

  async function approve(o: Order) {
    if (!confirm(`Đã nhận đủ ${vnd(o.amount)} với nội dung "${transferNote(o.code)}"?\n\nDuyệt xong mã được kích hoạt cho ${o.userEmail ?? `tài khoản #${o.userId}`}, học 1 tháng tính từ bây giờ.`)) return;
    setBusy(o.id);
    try {
      const r = await apiFetch<Order>(`/iq-orders/${o.id}/approve`, { method: 'POST', body: JSON.stringify({}) });
      toast.success(`Đã duyệt ${o.code} — học đến ${fmtDay(r.expiresAt)}`);
      refresh();
    } catch (e) {
      toast.error('Duyệt thất bại: ' + errMsg(e));
      refresh();
    } finally {
      setBusy(null);
    }
  }

  async function reject(o: Order) {
    const note = prompt(`Từ chối đơn ${o.code}? Lý do (phụ huynh sẽ thấy):`, 'Chưa nhận được chuyển khoản');
    if (note === null) return;
    setBusy(o.id);
    try {
      await apiFetch(`/iq-orders/${o.id}/reject`, { method: 'POST', body: JSON.stringify({ note }) });
      toast.success(`Đã từ chối ${o.code}`);
      refresh();
    } catch (e) {
      toast.error('Từ chối thất bại: ' + errMsg(e));
    } finally {
      setBusy(null);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Đã sao chép');
    } catch {
      toast.error('Trình duyệt chặn sao chép');
    }
  }

  const pages = list ? Math.max(1, Math.ceil(list.total / list.limit)) : 1;
  const input = 'rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none';

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">🛒 Đơn hàng Toán IQ</h1>
        <p className="text-sm text-slate-500">
          Phụ huynh bấm Mua → đơn chờ duyệt với nội dung chuyển khoản = mã kích hoạt. Đối chiếu tiền về (đúng số tiền, đúng nội dung) rồi bấm{' '}
          <b>Duyệt</b>: mã được kích hoạt cho tài khoản mua, học 1 tháng tính từ lúc duyệt (còn hạn thì cộng nối). Phụ huynh nhận email báo.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.value || 'all'}
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${status === t.value ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}
          >
            {t.label}
            {t.value === 'pending' && list ? ` (${list.pending})` : ''}
          </button>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q.trim());
            setPage(1);
          }}
          className="ml-auto flex gap-2"
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Dán nội dung CK, mã, email…" className={`${input} w-72`} />
          <button className="rounded-lg bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-900">Tìm</button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
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
          <p className="py-10 text-center text-slate-500">{status === 'pending' ? 'Không có đơn nào chờ duyệt 🎉' : 'Chưa có đơn nào.'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Nội dung CK / mã kích hoạt</th>
                  <th className="pr-3">Tài khoản</th>
                  <th className="pr-3">Gói</th>
                  <th className="pr-3 text-right">Số tiền</th>
                  <th className="pr-3">Trạng thái</th>
                  <th className="pr-3">Tạo lúc</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-3">
                      <button onClick={() => copy(o.code)} className="font-mono font-bold text-slate-800 hover:text-sky-600" title="Sao chép mã">
                        {transferNote(o.code)}
                      </button>
                    </td>
                    <td className="pr-3">
                      <div className="font-medium text-slate-800">{o.userName || '—'}</div>
                      <div className="text-xs text-slate-500">{o.userEmail ?? `#${o.userId}`}</div>
                    </td>
                    <td className="max-w-64 pr-3">
                      <div className="text-slate-700">{o.title}</div>
                      <div className="font-mono text-xs text-slate-400">{o.prefix}</div>
                    </td>
                    <td className="whitespace-nowrap pr-3 text-right font-bold text-[#e34a4a]">{vnd(o.amount)}</td>
                    <td className="pr-3">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span>
                      {o.status === 'approved' && <div className="mt-1 text-xs text-slate-500">Học đến {fmtDay(o.expiresAt)}</div>}
                      {o.adminNote && <div className="mt-1 max-w-48 text-xs text-slate-500">{o.adminNote}</div>}
                      {o.reviewedBy && <div className="text-[11px] text-slate-400">{o.reviewedBy} · {fmtDate(o.reviewedAt)}</div>}
                    </td>
                    <td className="whitespace-nowrap pr-3 text-xs text-slate-500">{fmtDate(o.createdAt)}</td>
                    <td className="whitespace-nowrap text-right">
                      {o.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busy === o.id}
                            onClick={() => approve(o)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {busy === o.id ? '…' : 'Duyệt'}
                          </button>
                          <button
                            disabled={busy === o.id}
                            onClick={() => reject(o)}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {list && list.total > LIMIT && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
              {list.total.toLocaleString('vi-VN')} đơn · trang {page}/{pages}
            </span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40">
                ← Trước
              </button>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40">
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
