'use client';

import { useState } from 'react';

interface TtsResponse {
  status: string;
  audio_url: string;
  filename: string;
}

interface UseTtsState {
  isLoading: boolean;
  error: string | null;
  audioUrl: string | null;
  filename: string | null;
  success: boolean;
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
      });

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Please enter text to convert');
      }

      if (text.length > 500) {
        throw new Error('Text must not exceed 500 characters');
      }

      if (!voice) {
        throw new Error('Please select a voice');
      }

      // Call external TTS API directly
      const response = await fetch('https://api-v2.behayhoc.com/tts', {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to generate speech (${response.status})`,
        );
      }

      const data: TtsResponse = await response.json();

      if (data.status !== 'success') {
        throw new Error('Failed to generate speech from API');
      }

      setState({
        isLoading: false,
        error: null,
        audioUrl: data.audio_url,
        filename: data.filename,
        success: true,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';

      setState({
        isLoading: false,
        error: errorMessage,
        audioUrl: null,
        filename: null,
        success: false,
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
    });
  };

  return {
    ...state,
    synthesize,
    reset,
  };
};
