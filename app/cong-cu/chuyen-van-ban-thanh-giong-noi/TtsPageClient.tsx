'use client';

import { useState, useCallback, useMemo } from 'react';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useTts } from './hooks/useTts';
import { vietnameseVoices, VIETNAMESE_VOICES } from './data/voices';
import { validateText, MAX_CHARACTERS, WARNING_THRESHOLD } from './lib/validators';
import styles from './Tts.module.css';

export default function TtsPageClient() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(vietnameseVoices[0].id);
  const [rate, setRate] = useState('+0%');
  const [pitch, setPitch] = useState('+0Hz');
  const [copied, setCopied] = useState(false);

  const {
    isLoading,
    error,
    audioUrl,
    filename,
    success,
    synthesize,
    reset,
    rateLimitInfo,
    isRateLimited,
    validationErrors,
  } = useTts();

  // Validate input in real-time
  const validation = useMemo(() => {
    return validateText(text);
  }, [text]);

  const charCount = text.length;
  const isNearLimit = charCount > WARNING_THRESHOLD;
  const isOverLimit = charCount > MAX_CHARACTERS;

  // Format remaining requests display
  const getRateLimitDisplay = () => {
    if (!rateLimitInfo) return null;
    const total = 100; // Default daily limit
    return `Còn ${rateLimitInfo.remaining}/${total} lượt hôm nay`;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Re-validate before submit
      if (!validation.isValid) {
        return;
      }

      await synthesize(text, voice, rate, pitch);
    },
    [text, voice, rate, pitch, synthesize, validation],
  );

  const handleReset = useCallback(() => {
    setText('');
    setVoice(vietnameseVoices[0].id);
    setRate('+0%');
    setPitch('+0Hz');
    reset();
  }, [reset]);

  const handleDownload = useCallback(async () => {
    if (!audioUrl || !filename) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: try direct download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = filename;
      link.click();
    }
  }, [audioUrl, filename]);

  const handleCopyUrl = useCallback(() => {
    if (audioUrl) {
      navigator.clipboard.writeText(audioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [audioUrl]);

  const getCharCountClass = useMemo(() => {
    if (isOverLimit) return styles.charCountError;
    if (isNearLimit) return styles.charCountWarning;
    return styles.charCount;
  }, [isOverLimit, isNearLimit]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Công Cụ Chuyển Text Thành Giọng Nói</h1>
          <p className={styles.subtitle}>
            Chuyển đổi văn bản của bạn thành giọng nói tiếng Việt tự nhiên
          </p>
        </div>

        {error && (
          <div className={`${styles.error} ${styles.fadeIn}`}>
            <AlertCircle className={styles.errorIcon} />
            <div>
              <span>{error}</span>
              {isRateLimited && rateLimitInfo && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  {getRateLimitDisplay()}
                </p>
              )}
            </div>
          </div>
        )}

        {success && !error && (
          <div className={`${styles.success} ${styles.fadeIn}`}>
            <CheckCircle className={styles.successIcon} />
            <div>
              <span>Tạo âm thanh thành công!</span>
              {!isRateLimited && rateLimitInfo && (
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  {getRateLimitDisplay()}
                </p>
              )}
            </div>
          </div>
        )}

        {!isRateLimited && rateLimitInfo && !error && !success && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#f0f7ff',
            border: '1px solid #b3d9ff',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#1e5a96',
            marginBottom: '1rem',
          }}>
            {getRateLimitDisplay()}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Text Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nhập văn bản
              <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Nhập văn bản bạn muốn chuyển thành giọng nói (tối đa 500 ký tự)..."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARACTERS))}
              disabled={isLoading || isRateLimited}
            />

            {/* Validation Errors */}
            {validation.errors.length > 0 && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                color: '#c33',
              }}>
                {validation.errors.map((err, idx) => (
                  <div key={idx}>• {err.message}</div>
                ))}
              </div>
            )}

            {/* Character Counter */}
            <div className={styles.charCounter}>
              <span className={getCharCountClass}>
                {charCount}/{MAX_CHARACTERS} ký tự
              </span>
              {isOverLimit && (
                <span className={styles.charCountError}>
                  Vượt quá giới hạn
                </span>
              )}
              {isNearLimit && !isOverLimit && (
                <span className={styles.charCountWarning}>
                  Sắp hết chỗ
                </span>
              )}
            </div>
          </div>

          {/* Voice Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="voice-select" className={styles.label}>
              Chọn giọng
              <span className={styles.required}>*</span>
            </label>
            <select
              id="voice-select"
              className={styles.select}
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              disabled={isLoading || isRateLimited}
            >
              {/* Group by speaker (Hoài My and Nam Minh) */}
              <optgroup label="👩 Hoài My - Giọng Nữ">
                {VIETNAMESE_VOICES.filter((v) => v.id.includes('HoaiMy')).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} - {v.category}
                  </option>
                ))}
              </optgroup>
              <optgroup label="👨 Nam Minh - Giọng Nam">
                {VIETNAMESE_VOICES.filter((v) => v.id.includes('NamMinh')).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label} - {v.category}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Rate and Pitch Sliders */}
          <div className={styles.sliderGroup}>
            <div className={styles.sliderControl}>
              <label htmlFor="rate-slider" className={styles.sliderLabel}>
                Tốc độ
              </label>
              <div className={styles.sliderWrapper}>
                <input
                  id="rate-slider"
                  type="range"
                  className={styles.slider}
                  min="-100"
                  max="100"
                  step="10"
                  value={parseInt(rate)}
                  onChange={(e) => setRate(`${e.target.value}%`)}
                  disabled={isLoading || isRateLimited}
                />
                <span className={styles.sliderValue}>{rate}</span>
              </div>
            </div>

            <div className={styles.sliderControl}>
              <label htmlFor="pitch-slider" className={styles.sliderLabel}>
                Cao độ
              </label>
              <div className={styles.sliderWrapper}>
                <input
                  id="pitch-slider"
                  type="range"
                  className={styles.slider}
                  min="-20"
                  max="20"
                  step="1"
                  value={parseInt(pitch)}
                  onChange={(e) => setPitch(`${e.target.value}Hz`)}
                  disabled={isLoading || isRateLimited}
                />
                <span className={styles.sliderValue}>{pitch}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !text.trim() || !validation.isValid || isRateLimited}
              title={
                isRateLimited
                  ? 'Bạn đã vượt quá giới hạn sử dụng'
                  : !validation.isValid
                    ? 'Vui lòng sửa các lỗi trên'
                    : ''
              }
            >
              {isLoading && <div className={styles.spinner} />}
              {isLoading ? 'Đang tạo âm thanh...' : 'Tạo Âm Thanh'}
            </button>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleReset}
              disabled={isLoading}
            >
              Đặt lại
            </button>
          </div>
        </form>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className={`${styles.card} ${styles.slideUp}`}>
          <div className={styles.audioSection}>
            <h2 className={styles.audioSectionTitle}>Nghe âm thanh</h2>
            <audio
              className={styles.audioPlayer}
              controls
              src={audioUrl}
              autoPlay
            />
            <div className={styles.audioControls}>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
              >
                <Download size={20} />
                Tải xuống MP3
              </button>
              <button
                className={styles.copyButton}
                onClick={handleCopyUrl}
              >
                {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className={styles.card}>
        <h2 className={styles.audioSectionTitle}>Tính năng</h2>
        <ul style={{ lineHeight: '1.8', color: '#4b5563' }}>
          <li>✓ {VIETNAMESE_VOICES.length} giọng nói tiếng Việt chất lượng cao (Edge TTS)</li>
          <li>✓ 2 diễn viên: Hoài My (Nữ) và Nam Minh (Nam)</li>
          <li>✓ 5+ phong cách: Bình Thường, Chậm, Rất Chậm, Mềm, Sâu, Podcast</li>
          <li>✓ Điều chỉnh tốc độ phát âm từ -100% đến +100%</li>
          <li>✓ Điều chỉnh cao độ từ -20Hz đến +20Hz</li>
          <li>✓ Tải xuống âm thanh dưới dạng MP3</li>
          <li>✓ Hỗ trợ tối đa 500 ký tự mỗi lần</li>
          <li>✓ Hoàn toàn miễn phí và không cần đăng ký</li>
          <li>✓ Xác thực ký tự nhập và lọc nội dung không phù hợp</li>
          <li>✓ Giới hạn sử dụng hợp lý để bảo vệ dịch vụ</li>
        </ul>
      </div>
    </div>
  );
}
