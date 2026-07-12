'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type Quiz = {
  id: number;
  lessonId: number;
  questionText: string;
  questionType: string;
  optionsJson?: { key: string; text: string }[] | null;
  correctAnswerJson?: unknown;
  difficultyLevel?: string;
};

function correctText(q: Quiz): string {
  const ans = q.correctAnswerJson;
  if (ans == null) return '';
  if (typeof ans === 'boolean') return ans ? 'Đúng' : 'Sai';
  if (typeof ans === 'string' || typeof ans === 'number') {
    const opt = q.optionsJson?.find((o) => o.key === String(ans));
    return opt ? `${opt.key}. ${opt.text}` : String(ans);
  }
  if (Array.isArray(ans)) return ans.join(', ');
  if (typeof ans === 'object') return Object.values(ans as Record<string, unknown>).join(', ');
  return String(ans);
}

export default function OnTapCauSaiClient() {
  const [items, setItems] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);

  useEffect(() => {
    const childId = Number(localStorage.getItem('bhh_child_id') || '0');
    if (!childId) {
      setNoChild(true);
      setLoading(false);
      return;
    }
    apiFetch<Quiz[]>(`/attempts/wrong/${childId}`)
      .then((r) => setItems(Array.isArray(r) ? r : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="rounded-[28px] bg-gradient-to-r from-rose-500 to-orange-400 p-6 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">Ôn tập</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Ôn lại câu sai</h1>
        <p className="mt-3 text-sm leading-7 text-white/90">
          Những câu bé từng trả lời sai được gom lại đây để ôn cho nhớ lâu.
        </p>
      </div>

      {loading && <p className="mt-8 text-center text-slate-500">Đang tải…</p>}

      {!loading && noChild && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
          Chưa chọn hồ sơ bé. Hãy vào <Link href="/dashboard" className="font-bold underline">Dashboard</Link> để chọn bé.
        </div>
      )}

      {!loading && !noChild && items.length === 0 && (
        <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center text-emerald-700 ring-1 ring-emerald-100">
          🎉 Tuyệt vời! Hiện không còn câu nào bé đang làm sai.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {items.map((q, i) => (
          <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-slate-800">
                <span className="mr-2 text-rose-500">#{i + 1}</span>
                {q.questionText}
              </p>
              {q.difficultyLevel && (
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
                  {q.difficultyLevel === 'easy' ? 'Dễ' : q.difficultyLevel === 'medium' ? 'TB' : 'Khó'}
                </span>
              )}
            </div>

            {q.optionsJson && q.optionsJson.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.optionsJson.map((o) => {
                  const isCorrect = String(q.correctAnswerJson) === o.key;
                  return (
                    <div
                      key={o.key}
                      className={`rounded-xl px-3 py-2 text-sm ring-1 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 font-bold'
                          : 'bg-slate-50 text-slate-600 ring-slate-100'
                      }`}
                    >
                      {o.key}. {o.text} {isCorrect && '✓'}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-3 text-sm">
              <span className="font-semibold text-slate-500">Đáp án đúng: </span>
              <span className="font-bold text-emerald-700">{correctText(q)}</span>
            </p>
            <Link href={`/lessons/${q.lessonId}`} className="mt-2 inline-block text-xs font-bold text-sky-600">
              Học lại bài này →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
