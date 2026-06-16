'use client';

import { useState } from 'react';

interface TtsResponse {
  status: string;
  audio_url: string;
  filename: string;
}

interface RateLimitInfo {
  remaining: number;
  reset: number; // Unix timestamp
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

export const useTts = (): UseTtsReturn => {
  const [state, setState] = useState<UseTtsState>({
    isLoading: false,
    error: null,
    audioUrl: null,
    filename: null,
    success: false,
    validationErrors: [],
    rateLimitInfo: null,
    isRateLimited: false,
  });

  const synthesize = async (
    text: string,
    voice: string,
    rate: string = '+0%',
    pitch: string = '+0Hz',
  ): Promise<void> => {
    try {
      setState({
        isLoading: true,
        error: null,
        audioUrl: null,
        filename: null,
        success: false,
        validationErrors: [],
        rateLimitInfo: null,
        isRateLimited: false,
      });

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Vui lòng nhập văn bản');
      }

      if (text.length > 500) {
        throw new Error('Văn bản không được vượt quá 500 ký tự');
      }

      if (!voice) {
        throw new Error('Vui lòng chọn giọng nói');
      }

      // Check for invalid characters (client-side validation)
      const invalidCharPattern = /[^\p{L}\p{N}\s.,!?;:\-—()\[\]'"\/\\]/gu;
      const invalidChars = text.match(invalidCharPattern);
      if (invalidChars && invalidChars.length > 0) {
        const uniqueChars = [...new Set(invalidChars)].join('');
        throw new Error(
          `Ký tự không hợp lệ: ${uniqueChars}. Chỉ sử dụng chữ cái, số, và dấu câu cơ bản.`,
        );
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          rate,
          pitch,
        }),
      });

      // Handle rate limit (429)
      if (response.status === 429) {
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const reset = response.headers.get('X-RateLimit-Reset');

        const rateLimitInfo: RateLimitInfo = {
          remaining: remaining ? parseInt(remaining, 10) : 0,
          reset: reset ? parseInt(reset, 10) : Date.now(),
        };

        setState({
          isLoading: false,
          error: 'Bạn đã vượt quá giới hạn sử dụng. Vui lòng thử lại vào ngày mai.',
          audioUrl: null,
          filename: null,
          success: false,
          validationErrors: [],
          rateLimitInfo,
          isRateLimited: true,
        });
        return;
      }

      // Extract rate limit info from response headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');

      const rateLimitInfo: RateLimitInfo | null = remaining && reset
        ? {
            remaining: parseInt(remaining, 10),
            reset: parseInt(reset, 10),
          }
        : null;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Lỗi tạo âm thanh (${response.status})`,
        );
      }

      const data: TtsResponse = await response.json();

      if (data.status !== 'success') {
        throw new Error('Không thể tạo âm thanh từ API');
      }

      setState({
        isLoading: false,
        error: null,
        audioUrl: data.audio_url,
        filename: data.filename,
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
    setState({
      isLoading: false,
      error: null,
      audioUrl: null,
      filename: null,
      success: false,
      validationErrors: [],
      rateLimitInfo: null,
      isRateLimited: false,
    });
  };

  return {
    ...state,
    synthesize,
    reset,
  };
};
