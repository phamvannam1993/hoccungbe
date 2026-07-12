'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listChildren, isGuest, setCurrentChildId, type Child } from '../../lib/childData';

/** Thanh chọn "bé đang học" — đảm bảo có childId để lưu kết quả (bhh_child_id). */
export default function CurrentChildBar() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    setGuest(isGuest());
    const stored = Number(localStorage.getItem('bhh_child_id') || '0');
    listChildren()
      .then((arr) => {
        setChildren(arr);
        if (arr.length) {
          const pick = arr.find((c) => c.id === stored)?.id ?? arr[0].id;
          setChildId(pick);
          setCurrentChildId(pick);
        }
      })
      .catch(() => setChildren([]))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  // Chưa có hồ sơ bé → mời tạo (để lưu được kết quả), không chặn chơi thử.
  if (children.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-3">
        <Link
          href="/ho-so-be"
          className="flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm ring-1 ring-amber-100 hover:bg-amber-100"
        >
          👶 Tạo hồ sơ bé để lưu kết quả học {guest && <span className="text-amber-500">(miễn phí, lưu trên trình duyệt)</span>} →
        </Link>
      </div>
    );
  }

  function select(id: number) {
    setChildId(id);
    setCurrentChildId(id);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-3">
      <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm shadow-sm ring-1 ring-slate-100 backdrop-blur w-fit">
        <span className="font-semibold text-slate-500">👶 Bé đang học:</span>
        {children.length === 1 ? (
          <span className="font-bold text-slate-800">{children[0].fullName}</span>
        ) : (
          <select
            value={childId ?? ''}
            onChange={(e) => select(Number(e.target.value))}
            className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-700 focus:outline-none"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
