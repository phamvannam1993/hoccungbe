'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, ArrowLeft, Upload, X, Volume2, ImageIcon } from 'lucide-react';
import MediaPicker from '../../components/MediaPicker';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type QuizFormData = {
  lessonId: string;
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  exerciseNumber: string;
  questionImageUrl: string;
  questionAudioUrl: string;
  explanation: string;
  explanationAudioUrl: string;
  points: string;
  sortOrder: string;
  isActive: boolean;
  options: { key: string; text: string; audioUrl?: string; pair?: string; imageUrl?: string; pairImageUrl?: string }[];
  correctKeys: string[];
  trueFalseAnswer: boolean;
};

export type Lesson = { id: string; title: string };

const QUESTION_TYPES = [
  { value: 'single_choice', label: 'Trắc nghiệm 1 đáp án' },
  { value: 'multiple_choice', label: 'Trắc nghiệm nhiều đáp án' },
  { value: 'true_false', label: 'Đúng / Sai' },
  { value: 'drag_drop', label: 'Kéo thả sắp xếp' },
  { value: 'sorting', label: 'Sắp xếp thứ tự' },
  { value: 'image_choice', label: 'Chọn theo hình ảnh' },
  { value: 'matching', label: 'Câu nối (chữ/ảnh)' },
  { value: 'fill_blank', label: 'Điền vào chỗ trống' },
  { value: 'counting', label: 'Đếm và điền số' },
  { value: 'coloring', label: 'Tô màu' },
  { value: 'trace_number', label: 'Tô số (viết tay)' },
];

const KEY_LABELS = ['A', 'B', 'C', 'D', 'E'];

async function uploadFile(file: File, endpoint: string, folder: string): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('bhh_token') : null;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  const res = await fetch(`${BASE_URL}/api/quizzes/${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (!res.ok) throw new Error('Upload thất bại');
  const data = await res.json();
  return data.url as string;
}

async function uploadAudio(file: File, folder: string): Promise<string> {
  return uploadFile(file, 'upload-audio', folder);
}

function AudioUploader({
  label,
  value,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const url = await uploadAudio(file, folder);
      onChange(url);
    } catch {
      setError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        {value ? (
          <>
            <audio src={value} controls className="h-8 flex-1 min-w-0" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="shrink-0 p-1 text-gray-400 hover:text-red-500"
              title="Xóa audio"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => ref.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-60"
          >
            <Upload size={13} />
            {uploading ? 'Đang upload...' : 'Tải lên audio'}
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function ImageUploader({
  label,
  value,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const url = await uploadFile(file, 'upload-image', folder);
      onChange(url);
    } catch {
      setError('Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-1.5">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="mt-1">
        {value ? (
          <div className="relative inline-block">
            <Image
              src={value}
              alt="preview"
              width={160}
              height={120}
              className="rounded-lg border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => ref.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-60"
          >
            <ImageIcon size={13} />
            {uploading ? 'Đang upload...' : 'Tải lên ảnh'}
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

interface Props {
  title: string;
  lessons: Lesson[];
  initial: QuizFormData;
  saving: boolean;
  error: string;
  onSubmit: (data: QuizFormData) => void;
}

export default function QuizForm({ title, lessons, initial, saving, error, onSubmit }: Props) {
  const [form, setForm] = useState<QuizFormData>(initial);

  const set = <K extends keyof QuizFormData>(key: K, val: QuizFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addOption = () => {
    const key = KEY_LABELS[form.options.length] ?? String(form.options.length + 1);
    set('options', [...form.options, { key, text: '', audioUrl: '' }]);
  };

  const removeOption = (idx: number) => {
    const removed = form.options[idx];
    set('options', form.options.filter((_, i) => i !== idx));
    set('correctKeys', form.correctKeys.filter((k) => k !== removed.key));
  };

  const updateOption = (idx: number, patch: Partial<{ text: string; audioUrl: string; pair: string; imageUrl: string; pairImageUrl: string }>) => {
    const opts = [...form.options];
    opts[idx] = { ...opts[idx], ...patch };
    set('options', opts);
  };

  const toggleCorrect = (key: string) => {
    if (
      form.questionType === 'single_choice' ||
      form.questionType === 'image_choice' ||
      form.questionType === 'drag_drop'
    ) {
      set('correctKeys', [key]);
    } else {
      if (form.correctKeys.includes(key)) {
        set('correctKeys', form.correctKeys.filter((k) => k !== key));
      } else {
        set('correctKeys', [...form.correctKeys, key]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isChoiceType = ['single_choice', 'multiple_choice', 'image_choice', 'drag_drop', 'sorting'].includes(
    form.questionType,
  );
  const isTrueFalse = form.questionType === 'true_false';
  const isMatching = form.questionType === 'matching';
  const isFillBlank = form.questionType === 'fill_blank';
  const isTraceNumber = form.questionType === 'trace_number';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/quizzes" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 max-w-2xl"
      >
        {/* Bài học */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bài học <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.lessonId}
            onChange={(e) => set('lessonId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn bài học --</option>
            {lessons.map((l) => (
              <option key={l.id} value={String(l.id)}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        {/* Nội dung câu hỏi + audio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung câu hỏi <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={form.questionText}
            onChange={(e) => set('questionText', e.target.value)}
            placeholder="Nhập nội dung câu hỏi..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <AudioUploader
            label="Audio đọc câu hỏi"
            value={form.questionAudioUrl}
            folder="quizzes/questions"
            onChange={(url) => set('questionAudioUrl', url)}
          />
        </div>

        {/* Loại câu hỏi + ảnh */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại câu hỏi</label>
            <select
              value={form.questionType}
              onChange={(e) => {
                set('questionType', e.target.value);
                set('correctKeys', []);
                if (e.target.value === 'true_false' || e.target.value === 'matching') set('options', []);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ</label>
            <select value={form.difficultyLevel} onChange={(e) => set('difficultyLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Nâng cao</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bài tập số</label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                const isActive = form.exerciseNumber === String(n);
                const diffColors: Record<string, string> = {
                  easy: '#1FA8B4', medium: '#D85C4A', hard: '#C4892A',
                };
                const color = diffColors[form.difficultyLevel] || '#6b7280';
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('exerciseNumber', String(n))}
                    className="w-8 h-8 rounded-lg text-sm font-bold border-2 transition-all"
                    style={{
                      background: isActive ? color : 'transparent',
                      borderColor: isActive ? color : '#e5e7eb',
                      color: isActive ? '#fff' : '#6b7280',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ảnh minh họa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh minh họa câu hỏi</label>
          <MediaPicker
            value={form.questionImageUrl}
            folder="quizzes/images"
            onChange={(url) => set('questionImageUrl', url)}
          />
        </div>

        {/* Đáp án — Đúng/Sai */}
        {isTrueFalse && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng</label>
            <div className="flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => set('trueFalseAnswer', val)}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium text-sm transition-colors ${
                    form.trueFalseAnswer === val
                      ? val
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {val ? '✅ Đúng' : '❌ Sai'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Đáp án — Trắc nghiệm / Kéo thả */}
        {isChoiceType && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Các đáp án
                {form.questionType === 'multiple_choice' && (
                  <span className="ml-1 text-xs text-gray-400">(chọn nhiều đáp án đúng)</span>
                )}
                {form.questionType === 'drag_drop' && (
                  <span className="ml-1 text-xs text-gray-400">(chọn thứ tự đúng)</span>
                )}
              </label>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Thêm đáp án
              </button>
            </div>

            {form.options.length === 0 && (
              <div className="text-sm text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
                Nhấn &quot;Thêm đáp án&quot; để bắt đầu
              </div>
            )}

            <div className="space-y-2">
              {form.options.map((opt, idx) => {
                const isCorrect = form.correctKeys.includes(opt.key);
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border transition-colors ${
                      isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCorrect(opt.key)}
                        className={`shrink-0 w-8 h-8 rounded-full border-2 font-bold text-xs transition-colors ${
                          isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 text-gray-400 hover:border-blue-400'
                        }`}
                        title={isCorrect ? 'Bỏ chọn đáp án đúng' : 'Đánh dấu đáp án đúng'}
                      >
                        {opt.key}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        placeholder={`Đáp án ${opt.key}`}
                        onChange={(e) => updateOption(idx, { text: e.target.value })}
                        className="flex-1 px-2 py-1.5 text-sm border-none bg-transparent focus:outline-none"
                      />
                      {isCorrect && (
                        <span className="text-xs text-green-600 font-medium shrink-0">✓ Đúng</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="shrink-0 p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {/* Ảnh + Audio đáp án */}
                    <div className="pl-11 mt-1 flex flex-wrap items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">Ảnh đáp án {opt.key}</span>
                        <MediaPicker
                          value={opt.imageUrl ?? ''}
                          folder="quizzes/answers"
                          onChange={(url) => updateOption(idx, { imageUrl: url })}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <AudioUploader
                          label={
                            <span className="flex items-center gap-1">
                              <Volume2 size={11} /> Audio đáp án {opt.key}
                            </span> as unknown as string
                          }
                          value={opt.audioUrl ?? ''}
                          folder="quizzes/answers"
                          onChange={(url) => updateOption(idx, { audioUrl: url })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {isChoiceType && form.correctKeys.length === 0 && form.options.length > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠ Nhấn vào ký hiệu A/B/C... để chọn đáp án đúng
              </p>
            )}
          </div>
        )}

        {/* Câu nối */}
        {isMatching && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Các cặp câu nối
                <span className="ml-1 text-xs text-gray-400">(cột trái — cột phải)</span>
              </label>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Thêm cặp
              </button>
            </div>
            {form.options.length === 0 && (
              <div className="text-sm text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
                Nhấn &quot;Thêm cặp&quot; để bắt đầu
              </div>
            )}
            <div className="space-y-3">
              {form.options.map((opt, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <span className="w-7 h-7 mt-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {opt.key}
                    </span>
                    {/* Cột trái */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={opt.text}
                        placeholder="Cột trái..."
                        onChange={(e) => updateOption(idx, { text: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <MediaPicker
                        value={opt.imageUrl ?? ''}
                        folder="quizzes/matching"
                        onChange={(url) => updateOption(idx, { imageUrl: url })}
                      />
                    </div>
                    <span className="text-gray-400 text-lg shrink-0 mt-1.5">↔</span>
                    {/* Cột phải */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={opt.pair ?? ''}
                        placeholder="Cột phải..."
                        onChange={(e) => updateOption(idx, { pair: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <MediaPicker
                        value={opt.pairImageUrl ?? ''}
                        folder="quizzes/matching"
                        onChange={(url) => updateOption(idx, { pairImageUrl: url })}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="shrink-0 p-1 text-gray-400 hover:text-red-500 mt-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Điền vào chỗ trống */}
        {isFillBlank && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 space-y-1.5">
            <p className="font-medium">Cú pháp điền chỗ trống:</p>
            <p>• Dùng <code className="bg-blue-100 px-1 rounded">[b1]</code>, <code className="bg-blue-100 px-1 rounded">[b2]</code>... trong câu hỏi để đánh dấu ô trống</p>
            <p>• Ví dụ: <code className="bg-blue-100 px-1 rounded">3 [b1] 5 = 8</code></p>
            <p>• Đáp án đúng nhập vào ô <strong>Đáp án đúng (JSON)</strong> bên dưới dạng: <code className="bg-blue-100 px-1 rounded">{'{\"b1\":\"+\"}'}</code></p>
            <div className="mt-2">
              <label className="block text-xs font-medium text-blue-800 mb-1">Đáp án đúng (JSON)</label>
              <input
                type="text"
                value={typeof form.correctKeys[0] === 'string' ? form.correctKeys[0] : ''}
                placeholder='{"b1": "+", "b2": "="}'
                onChange={(e) => set('correctKeys', [e.target.value])}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Tô số */}
        {isTraceNumber && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-2">
            <p className="font-medium">Dạng tô số (viết tay)</p>
            <p>Trẻ sẽ dùng ngón tay tô theo số. Số cần tô lấy từ câu hỏi hoặc đáp án đúng.</p>
            <div>
              <label className="block text-xs font-medium text-green-800 mb-1">Số cần tô</label>
              <input
                type="number"
                min={0}
                max={99}
                value={typeof form.correctKeys[0] === 'string' ? form.correctKeys[0] : ''}
                placeholder="Ví dụ: 5"
                onChange={(e) => set('correctKeys', [e.target.value])}
                className="w-32 px-3 py-2 border border-green-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Giải thích + audio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giải thích đáp án</label>
          <textarea
            rows={2}
            value={form.explanation}
            onChange={(e) => set('explanation', e.target.value)}
            placeholder="Giải thích tại sao đây là đáp án đúng..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <AudioUploader
            label="Audio giải thích đáp án"
            value={form.explanationAudioUrl}
            folder="quizzes/explanations"
            onChange={(url) => set('explanationAudioUrl', url)}
          />
        </div>

        {/* Điểm & Thứ tự */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm</label>
            <input
              type="number"
              min={0}
              value={form.points}
              onChange={(e) => set('points', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <input
              type="number"
              min={1}
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">Kích hoạt</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <Link
            href="/admin/quizzes"
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formToPayload(form: QuizFormData) {
  let optionsJson: { key: string; text: string; audioUrl?: string; pair?: string; imageUrl?: string; pairImageUrl?: string }[] | undefined;
  let correctAnswerJson: unknown;

  if (form.questionType === 'true_false') {
    correctAnswerJson = form.trueFalseAnswer;
  } else if (form.questionType === 'fill_blank') {
    // correctKeys[0] is raw JSON string like {"b1":"+"}
    try { correctAnswerJson = JSON.parse(form.correctKeys[0] ?? '{}'); } catch { correctAnswerJson = {}; }
  } else if (form.questionType === 'trace_number') {
    correctAnswerJson = { number: form.correctKeys[0] ?? '' };
  } else if (form.questionType === 'matching') {
    optionsJson = form.options.length > 0
      ? form.options.map((o) => ({
          key: o.key,
          text: o.text,
          pair: o.pair ?? '',
          ...(o.imageUrl ? { imageUrl: o.imageUrl } : {}),
          ...(o.pairImageUrl ? { pairImageUrl: o.pairImageUrl } : {}),
        }))
      : undefined;
    // correctAnswerJson: { A: 'pair of A', B: 'pair of B', ... }
    correctAnswerJson = form.options.reduce<Record<string, string>>((acc, o) => {
      acc[o.key] = o.pair ?? '';
      return acc;
    }, {});
  } else {
    optionsJson =
      form.options.length > 0
        ? form.options.map((o) => ({
            key: o.key,
            text: o.text,
            ...(o.audioUrl ? { audioUrl: o.audioUrl } : {}),
            ...(o.imageUrl ? { imageUrl: o.imageUrl } : {}),
          }))
        : undefined;
    correctAnswerJson =
      form.questionType === 'multiple_choice'
        ? form.correctKeys
        : form.correctKeys[0] ?? null;
  }

  return {
    lessonId: form.lessonId,
    questionText: form.questionText,
    questionType: form.questionType,
    difficultyLevel: form.difficultyLevel,
    exerciseNumber: form.exerciseNumber ? Number(form.exerciseNumber) : undefined,
    questionImageUrl: form.questionImageUrl || undefined,
    questionAudioUrl: form.questionAudioUrl || undefined,
    optionsJson,
    correctAnswerJson,
    explanation: form.explanation || undefined,
    explanationAudioUrl: form.explanationAudioUrl || undefined,
    points: form.points ? Number(form.points) : undefined,
    sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
    isActive: form.isActive,
  };
}

export function payloadToForm(quiz: {
  lessonId?: string | number;
  questionText?: string;
  questionType?: string;
  difficultyLevel?: string;
  exerciseNumber?: number;
  questionImageUrl?: string;
  questionAudioUrl?: string;
  optionsJson?: unknown;
  correctAnswerJson?: unknown;
  explanation?: string;
  explanationAudioUrl?: string;
  points?: number;
  sortOrder?: number;
  isActive?: boolean;
}): QuizFormData {
  const opts = Array.isArray(quiz.optionsJson)
    ? (quiz.optionsJson as { key: string; text: string; audioUrl?: string; pair?: string; imageUrl?: string; pairImageUrl?: string }[])
    : [];
  const correct = quiz.correctAnswerJson;
  const isMatching = quiz.questionType === 'matching';
  let correctKeys: string[] = [];
  if (quiz.questionType === 'fill_blank') {
    correctKeys = [JSON.stringify(correct ?? {})];
  } else if (quiz.questionType === 'trace_number') {
    const n = (correct as { number?: string })?.number ?? String(correct ?? '');
    correctKeys = [n];
  } else {
    correctKeys = Array.isArray(correct)
      ? (correct as string[])
      : typeof correct === 'string'
      ? [correct]
      : [];
  }

  return {
    lessonId: String(quiz.lessonId ?? ''),
    questionText: quiz.questionText ?? '',
    questionType: quiz.questionType ?? 'single_choice',
    difficultyLevel: quiz.difficultyLevel ?? 'easy',
    exerciseNumber: quiz.exerciseNumber != null ? String(quiz.exerciseNumber) : '1',
    questionImageUrl: quiz.questionImageUrl ?? '',
    questionAudioUrl: quiz.questionAudioUrl ?? '',
    explanation: quiz.explanation ?? '',
    explanationAudioUrl: quiz.explanationAudioUrl ?? '',
    points: quiz.points != null ? String(quiz.points) : '10',
    sortOrder: quiz.sortOrder != null ? String(quiz.sortOrder) : '1',
    isActive: quiz.isActive ?? true,
    options: opts.map((o) => ({
      key: o.key,
      text: o.text,
      audioUrl: o.audioUrl ?? '',
      ...(isMatching ? { pair: o.pair ?? '', imageUrl: o.imageUrl ?? '', pairImageUrl: o.pairImageUrl ?? '' } : {}),
    })),
    correctKeys,
    trueFalseAnswer: correct === true || correct === 'true',
  };
}
