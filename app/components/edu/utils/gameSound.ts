export type GameSoundType =
  | 'select'
  | 'correct'
  | 'wrong'
  | 'result'
  | 'three_stars'
  | 'unlock';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  return new AudioContextClass();
}

export function playGameSound(type: GameSoundType, enabled = true) {
  if (!enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'select') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(420, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(520, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
    return;
  }

  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(700, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.08);
    oscillator.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.24);
    return;
  }

  if (type === 'wrong') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.22);
    return;
  }

  if (type === 'result') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(740, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.28);
    return;
  }

  if (type === 'three_stars') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(700, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.08);
    oscillator.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.35);
    return;
  }

  if (type === 'unlock') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.08);
    oscillator.frequency.linearRampToValueAtTime(820, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.24);
  }
}