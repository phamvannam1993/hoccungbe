'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Audio, APIResponse, UploadFormData } from '../types';
import { apiFetch } from '../../lib/api';

export function useAudioLibrary() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all audios with optional filtering
   */
  const fetchAudios = useCallback(
    async (
      options: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
      } = {}
    ): Promise<Audio[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);
        if (options.sortBy) params.append('sortBy', options.sortBy);

        const res = await apiFetch<APIResponse<Audio[]>>(
          `/audios${params.toString() ? '?' + params.toString() : ''}`
        );

        if (res.success && res.data) {
          return res.data;
        }
        throw new Error(res.message || 'Lỗi tải danh sách âm thanh');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu';
        setError(errorMsg);
        toast.error(errorMsg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Upload new audio file
   */
  const uploadAudio = useCallback(
    async (data: UploadFormData): Promise<Audio | null> => {
      setIsUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) {
          formData.append('description', data.description);
        }
        formData.append('file', data.file);

        const res = await apiFetch<APIResponse<Audio>>('/audios', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type for FormData, let the browser set it
          },
        });

        if (res.success && res.data) {
          toast.success('Tải lên âm thanh thành công');
          return res.data;
        }

        const errorMsg = res.message || 'Lỗi tải lên';
        throw new Error(errorMsg);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi tải lên';
        setError(errorMsg);
        toast.error(errorMsg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  /**
   * Update audio metadata
   */
  const updateAudio = useCallback(
    async (
      id: string,
      data: Partial<Pick<Audio, 'title' | 'description'>>
    ): Promise<Audio | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiFetch<APIResponse<Audio>>(`/audios/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.success && res.data) {
          toast.success('Cập nhật âm thanh thành công');
          return res.data;
        }

        throw new Error(res.message || 'Lỗi cập nhật');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi cập nhật';
        setError(errorMsg);
        toast.error(errorMsg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete audio
   */
  const deleteAudio = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await apiFetch<APIResponse<null>>(`/audios/${id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        toast.success('Xóa âm thanh thành công');
        return true;
      }

      throw new Error(res.message || 'Lỗi xóa');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi xóa';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  /**
   * Search audios by query
   */
  const searchAudios = useCallback(
    async (query: string, limit: number = 10): Promise<Audio[]> => {
      if (!query.trim()) return [];

      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
        });

        const res = await apiFetch<APIResponse<Audio[]>>(
          `/audios/search?${params.toString()}`
        );

        if (res.success && res.data) {
          return res.data;
        }

        throw new Error(res.message || 'Lỗi tìm kiếm');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi tìm kiếm';
        setError(errorMsg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    fetchAudios,
    uploadAudio,
    updateAudio,
    deleteAudio,
    searchAudios,
    isLoading,
    isUploading,
    isDeleting,
    error,
  };
}
