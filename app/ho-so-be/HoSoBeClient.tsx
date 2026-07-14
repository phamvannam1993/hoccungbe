'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, createChild, updateChild, deleteChild, childStats, childStreak, isGuest, setCurrentChildId, GRADES, gradeLabel, type Child, type Stats, type Streak } from '../lib/childData';
import KidIcon, { type IconName, ChildAvatar, ALL_AVATARS } from '../components/edu/KidIcon';
import { Pencil, Trash2 } from 'lucide-react';

function fmtDate(d?: string) {
  if (!d) return '';
  const s = d.slice(0, 10);
  const [y, m, day] = s.split('-');
  return y && m && day ? `${day}/${m}/${y}` : s;
}

const EMPTY = { fullName: '', nickname: '', gender: 'male', birthDate: '', avatarUrl: '', currentLevel: '1' };

export default function HoSoBeClient() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);

  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);

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

  // KPI tổng quan của bé đang chọn.
  useEffect(() => {
    if (!currentId) { setStats(null); setStreak(null); return; }
    childStats(currentId).then(setStats).catch(() => setStats(null));
    childStreak(currentId).then(setStreak).catch(() => setStreak(null));
  }, [currentId, children]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        nickname: form.nickname.trim() || undefined,
        gender: form.gender,
        birthDate: form.birthDate || undefined,
        avatarUrl: form.avatarUrl || undefined,
        currentLevel: form.currentLevel || undefined,
      };
      if (editId != null) {
        await updateChild(editId, payload);
      } else {
        const child = await createChild(payload);
        if (!currentId) { setCurrentChildId(child.id); setCurrentId(child.id); }
      }
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  function startEdit(c: Child) {
    setEditId(c.id);
    setForm({ fullName: c.fullName ?? '', nickname: c.nickname ?? '', gender: c.gender ?? 'male', birthDate: c.birthDate ? c.birthDate.slice(0, 10) : '', avatarUrl: c.avatarUrl ?? '', currentLevel: c.currentLevel ?? '1' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
  }

  async function removeChild(id: number) {
    if (!confirm('Xóa hồ sơ bé này?')) return;
    try {
      await deleteChild(id);
      if (editId === id) cancelEdit();
      load();
    } catch {
      /* ignore */
    }
  }

  function setCurrent(id: number) {
    setCurrentChildId(id);
    setCurrentId(id);
  }

  const points = (stats?.totalCorrect ?? 0) * 10;
  const kpis: { icon: IconName; color: string; label: string; value: string; unit: string }[] = [
    { icon: 'bookBtn', color: '#2563eb', label: 'Bài đã học', value: `${stats?.lessonsCompleted ?? 0}`, unit: 'bài' },
    { icon: 'target', color: '#16a34a', label: 'Độ chính xác', value: `${Math.round(stats?.accuracy ?? 0)}`, unit: '%' },
    { icon: 'starBtn', color: '#7c3aed', label: 'Điểm thưởng', value: `${points}`, unit: '★' },
    { icon: 'clock', color: '#f59e0b', label: 'Chuỗi ngày', value: `${streak?.currentStreak ?? 0}`, unit: 'ngày' },
  ];
  const currentChild = children.find((c) => c.id === currentId);

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header */}
        <div className="relative overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-sky-100 ring-4 ring-sky-50 sm:h-20 sm:w-20">
                  {currentChild
                    ? <ChildAvatar child={currentChild} className="h-full w-full" />
                    : <span className="grid h-full w-full place-items-center text-4xl">🧒</span>}
                </div>
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-sm text-white ring-2 ring-white">📷</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#1e3a8a] sm:text-3xl">Hồ sơ của bé</h1>
                <p className="mt-1 text-sm text-slate-500">Quản lý thông tin và theo dõi tiến độ học tập của bé</p>
              </div>
            </div>

            {currentChild && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-xl">
                {kpis.map((k) => (
                  <div key={k.label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                    <KidIcon name={k.icon} className="h-9 w-9 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate text-[10px] font-semibold text-slate-400">{k.label}</div>
                      <div className="text-base font-black leading-tight" style={{ color: k.color }}>
                        {k.value} <span className="text-[10px] font-semibold text-slate-400">{k.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {guest && (
          <div className="mt-4 rounded-2xl bg-sky-50 p-3.5 text-sm leading-6 text-sky-800 ring-1 ring-sky-100">
            👋 Bạn đang ở <strong>chế độ khách</strong> — vẫn tạo được hồ sơ bé và học bình thường, dữ liệu lưu ngay trên trình duyệt này.{' '}
            <Link href="/dang-nhap" className="font-bold underline">Đăng nhập</Link> nếu muốn đồng bộ trên nhiều thiết bị.
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Form thêm / sửa bé */}
          <form onSubmit={submit} className="min-w-0 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-100 text-lg">👥</span>
                {editId != null ? 'Sửa thông tin bé' : 'Thêm bé mới'}
              </h2>
              {editId != null && (
                <button type="button" onClick={cancelEdit} className="text-xs font-bold text-slate-400 hover:text-slate-600">Hủy</button>
              )}
            </div>
            <div className="mt-4 h-px bg-slate-100" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-600">
                Họ và tên bé <span className="text-rose-500">*</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="text-slate-400">👤</span>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 placeholder:text-slate-300 focus:outline-none"
                    placeholder="VD: Nguyễn Minh Khang"
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Tên gọi ở nhà
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="text-slate-400">😊</span>
                  <input
                    value={form.nickname}
                    onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 placeholder:text-slate-300 focus:outline-none"
                    placeholder="VD: Bé Khang"
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Giới tính
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="text-slate-400">{form.gender === 'female' ? '👧' : '👦'}</span>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 focus:outline-none"
                  >
                    <option value="male">Bé trai</option>
                    <option value="female">Bé gái</option>
                  </select>
                </div>
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Lớp <span className="text-rose-500">*</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="text-slate-400">🎒</span>
                  <select
                    value={form.currentLevel}
                    onChange={(e) => setForm((f) => ({ ...f, currentLevel: e.target.value }))}
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 focus:outline-none"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{gradeLabel(g)}</option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Ngày sinh
                <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="text-slate-400">📅</span>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 focus:outline-none"
                  />
                </div>
              </label>
            </div>
            {/* Chọn ảnh đại diện */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-600">Ảnh đại diện</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_AVATARS.map((src) => {
                  const active = form.avatarUrl === src;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, avatarUrl: active ? '' : src }))}
                      className={`h-12 w-12 overflow-hidden rounded-full ring-2 transition ${active ? 'ring-sky-500 ring-offset-2' : 'ring-slate-200 hover:ring-sky-300'}`}
                      title="Chọn ảnh này"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- ảnh avatar tĩnh */}
                      <img src={src} alt="avatar" className="h-full w-full object-cover" draggable={false} />
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">Không chọn thì hệ thống tự lấy ảnh theo giới tính.</p>
            </div>

            <button
              type="submit"
              disabled={saving || !form.fullName.trim()}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg,#60a5fa,#7c3aed)' }}
            >
              {saving ? 'Đang lưu…' : editId != null ? '✓ Cập nhật' : '+ Thêm bé'}
            </button>
          </form>

          {/* Danh sách bé */}
          <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-100 text-lg">👨‍👩‍👧</span>
                Danh sách bé
              </h2>
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600">{children.length} bé</span>
            </div>
            <div className="mt-4 space-y-3">
              {loading && <p className="py-6 text-center text-sm text-slate-400">Đang tải…</p>}
              {!loading && children.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">Chưa có hồ sơ bé nào. Thêm bé đầu tiên ở bên trái nhé!</p>
              )}
              {children.map((c) => {
                const active = currentId === c.id;
                const female = c.gender === 'female';
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 rounded-2xl p-3 ring-1 transition ${
                      active ? 'bg-emerald-50 ring-emerald-200' : female ? 'bg-amber-50/60 ring-amber-100' : 'bg-slate-50 ring-slate-100'
                    }`}
                  >
                    <ChildAvatar child={c} className={`h-12 w-12 shrink-0 ring-2 ${female ? 'ring-pink-200' : 'ring-sky-200'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-800">{c.fullName}</p>
                      <p className="truncate text-xs text-slate-400">
                        {c.currentLevel ? <span className="mr-1 rounded-full bg-sky-50 px-1.5 py-0.5 font-bold text-sky-600">{gradeLabel(c.currentLevel)}</span> : null}
                        {female ? 'Bé gái' : 'Bé trai'}
                        {c.nickname ? ` · ${c.nickname}` : ''}
                        {c.birthDate ? ` · ${fmtDate(c.birthDate)}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {active ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">Đang chọn</span>
                      ) : (
                        <button onClick={() => setCurrent(c.id)} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50">
                          Chọn
                        </button>
                      )}
                      <button onClick={() => startEdit(c)} title="Sửa" className="grid h-8 w-8 place-items-center rounded-full bg-white text-sky-600 ring-1 ring-slate-200 transition hover:bg-sky-50 hover:ring-sky-300">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => removeChild(c.id)} title="Xóa" className="grid h-8 w-8 place-items-center rounded-full bg-white text-rose-500 ring-1 ring-rose-200 transition hover:bg-rose-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {children.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/dashboard" className="rounded-2xl bg-slate-50 px-4 py-2.5 text-center text-sm font-bold text-slate-700 ring-1 ring-slate-100 hover:bg-slate-100">📊 Xem tiến độ</Link>
                <Link href="/khoa-hoc" className="rounded-2xl px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm" style={{ background: 'linear-gradient(90deg,#60a5fa,#7c3aed)' }}>📚 Cho bé học</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mẹo hay */}
        <div className="mt-4 flex items-center gap-3 rounded-[24px] bg-violet-50 p-4 ring-1 ring-violet-100">
          <span className="text-2xl">💡</span>
          <p className="text-sm text-violet-900">
            <strong>Mẹo hay:</strong> Cập nhật đúng thông tin giúp bé nhận được lộ trình học phù hợp và theo dõi tiến độ chính xác hơn nhé!
          </p>
          <span className="ml-auto hidden text-3xl sm:block">📚</span>
        </div>
      </div>
    </section>
  );
}
