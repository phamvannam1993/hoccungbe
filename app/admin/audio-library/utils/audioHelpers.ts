/**
 * Format bytes to human-readable file size
 * @example formatFileSize(1024) => "1.0 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to MM:SS format
 * @example formatDuration(125) => "2:05"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validate audio file type and size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum file size in MB (default: 50)
 * @returns { valid: boolean; error?: string }
 */
export function validateAudioFile(
  file: File,
  maxSizeInMB: number = 50
): { valid: boolean; error?: string } {
  const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'];
  const allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4'];

  // Check mime type
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng tệp không được hỗ trợ. Vui lòng tải lên: MP3, WAV, hoặc M4A`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Định dạng tệp không hợp lệ. Vui lòng tải lên: MP3, WAV, hoặc M4A`,
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `Kích thước tệp vượt quá giới hạn ${maxSizeInMB}MB. Kích thước hiện tại: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
}

/**
 * Extract file extension from filename
 * @example getFileExtension("song.mp3") => ".mp3"
 */
export function getFileExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.')).toLowerCase();
}

/**
 * Validate title (min 3, max 255 chars)
 * @returns { valid: boolean; error?: string }
 */
export function validateTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Tiêu đề phải ít nhất 3 ký tự' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Tiêu đề không được vượt quá 255 ký tự' };
  }

  return { valid: true };
}
