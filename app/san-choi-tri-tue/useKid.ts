'use client';

import { useEffect, useState } from 'react';
import { getCurrentChildId, listChildren, type Child } from '../lib/childData';
import { getNick, setNick } from '../lib/sanChoi';

/**
 * Bé đang chơi: hồ sơ bé (nếu có), tên hiện trên bảng điểm, lớp (mặc định 2).
 * Khách chưa có hồ sơ dùng biệt danh lưu trên máy (hỏi một lần).
 */
export function useKid() {
  const [child, setChild] = useState<Child | null>(null);
  const [nick, setNickState] = useState('');
  const [grade, setGrade] = useState(2);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setNickState(getNick());
      try {
        const kids = await listChildren();
        const id = getCurrentChildId();
        const me = kids.find((k) => k.id === id) || kids[0];
        if (alive && me) {
          setChild(me);
          const g = parseInt(String(me.currentLevel || '').replace(/\D/g, ''), 10);
          if (g >= 1 && g <= 5) setGrade(g);
        }
      } catch { /* khách chưa có hồ sơ */ }
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, []);

  const name = (child ? child.nickname || child.fullName : nick) || '';
  const saveNick = (n: string) => { setNick(n); setNickState(n.trim().slice(0, 24)); };

  return { child, name, grade, ready, needName: !child, saveNick };
}
