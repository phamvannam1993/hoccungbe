'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, createChild, deleteChild, isGuest, setCurrentChildId, type Child } from '../lib/childData';

export default function HoSoBeClient() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: '', nickname: '', gender: 'male', birthDate: '' });

  function load() {
    listChildren()
      .then((r) => setChildren(Array.isArray(r) ? r : []))
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setGuest(isGuest());
    setCurrentId(Number(localStorage.getItem('bhh_child_id') || '0'));
    load();
  }, []);

  async function addChild(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setSaving(true);
    try {
      const child = await createChild({
        fullName: form.fullName.trim(),
        nickname: form.nickname.trim() || undefined,
        gender: form.gender,
        birthDate: form.birthDate || undefined,
      });
      setForm({ fullName: '', nickname: '', gender: 'male', birthDate: '' });
      // Tự chọn bé đầu tiên để bắt đầu học ngay.
      if (!currentId) {
        setCurrentChildId(child.id);
        setCurrentId(child.id);
      }
      load();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function removeChild(id: number) {
    if (!confirm('Xóa hồ sơ bé này?')) return;
    try {
      await deleteChild(id);
      load();
    } catch {
      // ignore
    }
  }

  function setCurrent(id: number) {
    setCurrentChildId(id);
    setCurrentId(id);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="rounded-[28px] bg-gradient-to-r from-sky-500 to-violet-500 p-6 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Hồ sơ</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hồ sơ của bé</h1>
        <p className="mt-3 text-sm leading-7 text-white/90">Tạo hồ sơ cho từng bé để theo dõi tiến độ học riêng.</p>
      </div>

      {guest && (
        <div className="mt-6 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 ring-1 ring-sky-100">
          👋 Bạn đang ở <strong>chế độ khách</strong> — vẫn tạo được hồ sơ bé và học bình thường, dữ liệu lưu ngay trên trình duyệt này.
          {' '}<Link href="/dang-nhap" className="font-bold underline">Đăng nhập</Link> nếu muốn đồng bộ trên nhiều thiết bị.
        </div>
      )}

      {/* Form thêm bé */}
      {(
        <form onSubmit={addChild} className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-black text-slate-800">Thêm bé mới</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-600">
              Họ và tên bé *
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal text-slate-800 focus:border-sky-400 focus:outline-none"
                placeholder="VD: Nguyễn Minh Khang"
              />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Tên gọi ở nhà
              <input
                value={form.nickname}
                onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal text-slate-800 focus:border-sky-400 focus:outline-none"
                placeholder="VD: Bé Khang"
              />
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Giới tính
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal text-slate-800 focus:border-sky-400 focus:outline-none"
              >
                <option value="male">Bé trai</option>
                <option value="female">Bé gái</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-600">
              Ngày sinh
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal text-slate-800 focus:border-sky-400 focus:outline-none"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving || !form.fullName.trim()}
            className="mt-4 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow disabled:opacity-50"
          >
            {saving ? 'Đang lưu…' : '+ Thêm bé'}
          </button>
        </form>
      )}

      {/* Danh sách bé */}
      <div className="mt-6 space-y-3">
        {loading && <p className="text-center text-slate-400">Đang tải…</p>}
        {!loading && children.length === 0 && (
          <p className="text-center text-slate-400">Chưa có hồ sơ bé nào. Thêm bé đầu tiên ở trên nhé!</p>
        )}
        {children.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-xl">
                {c.gender === 'female' ? '👧' : '👦'}
              </div>
              <div>
                <p className="font-bold text-slate-800">{c.fullName}</p>
                <p className="text-xs text-slate-400">{c.nickname ? `${c.nickname} · ` : ''}{c.birthDate ?? ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentId === c.id ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Đang chọn</span>
              ) : (
                <button onClick={() => setCurrent(c.id)} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 hover:bg-sky-100">
                  Chọn học
                </button>
              )}
              <button onClick={() => removeChild(c.id)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {children.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3.5 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
          >
            📊 Xem tiến độ của bé
          </Link>
          <Link
            href="/khoa-hoc"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
          >
            📚 Cho bé học ngay
          </Link>
        </div>
      )}
    </section>
  );
}
