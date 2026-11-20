'use client';

// "Lớp của bé" — một lựa chọn dùng chung cho trang chủ, thanh tab dưới và menu.
// Lưu localStorage 'bhh_lop_cua_be' (định dạng cũ của ChonLop: 'mau-giao' | 'lop-N'). Chưa chọn mà hồ sơ bé
// đang chọn có lớp (Child.currentLevel) thì dùng lớp đó. Đổi lựa chọn phát sự kiện để các nơi khác cập nhật.

import { useEffect, useState } from 'react';
import { gradeFromKey, gradeKey, type Grade } from './catalog';
import { getCurrentChildId, listChildren } from './childData';

const KEY = 'bhh_lop_cua_be';
const EVT = 'bhh:lop-cua-be';

function readStored(): Grade | null {
  try {
    return gradeFromKey(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function setLopCuaBe(g: Grade | null) {
  try {
    if (g == null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, gradeKey(g));
  } catch {
    /* trình duyệt chặn lưu — vẫn đổi trong phiên này */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: g }));
}

/** [lớp, đã đọc xong]. Lần dựng đầu (máy chủ + hydrate) luôn là null để không lệch HTML. */
export function useLopCuaBe(): [Grade | null, boolean] {
  const [grade, setGrade] = useState<Grade | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const stored = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrade(stored);
    if (stored != null) setReady(true);
    else {
      // Chưa chọn: thử lấy lớp trong hồ sơ bé đang chọn.
      const id = getCurrentChildId();
      if (!id) setReady(true);
      else
        listChildren()
          .then((arr) => {
            if (!alive) return;
            const lv = gradeFromKey(arr.find((c) => c.id === id)?.currentLevel ?? null);
            if (lv != null) setGrade(lv);
          })
          .catch(() => {})
          .finally(() => alive && setReady(true));
    }
    const on = (e: Event) => setGrade((e as CustomEvent<Grade | null>).detail);
    window.addEventListener(EVT, on);
    return () => {
      alive = false;
      window.removeEventListener(EVT, on);
    };
  }, []);

  return [grade, ready];
}
