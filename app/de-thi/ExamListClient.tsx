'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export interface ExamItem {
  id: number;
  title: string;
  slug: string;
  subject: string;
  grade: number;
  semester: number;
  description?: string;
  timeLimitMinutes?: number;
  totalPoints: number;
}

export const SUBJECT_LABEL: Record<string, string> = {
  toan: 'Toán', 'tieng-viet': 'Tiếng Việt', 'tieng-anh': 'Tiếng Anh',
};
const SUBJECT_ICON: Record<string, string> = {
  toan: '🔢', 'tieng-viet': '📖', 'tieng-anh': '🌍',
};
const CARD_COLORS = [
  { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
  { c: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)' },
  { c: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)' },
  { c: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)' },
  { c: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
];

function ExamListInner({ exams }: { exams: ExamItem[] }) {
  const searchParams = useSearchParams();
  const [filterSubject, setFilterSubject] = useState(searchParams.get('subject') ?? 'all');
  const [filterGrade, setFilterGrade] = useState(searchParams.get('grade') ?? 'all');

  const filtered = exams.filter((e) => {
    if (filterSubject !== 'all' && e.subject !== filterSubject) return false;
    if (filterGrade !== 'all' && String(e.grade) !== filterGrade) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, ExamItem[]>>((acc, e) => {
    const key = `Lớp ${e.grade} – ${SUBJECT_LABEL[e.subject] ?? e.subject}`;
    (acc[key] ||= []).push(e);
    return acc;
  }, {});

  const grades = Array.from(new Set(exams.map((e) => e.grade))).sort((a, b) => a - b);
  const subjectPills = [
    { value: 'all', label: 'Tất cả', emoji: '🌈' },
    { value: 'toan', label: 'Toán', emoji: '🔢' },
    { value: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖' },
    { value: 'tieng-anh', label: 'Tiếng Anh', emoji: '🌍' },
  ];

  return (
    <>
      {/* Bộ lọc tương tác */}
      <div className="mb-6 rounded-[28px] border-4 border-pink-200 bg-white p-5 sm:p-6" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.15)' }}>
        <p className="mb-2 text-sm font-bold text-purple-700">🔎 Lọc đề thi</p>
        <div className="flex flex-wrap gap-2">
          {subjectPills.map((p) => {
            const active = filterSubject === p.value;
            return (
              <button key={p.value} onClick={() => setFilterSubject(p.value)} className="kid-btn-3d text-sm"
                style={{ background: active ? 'linear-gradient(135deg, #FF6B9D, #A06CD5)' : 'linear-gradient(135deg, #FFF4D6, #FFE5B4)', color: active ? '#fff' : '#A06CD5', boxShadow: active ? '0 5px 0 #c2185b' : '0 4px 0 #FF9F4566', padding: '8px 16px' }}>
                {p.emoji} {p.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setFilterGrade('all')} className="kid-btn-3d text-sm"
            style={{ background: filterGrade === 'all' ? 'linear-gradient(135deg, #4ECDC4, #6BCB77)' : 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', color: filterGrade === 'all' ? '#fff' : '#16a34a', boxShadow: filterGrade === 'all' ? '0 5px 0 #0f766e' : '0 4px 0 #6BCB7766', padding: '8px 16px' }}>
            🌟 Tất cả lớp
          </button>
          {grades.map((g) => {
            const active = filterGrade === String(g);
            return (
              <button key={g} onClick={() => setFilterGrade(String(g))} className="kid-btn-3d text-sm"
                style={{ background: active ? 'linear-gradient(135deg, #4ECDC4, #6BCB77)' : 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', color: active ? '#fff' : '#16a34a', boxShadow: active ? '0 5px 0 #0f766e' : '0 4px 0 #6BCB7766', padding: '8px 16px' }}>
                Lớp {g}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border-4 border-pink-200 bg-white p-12 text-center" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="mb-3 text-6xl kid-bounce">📭</div>
          <p className="text-lg font-bold text-purple-700 kid-display">Không có đề thi phù hợp bộ lọc.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([groupName, items], groupIdx) => (
          <div key={groupName} className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 px-1 text-xl font-black kid-display sm:text-2xl" style={{ background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <span className="text-2xl">🎒</span> {groupName}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.sort((a, b) => a.semester - b.semester).map((exam, idx) => {
                const color = CARD_COLORS[(groupIdx + idx) % CARD_COLORS.length];
                const icon = SUBJECT_ICON[exam.subject] ?? '📋';
                return (
                  <Link key={exam.id} href={`/de-thi/${exam.slug}`} className="kid-card-hover block rounded-3xl p-5"
                    style={{ background: color.bg, border: `3px solid ${color.c}`, boxShadow: `0 4px 0 ${color.c}66` }}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl" style={{ background: '#fff', border: `3px solid ${color.c}`, boxShadow: `0 3px 0 ${color.c}55` }}>{icon}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black leading-snug kid-display" style={{ color: color.c }}>{exam.title}</h3>
                        {exam.description && <p className="mt-1 line-clamp-2 text-xs font-medium text-purple-700/70">{exam.description}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-purple-700/80">
                          <span className="rounded-full bg-white/70 px-2 py-0.5" style={{ border: `2px solid ${color.c}55` }}>📚 HK{exam.semester}</span>
                          {exam.timeLimitMinutes && <span className="rounded-full bg-white/70 px-2 py-0.5" style={{ border: `2px solid ${color.c}55` }}>⏱️ {exam.timeLimitMinutes} phút</span>}
                          <span className="rounded-full bg-white/70 px-2 py-0.5" style={{ border: `2px solid ${color.c}55` }}>📊 {exam.totalPoints} điểm</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="kid-btn-3d inline-flex items-center gap-1 text-sm" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', boxShadow: '0 5px 0 #c2185b', padding: '8px 18px', color: '#fff' }}>🚀 Làm bài</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default function ExamListClient({ exams }: { exams: ExamItem[] }) {
  return (
    <Suspense fallback={null}>
      <ExamListInner exams={exams} />
    </Suspense>
  );
}
