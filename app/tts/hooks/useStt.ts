'use client';

import { useState, useRef } from 'react';

interface SttState {
  isLoading: boolean;
  error: string | null;
  transcript: string | null;
  language: string;
  success: boolean;
  cached: boolean;
}

interface UseSttReturn extends SttState {
  transcribe: (audioFile: File, language: string) => Promise<void>;
  reset: () => void;
}

const STT_API_URL = process.env.NEXT_PUBLIC_STT_API_URL || 'https://api-v2.behayhoc.com/stt';

const initialState: SttState = {
  isLoading: false,
  error: null,
  transcript: null,
  language: 'vi',
  success: false,
  cached: false,
};

export const useStt = (): UseSttReturn => {
  const [state, setState] = useState<SttState>(initialState);

  const transcribe = async (audioFile: File, language: string = 'vi'): Promise<void> => {
    try {
      setState({
        ...initialState,
        isLoading: true,
        language,
      });

      if (!audioFile) {
        throw new Error('Vui lòng chọn file âm thanh');
      }

      // Validate file size (max 50MB)
      if (audioFile.size > 50 * 1024 * 1024) {
        throw new Error('File quá lớn (tối đa 50MB)');
      }

      // Get file extension
      const fileExtension = audioFile.name.split('.').pop()?.toLowerCase() || 'mp3';

      // Create FormData
      const formData = new FormData();
      formData.append('file', audioFile);

      // Build API URL with query parameters
      const apiUrl = new URL(STT_API_URL);
      apiUrl.searchParams.append('language', language);
      apiUrl.searchParams.append('audio_format', fileExtension);

      const response = await fetch(apiUrl.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Lỗi xử lý âm thanh (${response.status})`
        );
      }

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error || 'Không thể xử lý âm thanh');
      }

      if (!data.text) {
        throw new Error('Không nhận được kết quả từ API');
      }

      setState({
        isLoading: false,
        error: null,
        transcript: data.text,
        language,
        success: true,
        cached: data.cached || false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';

      setState({
        isLoading: false,
        error: errorMessage,
        transcript: null,
        language,
        success: false,
        cached: false,
      });
    }
  };

  const reset = (): void => {
    setState(initialState);
  };

  return {
    ...state,
    transcribe,
    reset,
  };
};
