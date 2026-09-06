'use client';

// Âm thanh cho game "Ai Là Triệu Phú Nhí".
//
// Tổng hợp bằng Web Audio thay vì tải file mp3: không phải thêm tài nguyên,
// không tốn băng thông, chạy được cả khi offline (PWA) và phát tức thì nên
// không lỡ nhịp kịch tính.
//
// Trình duyệt chặn âm thanh cho tới khi người dùng chạm — `unlockSfx()` phải
// được gọi ngay trong một cử chỉ chạm.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let suspense: { stop: () => void } | null = null;
let enabled = true;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockSfx() {
  const c = ac();
  if (c && c.state === 'suspended') void c.resume();
}

export function setSfxEnabled(on: boolean) {
  enabled = on;
  if (!on) { stopSuspense(); stopMusic(); }
}

/** Một nốt đơn. `type` đổi chất tiếng: sine mềm, square điện tử, sawtooth gắt. */
function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.5) {
  const c = ac();
  if (!c || !master || !enabled) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  // Vào/ra mượt để không bị tiếng "tách" ở hai đầu nốt.
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

/** Chạm chọn đáp án. */
export const sfxSelect = () => tone(660, 0, 0.09, 'square', 0.28);

/** Chốt đáp án — một tiếng trầm dứt khoát. */
export const sfxLock = () => { tone(220, 0, 0.18, 'square', 0.4); tone(110, 0.04, 0.3, 'sine', 0.35); };

// ── Hiệu ứng dùng FILE có sẵn ────────────────────────────────────────────
// Tiếng đúng/sai đã có sẵn trong public/sounds, nghe tự nhiên hơn tiếng tổng hợp.
const clips: Record<string, HTMLAudioElement> = {};
function playClip(src: string, vol = 0.6) {
  if (typeof window === 'undefined' || !enabled) return;
  let el = clips[src];
  if (!el) { el = new Audio(src); el.preload = 'auto'; clips[src] = el; }
  el.currentTime = 0;
  el.volume = vol;
  void el.play().catch(() => { /* trình duyệt chặn thì bỏ qua */ });
}

/** Trả lời đúng — tiếng vỗ tay của trường quay. */
export const sfxCorrect = () => playClip('/assets/audio/Tieng-vo-tay-tra-loi-dung.mp3', 0.75);

/** Trả lời sai. */
export const sfxWrong = () => playClip('/assets/audio/Am-thanh-tra-loi-sai.wav', 0.65);

/** Về đích — vỗ tay to hơn, kèm khúc nhạc mừng ngắn chồng lên. */
export const sfxWin = () => {
  playClip('/assets/audio/Tieng-vo-tay-tra-loi-dung.mp3', 0.9);
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone(f, i * 0.13, 0.45, 'triangle', 0.4));
};

/** Đồng hồ đếm ngược ở chế độ 60 giây. */
export const sfxTick = () => tone(880, 0, 0.05, 'square', 0.18);

/**
 * Nhạc hồi hộp trong lúc chờ công bố kết quả — nhịp trầm đều đặn như tiếng tim đập,
 * đúng khoảnh khắc "đó là câu trả lời cuối cùng chứ?" của chương trình.
 */
export function startSuspense() {
  const c = ac();
  if (!c || !enabled) return;
  stopSuspense();
  let i = 0;
  const id = window.setInterval(() => {
    tone(i % 2 === 0 ? 98 : 87.31, 0, 0.22, 'sine', 0.3);
    i++;
  }, 420);
  tone(98, 0, 0.22, 'sine', 0.3);
  suspense = { stop: () => window.clearInterval(id) };
}

export function stopSuspense() {
  suspense?.stop();
  suspense = null;
}

// ── Nhạc nền ─────────────────────────────────────────────────────────────
// Nhạc chủ đề của chương trình, phát lặp ở âm lượng nhỏ.
// Chỉ chạy ở các màn MENU. Vào ván thì tắt hẳn để nhường chỗ cho lời đọc đề,
// tiếng hồi hộp và tiếng công bố kết quả — chồng nhạc lên lời đọc thì bé
// không nghe rõ đề.
const MUSIC_SRC = '/assets/audio/Nhac-nen-game-show-ai-la-trieu-phu-www_tiengdong_com.mp3';
const MUSIC_VOL = 0.22;

let music: HTMLAudioElement | null = null;

function musicEl(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!music) {
    music = new Audio(MUSIC_SRC);
    music.loop = true;
    music.preload = 'auto';
    music.volume = MUSIC_VOL;
  }
  return music;
}

/** Bật nhạc nền. Phải gọi trong một cử chỉ chạm, nếu không trình duyệt chặn. */
export function startMusic() {
  const el = musicEl();
  if (!el || !enabled) return;
  el.volume = MUSIC_VOL;
  void el.play().catch(() => { /* chặn tự phát thì thôi */ });
}

export function stopMusic() {
  const el = musicEl();
  if (!el) return;
  el.pause();
  try { el.currentTime = 0; } catch { /* bỏ qua */ }
}
