/**
 * Âm thanh khen thưởng + confetti — không phụ thuộc thư viện ngoài (Web Audio + canvas).
 * Dùng cho quiz, đề thi, bài học… Gọi trong sự kiện click/answer (user gesture) để phát được tiếng.
 */

let ac: AudioContext | null = null;
let soundOn = true;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ac) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ac = new AC();
    }
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    return ac;
  } catch {
    return null;
  }
}

/** Bật/tắt âm thanh (lưu localStorage). */
export function setSoundEnabled(on: boolean) {
  soundOn = on;
  try {
    localStorage.setItem('bhh-sound', on ? '1' : '0');
  } catch {
    /* ignore */
  }
}
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem('bhh-sound') !== '0';
  } catch {
    return true;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Tiếng "đúng rồi!" — hợp âm đi lên vui tai. */
export function playCorrect() {
  if (!isSoundEnabled()) return;
  soundOn = true;
  tone(523.25, 0, 0.12, 'triangle'); // C5
  tone(659.25, 0.09, 0.12, 'triangle'); // E5
  tone(783.99, 0.18, 0.18, 'triangle'); // G5
}

/** Tiếng sai — nhẹ nhàng, không dọa bé. */
export function playWrong() {
  if (!isSoundEnabled()) return;
  tone(311.13, 0, 0.16, 'sine', 0.14); // Eb4
  tone(233.08, 0.12, 0.22, 'sine', 0.14); // Bb3
}

/** Fanfare hoàn thành bài / đạt điểm cao. */
export function playWin() {
  if (!isSoundEnabled()) return;
  const notes: [number, number][] = [
    [523.25, 0],
    [659.25, 0.12],
    [783.99, 0.24],
    [1046.5, 0.38],
  ];
  notes.forEach(([f, t]) => tone(f, t, 0.28, 'triangle', 0.2));
}

const COLORS = ['#FF6B9D', '#A06CD5', '#4ECDC4', '#FFD93D', '#FF9F45', '#6BCB77', '#87CEEB'];

/**
 * Bắn confetti. size='small' cho câu đúng, 'big' cho hoàn thành.
 * Tự tạo & dọn canvas overlay, không chặn thao tác (pointer-events:none).
 */
export function confetti(size: 'small' | 'big' = 'small') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const count = size === 'big' ? 140 : 45;
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const g = canvas.getContext('2d');
  if (!g) {
    canvas.remove();
    return;
  }
  g.scale(dpr, dpr);

  const originX = W / 2;
  const originY = size === 'big' ? H * 0.32 : H * 0.4;
  type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number; life: number };
  const parts: P[] = [];
  for (let i = 0; i < count; i++) {
    const ang = (Math.PI * 2 * i) / count + (i % 5) * 0.05;
    const spd = 3 + (i % 7) * (size === 'big' ? 1.6 : 1.0);
    parts.push({
      x: originX,
      y: originY,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - (size === 'big' ? 6 : 4),
      r: 4 + (i % 4) * 2,
      c: COLORS[i % COLORS.length],
      rot: i,
      vr: (i % 2 ? 1 : -1) * 0.2,
      life: 1,
    });
  }

  let frame = 0;
  const maxFrames = size === 'big' ? 150 : 90;
  const tick = () => {
    frame++;
    g.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of parts) {
      p.vy += 0.18; // trọng lực
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - frame / maxFrames);
      if (p.life > 0 && p.y < H + 20) alive = true;
      g.save();
      g.globalAlpha = p.life;
      g.translate(p.x, p.y);
      g.rotate(p.rot);
      g.fillStyle = p.c;
      g.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      g.restore();
    }
    if (alive && frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(tick);
}
