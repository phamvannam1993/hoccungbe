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

const SUBJECT_COLOR: Record<string, string> = {
  'toan': '#3b82f6',
  'tieng-viet': '#f59e0b',
  'tieng-anh': '#22c55e',
};

const SUBJECT_ICON: Record<string, string> = {
  'toan': '🔢',
  'tieng-viet': '📖',
  'tieng-anh': '🌍',
};

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

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-sm text-white/80">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          <span className="text-white/50">›</span>
          <span className="text-white font-medium">Đề thi</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">📋 Đề thi & Kiểm tra</h1>
          <p className="text-gray-500 text-sm">Các đề kiểm tra theo chuẩn Bộ Giáo dục – Đào tạo</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400">
              <option value="all">Tất cả môn</option>
              <option value="toan">Toán</option>
              <option value="tieng-viet">Tiếng Việt</option>
              <option value="tieng-anh">Tiếng Anh</option>
            </select>
            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400">
              <option value="all">Tất cả lớp</option>
              {[1, 2, 3, 4, 5].map((g) => (
                <option key={g} value={String(g)}>Lớp {g}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Chưa có đề thi nào</p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupName, items]) => (
            <div key={groupName} className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3 px-1">{groupName}</h2>
              <div className="space-y-3">
                {items.sort((a, b) => a.semester - b.semester).map((exam) => {
                  const color = SUBJECT_COLOR[exam.subject] ?? '#6b7280';
                  const icon = SUBJECT_ICON[exam.subject] ?? '📋';
                  return (
                    <Link key={exam.id} href={`/de-thi/${exam.slug}`}
                      className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: color + '15' }}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors">{exam.title}</h3>
                        {exam.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{exam.description}</p>}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                          <span>HK{exam.semester}</span>
                          {exam.timeLimitMinutes && <span>⏱ {exam.timeLimitMinutes} phút</span>}
                          <span>📊 {exam.totalPoints} điểm</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: color }}>
                        Làm bài →
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
    <Suspense fallback={<div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" /></div>}>
      <ExamListContent />
    </Suspense>
  );
}
