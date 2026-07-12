'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type Certificate = {
  id: number;
  code: string;
  title: string;
  issuedAt: string;
  meta?: { courseTitle?: string } | null;
};

export default function ChungNhanClient() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);
  const [childName, setChildName] = useState<string>('bé');

  useEffect(() => {
    const childId = Number(localStorage.getItem('bhh_child_id') || '0');
    if (!childId) {
      setNoChild(true);
      setLoading(false);
      return;
    }
    apiFetch<Certificate[]>(`/certificates/child/${childId}`)
      .then((r) => setItems(Array.isArray(r) ? r : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    apiFetch<{ fullName?: string }>(`/children/${childId}`)
      .then((c) => c?.fullName && setChildName(c.fullName))
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="rounded-[28px] bg-gradient-to-r from-amber-500 to-yellow-400 p-6 text-white shadow-xl print:hidden">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Thành tích</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Chứng nhận hoàn thành</h1>
        <p className="mt-3 text-sm leading-7 text-white/90">Những khóa học {childName} đã hoàn thành xuất sắc.</p>
      </div>

      {loading && <p className="mt-8 text-center text-slate-500">Đang tải…</p>}

      {!loading && noChild && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
          Chưa chọn hồ sơ bé. Hãy vào <Link href="/dashboard" className="font-bold underline">Dashboard</Link> để chọn bé.
        </div>
      )}

      {!loading && !noChild && items.length === 0 && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-center text-slate-500 ring-1 ring-slate-100">
          Chưa có chứng nhận nào. Hoàn thành hết một khóa học để nhận chứng nhận nhé!
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {items.map((c) => (
          <div
            key={c.id}
            className="relative overflow-hidden rounded-2xl border-4 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 text-center shadow-md"
          >
            <div className="text-5xl">🏆</div>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-600">Chứng nhận hoàn thành</p>
            <h2 className="mt-2 text-xl font-black text-slate-800">{c.meta?.courseTitle ?? c.title}</h2>
            <p className="mt-3 text-sm text-slate-600">
              Chứng nhận <strong>{childName}</strong> đã hoàn thành khóa học.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Ngày cấp: {new Date(c.issuedAt).toLocaleDateString('vi-VN')}
            </p>
            <p className="mt-1 text-[11px] font-mono text-slate-400">Mã: {c.code}</p>
            <button
              onClick={() => window.print()}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow print:hidden"
            >
              In / Lưu PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
