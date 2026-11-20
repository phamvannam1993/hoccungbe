'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { childStreak, dailyPlan, getCurrentChildId, listChildren, type Child } from '../../lib/childData';

// "Hôm nay của bé" trên trang chủ: chuỗi ngày học + số việc trong kế hoạch hôm nay (cùng dữ liệu với
// /hoc-hom-nay). Chưa có hồ sơ bé thì mời tạo. Máy chủ luôn vẽ bản "chưa có bé" để không lệch hydrate.

export default function HomNayCuaBe() {
  const [child, setChild] = useState<Child | null>(null);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const id = getCurrentChildId();
    if (!id) return;
    (async () => {
      try {
        const kids = await listChildren();
        const c = kids.find((k) => k.id === id) ?? null;
        if (!alive || !c) return;
        setChild(c);
        const [s, plan] = await Promise.all([childStreak(id).catch(() => null), dailyPlan(id).catch(() => [])]);
        if (!alive) return;
        setStreak(s?.currentStreak ?? 0);
        setTasks(plan.length);
      } catch {
        /* khối phụ — lỗi thì giữ bản mời tạo hồ sơ */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const name = child?.nickname || child?.fullName;

  return (
    <div className="flex flex-col gap-3 rounded-[28px] border-2 border-orange-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-2xl" aria-hidden>☀️</span>
      <div className="min-w-0 flex-1">
        <h2 className="kid-display text-lg font-black text-slate-900 sm:text-xl">
          {name ? `Hôm nay của ${name}` : 'Hôm nay của bé'}
          {streak > 0 && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 align-middle text-xs font-black text-orange-700">🔥 chuỗi {streak} ngày</span>}
        </h2>
        <p className="text-sm text-slate-600">
          {child
            ? tasks
              ? `${tasks} việc ngắn, khoảng 15 phút: ôn câu sai, học tiếp bài đang dở, một thử thách.`
              : 'Học một bài mới để có kế hoạch riêng cho ngày mai.'
            : 'Mỗi ngày 15 phút: ôn câu sai, học tiếp bài đang dở, một thử thách nhỏ. Tạo hồ sơ bé để có kế hoạch riêng.'}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {!child && (
          <Link href="/ho-so-be" className="kid-display rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200">
            Tạo hồ sơ bé
          </Link>
        )}
        <Link href="/hoc-hom-nay" className="kid-display rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#c2410c] hover:bg-orange-600">
          {child ? 'Bắt đầu' : 'Xem thử'} →
        </Link>
      </div>
    </div>
  );
}
