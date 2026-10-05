'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../lib/api';

interface ExamItem {
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

const SUBJECT_LABEL: Record<string, string> = {
  'toan': 'Toán',
  'tieng-viet': 'Tiếng Việt',
  'tieng-anh': 'Tiếng Anh',
};

const SUBJECT_ICON: Record<string, string> = {
  'toan': '🔢',
  'tieng-viet': '📖',
  'tieng-anh': '🌍',
};

const CARD_COLORS = [
  { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
  { c: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)' },
  { c: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)' },
  { c: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)' },
  { c: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
];

function ExamListContent() {
  const searchParams = useSearchParams();
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState(searchParams.get('subject') ?? 'all');
  const [filterGrade, setFilterGrade] = useState(searchParams.get('grade') ?? 'all');

  useEffect(() => {
    apiFetch<ExamItem[]>('/exams')
      .then(setExams)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = exams.filter((e) => {
    if (filterSubject !== 'all' && e.subject !== filterSubject) return false;
    if (filterGrade !== 'all' && String(e.grade) !== filterGrade) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, ExamItem[]>>((acc, e) => {
    const key = `Lớp ${e.grade} – ${SUBJECT_LABEL[e.subject] ?? e.subject}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  const subjectPills: { value: string; label: string; emoji: string }[] = [
    { value: 'all', label: 'Tất cả', emoji: '🌈' },
    { value: 'toan', label: 'Toán', emoji: '🔢' },
    { value: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖' },
    { value: 'tieng-anh', label: 'Tiếng Anh', emoji: '🌍' },
  ];

  return (
    <div className="kid-bg min-h-screen relative overflow-hidden">
      {/* Floating decorations */}
      <div className="pointer-events-none absolute top-10 left-4 text-4xl kid-bounce select-none" aria-hidden>⭐</div>
      <div className="pointer-events-none absolute top-24 right-6 text-4xl kid-bounce select-none" style={{ animationDelay: '0.3s' }} aria-hidden>🎈</div>
      <div className="pointer-events-none absolute top-1/2 right-2 text-3xl kid-bounce select-none" style={{ animationDelay: '0.6s' }} aria-hidden>✨</div>
      <div className="pointer-events-none absolute bottom-20 left-6 text-4xl kid-bounce select-none" style={{ animationDelay: '0.9s' }} aria-hidden>🎉</div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2 relative">
        <nav className="flex items-center gap-1.5 text-sm font-bold">
          <Link href="/" className="text-pink-600 hover:text-pink-700">🏠 Trang chủ</Link>
          <span className="text-purple-400">›</span>
          <span className="text-purple-700">Đề thi</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 relative">
        {/* Hero card */}
        <div
          className="bg-white rounded-[32px] border-4 border-pink-200 p-6 sm:p-8 mb-6 kid-pop-in"
          style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl kid-bounce">📝</span>
            <h1
              className="text-2xl sm:text-3xl font-black kid-display"
              style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Đề thi đánh giá năng lực 🎯
            </h1>
          </div>
          <p className="text-purple-700/80 text-sm sm:text-base font-medium">
            Các đề kiểm tra siêu vui theo chuẩn Bộ Giáo dục – Đào tạo ✨
          </p>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {subjectPills.map((p) => {
              const active = filterSubject === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setFilterSubject(p.value)}
                  className="kid-btn-3d text-sm"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, #FF6B9D, #A06CD5)'
                      : 'linear-gradient(135deg, #FFF4D6, #FFE5B4)',
                    color: active ? '#fff' : '#A06CD5',
                    boxShadow: active ? '0 5px 0 #c2185b' : '0 4px 0 #FF9F4566',
                    padding: '8px 16px',
                  }}
                >
                  {p.emoji} {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setFilterGrade('all')}
              className="kid-btn-3d text-sm"
              style={{
                background: filterGrade === 'all' ? 'linear-gradient(135deg, #4ECDC4, #6BCB77)' : 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                color: filterGrade === 'all' ? '#fff' : '#16a34a',
                boxShadow: filterGrade === 'all' ? '0 5px 0 #0f766e' : '0 4px 0 #6BCB7766',
                padding: '8px 16px',
              }}
            >
              🌟 Tất cả lớp
            </button>
            {[1, 2, 3, 4, 5].map((g) => {
              const active = filterGrade === String(g);
              return (
                <button
                  key={g}
                  onClick={() => setFilterGrade(String(g))}
                  className="kid-btn-3d text-sm"
                  style={{
                    background: active ? 'linear-gradient(135deg, #4ECDC4, #6BCB77)' : 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                    color: active ? '#fff' : '#16a34a',
                    boxShadow: active ? '0 5px 0 #0f766e' : '0 4px 0 #6BCB7766',
                    padding: '8px 16px',
                  }}
                >
                  Lớp {g}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="bg-white rounded-3xl border-4 border-pink-200 p-12 text-center"
            style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
          >
            <div className="text-6xl mb-3 kid-bounce">📭</div>
            <p className="text-purple-700 font-bold text-lg kid-display">Chưa có đề thi nào đâu nhé!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupName, items], groupIdx) => (
            <div key={groupName} className="mb-8">
              <h2
                className="text-xl sm:text-2xl font-black kid-display mb-4 px-1 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                <span className="text-2xl">🎒</span> {groupName}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.sort((a, b) => a.semester - b.semester).map((exam, idx) => {
                  const color = CARD_COLORS[(groupIdx + idx) % CARD_COLORS.length];
                  const icon = SUBJECT_ICON[exam.subject] ?? '📋';
                  return (
                    <Link
                      key={exam.id}
                      href={`/de-thi/${exam.slug}`}
                      className="rounded-3xl p-5 kid-card-hover block"
                      style={{
                        background: color.bg,
                        border: `3px solid ${color.c}`,
                        boxShadow: `0 4px 0 ${color.c}66`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                          style={{ background: '#fff', border: `3px solid ${color.c}`, boxShadow: `0 3px 0 ${color.c}55` }}
                        >
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black kid-display text-base leading-snug" style={{ color: color.c }}>
                            {exam.title}
                          </h3>
                          {exam.description && (
                            <p className="text-xs text-purple-700/70 mt-1 line-clamp-2 font-medium">{exam.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold text-purple-700/80">
                            <span className="px-2 py-0.5 rounded-full bg-white/70" style={{ border: `2px solid ${color.c}55` }}>
                              📚 HK{exam.semester}
                            </span>
                            {exam.timeLimitMinutes && (
                              <span className="px-2 py-0.5 rounded-full bg-white/70" style={{ border: `2px solid ${color.c}55` }}>
                                ⏱️ {exam.timeLimitMinutes} phút
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-white/70" style={{ border: `2px solid ${color.c}55` }}>
                              📊 {exam.totalPoints} điểm
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span
                          className="kid-btn-3d text-sm inline-flex items-center gap-1"
                          style={{
                            background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)',
                            boxShadow: '0 5px 0 #c2185b',
                            padding: '8px 18px',
                            color: '#fff',
                          }}
                        >
                          🚀 Làm bài
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ExamListPage() {
  return (
    <Suspense
      fallback={
        <div className="kid-bg min-h-screen flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent" />
        </div>
      }
    >
      <ExamListContent />
    </Suspense>
  );
}
