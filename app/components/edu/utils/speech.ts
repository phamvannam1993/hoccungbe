// utils/speech.ts
// Đọc bằng giọng riêng của app qua /api/tts (natural voice, cached). Không dùng Google TTS.
//
// iOS Safari chặn phát audio ngoài cử chỉ người dùng. Vì vậy ta DÙNG CHUNG một phần tử
// <audio> duy nhất và "mở khóa" nó ngay trong lần chạm đầu tiên (unlockAudio) — sau đó
// mọi lần gọi speakText (kể cả tự động, không do chạm) đều phát được trên iPhone.

export type SpeakTextOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  preferredVoiceNameIncludes?: string[];
};

// WAV im lặng cực ngắn để "bless" phần tử audio trong cử chỉ chạm.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

let _audioEl: HTMLAudioElement | null = null;
let _unlocked = false;

function getEl(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!_audioEl) {
    _audioEl = new Audio();
    _audioEl.preload = 'auto';
  }
  return _audioEl;
}

// Gọi trong một sự kiện chạm/click (vd khi bấm "Bắt đầu đua") để cho phép iOS
// phát audio tự động về sau. An toàn khi gọi nhiều lần.
export function unlockAudio(): void {
  if (typeof window === 'undefined' || _unlocked) return;
  const el = getEl();
  if (!el) return;
  try {
    el.muted = true;
    el.src = SILENT_WAV;
    const p = el.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        el.pause();
        try { el.currentTime = 0; } catch { /* ignore */ }
        el.muted = false;
        _unlocked = true;
      }).catch(() => { el.muted = false; });
    } else {
      el.muted = false;
      _unlocked = true;
    }
  } catch {
    el.muted = false;
  }
}

export function speakText(text: string, options: SpeakTextOptions = {}): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  const el = getEl();
  if (!el) return;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  // Ép ngôn ngữ theo option.lang: 'en-US'/'en' → giọng Anh, còn lại → giọng Việt.
  // (Route /api/tts đọc tham số `tl`.) Không có lang → mặc định tiếng Việt.
  const tl = options.lang && options.lang.toLowerCase().startsWith('en') ? 'en' : 'vi';
  // Tái sử dụng cùng một phần tử (đã được mở khóa) → phát được cả khi tự động.
  el.src = `/api/tts?q=${encodeURIComponent(text.trim())}&tl=${tl}`;
  el.play().catch(() => { /* chỉ dùng giọng API */ });
}

// URL đọc qua proxy /api/tts: tl='en' → giọng Mỹ, 'vi' → giọng Việt. speed<1 → đọc chậm.
// Dùng MP3 server-side (Google Translate TTS) nên KHÔNG phụ thuộc giọng cài trên máy —
// tiếng Anh luôn ra giọng Anh chuẩn, kể cả khi trình duyệt không có voice tiếng Anh.
const ttsUrl = (text: string, tl: 'en' | 'vi', speed?: number) =>
  `/api/tts?q=${encodeURIComponent(text.trim())}&tl=${tl}${speed && speed < 1 ? `&speed=${speed}` : ''}`;

// Phát 1 nguồn audio qua phần tử dùng chung; onEnd (nếu có) chạy khi phát xong.
function playSrc(src: string, onEnd?: () => void): void {
  const el = getEl();
  if (!el) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  el.onended = onEnd
    ? () => { el.onended = null; onEnd(); }
    : null;
  el.src = src;
  el.play().catch(() => { /* chỉ dùng giọng API */ });
}

// Đọc TIẾNG ANH (giọng Mỹ, proxy).
export function speakEnglish(text: string): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  playSrc(ttsUrl(text, 'en'));
}

// ĐÁNH VẦN: đọc CHẬM rồi đọc THƯỜNG (proxy tl=en). Dùng cho phonics.
export function soundOutWord(word: string): void {
  if (typeof window === 'undefined' || !word || !word.trim()) return;
  const w = word.trim();
  playSrc(ttsUrl(w, 'en', 0.3), () => playSrc(ttsUrl(w, 'en')));
}

// Đọc TIẾNG ANH (giọng Mỹ) rồi TỰ ĐỘNG đọc NGHĨA TIẾNG VIỆT (giọng Việt), nối tiếp.
// _gen: lần gọi mới huỷ phần tiếng Việt còn chờ của lần cũ.
let _gen = 0;
export function speakEnThenVi(en: string, vi: string): void {
  if (typeof window === 'undefined') return;
  const myGen = ++_gen;
  const thenVi = () => {
    if (myGen !== _gen) return; // đã bị lần gọi mới thay thế
    if (vi && vi.trim()) playSrc(ttsUrl(vi, 'vi'));
  };
  if (en && en.trim()) playSrc(ttsUrl(en, 'en'), thenVi);
  else thenVi();
}

// Phát NỐI TIẾP nhiều mẩu (hội thoại, bài hát). Mỗi mẩu {text, lang}.
// Dùng chung _gen nên gọi mới (hoặc stopSpeaking) sẽ dừng chuỗi đang phát.
export function speakSequence(
  items: { text: string; lang: 'en' | 'vi' }[],
  onIndex?: (i: number) => void,
  onDone?: () => void,
): void {
  if (typeof window === 'undefined' || !items || !items.length) return;
  const myGen = ++_gen;
  let i = 0;
  const step = () => {
    if (myGen !== _gen) return; // đã dừng / chuyển nội dung khác
    if (i >= items.length) { onDone?.(); return; }
    const idx = i;
    const it = items[i++];
    if (!it || !it.text || !it.text.trim()) { step(); return; }
    onIndex?.(idx);
    playSrc(ttsUrl(it.text, it.lang), step);
  };
  step();
}

export function stopSpeaking(): void {
  if (_audioEl) {
    try { _audioEl.pause(); } catch { /* ignore */ }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeaking(): void {
  if (_audioEl) {
    try { _audioEl.pause(); } catch { /* ignore */ }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (_audioEl) _audioEl.play().catch(() => {});
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}
