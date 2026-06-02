// utils/speech.ts
// Primary: Google TTS via /api/tts (natural voice, cached)
// Fallback: Web Speech API (browser-native)

export type SpeakTextOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  preferredVoiceNameIncludes?: string[];
};

let _currentAudio: HTMLAudioElement | null = null;

export function speakText(
  text: string,
  _options: SpeakTextOptions = {}
): void {
  if (typeof window === 'undefined' || !text || !text.trim()) return;

  // Stop any current audio
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const url = `/api/tts?q=${encodeURIComponent(text.trim())}`;
  const audio = new Audio(url);
  _currentAudio = audio;

  audio.play().catch(() => {/* chỉ dùng giọng API */});
}

export function stopSpeaking(): void {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.src = '';
    _currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeaking(): void {
  if (_currentAudio) _currentAudio.pause();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (_currentAudio) _currentAudio.play().catch(() => {});
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}
