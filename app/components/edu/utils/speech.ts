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

export function speakText(text: string, _options: SpeakTextOptions = {}): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  const el = getEl();
  if (!el) return;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  // Tái sử dụng cùng một phần tử (đã được mở khóa) → phát được cả khi tự động.
  el.src = `/api/tts?q=${encodeURIComponent(text.trim())}`;
  el.play().catch(() => { /* chỉ dùng giọng API */ });
}

// URL đọc ÉP NGÔN NGỮ: 'en' → giọng Mỹ bản ngữ, 'vi' → giọng Việt. (Không phân loại
// từng từ như &en=1 nên từ tiếng Anh lạ vẫn được đọc đúng giọng Anh.)
const ttsUrl = (text: string, lang: 'en' | 'vi') =>
  `/api/tts?q=${encodeURIComponent(text.trim())}&lang=${lang}`;

// Đọc TIẾNG ANH bằng giọng Mỹ bản ngữ.
export function speakEnglish(text: string): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  const el = getEl();
  if (!el) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  el.src = ttsUrl(text, 'en');
  el.play().catch(() => { /* chỉ dùng giọng API */ });
}

// Đọc TIẾNG ANH (giọng Mỹ) rồi TỰ ĐỘNG đọc luôn NGHĨA TIẾNG VIỆT (giọng Việt), nối tiếp,
// dùng chung 1 audio. Bộ đếm _gen để lần gọi mới huỷ phần tiếng Việt còn chờ của lần cũ.
let _gen = 0;
export function speakEnThenVi(en: string, vi: string): void {
  if (typeof window === 'undefined') return;
  const el = getEl();
  if (!el) return;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const myGen = ++_gen;
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  el.onended = () => {
    el.onended = null;
    if (myGen !== _gen) return; // đã bị lần gọi mới thay thế
    if (vi && vi.trim()) {
      el.src = ttsUrl(vi, 'vi'); // người Việt đọc nghĩa tiếng Việt
      el.play().catch(() => {});
    }
  };
  if (en && en.trim()) {
    el.src = ttsUrl(en, 'en'); // người Mỹ đọc từ tiếng Anh
    el.play().catch(() => {});
  } else if (vi && vi.trim()) {
    el.onended = null;
    el.src = ttsUrl(vi, 'vi');
    el.play().catch(() => {});
  }
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
