'use client';

import { preprocessTTS } from '../../components/edu/utils/ttsText';

// Âm thanh lấy từ bộ app 3 Gốc (public/khoa-hoc-vui/audio) + đọc đề bằng /api/tts.
//   tap      – chạm nút / chọn đáp án
//   match    – ghép đúng một cặp (lật ô, ghép hình)
//   miss     – ghép sai một cặp
//   correct  – trả lời đúng cả câu: giọng khen true01…true06 theo số câu đúng
//   wrong    – trả lời sai: giọng động viên false01…false04 theo số câu sai
//   result   – màn kết quả: 50 / 70 / 90 theo điểm

const AUDIO = '/khoa-hoc-vui/audio';

type Sfx = 'tap' | 'match' | 'miss' | 'correct' | 'wrong' | 'result';

let enabled = true;
let effect: HTMLAudioElement | null = null;
let voice: HTMLAudioElement | null = null;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    stopSpeak();
    effect?.pause();
  }
}

export function isSoundEnabled() {
  return enabled;
}

function fileFor(kind: Sfx, n: number) {
  switch (kind) {
    case 'tap':
      return `${AUDIO}/button.mp3`;
    case 'match':
      return `${AUDIO}/button3.mp3`;
    case 'miss':
      return `${AUDIO}/sfx_laser.mp3`;
    case 'correct':
      return `${AUDIO}/true0${Math.min(6, Math.max(1, n))}.mp3`;
    case 'wrong':
      return `${AUDIO}/false0${Math.min(4, Math.max(1, n))}.mp3`;
    case 'result':
      return `${AUDIO}/${n >= 90 ? 90 : n >= 70 ? 70 : 50}.mp3`;
  }
}

/**
 * @param n correct/wrong: thứ tự câu đúng/sai (1, 2, 3…); result: điểm phần trăm.
 */
export function playSfx(kind: Sfx, n = 1) {
  if (!enabled || typeof window === 'undefined') return;
  const short = kind === 'tap' || kind === 'match' || kind === 'miss';
  const audio = new Audio(fileFor(kind, n));
  if (!short) {
    // Giọng khen/động viên: tắt giọng trước để không chồng tiếng.
    effect?.pause();
    stopSpeak();
    effect = audio;
  }
  audio.play().catch(() => {});
}

/** API giọng đọc nhận tối đa ~200 ký tự mỗi lần → chia theo câu / dấu phẩy rồi đọc nối tiếp. */
const MAX_CHUNK = 180;

export function splitForSpeech(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const out: string[] = [];
  let cur = '';
  const push = () => {
    if (cur.trim()) out.push(cur.trim());
    cur = '';
  };
  for (const sentence of clean.split(/(?<=[.!?…:;])\s+/)) {
    if ((cur + ' ' + sentence).length <= MAX_CHUNK) {
      cur = cur ? `${cur} ${sentence}` : sentence;
      continue;
    }
    push();
    if (sentence.length <= MAX_CHUNK) {
      cur = sentence;
      continue;
    }
    // Câu quá dài: cắt tiếp theo dấu phẩy, cuối cùng theo khoảng trắng.
    for (const part of sentence.split(/(?<=,)\s+/)) {
      if ((cur + ' ' + part).length <= MAX_CHUNK) {
        cur = cur ? `${cur} ${part}` : part;
        continue;
      }
      push();
      let rest = part;
      while (rest.length > MAX_CHUNK) {
        const cut = rest.lastIndexOf(' ', MAX_CHUNK);
        out.push(rest.slice(0, cut > 0 ? cut : MAX_CHUNK));
        rest = rest.slice(cut > 0 ? cut + 1 : MAX_CHUNK);
      }
      cur = rest;
    }
  }
  push();
  return out;
}

let speechToken = 0;

export function speak(text: string) {
  if (!enabled || typeof window === 'undefined' || !text.trim()) return;
  stopSpeak();
  const token = ++speechToken;
  const chunks = splitForSpeech(text);
  const playAt = (i: number) => {
    if (token !== speechToken || i >= chunks.length) return;
    /* TIỀN XỬ LÝ TRƯỚC KHI TRA KHO — bắt buộc, không phải trang trí.
     *
     * `cacheKey` của kho giọng đọc tính từ chữ ĐÃ qua `preprocessTTS`. Trang này
     * trước đây gửi chữ THÔ, nên mọi lượt tra đều trượt khi câu có số hay đơn vị:
     * kho lưu "bảy xăng ti mét" còn trang hỏi "7 cm". Đo 17/10/2026 — sinh xong
     * 1.682 đoạn mà không đoạn nào được dùng.
     *
     * Cắt mẩu TRƯỚC rồi mới tiền xử lý TỪNG MẨU: phép sinh audio cũng làm đúng thứ
     * tự ấy, đổi thứ tự là khoá lại lệch. */
    voice = new Audio(`/api/tts?q=${encodeURIComponent(preprocessTTS(chunks[i]))}`);
    voice.onended = () => playAt(i + 1);
    voice.onerror = () => playAt(i + 1);
    voice.play().catch(() => {});
  };
  playAt(0);
}

export function stopSpeak() {
  speechToken++;
  if (voice) {
    voice.pause();
    voice.src = '';
    voice = null;
  }
}
