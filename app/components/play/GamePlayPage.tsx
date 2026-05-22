'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { playFetch, type ApiGameLesson, type ApiLevel, type ApiQuestion, type MatrixData, type PatternData, type ConnectData, type SpotDiffData } from '../../lib/play-api';
import MatrixGame from './games/MatrixGame';
import PatternGame from './games/PatternGame';
import ConnectGame from './games/ConnectGame';
import SpotDiffGame from './games/SpotDiffGame';

type LessonDetail = {
  lesson: ApiGameLesson & { level: ApiLevel & { topic: { subject: { slug: string; name: string } } } };
  questions: ApiQuestion[];
};

export default function GamePlayPage({ lessonId }: { lessonId: string }) {
  const [data, setData] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [qIdx, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    playFetch<LessonDetail>(`/lessons/${lessonId}/questions`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [lessonId]);

  const handleCorrect = () => {
    const nextIdx = qIdx + 1;
    setCorrect((c) => c + 1);
    if (nextIdx >= (data?.questions.length ?? 0)) setDone(true);
    else setQIdx(nextIdx);
  };

  const handleWrong = () => {
    setWrong((w) => w + 1);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
    </div>
  );

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <p className="text-slate-500">Không tìm thấy bài học</p>
    </div>
  );

  const { lesson, questions } = data;
  const total = questions.length;
  const backHref = `/play`;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const pass = score >= lesson.passingScore;

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-100 to-amber-50 px-6 py-12">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl ring-2 ring-amber-200">
          <p className="text-7xl">{pass ? '🏆' : '💪'}</p>
          <h1 className="mt-4 text-2xl font-black text-slate-900">{pass ? 'Xuất sắc!' : 'Cố lên nhé!'}</h1>
          <p className="mt-2 text-slate-500">{lesson.title} — {lesson.level?.topic?.subject?.name}</p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-emerald-50 py-3">
              <p className="text-2xl font-black text-emerald-600">{correct}</p>
              <p className="text-xs text-slate-500">Đúng</p>
            </div>
            <div className="rounded-2xl bg-red-50 py-3">
              <p className="text-2xl font-black text-red-500">{wrong}</p>
              <p className="text-xs text-slate-500">Sai</p>
            </div>
            <div className={`rounded-2xl py-3 ${pass ? 'bg-amber-50' : 'bg-slate-50'}`}>
              <p className={`text-2xl font-black ${pass ? 'text-amber-600' : 'text-slate-500'}`}>{score}%</p>
              <p className="text-xs text-slate-500">Điểm</p>
            </div>
          </div>

          {pass && (
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200">
              <p className="font-bold text-amber-600">🎉 Bé đã vượt qua bài học!</p>
              <p className="text-xs text-slate-500 mt-1">Hoàn thành ≥ {lesson.passingScore}% để mở khoá bài tiếp theo</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {!pass && (
              <button onClick={() => { setQIdx(0); setCorrect(0); setWrong(0); setDone(false); }}
                className="w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600">
                🔄 Làm lại
              </button>
            )}
            <Link href={backHref}
              className="block w-full rounded-full bg-slate-100 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-200">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qIdx];
  const progress = ((qIdx) / total) * 100;

  const renderGame = () => {
    if (q.type === 'matrix') return <MatrixGame data={q.data as MatrixData} onCorrect={handleCorrect} onWrong={handleWrong} />;
    if (q.type === 'pattern') return <PatternGame data={q.data as PatternData} onCorrect={handleCorrect} onWrong={handleWrong} />;
    if (q.type === 'connect') return <ConnectGame data={q.data as ConnectData} onCorrect={handleCorrect} onWrong={handleWrong} />;
    if (q.type === 'spot_diff') return <SpotDiffGame data={q.data as SpotDiffData} onCorrect={handleCorrect} onWrong={handleWrong} />;
    return <div className="text-slate-500">Game type "{q.type}" đang phát triển...</div>;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-50">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white/80 backdrop-blur shadow-sm">
        <Link href={backHref} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-600">{lesson.title}</span>
            <span className="text-xs font-bold text-slate-500">{qIdx + 1}/{total}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-black">
          <span className="text-emerald-600">✓{correct}</span>
          <span className="text-red-400">✗{wrong}</span>
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur ring-2 ring-white">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            Câu {qIdx + 1} / {total}
          </p>
          {renderGame()}
        </div>
      </div>
    </div>
  );
}
