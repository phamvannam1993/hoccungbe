'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, createChild, updateChild, deleteChild, childStats, childStreak, isGuest, setCurrentChildId, getPlacementLocal, lessonOptions, GRADES, gradeLabel, type Child, type Stats, type Streak, type ChildPrefs } from '../lib/childData';
import KidIcon, { type IconName, ChildAvatar, ALL_AVATARS } from '../components/edu/KidIcon';
import { Pencil, Trash2 } from 'lucide-react';

function fmtDate(d?: string) {
  if (!d) return '';
  const s = d.slice(0, 10);
  const [y, m, day] = s.split('-');
  return y && m && day ? `${day}/${m}/${y}` : s;
}

const BOOKS = ['Kết nối tri thức với cuộc sống', 'Chân trời sáng tạo', 'Cánh Diều'];
const PRIORITY = [
  { v: 'math', label: 'Toán', emoji: '🔢' },
  { v: 'language', label: 'Tiếng Việt', emoji: '📖' },
  { v: 'english', label: 'Tiếng Anh', emoji: '🅰️' },
];
const GOALS = [10, 15, 20];
const LEVELS = [
  { v: 'easy', label: 'Làm quen' },
  { v: 'medium', label: 'Luyện tập' },
  { v: 'hard', label: 'Thử thách' },
];
const WEAK_SKILLS = ['Cộng trừ', 'Đọc vần', 'Viết chữ', 'Nhớ số', 'Phân biệt âm', 'Tập trung'];

const subjectLabel = (v?: string) => PRIORITY.find((p) => p.v === v)?.label ?? '—';
const levelLabel = (v?: string) => LEVELS.find((l) => l.v === v)?.label ?? '—';

const EMPTY = {
  fullName: '', nickname: '', gender: 'male', birthDate: '', avatarUrl: '', currentLevel: '1',
  book: BOOKS[0], priority: 'math', mathLesson: '', vietLesson: '', dailyGoalMin: 15, desiredLevel: 'medium', weakSkills: [] as string[],
};

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
  const [lessonOpts, setLessonOpts] = useState<{ math: { id: number; title: string }[]; viet: { id: number; title: string }[] }>({ math: [], viet: [] });

  // Nạp danh sách bài Toán/Tiếng Việt theo lớp cho dropdown "bài đang học".
  useEffect(() => {
    let alive = true;
    lessonOptions(form.currentLevel).then((o) => { if (alive) setLessonOpts(o); }).catch(() => {});
    return () => { alive = false; };
  }, [form.currentLevel]);

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

  useEffect(() => {
    if (!currentId) { setStats(null); setStreak(null); return; }
    childStats(currentId).then(setStats).catch(() => setStats(null));
    childStreak(currentId).then(setStreak).catch(() => setStreak(null));
  }, [currentId, children]);

  function buildPrefs(): ChildPrefs {
    return {
      book: form.book, priority: form.priority,
      mathLesson: form.mathLesson.trim() || undefined,
      vietLesson: form.vietLesson.trim() || undefined,
      dailyGoalMin: form.dailyGoalMin, desiredLevel: form.desiredLevel,
      weakSkills: form.weakSkills,
    };
  }

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
        prefsJson: buildPrefs(),
      };
      if (editId != null) {
        await updateChild(editId, payload);
      } else {
        const child = await createChild(payload);
        setCurrentChildId(child.id); setCurrentId(child.id);
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
    const p = c.prefsJson ?? {};
    setEditId(c.id);
    setForm({
      fullName: c.fullName ?? '', nickname: c.nickname ?? '', gender: c.gender ?? 'male',
      birthDate: c.birthDate ? c.birthDate.slice(0, 10) : '', avatarUrl: c.avatarUrl ?? '', currentLevel: c.currentLevel ?? '1',
      book: p.book ?? BOOKS[0], priority: p.priority ?? 'math', mathLesson: p.mathLesson ?? '', vietLesson: p.vietLesson ?? '',
      dailyGoalMin: p.dailyGoalMin ?? 15, desiredLevel: p.desiredLevel ?? 'medium', weakSkills: p.weakSkills ?? [],
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function cancelEdit() { setEditId(null); setForm(EMPTY); }

  async function removeChild(id: number) {
    if (!confirm('Xóa hồ sơ bé này?')) return;
    try { await deleteChild(id); if (editId === id) cancelEdit(); load(); } catch { /* ignore */ }
  }
  function setCurrent(id: number) { setCurrentChildId(id); setCurrentId(id); }
  function toggleWeak(s: string) {
    setForm((f) => ({ ...f, weakSkills: f.weakSkills.includes(s) ? f.weakSkills.filter((x) => x !== s) : [...f.weakSkills, s] }));
  }

  const points = (stats?.totalCorrect ?? 0) * 10;
  const kpis: { icon: IconName; color: string; label: string; value: string; unit: string }[] = [
    { icon: 'bookBtn', color: '#2563eb', label: 'Bài đã học', value: `${stats?.lessonsCompleted ?? 0}`, unit: 'bài' },
    { icon: 'target', color: '#16a34a', label: 'Độ chính xác', value: `${Math.round(stats?.accuracy ?? 0)}`, unit: '%' },
    { icon: 'starBtn', color: '#7c3aed', label: 'Điểm thưởng', value: `${points}`, unit: '★' },
    { icon: 'clock', color: '#f59e0b', label: 'Chuỗi ngày', value: `${streak?.currentStreak ?? 0}`, unit: 'ngày' },
  ];
  const currentChild = children.find((c) => c.id === currentId);

  const field = 'mt-1.5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400';
  const inputCls = 'w-full min-w-0 bg-transparent py-2.5 text-sm font-normal text-slate-800 placeholder:text-slate-300 focus:outline-none';

  return (
    <section className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
      <div className="rounded-[24px] p-2.5 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header */}
        <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-sky-100 ring-4 ring-sky-50 sm:h-20 sm:w-20">
                  {currentChild ? <ChildAvatar child={currentChild} className="h-full w-full" /> : <span className="grid h-full w-full place-items-center text-4xl">🧒</span>}
                </div>
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-sky-500 text-sm text-white ring-2 ring-white">📷</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#1e3a8a] sm:text-3xl">Hồ sơ của bé</h1>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Điểm bắt đầu cho lộ trình học cá nhân hóa của bé</p>
              </div>
            </div>
            {currentChild && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-xl">
                {kpis.map((k) => (
                  <div key={k.label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                    <KidIcon name={k.icon} className="h-9 w-9 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate text-[10px] font-semibold text-slate-400">{k.label}</div>
                      <div className="text-base font-black leading-tight" style={{ color: k.color }}>{k.value} <span className="text-[10px] font-semibold text-slate-400">{k.unit}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {guest && (
          <div className="mt-3 rounded-2xl bg-sky-50 p-3.5 text-xs leading-6 text-sky-800 ring-1 ring-sky-100 sm:text-sm">
            👋 Bạn đang ở <strong>chế độ khách</strong> — vẫn tạo hồ sơ &amp; học bình thường, dữ liệu lưu trên trình duyệt này.{' '}
            <Link href="/dang-nhap" className="font-bold underline">Đăng nhập</Link> để đồng bộ nhiều thiết bị.
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* ── FORM ── */}
          <form onSubmit={submit} className="min-w-0 space-y-4">
            {/* Thông tin cơ bản */}
            <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-sm font-black text-violet-600">1</span> Thông tin cơ bản
                </h2>
                {editId != null && <button type="button" onClick={cancelEdit} className="text-xs font-bold text-slate-400 hover:text-slate-600">Hủy sửa</button>}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                <label className="block text-sm font-semibold text-slate-600">Họ và tên bé <span className="text-rose-500">*</span>
                  <div className={field}><span className="text-slate-400">👤</span>
                    <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required className={inputCls} placeholder="VD: Nguyễn Minh Khang" />
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-600">Tên gọi ở nhà
                  <div className={field}><span className="text-slate-400">😊</span>
                    <input value={form.nickname} onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))} className={inputCls} placeholder="VD: Bé Khang" />
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-600">Giới tính
                  <div className={field}><span className="text-slate-400">{form.gender === 'female' ? '👧' : '👦'}</span>
                    <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} className={inputCls}>
                      <option value="male">Bé trai</option><option value="female">Bé gái</option>
                    </select>
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-600">Lớp <span className="text-rose-500">*</span>
                  <div className={field}><span className="text-slate-400">🎒</span>
                    <select value={form.currentLevel} onChange={(e) => setForm((f) => ({ ...f, currentLevel: e.target.value }))} className={inputCls}>
                      {GRADES.map((g) => <option key={g} value={g}>{gradeLabel(g)}</option>)}
                    </select>
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-600 sm:col-span-2">Ngày sinh
                  <div className={field}><span className="text-slate-400">📅</span>
                    <input type="date" value={form.birthDate} onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))} className={inputCls} />
                  </div>
                </label>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-600">Ảnh đại diện</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_AVATARS.map((src) => {
                    const active = form.avatarUrl === src;
                    return (
                      <button key={src} type="button" onClick={() => setForm((f) => ({ ...f, avatarUrl: active ? '' : src }))}
                        className={`h-12 w-12 overflow-hidden rounded-full ring-2 transition ${active ? 'ring-sky-500 ring-offset-2' : 'ring-slate-200 hover:ring-sky-300'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="avatar" className="h-full w-full object-cover" draggable={false} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Thiết lập cá nhân hóa */}
            <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-sm font-black text-violet-600">2</span> Thiết lập cá nhân hóa
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                <label className="block text-sm font-semibold text-slate-600">Bộ sách đang sử dụng
                  <div className={field}><span className="text-slate-400">📚</span>
                    <select value={form.book} onChange={(e) => setForm((f) => ({ ...f, book: e.target.value }))} className={inputCls}>
                      {BOOKS.map((b) => <option key={b} value={b}>{b} – {gradeLabel(form.currentLevel)}</option>)}
                    </select>
                  </div>
                </label>
                <div className="block text-sm font-semibold text-slate-600">Môn cần ưu tiên
                  <div className="mt-1.5 flex gap-2">
                    {PRIORITY.map((p) => {
                      const on = form.priority === p.v;
                      return (
                        <button key={p.v} type="button" onClick={() => setForm((f) => ({ ...f, priority: p.v }))}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold ring-1 transition ${on ? 'bg-blue-600 text-white ring-blue-600' : 'bg-slate-50 text-slate-600 ring-slate-200 hover:ring-blue-300'}`}>
                          <span>{p.emoji}</span> {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="block text-sm font-semibold text-slate-600">Bài Toán đang học trên lớp
                  <div className={field}><span className="text-slate-400">🔢</span>
                    <select value={form.mathLesson} onChange={(e) => setForm((f) => ({ ...f, mathLesson: e.target.value }))} className={inputCls}>
                      <option value="">{lessonOpts.math.length ? '— Chọn bài Toán —' : 'Đang tải…'}</option>
                      {lessonOpts.math.map((l) => <option key={l.id} value={l.title}>{l.title}</option>)}
                    </select>
                  </div>
                </label>
                <label className="block text-sm font-semibold text-slate-600">Bài Tiếng Việt đang học
                  <div className={field}><span className="text-slate-400">🔤</span>
                    <select value={form.vietLesson} onChange={(e) => setForm((f) => ({ ...f, vietLesson: e.target.value }))} className={inputCls}>
                      <option value="">{lessonOpts.viet.length ? '— Chọn bài Tiếng Việt —' : 'Đang tải…'}</option>
                      {lessonOpts.viet.map((l) => <option key={l.id} value={l.title}>{l.title}</option>)}
                    </select>
                  </div>
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="text-sm font-semibold text-slate-600">Mục tiêu học mỗi ngày
                  <div className="mt-1.5 flex gap-2">
                    {GOALS.map((g) => {
                      const on = form.dailyGoalMin === g;
                      return <button key={g} type="button" onClick={() => setForm((f) => ({ ...f, dailyGoalMin: g }))} className={`flex-1 rounded-xl py-2 text-xs font-bold ring-1 transition ${on ? 'bg-blue-600 text-white ring-blue-600' : 'bg-slate-50 text-slate-600 ring-slate-200 hover:ring-blue-300'}`}>{g} phút</button>;
                    })}
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-600">Mức độ mong muốn
                  <div className="mt-1.5 flex gap-2">
                    {LEVELS.map((l) => {
                      const on = form.desiredLevel === l.v;
                      return <button key={l.v} type="button" onClick={() => setForm((f) => ({ ...f, desiredLevel: l.v }))} className={`flex-1 rounded-xl py-2 text-xs font-bold ring-1 transition ${on ? 'bg-blue-600 text-white ring-blue-600' : 'bg-slate-50 text-slate-600 ring-slate-200 hover:ring-blue-300'}`}>{l.label}</button>;
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm font-semibold text-slate-600">Những kỹ năng phụ huynh thấy bé còn yếu
                <div className="mt-2 flex flex-wrap gap-2">
                  {WEAK_SKILLS.map((s) => {
                    const on = form.weakSkills.includes(s);
                    return <button key={s} type="button" onClick={() => toggleWeak(s)} className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${on ? 'bg-rose-500 text-white ring-rose-500' : 'bg-slate-50 text-slate-600 ring-slate-200 hover:ring-rose-300'}`}>{s}</button>;
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-50 px-3.5 py-2.5 text-xs text-sky-800 ring-1 ring-sky-100">
                <span>ℹ️</span> Bé sẽ được gợi ý lộ trình học phù hợp sau khi hoàn tất hồ sơ.
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <button type="submit" disabled={saving || !form.fullName.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg,#60a5fa,#7c3aed)' }}>
                  {saving ? 'Đang lưu…' : editId != null ? '✓ Cập nhật hồ sơ' : '+ Tạo hồ sơ bé'}
                </button>
                <Link href="/khao-sat-dau-vao" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-300 bg-amber-50 px-6 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100">
                  📋 Làm bài đánh giá đầu vào →
                </Link>
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-400">Khảo sát ngắn 10–15 câu để hệ thống hiểu năng lực của bé.</p>
            </div>
          </form>

          {/* ── CỘT PHẢI ── */}
          <div className="min-w-0 space-y-4">
            {/* Danh sách bé */}
            <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-100 text-sm">👨‍👩‍👧</span> Danh sách bé
                </h2>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600">{children.length} bé</span>
              </div>

              <div className="mt-4 space-y-3">
                {loading && <p className="py-6 text-center text-sm text-slate-400">Đang tải…</p>}
                {!loading && children.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Chưa có hồ sơ bé nào. Tạo bé đầu tiên bên trái nhé!</p>}
                {children.map((c) => {
                  const active = currentId === c.id;
                  const female = c.gender === 'female';
                  const p = c.prefsJson ?? {};
                  const placed = !!(c.placementJson || getPlacementLocal(c.id));
                  return (
                    <div key={c.id} className={`rounded-2xl p-3 ring-1 ${active ? 'bg-emerald-50/60 ring-emerald-200' : 'bg-slate-50/60 ring-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <ChildAvatar child={c} className={`h-11 w-11 shrink-0 ring-2 ${female ? 'ring-pink-200' : 'ring-sky-200'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black text-slate-800">{c.fullName}</p>
                          <p className="truncate text-xs text-slate-400">{female ? 'Bé gái' : 'Bé trai'}{c.birthDate ? ` · ${fmtDate(c.birthDate)}` : ''}</p>
                        </div>
                        {active
                          ? <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Đang chọn</span>
                          : <button onClick={() => setCurrent(c.id)} className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50">Chọn</button>}
                        <button onClick={() => startEdit(c)} title="Sửa" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-sky-600 ring-1 ring-slate-200 hover:bg-sky-50"><Pencil size={13} /></button>
                        <button onClick={() => removeChild(c.id)} title="Xóa" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-rose-500 ring-1 ring-rose-200 hover:bg-rose-50"><Trash2 size={13} /></button>
                      </div>
                      <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                        <Row icon="🎒" label="Lớp" value={gradeLabel(c.currentLevel)} />
                        <Row icon="🕒" label="Mục tiêu" value={`${p.dailyGoalMin ?? 15} phút/ngày`} />
                        <Row icon="📗" label="Môn ưu tiên" value={subjectLabel(p.priority)} />
                        <Row icon="📊" label="Mức độ" value={levelLabel(p.desiredLevel)} />
                        <Row icon="📋" label="Đánh giá đầu vào" value={placed ? 'Đã làm' : 'Chưa làm'} valueClass={placed ? 'text-emerald-600' : 'text-amber-600'} />
                      </dl>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bắt đầu cá nhân hóa */}
            <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-violet-50 to-indigo-50 p-4 shadow-sm ring-1 ring-violet-100 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black text-violet-800">Bắt đầu cá nhân hóa</h3>
                <span className="text-3xl">🚀</span>
              </div>
              <ol className="mt-3 space-y-3">
                {[
                  { t: 'Tạo hồ sơ', d: 'Cung cấp thông tin cơ bản của bé' },
                  { t: 'Làm đánh giá đầu vào', d: 'Khảo sát ngắn để hiểu năng lực hiện tại' },
                  { t: 'Nhận lộ trình học riêng', d: 'Hệ thống gợi ý nội dung phù hợp mỗi ngày' },
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500 text-xs font-black text-white">{i + 1}</span>
                    <div><p className="text-sm font-black text-slate-800">{s.t}</p><p className="text-xs text-slate-500">{s.d}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/dashboard" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">📊 Xem tiến độ</Link>
              <Link href="/hoc-hom-nay" className="rounded-2xl px-4 py-3 text-center text-sm font-bold text-white shadow-sm" style={{ background: 'linear-gradient(90deg,#60a5fa,#7c3aed)' }}>📚 Cho bé học</Link>
            </div>
            <Link href="/khao-sat-dau-vao" className="block rounded-2xl border-2 border-amber-300 bg-white px-4 py-3 text-center text-sm font-bold text-amber-700 hover:bg-amber-50">📋 Làm đánh giá đầu vào</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, label, value, valueClass }: { icon: string; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-slate-500"><span>{icon}</span> {label}</dt>
      <dd className={`font-bold ${valueClass ?? 'text-slate-700'}`}>{value}</dd>
    </div>
  );
}
