'use client';

import { useEffect, useState } from 'react';

/**
 * Map ảnh do admin upload cho từ vựng tiếng Anh: { wordId -> imageUrl }.
 * Lấy 1 lần từ backend (/api/vocab-images) rồi cache ở module để mọi component
 * (game từ vựng, flashcard) dùng chung, không gọi lại nhiều lần.
 * Từ nào có URL ảnh → hiển thị ảnh; không có → dùng emoji mặc định trong data.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let cache: Record<string, string> | null = null;
let inflight: Promise<Record<string, string>> | null = null;

function load(): Promise<Record<string, string>> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = fetch(`${API_URL}/api/vocab-images`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => {
        cache = d && typeof d === 'object' ? (d as Record<string, string>) : {};
        return cache;
      })
      .catch(() => {
        cache = {};
        return cache;
      });
  }
  return inflight;
}

export function isImageUrl(value: string | undefined | null): boolean {
  return !!value && /^https?:\/\//i.test(value);
}

/** Hook trả về map ảnh từ vựng (rỗng cho tới khi fetch xong). */
export function useVocabImages(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>(cache || {});
  useEffect(() => {
    let alive = true;
    load().then((m) => {
      if (alive) setMap(m);
    });
    return () => {
      alive = false;
    };
  }, []);
  return map;
}
