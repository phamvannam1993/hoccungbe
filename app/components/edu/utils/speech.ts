// utils/speech.ts
export type SpeakTextOptions = {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    preferredVoiceNameIncludes?: string[];
  };
  
  function getBestVoice(
    lang: string,
    preferredVoiceNameIncludes: string[] = []
  ): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return null;
    }
  
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
  
    const normalizedLang = lang.toLowerCase();
  
    const sameLangVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith(normalizedLang.split('-')[0])
    );
  
    const preferredVoice = sameLangVoices.find((voice) =>
      preferredVoiceNameIncludes.some((keyword) =>
        voice.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  
    return preferredVoice || sameLangVoices[0] || voices[0] || null;
  }
  
  export function speakText(
    text: string,
    options: SpeakTextOptions = {}
  ): SpeechSynthesisUtterance | null {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !text.trim()
    ) {
      return null;
    }
  
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
    const voice = getBestVoice(lang, preferredVoiceNameIncludes);
  
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
  
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
  
    synth.speak(utterance);
    return utterance;
  }
  
  export function stopSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
  }
  
  export function pauseSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
  }
  
  export function resumeSpeaking(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.resume();
  }