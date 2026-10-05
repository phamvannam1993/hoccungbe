'use client';

import { useRef, useState } from 'react';

interface TtsResponse {
  status?: string;
  success?: boolean;
  audio_url?: string;
  audioUrl?: string;
  url?: string;
  filename?: string;
  message?: string;
}

interface RateLimitInfo {
  remaining: number;
  reset: number; // Unix timestamp, seconds
}

interface UseTtsState {
  isLoading: boolean;
  error: string | null;
  audioUrl: string | null;
  filename: string | null;
  success: boolean;
  validationErrors: string[];
  rateLimitInfo: RateLimitInfo | null;
  isRateLimited: boolean;
}

interface UseTtsReturn extends UseTtsState {
  synthesize: (
    text: string,
    voice: string,
    rate?: string,
    pitch?: string,
  ) => Promise<void>;
  reset: () => void;
}

const TTS_API_URL =
  process.env.NEXT_PUBLIC_TTS_API_URL || 'https://api-v2.behayhoc.com/tts';

const initialState: UseTtsState = {
  isLoading: false,
  error: null,
  audioUrl: null,
  filename: null,
  success: false,
  validationErrors: [],
  rateLimitInfo: null,
  isRateLimited: false,
};

const getRateLimitInfo = (response: Response): RateLimitInfo | null => {
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (!remaining && !reset) {
    return null;
  }

  return {
    remaining: remaining ? Number.parseInt(remaining, 10) : 0,
    reset: reset ? Number.parseInt(reset, 10) : Math.floor(Date.now() / 1000),
  };
};

const getFilenameFromDisposition = (disposition: string | null): string | null => {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const normalMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (normalMatch?.[1]) {
    return normalMatch[1];
  }

  return null;
};

const toAbsoluteAudioUrl = (audioUrl: string): string => {
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
    return audioUrl;
  }

  if (audioUrl.startsWith('/')) {
    return new URL(audioUrl, TTS_API_URL).toString();
  }

  return new URL(`/${audioUrl}`, TTS_API_URL).toString();
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => null);

    return (
      data?.message ||
      data?.error ||
      `Lỗi tạo âm thanh (${response.status})`
    );
  }

  const text = await response.text().catch(() => '');

  return text || `Lỗi tạo âm thanh (${response.status})`;
};

export const useTts = (): UseTtsReturn => {
  const [state, setState] = useState<UseTtsState>(initialState);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = (): void => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const synthesize = async (
    text: string,
    voice: string,
    rate: string = '+0%',
    pitch: string = '+0Hz',
  ): Promise<void> => {
    try {
      revokeObjectUrl();

      setState({
        ...initialState,
        isLoading: true,
      });

      const trimmedText = text.trim();

      if (!trimmedText) {
        throw new Error('Vui lòng nhập văn bản');
      }

      if (trimmedText.length > 500) {
        throw new Error('Văn bản không được vượt quá 500 ký tự');
      }

      if (!voice) {
        throw new Error('Vui lòng chọn giọng nói');
      }

      const invalidCharPattern = /[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu;
      const invalidChars = trimmedText.match(invalidCharPattern);

      if (invalidChars && invalidChars.length > 0) {
        const uniqueChars = [...new Set(invalidChars)].join('');

        throw new Error(
          `Ký tự không hợp lệ: ${uniqueChars}. Chỉ sử dụng chữ cái, số và dấu câu cơ bản.`,
        );
      }

      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, audio/mpeg, audio/wav, audio/*, */*',
        },
        body: JSON.stringify({
          text: trimmedText,
          voice,
          rate,
          pitch,
        }),
      });

      const rateLimitInfo = getRateLimitInfo(response);

      if (response.status === 429) {
        setState({
          isLoading: false,
          error: 'Bạn đã vượt quá giới hạn sử dụng. Vui lòng thử lại sau.',
          audioUrl: null,
          filename: null,
          success: false,
          validationErrors: [],
          rateLimitInfo,
          isRateLimited: true,
        });

        return;
      }

      if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
      }

      const contentType = response.headers.get('content-type') || '';

      // Trường hợp API trả JSON: { status: "success", audio_url: "...", filename: "..." }
      if (contentType.includes('application/json')) {
        const data: TtsResponse = await response.json();

        const isSuccess =
          data.status === 'success' ||
          data.success === true ||
          Boolean(data.audio_url || data.audioUrl || data.url);

        if (!isSuccess) {
          throw new Error(data.message || 'Không thể tạo âm thanh từ API');
        }

        const rawAudioUrl = data.audio_url || data.audioUrl || data.url;

        if (!rawAudioUrl) {
          throw new Error('API không trả về đường dẫn audio');
        }

        setState({
          isLoading: false,
          error: null,
          audioUrl: toAbsoluteAudioUrl(rawAudioUrl),
          filename: data.filename || 'tts-audio.mp3',
          success: true,
          validationErrors: [],
          rateLimitInfo,
          isRateLimited: false,
        });

        return;
      }

      // Trường hợp API trả trực tiếp file audio
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      const filename =
        getFilenameFromDisposition(response.headers.get('content-disposition')) ||
        `tts-${Date.now()}.mp3`;

      setState({
        isLoading: false,
        error: null,
        audioUrl: objectUrl,
        filename,
        success: true,
        validationErrors: [],
        rateLimitInfo,
        isRateLimited: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';

      setState({
        isLoading: false,
        error: errorMessage,
        audioUrl: null,
        filename: null,
        success: false,
        validationErrors: [],
        rateLimitInfo: null,
        isRateLimited: false,
      });
    }
  };

  const reset = (): void => {
    revokeObjectUrl();
    setState(initialState);
  };

  return {
    ...state,
    synthesize,
    reset,
  };
};
