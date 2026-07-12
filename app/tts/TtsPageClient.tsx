'use client';

import { useState, useCallback, useMemo } from 'react';
import { Download, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { useTts } from './hooks/useTts';
import { useStt } from './hooks/useStt';
import { vietnameseVoices } from './data/voices';
import styles from './Tts.module.css';

const STT_LANGUAGES = [
  { code: 'vi', name: '🇻🇳 Tiếng Việt' },
  { code: 'en', name: '🇺🇸 English' },
  { code: 'es', name: '🇪🇸 Español' },
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'de', name: '🇩🇪 Deutsch' },
  { code: 'it', name: '🇮🇹 Italiano' },
  { code: 'pt', name: '🇵🇹 Português' },
];

export default function TtsPageClient() {
  const [activeTab, setActiveTab] = useState<'tts' | 'stt'>('tts');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(vietnameseVoices[0].id);
  const [rate, setRate] = useState('+0%');
  const [pitch, setPitch] = useState('+0Hz');
  const [copied, setCopied] = useState(false);
  const [sttLanguage, setSttLanguage] = useState('vi');
  const [sttFile, setSttFile] = useState<File | null>(null);
  const [sttCopied, setSttCopied] = useState(false);

  const { isLoading, error, audioUrl, filename, success, synthesize, reset } =
    useTts();
  const { isLoading: sttLoading, error: sttError, transcript, success: sttSuccess, transcribe, reset: sttReset } =
    useStt();

  const charCount = text.length;
  const isNearLimit = charCount > 400;
  const isOverLimit = charCount > 500;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await synthesize(text, voice, rate, pitch);
    },
    [text, voice, rate, pitch, synthesize],
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
      // Extract filename from audio URL (e.g., "c5443f77cc894e6ee82883b5bd9761d5.mp3")
      const urlFilename = audioUrl.split('/').pop() || filename;

      // Call backend API to download file
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';
      const downloadUrl = `${backendUrl}/api/tts/download?filename=${encodeURIComponent(urlFilename)}`;

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = urlFilename.endsWith('.mp3') ? urlFilename : `${urlFilename}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Lỗi tải xuống: ' + (err instanceof Error ? err.message : 'Không xác định'));
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
          <h1 className={styles.title}>
            {activeTab === 'tts' ? 'Công Cụ Chuyển Text Thành Giọng Nói' : 'Công Cụ Chuyển Giọng Nói Thành Text'}
          </h1>
          <p className={styles.subtitle}>
            {activeTab === 'tts'
              ? 'Chuyển đổi văn bản của bạn thành giọng nói tiếng Việt tự nhiên'
              : 'Chuyển đổi âm thanh của bạn thành văn bản với hỗ trợ 10+ ngôn ngữ'}
          </p>

          {/* Tab Buttons */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb' }}>
            <button
              onClick={() => setActiveTab('tts')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'tts' ? '#3b82f6' : 'transparent',
                color: activeTab === 'tts' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              📝 Text → Âm Thanh
            </button>
            <button
              onClick={() => setActiveTab('stt')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'stt' ? '#3b82f6' : 'transparent',
                color: activeTab === 'stt' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              🎤 Âm Thanh → Text
            </button>
          </div>
        </div>

        {/* TTS Tab */}
        {activeTab === 'tts' && (
          <>
            {error && (
              <div className={`${styles.error} ${styles.fadeIn}`}>
                <AlertCircle className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}

            {success && !error && (
              <div className={`${styles.success} ${styles.fadeIn}`}>
                <CheckCircle className={styles.successIcon} />
                <span>Tạo âm thanh thành công!</span>
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
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              disabled={isLoading}
            />
            <div className={styles.charCounter}>
              <span className={getCharCountClass}>
                {charCount}/500 ký tự
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
              disabled={isLoading}
            >
              {vietnameseVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading || !text.trim() || isOverLimit}
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
          </>
        )}

        {/* STT Tab */}
        {activeTab === 'stt' && (
          <>
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

            {/* Transcript Result */}
            {transcript && (
              <div className={`${styles.card} ${styles.slideUp}`} style={{ marginTop: '1.5rem' }}>
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
                  className={styles.copyButton}
                  onClick={handleSttCopyTranscript}
                  style={{ width: '100%' }}
                >
                  <Copy size={20} />
                  {sttCopied ? 'Đã sao chép!' : 'Sao chép văn bản'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Audio Player - TTS */}
      {activeTab === 'tts' && audioUrl && (
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
          {activeTab === 'tts' ? (
            <>
              <li>✓ Hỗ trợ 50+ giọng nói tiếng Việt tự nhiên</li>
              <li>✓ Điều chỉnh tốc độ phát âm từ -100% đến +100%</li>
              <li>✓ Điều chỉnh cao độ từ -20Hz đến +20Hz</li>
              <li>✓ Tải xuống âm thanh dưới dạng MP3</li>
              <li>✓ Hỗ trợ tối đa 500 ký tự mỗi lần</li>
              <li>✓ Hoàn toàn miễn phí và không cần đăng ký</li>
            </>
          ) : (
            <>
              <li>✓ Hỗ trợ 10+ ngôn ngữ (Việt, Anh, Tây Ban Nha, Pháp, Đức, Ý, Bồ Đào Nha, Nga, Nhật, Trung)</li>
              <li>✓ Hỗ trợ các định dạng âm thanh: MP3, WAV, FLAC, M4A, OGG...</li>
              <li>✓ Tự động chuyển đổi định dạng âm thanh</li>
              <li>✓ Tối đa 50MB mỗi file</li>
              <li>✓ Lưu cache kết quả để xử lý nhanh hơn</li>
              <li>✓ Hoàn toàn miễn phí và không cần đăng ký</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
