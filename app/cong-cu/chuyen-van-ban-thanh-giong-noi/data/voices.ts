export interface Voice {
  id: string;
  label: string;
  gender: 'male' | 'female';
  provider: 'Edge TTS';
  category: string;
}

export const VIETNAMESE_VOICES: Voice[] = [
  // Hoài My - Female (Edge TTS)
  {
    id: 'vi-VN-HoaiMyNeural',
    label: 'Hoài My - Bình Thường',
    gender: 'female',
    provider: 'Edge TTS',
    category: 'Nhanh',
  },
  {
    id: 'vi-VN-HoaiMyNeural-slow',
    label: 'Hoài My - Đọc Chậm',
    gender: 'female',
    provider: 'Edge TTS',
    category: 'Chậm',
  },
  {
    id: 'vi-VN-HoaiMyNeural-veryslow',
    label: 'Hoài My - Rất Chậm',
    gender: 'female',
    provider: 'Edge TTS',
    category: 'Rất Chậm',
  },
  {
    id: 'vi-VN-HoaiMyNeural-story',
    label: 'Hoài My - Giọng Mềm',
    gender: 'female',
    provider: 'Edge TTS',
    category: 'Mềm',
  },
  {
    id: 'vi-VN-HoaiMyNeural-podcast',
    label: 'Hoài My - Podcast',
    gender: 'female',
    provider: 'Edge TTS',
    category: 'Nhanh',
  },

  // Nam Minh - Male (Edge TTS)
  {
    id: 'vi-VN-NamMinhNeural',
    label: 'Nam Minh - Bình Thường',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Nhanh',
  },
  {
    id: 'vi-VN-NamMinhNeural-slow',
    label: 'Nam Minh - Đọc Chậm',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Chậm',
  },
  {
    id: 'vi-VN-NamMinhNeural-veryslow',
    label: 'Nam Minh - Rất Chậm',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Rất Chậm',
  },
  {
    id: 'vi-VN-NamMinhNeural-story',
    label: 'Nam Minh - Giọng Mềm',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Mềm',
  },
  {
    id: 'vi-VN-NamMinhNeural-deep',
    label: 'Nam Minh - Giọng Sâu',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Sâu',
  },
  {
    id: 'vi-VN-NamMinhNeural-podcast',
    label: 'Nam Minh - Podcast',
    gender: 'male',
    provider: 'Edge TTS',
    category: 'Nhanh',
  },
];

// Legacy export for backward compatibility
export const vietnameseVoices: Voice[] = VIETNAMESE_VOICES;

export const getVoicesByGender = (gender: string): Voice[] => {
  return VIETNAMESE_VOICES.filter((voice) => voice.gender === gender);
};

export const getVoicesByCategory = (category: string): Voice[] => {
  return VIETNAMESE_VOICES.filter((voice) => voice.category === category);
};

export const getVoiceLabel = (voiceId: string): string => {
  const voice = VIETNAMESE_VOICES.find((v) => v.id === voiceId);
  return voice?.label || voiceId;
};

export const getCategories = (): string[] => {
  const categories = new Set(VIETNAMESE_VOICES.map((v) => v.category));
  return Array.from(categories).sort();
};

export const getVoicesByGenderAndCategory = (gender: string, category: string): Voice[] => {
  return VIETNAMESE_VOICES.filter(
    (voice) => voice.gender === gender && voice.category === category,
  );
};
