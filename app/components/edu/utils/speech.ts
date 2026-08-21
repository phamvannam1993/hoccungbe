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

// URL đọc TIẾNG VIỆT qua proxy /api/tts (giọng Việt tự nhiên, có cache).
const viUrl = (text: string) => `/api/tts?q=${encodeURIComponent(text.trim())}&tl=vi`;

// ĐỌC TIẾNG ANH = GIỌNG GOOGLE CỦA TRÌNH DUYỆT (Web Speech API), KHÔNG gọi /api/tts.
// Ưu tiên voice "Google US English"; nếu chưa nạp voice thì đặt lang='en-US' để trình
// duyệt tự chọn giọng Anh. Trả về true nếu phát được (để nối tiếp phần tiếng Việt).
function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const vs = window.speechSynthesis.getVoices() || [];
  if (!vs.length) return null;
  return (
    vs.find((v) => /google/i.test(v.name) && /en[-_]?us/i.test(v.lang)) ||
    vs.find((v) => /google/i.test(v.name) && /^en/i.test(v.lang)) ||
    vs.find((v) => /en[-_]?us/i.test(v.lang)) ||
    vs.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}

function speakEnglishWeb(text: string, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.trim());
    u.lang = 'en-US';
    const v = pickEnglishVoice();
    if (v) u.voice = v;
    u.rate = 0.9;
    u.pitch = 1;
    let done = false;
    const finish = () => { if (!done) { done = true; onEnd?.(); } };
    u.onend = finish;
    u.onerror = finish; // vẫn đọc tiếp nghĩa tiếng Việt nếu phần Anh lỗi
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

// Phát tiếng Việt qua proxy audio.
function playViAudio(vi: string): void {
  if (!vi || !vi.trim()) return;
  const el = getEl();
  if (!el) return;
  try { el.pause(); } catch { /* ignore */ }
  el.muted = false;
  el.onended = null;
  el.src = viUrl(vi);
  el.play().catch(() => {});
}

// Đọc TIẾNG ANH bằng giọng Google của trình duyệt.
export function speakEnglish(text: string): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;
  speakEnglishWeb(text);
}

// Đọc TIẾNG ANH (giọng Google trình duyệt) rồi TỰ ĐỘNG đọc NGHĨA TIẾNG VIỆT (proxy /api/tts).
// _gen: lần gọi mới huỷ phần tiếng Việt còn chờ của lần cũ.
let _gen = 0;
export function speakEnThenVi(en: string, vi: string): void {
  if (typeof window === 'undefined') return;
  const myGen = ++_gen;
  // dừng mọi thứ đang phát
  try { getEl()?.pause(); } catch { /* ignore */ }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  const thenVi = () => {
    if (myGen !== _gen) return; // đã bị lần gọi mới thay thế
    playViAudio(vi);
  };

  if (en && en.trim()) {
    const ok = speakEnglishWeb(en, thenVi);
    if (!ok) {
      // Trình duyệt không hỗ trợ Web Speech → vẫn đọc được nghĩa tiếng Việt.
      thenVi();
    }
  } else {
    playViAudio(vi);
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
