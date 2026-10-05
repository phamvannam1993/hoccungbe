'use client';

import { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useStt } from '../../tts/hooks/useStt';
import styles from '../../tts/Tts.module.css';

const STT_LANGUAGES = [
  { code: 'vi', name: '🇻🇳 Tiếng Việt' },
  { code: 'en', name: '🇺🇸 English' },
  { code: 'es', name: '🇪🇸 Español' },
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'de', name: '🇩🇪 Deutsch' },
  { code: 'it', name: '🇮🇹 Italiano' },
  { code: 'pt', name: '🇵🇹 Português' },
  { code: 'ru', name: '🇷🇺 Русский' },
  { code: 'ja', name: '🇯🇵 日本語' },
  { code: 'zh', name: '🇨🇳 中文' },
];

export default function SttPageClient() {
  const [sttLanguage, setSttLanguage] = useState('vi');
  const [sttFile, setSttFile] = useState<File | null>(null);
  const [sttCopied, setSttCopied] = useState(false);

  const { isLoading: sttLoading, error: sttError, transcript, success: sttSuccess, transcribe, reset: sttReset } =
    useStt();

  const handleSttFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSttFile(file);
    }
  }, []);

  const handleSttSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!sttFile) return;
      await transcribe(sttFile, sttLanguage);
    },
    [sttFile, sttLanguage, transcribe],
  );

  const handleSttReset = useCallback(() => {
    setSttFile(null);
    setSttLanguage('vi');
    sttReset();
  }, [sttReset]);

  const handleSttCopyTranscript = useCallback(() => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setSttCopied(true);
      setTimeout(() => setSttCopied(false), 2000);
    }
  }, [transcript]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Công Cụ Chuyển Giọng Nói Thành Text</h1>
          <p className={styles.subtitle}>
            Chuyển đổi âm thanh của bạn thành văn bản với hỗ trợ 10+ ngôn ngữ
          </p>
        </div>

        {sttError && (
          <div className={`${styles.error} ${styles.fadeIn}`}>
            <AlertCircle className={styles.errorIcon} />
            <span>{sttError}</span>
          </div>
        )}

        {sttSuccess && !sttError && (
          <div className={`${styles.success} ${styles.fadeIn}`}>
            <CheckCircle className={styles.successIcon} />
            <span>Chuyển đổi thành công!</span>
          </div>
        )}

        <form onSubmit={handleSttSubmit}>
          {/* File Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Chọn file âm thanh
              <span className={styles.required}>*</span>
            </label>
            <div
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: '#f9fafb',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setSttFile(file);
                }
              }}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleSttFileChange}
                disabled={sttLoading}
                style={{ display: 'none' }}
                id="stt-file-input"
              />
              <label htmlFor="stt-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#3b82f6', margin: '0 0 0.5rem 0' }}>
                  📁 Chọn hoặc kéo file âm thanh
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                  {sttFile ? sttFile.name : 'MP3, WAV, FLAC, M4A, OGG... (Max 50MB)'}
                </p>
              </label>
            </div>
          </div>

          {/* Language Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="stt-language-select" className={styles.label}>
              Ngôn ngữ
              <span className={styles.required}>*</span>
            </label>
            <select
              id="stt-language-select"
              className={styles.select}
              value={sttLanguage}
              onChange={(e) => setSttLanguage(e.target.value)}
              disabled={sttLoading}
            >
              {STT_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={sttLoading || !sttFile}
            >
              {sttLoading && <div className={styles.spinner} />}
              {sttLoading ? 'Đang xử lý...' : '🎤 Chuyển Đổi Thành Text'}
            </button>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleSttReset}
              disabled={sttLoading}
            >
              Đặt lại
            </button>
          </div>
        </form>
      </div>

      {/* Transcript Result */}
      {transcript && (
        <div className={`${styles.card} ${styles.slideUp}`}>
          <h2 className={styles.audioSectionTitle}>Kết quả chuyển đổi</h2>
          <div
            style={{
              backgroundColor: '#f3f4f6',
              borderLeft: '4px solid #3b82f6',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              wordWrap: 'break-word',
            }}
          >
            <p style={{ margin: 0, color: '#1f2937', lineHeight: '1.6' }}>
              {transcript}
            </p>
          </div>
          <button
            className={styles.submitButton}
            onClick={handleSttCopyTranscript}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Copy size={20} />
            {sttCopied ? 'Đã sao chép!' : 'Sao chép văn bản'}
          </button>
        </div>
      )}

      {/* Features Section */}
      <div className={styles.card}>
        <h2 className={styles.audioSectionTitle}>Tính năng</h2>
        <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <li>✓ Hỗ trợ 10+ ngôn ngữ (Việt, Anh, Tây Ban Nha, Pháp, Đức, Ý, Bồ Đào Nha, Nga, Nhật, Trung)</li>
          <li>✓ Hỗ trợ tất cả định dạng âm thanh (MP3, WAV, FLAC, M4A, OGG...)</li>
          <li>✓ Tự động chuyển đổi định dạng âm thanh</li>
          <li>✓ Tối đa 50MB mỗi file</li>
          <li>✓ Sao chép kết quả dễ dàng</li>
          <li>✓ Hoàn toàn miễn phí và không cần đăng ký</li>
        </ul>
      </div>
    </div>
  );
}
