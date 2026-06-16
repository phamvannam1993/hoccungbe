export interface Voice {
  id: string;
  label: string;
  gender: 'male' | 'female' | 'child';
}

export const vietnameseVoices: Voice[] = [
  // Female Voices
  { id: 'vi-VN-HoaiMyNeural', label: 'Hoài My - Nữ', gender: 'female' },
  { id: 'vi-VN-LinhNeural', label: 'Linh - Nữ', gender: 'female' },
  { id: 'vi-VN-ThanhNeural', label: 'Thanh - Nữ', gender: 'female' },

  // Male Voices
  { id: 'vi-VN-NamMinhNeural', label: 'Nam Minh - Nam', gender: 'male' },
  { id: 'vi-VN-VinhNeural', label: 'Vinh - Nam', gender: 'male' },
  { id: 'vi-VN-KhoaNH', label: 'Khoa - Nam', gender: 'male' },

  // Children Voices
  { id: 'vi-VN-HoaiMyNeural-Children', label: 'Bé gái', gender: 'child' },
  { id: 'vi-VN-NamMinhNeural-Children', label: 'Bé trai', gender: 'child' },
];

export const getVoicesByGender = (gender: string): Voice[] => {
  return vietnameseVoices.filter((voice) => voice.gender === gender);
};

export const getVoiceLabel = (voiceId: string): string => {
  const voice = vietnameseVoices.find((v) => v.id === voiceId);
  return voice?.label || voiceId;
};
