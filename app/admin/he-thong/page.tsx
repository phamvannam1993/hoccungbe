'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Skill = { id: number; code: string; name: string; subject?: string };
type Badge = { id: number; code: string; name: string; icon?: string; points: number };
type Quest = { id: number; code: string; name: string; type: string; target: number; rewardBadgeCode?: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-xl font-black text-slate-800">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const input = 'rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none';
const btn = 'rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-50';

export default function AdminHeThongPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);

  const [skillForm, setSkillForm] = useState({ code: '', name: '', subject: 'language' });
  const [badgeForm, setBadgeForm] = useState({ code: '', name: '', icon: '', points: 10 });
  const [questForm, setQuestForm] = useState({ code: '', name: '', type: 'attempts', target: 5, rewardBadgeCode: '' });
  const [linkForm, setLinkForm] = useState({ lessonId: '', skillId: '' });

  const load = useCallback(() => {
    apiFetch<Skill[]>('/skills').then((r) => setSkills(Array.isArray(r) ? r : [])).catch(() => {});
    apiFetch<Badge[]>('/gamification/badges').then((r) => setBadges(Array.isArray(r) ? r : [])).catch(() => {});
    apiFetch<Quest[]>('/gamification/quests').then((r) => setQuests(Array.isArray(r) ? r : [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!skillForm.code || !skillForm.name) return;
    await apiFetch('/skills', { method: 'POST', body: JSON.stringify(skillForm) }).catch(() => {});
    setSkillForm({ code: '', name: '', subject: 'language' });
    load();
  }
  async function createBadge(e: React.FormEvent) {
    e.preventDefault();
    if (!badgeForm.code || !badgeForm.name) return;
    await apiFetch('/gamification/badges', { method: 'POST', body: JSON.stringify({ ...badgeForm, points: Number(badgeForm.points) }) }).catch(() => {});
    setBadgeForm({ code: '', name: '', icon: '', points: 10 });
    load();
  }
  async function createQuest(e: React.FormEvent) {
    e.preventDefault();
    if (!questForm.code || !questForm.name) return;
    await apiFetch('/gamification/quests', { method: 'POST', body: JSON.stringify({ ...questForm, target: Number(questForm.target), rewardBadgeCode: questForm.rewardBadgeCode || undefined }) }).catch(() => {});
    setQuestForm({ code: '', name: '', type: 'attempts', target: 5, rewardBadgeCode: '' });
    load();
  }
  async function linkSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!linkForm.lessonId || !linkForm.skillId) return;
    await apiFetch('/skills/link/lesson', { method: 'POST', body: JSON.stringify({ lessonId: Number(linkForm.lessonId), skillId: Number(linkForm.skillId) }) }).catch(() => {});
    setLinkForm({ lessonId: '', skillId: '' });
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản trị hệ thống học</h1>
      <p className="mt-2 text-sm text-slate-500">Quản lý kỹ năng, huy hiệu và nhiệm vụ cho toàn hệ thống.</p>

      <div className="mt-6 grid gap-6">
        {/* Skills */}
        <Section title={`Kỹ năng (${skills.length})`}>
          <form onSubmit={createSkill} className="flex flex-wrap items-end gap-3">
            <input className={input} placeholder="code (vd: doc-hieu)" value={skillForm.code} onChange={(e) => setSkillForm((f) => ({ ...f, code: e.target.value }))} />
            <input className={input} placeholder="Tên kỹ năng" value={skillForm.name} onChange={(e) => setSkillForm((f) => ({ ...f, name: e.target.value }))} />
            <select className={input} value={skillForm.subject} onChange={(e) => setSkillForm((f) => ({ ...f, subject: e.target.value }))}>
              <option value="language">Tiếng Việt</option>
              <option value="math">Toán</option>
              <option value="english">Tiếng Anh</option>
            </select>
            <button className={btn}>+ Thêm</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">#{s.id} {s.name} <span className="text-slate-400">({s.subject})</span></span>
            ))}
          </div>
          <form onSubmit={linkSkill} className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-slate-600">Gắn kỹ năng cho bài học:</span>
            <input className={input} placeholder="lessonId" value={linkForm.lessonId} onChange={(e) => setLinkForm((f) => ({ ...f, lessonId: e.target.value }))} />
            <input className={input} placeholder="skillId" value={linkForm.skillId} onChange={(e) => setLinkForm((f) => ({ ...f, skillId: e.target.value }))} />
            <button className={btn}>Gắn</button>
          </form>
        </Section>

        {/* Badges */}
        <Section title={`Huy hiệu (${badges.length})`}>
          <form onSubmit={createBadge} className="flex flex-wrap items-end gap-3">
            <input className={input} placeholder="code" value={badgeForm.code} onChange={(e) => setBadgeForm((f) => ({ ...f, code: e.target.value }))} />
            <input className={input} placeholder="Tên" value={badgeForm.name} onChange={(e) => setBadgeForm((f) => ({ ...f, name: e.target.value }))} />
            <input className={`${input} w-20`} placeholder="icon 🏅" value={badgeForm.icon} onChange={(e) => setBadgeForm((f) => ({ ...f, icon: e.target.value }))} />
            <input className={`${input} w-24`} type="number" placeholder="điểm" value={badgeForm.points} onChange={(e) => setBadgeForm((f) => ({ ...f, points: Number(e.target.value) }))} />
            <button className={btn}>+ Thêm</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.id} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{b.icon} {b.name}</span>
            ))}
          </div>
        </Section>

        {/* Quests */}
        <Section title={`Nhiệm vụ (${quests.length})`}>
          <form onSubmit={createQuest} className="flex flex-wrap items-end gap-3">
            <input className={input} placeholder="code" value={questForm.code} onChange={(e) => setQuestForm((f) => ({ ...f, code: e.target.value }))} />
            <input className={input} placeholder="Tên" value={questForm.name} onChange={(e) => setQuestForm((f) => ({ ...f, name: e.target.value }))} />
            <select className={input} value={questForm.type} onChange={(e) => setQuestForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="attempts">attempts</option>
              <option value="lessons_completed">lessons_completed</option>
              <option value="perfect_scores">perfect_scores</option>
              <option value="streak_days">streak_days</option>
            </select>
            <input className={`${input} w-20`} type="number" placeholder="target" value={questForm.target} onChange={(e) => setQuestForm((f) => ({ ...f, target: Number(e.target.value) }))} />
            <input className={input} placeholder="badge thưởng (code)" value={questForm.rewardBadgeCode} onChange={(e) => setQuestForm((f) => ({ ...f, rewardBadgeCode: e.target.value }))} />
            <button className={btn}>+ Thêm</button>
          </form>
          <div className="mt-3 space-y-1">
            {quests.map((q) => (
              <div key={q.id} className="text-sm text-slate-600">🎯 <strong>{q.name}</strong> — {q.type} ≥ {q.target}{q.rewardBadgeCode ? ` → 🏅 ${q.rewardBadgeCode}` : ''}</div>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
}
