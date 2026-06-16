export interface Audio {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  duration: number;
  file_size: number;
  mime_type: string;
  status: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
}

export interface UploadFormData {
  title: string;
  description?: string;
  file: File;
}

export interface AudioListFilters {
  search: string;
  sortBy: 'title' | 'created_date';
  page: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
