'use client';

// Tiến độ học (số sao tốt nhất của từng bài) lưu trên trình duyệt.
import { useSyncExternalStore } from 'react';

const KEY = 'khv_progress';
const EMPTY = '{}';

type Progress = Record<string, Record<string, number>>; // slug → lessonId → sao (0–3)

const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

let cachedRaw = '';
let cachedValue: Progress = {};

function parse(raw: string): Progress {
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    // Chỉ nhận object thường; dữ liệu hỏng ("null", mảng, số…) coi như chưa học.
    cachedValue = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Progress) : {};
  } catch {
    cachedValue = {};
  }
  return cachedValue;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

const serverSnapshot: Progress = {};

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, () => parse(readRaw()), () => serverSnapshot);
}

export function saveStars(slug: string, lessonId: string, stars: number) {
  const data = { ...parse(readRaw()) };
  const course = { ...(data[slug] ?? {}) };
  if ((course[lessonId] ?? 0) >= stars && lessonId in course) return;
  course[lessonId] = stars;
  data[slug] = course;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* chế độ riêng tư → bỏ qua */
  }
  listeners.forEach((l) => l());
}
