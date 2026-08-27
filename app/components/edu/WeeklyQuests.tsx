'use client';

import { useCallback, useEffect, useState } from 'react';
import { getCurrentChildId, childHistory, subjectInfo } from '../../lib/childData';
import { WEEKLY_QUESTS, questCurrent, isClaimed, claimQuest, type WeekStats } from '../../lib/quests';
import { confetti, playCorrect } from '../../lib/celebrate';

const WEEK = 7 * 86400000;

/**
 * Nhiệm vụ tuần — hiển thị mục tiêu tuần + nút nhận sao thưởng khi đạt. Tự nạp lịch sử
 * học của bé (7 ngày), chạy cho cả khách. Ẩn nếu chưa có hồ sơ bé.
 */
export default function WeeklyQuests() {
  const [childId, setChildId] = useState<number | null>(null);
  const [stats, setStats] = useState<WeekStats | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    const id = getCurrentChildId();
    if (!id) {
      setChildId(null);
      return;
    }
    setChildId(id);
    const hist = await childHistory(id, 300).catch(() => []);
    const now = Date.now();
    const week = hist.filter((h) => Date.parse(h.createdAt) >= now - WEEK);
    setStats({
      lessons: week.length,
      activeDays: new Set(week.map((h) => h.createdAt.slice(0, 10))).size,
      perfect: week.filter((h) => (h.score || 0) >= 100).length,
      subjects: new Set(week.map((h) => subjectInfo(h.courseType).name)).size,
    });
    setClaimedIds(WEEKLY_QUESTS.filter((q) => isClaimed(id, q.id)).map((q) => q.id));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!childId || !stats) return null;

  const claim = (questId: string) => {
    const q = WEEKLY_QUESTS.find((x) => x.id === questId)!;
    const gained = claimQuest(childId, q, stats);
    if (gained > 0) {
      setClaimedIds((ids) => [...ids, questId]);
      playCorrect();
      confetti('big');
      setToast(`🎉 +${gained} sao từ nhiệm vụ tuần!`);
      setTimeout(() => setToast(null), 1800);
    }
  };

  const doneCount = WEEKLY_QUESTS.filter((q) => questCurrent(q, stats) >= q.goal).length;

  return (
    <section className="rounded-3xl border-4 border-violet-100 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-800 kid-display">🎯 Nhiệm vụ tuần</h2>
        <span className="text-sm font-bold text-violet-500">{doneCount}/{WEEKLY_QUESTS.length} hoàn thành</span>
      </div>

      <div className="space-y-2.5">
        {WEEKLY_QUESTS.map((q) => {
          const cur = questCurrent(q, stats);
          const done = cur >= q.goal;
          const claimed = claimedIds.includes(q.id);
          const pct = Math.min(100, Math.round((cur / q.goal) * 100));
          return (
            <div key={q.id} className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 p-3">
              <span className="text-2xl">{q.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">{q.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${done ? 'bg-emerald-400' : 'bg-violet-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="shrink-0 text-[11px] font-bold text-slate-400">{Math.min(cur, q.goal)}/{q.goal}</span>
                </div>
              </div>
              {claimed ? (
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-600">✓ Đã nhận</span>
              ) : done ? (
                <button
                  type="button"
                  onClick={() => claim(q.id)}
                  className="shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-black text-white shadow animate-pulse"
                >
                  Nhận {q.reward}⭐
                </button>
              ) : (
                <span className="shrink-0 text-[11px] font-black text-amber-500">+{q.reward}⭐</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-slate-400">Nhiệm vụ đặt lại mỗi tuần — nhớ ghé đều nhé!</p>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="rounded-full bg-slate-900/90 px-5 py-2.5 text-sm font-bold text-white shadow-lg">{toast}</div>
        </div>
      )}
    </section>
  );
}
