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

function speakWebSpeech(text: string, options: SpeakTextOptions = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const {
    lang = 'vi-VN',
    rate = 0.9,
    pitch = 1.1,
    volume = 1,
    preferredVoiceNameIncludes = ['female', 'woman', 'girl', 'linh', 'mai', 'han', 'oanh', 'vy'],
  } = options;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const normalizedLang = lang.toLowerCase();
  const sameLang = voices.filter((v) => v.lang.toLowerCase().startsWith(normalizedLang.split('-')[0]));
  const preferred = sameLang.find((v) =>
    preferredVoiceNameIncludes.some((kw) => v.name.toLowerCase().includes(kw.toLowerCase()))
  );
  const voice = preferred || sameLang[0] || voices[0] || null;

  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }

  synth.speak(utterance);
}

export function speakText(
  text: string,
  options: SpeakTextOptions = {}
): void {
  if (typeof window === 'undefined' || !text.trim()) return;

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

  audio.play().catch(() => {
    // Tạm bỏ fallback Web Speech — chỉ dùng giọng Google TTS
  });
  void options;
  void speakWebSpeech;
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
